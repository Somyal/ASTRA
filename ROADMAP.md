# Roadmap — Project Astra

This document maps out the development milestones of Project Astra, tracing back directly to the product vision and engineering principles in the Founding Documents.

## Milestone 0 — Repository Initialization (Current)
*   **Desktop Shell Scaffolding**: Setup Tauri v2 desktop shell with React 19, TS, and Vite.
*   **Modular Folder Directory Layout**: Conform exactly to Chapter 14 of the Engineering Constitution.
*   **Visual System Foundations**: CSS custom properties and baseline glassmorphism styling.
*   **Compiling Code Skeletons**: Ensure Rust backend and React frontend compilation.

## Milestone 1 — Local Storage & Session Engine
*   **Local SQLite Integration**: Embedded database configuration via `sqlx` (WAL journaled).
*   **Session Engine State Machine**: Session states (Idle, Active-Focus, Active-Recovery, Completed, Reflection).
*   **Tauri Native Windows**: Fullscreen sanctuary triggers and Picture-in-Picture floating mini-timer.
*   **Crash Recovery**: Auto-recovery logic for interrupted session records.

## Milestone 2 — Memory System & The Astra Brain
*   **Astra Brain Schema**: Deeply structured, versioned local JSON storage for user profile, rhythm, and contexts.
*   **Four-Tier Memory System**: Working Memory (RAM), Active Memory (ephemeral SQLite), Long-Term Memory (facts), and Archival (full historical record).
*   **Memory Synthesis & Consolidation**: Idle-time background passes promoting observations into insights.
*   **Adaptation Safety**: Audit logging via the `adaptation_ledger` and confirmation check steps.

## Milestone 3 — AI Abstraction Layer
*   **Character & Prompt Renderer**: System Character prompt composed with tone registers (Ordinary, Patient, Reflective).
*   **Google AI Studio Connector**: Integrating Gemini 2.5 Flash under the provider-agnostic `AIProvider` trait.
*   **Covenant Validation Gates**: AI validation rules to prevent profile overwriting.

## Milestone 4 — Experience Polish & Sound Engine
*   **Acoustic Loop System**: Seamless loops using Howler.js.
*   **Keyboard Command Palette**: Global quick-actions palette with sub-50ms latency.
*   **Animation System**: spring physics transitions using Framer Motion.

## Milestone 5 — Analytics Pipeline
*   **Caching Strategy**: Precomputed cached statistical metrics to ensure CPU silence during sessions.
*   **Heatmap Visualization**: Year-grid focus tracker mapping studied hours.
