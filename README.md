# flowmark

Local-first linting and outline generation for agent runbooks.

`flowmark` checks Markdown or YAML runbooks for the sections agents need before
they execute work: goal, inputs, boundaries, steps, verification, rollback, and
done criteria. It can also render a normalized JSON outline for handoff tools.

## Status

This repository is early-stage. Confirm the current support, release, and
security posture before using it in production.

## Install

Install dependencies and build locally:

```sh
npm install
npm run build
```

## Use

Lint a Markdown runbook:

```sh
node dist/cli.js lint fixtures/good.md
```

Render a machine-readable outline:

```sh
node dist/cli.js outline fixtures/good.md --out tmp/outline.json
```

Create a starter runbook:

```sh
node dist/cli.js init --template oss-factory > FLOW.md
```

## Verify

Run the local validation script before opening a pull request:

```sh
bash scripts/validate.sh
```

`scripts/validate.sh` runs the repository's standard local checks when they are defined and will also run `agent-qc ready` when `agent-qc` is installed. Missing `agent-qc` is treated as a skip, not a failure.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution expectations. Changes
should be small, reviewable, and verified before review.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting guidance.

## License

MIT
