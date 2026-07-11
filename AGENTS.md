# Repository Guidelines

## Project Scope

This repository contains an Android-first Expo/React Native food journal for tracking food, drink, medication, notes, and symptom-marked entries. Preserve Expo Go compatibility unless the user explicitly approves a development build or SDK migration.

Current runtime baseline:

- Expo SDK `54`
- Expo Go `54.x`
- React Native `0.81`
- React `19`
- SQLite through `expo-sqlite`
- React Navigation native stack with a custom modal menu

## Project Structure

- `App.tsx` bootstraps providers and navigation.
- `src/app/navigation/` owns route types, stack configuration, headers, and the global menu.
- `src/domain/` owns journal types, categories, and validation rules.
- `src/data/` owns SQLite initialization, repositories, row mapping, queries, and legacy normalization.
- `src/features/journal/` owns journal screens, context, hooks, and feature-specific helpers.
- `src/components/` contains reusable presentation components such as `Screen`, `Chip`, category icons, buttons, and badges.
- `tests/` contains Jest tests for domain, repository, date/filter, normalization, and form-state helpers.
- `docs/` contains architecture and decision records.
- `reference/Matdagbok.xlsx` is reference input only and must not become a runtime dependency.
- `.agents/review/` contains saved review notes.

Keep responsibilities within these boundaries:

- Put business rules and reusable types in `src/domain/`.
- Put persistence, SQL, migrations, and storage mapping in `src/data/`.
- Put journal-specific orchestration in `src/features/journal/`.
- Put reusable, presentation-only UI in `src/components/`.
- Screens must use the repository/context layer and must not access SQLite directly.

## Development Commands

Use the scripts defined in `package.json`:

- `npm install`: install dependencies.
- `npm run start`: start Metro for Expo Go.
- `npm run android`: create/run a native Android development build; this requires the Android SDK.
- `npm run lint`: run TypeScript checking with `tsc --noEmit`.
- `npm test -- --runInBand`: run the Jest suite serially.
- `npx expo export --platform android --output-dir .expo-export`: bundle the Android app without requiring an emulator and detect startup/import incompatibilities.

Keep Metro running while iterating when practical. Normal JavaScript and style changes should reload in Expo Go; use `npx expo start -c` only when a stale Metro cache is a plausible cause.

`.expo-export/` is generated verification output. Never commit it.

## Implementation Conventions

Use TypeScript throughout and follow the existing code style.

- Components and screens use PascalCase.
- Functions, hooks, props, and variables use camelCase.
- Constants use UPPER_SNAKE_CASE when they are true constants.
- Use the `@/` alias for imports from `src/`.
- Prefer small pure helpers for comparison, filtering, sorting, and date conversion.
- Add comments only where intent is not clear from the code.
- Preserve the established warm color palette, rounded surfaces, icon style, and mobile-first spacing unless the user asks for a redesign.
- Ensure layouts work on narrow Android screens and do not rely on text fitting on one specific device.

Use `react-native-safe-area-context` for safe areas. Do not import the deprecated `SafeAreaView` from `react-native`.

## Navigation And Runtime Constraints

The app intentionally uses a native stack plus a custom `Modal` menu in `AppNavigation.tsx`. The menu provides `Start`, `Ny post`, and `Historik` from every screen.

- Do not reintroduce `@react-navigation/drawer`, Reanimated, Worklets, or Gesture Handler without first verifying exact Expo SDK 54 and Expo Go compatibility.
- Keep navigation-container access behind `navigationRef.isReady()`.
- Keep active-route synchronization in `NavigationContainer` callbacks such as `onReady` and `onStateChange`; do not read an uninitialized navigation object during render.
- Preserve normal stack back behavior for detail and filter screens.
- Global menu navigation may reset the stack, but it must still trigger the entry form's unsaved-change guard.
- Route names in `RootStackParamList` are stable public identifiers; change them only when all callers and persisted assumptions are updated together.

## Journal And Data Rules

`JournalProvider` initializes SQLite and exposes `ready`. Any read or write that depends on initialized tables must wait for `ready`.

- Keep date parsing and UTC/local boundary conversion in `src/features/journal/utils/date.ts`.
- Keep entry dirty-state comparison in `src/features/journal/utils/entryForm.ts`.
- Preserve the entry form's `beforeRemove` warning for unsaved changes.
- Reset the form baseline after a successful save so post-save navigation does not warn.
- Keep the save action in the fixed `Screen` footer so it remains visible without scrolling.
- Treat symptom marking as a boolean flag, not a category.
- Current selectable categories come from `src/domain/categories.ts`.
- Map unsupported legacy categories explicitly in `src/data/excelNormalization.ts` or repository row mapping. Do not cast unknown persisted strings directly into valid domain values without a fallback.
- When category behavior changes, update domain tests, legacy normalization tests, filters, forms, icons, and existing-row mapping together.

## UI Component Rules

- Use `CategoryIcon` everywhere a journal category is represented visually: home summaries, list cards, filter chips, form category choices, and detail views.
- Use `SymptomBadge` for symptom-marked entries; keep its alignment configurable because cards and detail views have different layout needs.
- Keep category labels on one line where requested, but avoid fixed widths that overflow narrow screens.
- Reuse `Chip`, `PrimaryButton`, `Field`, and `Screen` instead of duplicating their styling or behavior in screens.
- Use `Screen.footer` for fixed bottom actions rather than absolute positioning inside individual screens.
- Add accessibility labels or roles to icon-only controls and meaningful status icons.

## Verification Workflow

Choose verification based on the change, then run all required checks before committing.

For all app code changes:

1. Run `npm run lint`.
2. Run `npm test -- --runInBand`.

Also run the Android export when changing any of the following:

- navigation, providers, app bootstrap, or module initialization;
- Expo, React Native, Babel, or runtime dependencies;
- native-facing packages such as SQLite, safe-area handling, SVG, screens, gestures, or animation;
- imports or code paths that previously caused Expo Go startup errors;
- any fix where the user explicitly asks for confirmation that the app starts.

Use:

```powershell
npx expo export --platform android --output-dir .expo-export
```

An export proves that Metro can resolve and bundle the Android app; it does not replace a manual interaction check on Expo Go or an emulator. Report that distinction when relevant.

Testing priorities:

- validation and category rules;
- repository queries and row mapping;
- filter/date helpers and local-to-UTC boundaries;
- legacy Excel normalization;
- entry-form baseline and dirty-state comparison;
- loading and loaded behavior when code depends on `ready`.

Prefer helper-level tests over fragile screen snapshots. Document any navigation or visual interaction that remains manually verified.

## Dependency Changes

Before changing Expo or native-facing dependencies:

1. Inspect the current versions in `package.json`.
2. Confirm whether Expo Go compatibility must be preserved; assume it must unless told otherwise.
3. Use `npx expo install <package>` for Expo-managed packages.
4. Run `npx expo install --fix` after SDK-aligned dependency changes.
5. Recheck `package.json` and `package-lock.json` for a coherent Expo SDK 54 dependency set.
6. Run lint, tests, and the Android export.

Do not use `npm audit fix --force` as a substitute for an SDK-aligned dependency update. Keep dependency-only work separate from unrelated refactors.

## Git Workflow

Treat every branch other than `main` as a feature branch.

Before editing or committing:

- Inspect `git status` and preserve unrelated user changes.
- Use `main` as the default base unless the task specifies another branch.
- Before creating a feature branch from `main`, prefer `git pull --ff-only`.
- Name agent-created branches with the `codex/` prefix and a short task description.

When committing:

- Review the diff and staged diff before creating the commit.
- Exclude generated output, caches, secrets, and unrelated files.
- If the user asks to check in changes without narrowing scope, include all files belonging to the completed task.
- Use short descriptive English messages without Conventional Commits prefixes.
- Do not amend an existing commit unless the user explicitly asks.

After committing on a feature branch:

- Always push immediately after every successful commit; a request to check in changes implicitly includes this push.
- Push to the configured upstream when it exists.
- If no upstream exists, run `git push -u origin <branch>`.
- Verify that the push succeeded before reporting completion.
- If the push fails, keep the local commit, report the exact error, and do not claim that the remote branch or pull request was updated.

Never push directly to `main` unless the user explicitly requests it. Never use destructive commands such as `git reset --hard` or `git checkout --` to discard work unless the user explicitly authorizes that action.

### Closing A Feature Branch

When the user asks to "finish the branch" or "close the branch", use this exact workflow:

1. Inspect `git status` before performing any push, fetch, switch, or deletion.
2. If tracked or untracked changes are present, stop and ask whether to continue. Do not discard, stash, commit, or move those changes without the user's answer.
3. Record the current feature-branch name.
4. Push the feature branch if its commits are not already on its upstream. If no upstream exists, create one with `git push -u origin <branch>`.
5. Fetch the latest remote main branch with `git fetch origin main`.
6. Switch to the local main branch with `git switch main`.
7. Delete the recorded local feature branch with `git branch -d <branch>`.

Use safe deletion (`-d`), never forced deletion (`-D`), unless the user explicitly authorizes losing an unmerged local branch. Do not delete the remote feature branch unless the user asks. If `main` cannot be checked out because it is already attached to another worktree, stop and report that blocker instead of changing or deleting a different worktree.

## Issues And Pull Requests

- Use `main` as the default pull-request target unless another base is specified.
- Keep the PR summary concise and describe user-visible behavior rather than listing every file.
- Include lint, test, and Android-export results when they were required.
- State the target Expo SDK and Expo Go compatibility for dependency changes.
- Include screenshots for material UI changes when practical.
- Link the relevant issue and clearly separate verified behavior from remaining manual checks.
- If the branch already has an open PR, pushing new commits updates that PR; do not create a duplicate.
- After merge, delete local or remote feature branches only when the user requests cleanup.

When performing a review, compare the branch with both the original task and any issue or saved notes under `.agents/review/`. Call out scope drift, especially when a focused UI or bug-fix branch also changes the SDK or native dependency stack.
