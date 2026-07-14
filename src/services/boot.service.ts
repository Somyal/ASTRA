import { initializeDatabase } from '../repositories/db';
import { repositoryFactory, StudySession } from '../repositories/index';
import { useUIStore } from '../store/ui.store';
import { useContentStore } from '../store/content.store';
import { useStudyStore } from '../store/study.store';
import { useSettingsStore } from '../store/settings.store';
import { seedService } from './seed.service';
import { syllabusService } from './syllabus.service';
import { taskIntelligenceService } from './task_intelligence.service';
import { analyticsService } from './analytics.service';
import { learningService } from './learning.service';

/**
 * BootService - Initializes the ASTRA application on startup
 *
 * **Boot Stages:**
 * 1. **booting**: Core application initialization
 * 2. **migrating**: Database setup (SQLite or in-memory fallback)
 * 3. **hydrating**: Loading data from database into stores
 * 4. **ready**: Application fully initialized and ready for user interaction
 *
 * **Error Handling:**
 * - Each stage is wrapped with try-catch to provide clear error context
 * - Database errors are distinguished from hydration errors
 * - Crash recovery is isolated: if recovery fails, boot still completes
 * - All errors are logged to console AND stored in UI state for display
 *
 * **Data Initialization Order:**
 * 1. Database migrations (creates tables if needed)
 * 2. Default settings seeding (sets defaults if empty)
 * 3. Syllabus tree loading (academic structure)
 * 4. Task queue generation (AI-powered daily recommendations)
 * 5. Crash recovery check (marks interrupted sessions as abandoned)
 * 6. Streak calculation (computes current study streak from sessions)
 * 7. Store hydration (populates all Zustand stores)
 *
 * **Known Issues & Fixes:**
 * - Was: No per-stage error context (now: nested try-catch blocks with descriptive messages)
 * - Was: Crash recovery could corrupt boot process (now: isolated try-catch for recovery)
 * - Was: Silent failures in database operations (now: all operations wrapped with error logging)
 */
export class BootService {
  /**
   * Main boot function - orchestrates entire application startup
   *
   * Sets UI state through each stage and populates all data stores.
   * If any critical stage fails, transitions to 'error' state with message.
   *
   * @throws Never throws - all errors are caught and stored in UI state
   */
  async boot(): Promise<void> {
    const uiStore = useUIStore.getState();
    try {
      // Stage 1: booting
      uiStore.setBootState('booting');

      // Stage 2: migrating
      uiStore.setBootState('migrating');
      try {
        const isTauri =
          typeof window !== 'undefined' &&
          (window as Window & { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__ !== undefined;
        if (isTauri) {
          repositoryFactory.setMode('sqlite');
          await initializeDatabase();
        } else {
          console.warn('Running outside Tauri environment. Falling back to InMemory repositories.');
          repositoryFactory.setMode('memory');
        }
      } catch (error) {
        throw new Error(
          `Database initialization failed: ${error instanceof Error ? error.message : String(error)}`,
          { cause: error }
        );
      }

      // Stage 3: hydrating
      uiStore.setBootState('hydrating');

      try {
        // 1. Seed database hierarchy if empty
        await seedService.seedIfEmpty();

        const contentRepo = repositoryFactory.getContentRepository();
        const settingsRepo = repositoryFactory.getSettingsRepository();
        const sessionRepo = repositoryFactory.getSessionRepository();

        // 2. Fetch default settings if empty and save
        const settings = await settingsRepo.getSettings();
        if (Object.keys(settings).length === 0) {
          const defaultSettings = {
            userName: 'Gautam',
            examinationGoal: 'JEE Advanced (45 days remaining)',
            theme: 'dark',
            soundVolume: 50,
            soundscape: 'rain',
            recoveryEnabled: true,
            focusDefaultDuration: 3000,
          };
          await settingsRepo.saveSettings(defaultSettings);
        }

        // 3. Hydrate syllabus tree structure
        const tree = await syllabusService.getSyllabusTree();
        const dbSubjects = await contentRepo.getSubjects();

        if (!tree) {
          throw new Error('Failed to load syllabus tree');
        }
        if (!Array.isArray(dbSubjects)) {
          throw new Error('Failed to load subjects');
        }

        useContentStore.getState().setSubjects(dbSubjects);
        useContentStore.getState().setSyllabusTree(tree);

        // 4. Compile the intelligent daily task queue
        await taskIntelligenceService.generateDailyWorkQueue();

        const dbSettings = await settingsRepo.getSettings();

        // 5. Crash Recovery Check
        const activeSession = await sessionRepo.getActiveSession();
        let recoveredSessionRecord: StudySession | null = null;
        if (
          activeSession &&
          (activeSession.status === 'running' || activeSession.status === 'paused')
        ) {
          try {
            const recoveredSession: StudySession = {
              ...activeSession,
              completedAt: new Date().toISOString(),
              status: 'abandoned' as const,
              wasInterrupted: true,
            };
            await sessionRepo.saveSession(recoveredSession);
            recoveredSessionRecord = recoveredSession;

            // Saved recovered session status
          } catch (recoveryError) {
            console.error('Failed to process crash recovery:', recoveryError);
            // Don't fail boot if recovery fails, just log it
          }
        }

        // 6. Hydrate study store from dynamic analytics service
        const stats = await analyticsService.getStats();
        useStudyStore.setState({
          ...stats,
          recoveredSession: recoveredSessionRecord,
        });

        // Hydrate SettingsStore
        useSettingsStore.setState({
          identity: {
            userName: (dbSettings.userName as string) || 'Gautam',
            examinationGoal:
              (dbSettings.examinationGoal as string) || 'JEE Advanced (45 days remaining)',
          },
          preferences: {
            theme: (dbSettings.theme as string) || 'dark',
            wallpaper: (dbSettings.wallpaper as string) || 'default-stars',
            soundVolume: typeof dbSettings.soundVolume === 'number' ? dbSettings.soundVolume : 50,
            soundscape: (dbSettings.soundscape as string) || 'rain',
            recoveryEnabled:
              dbSettings.recoveryEnabled !== undefined ? Boolean(dbSettings.recoveryEnabled) : true,
            focusDefaultDuration:
              typeof dbSettings.focusDefaultDuration === 'number'
                ? dbSettings.focusDefaultDuration
                : 3000,
          },
        });

        // 7. Hydrate learning record store
        await learningService.loadInitialData();

        // Stage 4: ready
        uiStore.setBootState('ready');
      } catch (hydrationError) {
        throw new Error(
          `Application hydration failed: ${hydrationError instanceof Error ? hydrationError.message : String(hydrationError)}`,
          { cause: hydrationError }
        );
      }
    } catch (error) {
      console.error('Fatal boot error in ASTRA:', error);
      uiStore.setBootState('error');
      uiStore.setBootError(error instanceof Error ? error.message : String(error));
    }
  }
}

export const bootService = new BootService();
export default bootService;
