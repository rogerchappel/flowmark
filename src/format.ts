import { extname } from 'node:path';
import type { RunbookFormat } from './types.js';

export function detectFormat(path: string): RunbookFormat {
  const ext = extname(path).toLowerCase();
  if (ext === '.yaml' || ext === '.yml') return 'yaml';
  return 'markdown';
}

export function isSupportedRunbook(path: string): boolean {
  return ['.md', '.markdown', '.yaml', '.yml'].includes(extname(path).toLowerCase());
}
