import { getDatabase } from './db';

export interface LearningItem {
  id: string;
  areaId: string | null;
  title: string;
  sourceType: 'syllabus' | 'manual';
  sourceRef: string | null;
  status: 'active' | 'archived';
}

export interface LearningAction {
  id: string;
  itemId: string;
  intentionType: string;
  customWording: string;
  status: 'active' | 'resolved' | 'deferred' | 'abandoned';
  dueDate: string | null;
  createdAt: string;
}

export interface ILearningRepository {
  saveItem(item: LearningItem): Promise<void>;
  getItems(): Promise<LearningItem[]>;
  getItem(id: string): Promise<LearningItem | null>;
  
  saveAction(action: LearningAction): Promise<void>;
  getActions(): Promise<LearningAction[]>;
  getAction(id: string): Promise<LearningAction | null>;
  getActionsForItem(itemId: string): Promise<LearningAction[]>;
}

function handleDatabaseError(error: unknown, operation: string): Error {
  const message = error instanceof Error ? error.message : String(error);
  const fullMessage = `Database operation failed: ${operation}. ${message}`;
  console.error(fullMessage, error);
  return new Error(fullMessage);
}

export class InMemoryLearningRepository implements ILearningRepository {
  private items: LearningItem[] = [];
  private actions: LearningAction[] = [];

  async saveItem(item: LearningItem): Promise<void> {
    const idx = this.items.findIndex(i => i.id === item.id);
    if (idx !== -1) {
      this.items[idx] = item;
    } else {
      this.items.push(item);
    }
  }

  async getItems(): Promise<LearningItem[]> {
    return [...this.items];
  }

  async getItem(id: string): Promise<LearningItem | null> {
    return this.items.find(i => i.id === id) || null;
  }

  async saveAction(action: LearningAction): Promise<void> {
    const idx = this.actions.findIndex(a => a.id === action.id);
    if (idx !== -1) {
      this.actions[idx] = action;
    } else {
      this.actions.push(action);
    }
  }

  async getActions(): Promise<LearningAction[]> {
    return [...this.actions];
  }

  async getAction(id: string): Promise<LearningAction | null> {
    return this.actions.find(a => a.id === id) || null;
  }

  async getActionsForItem(itemId: string): Promise<LearningAction[]> {
    return this.actions.filter(a => a.itemId === itemId);
  }
}

export class SQLiteLearningRepository implements ILearningRepository {
  async saveItem(item: LearningItem): Promise<void> {
    try {
      const db = getDatabase();
      await db.execute(
        `INSERT OR REPLACE INTO learning_items (id, area_id, title, source_type, source_ref, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          item.id,
          item.areaId || null,
          item.title,
          item.sourceType,
          item.sourceRef || null,
          item.status,
        ]
      );
    } catch (error) {
      throw handleDatabaseError(error, 'saveItem');
    }
  }

  async getItems(): Promise<LearningItem[]> {
    try {
      const db = getDatabase();
      const rows = await db.select<{
        id: string;
        area_id: string | null;
        title: string;
        source_type: string;
        source_ref: string | null;
        status: string;
      }[]>('SELECT id, area_id, title, source_type, source_ref, status FROM learning_items');

      return rows.map(r => ({
        id: r.id,
        areaId: r.area_id,
        title: r.title,
        sourceType: r.source_type as LearningItem['sourceType'],
        sourceRef: r.source_ref,
        status: r.status as LearningItem['status'],
      }));
    } catch (error) {
      throw handleDatabaseError(error, 'getItems');
    }
  }

  async getItem(id: string): Promise<LearningItem | null> {
    try {
      const db = getDatabase();
      const rows = await db.select<{
        id: string;
        area_id: string | null;
        title: string;
        source_type: string;
        source_ref: string | null;
        status: string;
      }[]>('SELECT id, area_id, title, source_type, source_ref, status FROM learning_items WHERE id = $1 LIMIT 1', [id]);

      if (rows.length === 0) return null;
      const r = rows[0];
      return {
        id: r.id,
        areaId: r.area_id,
        title: r.title,
        sourceType: r.source_type as LearningItem['sourceType'],
        sourceRef: r.source_ref,
        status: r.status as LearningItem['status'],
      };
    } catch (error) {
      throw handleDatabaseError(error, 'getItem');
    }
  }

  async saveAction(action: LearningAction): Promise<void> {
    try {
      const db = getDatabase();
      await db.execute(
        `INSERT OR REPLACE INTO learning_actions (id, item_id, intention_type, custom_wording, status, due_date, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          action.id,
          action.itemId,
          action.intentionType,
          action.customWording,
          action.status,
          action.dueDate || null,
          action.createdAt,
        ]
      );
    } catch (error) {
      throw handleDatabaseError(error, 'saveAction');
    }
  }

  async getActions(): Promise<LearningAction[]> {
    try {
      const db = getDatabase();
      const rows = await db.select<{
        id: string;
        item_id: string;
        intention_type: string;
        custom_wording: string;
        status: string;
        due_date: string | null;
        created_at: string;
      }[]>('SELECT id, item_id, intention_type, custom_wording, status, due_date, created_at FROM learning_actions');

      return rows.map(r => ({
        id: r.id,
        itemId: r.item_id,
        intentionType: r.intention_type,
        customWording: r.custom_wording,
        status: r.status as LearningAction['status'],
        dueDate: r.due_date,
        createdAt: r.created_at,
      }));
    } catch (error) {
      throw handleDatabaseError(error, 'getActions');
    }
  }

  async getAction(id: string): Promise<LearningAction | null> {
    try {
      const db = getDatabase();
      const rows = await db.select<{
        id: string;
        item_id: string;
        intention_type: string;
        custom_wording: string;
        status: string;
        due_date: string | null;
        created_at: string;
      }[]>('SELECT id, item_id, intention_type, custom_wording, status, due_date, created_at FROM learning_actions WHERE id = $1 LIMIT 1', [id]);

      if (rows.length === 0) return null;
      const r = rows[0];
      return {
        id: r.id,
        itemId: r.item_id,
        intentionType: r.intention_type,
        customWording: r.custom_wording,
        status: r.status as LearningAction['status'],
        dueDate: r.due_date,
        createdAt: r.created_at,
      };
    } catch (error) {
      throw handleDatabaseError(error, 'getAction');
    }
  }

  async getActionsForItem(itemId: string): Promise<LearningAction[]> {
    try {
      const db = getDatabase();
      const rows = await db.select<{
        id: string;
        item_id: string;
        intention_type: string;
        custom_wording: string;
        status: string;
        due_date: string | null;
        created_at: string;
      }[]>('SELECT id, item_id, intention_type, custom_wording, status, due_date, created_at FROM learning_actions WHERE item_id = $1', [itemId]);

      return rows.map(r => ({
        id: r.id,
        itemId: r.item_id,
        intentionType: r.intention_type,
        customWording: r.custom_wording,
        status: r.status as LearningAction['status'],
        dueDate: r.due_date,
        createdAt: r.created_at,
      }));
    } catch (error) {
      throw handleDatabaseError(error, 'getActionsForItem');
    }
  }
}
