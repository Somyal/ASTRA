import { ISessionRepository, InMemorySessionRepository } from './session.repository';
import { ITaskRepository, InMemoryTaskRepository } from './task.repository';
import { ISettingsRepository, InMemorySettingsRepository } from './settings.repository';
import { IContentRepository, SQLiteContentRepository } from './sqlite.repositories';
import { Subject } from '../store/content.store';
import { SQLiteSessionRepository, SQLiteTaskRepository, SQLiteSettingsRepository } from './sqlite.repositories';
import {
  IMemoryRepository,
  IAdaptationLedgerRepository,
  InMemoryMemoryRepository,
  InMemoryAdaptationLedgerRepository
} from './memory.repository';
import { SQLiteMemoryRepository, SQLiteAdaptationLedgerRepository } from './sqlite.repositories';
import {
  ISyllabusRepository,
  InMemorySyllabusRepository,
  SQLiteSyllabusRepository
} from './syllabus.repository';

export * from './session.repository';
export * from './task.repository';
export * from './settings.repository';
export * from './memory.repository';
export * from './sqlite.repositories';
export * from './syllabus.repository';
export * from './db';

export interface IRepositoryFactory {
  getSessionRepository(): ISessionRepository;
  getTaskRepository(): ITaskRepository;
  getSettingsRepository(): ISettingsRepository;
  getContentRepository(): IContentRepository;
  getMemoryRepository(): IMemoryRepository;
  getAdaptationLedgerRepository(): IAdaptationLedgerRepository;
  getSyllabusRepository(): ISyllabusRepository;
}

export class RepositoryFactory implements IRepositoryFactory {
  private activeMode: 'memory' | 'sqlite' = 'sqlite';
  
  private memSessions = new InMemorySessionRepository();
  private memTasks = new InMemoryTaskRepository();
  private memSettings = new InMemorySettingsRepository();
  private memMemory = new InMemoryMemoryRepository();
  private memLedger = new InMemoryAdaptationLedgerRepository();
  private memSyllabus = new InMemorySyllabusRepository();
  private memContent = new InMemoryContentRepository();
  
  private sqlSessions = new SQLiteSessionRepository();
  private sqlTasks = new SQLiteTaskRepository();
  private sqlSettings = new SQLiteSettingsRepository();
  private sqlContent = new SQLiteContentRepository();
  private sqlMemory = new SQLiteMemoryRepository();
  private sqlLedger = new SQLiteAdaptationLedgerRepository();
  private sqlSyllabus = new SQLiteSyllabusRepository();

  setMode(mode: 'memory' | 'sqlite') {
    this.activeMode = mode;
  }

  getMode(): 'memory' | 'sqlite' {
    return this.activeMode;
  }

  getSessionRepository(): ISessionRepository {
    return this.activeMode === 'sqlite' ? this.sqlSessions : this.memSessions;
  }

  getTaskRepository(): ITaskRepository {
    return this.activeMode === 'sqlite' ? this.sqlTasks : this.memTasks;
  }

  getSettingsRepository(): ISettingsRepository {
    return this.activeMode === 'sqlite' ? this.sqlSettings : this.memSettings;
  }

  getContentRepository(): IContentRepository {
    return this.activeMode === 'sqlite' ? this.sqlContent : this.memContent;
  }

  getMemoryRepository(): IMemoryRepository {
    return this.activeMode === 'sqlite' ? this.sqlMemory : this.memMemory;
  }

  getAdaptationLedgerRepository(): IAdaptationLedgerRepository {
    return this.activeMode === 'sqlite' ? this.sqlLedger : this.memLedger;
  }

  getSyllabusRepository(): ISyllabusRepository {
    return this.activeMode === 'sqlite' ? this.sqlSyllabus : this.memSyllabus;
  }
}

export class InMemoryContentRepository implements IContentRepository {
  private subjects: Subject[] = [];

  async saveSubject(subject: Subject): Promise<void> {
    this.subjects = this.subjects.filter(s => s.id !== subject.id).concat(subject);
  }

  async getSubjects(): Promise<Subject[]> {
    return [...this.subjects];
  }
}

export const repositoryFactory = new RepositoryFactory();
