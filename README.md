🌌 Project Status

⚠️ Development is currently paused.

Astra began as an ambitious attempt to build a local-first AI-powered study operating system. During development, I realized that the vision for Astra extends far beyond my current level of experience in AI engineering, distributed systems, and large-scale application architecture.

Rather than continue building on incomplete foundations, I've decided to pause active development and spend the next year deepening my knowledge in:

Artificial Intelligence & LLM systems
Machine Learning fundamentals
Agentic workflows
Systems programming (Rust)
Software architecture & distributed systems
Product engineering

The project is not abandoned—it's simply waiting until I have the technical foundation to build it the way it was originally envisioned.

In the meantime, many of the ideas explored here continue to influence my smaller projects, particularly BeatMe, where I can experiment with concepts at a much smaller scale.

I hope to return to Astra in the future with the experience needed to do the vision justice.



# Project Astra — Study Sanctuary

Astra is a premium desktop study environment designed to remove cognitive friction between deciding to study and actually studying. Developed around the principles of calm design, local-first reliability, emotional intelligence, and complete student ownership of data, Astra acts as a dedicated study space rather than a fragmented productivity application.

---

## 🛠️ Technology Stack

Following the **Astra Engineering Constitution**, the core architecture consists of:
*   **Desktop Shell & Backend**: [Tauri v2](https://tauri.app) powered by **Rust** (Tokio async concurrency, WAL-journaled SQLite database).
*   **Frontend UI Layer**: [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) + [Vite](https://vite.dev) (state-based transitions, organic animations, Vanilla CSS styling).
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand) (modular, lightweight stores).
*   **AI reasoning**: Provider-independent abstraction (Gemini 2.5 Flash model currently integrated).

---

## 📂 Project Architecture

```
astra/
├── assets/             # Wallpaper assets, seamless soundscape audio loops
├── docs/               # Founding documents (Visions, Experience, Engineering Constitution)
├── migrations/         # Embedded database migration SQL scripts
├── prompts/            # Encoded prompt templates (morning greeting, reflection, etc.)
├── shared-types/       # Type mappings shared between frontend and backend
├── src/                # React Frontend (TypeScript)
│   ├── components/     # Visual primitives (Button, Typography, icons)
│   ├── features/       # Self-contained product modules (session, tasks, settings, etc.)
│   ├── environments/   # Environmental layouts (Dashboard, Focus Sanctuary, Recovery)
│   ├── stores/         # Zustand global state management
│   ├── hooks/          # React hooks (useTimer, keyboard shortcuts)
│   └── lib/            # IPC utility wrappers and theme token specifications
└── src-tauri/          # Tauri Desktop Native Layer (Rust)
    ├── Cargo.toml      # Rust package dependencies and build definitions
    └── src/
        ├── ai/         # Provider-agnostic AI traits (Gemini, Claude, stubs)
        ├── brain/      # Local Brain memory model and summary engine
        ├── commands/   # IPC Tauri command handlers (thin wrappers)
        ├── db/         # SQLite connection pools and query layer
        ├── services/   # Domain logic services (session, tasks, memory)
        ├── types/      # Shared model structs and serializable AstraErrors
        └── background/ # Tokio async background daemons (timer, daily resets)
```

---

## 🚀 Getting Started

### Prerequisites

1.  **NodeJS**: `v26.0+`
2.  **Rust Toolchain**: Stable cargo/rustc setup (see [Rust installation guide](https://www.rust-lang.org/tools/install))
3.  **Tauri Prerequisites**: Standard build tools matching your platform (see [Tauri setup guide](https://tauri.app/v2/guides/prerequisites/))

### Initial Setup

```bash
# Clone the repository and install dependencies
npm install

# Run the project in development mode
npm run tauri dev
```

### Verification & Tooling Commands

```bash
# Check Rust backend compilation
npm run check:rust

# Compile React frontend
npm run build:frontend

# Format & Lint
npm run lint
npm run format
```

---

## 📜 Principles & Governance

All future developments must adhere to the **Astra Engineering Constitution** in `docs/`:
1.  **The AI is an Engine**: Astra's identity and memory context live locally, never inside vendor-specific fine-tuning.
2.  **The Thirty-Second Rule**: Startup, rendering, and database transactions on the critical session-start path must execute sub-100ms.
3.  **Silence is a Feature**: All non-essential background processes throttle during active focus sessions to preserve system resources and prevent audible fan noise.
