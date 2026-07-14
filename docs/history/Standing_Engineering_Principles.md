# Standing Engineering Principles

This document defines the permanent engineering guidelines and principles for Project Astra, derived from formal architectural and philosophical reviews. Future milestones must adhere to these directives.

---

## 1. Core Principles

### Principle 1: Preserve Values, Not Rigidity
Astra’s core identity is defined by its **values** (Calm, Privacy, Ownership, Honesty, Respect), not by **rigid tactical defaults**. Relational parameters (humor settings, motivational modes, and communications pacing) and interface styling may be customized, while core privacy and flow protection remain immutable.

### Principle 2: Accessibility Gating Over Majority Rules
The selection of accessibility, screen-reading, localizations, or performance features must be evaluated under the query: **"Would the students who need this be locked out without it?"** rather than whether the majority of users notice its existence. Purity must never result in exclusion of vulnerable student groups.

### Principle 3: Remove Operational Noise, Not Meaningful Decisions
Astra acts as an advisor, never as a controller. It removes operational friction (elapsed time calculation, spaced repetition scheduling, session logs) but preserves student autonomy and decision authority. Astra suggests options; the student decides and commands.

### Principle 4: Distinct Interaction Modes
- **Focus Mode (Invisible Tool):** Astra must be completely silent, display no notifications, and hide all layouts. The tool disappears to protect user flow.
- **Reflection Mode (Companion):** Astra behaves as an empathetic mirror, habit tracker, and guide.
*Rule:* Astra must never speak, flash, or prompt while a focus session timer is active.

### Principle 5: User Ownership & Longevity
Data ownership must be technically guaranteed. The local-first SQLite database must be queryable and structured relationally (no monolithic, unconstrained JSON blobs for crown-jewel states).
- **Future Roadmap Items:**
  - **Export:** Human-readable Markdown and structured JSON data exports.
  - **Import / Recovery:** Seamless restore from user-owned file keys.
  - **Encrypted Backup:** Encrypted backups to user-specified local or user-owned cloud drives.
  - **Full Wipe:** A complete, single-command unrecoverable purge of local databases and configurations.

### Principle 6: AI Enhances; It Never Defines
Astra must remain fully functional offline in a network-isolated environment.
- Deterministic core operations (timers, task checklists, Leitner spaced-repetition schedules, chapter hierarchies) must execute locally without AI dependencies.
- AI (local Ollama or cloud API fallback) is strictly an additive cognitive companion for natural language intents and long-term reflection.
- **AI Portability Note:** AI Providers are technically interchangeable but behaviorally different. Astra's identity must remain independent of the underlying reasoning model.

### Principle 7: Simplicity Wins
Abstractions, plugin schemas, and complex pipelines are rejected unless they have a direct, active consumer in the current milestone. Maintainable, direct, readable code is preferred over speculative interfaces.

---

## 2. Engineering & Diagnostics Rules

### Diagnostics & Safety
- **Telemetry Renaming:** All future tracking, crash reporting, or diagnostic options must be named **Anonymous Diagnostics** or **Crash Diagnostics** to avoid telemetry tracking implications.
- **Diagnostics Boundary:** Diagnostics are opt-in, anonymized, and aggregate, protecting privacy as a legal floor (under GDPR, India DPDP, and COPPA).

---

## 3. Database Architecture Note

### Brain Storage Evaluation
- **Future Discussion:** Evaluate the complete decomposition of the single-row JSON Brain storage into relational SQLite tables once the core memory implementation begins.
