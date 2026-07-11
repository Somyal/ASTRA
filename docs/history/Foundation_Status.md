# Foundation Status

**Assessment date:** 2026-07-11  
**Meaning:** This is a product-readiness assessment, not a claim that code compiles. It records whether each foundation subsystem can safely support the Learning Record and core learning loop.

| Foundation subsystem | Status | Current state | Required before it supports v1 |
|---|---|---|---|
| Local-first runtime | Stable | Core frontend runs locally with SQLite through Tauri SQL. | Maintain offline core while removing inactive cloud/AI claims. |
| SQLite persistence | Needs Revision | Core tables and repositories exist. | Transactional migrations, safe upserts, defined constraints, and clean error boundaries. |
| Session lifecycle | Needs Revision | Configure/start/pause/resume/complete/archive exists. | Durable errors, timestamp-accurate time, Learning Action link, and structured outcome. |
| Focus engine | Needs Revision | Focus timer and window modes exist. | Accurate elapsed-time semantics and keyboard/accessibility acceptance. |
| Crash recovery | Needs Revision | Boot abandons active session and preserves some time. | Explicit user-facing recovery policy, deterministic ordering, and recovery tests. |
| Recovery breaks | Needs Polish | Five-minute UI-only recovery timer exists. | Configurable/optional behavior and validation that it aids rather than interrupts flow. |
| Syllabus hierarchy | Needs Revision | Subjects, units, chapters, topics, dependencies, and tree compilation exist. | Content packs, explicit progress evidence, and correction UX. |
| Tasks / Work Queue | Needs Rewrite | Tasks and generated study/revision items exist. | Remove task-to-topic mutation; add reason codes, overrides, and stable recommendation history. |
| Learning Record | Planned | No dedicated model or persistence boundary exists. | Implement before planning, memory, or companion work. |
| Analytics | Needs Rewrite | Cards/chart/history UI exists. | Query-backed daily/weekly/lifetime definitions and reconciliation tests. |
| Streaks | Needs Revision | Dynamically calculated from completed session dates. | Shared day-boundary policy, correct definitions, and demoted product prominence. |
| Backup/export | Needs Rewrite | JSON export and destructive restore preview exist. | Complete data coverage, atomic restore, safety snapshot, validation, and verification. |
| Settings | Needs Polish | Profile, sound, appearance, recovery, and backup UI exist. | Single theme source of truth, neutral defaults, accessibility/data-ownership settings. |
| Onboarding | Planned | Defaults are seeded at boot; no first-run journey. | Two-minute, editable setup to establish real student/curriculum context. |
| Memory system | Blocked | Table/repository/UI shell exists; no operational source or provenance. | Wait for Evidence Engine and safe memory policy. |
| AI companion | Blocked | Placeholder frontend state and Rust provider/service stubs exist. | Wait for evidence-linked proposal use case, consent, and offline-core criteria. |
| Insights | Blocked | Empty/generic analytics section exists. | Wait for sufficient evidence and one actionable insight standard. |
| Event system | Needs Revision | In-process event bus coordinates refresh/recompile behavior. | Correct event semantics, narrower triggers, and idempotent consequences. |
| Native/Rust service layer | Needs Revision | Tauri shell works; several domain/AI services are stubs. | Either clearly quarantine stubs or establish one deliberate authoritative runtime path. |
| Testing | Needs Revision | 11 unit tests pass for error boundary/session timer slice. | Core-loop, migration, backup/restore, interruption, keyboard, accessibility, and end-to-end coverage. |
| Packaging | Needs Revision | Frontend build and Rust check pass. | Release-path validation, data migration testing, and recovery verification. |
| Performance | Needs Polish | Small local data likely performs adequately. | Measure boot, timer drift, history growth, queue generation, and export with real records. |
| Bug tracker | Stable | Process and four historical entries exist. | Record new implementation defects as discovered; distinguish product debt from bugs. |

## Foundation conclusion

The foundation is not complete. It is **usable as a prototype foundation** for a local timer and syllabus UI, but it is not ready to support product claims about trustworthy learning records, planning intelligence, memory, or AI. Phase 1 of Product Roadmap v2 is the required completion path.
