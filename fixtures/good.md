# Release Prep

## Goal

Prepare a small CLI release candidate.

## Inputs

- package.json
- CHANGELOG.md

## Boundaries

- Do not publish packages.

## Steps

- Check the release notes.
- Run the release gate.

## Verification

- npm run release:check

## Rollback

- Delete the release branch.

## Done Criteria

- Checks pass and notes are ready for review.
