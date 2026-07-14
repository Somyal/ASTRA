# Learning Record Open Questions

## Purpose

These questions must be deliberately answered before implementation. They are preserved here because premature certainty would create an inflexible Learning Record. No implementation should quietly answer one through incidental UI or schema choices.

## Resolved in LR-0 Engineering Contract

The [Learning Record Engineering Contract (LR-0)](Learning_Record_Engineering_Contract.md) has resolved several key product and persistence questions to establish the implementation authority:
*   **Outcome Set (Q2 & Q3):** Confirmed as `'moved_forward'`, `'partly'`, `'retry'`, and `'unknown'`. "Close without outcome" is explicitly supported as a transition to `Idle` in the Focus Session state machine, archiving the elapsed session without creating a learning entry.
*   **Syllabus & Task Decoupling (Q12 & Q23):** Tasks are strictly checklists and cannot mutate topic progress. Syllabus progression is dynamically calculated at runtime from entries with a `'moved_forward'` outcome.
*   **Clock & Timezone Boundaries (Q27 & Q48):** Addressed via append-only entry corrections and transaction validation blocks in the failure scenarios.
*   **Factual Analytics (Q25 & Q26):** Managed through the Factual Analytics Layering Model (Layer 0 to Layer 3), ensuring derived calculations are computed purely at runtime.

## Product semantics

1. What exact visible labels should replace “complete” so they remain understandable across learning contexts?
2. Should “moved forward,” “partly,” and “need another attempt” be the v1 outcome set, or is a smaller two-choice set better for exhausted users?
3. Is “close without recording outcome” always available, including after an explicit timed action? It should be unless a concrete user study disproves it.
4. When does a student need an explicit continuation cue versus an inferred one from latest activity?
5. How many active Learning Actions can a student have before Today becomes unclear? Should v1 intentionally support only one active action per Area or globally?
6. What is the user-facing difference between “complete for now,” “deferred,” and “abandoned,” if any?
7. Does a student need a manual “I want to revisit this” control separate from outcomes?

## Learning Item and organization

8. Is “Learning Item” understandable enough for users, or should the UI use contextual language such as “What are you working on?” while retaining the internal product term?
9. What is the minimum viable grouping model: none, optional Areas, optional projects, or imported curriculum trees?
10. How should a Learning Item be split or merged when a user realizes it was too broad or too narrow?
11. Can one Learning Action legitimately apply to multiple Items, and if so, should v1 support that or require one primary Item?
12. What is the migration path for existing subject/unit/chapter/topic hierarchy without making it mandatory for lifelong learners?
13. How should users represent an artifact-oriented Item such as a paper, portfolio piece, or codebase without Astra becoming a project manager?

## Evidence

14. Which evidence fields must retain a source/context to remain meaningful—score scale, question set, attempt number, artifact location, etc.?
15. Are attachments needed in v1, or are text and links sufficient? Attachments create substantial storage, backup, privacy, and sync complexity.
16. How should imported evidence differ from user-authored evidence?
17. What evidence types can be safely templated without creating a school-only product?
18. How should contradictory evidence be displayed without asking Astra to resolve it automatically?
19. When should an outcome be editable versus appended as a correction?

## Planning and revision

20. What deterministic rule is sufficient for the first continuation recommendation before any adaptive policy exists?
21. How should student-selected due dates and revision commitments coexist with a “continue what is unfinished” default?
22. What evidence is necessary before suggesting review, and how should Astra explain it?
23. Should v1 schedule at all, or simply present a prioritized continuation queue?
24. How are “choose something else” and override reasons captured without turning every choice into a survey?

## Analytics and privacy

25. Which views are genuinely helpful before enough evidence exists, and which should remain absent rather than empty?
26. What are the explicit definitions for study time, action attempted, action completed for now, revision, and unknown outcome?
27. What local-day, timezone, and clock-change policy will be used for time views and streak-like summaries?
28. What is the retention policy for raw session data, entries, revisions, deleted entries, and future attachments?
29. What complete export format best preserves user ownership while remaining readable in five years?

## AI and safety

30. Which AI proposal is the first one with enough clear value to justify implementation: continuation wording, entry summary, Item label, or plan explanation?
31. What evidence threshold and source-display pattern is required before an AI proposal can be shown?
32. How are AI proposals retained, rejected, edited, or deleted without polluting student-authored history?
33. What data may leave the device for opt-in cloud AI, and how is that choice explained to minors and privacy-sensitive users?
34. When AI is unavailable, what exact deterministic behavior replaces every supported proposal?

## Validation before commitment

35. Can five target users complete the start/end/tomorrow flow without being told what a Learning Record is?
36. Do users voluntarily leave useful continuation cues, or does the default one-tap outcome already solve most return problems?
37. Do users understand that positive outcomes do not mean mastery?
38. Does the term “Learning Item” help or confuse across JEE, programming, music, language, and professional learning trials?
39. Does the product still feel lighter than a timer plus a note after ten uses?
40. What evidence would justify adding a domain-specific template rather than keeping free text and one-tap outcomes?
