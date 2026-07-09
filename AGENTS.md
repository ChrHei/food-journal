# Repository Guidelines

## Project Structure & Module Organization
This repository is currently in bootstrap state: it contains Git metadata only and no application files yet. As the project is added, keep the top level predictable:

- `src/` for app code
- `tests/` for automated tests
- `assets/` for static images, icons, or sample data
- `docs/` for design notes and decisions

Prefer small, focused modules. Keep feature code grouped by domain rather than by file type when the codebase grows.

## Build, Test, and Development Commands
There are no build scripts configured yet. When tooling is introduced, expose it through repository-level commands so contributors have one obvious entry point.

- `npm install` or equivalent: install dependencies
- `npm run dev`: start local development
- `npm test`: run the test suite
- `npm run lint`: check formatting and static analysis

If a different stack is chosen, update this file immediately so commands stay accurate.

## Coding Style & Naming Conventions
Use 2 or 4 spaces consistently; do not mix indentation styles within a file. Prefer UTF-8 text files, descriptive names, and small functions with one clear responsibility.

- Files and folders: kebab-case unless the language ecosystem strongly prefers another pattern
- Classes and components: PascalCase
- Variables and functions: camelCase
- Constants: UPPER_SNAKE_CASE

Adopt a formatter and linter early and run them before opening a pull request.

## Testing Guidelines
Place tests under `tests/` or next to source files using the project’s standard pattern. Name tests after the unit under test, for example `meal-entry.test.js` or `MealEntryTests.cs`.

Add tests for new behavior and regressions. A practical baseline is coverage for critical flows rather than a raw percentage target until the architecture is established.

## Commit & Pull Request Guidelines
This repository has no commit history yet, so start with short, imperative commit messages such as `Add meal entry model` or `Set up test runner`.

Pull requests should include:

- a clear summary of the change
- setup or migration notes if relevant
- linked issue or task reference
- screenshots for UI changes

## Agent-Specific Notes
Keep automation-friendly scripts at the repo root or under a clearly named tooling folder. When adding new conventions, update this guide in the same change set.
