import { tool } from '@openrouter/agent/tool';
import { z } from 'zod';

const MAX_CHARS = 50_000;
const BLOCKED_HOSTS = /^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?)/i;

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export const webFetchTool = tool({
  name: 'web_fetch',
  description:
    'Fetch a public web page over http(s) and return its extracted text content. Useful for reading token pages, docs, and explorers.',
  inputSchema: z.object({
    url: z.string().describe('Absolute http(s) URL to fetch'),
  }),
  execute: async ({ url }) => {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return { error: `Invalid URL: ${url}` };
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { error: 'Only http and https URLs are allowed.' };
    }
    if (BLOCKED_HOSTS.test(parsed.hostname)) {
      return { error: 'Refusing to fetch internal/loopback addresses.' };
    }

    try {
      const res = await fetch(parsed.toString(), {
        redirect: 'follow',
        headers: { 'User-Agent': 'TradeHawkAgent/0.1 (+https://clanker.world)' },
        signal: AbortSignal.timeout(30_000),
      });
      const body = await res.text();
      const isHtml = (res.headers.get('content-type') ?? '').includes('html');
      const text = isHtml ? htmlToText(body) : body;
      const title = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
      return {
        url: parsed.toString(),
        status: res.status,
        title,
        text: text.slice(0, MAX_CHARS),
        ...(text.length > MAX_CHARS && { truncated: true }),
      };
    } catch (err: any) {
      return { error: err.message };
    }
  },
});