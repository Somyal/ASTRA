# Repository Boundary Map

This map describes the structural layout, boundaries, and dependencies of major directories in Project Astra.

---

## 1. Frontend Workspace (`src/`)

### A. Repositories (`src/repositories/`)
*   **Purpose**: Manages all frontend SQLite database persistence queries.
*   **What belongs here**: Repository interface files, sqlite client instances (`db.ts`), database migration arrays, mock repository fallbacks.
*   **What does NOT belong here**: Core business logic, Zustand store bindings, UI components.
*   **Dependencies**: Tauri SQL plugin.

### B. Services (`src/services/`)
*   **Purpose**: Coordinates business logic and native desktop operations.
*   **What belongs here**: Timer intervals, file exporters (`backup.service`), window managers (`window.service`), streak algorithms.
*   **What does NOT belong here**: JSX elements, database select statements.
*   **Dependencies**: Zustand stores, Repository Factory.

### C. Stores (`src/store/`)
*   **Purpose**: Holds reactive frontend application state.
*   **What belongs here**: Zustand store declarations (`ui.store`, `study.store`, `settings.store`).
*   **What does NOT belong here**: Direct database executions, file system writes.
*   **Dependencies**: React-ready states.

### D. UI Components & Layouts
*   **Components (`src/components/`)**: Reusable presentation controls (Buttons, Cards, Sliders). Must be style-agnostic and logic-agnostic.
*   **Environments (`src/environments/`)**: Page-level visual panels (Dashboard, Settings, FocusMode). They bind Zustand stores to layout elements.
*   **Providers (`src/providers/`)**: Global contexts (Theme, AppConfig).
*   **Hooks (`src/hooks/`)**: Shared React logic (e.g. `useTheme`).

---

## 2. Backend Workspace (`src-tauri/src/`)

*   **Database (`db/`)**: Rust-side migrations and database instances (unused in v1; database queries are handled in TypeScript).
*   **AI Engine (`ai/`)**: Providers wrapping LLM integrations (Gemini, Claude).
*   **Brain Service (`brain/`)**: Decomposed JSON structures and file migration scripts.
*   **Background Threads (`background/`)**: Idle consolidation triggers and cron sweeps.
*   **Prompts (`prompts/`)**: Markdown templates defining the character persona.
*   **Commands (`commands/`)**: Serialized functions exposed to React via Tauri invoke.

---

## 3. Documentation Workspace (`docs/`)

`docs/README.md` is the contributor entry point and identifies active authority versus historical context.

* **`AI_Context_Guide.md` (at root)**: Permanent onboarding guide for future AI systems.
* **`product/`**: Active product constitution, identity, principles, roadmap, debt, non-goals, vision, and immediate priorities.
* **`learning-record/`**: Accepted Learning Record philosophy, UX, engineering contract, implementation roadmap, and unresolved questions.
* **`architecture/`**: Accepted Architecture Decision Records and this repository map.
* **`engineering/`**: Engineering playbook (which integrates standing principles), glossary, and bug tracker.
* **`foundation/`**: Living foundation checklist, dated readiness reviews, and the LR-1 Repository Audit & Implementation Plan.
* **`history/`**: Historical milestone logs, lessons, standing principles snapshot, and dated alignment/status snapshots. These explain prior decisions but do not override active documentation.
* **`reviews/`**: Preserved historical external/design reviews.
