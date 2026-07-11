# Immediate Next Steps

These are the ten highest-impact tasks if development restarts tomorrow. They are intentionally concrete and ordered. No task should be displaced by a new visual surface, AI experiment, or convenience feature.

## 1. Define and approve the Learning Record vocabulary

**Purpose:** Establish precise domain meanings for learning action, session, outcome, task, topic progress, practice, assessment, revision, and mastery.

**Expected user value:** Students can understand what Astra records and why progress changes.

**Dependencies:** Product Recalibration v1.

**Estimated complexity:** Medium.

**Why now:** Every subsequent product, schema, analytics, planning, and AI decision depends on these distinctions.

**Success criteria:** A concise domain document and state diagram are approved; no UI or service is allowed to equate a checked task with learning completion.

## 2. Correct analytics from raw session records

**Purpose:** Make today, week, lifetime, session count, and recent-history values correct and reconcilable.

**Expected user value:** The student can trust the basic record of effort.

**Dependencies:** Defined local-day boundary and session semantics.

**Estimated complexity:** Medium.

**Why now:** Incorrect analytics is an immediate trust failure and contaminates future recommendations.

**Success criteria:** Query-backed metrics pass timezone, midnight, empty-history, interruption, and reconciliation tests; no dashboard card presents contradictory time or count.

## 3. Make backup and restore complete and safe

**Purpose:** Guarantee recovery of the complete user-owned learning record.

**Expected user value:** A student can back up, restore, and upgrade without fear of losing years of work.

**Dependencies:** Inventory of all user-owned tables and current schema version.

**Estimated complexity:** High.

**Why now:** Data loss is irreversible and contradicts Astra's strongest promise.

**Success criteria:** Backup includes all owned entities; restore validates compatibility, creates a pre-restore safety snapshot, executes atomically, and verifies integrity before success is shown.

## 4. Remove inactive intelligence from the student-facing path

**Purpose:** Stop UI copy and navigation from implying a companion, insight engine, or memory adaptation that is not operating.

**Expected user value:** The product is honest, simpler, and easier to understand.

**Dependencies:** Product Recalibration v1.

**Estimated complexity:** Low.

**Why now:** This reduces expectation debt immediately and creates focus for the real loop.

**Success criteria:** No primary screen contains empty insights, static monitoring claims, or developer-only playground navigation; inactive capability is either hidden or accurately labeled.

## 5. Build the first-run learning setup

**Purpose:** Replace founder-specific defaults with a short, skippable setup for name, curriculum, exam date, subjects, and study preference.

**Expected user value:** Astra starts as the student's workspace, not a demo.

**Dependencies:** Content-pack direction and settings ownership decision.

**Estimated complexity:** Medium.

**Why now:** A trustworthy learning loop begins with a real goal and curriculum context.

**Success criteria:** A first-time student can reach a valid first learning action in under two minutes and can revise every setup decision later.

## 6. Redesign the dashboard around one confirmed next learning action

**Purpose:** Replace competing subject, free-text topic, task queue, and syllabus entry points with one clear action and transparent alternatives.

**Expected user value:** Less decision fatigue before studying.

**Dependencies:** Learning Record vocabulary and first-run setup.

**Estimated complexity:** High.

**Why now:** The dashboard is Astra's product contract; it must express the core loop.

**Success criteria:** A usability test participant can state what to do next, why, and how to change it without assistance.

## 7. Add a low-friction end-of-session learning outcome

**Purpose:** Capture whether the selected action moved forward, partly moved forward, or needs another attempt, with optional notes.

**Expected user value:** The student leaves a session with a meaningful next state rather than only elapsed time.

**Dependencies:** Learning Record vocabulary and session transition safety.

**Estimated complexity:** Medium.

**Why now:** This creates the missing bridge between focus and planning.

**Success criteria:** Completion takes one tap by default, does not force prose, and deterministically affects only the appropriate learning record—not automatic mastery.

## 8. Decouple task completion from syllabus progression

**Purpose:** Prevent checkboxes from falsely marking learning work as complete.

**Expected user value:** Syllabus progress reflects deliberate academic evidence.

**Dependencies:** Learning outcome model.

**Estimated complexity:** Medium.

**Why now:** Existing data semantics are unsafe for planning intelligence.

**Success criteria:** Tasks, session outcomes, topic evidence, and mastery transitions have separate commands and visible meanings; legacy data migration is documented.

## 9. Add core-loop end-to-end and accessibility acceptance tests

**Purpose:** Verify the product a student experiences, including keyboard and recovery paths.

**Expected user value:** Fewer broken sessions and a usable product for more students.

**Dependencies:** Tasks 2, 3, 6, 7, and 8 as they land.

**Estimated complexity:** High.

**Why now:** The current unit-test foundation does not protect the product's most important flows.

**Success criteria:** Automated and manual test scripts cover first run, start/pause/resume, interruption/recovery, completion, outcome recording, backup/restore, keyboard focus, reduced motion, and screen-reader labels.

## 10. Rewrite the shipped capability and roadmap documentation

**Purpose:** Align README, roadmap, repository map, product copy, and ADRs with the actual active experience and the new product direction.

**Expected user value:** Indirect but essential: future work stays focused on real student value rather than aspirational architecture.

**Dependencies:** This document set and decisions from Tasks 1–8.

**Estimated complexity:** Low.

**Why now:** Documentation drift is already causing product expectation debt.

**Success criteria:** Every documented feature is marked shipped, experimental, planned, or internal; no document claims a live AI, memory, or analytics capability that does not exist.
