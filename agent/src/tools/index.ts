import { serverTool } from '@openrouter/agent';
import type { AgentConfig } from '../config.js';
import { fileReadTool } from './file-read.js';
import { createFileWriteTool } from './file-write.js';
import { createFileEditTool } from './file-edit.js';
import { globTool } from './glob.js';
import { grepTool } from './grep.js';
import { listDirTool } from './list-dir.js';
import { createShellTool } from './shell.js';
import { webFetchTool } from './web-fetch.js';
import { planTool } from './plan.js';
import { createSubAgentTool } from './sub-agent.js';

export function buildTools(config: AgentConfig) {
  return [
    // User-defined tools — executed client-side
    fileReadTool,
    createFileWriteTool(config.approvalPolicy),
    createFileEditTool(config.approvalPolicy),
    globTool,
    grepTool,
    listDirTool,
    createShellTool(config.approvalPolicy),
    webFetchTool,
    planTool,
    createSubAgentTool(config.apiKey, config.model),

    // Server tools — executed by OpenRouter, no client implementation needed
    serverTool({ type: 'openrouter:web_search' }),
    serverTool({ type: 'openrouter:datetime', parameters: { timezone: 'UTC' } }),
    serverTool({ type: 'openrouter:image_generation' }),
  ];
}