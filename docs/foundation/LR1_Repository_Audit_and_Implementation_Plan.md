# LR-1 Repository Audit & Implementation Plan

This document serves as the authoritative bridge between the accepted [Learning Record Engineering Contract (LR-0)](file:///c:/Projects/ASTRA/docs/learning-record/Learning_Record_Engineering_Contract.md) and the implementation of LR-1. It remains the canonical implementation reference until LR-1 is completed.

Its core objective is to **reduce engineering uncertainty** and define the step-by-step path to establish the Learning Record Foundation. Every engineering decision is guided by: **"What future bug does this decision prevent?"**

---

## 1. Core SQLite Schema & Repository Audit

### Active Database Schema (defined in `src/repositories/db.ts`)
*   `schema_migrations` (version, applied_at)
*   `settings` (key, value)
*   `subjects` (id, name, color, emoji)
*   `syllabus_chapters` (id, name, subject_id, is_completed, progress_bar, unit_id, sequence_order, last_studied_at)
*   `tasks` (id, title, subject_id, priority, status, generated_from_chapter_id, task_type)
*   `study_sessions` (id, subject_id, chapter_id, topic, planned_duration, actual_duration, started_at, completed_at, status, reflection, was_interrupted)
*   `memory_entries` (id, tier, category, content, evidence, relevance_score, created_at, last_accessed, expires_at, is_incorrect, is_permanent)
*   `adaptation_ledger` (id, action_taken, rationale, created_at)
*   `syllabus_units` (id, name, subject_id, sequence_order)
*   `syllabus_topics` (id, name, chapter_id, is_completed, completed_at, sequence_order)
*   `chapter_dependencies` (chapter_id, prerequisite_chapter_id)

### Active Repository Files (`src/repositories/`)
*   `db.ts` — Connection getter and migration definitions (V1–V7).
*   `sqlite.repositories.ts` — Implements `SQLiteSessionRepository`, `SQLiteTaskRepository`, `SQLiteSettingsRepository`, `SQLiteMemoryRepository`, `SQLiteAdaptationLedgerRepository`.
*   `syllabus.repository.ts` — Implements `SQLiteSyllabusRepository` and `InMemorySyllabusRepository`.
*   `session.repository.ts`, `task.repository.ts`, `settings.repository.ts`, `memory.repository.ts` — Interfaces and InMemory fallbacks.

---

## 2. Ownership Audit

| Subsystem / State | Current Owner | Recommended Layer Authority (Single Owner) | Rationale |
|---|---|---|---|
| **Session State** | `useStudyStore` (Zustand) & `SessionService` | `SessionService` (Logic) & `SessionRepository` (Storage) | Store should only act as a reactive memory cache. All calculations and ticks are controlled by the Service. |
| **Analytics** | Hardcoded inline in `BootService` | `AnalyticsService` | *Overlapping Ownership:* `BootService` currently performs streaks and duration sums inline. Moving this to `AnalyticsService` prevents code bloat and creates a single analytics compiler. |
| **Persistence** | Repositories Layer | Repositories Layer | Confirms with LR-0. UI/Stores never write SQL. |
| **Backup & Restore** | `BackupService` | `BackupService` | Operates file I/O but must delegate SQL operations to repository transactions. |
| **Database Migrations**| `initializeDatabase` in `db.ts` | Database Client Module (`db.ts`) | Centralized execution on boot. |
| **Interruption Recovery**| `BootService` (Inline check) | `SessionService` | Recovery check should be orchestrated by the `SessionService` to keep boot code clean. |
| **UI State** | `useUIStore` | `useUIStore` | Manages transient sidebar and tab values. |
| **Business Rules** | Services Layer | Services Layer | Orchestrates timers, checklist evaluations, and validations. |

---

## 3. Dependency & Coupling Audit

*   **Task-Syllabus Coupling (High Risk):** `taskService.toggleTask()` directly reads `syllabusRepo` and writes `isCompleted` states to `syllabus_topics`. This is a severe architectural boundary violation. Checking a task checkbox directly mutates syllabus completion.
    *   *Future Bug Prevented:* Prevents out-of-sync academic progress where topic state is altered by non-academic task checklists.
*   **Circular Imports workarounds:** `syllabus.service.ts` uses a dynamic `await import('../events/academic_event')` to emit event signals. This was done to prevent bundler circular locks because the event bus was imported globally.
*   **The God Object (BootService):** `BootService` imports almost all stores, repositories, and services, executing analytics calculations (streak, total seconds, summaries) inline.
    *   *Future Bug Prevented:* Prevents boot failure if a single minor analytics calculation throws a null pointer error.

---

## 4. Current Feature Inventory

*   **Timer (Keep):** Net timer tick interval logic in `SessionService` is robust and handles pausing/resuming cleanly.
*   **Reflection (Refactor):** Keep reflection screen but prepare to save output into append-only `learning_entries` in future milestones.
*   **Recovery Breaks (Keep):** Post-session 5-minute break timer managed by `useUIStore` works well.
*   **Statistics (Refactor):** Extract compilation logic from `BootService` and move it to `AnalyticsService`.
*   **Tasks Checklist (Refactor):** Strip out syllabus completion side-effects from `taskService.toggleTask()`.
*   **Work Queue (Keep):** `TaskIntelligenceService` compiles focus tasks cleanly. Reframe UI labels to "Work Queue".
*   **Syllabus Tree (Keep):** Dynamic tree structure aggregation in `SyllabusService.getSyllabusTree` is relational and solid.
*   **Settings Preferences (Keep):** Clean segregation of identity name/goal and system theme/volume works.
*   **Mini Timer (Keep):** Tauri Picture-in-Picture window mode parameters are stable.

---

## 5. Complexity Audit

1.  **Streaks Calculation (Line 147-196 in `boot.service.ts`):** High complexity. Converts dates to local string arrays and runs loops. This should be encapsulated inside `AnalyticsService` as a clean dynamic query.
2.  **Idempotency Checks in `db.ts`:** Uses nested `PRAGMA table_info` checks to verify columns. This is verbose but required for SQLite forward alterations. Keep but refactor to ensure cleanliness.

---

## 6. Legacy Cleanup Candidates

*   `src/store/astra.store.ts` — **Delete.** This is a placeholder chat store with zero active features or bindings.
*   `src/services/analytics.service.ts` — **Rebuild.** Current code is a 17-line stub returning empty arrays/objects.
*   `study_sessions.was_interrupted` & `reflection` columns — **Preserve for now.** These will be superseded by learning entries in LR-2 but must remain active during LR-1 to prevent database migration failures.

---

## 7. Architecture Worth Preserving

*   **Repository Interfaces (`ISessionRepository`, etc.):** The mock/sqlite factory switching (`RepositoryFactory.setMode`) is highly elegant, enabling offline unit testing without local SQLite file dependencies.
*   **Zustand Store Isolation:** The stores folder is well-structured, with UI and Study state segregated.
*   **Environments Architecture:** Page views in `src/environments/` bind state stores to presentation components cleanly.

---

## 8. Gap & Debt Analysis (vs LR-0)

*   **Analytics Calculation Drift:** Startup calculation is hardcoded in boot and does not reconcile daily boundaries.
*   **Non-Atomic Backup Restore:** `BackupService` performs table deletes (`DELETE FROM tasks`) and inserts sequentially without database transactions. If one step fails, the user's database is corrupted.
    *   *Future Bug Prevented:* Prevents complete loss of study history if a restore file is malformed or interrupted.
*   **Exposed Inactive UI:** The "Memory Sanctuary" settings tab and "Astra Companion" dashboard card are visible despite being blocked/stubbed.

---

## 9. LR-1 Implementation Strategy (Sub-Milestones)

To keep implementation safe and incrementally testable, LR-1 is divided into four sequential sub-milestones:

### LR-1A: Infrastructure Quarantine
*   **Objective:** Quarantine inactive developer and placeholder surfaces.
*   **UI Rules:** **Prefer hiding over deleting** for inactive user-facing features (e.g. companion layouts, memory settings tab, playground tab) unless the code is completely dead, so that future milestones can easily reuse the code blocks.
*   **Hiding Toggles:**
    1. *Sidebar Playground:* Remove playground navigation item from `Sidebar.tsx` and disable page routing in `AppShell.tsx`.
    2. *Memory Sanctuary:* Remove the `activeSubTab === 'memory'` subtab button inside `SettingsEnvironment.tsx`. Do not delete the rendering logic.
    3. *Companion Card:* Hide or comment out the placeholder `Astra Companion` status widget on the dashboard, replacing it with a clean, active task queue summary layout.

### LR-1B: Reconciled Analytics
*   **Objective:** Create a query-based analytics layer independent of boot logic.
*   **Design Rule:** Build a clean, query-based, modular `AnalyticsService` for study sessions but **do not over-engineer it** for future learning record structures yet. Build the service to solve today's metrics; do not optimize for the final Learning Record model prematurely.
*   **Analytics Methods:**
    *   `getDailyTotals()`: Dynamic SQLite query return grouped durations.
    *   `getStats()`: Dynamic query output mapping to store parameters: `todaySeconds`, `weekSeconds`, `lifetimeSeconds`, `subjectStats`.
*   **Boot Service cleanup:** Replace the complex, inline streak and sum loops in `BootService` with direct calls to `AnalyticsService`.

### LR-1C: Transactional Backup & Recovery
*   **Objective:** Secure backup restoration from mid-operation failures.
*   **Database transactions:** Wrap all delete and restore insert queries in `BackupService.confirmRestore` inside a single `BEGIN TRANSACTION` / `COMMIT` SQLite query block.
*   **Pre-Restore Rollback Snapshot:** Copy the active `astra.db` file to a temporary backup path (e.g. `astra.db.bak`) before running restore. If the transaction fails, automatically catch the error, execute rollback, and restore the backup file copy.

### LR-1D: Legacy Cleanup
*   **Objective:** Purge dead, unused prototype store assets.
*   **Deletions:** Cleanly remove `src/store/astra.store.ts` file and remove its imports from `src/store/index.ts`.

---

## 10. Technical Risk Priority

*   **CRITICAL: Database Corruption during Restore:** (Mitigation: Wrap inserts in SQLite transaction; write a pre-restore backup file for file-level rollback).
*   **HIGH: Timezone / Midnight Transition Analytics Drift:** (Mitigation: Use standardized `datetime('now', 'localtime')` in repositories and query sessions within boundaries).
*   **MEDIUM: Circular import locks in Services:** (Mitigation: Extract shared event types to separate event bus definitions).

---

## 11. LR-2 Impact Plan

*   By implementing a clean, modular `AnalyticsService` interface now, we ensure that in LR-2, the analytics service queries can join `learning_entries` internally without requiring any changes to React environments or Zustand store bindings.

---

## 12. Commit Strategy

1.  **Commit 1 (LR-1A):** Quarantine inactive developer and placeholder surfaces.
    *   *Message:* `ui: hide inactive companion, memory settings, and developer playground`
2.  **Commit 2 (LR-1B):** Rebuild AnalyticsService and reconcile study store totals.
    *   *Message:* `refactor: move statistics and streak calculations to AnalyticsService`
3.  **Commit 3 (LR-1C):** Implement transactional backup restore and rollback backup copy.
    *   *Message:* `data: secure backup restore with sqlite transaction and file rollback`
4.  **Commit 4 (LR-1D):** Clean up `astra.store.ts` and verify all tests pass.
    *   *Message:* `cleanup: delete unused astra chat store and verify test suite`

---

## 13. Principal Refusal Rule

**I will absolutely refuse to implement any local LLM integrations or cloud provider keys (such as Ollama or Gemini parameters) during LR-1, even if requested as "simple stubs."**
*   *Why:* The factual database substrate must be stable and verified before any AI interpretation can be introduced. Pre-mature integration violates ADR-0005 and increases risk of hallucination loops.

---

## 14. Definition of Success (Commit Invariants)

Each commit is verified against these explicit pass conditions:

1.  **Commit 1 (LR-1A) succeeds if:**
    *   No placeholder AI companion or Memory Sanctuary settings tabs are visible in the UI.
    *   Vite frontend compiles with zero errors.
2.  **Commit 2 (LR-1B) succeeds if:**
    *   Focus statistics (`todaySeconds`, `weekSeconds`, `lifetimeSeconds`, and `subjectStats`) are derived entirely from queries to `AnalyticsService`.
    *   `BootService` contains no inline streak loops or statistics aggregation code.
    *   Test suite passes cleanly.
3.  **Commit 3 (LR-1C) succeeds if:**
    *   A restore action is atomic (all tables restored or none).
    *   An interrupted restore does not corrupt the user's database or leave tables empty.
4.  **Commit 4 (LR-1D) succeeds if:**
    *   Dead `astra.store.ts` file is deleted and its imports are pruned.
    *   Test suite and frontend typecheck succeed.

---

## 15. LR-1 Readiness Verdict

**Yes.** Astra is ready for LR-1 implementation. All database schemas, repository files, and UI layouts have been audited, the gaps are mapped, and the commit sequences are defined.
