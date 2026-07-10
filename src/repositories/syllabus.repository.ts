import { getDatabase } from './db';

// --- Domain Models ---
export interface SyllabusUnit {
  id: string;
  name: string;
  subjectId: string;
  sequenceOrder: number;
}

export interface SyllabusChapter {
  id: string;
  name: string;
  unitId: string;
  sequenceOrder: number;
  lastStudiedAt: string | null;
}

export interface SyllabusTopic {
  id: string;
  name: string;
  chapterId: string;
  sequenceOrder: number;
  isCompleted: boolean;
  completedAt: string | null;
}

export interface ChapterDependency {
  chapterId: string;
  prerequisiteChapterId: string;
}

// --- Repository Contract ---
export interface ISyllabusRepository {
  saveUnit(unit: SyllabusUnit): Promise<void>;
  getAllUnits(): Promise<SyllabusUnit[]>;
  getUnits(subjectId: string): Promise<SyllabusUnit[]>;
  
  saveChapter(chapter: SyllabusChapter): Promise<void>;
  getChapters(unitId: string): Promise<SyllabusChapter[]>;
  getAllChapters(): Promise<SyllabusChapter[]>;
  
  saveTopic(topic: SyllabusTopic): Promise<void>;
  getTopics(chapterId: string): Promise<SyllabusTopic[]>;
  getAllTopics(): Promise<SyllabusTopic[]>;
  
  saveDependency(dep: ChapterDependency): Promise<void>;
  getDependencies(): Promise<ChapterDependency[]>;
}

// --- In-Memory Implementation ---
export class InMemorySyllabusRepository implements ISyllabusRepository {
  private units: SyllabusUnit[] = [];
  private chapters: SyllabusChapter[] = [];
  private topics: SyllabusTopic[] = [];
  private dependencies: ChapterDependency[] = [];

  async saveUnit(unit: SyllabusUnit): Promise<void> {
    this.units = this.units.filter(u => u.id !== unit.id).concat(unit);
  }

  async getAllUnits(): Promise<SyllabusUnit[]> {
    return [...this.units].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  }

  async getUnits(subjectId: string): Promise<SyllabusUnit[]> {
    return this.units
      .filter(u => u.subjectId === subjectId)
      .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  }

  async saveChapter(chapter: SyllabusChapter): Promise<void> {
    this.chapters = this.chapters.filter(c => c.id !== chapter.id).concat(chapter);
  }

  async getChapters(unitId: string): Promise<SyllabusChapter[]> {
    return this.chapters
      .filter(c => c.unitId === unitId)
      .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  }

  async getAllChapters(): Promise<SyllabusChapter[]> {
    return [...this.chapters].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  }

  async saveTopic(topic: SyllabusTopic): Promise<void> {
    this.topics = this.topics.filter(t => t.id !== topic.id).concat(topic);
  }

  async getTopics(chapterId: string): Promise<SyllabusTopic[]> {
    return this.topics
      .filter(t => t.chapterId === chapterId)
      .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  }

  async getAllTopics(): Promise<SyllabusTopic[]> {
    return [...this.topics].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
  }

  async saveDependency(dep: ChapterDependency): Promise<void> {
    this.dependencies = this.dependencies
      .filter(d => !(d.chapterId === dep.chapterId && d.prerequisiteChapterId === dep.prerequisiteChapterId))
      .concat(dep);
  }

  async getDependencies(): Promise<ChapterDependency[]> {
    return [...this.dependencies];
  }
}

// --- SQLite Implementation ---
export class SQLiteSyllabusRepository implements ISyllabusRepository {
  async saveUnit(unit: SyllabusUnit): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT OR REPLACE INTO syllabus_units (id, name, subject_id, sequence_order)
       VALUES ($1, $2, $3, $4)`,
      [unit.id, unit.name, unit.subjectId, unit.sequenceOrder]
    );
  }

  async getAllUnits(): Promise<SyllabusUnit[]> {
    const db = getDatabase();
    const rows = await db.select<
      {
        id: string;
        name: string;
        subject_id: string;
        sequence_order: number;
      }[]
    >('SELECT id, name, subject_id, sequence_order FROM syllabus_units ORDER BY sequence_order ASC');
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      subjectId: r.subject_id,
      sequenceOrder: r.sequence_order,
    }));
  }

  async getUnits(subjectId: string): Promise<SyllabusUnit[]> {
    const db = getDatabase();
    const rows = await db.select<
      {
        id: string;
        name: string;
        subject_id: string;
        sequence_order: number;
      }[]
    >(
      `SELECT id, name, subject_id, sequence_order 
       FROM syllabus_units 
       WHERE subject_id = $1 
       ORDER BY sequence_order ASC`,
      [subjectId]
    );
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      subjectId: r.subject_id,
      sequenceOrder: r.sequence_order,
    }));
  }

  async saveChapter(chapter: SyllabusChapter): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT OR REPLACE INTO syllabus_chapters (id, name, unit_id, sequence_order, last_studied_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [chapter.id, chapter.name, chapter.unitId, chapter.sequenceOrder, chapter.lastStudiedAt || null]
    );
  }

  async getChapters(unitId: string): Promise<SyllabusChapter[]> {
    const db = getDatabase();
    const rows = await db.select<
      {
        id: string;
        name: string;
        unit_id: string;
        sequence_order: number;
        last_studied_at: string | null;
      }[]
    >(
      `SELECT id, name, unit_id, sequence_order, last_studied_at 
       FROM syllabus_chapters 
       WHERE unit_id = $1 
       ORDER BY sequence_order ASC`,
      [unitId]
    );
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      unitId: r.unit_id,
      sequenceOrder: r.sequence_order,
      lastStudiedAt: r.last_studied_at,
    }));
  }

  async getAllChapters(): Promise<SyllabusChapter[]> {
    const db = getDatabase();
    const rows = await db.select<
      {
        id: string;
        name: string;
        unit_id: string;
        sequence_order: number;
        last_studied_at: string | null;
      }[]
    >('SELECT id, name, unit_id, sequence_order, last_studied_at FROM syllabus_chapters ORDER BY sequence_order ASC');
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      unitId: r.unit_id,
      sequenceOrder: r.sequence_order,
      lastStudiedAt: r.last_studied_at,
    }));
  }

  async saveTopic(topic: SyllabusTopic): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT OR REPLACE INTO syllabus_topics (id, name, chapter_id, is_completed, completed_at, sequence_order)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        topic.id,
        topic.name,
        topic.chapterId,
        topic.isCompleted ? 1 : 0,
        topic.completedAt || null,
        topic.sequenceOrder,
      ]
    );
  }

  async getTopics(chapterId: string): Promise<SyllabusTopic[]> {
    const db = getDatabase();
    const rows = await db.select<
      {
        id: string;
        name: string;
        chapter_id: string;
        is_completed: number;
        completed_at: string | null;
        sequence_order: number;
      }[]
    >(
      `SELECT id, name, chapter_id, is_completed, completed_at, sequence_order 
       FROM syllabus_topics 
       WHERE chapter_id = $1 
       ORDER BY sequence_order ASC`,
      [chapterId]
    );
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      chapterId: r.chapter_id,
      isCompleted: r.is_completed === 1,
      completedAt: r.completed_at,
      sequenceOrder: r.sequence_order,
    }));
  }

  async getAllTopics(): Promise<SyllabusTopic[]> {
    const db = getDatabase();
    const rows = await db.select<
      {
        id: string;
        name: string;
        chapter_id: string;
        is_completed: number;
        completed_at: string | null;
        sequence_order: number;
      }[]
    >('SELECT id, name, chapter_id, is_completed, completed_at, sequence_order FROM syllabus_topics ORDER BY sequence_order ASC');
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      chapterId: r.chapter_id,
      isCompleted: r.is_completed === 1,
      completedAt: r.completed_at,
      sequenceOrder: r.sequence_order,
    }));
  }

  async saveDependency(dep: ChapterDependency): Promise<void> {
    const db = getDatabase();
    await db.execute(
      `INSERT OR REPLACE INTO chapter_dependencies (chapter_id, prerequisite_chapter_id)
       VALUES ($1, $2)`,
      [dep.chapterId, dep.prerequisiteChapterId]
    );
  }

  async getDependencies(): Promise<ChapterDependency[]> {
    const db = getDatabase();
    const rows = await db.select<{ chapter_id: string; prerequisite_chapter_id: string }[]>(
      'SELECT chapter_id, prerequisite_chapter_id FROM chapter_dependencies'
    );
    return rows.map(r => ({
      chapterId: r.chapter_id,
      prerequisiteChapterId: r.prerequisite_chapter_id,
    }));
  }
}
