# flowmark
A local-first workflow linter and outline renderer for agent runbooks.
## Status

This is a v0.1.0 local-first developer tool. Treat the CLI and output formats as early-stage, pin versions in automation, and run the verification commands below before relying on it in CI.
## What it helps with

- Work with agent, workflow, runbook, markdown, yaml workflows from a local checkout.
- Keep generated artifacts and reports inspectable on disk instead of sending project data to a service.
- Add a repeatable smoke command that maintainers can run before review or release.

## Install from a checkout

```sh
git clone https://github.com/rogerchappel/flowmark.git
cd flowmark
npm install
npm run build
```
## CLI quickstart

Start with the built CLI help so the examples match the checked-out version:

```sh
node dist/cli.js --help
```
Run the maintained smoke fixture to exercise the main workflow end to end:

```sh
npm run smoke
```

The smoke command currently expands to:

```sh
npm run build && bash scripts/smoke.sh
```
## Verification

```sh
npm run check
npm test
npm run smoke
npm run package:smoke
npm run release:check
npm run validate
```

`release:check` runs the workflow linter, tests, fixture smoke coverage, and a
dry-run package check. `validate` wraps the repository hygiene script for a
single local pre-PR gate.

## Limitations

- The project is intentionally local-first; it does not manage remote credentials or upload repository contents.
- Output schemas and CLI flags may change before a stable 1.0 release.
- Review generated files before committing them, especially when they summarize logs, diffs, or dependency metadata.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep changes small, include a fixture or smoke case when behavior changes, and paste verification output into the pull request.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting. Do not paste secrets, private tokens, or proprietary logs into issues or examples.

## License

MIT

Release verification scripts not already covered above:

- `npm run lint` - node scripts/lint.mjs
- `npm run test` - npm run build && node --test tests/*.test.mjs
