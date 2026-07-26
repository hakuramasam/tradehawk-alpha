import type { AgentEvent } from './agent.js';
import type { DisplayConfig } from './config.js';

const RESET = '\x1b[0m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const GRAY = '\x1b[90m';
const MAGENTA = '\x1b[35m';

type ToolFormatter = (name: string, args: Record<string, unknown>) => string;

function trunc(s: string, max = 50): string {
  return s.length > max ? s.slice(0, max) + '…' : s;
}

function plural(n: number, noun: string): string {
  if (n === 1) return `1 ${noun}`;
  if (noun.endsWith('y')) return `${n} ${noun.slice(0, -1)}ies`;
  return `${n} ${noun}s`;
}

const DEFAULT_FORMATTERS: Record<string, ToolFormatter> = {
  shell: (_n, a) => `command=${trunc(String(a.command ?? ''))}`,
  file_read: (_n, a) => `path=${trunc(String(a.path ?? ''))}`,
  file_write: (_n, a) => `path=${trunc(String(a.path ?? ''))}`,
  file_edit: (_n, a) => `path=${trunc(String(a.path ?? ''))}`,
  glob: (_n, a) => `pattern=${trunc(String(a.pattern ?? ''))}`,
  grep: (_n, a) => `pattern=${trunc(String(a.pattern ?? ''))}`,
  list_dir: (_n, a) => `path=${trunc(String(a.path ?? ''))}`,
  web_search: (_n, a) => `query=${trunc(String(a.query ?? ''))}`,
  web_fetch: (_n, a) => `url=${trunc(String(a.url ?? ''))}`,
  sub_agent: (_n, a) => `task=${trunc(String(a.task ?? ''))}`,
  plan: (_n, a) => `${(a.items as unknown[] | undefined)?.length ?? 0} steps`,
};

const TOOL_LABELS: Record<string, { past: string; noun: string }> = {
  shell: { past: 'Ran', noun: 'shell command' },
  file_read: { past: 'Read', noun: 'file' },
  file_write: { past: 'Wrote', noun: 'file' },
  file_edit: { past: 'Edited', noun: 'file' },
  glob: { past: 'Explored', noun: 'pattern' },
  grep: { past: 'Searched', noun: 'pattern' },
  list_dir: { past: 'Listed', noun: 'directory' },
  web_search: { past: 'Fetched', noun: 'search' },
  web_fetch: { past: 'Fetched', noun: 'page' },
  sub_agent: { past: 'Delegated', noun: 'task' },
  plan: { past: 'Planned', noun: 'plan' },
};

export interface RendererOptions {
  display: DisplayConfig;
  toolFormatters?: Record<string, ToolFormatter>;
  toolColors?: Record<string, string>;
}

type Pending = {
  name: string;
  callId: string;
  args: Record<string, unknown>;
  output?: string;
};

export class TuiRenderer {
  private display: DisplayConfig;
  private formatters: Record<string, ToolFormatter>;
  private toolColors: Record<string, string>;
  private toolStart = new Map<string, number>();
  private streaming = false;

  private groupedPending: Pending[] = [];
  private groupedCategory = '';
  private minimalBatch = new Map<string, number>();

  constructor(opts: RendererOptions) {
    this.display = opts.display;
    this.formatters = { ...DEFAULT_FORMATTERS, ...opts.toolFormatters };
    this.toolColors = { shell: RED, file_write: YELLOW, web_search: MAGENTA, ...opts.toolColors };
  }

  handle(event: AgentEvent): void {
    switch (event.type) {
      case 'text':
        return this.renderText(event.delta);
      case 'tool_call':
        return this.renderToolCall(event.name, event.callId, event.args);
      case 'tool_result':
        return this.renderToolResult(event.name, event.callId, event.output);
      case 'reasoning':
        return this.renderReasoning(event.delta);
    }
  }

  private renderText(delta: string): void {
    this.flushGrouped();
    this.flushMinimal();
    this.streaming = true;
    process.stdout.write(delta);
  }

  private renderToolCall(name: string, callId: string, args: Record<string, unknown>): void {
    if (this.display.toolDisplay === 'hidden') return;
    this.endStreaming();
    this.toolStart.set(callId, Date.now());

    if (this.display.toolDisplay === 'emoji') {
      const color = this.toolColors[name] ?? YELLOW;
      const argStr = (this.formatters[name] ?? this.defaultFormatter)(name, args);
      console.log(`  ${color}⚡${RESET} ${DIM}${name}${argStr ? ' ' + argStr : ''}${RESET}`);
    } else if (this.display.toolDisplay === 'grouped') {
      const category = TOOL_LABELS[name]?.past ?? name;
      if (category !== this.groupedCategory) {
        this.flushGrouped();
        this.groupedCategory = category;
      }
      this.groupedPending.push({ name, callId, args });
    } else if (this.display.toolDisplay === 'minimal') {
      this.minimalBatch.set(name, (this.minimalBatch.get(name) ?? 0) + 1);
    }
  }

  private renderToolResult(name: string, callId: string, output: string): void {
    if (this.display.toolDisplay === 'hidden') return;
    const ms = Date.now() - (this.toolStart.get(callId) ?? Date.now());

    if (this.display.toolDisplay === 'emoji') {
      console.log(`  ${GREEN}✓${RESET} ${DIM}${name} (${(ms / 1000).toFixed(1)}s)${RESET}`);
    } else if (this.display.toolDisplay === 'grouped') {
      const pending = this.groupedPending.find((p) => p.callId === callId);
      if (pending) pending.output = output;
    }
  }

  private renderReasoning(delta: string): void {
    if (!this.display.reasoning) return;
    this.flushMinimal();
    this.endStreaming();
    process.stdout.write(`${DIM}${delta}${RESET}`);
  }

  endStreaming(): void {
    if (this.streaming) {
      process.stdout.write(RESET + '\n');
      this.streaming = false;
    }
  }

  endTurn(): void {
    this.flushGrouped();
    this.flushMinimal();
    this.endStreaming();
  }

  private flushGrouped(): void {
    if (this.groupedPending.length === 0) return;

    const first = this.groupedPending[0];
    const label = TOOL_LABELS[first.name]?.past ?? first.name;
    const formatter = this.formatters[first.name] ?? this.defaultFormatter;

    if (this.groupedPending.length === 1) {
      console.log(`${GREEN}●${RESET} ${BOLD}${label}${RESET} ${formatter(first.name, first.args)}`);
      if (first.output) {
        console.log(`  └ ${GRAY}${trunc(first.output.split('\n')[0], 70)}${RESET}`);
      }
    } else {
      console.log(`${GREEN}●${RESET} ${BOLD}${label}${RESET}`);
      for (const pending of this.groupedPending) {
        const argStr = (this.formatters[pending.name] ?? this.defaultFormatter)(
          pending.name,
          pending.args,
        );
        const isLast = pending === this.groupedPending[this.groupedPending.length - 1];
        const branch = isLast ? '└' : '├';
        if (pending.output) {
          console.log(
            `  ${branch} ${DIM}${argStr}${RESET} ${GRAY}${trunc(pending.output.split('\n')[0], 50)}${RESET}`,
          );
        } else {
          console.log(`  ${branch} ${DIM}${argStr}${RESET}`);
        }
      }
    }
    console.log();

    this.groupedPending = [];
    this.groupedCategory = '';
  }

  private flushMinimal(): void {
    if (this.minimalBatch.size === 0) return;

    const parts: string[] = [];
    for (const [name, count] of this.minimalBatch) {
      const label = TOOL_LABELS[name];
      parts.push(label ? `${label.past.toLowerCase()} ${plural(count, label.noun)}` : plural(count, name));
    }
    console.log(`  ${GRAY}${parts.join(', ')}${RESET}`);
    this.minimalBatch.clear();
  }

  private defaultFormatter: ToolFormatter = (_name, args) => {
    const key = Object.keys(args)[0];
    return key ? `${key}=${trunc(String(args[key]))}` : '';
  };
}