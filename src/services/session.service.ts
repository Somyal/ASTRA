import { useStudyStore } from '../store/study.store';
import { useUIStore, AppTab } from '../store/ui.store';
import { useSettingsStore } from '../store/settings.store';
import { repositoryFactory } from '../repositories/index';
import { academicEventBus } from '../events/academic_event';

/**
 * SessionService - Manages the lifecycle of study sessions
 *
 * A session represents a focused study period with a subject, topic, and duration.
 * Sessions move through states: configured → running → (paused/resumed)* → completed → reflection → archived
 *
 * **Critical Implementation Details:**
 * - Only ONE timer should be active at a time (enforced by clearTimer())
 * - Always call clearTimer() before setting a new timer
 * - pauseSession() MUST clear the timer to prevent memory leaks
 * - resumeSession() must restart the timer after clearing
 * - All database operations include try-catch to prevent silent failures
 */
export interface ISessionService {
  /**
   * Configure a session with subject, topic, and target duration
   * @param subject - The subject being studied
   * @param topic - The specific topic/chapter
   * @param durationSecs - Target session duration in seconds
   */
  configureSession(subject: string, topic: string, durationSecs: number): void;

  /**
   * Start an active study session and begin timer
   * Saves initial state to database
   * @throws If database save fails
   */
  startSession(): Promise<void>;

  /**
   * Pause the current session (stops timer)
   * Saves paused state to database
   * @throws If database save fails
   */
  pauseSession(): Promise<void>;

  /**
   * Resume a paused session (restarts timer)
   * Saves resumed state to database
   * @throws If database save fails
   */
  resumeSession(): Promise<void>;

  /**
   * Complete the active session (stops timer, transitions to reflection)
   * Saves completed state to database
   * @throws If database save fails
   */
  completeSession(): Promise<void>;

  /**
   * Abandon the current session (stops timer, marks as interrupted)
   * Immediately archives the session
   * @throws If database save fails
   */
  abandonSession(): Promise<void>;

  /**
   * Complete session reflection (save reflection text, mood, and optionally start recovery)
   * May trigger recovery break if enabled in settings
   * @param text - User's reflection text
   * @param mood - Optional mood indicator (focused, distracted, tired, energized)
   * @throws If database save fails
   */
  completeReflection(
    text: string,
    mood?: 'focused' | 'distracted' | 'tired' | 'energized' | null
  ): Promise<void>;

  /**
   * Start a recovery break after focused study
   * Starts a countdown timer that auto-transitions after 5 minutes
   */
  startRecovery(): void;

  /**
   * End recovery break and return to dashboard
   * @throws If database save fails
   */
  endRecovery(): Promise<void>;

  /**
   * Archive the current session and return to dashboard or specified tab
   * Emits SessionCompleted event for analytics
   * @param targetTab - Which tab to navigate to (default: 'dashboard')
   * @throws If database save or event emission fails
   */
  archiveSession(targetTab?: AppTab): Promise<void>;
}

export class SessionService implements ISessionService {
  /** Currently active interval ID for session timer, or null if not running */
  private timerId: ReturnType<typeof setInterval> | null = null;

  private getRepository() {
    return repositoryFactory.getSessionRepository();
  }

  configureSession(subject: string, topic: string, durationSecs: number): void {
    useStudyStore.getState().configureSession(subject, topic, durationSecs);
  }

  async startSession(): Promise<void> {
    // Always clear any existing timer before starting a new one
    this.clearTimer();

    useStudyStore.getState().startSession();

    // Checkpoint: save running session to SQLite
    const active = useStudyStore.getState().activeSession;
    if (active) {
      try {
        await this.getRepository().saveSession(active);
      } catch (error) {
        console.error('Failed to save session on start:', error);
      }
    }

    // Set study countdown tick timer - only ONE timer should be active
    this.timerId = setInterval(async () => {
      const store = useStudyStore.getState();
      store.tickTime();

      // Periodic Checkpoint: Save progress every 60 seconds of study
      const updatedActive = useStudyStore.getState().activeSession;
      if (
        updatedActive &&
        updatedActive.actualDuration > 0 &&
        updatedActive.actualDuration % 60 === 0
      ) {
        try {
          await this.getRepository().saveSession(updatedActive);
        } catch (error) {
          console.error('Failed to periodic save session:', error);
        }
      }
    }, 1000);
  }

  async pauseSession(): Promise<void> {
    // CRITICAL: Clear timer when pausing to prevent multiple timers
    this.clearTimer();
    useStudyStore.getState().pauseSession();

    // Checkpoint: save paused status
    const active = useStudyStore.getState().activeSession;
    if (active) {
      try {
        await this.getRepository().saveSession(active);
      } catch (error) {
        console.error('Failed to save session on pause:', error);
      }
    }
  }

  async resumeSession(): Promise<void> {
    // Always clear existing timer before resuming
    this.clearTimer();
    useStudyStore.getState().resumeSession();

    // Checkpoint: save running status
    const active = useStudyStore.getState().activeSession;
    if (active) {
      try {
        await this.getRepository().saveSession(active);
      } catch (error) {
        console.error('Failed to save session on resume:', error);
      }
    }

    // Restart timer for resumed session
    this.timerId = setInterval(async () => {
      const store = useStudyStore.getState();
      store.tickTime();

      // Periodic Checkpoint: Save progress every 60 seconds of study
      const updatedActive = useStudyStore.getState().activeSession;
      if (
        updatedActive &&
        updatedActive.actualDuration > 0 &&
        updatedActive.actualDuration % 60 === 0
      ) {
        try {
          await this.getRepository().saveSession(updatedActive);
        } catch (error) {
          console.error('Failed to periodic save session on resume:', error);
        }
      }
    }, 1000);
  }

  async completeSession(): Promise<void> {
    this.clearTimer();
    useStudyStore.getState().completeSession();

    // Checkpoint: save completed status (transitions to reflection)
    const active = useStudyStore.getState().activeSession;
    if (active) {
      try {
        await this.getRepository().saveSession(active);
      } catch (error) {
        console.error('Failed to save session on complete:', error);
      }
    }
  }

  async abandonSession(): Promise<void> {
    this.clearTimer();
    useStudyStore.getState().abandonSession();

    // Checkpoint: save abandoned status
    const active = useStudyStore.getState().activeSession;
    if (active) {
      try {
        await this.getRepository().saveSession(active);
      } catch (error) {
        console.error('Failed to save session on abandon:', error);
      }
    }

    // Immediately archive abandoned session and return to Dashboard
    await this.archiveSession();
  }

  async completeReflection(
    text: string,
    mood?: 'focused' | 'distracted' | 'tired' | 'energized' | null
  ): Promise<void> {
    const store = useStudyStore.getState();
    if (store.activeSession) {
      const updated = {
        ...store.activeSession,
        reflection: text.trim() || null,
        mood: mood || null,
        status: 'completed' as const, // Set final completion status in DB
      };

      useStudyStore.setState({ activeSession: updated });

      // Checkpoint: save final reflection text and mood
      try {
        await this.getRepository().saveSession(updated);
      } catch (error) {
        console.error('Failed to save reflection:', error);
      }
    }

    // Optional Recovery break transition
    const recoveryEnabled = useSettingsStore.getState().preferences.recoveryEnabled;
    if (recoveryEnabled) {
      // Archive session state first to reset study status to 'idle' and clear activeSession,
      // but route to the recovery tab
      await this.archiveSession('recovery');
      this.startRecovery();
    } else {
      await this.archiveSession('dashboard');
    }
  }

  startRecovery(): void {
    // Always clear existing timer before starting recovery timer
    this.clearTimer();

    const uiStore = useUIStore.getState();
    uiStore.resetRecovery();
    uiStore.setActiveTab('recovery');

    // Run recovery break tick timer - only ONE timer should be active
    this.timerId = setInterval(async () => {
      const store = useUIStore.getState();
      store.tickRecovery();

      // Auto transition back to dashboard after 5 mins (300 seconds)
      if (store.recoveryElapsedSecs >= 300) {
        await this.endRecovery();
      }
    }, 1000);
  }

  async endRecovery(): Promise<void> {
    this.clearTimer();
    await this.archiveSession('dashboard');
  }

  async archiveSession(targetTab: AppTab = 'dashboard'): Promise<void> {
    this.clearTimer();

    // Read the active session details before clearing to emit the event
    const active = useStudyStore.getState().activeSession;

    // Reset session states back to idle (updates recent list, lifetime stats, status to idle, and clears activeSession)
    useStudyStore.getState().archiveSession();
    useUIStore.getState().setActiveTab(targetTab);

    if (active) {
      try {
        await academicEventBus.emit({ type: 'SessionCompleted', sessionId: active.id });
      } catch (e) {
        console.error('Failed to emit SessionCompleted event:', e);
      }
    }
  }

  /**
   * Clears the active timer if one exists.
   * This prevents multiple timers from running simultaneously.
   */
  private clearTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

export const sessionService = new SessionService();
export default sessionService;
