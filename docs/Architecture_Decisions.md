# Architecture Decisions Log

This document is the chronological log of all key architectural choices made during Project Astra's development.

---

## 1. Index of Decisions

*   **[ADR-0001](#adr-0001-store-consolidation--settings-split)**: Store Consolidation & Settings Split (Milestone 1.6)
*   **[ADR-0002](#adr-0002-decomposed-structured-knowledge-schema)**: Decomposed Structured Knowledge Schema (Milestone 1.7)
*   **[ADR-0003](#adr-0003-idempotent-syllabus-hierarchy-schema)**: Idempotent Syllabus Hierarchy Schema (Milestone 1.8)

---

## ADR-0001: Store Consolidation & Settings Split

### Status
Accepted (2026-06-30)

### Context & Problem
In the early prototype, state management was fragmented across duplicate stores (`appStore`, `sessionStore`, and `uiStore` in `src/stores/`). This caused overlapping updates, split-state bugs, and made hydration from SQLite difficult. Additionally, long-term user identity configs (name, exam goal) were mixed with operational preferences (sound volume, theme, wallpaper), leading to schema bloat.

### Decision
1.  Delete the duplicate `src/stores` directory.
2.  Unify UI routing and countdown variables inside a single `useUIStore` at `src/store/ui.store.ts`.
3.  Unify focus state machine controls in `useStudyStore`.
4.  Create `useSettingsStore` separating `identity` from `preferences`.

### Alternatives Considered
*   *Keep separate stores but sync via useEffect hooks*: Rejected due to high render cycles and race conditions.

### Consequences
*   **Positive**:
    *   Single source of truth for active focus state transitions.
    *   Clean segregation between student identity configs and visual preference states.
*   **Neutral**:
    *   All UI environments must import stores from `src/store/`.
*   **Negative**:
    *   Broke compatibility with initial onboarding layouts, requiring unified store refactoring.

---

## ADR-0002: Decomposed Structured Knowledge Schema

### Status
Accepted (2026-06-30)

### Context & Problem
The initial design stored the "Astra Brain" as a monolithic JSON text column inside a single-row SQLite table. This bypassed database type safety, compile-time SQL verification, and index optimization, while causing concurrent write bottlenecks.

### Decision
1.  Decompose the Brain data into normalized, typed SQLite tables (`memory_entries` and `adaptation_ledger`).
2.  Enforce strongly typed enums (`MemoryTier`, `MemoryCategory`) in frontend repositories and stores.
3.  Establish an offline, manual backup JSON export/restore sequence with schema metadata headers.

### Alternatives Considered
*   *Stay with single JSON file storage*: Rejected because we cannot query or index memory observations in sub-millisecond times as data grows.

### Consequences
*   **Positive**:
    *   Safe database transactions without concurrent file access locks.
    *   Clear audit log capabilities for the student via the Memory Sanctuary UI.
*   **Negative**:
    *   Adding new categories of memory requires writing standard SQLite schema migrations.

### Future Notes
*   As observations scale to thousands, the list query in `MemorySanctuary` will need cursor-based pagination.

---

## ADR-0003: Idempotent Syllabus Hierarchy Schema

### Status
Accepted (2026-06-30)

### Context & Problem
We need to model a full academic syllabus hierarchy: Subjects → Units → Chapters → Topics. Previously, we only had flat chapters in a single table, and changing this could destroy existing user configurations. Additionally, the task system was not connected to actual student progress.

### Decision
1.  Extend the existing `syllabus_chapters` table using safe, forward-only, idempotent alterations (`ALTER TABLE ADD COLUMN` programmatically guarded by `PRAGMA table_info` checks).
2.  Normalize sub-nodes into `syllabus_units` and `syllabus_topics` tables.
3.  Establish an asynchronous, event-driven academic changes bus (`AcademicEventBus`) to decouple services.
4.  Expose structured tree structures (`SubjectTree[]`) from the repository service layer to React components.
5.  Introduce a replaceable `IRevisionPolicy` to compute revision states.

### Alternatives Considered
*   *Recreate tables via DROP TABLE*: Rejected because it is destructive to student logs.

### Consequences
*   **Positive**:
    *   No data loss during upgrade cycles.
    *   Automatic, dynamic task queue compilation driven by topic completions.
*   **Negative**:
    *   Slightly more complex boot migration code to ensure column existence.
