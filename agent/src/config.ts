import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export interface LoaderConfig {
  text: string;
  style: 'gradient' | 'spinner' | 'minimal';
}

export interface DisplayConfig {
  toolDisplay: 'emoji' | 'grouped' | 'minimal' | 'hidden';
  reasoning: boolean;
  inputStyle: 'block' | 'bordered' | 'plain';
  loader: LoaderConfig;
}

export interface CompactionSettings {
  enabled: boolean;
  threshold: number;
  keepRecent: number;
  model: string;
}

export interface AgentConfig {
  apiKey: string;
  model: string;
  systemPrompt: string;
  maxSteps: number;
  maxCost: number;
  sessionDir: string;
  showBanner: boolean;
  display: DisplayConfig;
  slashCommands: boolean;
  approvalPolicy: 'always' | 'never' | 'dangerous-only';
  compaction: CompactionSettings;
}

const SYSTEM_PROMPT = [
  'You are TradeHawk, an autonomous alpha analyst for Base mainnet (chain id 8453).',
  'You research trending tokens, liquidity, holder distribution, and narrative velocity, then produce',
  'ranked, falsifiable trade theses. You are not a financial advisor and you never promise returns.',
  '',
  'Current working directory: {cwd}',
  '',
  'Domain context:',
  '- The project token is $THAI (TradeHawk AI) at 0x00c605b6515A8509974391FCFd34014c78107B07 on Base.',
  '- Access to the agent product is gated at 100,000 $THAI.',
  '- Preferred data sources: DexScreener, GeckoTerminal, Basescan, Clanker, Farcaster/X chatter.',
  '',
  'Guidelines:',
  '- Use your tools proactively. Search the web and fetch pages instead of guessing prices or addresses.',
  '- Never invent a contract address, liquidity number, or holder count. Verify or say you could not.',
  '- For every thesis give: token, chain, why now, entry, invalidation (stop), target, confidence 0-100, and the risks.',
  '- Always flag honeypot / LP-migration / high-concentration risk before anything bullish.',
  '- Use the plan tool for multi-step research and keep working until the task is fully resolved.',
  '- Prefer grep and glob over shell commands when searching this repo.',
  '- Be concise and direct. Show file paths clearly when working with files.',
  '- End market analyses with: "Not financial advice. Verify on-chain before trading."',
].join('\n');

const DEFAULTS: AgentConfig = {
  apiKey: '',
  model: 'anthropic/claude-opus-4.7',
  systemPrompt: SYSTEM_PROMPT,
  maxSteps: 20,
  maxCost: 1.0,
  sessionDir: '.sessions',
  showBanner: true,
  display: {
    toolDisplay: 'grouped',
    reasoning: false,
    inputStyle: 'block',
    loader: { text: 'Hunting', style: 'spinner' },
  },
  slashCommands: true,
  approvalPolicy: 'dangerous-only',
  compaction: { enabled: true, threshold: 40, keepRecent: 10, model: 'openai/gpt-4.1-mini' },
};

export function loadConfig(overrides: Partial<AgentConfig> = {}): AgentConfig {
  let config: AgentConfig = { ...DEFAULTS };

  const configPath = resolve('agent.config.json');
  if (existsSync(configPath)) {
    const file = JSON.parse(readFileSync(configPath, 'utf-8')) as Partial<AgentConfig>;
    if (file.display) config.display = { ...config.display, ...file.display };
    if (file.compaction) config.compaction = { ...config.compaction, ...file.compaction };
    config = { ...config, ...file, display: config.display, compaction: config.compaction };
  }

  if (process.env.OPENROUTER_API_KEY) config.apiKey = process.env.OPENROUTER_API_KEY;
  if (process.env.AGENT_MODEL) config.model = process.env.AGENT_MODEL;
  if (process.env.AGENT_MAX_STEPS) config.maxSteps = Number(process.env.AGENT_MAX_STEPS);
  if (process.env.AGENT_MAX_COST) config.maxCost = Number(process.env.AGENT_MAX_COST);

  if (overrides.display) config.display = { ...config.display, ...overrides.display };
  config = { ...config, ...overrides, display: config.display };

  if (!config.apiKey) throw new Error('OPENROUTER_API_KEY is required.');
  return config;
}