#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

node dist/cli.js lint fixtures/good.md
node dist/cli.js outline fixtures/good.md --out tmp/smoke-outline.json
test -s tmp/smoke-outline.json
node dist/cli.js --version > tmp/smoke-version.txt
grep -Eq '^[0-9]+[.][0-9]+[.][0-9]+$' tmp/smoke-version.txt
node dist/cli.js init --template oss-factory >/tmp/flowmark-init.md
grep -q "Done Criteria" /tmp/flowmark-init.md
