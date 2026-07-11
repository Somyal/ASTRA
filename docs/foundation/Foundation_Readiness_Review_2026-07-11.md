# Foundation Readiness Review — 2026-07-11

## Decision

**Astra is not ready to leave the Product Foundation phase.** It is ready to begin the documentation and planning work for Learning Record implementation, but not implementation itself until the Trustworthy Foundation critical path is complete.

## What is stable enough to retain

- Local-first desktop runtime direction.
- Repository/service/store layering as the intended boundary model.
- Basic session lifecycle and focus-screen concept.
- Structured syllabus hierarchy as an optional source of Learning Items.
- Product constitution, Product Principles, Non-Goals, and accepted Learning Record philosophy.
- Documentation governance, bug-tracker process, and ADR discipline.

## What still blocks implementation

1. Analytics definitions and reconciliation are not trustworthy.
2. Backup and restore do not yet guarantee complete, atomic recovery.
3. Learning Record vocabulary requires LR-0 contract and migration planning before any data change.
4. Existing task completion can mutate syllabus progress, conflicting with ADR-0004.
5. The production experience still exposes inactive companion, insight, memory, and developer surfaces.
6. Core-loop recovery, migration, accessibility, and end-to-end verification are incomplete.

## First Learning Record milestone

Begin **LR-0 — Contract and migration design**, not LR-2 implementation. LR-0 resolves ownership, visible terminology, state transitions, legacy preservation, analytics definitions, and acceptance tests. It must be followed by LR-1 Trustworthy Factual Substrate before introducing Learning Items or Actions in product code.

## Remaining implementation risks

- Reinterpreting old session/task data as learning evidence instead of preserving it as historical fact.
- Allowing task toggles or timer completion to create false academic progress.
- Schema decisions accidentally freezing unresolved Open Questions.
- Adding form fields that make recording cost more than learning.
- Exposing AI, memory, or insight language before their source evidence and correction paths exist.
- Building a mandatory subject/project hierarchy that excludes lifelong learning use cases.

## Readiness condition

Implementation may begin after LR-0 is reviewed and after LR-1 has a concrete, approved plan with data-integrity, recovery, and verification acceptance criteria. The first product-facing Learning Record release should be LR-4, not an AI, memory, or planning release.
