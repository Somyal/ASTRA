import Database from '@tauri-apps/plugin-sql';

let dbInstance: Database | null = null;

// Database connection getter
export const getDatabase = (): Database => {
  if (!dbInstance) {
    throw new Error('Database not initialized. Ensure bootService runs before querying database.');
  }
  return dbInstance;
};

// Database migrations definitions
const MIGRATIONS = [
  // Migration 1: Setup migration version tracking table
  `CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at TEXT DEFAULT (datetime('now', 'localtime'))
  );`,

  // Migration 2: Core relational tables
  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  
  CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE,
    color TEXT,
    emoji TEXT
  );
  
  CREATE TABLE IF NOT EXISTS syllabus_chapters (
    id TEXT PRIMARY KEY,
    name TEXT,
    subject_id TEXT REFERENCES subjects(id),
    is_completed INTEGER DEFAULT 0,
    progress_bar INTEGER DEFAULT 0
  );
  
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT,
    subject_id TEXT REFERENCES subjects(id),
    priority INTEGER,
    status TEXT
  );
  
  CREATE TABLE IF NOT EXISTS study_sessions (
    id TEXT PRIMARY KEY,
    subject_id TEXT REFERENCES subjects(id),
    chapter_id TEXT REFERENCES syllabus_chapters(id),
    topic TEXT,
    planned_duration INTEGER,
    actual_duration INTEGER,
    started_at TEXT,
    completed_at TEXT,
    status TEXT
  );`,

  // Migration 3: Performance indexes
  `CREATE INDEX IF NOT EXISTS idx_sessions_started ON study_sessions(started_at);
  CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
  CREATE INDEX IF NOT EXISTS idx_chapters_subject ON syllabus_chapters(subject_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_subject ON study_sessions(subject_id);`,

  // Migration 4: Add reflection and interruption columns
  `ALTER TABLE study_sessions ADD COLUMN reflection TEXT;
   ALTER TABLE study_sessions ADD COLUMN was_interrupted INTEGER DEFAULT 0;`,

  // Migration 5: Add memory entries and adaptation ledger tables
  `CREATE TABLE IF NOT EXISTS memory_entries (
     id TEXT PRIMARY KEY,
     tier TEXT NOT NULL,
     category TEXT NOT NULL,
     content TEXT NOT NULL,
     evidence TEXT,
     relevance_score REAL DEFAULT 0.0,
     created_at TEXT NOT NULL,
     last_accessed TEXT NOT NULL,
     expires_at TEXT,
     is_incorrect INTEGER DEFAULT 0,
     is_permanent INTEGER DEFAULT 0
   );
   CREATE TABLE IF NOT EXISTS adaptation_ledger (
     id TEXT PRIMARY KEY,
     action_taken TEXT NOT NULL,
     rationale TEXT NOT NULL,
     created_at TEXT NOT NULL
   );
    CREATE INDEX IF NOT EXISTS idx_memories_tier_category ON memory_entries(tier, category);`,

  // Migration 6: Add syllabus hierarchy tables & columns safely
  `ALTER TABLE syllabus_chapters ADD COLUMN unit_id TEXT;
   ALTER TABLE syllabus_chapters ADD COLUMN sequence_order INTEGER DEFAULT 0;
   CREATE TABLE IF NOT EXISTS syllabus_units (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     subject_id TEXT NOT NULL,
     sequence_order INTEGER NOT NULL,
     FOREIGN KEY(subject_id) REFERENCES subjects(id)
   );
   CREATE TABLE IF NOT EXISTS syllabus_topics (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     chapter_id TEXT NOT NULL,
     is_completed INTEGER DEFAULT 0,
     completed_at TEXT,
     sequence_order INTEGER NOT NULL,
     FOREIGN KEY(chapter_id) REFERENCES syllabus_chapters(id)
   );
   CREATE TABLE IF NOT EXISTS chapter_dependencies (
     chapter_id TEXT NOT NULL,
     prerequisite_chapter_id TEXT NOT NULL,
     PRIMARY KEY (chapter_id, prerequisite_chapter_id),
     FOREIGN KEY(chapter_id) REFERENCES syllabus_chapters(id),
     FOREIGN KEY(prerequisite_chapter_id) REFERENCES syllabus_chapters(id)
   );
    ALTER TABLE tasks ADD COLUMN generated_from_chapter_id TEXT;
    ALTER TABLE tasks ADD COLUMN task_type TEXT DEFAULT 'manual';`,

  // Migration 7: Add last_studied_at column to syllabus_chapters safely
  `ALTER TABLE syllabus_chapters ADD COLUMN last_studied_at TEXT;`,
];

/**
 * Initializes the database connection and runs versioned migrations.
 */
export async function initializeDatabase(): Promise<void> {
  // Load local sqlite database file via tauri plugin SQL
  dbInstance = await Database.load('sqlite:astra.db');

  // 1. Ensure migration tracking table exists by running migration index 0
  await dbInstance.execute(MIGRATIONS[0]);

  // 2. Fetch completed versions from schema_migrations
  const rows = await dbInstance.select<{ version: number }[]>(
    'SELECT version FROM schema_migrations'
  );
  const appliedVersions = new Set(rows.map(r => r.version));

  // 3. Apply missing migrations sequentially
  for (let i = 0; i < MIGRATIONS.length; i++) {
    const version = i + 1;
    if (!appliedVersions.has(version)) {
      console.log(`Applying database migration version ${version}...`);
      
      const queries = MIGRATIONS[i]
        .split(';')
        .map(q => q.trim())
        .filter(q => q.length > 0);
        
      if (version === 6) {
        // Special idempotent checks for Migration 6 alterations on Windows/SQLite
        const tableInfo = await dbInstance.select<{ name: string }[]>(
          "PRAGMA table_info(syllabus_chapters)"
        );
        const hasUnitId = tableInfo.some(col => col.name === 'unit_id');
        const hasSeqOrder = tableInfo.some(col => col.name === 'sequence_order');

        const taskTableInfo = await dbInstance.select<{ name: string }[]>(
          "PRAGMA table_info(tasks)"
        );
        const hasGenFrom = taskTableInfo.some(col => col.name === 'generated_from_chapter_id');
        const hasTaskType = taskTableInfo.some(col => col.name === 'task_type');

        for (const query of queries) {
          if (query.includes('ADD COLUMN unit_id') && hasUnitId) continue;
          if (query.includes('ADD COLUMN sequence_order') && hasSeqOrder) continue;
          if (query.includes('ADD COLUMN generated_from_chapter_id') && hasGenFrom) continue;
          if (query.includes('ADD COLUMN task_type') && hasTaskType) continue;
          await dbInstance.execute(query);
        }
      } else if (version === 7) {
        // Special idempotent checks for Migration 7 alterations on Windows/SQLite
        const tableInfo = await dbInstance.select<{ name: string }[]>(
          "PRAGMA table_info(syllabus_chapters)"
        );
        const hasLastStudiedAt = tableInfo.some(col => col.name === 'last_studied_at');

        for (const query of queries) {
          if (query.includes('ADD COLUMN last_studied_at') && hasLastStudiedAt) continue;
          await dbInstance.execute(query);
        }
      } else {
        for (const query of queries) {
          await dbInstance.execute(query);
        }
      }

      // Record migration success
      await dbInstance.execute(
        'INSERT INTO schema_migrations (version) VALUES ($1)',
        [version]
      );
    }
  }
}
