import { describe, it, expect, beforeEach, vi } from 'vitest';
import { repositoryFactory } from '../repositories/index';
import { LearningItem, LearningAction } from '../repositories/learning.repository';

// Define the mock database singleton (prefixed with 'mock' for hoisted mock access)
const mockDb = {
  execute: vi.fn(),
  select: vi.fn(),
};

// Mock getDatabase connection getter for SQLite testing
vi.mock('../repositories/db', () => ({
  getDatabase: () => mockDb,
}));

describe('Learning Record Repository Integration Tests', () => {
  describe('InMemory Mode tests', () => {
    beforeEach(() => {
      repositoryFactory.setMode('memory');
    });

    it('should save and retrieve learning items correctly', async () => {
      const repo = repositoryFactory.getLearningRepository();
      const item: LearningItem = {
        id: 'item-1',
        areaId: null,
        title: 'Projectiles Relative Velocity',
        sourceType: 'manual',
        sourceRef: null,
        status: 'active',
      };

      await repo.saveItem(item);

      const items = await repo.getItems();
      expect(items.length).toBe(1);
      expect(items[0].title).toBe('Projectiles Relative Velocity');

      const fetched = await repo.getItem('item-1');
      expect(fetched).not.toBeNull();
      expect(fetched?.title).toBe('Projectiles Relative Velocity');
    });

    it('should save and retrieve learning actions correctly', async () => {
      const repo = repositoryFactory.getLearningRepository();
      const action: LearningAction = {
        id: 'action-1',
        itemId: 'item-1',
        intentionType: 'revision',
        customWording: 'Solve 10 past questions',
        status: 'active',
        dueDate: null,
        createdAt: new Date().toISOString(),
      };

      await repo.saveAction(action);

      const actions = await repo.getActions();
      expect(actions.length).toBe(1);
      expect(actions[0].customWording).toBe('Solve 10 past questions');

      const fetched = await repo.getAction('action-1');
      expect(fetched).not.toBeNull();
      expect(fetched?.customWording).toBe('Solve 10 past questions');

      const itemActions = await repo.getActionsForItem('item-1');
      expect(itemActions.length).toBe(1);
    });
  });

  describe('SQLite Mode queries mapping', () => {
    beforeEach(() => {
      repositoryFactory.setMode('sqlite');
      vi.clearAllMocks();
    });

    it('should correctly invoke SQLite execute on saveItem', async () => {
      const repo = repositoryFactory.getLearningRepository();

      const item: LearningItem = {
        id: 'item-1',
        areaId: null,
        title: 'Rust Pointers',
        sourceType: 'manual',
        sourceRef: null,
        status: 'active',
      };

      await repo.saveItem(item);
      expect(mockDb.execute).toHaveBeenCalled();
    });

    it('should correctly invoke SQLite execute on saveAction', async () => {
      const repo = repositoryFactory.getLearningRepository();

      const action: LearningAction = {
        id: 'action-1',
        itemId: 'item-1',
        intentionType: 'practice',
        customWording: 'Write 3 parser tests',
        status: 'active',
        dueDate: null,
        createdAt: new Date().toISOString(),
      };

      await repo.saveAction(action);
      expect(mockDb.execute).toHaveBeenCalled();
    });
  });
});
