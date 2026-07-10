# ASTRA Engineering Glossary

This glossary defines the formal vocabulary used across the Astra codebase, reviews, and architecture logs.

---

## 1. Domain Concept Terms

*   **Sanctuary**: The visual environment of Astra during focus mode. A distraction-free workspace designed to mask environmental noise and maintain visual stillness.
*   **Session**: An active, timed focus event recorded in database tables. Governed by a strict state machine (`configured`, `running`, `paused`, `reflection`, `completed`, `abandoned`).
*   **Reflection**: The student's written self-assessment following a study session. Persisted as raw structured text.
*   **Recovery (Break)**: An optional 5-minute cooldown phase following session completion.
*   **Recovery (Crash)**: The boot-time safety routine identifying and repairing database sessions left running due to unexpected app exit.
*   **Companion**: The behavioral persona of Astra, providing assistance without feigning human emotion.
*   **Memory**: Intentional observations and insights Astra records to improve future guidance (e.g. concept confidence scores).
*   **Observation**: A raw, transient data event (such as a session duration or reflection text) from which permanent memory is synthesized.
*   **Consolidation**: The process of evaluating, updating, or promoting active observations into long-term memories.
*   **Brain**: The abstract term representing the totality of Astra's memory, context, and adaptation rules.
*   **Knowledge Foundation**: The normalized database schemas, models, and repositories that store operational and memory records.

---

## 2. Architectural Pattern Terms

*   **Local-First**: The core architecture axiom. Data, databases, backups, and execution tasks run entirely offline on the student's device.
*   **Repository**: A module in the persistence layer. Responsible for executing database queries. Implements a clean, mockable repository interface.
*   **Service**: A module in the logic layer. Orchestrates business operations, file storage, native APIs, and system coordinates. Contains no UI code.
*   **Store**: A Zustand state container. Holds active UI and routing states.
*   **Runtime**: The future orchestrator subsystem that manages app-level lifecycles, background sweeps, reset loops, and scheduled tasks.
*   **Provider**: An interface abstraction wrapper for external AI or model APIs, ensuring Astra remains model-agnostic.
*   **Adaptation**: A system-initiated configuration change (such as suggesting different breaks or highlighting confidence categories) made to optimize student rhythms.
