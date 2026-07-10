# Milestone Evolution History

This document logs the chronological engineering history, design choices, and lessons learned during Project Astra's development milestones.

---

## Milestone 1.0 — 1.6: Local Storage & Session Engine

*   **Goal**: Establish local database storage, configure study session state machine transitions, create Tauri native window controls, and implement crash recovery checks.
*   **Implementations**:
    *   Migrations 1–4 establishing tables for `subjects`, `syllabus_chapters`, `tasks`, `study_sessions`, and `settings`.
    *   State store consolidation deleting old duplicate stores and creating unified `useUIStore`, `useStudyStore`, and `useSettingsStore`.
    *   `WindowService` managing Picture-in-Picture Mini-Timer window sizing and always-on-top modes.
    *   Local-time dynamic streak calculation and boot-time active session recovery.
*   **Key Decisions**:
    *   Segregated configurations into identity configurations (`userName`, `examinationGoal`) and preferences (`theme`, `wallpaper`, `recoveryEnabled`).
    *   Isolated the Recovery Break timer from the database study session log, managing it purely as a UI workflow.
*   **Lessons Learned**:
    *   Stored derived metrics (like study streaks) easily get out of sync on timezone changes; dynamically calculating streaks from database records is much more robust.
    *   Native window adjustments can block frontend rendering; executing window transformations asynchronously prevents UI lag.
*   **Technical Debt Avoided**: Removed duplicated files from `src/stores/` early, preventing state-sync bugs before the addition of memory features.

---

## Milestone 1.7: Structured Knowledge Foundation & Memory Storage

*   **Goal**: Decompose the monolithic JSON Brain concept into normalized, type-safe SQLite database schemas, create memory observation repositories, and build manual backup preview overlays.
*   **Implementations**:
    *   Migration 5 adding `memory_entries` and `adaptation_ledger` tables.
    *   Type-safe `MemoryTier` and `MemoryCategory` models in [memory.repository.ts](file:///c:/Projects/ASTRA/src/repositories/memory.repository.ts).
    *   `BackupService` implementing metadata header wrapping, file saves, and multi-stage restore confirmations.
    *   Memory Sanctuary tab interface displaying observation cards and system adaptation placeholders.
*   **Key Decisions**:
    *   Defined the boundaries of the **Memory Subsystem**: memory is strictly limited to intentional cognitive observations (rhythms, confidence); preferences, settings, and raw session logs are kept isolated.
    *   Disabled manual editing of memory contents, supporting only "Mark Incorrect" or "Delete" commands to preserve data integrity.
*   **Lessons Learned**:
    *   Decoupling the Memory storage layer from the AI provider allows writing safe repository tests and ensures the core foundation runs offline without an active cloud LLM model.
*   **Technical Debt Avoided**: Blocked the storage of raw JSON strings inside sqlite rows, preventing data truncation and un-indexed queries as observations scale.

---

## Milestone 1.8: Syllabus Engine & Task Intelligence

*   **Goal**: Integrate a normalized syllabus hierarchy, derive academic node states dynamically, auto-generate priority tasks from topic completion events, and construct expandable track list widgets.
*   **Implementations**:
    *   Migration 6 adding `syllabus_units`, `syllabus_topics`, `chapter_dependencies` tables and altering `syllabus_chapters` and `tasks` safely.
    *   `SyllabusService` dynamically compiling `SubjectTree` collections.
    *   `AcademicEventBus` emitting academic state change event signals.
    *   `TaskIntelligenceService` listening to events, compiling pending queue, and updating tasks store.
    *   Syllabus track accordion lists displaying locked/ready/active/completed/revision badges.
*   **Key Decisions**:
    *   Refused destructive migration resets, adding columns to protect preexisting study sessions database records.
    *   Subscribed the task queue compiler directly to the event bus, regenerating suggestions in real-time when the student completes topics.
    *   Created `DefaultAcademicDataset` to separate the curriculum seed content from the seeding logic in `SeedService`.
*   **Lessons Learned**:
    *   Synchronous state alterations inside effects lead to cascading renders; wrapping in setTimeout safely schedules updates in separate ticks.
*   **Technical Debt Avoided**: Derived chapter statuses at runtime rather than saving them in database columns, preventing out-of-sync state drifts.
