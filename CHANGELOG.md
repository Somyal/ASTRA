# Changelog

All notable changes to Project Astra will be documented in this file.

## [0.1.0-alpha] - 2026-06-30

### Added
- Scaffolding of Tauri v2 desktop shell with React 19, TypeScript, and Vite.
- Complete folder structure initialized according to Chapter 14 of the Engineering Constitution.
- Tooling setup: Prettier, EditorConfig, VS Code settings and extension recommendations, and custom GitIgnore rules.
- Visual system foundation: Vanilla CSS variables design token setup in `src/index.css` and custom `src/App.css`.
- Basic UI components: `Button` and `Typography` visual primitives.
- Global state stores: Zustand `sessionStore`, `appStore`, and `uiStore` implemented.
- Environment Composition screens: Skeletons for `DashboardEnvironment`, `FocusModeEnvironment`, `RecoveryEnvironment`, and `SessionCompleteEnvironment`.
- Rust Backend modules and structures: `commands/`, `services/`, `ai/` (Gemini provider), `brain/`, `db/`, `types/`, and `background/`.
- Development helper scripts: Custom scripts for checking and compilation.
