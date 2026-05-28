import assert from 'node:assert/strict';
import { test } from 'node:test';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { lintRunbook, parseRunbook, createOutline } from '../dist/index.js';

const execFileAsync = promisify(execFile);

test('lintRunbook accepts a complete Markdown runbook', async () => {
  const result = await lintRunbook('fixtures/good.md');
  assert.equal(result.ok, true);
  assert.deepEqual(result.messages, []);
});

test('lintRunbook reports missing sections and risky commands', async () => {
  const result = await lintRunbook('fixtures/incomplete.md');
  assert.equal(result.ok, false);
  assert.ok(result.messages.some((message) => message.code === 'missing-section'));
  assert.ok(result.messages.some((message) => message.code === 'destructive-without-confirmation'));
});

test('outline command writes a JSON outline', async () => {
  await execFileAsync('node', ['dist/cli.js', 'outline', 'fixtures/good.md', '--out', 'tmp/test-outline.json']);
  const outline = createOutline(await parseRunbook('fixtures/good.md'));
  assert.equal(outline.title, 'Release Prep');
  assert.equal(outline.doneCriteria[0], 'Checks pass and notes are ready for review.');
});
