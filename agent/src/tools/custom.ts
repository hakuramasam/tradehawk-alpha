import { tool } from '@openrouter/agent/tool';
import { z } from 'zod';

/**
 * Template for domain-specific tools. Copy this file, rename it, and register
 * the export in src/tools/index.ts.
 */
export const myCustomTool = tool({
  name: 'my_tool',
  description: 'Describe what this tool does',
  inputSchema: z.object({
    param: z.string().describe('Description of the parameter'),
  }),
  // Optional: require user approval before execution
  // requireApproval: true,
  execute: async ({ param }) => {
    return { result: `done: ${param}` };
  },
});