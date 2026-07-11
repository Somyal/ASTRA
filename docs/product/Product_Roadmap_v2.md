# Astra Product Roadmap v2

## Roadmap principle

Development is organized by product maturity, not by the number of technical subsystems completed. A phase is complete only when a student receives its value reliably in the core learning loop.

## Phase 1 — Trustworthy foundation

**Purpose:** Make Astra's existing records correct, durable, recoverable, and honestly represented.

**Expected user value:** A student can trust session history, progress data, and recovery before relying on Astra for a study plan.

**Why now:** Trust failures invalidate every future intelligence feature.

**Dependencies:** Existing local database, session engine, repository layer.

**Completion criteria:**

- Time, daily, weekly, and lifetime analytics reconcile with raw records.
- Session interruption and recovery are deterministic and tested.
- Backup includes all owned learning data and restore is transactional, validated, and recoverable.
- Product copy and navigation do not imply inactive intelligence.
- A first-run user sees neutral rather than founder-specific defaults.

**Wait until later:** AI chat, adaptive memory, sound mixer, sync, advanced visual polish.

## Phase 2 — Perfect the learning loop

**Purpose:** Replace session-centric behavior with a simple Learning Record.

**Expected user value:** Every focus block produces an honest, useful next step rather than only a duration.

**Why here:** This is Astra's product identity. It must exist before planning or AI can be meaningful.

**Dependencies:** Phase 1 data correctness and migration safety.

**Completion criteria:**

- A student chooses or confirms one specific learning action before focus.
- A completed block records outcome separately from time.
- Topic progression cannot be changed accidentally by task toggling.
- The dashboard presents one clear next action and an override.
- The student can see what their record means and correct it.

**Wait until later:** sophisticated scheduling, predictive recommendations, long-term AI memory.

## Phase 3 — Planning intelligence

**Purpose:** Turn a trustworthy learning record and syllabus into a transparent work queue.

**Expected user value:** The student spends less time deciding what to do next and understands why Astra suggested it.

**Why here:** Recommendation quality depends on clear outcomes and stable data semantics.

**Dependencies:** Phase 2 Learning Record, curriculum/content-pack model, exam date and available-time setup.

**Completion criteria:**

- Recommendations use explicit reason codes: commitment, unfinished action, revision due, assessment need, or deadline.
- Students can accept, edit, defer, dismiss, and explain an override.
- Weekly plan and actual outcomes can be reviewed without guilt framing.
- Revision policy is deterministic, configurable, and based on evidence rather than a single universal delay.

**Wait until later:** opaque automatic scheduling, calendar integrations, AI-generated plans.

## Phase 4 — Evidence engine

**Purpose:** Add meaningful evidence beyond time and task state.

**Expected user value:** Progress means more than “I was present”; Astra can distinguish review, practice, uncertainty, and demonstrated recall.

**Why here:** Planning only becomes defensible when it has better inputs.

**Dependencies:** Phase 3 recommendation reasons and correction UX.

**Completion criteria:**

- Students can record practice and recall outcomes with minimal friction.
- Topic state has explicit, understandable semantics.
- Revision recommendations respond to actual evidence.
- Analytics reports learning actions and outcomes, not just timer totals.

**Wait until later:** automated mastery claims, AI-generated assessments, external content ingestion at scale.

## Phase 5 — Adaptive memory

**Purpose:** Let Astra retain carefully bounded, evidence-linked observations that improve future planning.

**Expected user value:** The system remembers relevant commitments and recurring study needs without becoming invasive or incorrect.

**Why here:** Memory needs stable source events, correction rules, and a real use in planning.

**Dependencies:** Phases 2–4, provenance model, retention policy, user review controls.

**Completion criteria:**

- Every memory shows source evidence, confidence, status, and correction/deletion controls.
- Automatic observations are proposed or conservatively confirmed.
- Memory changes a recommendation only when its rationale is visible.
- No sensitive inference or personality labeling is permitted.

**Wait until later:** narrative identity models, autonomous adaptation, emotionally anthropomorphic companion behavior.

## Phase 6 — AI companion

**Purpose:** Add natural language only where it clarifies evidence or reduces planning friction.

**Expected user value:** A student can ask for an explanation, a concise summary, or help structuring a plan without surrendering agency.

**Why here:** AI becomes useful only after it has trustworthy context and constraints.

**Dependencies:** Adaptive memory, privacy consent, usable offline core, source attribution, safety rules.

**Completion criteria:**

- AI explains recommendations with linked evidence.
- Cloud use is explicit and opt-in; unavailable AI does not degrade the core experience.
- Generated plans and memories are proposals, not silent mutations.
- The companion avoids false intimacy, unsupported claims, and guilt.

**Wait until later:** broad assistant chat, autonomous agents, multi-provider optimization.

## Phase 7 — Insights and advanced intelligence

**Purpose:** Surface occasional, actionable patterns from long-term evidence.

**Expected user value:** The student receives a useful weekly or monthly reflection that changes a real decision.

**Why here:** Insights must be earned by enough correct history and a clear action model.

**Dependencies:** Complete prior phases, outcome metrics, careful privacy policy.

**Completion criteria:**

- Every insight states evidence, uncertainty, and a suggested action.
- Insights can be dismissed, corrected, or hidden.
- No empty insight panels or fabricated interpretation exists.
- Value is measured by student-reported clarity and action, not attention.

**Wait until later:** cross-device sync, social features, broad marketplace/plugin systems, dynamic wallpaper systems.

## Parallel requirements

Accessibility, security, exportability, keyboard support, and documentation accuracy are not later phases. They are acceptance criteria for every phase.
