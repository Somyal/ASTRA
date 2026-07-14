import { describe, it, expect, beforeEach } from 'vitest';
import { backupService } from '../services/backup.service';
import { repositoryFactory } from '../repositories/index';

describe('BackupService Restore Integration Test', () => {
  beforeEach(() => {
    repositoryFactory.setMode('memory');
  });

  it('should successfully run restorePreview and confirmRestore in memory mode', async () => {
    const backupJson = JSON.stringify({
      metadata: {
        schemaVersion: 5,
        backupVersion: 1,
        astraVersion: '0.1.0',
        createdAt: new Date().toISOString(),
      },
      data: {
        sessions: [
          {
            id: 'session-1',
            subject: 'Physics',
            topic: 'Kinematics',
            plannedDuration: 1800,
            actualDuration: 1800,
            startedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            status: 'completed',
            reflection: 'Good study session',
            wasInterrupted: false,
          },
        ],
        tasks: [
          {
            id: 'task-1',
            title: 'Solve kinematics questions',
            subjectId: 'Physics',
            priority: 1,
            status: 'pending',
          },
        ],
        settings: {
          userName: 'Gautam-Test',
          theme: 'dark',
        },
        memories: [
          {
            id: 'memory-1',
            tier: 'active',
            category: 'focus_rhythm',
            content: 'User studied Kinematics in the evening',
            relevanceScore: 0.9,
            createdAt: new Date().toISOString(),
            lastAccessed: new Date().toISOString(),
            isIncorrect: false,
            isPermanent: false,
          },
        ],
      },
    });

    const preview = await backupService.restorePreview(backupJson);
    expect(preview.sessionsCount).toBe(1);
    expect(preview.tasksCount).toBe(1);
    expect(preview.memoriesCount).toBe(1);

    // Confirm restore
    await backupService.confirmRestore();

    // Verify repository contents
    const settingsRepo = repositoryFactory.getSettingsRepository();
    const sessionRepo = repositoryFactory.getSessionRepository();
    const taskRepo = repositoryFactory.getTaskRepository();
    const memoryRepo = repositoryFactory.getMemoryRepository();

    const restoredSettings = await settingsRepo.getSettings();
    expect(restoredSettings.userName).toBe('Gautam-Test');

    const restoredSessions = await sessionRepo.getSessions();
    expect(restoredSessions.length).toBe(1);
    expect(restoredSessions[0].topic).toBe('Kinematics');

    const restoredTasks = await taskRepo.getTasks();
    expect(restoredTasks.length).toBe(1);
    expect(restoredTasks[0].title).toBe('Solve kinematics questions');

    const restoredMemories = await memoryRepo.getMemories();
    expect(restoredMemories.length).toBe(1);
    expect(restoredMemories[0].content).toBe('User studied Kinematics in the evening');
  });
});
