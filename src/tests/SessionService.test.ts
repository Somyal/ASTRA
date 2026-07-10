/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Session Service Tests
 *
 * Tests for session lifecycle management, timer cleanup, and error handling
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SessionService } from '../services/session.service';

// Mock dependencies
vi.mock('../store/study.store', () => ({
  useStudyStore: {
    getState: vi.fn(),
    setState: vi.fn(),
  },
}));

vi.mock('../store/ui.store', () => ({
  useUIStore: {
    getState: vi.fn(),
    setActiveTab: vi.fn(),
    setBootState: vi.fn(),
  },
}));

vi.mock('../store/settings.store', () => ({
  useSettingsStore: {
    getState: vi.fn(() => ({
      preferences: { recoveryEnabled: false },
    })),
  },
}));

vi.mock('../repositories/index', () => ({
  repositoryFactory: {
    getSessionRepository: vi.fn(() => ({
      saveSession: vi.fn(),
      getActiveSession: vi.fn(),
    })),
  },
}));

vi.mock('../events/academic_event', () => ({
  academicEventBus: {
    emit: vi.fn(),
  },
}));

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    service = new SessionService();
    vi.clearAllMocks();
    // Clear any active intervals
    vi.clearAllTimers();
  });

  afterEach(() => {
    // Cleanup any remaining timers
    vi.clearAllTimers();
  });

  describe('Timer Management', () => {
    it('should not create multiple timers on startSession calls', async () => {
      const { useStudyStore } = await import('../store/study.store');

      const mockStoreState = {
        startSession: vi.fn(),
        tickTime: vi.fn(),
        activeSession: {
          id: 'test-1',
          subject: 'Math',
          topic: 'Calculus',
          plannedDuration: 3000,
          actualDuration: 0,
          startedAt: new Date().toISOString(),
          completedAt: null,
          status: 'running' as const,
          reflection: null,
          wasInterrupted: false,
        },
      };

      (useStudyStore.getState as any).mockReturnValue(mockStoreState);

      // First start
      await service.startSession();
      const firstTimerId = (service as any).timerId;
      expect(firstTimerId).not.toBeNull();

      // Second start should clear first timer and create new one
      await service.startSession();
      const secondTimerId = (service as any).timerId;

      expect(secondTimerId).not.toBeNull();
      // Timers should be different (old one was cleared)
      expect(firstTimerId).not.toBe(secondTimerId);
    });

    it('should clear timer on pauseSession', async () => {
      const { useStudyStore } = await import('../store/study.store');

      const mockStoreState = {
        pauseSession: vi.fn(),
        activeSession: {
          id: 'test-1',
          subject: 'Math',
          topic: 'Calculus',
          plannedDuration: 3000,
          actualDuration: 100,
          startedAt: new Date().toISOString(),
          completedAt: null,
          status: 'paused' as const,
          reflection: null,
          wasInterrupted: false,
        },
      };

      (useStudyStore.getState as any).mockReturnValue(mockStoreState);

      // Set a timer (simulate running session)
      (service as any).timerId = setInterval(() => {}, 1000);
      const timerBefore = (service as any).timerId;
      expect(timerBefore).not.toBeNull();

      // Pause should clear timer
      await service.pauseSession();
      expect((service as any).timerId).toBeNull();
    });

    it('should clear timer on completeSession', async () => {
      const { useStudyStore } = await import('../store/study.store');

      const mockStoreState = {
        completeSession: vi.fn(),
        activeSession: {
          id: 'test-1',
          subject: 'Math',
          topic: 'Calculus',
          plannedDuration: 3000,
          actualDuration: 3000,
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          status: 'completed' as const,
          reflection: null,
          wasInterrupted: false,
        },
      };

      (useStudyStore.getState as any).mockReturnValue(mockStoreState);

      // Set a timer
      (service as any).timerId = setInterval(() => {}, 1000);
      expect((service as any).timerId).not.toBeNull();

      // Complete should clear timer
      await service.completeSession();
      expect((service as any).timerId).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      const { useStudyStore } = await import('../store/study.store');
      const { repositoryFactory } = await import('../repositories/index');

      const mockError = new Error('Database connection failed');
      const mockRepo = {
        saveSession: vi.fn().mockRejectedValue(mockError),
      };

      (useStudyStore.getState as any).mockReturnValue({
        startSession: vi.fn(),
        activeSession: {
          id: 'test-1',
          subject: 'Math',
          topic: 'Calculus',
          plannedDuration: 3000,
          actualDuration: 0,
          startedAt: new Date().toISOString(),
          completedAt: null,
          status: 'running' as const,
          reflection: null,
          wasInterrupted: false,
        },
      });

      (repositoryFactory.getSessionRepository as any).mockReturnValue(mockRepo);

      // Should not throw, but log error
      const consoleSpy = vi.spyOn(console, 'error');
      await service.startSession();

      // Error should be logged but not thrown
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0][0]).toContain('Failed to save session');
    });
  });

  describe('Session State Transitions', () => {
    it('should configure session with correct parameters', async () => {
      const { useStudyStore } = await import('../store/study.store');
      const mockStoreState = {
        configureSession: vi.fn(),
      };

      (useStudyStore.getState as any).mockReturnValue(mockStoreState);

      service.configureSession('Physics', 'Quantum Mechanics', 2400);

      expect(mockStoreState.configureSession).toHaveBeenCalledWith(
        'Physics',
        'Quantum Mechanics',
        2400
      );
    });
  });
});
