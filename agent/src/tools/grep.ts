import { tool } from '@openrouter/agent/tool';
import { z } from 'zod';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { glob } from 'glob';

const exec = promisify(execFile);
const MAX_RESULTS = 100;

type Match = { file: string; line: number; content: string };

async function ripgrep(
  pattern: string,
  path: string,
  fileGlob?: string,
  ignoreCase?: boolean,
): Promise<Match[] | null> {
  const args = ['--line-number', '--no-heading', '--color', 'never', '-m', String(MAX_RESULTS)];
  if (ignoreCase) args.push('-i');
  if (fileGlob) args.push('--glob', fileGlob);
  args.push(pattern, path);
  try {
    const { stdout } = await exec('rg', args, { maxBuffer: 4 * 1024 * 1024 });
    return parseRg(stdout);
  } catch (err: any) {
    if (err.code === 1 && typeof err.stdout === 'string') return parseRg(err.stdout);
    if (err.code === 'ENOENT') return null;
    return parseRg(String(err.stdout ?? ''));
  }
}

function parseRg(stdout: string): Match[] {
  return stdout
    .split('\n')
    .filter(Boolean)
    .slice(0, MAX_RESULTS)
    .map((line) => {
      const m = line.match(/^(.*?):(\d+):(.*)$/);
      return m ? { file: m[1], line: Number(m[2]), content: m[3].slice(0, 400) } : null;
    })
    .filter((m): m is Match => m !== null);
}

async function nodeGrep(
  pattern: string,
  path: string,
  fileGlob: string | undefined,
  ignoreCase: boolean | undefined,
): Promise<Match[]> {
  const re = new RegExp(pattern, ignoreCase ? 'i' : undefined);
  const files = await glob(fileGlob ?? '**/*', {
    cwd: path,
    nodir: true,
    absolute: true,
    ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
  });
  const matches: Match[] = [];
  for (const file of files) {
    if (matches.length >= MAX_RESULTS) break;
    let content: string;
    try {
      content = await readFile(file, 'utf-8');
    } catch {
      continue;
    }
    content.split('\n').forEach((line, i) => {
      if (matches.length < MAX_RESULTS && re.test(line)) {
        matches.push({ file, line: i + 1, content: line.slice(0, 400) });
      }
    });
  }
  return matches;
}

export const grepTool = tool({
  name: 'grep',
  description: 'Search file contents by regular expression. Returns up to 100 matches.',
  inputSchema: z.object({
    pattern: z.string().describe('Regex pattern to search for'),
    path: z.string().optional().describe('Directory or file to search (default: cwd)'),
    glob: z.string().optional().describe('File filter, e.g. "*.ts"'),
    ignoreCase: z.boolean().optional().describe('Case-insensitive search'),
  }),
  execute: async ({ pattern, path, glob: fileGlob, ignoreCase }) => {
    const searchPath = path ?? process.cwd();
    try {
      const rg = await ripgrep(pattern, searchPath, fileGlob, ignoreCase);
      const matches = rg ?? (await nodeGrep(pattern, searchPath, fileGlob, ignoreCase));
      return {
        matches,
        count: matches.length,
        ...(matches.length >= MAX_RESULTS && { truncated: true }),
      };
    } catch (err: any) {
      return { error: err.message };
    }
  },
});