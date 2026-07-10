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

*   **Bug Tracker (`Bug_Tracker.md`)**: The single source of truth for all bugs discovered during Project ASTRA, tracking lifecycle states (Open/In Progress/Fixed).
*   **Engineering Playbook (`Engineering_Playbook.md`)**: Standardized rules, architectural restrictions, and workflows.
*   **Repository Map (`Repository_Map.md`)**: The directory and component boundary map.

