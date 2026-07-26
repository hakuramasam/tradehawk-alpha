import { OpenRouter } from '@openrouter/agent';
import type { Item } from '@openrouter/agent';
import { stepCountIs, maxCost } from '@openrouter/agent/stop-conditions';
import type { AgentConfig } from './config.js';
import { buildTools } from './tools/index.js';
import { compactMessages } from './compaction.js';

export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

export type AgentEvent =
  | { type: 'text'; delta: string }
  | { type: 'tool_call'; name: string; callId: string; args: Record<string, unknown> }
  | { type: 'tool_result'; name: string; callId: string; output: string }
  | { type: 'reasoning'; delta: string };

export interface ApprovalRequest {
  callId: string;
  name: string;
  args: Record<string, unknown>;
}

export type ApprovalHandler = (
  requests: ApprovalRequest[],
) => Promise<{ approved: string[]; rejected: string[] }>;

export interface RunOptions {
  onEvent?: (event: AgentEvent) => void;
  onApproval?: ApprovalHandler;
  signal?: AbortSignal;
}

export async function runAgent(
  config: AgentConfig,
  input: string | ChatMessage[],
  options?: RunOptions,
) {
  const client = new OpenRouter({ apiKey: config.apiKey });
  const tools = buildTools(config);

  let resolvedInput = input;
  if (Array.isArray(resolvedInput) && config.compaction.enabled) {
    resolvedInput = (await compactMessages(client, resolvedInput, {
      threshold: config.compaction.threshold,
      keepRecent: config.compaction.keepRecent,
      model: config.compaction.model,
    })) as ChatMessage[];
  }

  // In-memory conversation state so approval pauses can be resumed.
  let state: any = null;
  const stateAccessor = {
    load: async () => state,
    save: async (next: any) => {
      state = next;
    },
  };

  const baseParams = {
    model: config.model,
    instructions: config.systemPrompt.replace('{cwd}', process.cwd()),
    input: resolvedInput as string | Item[],
    tools,
    stopWhen: [stepCountIs(config.maxSteps), maxCost(config.maxCost)],
    state: stateAccessor,
  } as any;

  const consume = async (result: any) => {
    if (!options?.onEvent) return;

    // Track text length PER message item id: a multi-step run emits several
    // message items, each growing 0 -> final, so a single global cursor
    // would slice mid-string on the second message.
    const textByItem = new Map<string, number>();
    const callNames = new Map<string, string>();

    for await (const item of result.getItemsStream()) {
      if (options.signal?.aborted) break;
      if (item.type === 'message') {
        const text =
          item.content
            ?.filter((c: any): c is { type: 'output_text'; text: string } => 'text' in c)
            .map((c: any) => c.text)
            .join('') ?? '';
        const prev = textByItem.get(item.id) ?? 0;
        if (text.length > prev) {
          options.onEvent({ type: 'text', delta: text.slice(prev) });
          textByItem.set(item.id, text.length);
        }
      } else if (item.type === 'function_call') {
        callNames.set(item.callId, item.name);
        if (item.status === 'completed') {
          let args: Record<string, unknown> = {};
          try {
            args = item.arguments ? JSON.parse(item.arguments) : {};
          } catch {
            args = {};
          }
          options.onEvent({ type: 'tool_call', name: item.name, callId: item.callId, args });
        }
      } else if (item.type === 'function_call_output') {
        const out = typeof item.output === 'string' ? item.output : JSON.stringify(item.output);
        options.onEvent({
          type: 'tool_result',
          name: callNames.get(item.callId) ?? 'unknown',
          callId: item.callId,
          output: out.length > 200 ? out.slice(0, 200) + '…' : out,
        });
      } else if (item.type === 'reasoning') {
        const text = item.summary?.map((s: { text: string }) => s.text).join('') ?? '';
        if (text) options.onEvent({ type: 'reasoning', delta: text });
      }
    }
  };

  let result: any = client.callModel(baseParams);
  let response: any;

  // Approval loop: pause, ask the user, resume with decisions.
  for (let round = 0; round < 25; round++) {
    await consume(result);
    response = await result.getResponse();

    if (options?.signal?.aborted) break;
    if (!options?.onApproval) break;
    if (!(await result.requiresApproval())) break;

    const pending = await result.getPendingToolCalls();
    if (!pending.length) break;

    const requests: ApprovalRequest[] = pending.map((call: any) => ({
      callId: call.callId ?? call.id,
      name: call.name ?? call.toolName ?? 'unknown',
      args: (call.input ?? call.arguments ?? {}) as Record<string, unknown>,
    }));

    const decision = await options.onApproval(requests);
    result = client.callModel({
      ...baseParams,
      approveToolCalls: decision.approved,
      rejectToolCalls: decision.rejected,
    });
  }

  return {
    text: response?.outputText ?? '',
    usage: response?.usage,
    output: response?.output,
  };
}

export async function runAgentWithRetry(
  config: AgentConfig,
  input: string | ChatMessage[],
  options?: RunOptions & { maxRetries?: number },
) {
  const max = options?.maxRetries ?? 3;
  for (let attempt = 0; attempt <= max; attempt++) {
    try {
      return await runAgent(config, input, options);
    } catch (err: any) {
      const status = err?.status ?? err?.statusCode;
      if (!(status === 429 || (status >= 500 && status < 600)) || attempt === max) throw err;
      await new Promise((r) => setTimeout(r, Math.min(1000 * 2 ** attempt, 30000)));
    }
  }
  throw new Error('Unreachable');
}