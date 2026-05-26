import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const roots = ['src', 'tests', 'scripts'];
const ignored = new Set(['node_modules', 'dist', '.git']);
const problems = [];

async function walk(dir) {
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }

  for (const entry of entries) {
    if (ignored.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
    } else if (/\.(ts|mjs|cjs|js|md|json|yml|yaml|sh)$/.test(entry.name)) {
      const text = await readFile(path, 'utf8');
      if (text.includes('\t')) problems.push(`${path}: contains tab indentation`);
      if (!text.endsWith('\n')) problems.push(`${path}: missing trailing newline`);
    }
  }
}

for (const root of roots) {
  await walk(root);
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log('lint ok');
