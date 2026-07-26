import { tool } from '@openrouter/agent/tool';
import { z } from 'zod';
import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';

export function createFileWriteTool(approvalPolicy: 'always' | 'never' | 'dangerous-only') {
  return tool({
    name: 'file_write',
    description: 'Write content to a file, creating it and any parent directories if needed.',
    inputSchema: z.object({
      path: z.string().describe('Absolute path to the file'),
      content: z.string().describe('Full file content to write'),
    }),
    requireApproval: approvalPolicy !== 'never',
    execute: async ({ path, content }) => {
      try {
        await mkdir(dirname(path), { recursive: true });
        await writeFile(path, content, 'utf-8');
        return { written: true, path, bytes: Buffer.byteLength(content) };
      } catch (err: any) {
        return { error: err.message };
      }
    },
  });
}