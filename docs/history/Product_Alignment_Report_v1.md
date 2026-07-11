# Product Alignment Report v1

**Date:** 2026-07-11  
**Scope:** Implementation audit against Product Recalibration v1, Product Identity, Product Roadmap v2, Product Debt, Immediate Next Steps, and ADR-0004/0005.  
**Constraint:** This report makes no product or code changes. It is the bridge from the current Milestone 1.8 implementation to the accepted product direction.

## Executive summary

Astra has a useful local desktop foundation, but it does not yet implement the product it now describes. The current application is a session timer with a seeded syllabus, task compilation, basic history, and settings. It is not yet a Learning Operating System because the authoritative Learning Record described in ADR-0004 does not exist.

The shortest path is not adding AI, memory, sound, sync, or more dashboard widgets. It is:

1. make existing records correct and recoverable;
2. define and implement the Learning Record boundary;
3. make a chosen learning action flow through focus and an honest outcome;
4. derive a transparent next action from that record; and
5. remove or hide every surface that claims value before it delivers it.

The implementation has enough reusable material to take this path: SQLite repositories, a session state machine, syllabus hierarchy, local stores, a focus screen, and a task queue. Those systems need redefinition and simplification, not replacement for its own sake.

## Current product-flow audit

| Learning-loop step | Current implementation | Alignment | Break in the loop | Required direction |
|---|---|---|---|---|
| **Choose** | Dashboard offers subject, duration, and free-text topic. It separately pre-fills from the first pending task. | Partial | There is no durable learning action, no confirmation of a recommendation, no reason for a recommendation, and free-text topic can disagree with syllabus/task data. | Introduce a confirmed Learning Action with a clear source and optional override. |
| **Focus** | `SessionService` configures, starts, pauses, resumes, checkpoints, and completes a timer. | Mostly present | Session state records time, but not a stable learning-action identity. Persistence failures are logged and the session continues. | Link sessions to Learning Actions and make persistence/recovery semantics explicit. |
| **Record outcome** | Completion asks for one mood and two optional text fields. | Partial | It does not capture moved forward / partly / retry; mood mixes dimensions; reflection has no defined downstream effect. | Replace the default completion interaction with a one-tap outcome plus optional evidence/note. |
| **Update Learning Record** | Task toggling can mark the first topic complete and update chapter study time. `syllabusService.toggleTopicCompletion` separately toggles topics. | Absent / conflicting | Task state, topic state, session state, and reflection are not distinct evidence types. Checking an auto task can alter academic progress. | Create separate commands and data semantics for task completion, learning outcome, topic evidence, and mastery. |
| **Recommend next** | `TaskIntelligenceService` regenerates pending auto tasks from topic/chapter status and a fixed seven-day revision policy. | Partial | There are no reasons, no student accept/defer/dismiss state, no capacity/deadline model, and no outcome evidence. Queue generation deletes pending generated tasks on each pass. | Evolve this into a transparent deterministic work queue after the Learning Record is stable. |

### Exact current flow conflicts

- `DashboardEnvironment` chooses the first pending task and extracts a topic by removing text prefixes. This treats display text as domain data.
- `SessionService.completeReflection()` saves free text and mood, then archives; it does not update a learning action or topic evidence.
- `TaskService.toggleTask()` marks the first uncompleted topic complete for `auto_study`, and changes `lastStudiedAt` for revision tasks. This directly violates ADR-0004.
- `TaskService.createTask()` emits a `TaskCompleted` event immediately after creating a task. The event name is false and causes unnecessary queue recalculation.
- `SyllabusService.toggleTopicCompletion()` and `TaskService.toggleTask()` are two competing mutation paths for topic state.
- `TaskIntelligenceService` listens to every academic event and rebuilds the queue, including events with no semantic relation to recommendation changes.

## Navigation and screen audit

### Recommended hierarchy

1. **Today** — one confirmed next learning action, alternatives, and a compact plan.
2. **Focus** — only the selected action and focus controls while active.
3. **Progress** — truthful learning record, history, revision state, and analytics after their data model is corrected.
4. **Settings** — profile, accessibility, recovery preferences, and safe data ownership tools.

Navigation may temporarily retain Syllabus as a supporting detail view if it is needed to choose or inspect an action. It must not compete with Today as a second dashboard.

| Current screen/surface | Decision | Evidence | Product rationale |
|---|---|---|---|
| Dashboard | **Keep, rewrite around Today** | It currently holds the start form, companion card, syllabus widget, and queue. | It should answer one question: what is the next useful action? |
| Focus Sanctuary | **Keep** | It is the clearest current expression of protected focus. | Strengthens Pillar 3: Protected focus. |
| Completion / reflection | **Keep, simplify** | Current form captures mood and optional text only. | Must become the honest-outcome bridge in the core loop. |
| Recovery break | **Keep as preference, not a destination priority** | It is a UI-only five-minute timer. | It can protect focus, but must remain optional and configurable. |
| Syllabus accordion | **Keep as supporting context** | Hierarchy and dependencies are useful. | It should help choose/inspect learning actions, not become a competing control plane. |
| Task queue | **Keep, rename and rework** | The queue is deterministic, not intelligence. | It becomes an explainable Work Queue in Phase 3. |
| Analytics | **Keep only after correction** | UI presents today/week/lifetime/recent sessions from unreliable store values. | Trustworthy progress is valuable; false analytics is harmful. |
| Astra Companion card | **Remove from primary UI now** | Static copy says Astra is monitoring focus rhythm. | Creates expectation debt and conflicts with ADR-0005. |
| Insights section | **Remove/hide now** | It is empty or gives generic weekly encouragement. | No evidence-linked insight exists. |
| Memory Sanctuary | **Hide from primary settings** | Repository/UI exists, but no creation/provenance path exists. | Memory should appear only when it safely changes planning. |
| Adaptation audit placeholder | **Remove/hide** | Explicit “Coming Soon” inactive surface. | Internal architecture is not student value. |
| Components Playground | **Remove from production navigation** | Sidebar exposes a development showcase. | It is internal tooling and violates one polished experience. |

## Product Debt verification

This table verifies implementation state rather than repeating Product Debt definitions.

| Product Debt | Implementation finding | Audit assessment |
|---|---|---|
| PD-001 Product identity ahead of product | Active UI still describes Companion monitoring and exposes “Insights.” Rust AI layer is stubbed; frontend chat store is placeholder. | Implemented incorrectly in product copy; remove expectation debt before adding capability. |
| PD-002 Session mistaken for learning | `StudySession` holds subject/topic/duration/reflection/mood only; no learning action or evidence relation exists. | Missing. |
| PD-003 Task completion mutates syllabus | `TaskService.toggleTask()` marks an auto-study task's first uncompleted topic complete. | Implemented incorrectly; direct ADR-0004 conflict. |
| PD-004 Untrustworthy analytics | Boot sets `todaySeconds` to all session total and does not hydrate weekly/monthly totals. | Implemented incorrectly. |
| PD-005 Unsafe recovery | Backup excludes syllabus and adaptation ledger; restore deletes/writes tables without transaction or safety snapshot. | Partially implemented, unsafe. |
| PD-006 Inactive intelligence | Companion, Insights, Memory Sanctuary, and adaptation placeholder remain exposed. | Implemented incorrectly as primary experience. |
| PD-007 Memory before provenance | Memory CRUD/table exists but no safe source, proposal, confirmation, expiry, or operational use exists. | Partial foundation only; hide. |
| PD-008 Founder-specific defaults | Boot and settings seed Gautam, JEE Advanced, 45 days, and fixed subjects. | Implemented incorrectly for first run. |
| PD-009 Competing next-action paths | Free text, task queue, and syllabus all feed the session differently. | Implemented incorrectly. |
| PD-010 Opaque task intelligence | Fixed priority/fixed seven-day policy and no reason code or user recommendation decision. | Partial mechanical queue, not planning intelligence. |
| PD-011 Documentation drift | Active TypeScript path differs from README/Rust service claims. | Open; documentation needs explicit capability states. |
| PD-012 Excess navigation | Sidebar contains playground; settings contains inactive memory/audit UI. | Implemented incorrectly. |
| PD-013 High-friction reflection | Mood plus two text areas are shown at every normal completion. | Partial, needs redesign. |
| PD-014 Streak pressure | Prominent streak display is present despite limited value and unreliable analytics context. | Needs revision/demotion. |
| PD-015 Accessibility coverage | Core controls lack a documented keyboard/accessibility acceptance path; sidebar relies on icon discovery. | Incomplete. |
| PD-016 Core-loop distraction | Sound/customization and multi-provider/Rust stubs exist beside incomplete core logic. | Postpone; do not expand. |
| PD-017 Outcome measurement | No learning-action outcome metrics can be collected because actions/outcomes do not exist. | Missing. |

## Learning Record gap analysis

### What exists

- `study_sessions`: subject, topic text, planned/actual duration, timestamps, status, reflection, interruption flag.
- `tasks`: title, priority, status, optional generated chapter, and task type.
- syllabus subjects, units, chapters, topics, dependencies, and chapter `last_studied_at`.
- memory entry and adaptation ledger tables, unused by the core loop.

### What is missing

- A durable learning-action identity and type.
- The source of an action: student-created, planned, recommendation, revision, or imported commitment.
- Student confirmation, deferment, dismissal, and override reason.
- A structured outcome: moved forward, partly moved forward, retry, practice result, recall result, or correction.
- Evidence provenance linking an outcome to a session, topic, task, or later assessment.
- Explicit topic semantics that distinguish exposure, study, practice, demonstrated recall, revision need, and mastery.
- Recommendation reason codes and immutable recommendation history.
- A safe migration strategy that preserves old sessions/tasks as historical facts without recasting them as learning evidence.

### Systems that must change

| System | Change required |
|---|---|
| Session model/service/store | Reference a confirmed Learning Action; retain time as one fact, not progress. |
| Completion UI | Capture an honest structured outcome; make text optional and meaningful. |
| Task service/store/repository | Keep tasks as commitments/checklists. Remove all direct topic-progress mutation from task toggling. |
| Syllabus service/repository | Accept explicit evidence/state transitions only; stop using task completion as a shortcut. |
| Task Intelligence Service | Rename/rebuild as Work Queue after reason codes and outcomes exist; do not delete/recreate user-facing pending recommendations indiscriminately. |
| Analytics | Query Learning Record and session facts with explicit definitions. |
| Memory | Consume evidence only after a provenance/correction model exists. |

## Analytics trust audit

| Area | Current behavior | Trust assessment |
|---|---|---|
| Today | `BootService` assigns all-time `totalSecs` to `todaySeconds`. | Incorrect. |
| Weekly | `weekSeconds` remains its default zero value on boot. | Incorrect/incomplete. |
| Lifetime | Sums all loaded session durations, including non-completed sessions without an explicit reporting policy. | Needs defined semantics and query-backed calculation. |
| Streak | Dynamically calculates only completed sessions using browser local time. | Directionally correct but needs shared local-day semantics and test coverage. |
| Recent sessions | Derived from all fetched sessions, including incomplete/abandoned records. | Needs clear labels and filtering policy. |
| Chart | Uses store daily totals that are not hydrated by boot. | Incomplete. |
| Insights | Uses generic text based on week total. | Not evidence-linked; hide. |

No analytics screen should be presented as progress evidence until these definitions are correct and reconciled against raw records.

## UX alignment issues

### Noisy, confusing, or distracting

- Dashboard contains four competing messages: start configuration, status companion, syllabus tracker, and task queue.
- A free-text topic field claims flexibility but breaks structured curriculum context.
- The streak badge receives visual priority before a first useful learning action exists.
- The production sidebar includes an internal playground.
- Settings gives inactive Memory Sanctuary and adaptation audit a permanent information architecture position.

### Fake or unfinished

- “Astra is monitoring focus rhythm updates” has no active evidence-backed companion behavior.
- Insights presents a category before insight quality exists.
- Memory and adaptation screens promise a system that has no active source pipeline.
- Rust AI providers, Brain service, memory service, analytics service, and background services are stubs, yet architecture/product language implies an active backend intelligence layer.

### Founder-specific

- Default identity and goal are Gautam and JEE Advanced with 45 days remaining.
- Default seeded curriculum is fixed Physics, Chemistry, and Mathematics.
- Dashboard greeting and first session start use those defaults rather than a neutral first-run state.

## Architecture alignment issues

### Boundary violations and duplicate ownership

- `sqlite.repositories.ts` imports `useUIStore` to set boot error state. A repository owns persistence, not UI transitions.
- Services mutate Zustand stores directly, which makes domain behavior hard to test and couples product semantics to the React runtime.
- Theme persists independently in `ThemeProvider` localStorage and `settings.store`/SQLite, creating two sources of truth.
- Study totals are held both as raw database rows and mutable store counters; boot and archive use different calculations.
- Topic mutation has two paths: `SyllabusService.toggleTopicCompletion()` and `TaskService.toggleTask()`.
- Task creation emits a completion event; event names do not consistently describe domain facts.

### Unnecessary or premature complexity

- `astra.store.ts` is placeholder chat state without a product-capable companion.
- Rust AI provider, Brain, planning, analytics, memory, and background service scaffolds are mostly stubs and not the active product path.
- Exposed adaptation/memory UI makes unused infrastructure user-facing.
- Dynamic import of the event bus is used to avoid a circular relationship rather than resolving the dependency direction.

### Components to delete, hide, or defer

- Remove `DesignSystemPlayground` from production routing/navigation.
- Hide companion, insight, memory sanctuary, and adaptation audit UI until criteria in Product Roadmap v2 are met.
- Do not extend `astra.store.ts` or Rust AI stubs until Phase 6.
- Do not extend sound mixer, dynamic wallpapers, sync, or provider selection while Phase 1–2 work is open.

## Existing bug tracker: architectural interpretation

| Existing bug | Deeper interpretation |
|---|---|
| BUG-0001 Fullscreen capability | Normal Tauri permission/configuration issue; not a core architecture problem. |
| BUG-0002 Mini timer design | Product/UX polish issue; retain but do not expand until core loop is correct. |
| BUG-0003 Reflection soft-lock and duplicate stats | Architectural symptom: UI routing and session state competed for ownership; derived metrics were updated in more than one place. This pattern remains relevant to Learning Record migration. |
| BUG-0004 Global text selection | Local UI polish decision. The global rule should be revisited for accessibility and copying records/errors, but it is not a core-loop blocker. |

## Milestone disposition

| Milestone | Retain | Change | Remove/postpone |
|---|---|---|---|
| 1.0–1.6 Local storage and session engine | Local SQLite, session lifecycle, recovery concept, window controls. | Link session lifecycle to Learning Actions; harden durable session and analytics semantics. | Do not treat timer/streak as the product center. |
| 1.7 Memory foundation | Normalized table direction and correction intent. | Add provenance/proposal/confirmation only after Evidence Engine. | Hide Memory Sanctuary and defer consolidation/adaptation work. |
| 1.8 Syllabus and task intelligence | Structured syllabus and dependencies. | Separate tasks from topic evidence; rebuild queue around explainable recommendations. | Postpone “intelligence” claims and automatic progress mutation. |

## Foundation completion assessment

| Subsystem | Status | Basis |
|---|---|---|
| Focus engine | Needs revision | Operational timer exists, but elapsed-time model is not tied to Learning Actions and needs accuracy/durability semantics. |
| Session lifecycle | Needs revision | State flow exists, but persistence error handling and outcome linkage are insufficient. |
| Recovery breaks | Needs polish | Works as an isolated UI timer; needs preference/configuration and product-fit review. |
| Persistence | Needs revision | Local SQLite exists; migration, upsert, ownership, and error boundary concerns remain. |
| Backup/restore | Needs rewrite | Partial export and unsafe/non-transactional restore. |
| Syllabus engine | Needs revision | Hierarchy exists; academic progress semantics conflict with ADR-0004. |
| Task intelligence | Needs rewrite | Mechanical queue exists; lacks correct domain model and transparent recommendation policy. |
| Learning Record | Planned | ADR accepted; implementation absent. |
| Analytics | Needs rewrite | Current hydrated totals are incorrect/incomplete. |
| Onboarding | Planned | Founder-specific boot defaults are not onboarding. |
| Memory | Blocked | Must wait for Learning Record/Evidence Engine and provenance rules. |
| Companion/Insights | Blocked | Must wait for evidence-linked capability; remove active presentation. |
| Settings | Needs polish | Useful base, but dual theme persistence and inactive settings areas exist. |
| Testing | Needs revision | 11 passing tests cover a narrow slice; core loop/recovery/backup/accessibility E2E is absent. |
| Packaging | Needs revision | Builds compile; product readiness and complete native-path validation not demonstrated. |

## Recommendation priority and estimated effort

Effort assumes one experienced engineer with product/design review. Estimates are relative and deliberately exclude unrelated polish.

| Priority | Work | Pillars strengthened | Effort |
|---|---|---|---|
| P0 | Define Learning Record vocabulary, state transitions, migration rules, and ownership boundaries. | 1, 2, 4, 5 | 3–5 days |
| P0 | Correct analytics and establish shared reporting definitions. | 1, 4 | 3–5 days |
| P0 | Rebuild backup/restore for complete atomic recovery. | 1 | 5–10 days |
| P0 | Hide/remove inactive companion, insights, memory/audit placeholders, and production playground route. | 2, 3, 5 | 1–2 days |
| P1 | Add neutral first-run setup and content selection direction. | 1, 2 | 3–5 days |
| P1 | Introduce Learning Action and structured end-of-session outcome. | 1, 2, 4 | 8–15 days |
| P1 | Decouple tasks from syllabus/topic mutation and migrate legacy behavior safely. | 1, 4 | 5–8 days |
| P1 | Redesign Today around one confirmed next action. | 2, 3 | 5–10 days |
| P1 | Add core-loop, recovery, backup/restore, and accessibility acceptance tests. | 1, 3 | 5–10 days |
| P2 | Rebuild task compiler as explainable Work Queue with reason codes/override state. | 2, 4, 5 | 8–15 days |

## Shortest path answer

If development resumes tomorrow, do not start a new feature stream. First make the current facts trustworthy and remove false signals. Then establish one Learning Record that connects a confirmed action to focus, a student-reported outcome, and a transparent next action. Once that loop is reliable, the current syllabus and queue can become real planning intelligence; only then can memory, insights, and AI become useful rather than theatrical.
