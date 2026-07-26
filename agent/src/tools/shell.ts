import { tool } from '@openrouter/agent/tool';
import { z } from 'zod';
import { execFile } from 'child_process';

const MAX_BUFFER = 256 * 1024;
const MAX_LINES = 2000;
const DANGEROUS = /\brm\b|\bsudo\b|\bchmod\b|\bchown\b|\bdd\b|mkfs|>\s*\/dev\/|\bkill(all)?\b|git\s+(push|reset|checkout)/;

function clip(output: string) {
  const lines = output.split('\n');
  if (lines.length <= MAX_LINES) return { output, truncated: false };
  return { output: lines.slice(-MAX_LINES).join('\n'), truncated: true };
}

export function createShellTool(approvalPolicy: 'always' | 'never' | 'dangerous-only') {
  return tool({
    name: 'shell',
    description:
      'Execute a shell command and return its combined stdout/stderr, exit code, and truncation status.',
    inputSchema: z.object({
      command: z.string().describe('Shell command to execute'),
      timeout: z.number().optional().describe('Timeout in seconds (default: 120)'),
    }),
    requireApproval:
      approvalPolicy === 'always'
        ? true
        : approvalPolicy === 'never'
          ? false
          : ({ command }: { command: string }) => DANGEROUS.test(command),
    execute: ({ command, timeout }: { command: string; timeout?: number }) =>
      new Promise<Record<string, unknown>>((resolve) => {
        const shell = process.env.SHELL || '/bin/bash';
        execFile(
          shell,
          ['-c', command],
          { timeout: (timeout ?? 120) * 1000, maxBuffer: MAX_BUFFER },
          (err, stdout, stderr) => {
            const combined = `${stdout ?? ''}${stderr ?? ''}`;
            const { output, truncated } = clip(combined);
            if (err && (err as NodeJS.ErrnoException).code === 'ETIMEDOUT') {
              resolve({ output, exitCode: null, timedOut: true, truncated });
              return;
            }
            resolve({
              output,
              exitCode: err ? ((err as unknown as { code?: number }).code ?? 1) : 0,
              ...(truncated && { truncated: true }),
            });
          },
        );
      }),
  });
}