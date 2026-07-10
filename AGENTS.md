# Repository Guidelines

## Project Structure & Module Organization
This repository contains an Android-first Expo/React Native app for food, drink, medication, and symptom tracking.

- `App.tsx` bootstraps the app
- `src/app/navigation/` contains React Navigation setup
- `src/domain/` contains core types and validation rules
- `src/data/` contains SQLite access, repositories, and legacy normalization helpers; the app currently uses `expo-sqlite`
- `src/features/journal/` contains screens, hooks, context, and date/filter helpers for the journal flow
- `src/features/journal/JournalProvider` is responsible for database initialization and exposes the `ready` state
- `src/components/` contains reusable UI pieces
- `docs/` contains architecture and decision documents
- `tests/` contains Jest tests
- `reference/Matdagbok.xlsx` is reference input data only, not runtime data
- `.agents/review/` stores saved review notes

When adding code, prefer keeping business rules close to the existing layer boundaries:

- domain rules in `src/domain/`
- persistence and mapping in `src/data/`
- feature-specific orchestration in `src/features/`
- reusable presentation-only building blocks in `src/components/`

## Build, Test, and Development Commands
Use the repository scripts in `package.json`:

- `npm install`: install dependencies
- `npm run start`: start Expo locally
- `npm run android`: run the app on Android
- `npm test`: run Jest tests
- `npm run lint`: run TypeScript type-checking with `tsc --noEmit`

Run `npm test` and `npm run lint` before committing app logic changes. For dependency or SDK work, run them again after lockfile changes.

Current SDK baseline:

- Expo SDK `54`
- intended Expo Go compatibility: Expo Go `54.x`

If you change Expo, React Native, or Expo-managed packages:

- re-check `package.json` before changing versions
- prefer `npx expo install ...` over manual version pinning for Expo-managed packages
- run `npx expo install --fix` after SDK-aligned changes
- re-verify that the dependency set still matches the SDK line in `package.json`
- confirm whether Expo Go compatibility is part of the requirement before changing SDK major or minor versions

## Coding Style & Naming Conventions
Use TypeScript throughout. Prefer small modules and keep domain rules out of UI components.

- Components and screens: PascalCase, e.g. `EntryFormScreen.tsx`
- Functions, hooks, and variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Keep imports using the `@/` alias for `src/`

Follow existing patterns: domain types in `src/domain`, persistence in `src/data`, feature behavior in `src/features`.

Additional implementation guidance:

- Keep database access in `src/data/`; screens should use the repository/context layer rather than talking to SQLite directly.
- When working in journal screens, respect the `ready` state from `JournalProvider` before triggering reads or writes that depend on initialized tables.
- Keep date conversion rules centralized in `src/features/journal/utils/date.ts` rather than rebuilding date logic inline in screens.
- Prefer small helper functions for filtering, sorting, and date formatting so behavior can be tested without rendering screens.
- Preserve the current app style and navigation patterns unless the task explicitly calls for a UI redesign.

## Testing Guidelines
Tests use Jest with the `jest-expo` preset. Place tests in `tests/` with `*.test.ts` names, for example `repository.test.ts`.

Prioritize tests for:

- validation rules
- repository behavior
- filter/query helpers
- legacy Excel normalization

When fixing bugs in screen loading flows, initialization, or filter behavior:

- add or update helper-level tests when practical
- prefer testing pure logic in helpers/repositories over fragile screen snapshots
- mention any remaining UI-state gaps that are not covered by Jest
- if a change depends on `ready`/async initialization timing, verify both loading and loaded states

## Commit & Pull Request Guidelines
Use short, descriptive English commit messages in plain language, such as `Initial app scaffold` or `Fix journal date filtering`. Do not use Conventional Commits prefixes.

Pull requests should include a concise summary, note any Android-specific verification, and include screenshots for UI changes.

Standard git workflow for this repository:

- use `main` as the default base branch unless the task explicitly says otherwise
- prefer `git pull --ff-only` before creating a new feature branch from `main`
- name agent-created branches with the `codex/` prefix followed by a short task description
- if the user says "check in changes" without narrowing scope, assume `git add -A` is acceptable for the files changed for that task
- use English commit messages
- when the user asks to create a PR, assume the target is `main` unless another base branch is specified
- after a branch is merged, it is acceptable to delete the local feature branch if the user asks to clean up

If a PR also changes SDK/dependencies:

- state the target Expo SDK explicitly
- note whether Expo Go compatibility changed
- mention `npm run lint` / `npm test` results in the PR description

## Agent-Specific Notes
Keep Markdown documentation current when architecture or conventions change. If you save a review, store it under `.agents/review/`.

Before making dependency upgrades or Expo SDK migrations:

- check the current `package.json` first
- prefer coherent SDK-aligned updates over repeated `npm audit fix --force`
- verify whether Expo Go compatibility is a requirement before changing SDK major/minor lines
- avoid mixing unrelated refactors into dependency-only changes

When performing reviews:

- compare the branch not only to the original bugfix intent, but also to any tracking issue under `.agents/review/` or GitHub issues
- call out when a PR has drifted in scope, for example if a small bugfix branch also contains an SDK migration
