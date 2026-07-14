# Astra Documentation

Start here. This directory separates the documents that govern future work from the records that explain how Astra arrived here.

## Active authority

1. [Product Constitution](product/Product_Recalibration_v1.md) — what Astra is, the five pillars, and the core learning loop.
2. [Product Principles](product/Product_Principles.md) and [Non-Goals](product/Non_Goals.md) — feature admission and boundaries.
3. [Learning Record Architecture](learning-record/Learning_Record_Architecture_v1.md) — the canonical model for continuity, evidence, and planning.
4. [Learning Record Engineering Contract](learning-record/Learning_Record_Engineering_Contract.md) — software-level boundaries, persistence logic, and lifecycles.
5. [Architecture Decisions](architecture/Architecture_Decisions.md) — accepted long-term decisions. ADR-0006 freezes Learning Record philosophy and boundaries.
6. [Engineering Playbook](engineering/Engineering_Playbook.md) — implementation and verification rules.
7. [AI Context & Onboarding Guide](AI_Context_Guide.md) — permanent onboarding guide for future AI contributors.

When documents conflict, use this order: accepted ADRs and Product Principles; Product Constitution; Learning Record Architecture; Learning Record Engineering Contract; active roadmap/checklists; AI Context & Onboarding Guide; then historical material.

## Directory guide

| Directory | Use it for |
|---|---|
| `product/` | Current product direction, roadmap, debt, vision, feature ledger, and immediate priorities. |
| `learning-record/` | Canonical Learning Record design, UX, implementation sequence, and open questions. |
| `architecture/` | Accepted ADRs and repository boundaries. |
| `engineering/` | Engineering standards, glossary, and tracked software defects. |
| `foundation/` | Current foundation checklist and dated readiness reviews. |
| `history/` | Previous milestones, lessons, and time-bound reports; context only. |
| `reviews/` | Preserved historical reviews; context only. |

## Before starting work

1. Read Product Principles and Non-Goals.
2. Check the Learning Record Architecture and open questions for anything touching core learning data.
3. Check Architecture Decisions and the Foundation Checklist.
4. Create a plan under the Engineering Playbook before changing schema, state, services, or user flow.

## Documentation maintenance

- Keep active documents concise and current.
- Move superseded snapshots to `history/`; do not delete valuable decision context.
- Do not use a historical review to overrule an accepted ADR.
- Update the Foundation Checklist only after implementation and verification.
