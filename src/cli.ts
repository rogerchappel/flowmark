#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Command } from 'commander';
import { lintRunbook, parseRunbook, createOutline } from './index.js';

const program = new Command();

program
  .name('flowmark')
  .description('Lint agent runbooks and render execution outlines.')
  .version('0.1.0');

program
  .command('lint')
  .argument('<file>', 'Markdown or YAML runbook')
  .action(async (file: string) => {
    const result = await lintRunbook(file);
    for (const message of result.messages) {
      console.log(`${message.severity.toUpperCase()} ${message.code} ${file}:${message.line}:${message.column} ${message.message}`);
    }
    if (result.ok) console.log(`${file}: ok`);
    process.exitCode = result.ok ? 0 : 1;
  });

program
  .command('outline')
  .argument('<file>', 'Markdown or YAML runbook')
  .option('--out <path>', 'Write JSON outline to a file')
  .action(async (file: string, options: { out?: string }) => {
    const outline = createOutline(await parseRunbook(file));
    const json = `${JSON.stringify(outline, null, 2)}\n`;
    if (options.out) {
      await mkdir(dirname(options.out), { recursive: true });
      await writeFile(options.out, json, 'utf8');
    } else {
      process.stdout.write(json);
    }
  });

program
  .command('init')
  .option('--template <name>', 'Template name', 'default')
  .action((options: { template: string }) => {
    process.stdout.write(renderTemplate(options.template));
  });

program.parseAsync().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

function renderTemplate(template: string): string {
  const title = template === 'oss-factory' ? 'OSS Factory Runbook' : 'Runbook';
  return `# ${title}

## Goal

Describe the intended outcome.

## Inputs

- Repository, issue, or artifact to inspect.

## Boundaries

- Do not touch secrets or production data.

## Steps

- Inspect the current state.
- Make the smallest safe change.
- Review the diff.

## Verification

- Run the relevant local checks.

## Rollback

- Revert the branch or discard the worktree.

## Done Criteria

- The change is reviewed, verified, and ready for handoff.
`;
}
