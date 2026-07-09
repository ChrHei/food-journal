# Repository Guidelines

## Project Structure & Module Organization
This repository contains an Android-first Expo/React Native app for food, drink, medication, and symptom tracking.

- `App.tsx` bootstraps the app
- `src/app/navigation/` contains React Navigation setup
- `src/domain/` contains core types and validation rules
- `src/data/` contains SQLite access, repositories, and legacy normalization helpers
- `src/features/journal/` contains screens, hooks, and context for the journal flow
- `src/components/` contains reusable UI pieces
- `docs/` contains architecture and decision documents
- `tests/` contains Jest tests
- `reference/Matdagbok.xlsx` is reference input data only, not runtime data
- `.agents/review/` stores saved review notes

## Build, Test, and Development Commands
Use the repository scripts in `package.json`:

- `npm install`: install dependencies
- `npm run start`: start Expo locally
- `npm run android`: run the app on Android
- `npm test`: run Jest tests
- `npm run lint`: run TypeScript type-checking with `tsc --noEmit`

Run `npm test` and `npm run lint` before committing app logic changes.

## Coding Style & Naming Conventions
Use TypeScript throughout. Prefer small modules and keep domain rules out of UI components.

- Components and screens: PascalCase, e.g. `EntryFormScreen.tsx`
- Functions, hooks, and variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Keep imports using the `@/` alias for `src/`

Follow existing patterns: domain types in `src/domain`, persistence in `src/data`, feature behavior in `src/features`.

## Testing Guidelines
Tests use Jest with the `jest-expo` preset. Place tests in `tests/` with `*.test.ts` names, for example `repository.test.ts`.

Prioritize tests for:

- validation rules
- repository behavior
- filter/query helpers
- legacy Excel normalization

## Commit & Pull Request Guidelines
Use short, descriptive English commit messages in plain language, such as `Initial app scaffold` or `Fix journal date filtering`. Do not use Conventional Commits prefixes.

Pull requests should include a concise summary, note any Android-specific verification, and include screenshots for UI changes.

## Agent-Specific Notes
Keep Markdown documentation current when architecture or conventions change. If you save a review, store it under `.agents/review/`.
