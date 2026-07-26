import { OpenRouter } from '@openrouter/agent';

type Message = { role: string; content: string; [key: string]: unknown };

export interface CompactionConfig {
  /** Max messages before triggering compaction */
  threshold: number;
  /** Number of recent messages to preserve verbatim */
  keepRecent: number;
  /** Model to use for summarization */
  model: string;
}

const DEFAULTS: CompactionConfig = {
  threshold: 40,
  keepRecent: 10,
  model: 'openai/gpt-4.1-mini',
};

/**
 * Walk the initial cut point forward until it no longer splits a tool turn
 * (assistant-with-calls -> tool results -> assistant text).
 */
function findSafeBoundary(messages: Message[], cut: number): number {
  while (cut < messages.length) {
    const msg = messages[cut];

    if (msg.role === 'tool') {
      cut++;
      continue;
    }

    const toolCalls = (msg as { tool_calls?: unknown[] }).tool_calls;
    if (msg.role === 'assistant' && Array.isArray(toolCalls) && toolCalls.length > 0) {
      cut++;
      while (cut < messages.length && messages[cut].role === 'tool') cut++;
      continue;
    }

    break;
  }
  return cut;
}

export async function compactMessages(
  client: OpenRouter,
  messages: Message[],
  config: Partial<CompactionConfig> = {},
): Promise<Message[]> {
  const opts = { ...DEFAULTS, ...config };

  if (messages.length <= opts.threshold) return messages;

  const idealCut = messages.length - opts.keepRecent;
  const safeCut = findSafeBoundary(messages, idealCut);
  if (safeCut >= messages.length) return messages;

  const toSummarize = messages.slice(0, safeCut);
  const toKeep = messages.slice(safeCut);

  const summaryResult = client.callModel({
    model: opts.model,
    instructions:
      'Summarize the following conversation concisely. Preserve key facts, decisions, token tickers and contract addresses, file paths mentioned, and tool results. Output only the summary.',
    input: toSummarize.map((m) => `${m.role}: ${m.content}`).join('\n\n'),
  });

  const summary = await summaryResult.getText();

  return [{ role: 'system', content: `[Conversation summary]\n${summary}` }, ...toKeep];
}