# FlowMark PRD

Status: in-progress

## Summary

FlowMark is a tiny local workflow linter for agent runbooks. It validates Markdown or YAML runbooks for clear stages, owners, inputs, outputs, safety checks, and verification commands, then renders a machine-readable execution outline.

## Problem

Agentic workflows are increasingly described as Markdown plans, YAML flows, and task briefs. Without structure, agents miss safety boundaries or run verification out of order. Developers need a small tool that checks runbooks before execution without requiring a specific agent platform.

## Goals

- Parse Markdown runbooks and simple YAML flow files.
- Validate required sections: goal, inputs, boundaries, steps, verification, rollback, and done criteria.
- Detect risky missing details such as destructive commands without confirmation.
- Emit a normalized JSON execution outline.
- Provide actionable lint messages with line numbers.

## Non-Goals

- No workflow execution in V1.
- No hosted scheduler.
- No agent-specific SDK.

## CLI

```bash
flowmark lint docs/ORCHESTRATION.md
flowmark outline flow.yaml --out tmp/outline.json
flowmark init --template oss-factory > FLOW.md
```

## MVP Requirements

- TypeScript Node CLI with `lint`, `outline`, and `init` commands.
- Markdown and YAML parsers using maintained libraries.
- Built-in rules and configurable required sections.
- Fixtures for good, risky, and incomplete runbooks.
- README with examples for local agent orchestration.

## Attribution

Inspired by YAML-based agent workflow tools and terminal-first agent orchestrators. Reframed as a local validator and outline renderer rather than an execution platform.
