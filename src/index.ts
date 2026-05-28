import { readFile } from 'node:fs/promises';
import { detectFormat } from './format.js';
import { lintDocument } from './rules.js';
import { parseMarkdownRunbook } from './markdown.js';
import { parseYamlRunbook } from './yaml.js';
import type { LintResult, RunbookDocument } from './types.js';

export async function parseRunbook(path: string): Promise<RunbookDocument> {
  const raw = await readFile(path, 'utf8');
  const format = detectFormat(path);
  return format === 'yaml' ? parseYamlRunbook(path, raw) : parseMarkdownRunbook(path, raw);
}

export async function lintRunbook(path: string): Promise<LintResult> {
  return lintDocument(await parseRunbook(path));
}

export { createOutline } from './outline.js';
export { lintDocument } from './rules.js';
export { parseMarkdownRunbook } from './markdown.js';
export { parseYamlRunbook } from './yaml.js';
export type * from './types.js';
