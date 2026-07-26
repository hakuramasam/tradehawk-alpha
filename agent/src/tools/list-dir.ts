import { tool } from '@openrouter/agent/tool';
import { z } from 'zod';
import { readdir } from 'fs/promises';

const MAX_ENTRIES = 500;

export const listDirTool = tool({
  name: 'list_dir',
  description: 'List the contents of a directory. Directories are suffixed with "/".',
  inputSchema: z.object({
    path: z.string().optional().describe('Directory to list (default: cwd)'),
  }),
  execute: async ({ path }) => {
    const dir = path ?? process.cwd();
    try {
      const dirents = await readdir(dir, { withFileTypes: true });
      const entries = dirents
        .map((d) => (d.isDirectory() ? `${d.name}/` : d.name))
        .sort((a, b) => a.localeCompare(b));
      return {
        path: dir,
        entries: entries.slice(0, MAX_ENTRIES),
        total: entries.length,
        ...(entries.length > MAX_ENTRIES && { truncated: true }),
      };
    } catch (err: any) {
      if (err.code === 'ENOENT') return { error: `Directory not found: ${dir}` };
      return { error: err.message };
    }
  },
});