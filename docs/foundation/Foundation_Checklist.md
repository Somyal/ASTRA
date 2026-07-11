# Foundation Checklist

**Update rule:** Change this checklist only after implementation and verification. Statuses: `Complete`, `Stable`, `Needs Polish`, `Needs Rewrite`, `Blocked`, `Planned`.

| Subsystem | Status | Current milestone note | Exit condition |
|---|---|---|---|
| Focus Engine | Needs Rewrite | Timer works but is not linked to a Learning Action or robust elapsed-time semantics. | Accurate, accessible focus linked to a confirmed action. |
| Session Lifecycle | Needs Rewrite | State machine and checkpoints exist. | Durable persistence, recovery, and structured outcome integration. |
| Recovery Breaks | Needs Polish | Fixed five-minute UI flow exists. | Optional/configurable and validated against focus flow. |
| Learning Record | Planned | ADR-0004 accepted; no model exists. | Action, session, outcome, evidence, and topic semantics are implemented and explainable. |
| Syllabus Engine | Needs Rewrite | Hierarchy/dependencies exist but progress is mutated by tasks. | Uses explicit evidence/state transitions only. |
| Task Intelligence / Work Queue | Needs Rewrite | Generated queue exists without reasons or override model. | Explainable recommendations derived from Learning Record. |
| Memory System | Blocked | Storage/UI shell exists; no safe source pipeline. | Evidence-linked, reviewable, bounded memory after Evidence Engine. |
| Backup System | Needs Rewrite | Partial JSON backup/restore exists. | Complete, atomic, verified recovery with safety snapshot. |
| Dashboard / Today | Needs Rewrite | Competing form, companion, syllabus, and task widgets. | One confirmed next action with transparent alternatives. |
| Analytics | Needs Rewrite | UI exists but totals are not reliable. | Query-backed, reconciled progress and history. |
| Insights | Blocked | Empty/generic UI exists. | Evidence-linked actionable insights with correction controls. |
| Astra Companion | Blocked | Static UI and stub service path exist. | Bounded evidence-linked proposal use case and consent. |
| Settings | Needs Polish | Basic settings exist. | Neutral setup, single persistence source, ownership/accessibility controls. |
| Onboarding | Planned | Defaults are seeded; no onboarding exists. | First action can be reached in under two minutes with editable context. |
| Testing | Needs Rewrite | Narrow unit tests exist. | Core-loop, recovery, migration, restore, keyboard, and accessibility acceptance coverage. |
| Packaging | Needs Polish | Frontend build and Rust check pass. | Release migration/recovery path verified. |
| Performance | Needs Polish | No measured product budget. | Boot, timer, queue, history, and export budgets measured. |
| Bug Tracker | Stable | Process and historical entries exist. | Kept current with verified fixes and no untracked core defects. |
| Documentation | Needs Revision | Strong documents, but earlier architecture/product claims drift from runtime. | Shipped/experimental/planned/internal status maintained. |
