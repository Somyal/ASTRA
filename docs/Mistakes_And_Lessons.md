# Mistakes & Lessons Log

This document is the historical record of architectural mistakes, code drifts, and operational lessons discovered during Project Astra's lifecycle.

---

## 1. Store Duplication (Milestone 1.6)
*   **The Mistake**: Writing three separate stores (`appStore.ts`, `sessionStore.ts`, `uiStore.ts`) in an untyped folder layout. This led to state synchronization lag, overlapping imports, and duplicated properties (e.g. tracking recovery break counters in study session stores).
*   **The Lesson**: Consolidate state stores into a single, unified store folder (`src/store/`), with each file managing one explicit subdomain (UI, Sessions, Settings).

---

## 2. Persisting Derived Values (Milestone 1.6)
*   **The Mistake**: Persisting student study streaks (`streakDays = 5`) as static properties in settings rows. This creates a data sync hazard if the student changes timezones, changes computer clocks, or updates their daily reset hour.
*   **The Lesson**: Stored derived data is an anti-pattern. Calculate streaks and study focus totals dynamically on boot from the raw `study_sessions` tables.

---

## 3. Monolithic JSON Brain State (Milestone 1.7)
*   **The Mistake**: Designing the student's cognitive model (Astra Brain) as a single monolithic JSON blob stored in a text column. This bypassed compiler verification, made concurrent background writes block the main thread, and put the database at risk of single-point-of-failure corruption.
*   **The Lesson**: Decompose the Brain document into individual SQLite tables (`memory_entries`, `adaptation_ledger`). The complete brain model is a virtual, runtime representation rather than a database storage shape.

---

## 4. Typeless `any` variables (Milestone 1.7)
*   **The Mistake**: Relying on typeless arrays (`let recoveredSessionRecord: any = null`) in the boot service checks, triggering linter checks and compiler warnings.
*   **The Lesson**: Avoid shortcuts in TypeScript typing. Always import model interfaces (`StudySession`) and specify exact null/union bounds.

---

## 5. Synchronous setState in useEffect (Milestone 1.8)
*   **The Mistake**: Calling `setState` synchronously within a `useEffect` hook block (e.g., `setSelectedSubject(topPending.subjectId)`) to synchronize input states on dependency updates. This triggers React warning cycles, slows down UI transitions, and causes cascading synchronous render loops.
*   **The Lesson**: Wrap synchronizing React state setters inside `setTimeout(..., 0)` or `requestAnimationFrame` blocks to safely defer rendering updates to a separate execution frame.

---

## 6. Windows File Locking during Tauri Compile (Milestone 1.8)
*   **The Mistake**: Running `npm run tauri dev` directly on Windows with IDE watchers (like Rust Analyzer check-on-save or VS Code file explorer watchers) active. The high-speed generation of object files (`.o`, `.rlib`) triggers background indexing and scans, locking directories and causing `os error 32` (file used by another process) compilation crashes.
*   **The Lesson**: Set `CARGO_TARGET_DIR` environment variable to a directory outside the workspace (e.g. `$env:CARGO_TARGET_DIR="C:\Users\Gautam\.gemini\antigravity-ide\astra-target"`) to keep it completely invisible to editor file watchers.
