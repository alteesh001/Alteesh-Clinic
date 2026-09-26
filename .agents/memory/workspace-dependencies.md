---
name: Workspace dependencies
description: Dependency installation requirement after restoring this monorepo
---

Restored or newly opened workspace copies may not contain usable node_modules even when pnpm-lock.yaml is present. Run the workspace dependency installation before restarting Vite/API workflows or interpreting typecheck failures.

**Why:** The initial workflow failures were missing Vite, Node types, and server dependencies rather than application errors.

**How to apply:** If a workflow reports `command not found` or TypeScript cannot resolve installed packages, install from the existing lockfile first, then rerun checks.