#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { createOutline, lintRunbook, parseRunbook } from "./index.js";

interface ParsedArgs {
  command?: string;
  file?: string;
  out?: string;
  template?: string;
  help: boolean;
  json: boolean;
}

export async function main(argv: string[] = process.argv.slice(2)): Promise<number> {
  try {
    const args = parseArgs(argv);

    if (args.help || !args.command) {
      process.stdout.write(helpText());
      return 0;
    }

    if (args.command === "lint") {
      const file = requireFile(args);
      const result = await lintRunbook(file);
      process.stdout.write(args.json ? `${JSON.stringify(result, null, 2)}\n` : renderLint(result));
      return result.ok ? 0 : 1;
    }

    if (args.command === "outline") {
      const file = requireFile(args);
      const outline = createOutline(await parseRunbook(file));
      const body = `${JSON.stringify(outline, null, 2)}\n`;
      if (args.out) {
        await mkdir(dirname(args.out), { recursive: true });
        await writeFile(args.out, body);
      } else {
        process.stdout.write(body);
      }
      return 0;
    }

    if (args.command === "init") {
      process.stdout.write(await renderTemplate(args.template ?? "default"));
      return 0;
    }

    throw new Error(`Unknown command: ${args.command}`);
  } catch (error) {
    process.stderr.write(`flowmark: ${error instanceof Error ? error.message : String(error)}\n`);
    return 1;
  }
}

function parseArgs(argv: string[]): ParsedArgs {
  const [command, ...rest] = argv;
  const args: ParsedArgs = { command, help: false, json: false };

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (token === "--help" || token === "-h") {
      args.help = true;
    } else if (token === "--json") {
      args.json = true;
    } else if (token === "--out" || token === "-o") {
      args.out = requireValue(rest, (index += 1), token);
    } else if (token === "--template") {
      args.template = requireValue(rest, (index += 1), token);
    } else if (!token.startsWith("-") && !args.file) {
      args.file = token;
    } else {
      throw new Error(`Unknown option: ${token}`);
    }
  }

  return args;
}

function requireValue(argv: string[], index: number, option: string): string {
  const value = argv[index];
  if (!value || value.startsWith("-")) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}

function requireFile(args: ParsedArgs): string {
  if (!args.file) {
    throw new Error(`${args.command} requires a runbook path`);
  }
  return args.file;
}

function renderLint(result: Awaited<ReturnType<typeof lintRunbook>>): string {
  if (result.ok) {
    return `${result.file}: ok\n`;
  }

  const messages = result.messages.map(
    (message) => `${result.file}:${message.line}:${message.column} ${message.severity} ${message.code} - ${message.message}`
  );
  return `${messages.join("\n")}\n`;
}

async function renderTemplate(name: string): Promise<string> {
  if (name === "oss-factory") {
    return readFile(new URL("../fixtures/good.md", import.meta.url), "utf8");
  }

  return `# Workflow Title

## Goal

Describe the intended outcome.

## Inputs

- Input artifact or system.

## Boundaries

- State what must not be changed.

## Steps

- Run the smallest useful check.

## Verification

- Record the command and result.

## Rollback

- Describe how to undo the change.

## Done Criteria

- Checks pass and review notes are complete.
`;
}

function helpText(): string {
  return `flowmark

Usage:
  flowmark lint <runbook> [--json]
  flowmark outline <runbook> [--out FILE]
  flowmark init [--template oss-factory]

Commands:
  lint      Validate required runbook sections and safety notes.
  outline   Render a normalized JSON execution outline.
  init      Print a starter runbook template.
`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = await main();
}
