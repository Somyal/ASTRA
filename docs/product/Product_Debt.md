# Astra Product Debt

## Purpose

Product debt is any existing experience, promise, or product-model decision that weakens Astra's core learning loop. This is a living document. It records accepted debt, its product cost, and the intended direction; it is not a substitute for the bug tracker.

Status values: `Open`, `Planned`, `In progress`, `Resolved`, `Accepted limitation`.

## Active debt

| ID | Problem | Why it matters / user impact | Priority | Long-term direction | Status |
|---|---|---|---|---|---|
| PD-001 | Astra has been positioned as an AI Operating System before it has a complete learning loop. | Students expect a system that improves learning decisions; they instead encounter fragmented focus, task, and placeholder experiences. | Critical | Position Astra as a local learning workspace until the learning record and planning loop are proven. | Open |
| PD-002 | Study sessions are treated too often as evidence of learning. | Time can be logged without progress; students receive misleading progress and the system learns from weak signals. | Critical | Introduce a Learning Record that separates intention, time, outcome, practice, assessment, and mastery. | Planned |
| PD-003 | Task completion can advance topic completion. | A checkbox can falsely represent learning, corrupting syllabus progress and later recommendations. | Critical | Decouple task state from academic evidence; require an explicit learning outcome or assessment event. | Open |
| PD-004 | Analytics is not yet trustworthy or conceptually clear. | Incorrect daily/weekly/lifetime information damages trust in every other product claim. | Critical | Rebuild analytics from raw records with defined local-time semantics and reconciliation tests. | Open |
| PD-005 | Backup and restore do not yet guarantee complete, safe recovery. | A student can lose data in the very workflow intended to protect it. | Critical | Use complete exports, transactional restore, pre-restore snapshot, validation, and post-restore verification. | Open |
| PD-006 | The companion and insight surfaces imply intelligence that is inactive or incomplete. | This feels deceptive and distracts from the actual study workflow. | High | Remove from primary experience until a narrow, evidence-linked capability is useful. | Planned |
| PD-007 | Memory Sanctuary is exposed before memory creation, provenance, and correction rules are real. | Users see empty infrastructure rather than value, and future AI memory can become untrustworthy. | High | Build proposed/confirmed memory with source evidence; otherwise keep memory internal. | Planned |
| PD-008 | The default experience is founder-specific: seeded JEE content, personal name, and exam date assumptions. | New students feel they are using a demo or someone else's system. | High | Add concise first-run setup and content-pack selection; make defaults neutral. | Planned |
| PD-009 | The dashboard has competing sources of truth for the next action. | Typed topic, syllabus hierarchy, and task queue can disagree, creating decision friction. | High | Make one confirmed learning action the center of the dashboard; treat all other views as supporting evidence. | Planned |
| PD-010 | The task queue is called intelligence without transparent planning logic. | Students cannot understand why a task is present or safely override it. | High | Rename as work queue until it provides reason codes, capacity, commitments, and reversible recommendations. | Open |
| PD-011 | Product documentation describes more capability than the active experience delivers. | Teams may build toward documents rather than validated student value. | High | Maintain a shipped/experimental/planned capability matrix and keep product copy honest. | Open |
| PD-012 | Desktop navigation exposes an internal design-system playground and several low-value areas. | New users spend attention on developer or placeholder surfaces. | Medium | Keep internal tools out of student navigation and reduce routes to core loop surfaces. | Planned |
| PD-013 | Focus completion asks for more reflection than is justified by its current downstream value. | Students skip it or create low-quality notes, increasing friction without improving decisions. | Medium | Use a one-tap outcome first; request richer reflection only when it changes a future action. | Planned |
| PD-014 | Streaks and celebration risk competing with calm, evidence-based learning. | Students may optimize ritual or feel punished after a lapse. | Medium | Demote streaks, make them correct, and frame return/recovery rather than consecutive performance. | Open |
| PD-015 | Accessibility and keyboard experience are not yet treated as core product coverage. | Students who rely on keyboard, assistive technology, reduced motion, or high contrast are excluded. | Medium | Build accessibility acceptance criteria into each core-loop phase. | Planned |
| PD-016 | Sound, visual customization, sync, and broad AI provider work compete with the core loop. | Valuable engineering time is diverted into surfaces that do not prove learning value. | Medium | Keep them in later roadmap categories with explicit dependencies. | Open |
| PD-017 | The product has no validated outcome measure beyond elapsed time and return. | Astra cannot know whether it reduces decision burden or improves learning behavior. | Medium | Add voluntary clarity/trust prompts and learning-action outcome metrics. | Planned |

## Debt management rules

- A feature may not be promoted from placeholder to primary navigation while related Critical or High debt remains unresolved.
- Product debt is resolved only when the user-facing behavior, data model, recovery behavior, and success criteria have been verified.
- “Coming Soon” is not a resolution. Hide incomplete systems when they create expectation debt.
- Every new feature proposal must name which Product Debt item it reduces; if none, it belongs in the future ledger.
