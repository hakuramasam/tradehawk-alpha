import type { AgentConfig } from './config.js';
import type { ChatMessage } from './agent.js';
import { listSessions } from './session.js';

export interface CommandContext {
  config: AgentConfig;
  messages: ChatMessage[];
  sessionPath: string;
  exit: () => void;
  clear: () => void;
  setModel: (model: string) => void;
}

export interface SlashCommand {
  name: string;
  description: string;
  execute: (args: string, ctx: CommandContext) => void | Promise<void>;
}

const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const GOLD = '\x1b[38;5;220m';

export const commands: SlashCommand[] = [
  {
    name: 'help',
    description: 'Show available commands',
    execute: () => {
      console.log(`\n${GOLD}Commands${RESET}`);
      for (const c of commands) {
        console.log(`  ${GOLD}/${c.name.padEnd(10)}${RESET}${DIM}${c.description}${RESET}`);
      }
      console.log('');
    },
  },
  {
    name: 'clear',
    description: 'Clear the conversation history',
    execute: (_args, ctx) => {
      ctx.clear();
      console.log(`${DIM}Conversation cleared.${RESET}\n`);
    },
  },
  {
    name: 'model',
    description: 'Show or change the model (/model <id>)',
    execute: (args, ctx) => {
      if (!args.trim()) {
        console.log(`${DIM}Current model:${RESET} ${GOLD}${ctx.config.model}${RESET}\n`);
        return;
      }
      ctx.setModel(args.trim());
      console.log(`${DIM}Model set to${RESET} ${GOLD}${args.trim()}${RESET}\n`);
    },
  },
  {
    name: 'sessions',
    description: 'List saved sessions',
    execute: (_args, ctx) => {
      const sessions = listSessions(ctx.config.sessionDir);
      if (!sessions.length) {
        console.log(`${DIM}No saved sessions.${RESET}\n`);
        return;
      }
      console.log(`\n${GOLD}Sessions${RESET}`);
      for (const s of sessions) console.log(`  ${DIM}${s}${RESET}`);
      console.log('');
    },
  },
  {
    name: 'history',
    description: 'Show the current conversation',
    execute: (_args, ctx) => {
      if (!ctx.messages.length) {
        console.log(`${DIM}No messages yet.${RESET}\n`);
        return;
      }
      console.log('');
      for (const m of ctx.messages) {
        const preview = m.content.replace(/\n/g, ' ').slice(0, 100);
        console.log(`  ${GOLD}${m.role.padEnd(9)}${RESET}${DIM}${preview}${RESET}`);
      }
      console.log('');
    },
  },
  {
    name: 'exit',
    description: 'Exit the agent',
    execute: (_args, ctx) => ctx.exit(),
  },
];

export async function handleCommand(input: string, ctx: CommandContext): Promise<boolean> {
  if (!input.startsWith('/')) return false;
  const [name, ...rest] = input.slice(1).split(' ');
  const command = commands.find((c) => c.name === name);
  if (!command) {
    console.log(`${DIM}Unknown command: /${name} — try /help${RESET}\n`);
    return true;
  }
  await command.execute(rest.join(' '), ctx);
  return true;
}