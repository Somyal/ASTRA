# Project ASTRA Bug Tracker

This document is the single source of truth for all software defects discovered during Project ASTRA. It is a permanent engineering document and must be updated immediately upon discovering or resolving any issue.

## Workflow & Guidelines

- **Immediate Recording**: Every discovered bug must be recorded immediately in this document.
- **Workflow Pipeline**: Bugs must progress strictly through the lifecycle: **Open** → **In Progress** → **Fixed**.
- **Historical Tracking**: Never delete bug history. Fixed bugs remain in the document permanently to serve as an audit trail and prevent regressions.
- **Single Source of Truth**: This document is the absolute authority on software defects; do not track bugs elsewhere.
- **Severity Guidelines**:
  - **Critical**: Bugs that block development, break main flows, cause data loss, or crash the application.
  - **Major**: Core functionality failure with no easy workaround, or severe UX regression.
  - **Minor**: Small UI glitches, visual styling inconsistencies, or non-blocking UX issues.

---

## Statistics

- **Open Bugs**: 0
  - **Critical**: 0
  - **Major**: 0
  - **Minor**: 0
- **Fixed Bugs**: 4
- **Known Limitations**: 0

---

## Template for New Bugs

When adding a new bug, copy the template below, increment the bug number sequentially (e.g., `BUG-0001`), and place it under the appropriate section.

```markdown
## BUG-XXXX
Title: 

Milestone Introduced: 

Status: 
(Open / In Progress / Fixed)

Severity: 
(Critical / Major / Minor)

Category: 
(UI / UX / Database / Architecture / Performance / State Management / Session Engine / Memory / Tasks / Other)

Environment: 
(Windows, Tauri Dev, Production Build, etc.)

Description: 

Steps to Reproduce: 
1. 
2. 
3. 

Expected Behaviour: 

Actual Behaviour: 

Possible Root Cause: 
(Optional)

Notes: 

Resolved In: 
(Leave empty until fixed.)
```

---

# Open Bugs

*No open bugs.*

---

# In Progress

*No bugs currently in progress.*

---

# Fixed Bugs

## BUG-0001
Title: Fullscreen button does nothing

Milestone Introduced: Milestone 1.8

Status: Fixed

Severity: Major

Category: Architecture

Environment: Windows, Tauri Dev, Production Build

Description: Start a focus session. Click Fullscreen Sanctuary. Nothing happens.

Steps to Reproduce:
1. Start a focus session.
2. Click "Fullscreen Sanctuary" at the bottom of the screen.
3. Observe that the window does not transition to fullscreen mode.

Expected Behaviour:
The window should enter fullscreen mode immediately.

Actual Behaviour:
The window remains windowed and does not enter fullscreen mode.

Possible Root Cause:
Missing permissions configuration inside the Tauri capabilities manifest (`capabilities/default.json`). In Tauri v2, native window APIs (like `setFullscreen`) must be explicitly allowed.

Notes:
Resolved by adding `"core:window:allow-set-fullscreen"`, `"core:window:allow-set-always-on-top"`, and `"core:window:allow-set-size"` to `capabilities/default.json`. Entering and exiting fullscreen repeatedly was tested and confirmed robust.

Resolved In: Bug Fix Sprint #001

---

## BUG-0002
Title: Mini Timer mode is poorly designed

Milestone Introduced: Milestone 1.8

Status: Fixed

Severity: Minor

Category: UX

Environment: Windows, Tauri Dev, Production Build

Description: The Mini Timer is cramped, hard to read, and wastes screen space. It behaves like a basic prototype instead of a polished widget.

Steps to Reproduce:
1. Start a focus session.
2. Click "Mini-Timer Mode" at the bottom.
3. Observe the resulting tiny window and tiny controls.

Expected Behaviour:
A professional floating desktop widget that has a readable countdown, clear subject/topic header, and polished circle icon buttons with proper spacing.

Actual Behaviour:
Cramped text layout and raw text-character buttons (▶, ■, ⛶) packed together.

Possible Root Cause:
The dimensions were hardcoded to a very small size (`250x180`), and the layout did not leverage custom circular button controls or proper layout margins.

Notes:
Resolved by expanding dimensions to `320x210` in `WindowService` and upgrading the layout inside `FocusModeEnvironment.tsx` using `IconButton` controls with circular borders and transitions.

Resolved In: Bug Fix Sprint #001

---

## BUG-0003
Title: Reflection screen is soft-locked

Milestone Introduced: Milestone 1.8

Status: Fixed

Severity: Critical

Category: State Management

Environment: Windows, Tauri Dev, Production Build

Description: At the end of a study session, the Reflection screen opens. Typing text and clicking "Submit & Complete" or "Skip Reflection" does nothing, trapping the user forever.

Steps to Reproduce:
1. Complete a study session.
2. Type reflection text on the complete screen.
3. Click "Submit & Complete" or "Skip Reflection".
4. Observe that the buttons do not change the view or progress.

Expected Behaviour:
Clicking either button should cleanly archive the session, record statistics (without duplication), and redirect the user back to the dashboard or recovery tab.

Actual Behaviour:
Nothing happens, and the user cannot navigate away from the completion page.

Possible Root Cause:
When recovery is enabled, `completeReflection` calls `startRecovery()`, which changes the active UI tab to `'recovery'` but fails to reset the study store status from `'reflection'` to `'idle'`. Because `AppShell` always overrides and shows the reflection screen if the study status is `'reflection'`, the user is soft-locked. Furthermore, both `SessionService` and `StudyStore` were executing duplicate derived-data logging operations on archival, causing lifetime and daily stats to double-count.

Notes:
Resolved by reorganizing the flow to archive the session (which resets study status to `'idle'` and clears active session details) before triggering recovery breaks. The target tab is now dynamically supplied to `archiveSession()`. Also removed duplicate state updates in `SessionService` to fix stats doubling.

Resolved In: Bug Fix Sprint #001

---

## BUG-0004
Title: UI text is selectable everywhere

Milestone Introduced: Milestone 1.0

Status: Fixed

Severity: Minor

Category: UI

Environment: Windows, Tauri Dev, Production Build

Description: Most UI labels, buttons, headers, and the countdown timer can be highlighted using mouse dragging, making the app feel like a webpage rather than a native desktop app.

Steps to Reproduce:
1. Click and drag the mouse cursor over text labels on the Dashboard, Focus page, or settings headers.
2. Observe that the text highlights/selects.

Expected Behaviour:
Text selection should be disabled globally to replicate native desktop experiences, except on text inputs, textareas, and editable areas.

Actual Behaviour:
All interface text elements are highlightable and copyable by default.

Possible Root Cause:
No global `user-select` CSS constraints were configured at the root body level in `index.css`.

Notes:
Resolved by declaring `user-select: none` globally on the `body` selector inside `index.css`, while whitelisting `input`, `textarea`, `[contenteditable="true"]`, and `.selectable-text` to keep text fields fully functional and selectable.

Resolved In: Bug Fix Sprint #001

---

# Known Limitations

*No known limitations.*
