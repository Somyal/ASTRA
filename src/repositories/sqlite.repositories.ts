import { getDatabase } from './db';
import { StudySession, ISessionRepository, SessionStatus } from './session.repository';
import { ITaskRepository } from './task.repository';
import { Task } from '../store/tasks.store';
import { ISettingsRepository } from './settings.repository';
import { Subject } from '../store/content.store';
import {
  MemoryEntry,
  AdaptationLedgerEntry,
  IMemoryRepository,
  IAdaptationLedgerRepository,
} from './memory.repository';
import { useUIStore } from '../store/ui.store';

// Interface definitions for Content repository
export interface IContentRepository {
  saveSubject(subject: Subject): Promise<void>;
  getSubjects(): Promise<Subject[]>;
}

/**
 * Centralized database error handler
 *
 * Logs errors to console with context and notifies UI store of database failures.
 * This ensures users see database errors in the UI rather than silent failures.
 *
 * **Error Context:**
 * - Operation name (e.g., 'saveSession', 'getSubjects')
 * - Original error message from the database driver
 * - Full stack trace (logged to console)
 *
 * **Side Effects:**
 * - Logs to console.error()
 * - Updates UI state to 'error' if store available
 *
 * @param error - The caught database error
 * @param operation - Name of the database operation that failed
 * @returns Error with descriptive message for callers
 *
 * @example
 * ```typescript
 * try {
 *   await db.execute('UPDATE ...');
 * } catch (error) {
 *   throw handleDatabaseError(error, 'updateSession');
 * }
 * ```
 */
function handleDatabaseError(error: unknown, operation: string): Error {
  const message = error instanceof Error ? error.message : String(error);
  const fullMessage = `Database operation failed: ${operation}. ${message}`;
  console.error(fullMessage, error);

  // Notify UI of database error
  try {
    const store = useUIStore.getState();
    store.setBoot('error', `Database Error: ${operation}`);
  } catch (storeError) {
    console.error('Failed to update UI store with database error', storeError);
  }

  return new Error(fullMessage);
}

export class SQLiteSessionRepository implements ISessionRepository {
  async saveSession(session: StudySession): Promise<void> {
    try {
      const db = getDatabase();

      // Resolve subject name to ID
      const subjects = await db.select<{ id: string }[]>(
        'SELECT id FROM subjects WHERE name = $1 LIMIT 1',
        [session.subject]
      );
      const subjectId = subjects.length > 0 ? subjects[0].id : null;

      // Resolve chapter name to ID (nullable relation)
      const chapters = await db.select<{ id: string }[]>(
        'SELECT id FROM syllabus_chapters WHERE name = $1 LIMIT 1',
        [session.topic]
      );
      const chapterId = chapters.length > 0 ? chapters[0].id : null;

      await db.execute(
        `INSERT OR REPLACE INTO study_sessions (
          id, subject_id, chapter_id, topic, planned_duration, actual_duration, started_at, completed_at, status, reflection, was_interrupted
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          session.id,
          subjectId,
          chapterId,
          session.topic,
          session.plannedDuration,
          session.actualDuration,
          session.startedAt,
          session.completedAt,
          session.status,
          session.reflection || null,
          session.wasInterrupted ? 1 : 0,
        ]
      );
    } catch (error) {
      throw handleDatabaseError(error, 'saveSession');
    }
  }

  async getSessions(): Promise<StudySession[]> {
    try {
      const db = getDatabase();
      // Select sessions joining subject names
      const rows = await db.select<
        {
          id: string;
          subject_name: string | null;
          topic: string;
          planned_duration: number;
          actual_duration: number;
          started_at: string;
          completed_at: string | null;
          status: string;
          reflection: string | null;
          was_interrupted: number;
        }[]
      >(
        `SELECT s.id, sub.name as subject_name, s.topic, s.planned_duration, s.actual_duration, s.started_at, s.completed_at, s.status, s.reflection, s.was_interrupted
         FROM study_sessions s
         LEFT JOIN subjects sub ON s.subject_id = sub.id
         ORDER BY s.started_at DESC`
      );

      return rows.map(r => ({
        id: r.id,
        subject: r.subject_name || 'General',
        topic: r.topic,
        plannedDuration: r.planned_duration,
        actualDuration: r.actual_duration,
        startedAt: r.started_at,
        completedAt: r.completed_at,
        status: r.status as SessionStatus,
        reflection: r.reflection,
        wasInterrupted: r.was_interrupted === 1,
      }));
    } catch (error) {
      throw handleDatabaseError(error, 'getSessions');
    }
  }

  async getActiveSession(): Promise<StudySession | null> {
    try {
      const db = getDatabase();
      const rows = await db.select<
        {
          id: string;
          subject_name: string | null;
          topic: string;
          planned_duration: number;
          actual_duration: number;
          started_at: string;
          completed_at: string | null;
          status: string;
          reflection: string | null;
          was_interrupted: number;
        }[]
      >(
        `SELECT s.id, sub.name as subject_name, s.topic, s.planned_duration, s.actual_duration, s.started_at, s.completed_at, s.status, s.reflection, s.was_interrupted
         FROM study_sessions s
         LEFT JOIN subjects sub ON s.subject_id = sub.id
         WHERE s.status IN ('configured', 'running', 'paused')
         LIMIT 1`
      );

      if (rows.length === 0) return null;
      const r = rows[0];
      return {
        id: r.id,
        subject: r.subject_name || 'General',
        topic: r.topic,
        plannedDuration: r.planned_duration,
        actualDuration: r.actual_duration,
        startedAt: r.started_at,
        completedAt: r.completed_at,
        status: r.status as SessionStatus,
        reflection: r.reflection,
        wasInterrupted: r.was_interrupted === 1,
      };
    } catch (error) {
      throw handleDatabaseError(error, 'getActiveSession');
    }
  }
}

export class SQLiteTaskRepository implements ITaskRepository {
  async saveTask(task: Task): Promise<void> {
    try {
      const db = getDatabase();
      await db.execute(
        `INSERT OR REPLACE INTO tasks (id, title, subject_id, priority, status, generated_from_chapter_id, task_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          task.id,
          task.title,
          task.subjectId,
          task.priority,
          task.status,
          task.generatedFromChapterId || null,
          task.taskType || 'manual',
        ]
      );
    } catch (error) {
      throw handleDatabaseError(error, 'saveTask');
    }
  }

  async getTasks(): Promise<Task[]> {
    try {
      const db = getDatabase();
      const rows = await db.select<
        {
          id: string;
          title: string;
          subject_id: string;
          priority: number;
          status: string;
          generated_from_chapter_id: string | null;
          task_type: string | null;
        }[]
      >(
        'SELECT id, title, subject_id, priority, status, generated_from_chapter_id, task_type FROM tasks'
      );

      return rows.map(r => ({
        id: r.id,
        title: r.title,
        subjectId: r.subject_id,
        priority: r.priority,
        status: r.status as Task['status'],
        generatedFromChapterId: r.generated_from_chapter_id || undefined,
        taskType: (r.task_type || 'manual') as Task['taskType'],
      }));
    } catch (error) {
      throw handleDatabaseError(error, 'getTasks');
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const db = getDatabase();
      await db.execute('DELETE FROM tasks WHERE id = $1', [id]);
    } catch (error) {
      throw handleDatabaseError(error, 'deleteTask');
    }
  }
}

export class SQLiteSettingsRepository implements ISettingsRepository {
  async saveSettings(settings: Record<string, unknown>): Promise<void> {
    try {
      const db = getDatabase();
      for (const [key, value] of Object.entries(settings)) {
        const serialized = JSON.stringify(value);
        await db.execute('INSERT OR REPLACE INTO settings (key, value) VALUES ($1, $2)', [
          key,
          serialized,
        ]);
      }
    } catch (error) {
      throw handleDatabaseError(error, 'saveSettings');
    }
  }

  async getSettings(): Promise<Record<string, unknown>> {
    try {
      const db = getDatabase();
      const rows = await db.select<{ key: string; value: string }[]>(
        'SELECT key, value FROM settings'
      );
      const result: Record<string, unknown> = {};
      for (const row of rows) {
        try {
          result[row.key] = JSON.parse(row.value);
        } catch {
          result[row.key] = row.value;
        }
      }
      return result;
    } catch (error) {
      throw handleDatabaseError(error, 'getSettings');
    }
  }
}

export class SQLiteContentRepository implements IContentRepository {
  async saveSubject(subject: Subject): Promise<void> {
    try {
      const db = getDatabase();
      await db.execute(
        `INSERT OR REPLACE INTO subjects (id, name, color, emoji)
         VALUES ($1, $2, $3, $4)`,
        [subject.id, subject.name, subject.color, subject.emoji || '📚']
      );
    } catch (error) {
      throw handleDatabaseError(error, 'saveSubject');
    }
  }

  async getSubjects(): Promise<Subject[]> {
    try {
      const db = getDatabase();
      const rows = await db.select<
        {
          id: string;
          name: string;
          color: string;
          emoji: string;
        }[]
      >('SELECT id, name, color, emoji FROM subjects');
      return rows;
    } catch (error) {
      throw handleDatabaseError(error, 'getSubjects');
    }
  }
}

export class SQLiteMemoryRepository implements IMemoryRepository {
  async getMemories(): Promise<MemoryEntry[]> {
    try {
      const db = getDatabase();
      const rows = await db.select<
        {
          id: string;
          tier: string;
          category: string;
          content: string;
          evidence: string | null;
          relevance_score: number;
          created_at: string;
          last_accessed: string;
          expires_at: string | null;
          is_incorrect: number;
          is_permanent: number;
        }[]
      >(
        `SELECT id, tier, category, content, evidence, relevance_score, created_at, last_accessed, expires_at, is_incorrect, is_permanent
         FROM memory_entries`
      );

      return rows.map(r => ({
        id: r.id,
        tier: r.tier as MemoryEntry['tier'],
        category: r.category as MemoryEntry['category'],
        content: r.content,
        evidence: r.evidence,
        relevanceScore: r.relevance_score,
        createdAt: r.created_at,
        lastAccessed: r.last_accessed,
        expiresAt: r.expires_at,
        isIncorrect: r.is_incorrect === 1,
        isPermanent: r.is_permanent === 1,
      }));
    } catch (error) {
      throw handleDatabaseError(error, 'getMemories');
    }
  }

  async saveMemory(entry: MemoryEntry): Promise<void> {
    try {
      const db = getDatabase();
      await db.execute(
        `INSERT OR REPLACE INTO memory_entries (
          id, tier, category, content, evidence, relevance_score, created_at, last_accessed, expires_at, is_incorrect, is_permanent
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          entry.id,
          entry.tier,
          entry.category,
          entry.content,
          entry.evidence || null,
          entry.relevanceScore,
          entry.createdAt,
          entry.lastAccessed,
          entry.expiresAt || null,
          entry.isIncorrect ? 1 : 0,
          entry.isPermanent ? 1 : 0,
        ]
      );
    } catch (error) {
      throw handleDatabaseError(error, 'saveMemory');
    }
  }

  async deleteMemory(id: string): Promise<void> {
    try {
      const db = getDatabase();
      await db.execute('DELETE FROM memory_entries WHERE id = $1', [id]);
    } catch (error) {
      throw handleDatabaseError(error, 'deleteMemory');
    }
  }

  async markIncorrect(id: string): Promise<void> {
    try {
      const db = getDatabase();
      await db.execute('UPDATE memory_entries SET is_incorrect = 1 WHERE id = $1', [id]);
    } catch (error) {
      throw handleDatabaseError(error, 'markIncorrect');
    }
  }
}

export class SQLiteAdaptationLedgerRepository implements IAdaptationLedgerRepository {
  async getLedgerEntries(): Promise<AdaptationLedgerEntry[]> {
    try {
      const db = getDatabase();
      const rows = await db.select<
        {
          id: string;
          action_taken: string;
          rationale: string;
          created_at: string;
        }[]
      >('SELECT id, action_taken, rationale, created_at FROM adaptation_ledger');

      return rows.map(r => ({
        id: r.id,
        actionTaken: r.action_taken,
        rationale: r.rationale,
        createdAt: r.created_at,
      }));
    } catch (error) {
      throw handleDatabaseError(error, 'getLedgerEntries');
    }
  }

  async saveLedgerEntry(entry: AdaptationLedgerEntry): Promise<void> {
    try {
      const db = getDatabase();
      await db.execute(
        `INSERT OR REPLACE INTO adaptation_ledger (id, action_taken, rationale, created_at)
         VALUES ($1, $2, $3, $4)`,
        [entry.id, entry.actionTaken, entry.rationale, entry.createdAt]
      );
    } catch (error) {
      throw handleDatabaseError(error, 'saveLedgerEntry');
    }
  }
}
