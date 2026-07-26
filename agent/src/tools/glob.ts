import { tool } from '@openrouter/agent/tool';
import { z } from 'zod';
import { glob } from 'glob';

const MAX_RESULTS = 1000;

export const globTool = tool({
  name: 'glob',
  description: 'Find files by glob pattern. Returns paths relative to the search directory.',
  inputSchema: z.object({
    pattern: z.string().describe('Glob pattern, e.g. "src/**/*.ts"'),
    path: z.string().optional().describe('Directory to search in (default: cwd)'),
  }),
  execute: async ({ pattern, path }) => {
    try {
      const matches = await glob(pattern, {
        cwd: path ?? process.cwd(),
        nodir: true,
        dot: false,
        ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**'],
      });
      const sorted = matches.sort();
      return {
        files: sorted.slice(0, MAX_RESULTS),
        total: sorted.length,
        ...(sorted.length > MAX_RESULTS && { truncated: true }),
      };
    } catch (err: any) {
      return { error: err.message };
    }
  },
});