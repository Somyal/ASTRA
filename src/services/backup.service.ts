import { repositoryFactory } from '../repositories';
import { getDatabase } from '../repositories/db';
import { StudySession } from '../repositories/session.repository';
import { Task } from '../store/tasks.store';
import { MemoryEntry } from '../repositories/memory.repository';

export interface BackupMetadata {
  schemaVersion: number;
  backupVersion: number;
  astraVersion: string;
  createdAt: string;
}

export interface BackupPayload {
  metadata: BackupMetadata;
  data: {
    sessions: StudySession[];
    tasks: Task[];
    settings: Record<string, unknown>;
    memories: MemoryEntry[];
  };
}

export interface BackupPreviewSummary {
  createdAt: string;
  astraVersion: string;
  sessionsCount: number;
  tasksCount: number;
  settingsCount: number;
  memoriesCount: number;
}

export class BackupService {
  private pendingRestoreData: BackupPayload['data'] | null = null;

  async backupNow(): Promise<void> {
    try {
      const sessionRepo = repositoryFactory.getSessionRepository();
      const taskRepo = repositoryFactory.getTaskRepository();
      const settingsRepo = repositoryFactory.getSettingsRepository();
      const memoryRepo = repositoryFactory.getMemoryRepository();

      const sessions = await sessionRepo.getSessions();
      const tasks = await taskRepo.getTasks();
      const settings = await settingsRepo.getSettings();
      const memories = await memoryRepo.getMemories();

      const payload: BackupPayload = {
        metadata: {
          schemaVersion: 5,
          backupVersion: 1,
          astraVersion: '0.1.0',
          createdAt: new Date().toISOString(),
        },
        data: {
          sessions,
          tasks,
          settings,
          memories,
        },
      };

      const serialized = JSON.stringify(payload, null, 2);
      
      const blob = new Blob([serialized], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `astra_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Manual backup failed:', e);
      throw new Error('Could not create study backup.', { cause: e });
    }
  }

  async restorePreview(backupJsonStr: string): Promise<BackupPreviewSummary> {
    try {
      const payload = JSON.parse(backupJsonStr) as BackupPayload;
      
      // 1. Validate JSON format & metadata structure
      if (!payload || typeof payload !== 'object') {
        throw new Error('Invalid backup payload: payload is not an object.');
      }
      if (!payload.metadata || !payload.data) {
        throw new Error('Invalid backup structure: missing metadata or data.');
      }
      
      // 2. Validate schema version
      if (payload.metadata.schemaVersion !== 5) {
        throw new Error(`Incompatible schema version: ${payload.metadata.schemaVersion}. Current expected is 5.`);
      }

      // 3. Validate required tables arrays/objects formats
      if (payload.data.sessions && !Array.isArray(payload.data.sessions)) {
        throw new Error('Invalid backup structure: sessions must be an array.');
      }
      if (payload.data.tasks && !Array.isArray(payload.data.tasks)) {
        throw new Error('Invalid backup structure: tasks must be an array.');
      }
      if (payload.data.memories && !Array.isArray(payload.data.memories)) {
        throw new Error('Invalid backup structure: memories must be an array.');
      }
      if (payload.data.settings && typeof payload.data.settings !== 'object') {
        throw new Error('Invalid backup structure: settings must be an object.');
      }

      this.pendingRestoreData = payload.data;

      return {
        createdAt: new Date(payload.metadata.createdAt).toLocaleString(),
        astraVersion: payload.metadata.astraVersion,
        sessionsCount: payload.data.sessions?.length || 0,
        tasksCount: payload.data.tasks?.length || 0,
        settingsCount: payload.data.settings ? Object.keys(payload.data.settings).length : 0,
        memoriesCount: payload.data.memories?.length || 0,
      };
    } catch (e) {
      console.error('Failed to parse backup preview:', e);
      this.pendingRestoreData = null;
      throw e instanceof Error ? e : new Error('Invalid backup file contents.');
    }
  }

  async confirmRestore(): Promise<void> {
    if (!this.pendingRestoreData) {
      throw new Error('No pending restore data found. Select and preview a backup first.');
    }

    const sessionRepo = repositoryFactory.getSessionRepository();
    const taskRepo = repositoryFactory.getTaskRepository();
    const settingsRepo = repositoryFactory.getSettingsRepository();
    const memoryRepo = repositoryFactory.getMemoryRepository();

    const data = this.pendingRestoreData;
    const mode = repositoryFactory.getMode();

    // 1. Create a temporary safety snapshot of current database state before making changes
    let safetySnapshot: typeof data;
    try {
      const currentSessions = await sessionRepo.getSessions();
      const currentTasks = await taskRepo.getTasks();
      const currentSettings = await settingsRepo.getSettings();
      const currentMemories = await memoryRepo.getMemories();
      safetySnapshot = {
        sessions: currentSessions,
        tasks: currentTasks,
        settings: currentSettings,
        memories: currentMemories,
      };
    } catch (snapError) {
      console.error('Failed to create safety snapshot:', snapError);
      throw new Error('Could not create safety recovery snapshot of current database.', { cause: snapError });
    }

    const restoreMemorySnapshot = async (snapshot: typeof data) => {
      try {
        if (snapshot.settings) {
          await settingsRepo.saveSettings(snapshot.settings);
        }
        if (snapshot.sessions) {
          for (const s of snapshot.sessions) {
            await sessionRepo.saveSession(s);
          }
        }
        if (snapshot.tasks) {
          for (const t of snapshot.tasks) {
            await taskRepo.saveTask(t);
          }
        }
        if (snapshot.memories) {
          for (const m of snapshot.memories) {
            await memoryRepo.saveMemory(m);
          }
        }
      } catch (e) {
        console.error('Fatal: Failed to restore safety recovery snapshot from memory!', e);
      }
    };

    if (mode === 'sqlite') {
      const db = getDatabase();
      
      // Execute the restore inside a secure transaction block
      try {
        await db.execute('BEGIN TRANSACTION');

        // Restore settings & preference configuration
        if (data.settings) {
          await settingsRepo.saveSettings(data.settings);
        }

        // Overwrite raw study sessions log
        if (Array.isArray(data.sessions)) {
          await db.execute('DELETE FROM study_sessions');
          for (const s of data.sessions) {
            await sessionRepo.saveSession(s);
          }
        }

        // Overwrite tasks list
        if (Array.isArray(data.tasks)) {
          await db.execute('DELETE FROM tasks');
          for (const t of data.tasks) {
            await taskRepo.saveTask(t);
          }
        }

        // Overwrite memory entries
        if (Array.isArray(data.memories)) {
          await db.execute('DELETE FROM memory_entries');
          for (const m of data.memories) {
            await memoryRepo.saveMemory(m);
          }
        }

        await db.execute('COMMIT');
        this.pendingRestoreData = null;
      } catch (error) {
        console.error('Transaction failed, rolling back:', error);
        try {
          await db.execute('ROLLBACK');
        } catch (rollbackError) {
          console.error('SQLite ROLLBACK command itself failed catastrophically!', rollbackError);
          // If transaction rollback fails, attempt last-resort recovery snapshot restore
          if (safetySnapshot) {
            await restoreMemorySnapshot(safetySnapshot);
          }
        }
        this.pendingRestoreData = null;
        throw new Error('Restore transaction aborted. Existing data rolled back.', { cause: error });
      }
    } else {
      // Memory Mode: perform restoration with manual snapshot rollback on failure
      try {
        // Clear active memory repository lists first
        /* eslint-disable @typescript-eslint/no-explicit-any */
        (sessionRepo as any).sessions = [];
        (sessionRepo as any).activeSession = null;
        (taskRepo as any).tasks = [];
        (memoryRepo as any).memories = new Map();
        /* eslint-enable @typescript-eslint/no-explicit-any */

        // Restore settings & preference configuration
        if (data.settings) {
          await settingsRepo.saveSettings(data.settings);
        }

        // Overwrite raw study sessions log
        if (Array.isArray(data.sessions)) {
          for (const s of data.sessions) {
            await sessionRepo.saveSession(s);
          }
        }

        // Overwrite tasks list
        if (Array.isArray(data.tasks)) {
          for (const t of data.tasks) {
            await taskRepo.saveTask(t);
          }
        }

        // Overwrite memory entries
        if (Array.isArray(data.memories)) {
          for (const m of data.memories) {
            await memoryRepo.saveMemory(m);
          }
        }

        this.pendingRestoreData = null;
      } catch (error) {
        console.error('In-memory restore failed, rolling back to safety snapshot:', error);
        if (safetySnapshot) {
          /* eslint-disable @typescript-eslint/no-explicit-any */
          (sessionRepo as any).sessions = [];
          (sessionRepo as any).activeSession = null;
          (taskRepo as any).tasks = [];
          (memoryRepo as any).memories = new Map();
          /* eslint-enable @typescript-eslint/no-explicit-any */
          await restoreMemorySnapshot(safetySnapshot);
        }
        this.pendingRestoreData = null;
        throw new Error('Memory restore aborted and rolled back.', { cause: error });
      }
    }
  }
}

export const backupService = new BackupService();
export default backupService;
