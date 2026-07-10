# Architecture Decision Record — Decomposed Structured Knowledge Schema

*   **Status**: Accepted
*   **Date**: 2026-06-30
*   **Decided by**: Antigravity, ASTRA Lead Architect

---

## Context & Problem Statement

In the early design of ASTRA, the "Astra Brain" (storing student learning habits, profiles, rhythm stats, and active context) was envisioned as a monolithic JSON document, saved in a single-row text column in SQLite or as a single `brain.json` file. 

This model presents significant software maintenance risks:
1.  **Lack of Type Safety & Validation**: Compilers and schema verification engines (such as Rust `sqlx` or TypeScript lints) cannot verify or constrain the contents of an opaque JSON text field, leading to runtime failures if schemas drift.
2.  **Concurrency Conflicts**: Background consolidation passes, active study session checkpoints, and local AI reasoning prompts would need to read and rewrite the entire document concurrently. This causes write serialization blocks or data clobbering.
3.  **Data Durability & Recovery Hazards**: In local-first setups, a single corrupted byte in the JSON file could render the entire student profile lost. Rolling back updates becomes extremely difficult if migrations are stored as hand-written JSON transformations.
4.  **Information Leakage**: Conflating configuration preferences (like UI themes) with synthesized cognitive observations (like study curves) leads to an bloated domain model that degrades scalability.

---

## Decision

We will decompose the monolithic Brain document into **strongly typed, normalized, individually-writable SQLite tables** under full compiler schema control. 

Specifically:
1.  **Isolate Settings & Raw Logs**: User preferences, identity stats, and raw study log entries remain in their respective dedicated tables. They are treated as operational data, *not memory*.
2.  **Normalized Memory Schema**: Create a `memory_entries` table storing intentional, synthesized observations about the student's journey. Categories and tiers are governed by type-safe enums in code.
3.  **Audit Ledger**: Create an `adaptation_ledger` table to audit all automated adaptations.
4.  **Local-First Backups**: Implement a manual Backup Subsystem that serializes the SQLite repositories into a portable JSON structure with metadata (`schemaVersion`, `astraVersion`, etc.), protecting the student against disk corruption or encryption key loss.

---

## Consequences & Future Implications

*   **Positive**:
    *   **Compile-Time Verification**: All fields, foreign keys, and indexes are under full database schema control.
    *   **Sub-Millisecond Queries**: Observation records can be indexed and queried dynamically by category or tier, enabling fast loading times even after years of study.
    *   **No Concurrency Blocks**: Session ticking logs can write to SQLite without blocking background observation reads.
    *   **Auditability**: Students gain total visibility via the Memory Sanctuary to inspect, delete, or mark incorrect any memory observation.
*   **Neutral**:
    *   **No Sync-Blockers**: Schema design remains compatible with sync protocols (CRDTs or table-level delta merges) in future milestones.
*   **Negative**:
    *   **Schema Rigidity**: Adding new fields to structured memory tables requires standard SQLite migration scripts rather than dynamic JSON appends. This is a welcome trade-off to guarantee stability.
