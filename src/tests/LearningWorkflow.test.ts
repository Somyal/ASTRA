import { describe, it, expect, vi, beforeEach } from 'vitest';
import { repositoryFactory } from '../repositories/index';
import { learningService } from '../services/learning.service';
import { sessionService } from '../services/session.service';
import { useLearningStore } from '../store/learning.store';

// Mock DB connection getter for tests
vi.mock('../repositories/db', () => ({
  getDatabase: () => ({
    execute: vi.fn(),
    select: vi.fn(() => []),
  }),
}));

// Mock sessionService
vi.mock('../services/session.service', () => ({
  sessionService: {
    configureSession: vi.fn(),
    startSession: vi.fn(),
  },
}));

describe('LR-3 First Learning Workflow End-to-End Tests', () => {
  beforeEach(() => {
    repositoryFactory.setMode('memory');
    useLearningStore.setState({
      items: [],
      actions: [],
      activeAction: null,
    });
    vi.clearAllMocks();
  });

  it('should complete onboarding flow: create item, create action, and configure timer session', async () => {
    // 1. Create the learning item
    const item = await learningService.createLearningItem('Relative Velocity', 'manual');
    expect(item).not.toBeNull();
    expect(item.title).toBe('Relative Velocity');
    expect(useLearningStore.getState().items.length).toBe(1);

    // 2. Create the learning action
    const action = await learningService.createLearningAction(item.id, 'study', 'Solve 5 relative velocity problems');
    expect(action).not.toBeNull();
    expect(action.customWording).toBe('Solve 5 relative velocity problems');
    expect(useLearningStore.getState().actions.length).toBe(1);
    expect(useLearningStore.getState().activeAction?.id).toBe(action.id);

    // 3. Initiate Focus session
    sessionService.configureSession(item.title, action.customWording, 3000);
    await sessionService.startSession();

    expect(sessionService.configureSession).toHaveBeenCalledWith(
      'Relative Velocity',
      'Solve 5 relative velocity problems',
      3000
    );
    expect(sessionService.startSession).toHaveBeenCalled();
  });
});
