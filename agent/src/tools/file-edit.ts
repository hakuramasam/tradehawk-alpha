import { tool } from '@openrouter/agent/tool';
import { z } from 'zod';
import { readFile, writeFile } from 'fs/promises';

function unifiedDiff(path: string, before: string, after: string): string {
  const a = before.split('\n');
  const b = after.split('\n');
  const out: string[] = [`--- ${path}`, `+++ ${path}`];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    const startA = i;
    const startB = j;
    const removed: string[] = [];
    const added: string[] = [];
    while (i < a.length && a[i] !== b[j]) removed.push(a[i++]);
    while (j < b.length && b[j] !== a[i]) added.push(b[j++]);
    out.push(`@@ -${startA + 1},${removed.length} +${startB + 1},${added.length} @@`);
    for (const line of removed) out.push(`-${line}`);
    for (const line of added) out.push(`+${line}`);
  }
  return out.join('\n');
}

export function createFileEditTool(approvalPolicy: 'always' | 'never' | 'dangerous-only') {
  return tool({
    name: 'file_edit',
    description:
      'Apply search-and-replace edits to a file. Each old_text must appear exactly once in the file. Returns a unified diff of the applied changes.',
    inputSchema: z.object({
      path: z.string().describe('Absolute path to the file'),
      edits: z
        .array(
          z.object({
            old_text: z.string().describe('Exact text to replace (must be unique in the file)'),
            new_text: z.string().describe('Replacement text'),
          }),
        )
        .describe('Edits applied in order'),
    }),
    requireApproval: approvalPolicy !== 'never',
    execute: async ({ path, edits }) => {
      try {
        const original = await readFile(path, 'utf-8');
        let updated = original;

        for (const [index, edit] of edits.entries()) {
          const occurrences = updated.split(edit.old_text).length - 1;
          if (occurrences === 0) return { error: `Edit ${index + 1}: old_text not found in ${path}` };
          if (occurrences > 1) {
            return {
              error: `Edit ${index + 1}: old_text appears ${occurrences} times in ${path}; add surrounding context to make it unique.`,
            };
          }
          updated = updated.replace(edit.old_text, edit.new_text);
        }

        if (updated === original) return { edited: false, path, diff: '', note: 'No changes.' };

        await writeFile(path, updated, 'utf-8');
        return { edited: true, path, diff: unifiedDiff(path, original, updated) };
      } catch (err: any) {
        if (err.code === 'ENOENT') return { error: `File not found: ${path}` };
        return { error: err.message };
      }
    },
  });
}