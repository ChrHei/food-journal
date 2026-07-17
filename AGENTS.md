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

The principal repository directory is the control point and stays on `main`. Treat every other branch as a feature branch.

### Worktree Lifecycle

For every user-requested repository task, the main agent works in a dedicated worktree under `<repo>/.worktrees/`, whether or not subagents are involved. Continue using that worktree for the same task and feature branch; create a separate worktree for a separate feature branch. Never edit, stage, commit, or otherwise change feature work from the principal repository directory.

Before work on a feature task:

1. In the principal repository directory, inspect `git status` and preserve unrelated user changes.
2. Ensure the principal directory is on `main` (`git switch --ignore-other-worktrees main`), then run `git fetch origin main`.
3. Create the feature branch directly from `origin/main`, using the `users/chrhei/` prefix and a short task description, and add its dedicated worktree under `.worktrees/`.
4. Perform all task work in that feature worktree. Use `main` as the base unless the task specifies another branch.

For a read-only repository task, create a detached worktree based on `main` unless a branch is needed. Local `main` may be checked out in another worktree only for branch cleanup.

### Commit and Push Rules

- Review both the diff and staged diff before committing.
- Exclude generated output, caches, secrets, and unrelated files.
- If the user asks to check in changes without narrowing scope, include all files belonging to the completed task.
- Use short descriptive English commit messages without Conventional Commits prefixes. Do not amend an existing commit unless the user explicitly asks.
- Push immediately after every successful commit. Push to the configured upstream, or create one with `git push -u origin <branch>`, and verify that it succeeded before reporting it.
- If a push fails, keep the local commit, report the exact error, and do not claim that the remote branch or pull request was updated.
- Never push directly to `main` unless the user explicitly requests it. Never use destructive commands such as `git reset --hard` or `git checkout --` to discard work unless the user explicitly authorizes that action.

### Subagent Workflow

- Every subagent must work in a dedicated Git worktree that is separate from the parent agent's checkout and every other subagent's worktree. The parent agent must provision that worktree before delegating implementation work.
- A subagent must never switch branches, commit, stage, or otherwise change Git state in the parent agent's checkout or another subagent's worktree.
- Every subagent must choose a random feminine first name for itself before starting work, and use that name consistently in its task communication.
- The parent agent must learn that chosen name as soon as delegation starts. In every user-facing update, refer to the subagent directly by name; once the name is known, do not call it "the agent," say "the agent is named X," or expose its internal task identifier.
- When the user specifies a reasoning level for delegated work, pass that level to the subagent when spawning it.
- A subagent's final report must begin by introducing itself by its chosen name before reporting results, verification, or blockers.
- A subagent that implements a code or configuration change must create a ready-for-review pull request immediately after its first intentional commit has been pushed and the checks required before committing have passed. Do not wait for the implementation to be complete or for later, non-blocking verification.
- If a subagent reports that a required push or pull request is blocked, the parent agent must independently verify the failure and complete the publication step with its own available tools when possible. Do not end the requested implementation merely because the subagent's preferred GitHub tool failed.
- Use `main` as the pull request target unless the task specifies another base branch. Link the relevant GitHub issue when one exists.
- Push later commits to the same branch so they update the existing pull request; never create a duplicate pull request for the branch.
- Do not create a pull request for read-only investigation, planning, review-only work, or when the user explicitly says not to create one.
- Report the ready-for-review pull request URL promptly, then report completed checks and outstanding manual verification as the work continues.

### Closing A Feature Branch

When the user asks to "finish the branch" or "close the branch", use this exact workflow:

1. In the feature worktree, inspect `git status`. If tracked or untracked changes are present, stop and ask whether to continue; do not discard, stash, commit, or move them without the user's answer.
2. Record the feature branch and worktree path. Push the branch if its commits are not already on its upstream; create the upstream with `git push -u origin <branch>` when needed.
3. In the principal repository directory, switch to `main` with `git switch --ignore-other-worktrees main`, run `git fetch origin main`, then `git merge --ff-only FETCH_HEAD`.
4. Still in the principal directory on `main`, run `git worktree remove <feature-worktree-path>`. Never remove a worktree from inside itself.
5. Still in the principal directory on `main`, run `git branch -d <branch>`. If safe deletion fails because the branch is not merged into local `main`, stop and report that blocker; do not use `-D`.
6. Verify with `git worktree list` and `git branch --list <branch>`. If an unregistered, clean directory remains under `.worktrees/`, remove that exact directory. If Git could not remove it because of a Windows path-length error, first verify that it is unregistered and clean, then remove it with Windows long-path support. Never remove a registered worktree or a directory containing user changes.

Use safe deletion (`-d`), never forced deletion (`-D`), unless the user explicitly authorizes losing an unmerged local branch. Do not delete the remote feature branch or close its pull request unless the user explicitly asks.

## Issues And Pull Requests

- Treat GitHub CLI authentication errors reported inside the sandbox as potentially caused by blocked network access. If an important `gh` command fails with a socket, connection, or apparent token-validation error, retry the same command with approved network escalation before asking the user to authenticate again.
- Ask the user to run a new GitHub device authentication only when an escalated, unsandboxed GitHub request returns an explicit authentication failure such as HTTP `401` or `Bad credentials`. Do not infer that reauthentication is needed from a sandboxed `gh auth status` result alone.
- A GitHub connector response of `403 Resource not accessible by integration` means the connector lacks the required app or repository permission. It does not mean the user's GitHub CLI login is invalid. Fall back to an escalated `gh` command when that remains within the requested workflow.
- Do not describe a pushed branch or commit as a pull request until GitHub confirms that the pull request exists and provides its number or URL. When the workflow requires a pull request, verify its existence before reporting completion.
- When the user asks only to create or update a GitHub issue, make no code, configuration, dependency, test, or documentation changes in the same task. Create the issue only; implementation requires a separate explicit request.
- Create pull requests as ready for review. Do not create draft pull requests unless the user explicitly asks for a draft.
- Use `main` as the default pull-request target unless another base is specified.
- Keep the PR summary concise and describe user-visible behavior rather than listing every file.
- Include lint, test, and Android-export results when they were required.
- State the target Expo SDK and Expo Go compatibility for dependency changes.
- Include screenshots for material UI changes when practical.
- Link the relevant issue and clearly separate verified behavior from remaining manual checks.
- If the branch already has an open PR, pushing new commits updates that PR; do not create a duplicate.
- After merge, delete local or remote feature branches only when the user requests cleanup.

When performing a review, compare the branch with both the original task and any issue or saved notes under `.agents/review/`. Call out scope drift, especially when a focused UI or bug-fix branch also changes the SDK or native dependency stack.
