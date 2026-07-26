#!/usr/bin/env node
import { createInterface } from 'readline/promises';
import { stdin, stdout } from 'process';
import { loadConfig, type AgentConfig } from './config.js';
import { runAgentWithRetry, type ChatMessage, type ApprovalRequest } from './agent.js';
import { TuiRenderer } from './renderer.js';
import { Loader } from './loader.js';
import { printBanner } from './banner.js';
import { handleCommand } from './commands.js';
import { initSessionDir, newSessionPath, saveMessage } from './session.js';
import { resetPlan } from './tools/plan.js';

const RESET = '\x1b[0m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const GOLD = '\x1b[38;5;220m';
const RED = '\x1b[38;5;203m';

function prompt(style: AgentConfig['display']['inputStyle']): string {
  switch (style) {
    case 'bordered':
      stdout.write(`${DIM}┌─────────────────────────────────────────────${RESET}\n`);
      return `${DIM}│${RESET} ${GOLD}❯${RESET} `;
    case 'plain':
      return `${GOLD}>${RESET} `;
    case 'block':
    default:
      return `\n${GOLD}${BOLD}❯${RESET} `;
  }
}

function summarizeArgs(args: Record<string, unknown>): string {
  const entries = Object.entries(args).slice(0, 3);
  return entries
    .map(([k, v]) => {
      const s = typeof v === 'string' ? v : JSON.stringify(v);
      return `${k}=${s.length > 120 ? s.slice(0, 120) + '…' : s}`;
    })
    .join('  ');
}

async function main() {
  let config!: AgentConfig;
  try {
    config = loadConfig();
  } catch (err: any) {
    console.error(`${RED}${err.message}${RESET}`);
    console.error(`${DIM}Set OPENROUTER_API_KEY in agent/.env or your shell.${RESET}`);
    process.exit(1);
  }

  if (config.showBanner) printBanner(config.model);

  initSessionDir(config.sessionDir);
  const sessionPath = newSessionPath(config.sessionDir);

  const rl = createInterface({ input: stdin, output: stdout });
  let messages: ChatMessage[] = [];
  let running = true;

  const ctx = {
    config,
    messages,
    sessionPath,
    exit: () => {
      running = false;
    },
    clear: () => {
      messages.length = 0;
      resetPlan();
    },
    setModel: (model: string) => {
      config.model = model;
    },
  };

  console.log(`${DIM}Type /help for commands, /exit to quit.${RESET}`);

  while (running) {
    let input: string;
    try {
      input = (await rl.question(prompt(config.display.inputStyle))).trim();
    } catch {
      break;
    }
    if (!input) continue;

    if (config.slashCommands && (await handleCommand(input, ctx))) continue;

    messages.push({ role: 'user', content: input });
    saveMessage(sessionPath, { role: 'user', content: input });

    const renderer = new TuiRenderer({ display: config.display });
    const loader = new Loader(config.display.loader);
    const abort = new AbortController();
    const onSigint = () => abort.abort();
    process.on('SIGINT', onSigint);

    let firstEvent = true;
    loader.start();

    try {
      const result = await runAgentWithRetry(config, messages, {
        signal: abort.signal,
        onEvent: (event) => {
          if (firstEvent) {
            loader.stop();
            firstEvent = false;
          }
          renderer.handle(event);
        },
        onApproval: async (requests: ApprovalRequest[]) => {
          loader.stop();
          renderer.endTurn();
          const approved: string[] = [];
          const rejected: string[] = [];
          for (const req of requests) {
            console.log(`\n${GOLD}Approval required${RESET} ${BOLD}${req.name}${RESET}`);
            console.log(`  ${DIM}${summarizeArgs(req.args)}${RESET}`);
            const answer = (await rl.question(`  ${GOLD}Allow? [y/N]${RESET} `)).trim().toLowerCase();
            if (answer === 'y' || answer === 'yes') approved.push(req.callId);
            else rejected.push(req.callId);
          }
          console.log('');
          firstEvent = true;
          loader.start();
          return { approved, rejected };
        },
      });

      loader.stop();
      renderer.endTurn();

      if (result.text) {
        messages.push({ role: 'assistant', content: result.text });
        saveMessage(sessionPath, { role: 'assistant', content: result.text });
      }

      const usage = result.usage as { cost?: number; total_tokens?: number } | undefined;
      if (usage?.cost != null) {
        console.log(
          `${DIM}${usage.total_tokens ?? '?'} tokens · $${usage.cost.toFixed(4)}${RESET}`,
        );
      }
    } catch (err: any) {
      loader.stop();
      renderer.endTurn();
      if (abort.signal.aborted) console.log(`${DIM}Interrupted.${RESET}`);
      else console.error(`${RED}Error:${RESET} ${err.message}`);
    } finally {
      process.off('SIGINT', onSigint);
    }
  }

  rl.close();
  console.log(`${DIM}Session saved to ${sessionPath}${RESET}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});