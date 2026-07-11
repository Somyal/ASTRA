# Architecture Decisions Log

This document is the chronological log of all key architectural choices made during Project Astra's development.

---

## 1. Index of Decisions

*   **[ADR-0001](#adr-0001-store-consolidation--settings-split)**: Store Consolidation & Settings Split (Milestone 1.6)
*   **[ADR-0002](#adr-0002-decomposed-structured-knowledge-schema)**: Decomposed Structured Knowledge Schema (Milestone 1.7)
*   **[ADR-0003](#adr-0003-idempotent-syllabus-hierarchy-schema)**: Idempotent Syllabus Hierarchy Schema (Milestone 1.8)
*   **[ADR-0004](#adr-0004-learning-record-as-the-product-source-of-truth)**: Learning Record as the Product Source of Truth
*   **[ADR-0005](#adr-0005-ai-as-an-evidence-bound-proposal-layer)**: AI as an Evidence-Bound Proposal Layer
*   **[ADR-0006](#adr-0006-learning-record-architecture-accepted)**: Learning Record Architecture Accepted

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

---

## ADR-0004: Learning Record as the Product Source of Truth

### Status
Accepted (2026-07-11)

### Context & Problem
The product previously used focus sessions, task state, and syllabus topic completion as partially overlapping signals of progress. This made it possible for elapsed time or a task checkbox to imply academic progress without clear evidence. It also prevented planning, analytics, memory, and AI from sharing an honest model of what happened.

### Decision
1. Treat the **Learning Record** as the product-level source of truth.
2. Model a learning action's intention, focus session, student-reported outcome, practice/assessment evidence, and topic state as distinct concepts.
3. Do not allow task completion alone to mark a topic learned, completed, or mastered.
4. Derive recommendations and analytics from the Learning Record and expose their reasons to the student.
5. Preserve existing sessions and tasks as historical operational data during migration; do not reinterpret them as mastery evidence.

### Consequences

* **Positive:** Planning, analytics, memory, and AI have a shared evidence model; student progress becomes explainable and correctable.
* **Negative:** Requires careful schema evolution and a clear migration path from current task- and session-centric UI behavior.
* **Deferred:** Automated mastery inference and advanced adaptive recommendations remain out of scope until evidence collection is validated.

---

## ADR-0005: AI as an Evidence-Bound Proposal Layer

### Status
Accepted (2026-07-11)

### Context & Problem
Product surfaces described an Astra Companion, memory, and insight system before a safe, complete learning record or visible evidence trail existed. This creates expectation debt and risks AI-generated claims becoming product truth.

### Decision
1. The deterministic local learning loop remains functional without AI.
2. AI may explain, summarize, and propose; it may not silently mutate goals, records, topic state, or priorities.
3. Every retained AI observation or recommendation must have visible source evidence, a rationale, and a correction path.
4. Cloud AI usage is explicit opt-in with a narrow disclosed data scope.
5. Inactive AI, memory, or insight capability must not be represented as active in student-facing navigation or copy.

### Consequences

* **Positive:** Protects trust, preserves offline usefulness, and makes later AI behavior auditable.
* **Negative:** Delays broad companion/chat ambitions until the underlying product model is ready.
* **Deferred:** Autonomous adaptation, narrative personality models, and unbounded chat are not active architecture requirements.

---

## ADR-0006: Learning Record Architecture Accepted

### Status
Accepted (2026-07-11)

### Context & Problem
ADR-0004 established that the Learning Record is Astra's product source of truth, but did not freeze the product architecture that keeps it universal, lightweight, and usable over years. The implementation must support lifelong learning without turning subjects, projects, sessions, or AI interpretation into the source of truth.

### Decision
1. The accepted conceptual model is **Learning Item → Learning Action → Learning Entry/Evidence → Continuation**. A focus session is a factual time event that may support an entry; it is not proof of learning and does not automatically create one.
2. **Learning Item** is Astra's internal core abstraction: the durable thing a student is trying to understand, practice, create, or improve.
3. Student-facing language must use natural contextual wording—principally “What are you learning?” and “What are you working on?”—rather than requiring users to learn the term “Learning Item.”
4. **Areas** are accepted as optional user-defined organizational containers (for example Programming, Languages, Music, or Research). They may group Items for navigation, but must never replace Items as the primary learning anchor, become mandatory setup, determine progress, or impose a school-style taxonomy.
5. Learning Actions remain temporary intentions. They may continue across sessions and days when a student deliberately keeps them active, but they must resolve into an explicit state—continued, completed for now, deferred, abandoned, or superseded—rather than becoming permanent projects.
6. Continuation is the primary return experience. It may use warm, factual momentum language such as “Continue where you left off,” but must not use streaks, praise, urgency, guilt, or reward mechanics.
7. JEE remains an initial validation cohort and optional content source, not Astra's product boundary or core taxonomy. The Learning Record must work without any exam, subject, or curriculum hierarchy.
8. Unresolved questions in `Learning_Record_Open_Questions.md` remain intentionally open. This ADR freezes the philosophy and boundaries, not field names, schema, templates, scheduling policy, or AI behavior beyond existing ADR-0005 limits.

### Consequences

* **Positive:** Establishes one durable product vocabulary across lifelong learning contexts while preserving natural UI language and a low-friction return experience.
* **Positive:** Prevents future work from re-centering Astra around sessions, curriculum taxonomies, generic projects, or AI inference.
* **Negative:** Requires implementation teams to resist convenient but incorrect shortcuts such as task-completion-as-progress and auto-generated mastery states.
* **Change control:** Future architectural changes to these boundaries require evidence from user research, a documented problem the model cannot solve, and a new ADR. Preference alone is insufficient.
