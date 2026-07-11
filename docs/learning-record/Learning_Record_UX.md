# Learning Record UX

## Purpose

This document defines the lightweight experience that turns a chosen learning action into useful continuity. Its governing rule is permanent:

> The cost of recording learning must always remain lower than the cost of learning itself.

If a screen makes that untrue, remove or defer it.

## Experience principles

- The student should be able to start in one decision.
- Ending a session should never trap the student in a form.
- A useful record is better than a complete record.
- “I do not know yet” and “I want to close now” are valid outcomes.
- Capture more only when the student sees a direct benefit now.
- The product must work equally for a 15-minute attempt, a three-hour deep session, and an untimed learning event.

## 1. Start: choose a learning action

### Default Today state

The first screen offers one clear entry point:

> **Continue:** Relative velocity — revisit frame selection  
> *From your last note yesterday*  
> **Start focus** · **Choose another action**

If no continuation exists:

> **What would you like to work on?**  
> [Start typing an Item or choose from recent items]

The student may use a recent Learning Item, select a suggested continuation, or type a short label. They are not required to configure a subject, duration, priority, goal, schedule, or evidence template before beginning.

### Action confirmation

Before focus, Astra asks only for the immediate intention:

> **What are you doing with this?**  
> Review · Practice · Recall · Create · Explore · [Write my own]

This selector is optional in the earliest flow. It is useful only if it changes the wording of the next step or evidence shortcut. The student can begin immediately.

### Why this is necessary

It creates a stable connection between focus and continuation while allowing any learning domain. It replaces the current conflict between free-text topic, task title, and syllabus node.

### Complexity introduced and justification

It introduces Learning Item selection and a temporary action. That complexity is justified because without it Astra cannot know what a session was for, and tomorrow's continuation becomes vague.

## 2. During focus: protect attention

Focus mode shows:

- the chosen Learning Item;
- the immediate action, if stated;
- an optional timer or stopwatch;
- pause and end controls;
- a quiet way to change the action only before real work begins.

It does not show task queues, insight cards, AI chat, streaks, analytics, recommendations, or evidence forms.

If the action changes materially, the student may update it. Astra should not infer that change from elapsed time.

## 3. End: leave the smallest useful trace

### Default end screen

When a session ends, present exactly one question and four exits:

> **How did this go?**  
> **Moved forward** · **Partly** · **Need another attempt**  
> **Close without recording outcome**

All choices are one click/tap. “Close without recording outcome” is visually present, not hidden behind a secondary action.

Meaning:

- **Moved forward**: the student believes this attempt advanced the current action. It is not mastery.
- **Partly**: some useful work happened; a continuation is likely helpful.
- **Need another attempt**: the student wants this Item to remain clearly resumable.
- **Close without recording outcome**: only factual timer/session data is retained, if any; no interpretation is added.

### No forced celebration

Use acknowledgment, not reward theatre:

> “Saved. You can continue this tomorrow.”

Do not use confetti, streak warnings, productivity scores, or praise that overstates what occurred.

## 4. Progressive evidence capture

After choosing an outcome, present one quiet optional affordance:

> **Add a note or evidence**

It is collapsed by default. Opening it offers a single free-text field first:

> “What should future you know?”

Then optional contextual shortcuts, never mandatory:

- **Numbers:** attempted / correct / score, with context and unit.
- **Completion:** lecture, reading, homework, artifact, or practice section completed.
- **Future cue:** what to start with next time.
- **Reference:** link or local artifact reference when supported.

The student can add nothing. Astra must not ask them to classify their learning into an elaborate template.

### When to reveal more

Reveal a domain template only after the student deliberately chooses it or repeats a compatible pattern. Example: “Add mock score” can appear after the student has created an exam-practice Item. It must not appear for music practice or writing by default.

## 5. Tomorrow: continuation, not dashboard reconstruction

On the next opening, Astra leads with the last actionable context, in this order:

1. A student-authored next-time cue.
2. An unfinished/deferred Learning Action.
3. The latest Item marked “partly” or “need another attempt.”
4. The latest focused Item with an unknown outcome, framed without assumption.
5. A student-selected plan or revision commitment.

Example for unknown outcome:

> “You last spent 22 minutes on Rust ownership. Continue, mark it later, or choose something else?”

The student is never forced to defend the last session or explain why it was unfinished.

## Manual entries without a session

Astra must support a quick “Add learning note” route outside focus for real learning events that occur elsewhere:

> “What happened?”  
> “Fixed parser crash; start tomorrow by adding empty-input coverage.”

The user can attach it to a recent Learning Item or leave a short label. This accommodates lectures, class, a mock score, a realization, an untracked practice session, or a work artifact without turning Astra into notes software.

## Editing and correction UX

- A recent entry offers **Edit**, **Correct outcome**, and **Delete**.
- Editing should feel like correcting a note, not reopening a form wizard.
- A history detail view may show “edited” when useful, but no audit-log mechanics are exposed by default.
- Deleting an entry removes it from future planning and AI context immediately.

## Accessibility and keyboard baseline

- `Ctrl/Cmd + Enter` begins focus after an action is selected.
- `Space` pauses/resumes during focus, except in text inputs.
- `Ctrl/Cmd + Enter` submits a chosen end outcome when focused.
- `Esc` exits optional evidence capture or fullscreen, never discards a saved record.
- Each outcome has an explicit text label, keyboard focus, and screen-reader description.
- Reduced motion changes acknowledgment to static state.

## Anti-patterns to avoid

| Temptation | Why it fails |
|---|---|
| Require a mood and reflection after every session | Exhausted students will skip or enter noise. |
| Ask for confidence/motivation every day | Converts learning into self-monitoring and creates weak evidence. |
| Automatically mark an Item complete after a positive outcome | One attempt is not mastery. |
| Show multiple recommendations at the end of focus | Pulls attention back into planning when the student wants to leave. |
| Ask users to build a hierarchy before starting | Setup becomes a barrier for first and casual use. |
| Use a rich form for every evidence type | Astra turns into a database rather than a continuation tool. |

## UX acceptance tests

The learning-record UX is ready only when:

- A first-time user can name an Item and begin within 30 seconds.
- A tired user can end a session and close the app in one click.
- A user who leaves no outcome still sees a respectful, useful continuation tomorrow.
- A user can record an untimed learning event in under 15 seconds.
- A user can correct or delete a recent entry without contacting support or navigating a data-management screen.
- No default completion path asks for a numeric metric, mood, long text, or mastery claim.
- The flow works entirely offline and without AI.
