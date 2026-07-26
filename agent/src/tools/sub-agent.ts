import { OpenRouter, serverTool } from '@openrouter/agent';
import { tool } from '@openrouter/agent/tool';
import { stepCountIs, maxCost } from '@openrouter/agent/stop-conditions';
import { z } from 'zod';
import { fileReadTool } from './file-read.js';
import { globTool } from './glob.js';
import { grepTool } from './grep.js';
import { listDirTool } from './list-dir.js';
import { webFetchTool } from './web-fetch.js';

const SUB_AGENT_INSTRUCTIONS = [
  'You are a focused read-only research sub-agent for the TradeHawk alpha analyst.',
  'You can read files, search the repo, search the web, and fetch pages. You cannot write or execute anything.',
  'Answer the delegated task completely and return a compact, factual report with sources.',
  'Never invent numbers or contract addresses.',
].join('\n');

export function createSubAgentTool(apiKey: string, defaultModel: string) {
  return tool({
    name: 'sub_agent',
    description:
      'Delegate a self-contained research task to a read-only child agent. Use for parallel/deep research that would flood your own context. Returns the child agent final report.',
    inputSchema: z.object({
      task: z.string().describe('Short name for the task'),
      message: z.string().describe('Detailed, self-contained instructions for the sub-agent'),
      model: z.string().optional().describe('Model override for the sub-agent'),
    }),
    execute: async ({ task, message, model }) => {
      try {
        const client = new OpenRouter({ apiKey });
        const result = client.callModel({
          model: model ?? defaultModel,
          instructions: SUB_AGENT_INSTRUCTIONS,
          input: message,
          tools: [
            fileReadTool,
            globTool,
            grepTool,
            listDirTool,
            webFetchTool,
            serverTool({ type: 'openrouter:web_search' }),
          ],
          stopWhen: [stepCountIs(10), maxCost(0.25)],
        });
        const text = await result.getText();
        return { task, report: text };
      } catch (err: any) {
        return { task, error: err.message };
      }
    },
  });
}