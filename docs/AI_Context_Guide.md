# Astra AI Context & Onboarding Guide

This document is the permanent onboarding guide and operating manual for all future AI systems contributing to Project Astra. It is structured specifically for machine consumption to maximize prompt efficiency, minimize token waste, and prevent architectural drifts.

---

## 1. What is Astra?

*   **Astra is a calm, local-first learning workspace** designed to help serious students convert a structured curriculum or raw learning goals into the next honest learning action.
*   **What Astra is NOT:** It is not a generic productivity app, task manager, notes database (like Notion), gamified reward loop (no streak pressure, no badges), public social platform, or unbounded AI chat companion.
*   **Core Philosophy:** The product exists to reduce the student's cognitive decision burden at a desk. Astra believes learning is non-linear and messy; therefore, capturing *only enough evidence to resume learning tomorrow* is more valuable than detailed reflection logs.
*   **The Core Learning Loop:** 
    1. **Choose** one specific learning action (e.g., solve 10 questions).
    2. **Focus** in a silent, distraction-free fullscreen visual environment (Sanctuary).
    3. **Record** a brief, honest outcome (Moved forward, Partly, Need another attempt, or Close without outcome).
    4. **Update** the local Learning Record (durable factual traces).
    5. **Recommend** the next logical continuation action based on transparent, deterministic rules.

---

## 2. Current Product Phase

*   **Current Era:** Infrastructure and Foundation Era.
*   **Current Milestone:** Final Foundation Freeze (Pre-Learning Record Implementation).
*   **Current Objective:** Establish robust developer infrastructure, developer onboarding, and documentation stability for future AI/human contributors before any product data changes begin.
*   **Current Priorities:**
    1. Author the AI Context Guide (`docs/AI_Context_Guide.md`) as the onboarding source of truth.
    2. Consolidate engineering principles, removing obsolete instructions and documenting the active authority.
    3. Perform the final foundation audit evaluating readiness for Milestone LR-0.
*   **Current Blockers (Project-Level):**
    1. *Analytics:* Time, daily, weekly, and lifetime metrics are not reconcilable with raw database logs.
    2. *Backup/Restore:* Recovery is not transactionally safe, atomic, or verified.
    3. *Learning Record Vocabulary:* The domain terms are not yet declared as code schema models.
    4. *Syllabus/Task Drift:* Checking a task checkbox can mutate syllabus topic progress, violating ADR-0004.
    5. *Placeholder UI:* The UI still exposes inactive companions, empty insights, and developer playgrounds.
    6. *Core Loop Verification:* No automated end-to-end recovery, accessibility, or keyboard tests exist.
*   **Next Milestone:** Milestone LR-0 (Contract and Migration Design).
*   **Overall Foundation Status:** The local SQLite + Tauri + React substrate is compile-stable and operates as a functional prototype, but requires Phase 1 (Trustworthy Foundation) completion before starting Learning Record implementation.

---

## 3. Required Reading

To optimize context window loading, consult documentation in four distinct tiers:

### Level 1 — Always Read (Constitution)
*Mandatory context before any task. These files form Astra's Constitution.*
*   [docs/README.md](file:///c:/Projects/ASTRA/docs/README.md) — The entry point and authority hierarchy.
*   [docs/product/Product_Identity.md](file:///c:/Projects/ASTRA/docs/product/Product_Identity.md) — Tone of voice, experience guidelines, and identity tests.
*   [docs/product/Product_Principles.md](file:///c:/Projects/ASTRA/docs/product/Product_Principles.md) — 14 core product principles governing features.
*   [docs/architecture/Architecture_Decisions.md](file:///c:/Projects/ASTRA/docs/architecture/Architecture_Decisions.md) — Sequenced log of accepted architectural choices.
*   [docs/AI_Context_Guide.md](file:///c:/Projects/ASTRA/docs/AI_Context_Guide.md) — This guide.

### Level 2 — Task-Specific Context
*Load these files only when matching the specific task scope.*
*   **Learning Record / Persistence:**
    *   [docs/learning-record/Learning_Record_Architecture_v1.md](file:///c:/Projects/ASTRA/docs/learning-record/Learning_Record_Architecture_v1.md)
    *   [docs/learning-record/Learning_Record_UX.md](file:///c:/Projects/ASTRA/docs/learning-record/Learning_Record_UX.md)
    *   [docs/learning-record/Learning_Record_Implementation_Roadmap.md](file:///c:/Projects/ASTRA/docs/learning-record/Learning_Record_Implementation_Roadmap.md)
    *   [docs/learning-record/Learning_Record_Open_Questions.md](file:///c:/Projects/ASTRA/docs/learning-record/Learning_Record_Open_Questions.md)
*   **UI & Experience Changes:**
    *   [docs/learning-record/Learning_Record_UX.md](file:///c:/Projects/ASTRA/docs/learning-record/Learning_Record_UX.md)
*   **Bug Fixing & Maintenance:**
    *   [docs/engineering/Bug_Tracker.md](file:///c:/Projects/ASTRA/docs/engineering/Bug_Tracker.md)
*   **Engineering Standards:**
    *   [docs/engineering/Engineering_Playbook.md](file:///c:/Projects/ASTRA/docs/engineering/Engineering_Playbook.md)
*   **Syllabus & Data Queries:**
    *   [docs/architecture/Repository_Map.md](file:///c:/Projects/ASTRA/docs/architecture/Repository_Map.md)
*   **Product Strategy / Roadmap Review:**
    *   [docs/product/Product_Recalibration_v1.md](file:///c:/Projects/ASTRA/docs/product/Product_Recalibration_v1.md)
    *   [docs/product/Product_Roadmap_v2.md](file:///c:/Projects/ASTRA/docs/product/Product_Roadmap_v2.md)
    *   [docs/product/Non_Goals.md](file:///c:/Projects/ASTRA/docs/product/Non_Goals.md)
    *   [docs/product/Product_Debt.md](file:///c:/Projects/ASTRA/docs/product/Product_Debt.md)
    *   [docs/product/Vision_2027.md](file:///c:/Projects/ASTRA/docs/product/Vision_2027.md)

### Level 3 — Reference Material
*Consult during execution to resolve specific code patterns or terms.*
*   [docs/architecture/Repository_Map.md](file:///c:/Projects/ASTRA/docs/architecture/Repository_Map.md) — Folder structural boundaries.
*   [docs/engineering/Engineering_Playbook.md](file:///c:/Projects/ASTRA/docs/engineering/Engineering_Playbook.md) — Layered responsibilities and review checklists.
*   [docs/engineering/Engineering_Glossary.md](file:///c:/Projects/ASTRA/docs/engineering/Engineering_Glossary.md) — Formal codebase terminology.
*   [docs/engineering/Bug_Tracker.md](file:///c:/Projects/ASTRA/docs/engineering/Bug_Tracker.md) — Bug schema, workflow status, and historical fixes.

### Level 4 — Historical Context
*Consult to understand past decisions and avoid repeat mistakes. Do NOT use as active implementation guidelines.*
*   [docs/history/Foundation_Status.md](file:///c:/Projects/ASTRA/docs/history/Foundation_Status.md) — Subsystem status as of 2026-07-11.
*   [docs/history/Milestone_History.md](file:///c:/Projects/ASTRA/docs/history/Milestone_History.md) — Summary of Milestones 1.0–1.8.
*   [docs/history/Mistakes_And_Lessons.md](file:///c:/Projects/ASTRA/docs/history/Mistakes_And_Lessons.md) — Crucial log of past architectural errors and lessons.
*   [docs/history/Standing_Engineering_Principles.md](file:///c:/Projects/ASTRA/docs/history/Standing_Engineering_Principles.md) — Archived engineering review.
*   All documents inside [docs/reviews/](file:///c:/Projects/ASTRA/docs/reviews/) — Preserved design audits.

---

## 4. Engineering Philosophy

Contributors must strictly execute tasks in this sequence:

$$\text{Understand} \longrightarrow \text{Research} \longrightarrow \text{Design} \longrightarrow \text{Review} \longrightarrow \text{Implement} \longrightarrow \text{Verify} \longrightarrow \text{Document} \longrightarrow \text{Commit}$$

### Why this sequence exists:
1. **Understand:** Astra is defined by its philosophical constraints (calmness, privacy). Coding before understanding causes user-experience debt.
2. **Research:** Prevent duplicating state, stores, or database interfaces. Locate existing boundaries.
3. **Design:** Create an explicit implementation plan addressing state transitions and database changes.
4. **Review:** Peer or user approval guarantees that design choices conform to accepted ADRs and product guidelines.
5. **Implement:** Write minimal, type-safe, simple code. Reject premature frameworks or abstractions.
6. **Verify:** Run compilation, tests, manual cases, and accessibility checks.
7. **Document:** Lock changes in step with documentation (playbook, bugs, glossary).
8. **Commit:** Keep commits granular and context-dense.

---

## 5. Product Rules

These rules are permanent, immutable, and must never be bypassed:
*   **The Learning Record is the Source of Truth:** A checked task, a timer event, or an AI inference does not represent progress. Progress requires explicit student evidence or reports.
*   **AI Proposes; User Decides:** AI must never silently mutate database schemas, learning records, settings, or progress states. All AI actions are suggestions that require user confirmation, edit, or rejection.
*   **Never Redesign Accepted ADRs:** Architecture decisions are locked. Changing a frozen boundary requires a documented problem, user research, and a new ADR.
*   **Avoid Feature Creep:** Reject soundscapes, social features, or gamification. If a feature does not directly clarify, focus, record, or recommend in the core learning loop, it is postponed.
*   **Local-First & Offline Default:** The application must remain fully functional offline. Cloud AI is explicit opt-in only.
*   **No Placeholders in Production:** Hide incomplete components, stubs, developer-only menus, and "Coming Soon" tabs.
*   **Universal Learning:** Keep abstractions generic (Item, Action, Entry, Continuation). Astra must work for programming, music, writing, and languages without enforcing a rigid school syllabus structure.

---

## 6. Repository Navigation

Refer to this mapping to locate file contexts:
*   **Business Logic:** `src/services/` — interval management, file backup operations, tauri window handling.
*   **Application State:** `src/store/` — Zustand stores. `ui.store.ts` handles UI tabs and overlays; `study.store.ts` manages study states; `settings.store.ts` handles user configurations.
*   **Persistence & SQLite Queries:** `src/repositories/` — raw SQL queries, clients, database migration sequences.
*   **UI Presentation & Layouts:** 
    *   `src/components/` — logic-free presentation inputs and widgets.
    *   `src/environments/` — page-level containers binding Zustand store triggers to components (e.g., `FocusModeEnvironment.tsx`, `SettingsEnvironment.tsx`).
*   **Tauri Desktop Native Code:** `src-tauri/src/` — commands, window setup, capabilities files, background threads.
*   **Documentation:** `docs/` — structured by category (product, architecture, engineering, foundation, history).

---

## 7. Prompting Guidelines

When prompting or instructing future contributors (human or LLM):
*   **Instruct them to inspect first:** Force the model to read relevant service and repository files before writing any implementation proposal.
*   **Demand architectural reuse:** Check if a Zustand store, event bus trigger, or repository query can be reused before creating a new one.
*   **Prevent speculative complexity:** Limit abstractions. Use direct, readable logic.
*   **Enforce safety constraints:** Ask: *"Does this query perform at $O(\log N)$ or better?"* and *"Does this change expose local user data?"*
*   **Avoid unrelated code sweeps:** Force the system to make narrow, contiguous changes and suggest specific file paths.
*   **Request logical commit points:** Keep Git history clean by suggesting where to commit.

---

## 8. AI Handoff Protocol

At the end of every turn, work session, or agent execution, provide a concise handoff record using this exact format:

```markdown
### AI Handoff Record

1. **What was completed:** [Bullet list of files modified, verified tests, and completed milestones]
2. **What remains:** [Unfinished tasks or next items on the roadmap]
3. **Assumptions made:** [Stated design assumptions or defaults applied]
4. **Risks identified:** [Potential bugs, performance limits, or boundary violations]
5. **Recommended next task:** [The single highest-priority task for the next contributor]
```

---

## 9. Definition of Done

A task is complete only when all the following items are verified:
*   [ ] **Product Principles Respected:** No gamification, no telemetry, no false intimacy.
*   [ ] **Architecture Decisions Respected:** Layer separation (UI → Store → Service → Repo) maintained.
*   [ ] **Existing Code Reused:** No duplicate stores, services, or models introduced.
*   [ ] **No Feature Creep:** Task scope strictly bound to the approved plan.
*   [ ] **TypeScript compiles:** No `any` shortcuts, no unresolved compiler errors.
*   [ ] **Lint checks pass:** Prettification and lint checks execute with zero warnings.
*   [ ] **Rust/Tauri compiles:** Frontend builds and Tauri dev/release compilations succeed.
*   [ ] **Documentation updated:** Documentation updated to match active code state.
*   [ ] **Walkthrough created/updated:** Changes documented in [walkthrough.md](file:///c:/Users/Gautam/.gemini/antigravity-ide/brain/4eb18c2a-60b0-45b1-b87e-538a8df7d1ee/walkthrough.md).
*   [ ] **Bug Tracker updated:** Fixed bugs moved to `Fixed` with notes; new bugs logged.
*   [ ] **Ready for Git:** Staged files are clean, localized, and ready for commit.

---

## 10. AI Contributor Checklist

Run this checklist mentally before executing any code changes:

```
[ ] Read Constitution (README, Principles, Identity, Architecture Decisions)
[ ] Read task prompt and align on core intent
[ ] Inspect Repository Map and locate source files
[ ] Write Implementation Plan and get user approval
[ ] Execute narrow, focused code implementation
[ ] Verify via tests (vitest, typecheck, build) and manual flows
[ ] Document modifications in walkthrough and bug tracker
[ ] Author handoff summary and recommend next commit point
```
