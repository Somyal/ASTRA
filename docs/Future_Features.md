# Future Features Ledger

This is the permanent repository backlog for feature ideas that do not belong in the active milestones. No features listed here may be implemented without passing the core Philosophy, UX, Complexity, and Performance reviews.

---

## 1. Study Experience & Focus Modes

### A. Deep Focus Stopwatch Mode
*   **Description**: A study counter that ticks upward instead of counting down, for open-ended study sanctuaries.
*   **Why it improves Astra**: Accommodates students who find countdown timers stressful and prefer tracking total focus length.
*   **Dependencies**: `SessionService` state expansion.
*   **Priority**: Medium
*   **Status**: Planned

### B. Adaptive Session Suggestions
*   **Description**: Suggests a custom focus length on startup (e.g. *"50 minutes today?"*) based on historical logs.
*   **Why it improves Astra**: Eliminates configuration decision fatigue, making entry to the sanctuary faster.
*   **Dependencies**: Memory observation analysis algorithms.
*   **Priority**: Low
*   **Status**: Idea

---

## 2. Memory & AI Sanctuary

### A. Structured Reflection Timeline
*   **Description**: A timeline layout allowing the student to read reflections from months or years ago.
*   **Why it improves Astra**: Strengthens long-term encouragement by showing cognitive breakthroughs over time.
*   **Dependencies**: `MemoryRepository` query filters.
*   **Priority**: Medium
*   **Status**: Research

### B. Background Memory Consolidation
*   **Description**: A background Rust thread that runs during computer idle-time to consolidate active observations into long-term memories.
*   **Why it improves Astra**: Cleans up temporary observations and extracts macro-insights without blocking main UI threads.
*   **Dependencies**: Future Runtime orchestrator service.
*   **Priority**: High
*   **Status**: Approved

---

## 3. Customization & Sound Engine

### A. Local Ambient Sound Mixer
*   **Description**: Multi-channel local ambient player blending separate tracks (e.g., rain, fire crackling, coffee shop noise) offline.
*   **Why it improves Astra**: Allows the student to mix their ideal acoustic sanctuary block.
*   **Dependencies**: Rust-Tauri audio framework.
*   **Priority**: Medium
*   **Status**: Idea

### B. Dynamic Lighting Wallpapers
*   **Description**: Sanctuary wallpaper background colors that shift slowly based on the student's local hour.
*   **Why it improves Astra**: Enhances the visual passage of time and aligns with circadian rhythms.
*   **Dependencies**: CSS custom property mappings.
*   **Priority**: Low
*   **Status**: Idea

---

## 4. Operational & Performance

### A. Database Sync Protocol
*   **Description**: Offline-first table replication across multiple devices (e.g. tablet and laptop) using local network sync.
*   **Why it improves Astra**: Keeps logs synchronized without relying on central database clouds.
*   **Dependencies**: CRDT or delta-sync engine.
*   **Priority**: High
*   **Status**: Research

### B. Auto-Backup Rotation & Cleanup
*   **Description**: Automatic snapshot backup rotation (keeping 5 recent copies) and compression.
*   **Why it improves Astra**: Prevents manual backup neglect.
*   **Dependencies**: `BackupService` filesystem triggers.
*   **Priority**: Medium
*   **Status**: Planned
