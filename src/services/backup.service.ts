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
      
      // Save backup as a downloadable local JSON file
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
      
      // Validate schema metadata structure
      if (!payload.metadata || !payload.data) {
        throw new Error('Invalid backup structure.');
      }
      
      if (payload.metadata.schemaVersion !== 5) {
        throw new Error(`Incompatible schema version: ${payload.metadata.schemaVersion}. Current expected is 5.`);
      }

      this.pendingRestoreData = payload.data;

      return {
        createdAt: new Date(payload.metadata.createdAt).toLocaleString(),
        astraVersion: payload.metadata.astraVersion,
        sessionsCount: payload.data.sessions?.length || 0,
        tasksCount: payload.data.tasks?.length || 0,
        settingsCount: Object.keys(payload.data.settings || {}).length,
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

    try {
      const sessionRepo = repositoryFactory.getSessionRepository();
      const taskRepo = repositoryFactory.getTaskRepository();
      const settingsRepo = repositoryFactory.getSettingsRepository();
      const memoryRepo = repositoryFactory.getMemoryRepository();

      const data = this.pendingRestoreData;
      const db = getDatabase();

      // 1. Restore settings & preference configuration
      if (data.settings) {
        await settingsRepo.saveSettings(data.settings);
      }

      // 2. Overwrite raw study sessions log
      if (Array.isArray(data.sessions)) {
        await db.execute('DELETE FROM study_sessions');
        for (const s of data.sessions) {
          await sessionRepo.saveSession(s);
        }
      }

      // 3. Overwrite tasks list
      if (Array.isArray(data.tasks)) {
        await db.execute('DELETE FROM tasks');
        for (const t of data.tasks) {
          await taskRepo.saveTask(t);
        }
      }

      // 4. Overwrite memory entries
      if (Array.isArray(data.memories)) {
        await db.execute('DELETE FROM memory_entries');
        for (const m of data.memories) {
          await memoryRepo.saveMemory(m);
        }
      }

      this.pendingRestoreData = null;
    } catch (e) {
      console.error('Failed to commit restore data:', e);
      this.pendingRestoreData = null;
      throw new Error('Could not overwrite SQLite tables with backup.', { cause: e });
    }
  }
}

export const backupService = new BackupService();
export default backupService;
