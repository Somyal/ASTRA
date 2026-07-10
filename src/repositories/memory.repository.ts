export type MemoryTier = 'active' | 'long_term' | 'archival';

export type MemoryCategory = 'focus_rhythm' | 'syllabus_confidence' | 'intentions';

export interface MemoryEntry {
  id: string;
  tier: MemoryTier;
  category: MemoryCategory;
  content: string;
  evidence?: string | null;
  relevanceScore: number;
  createdAt: string;
  lastAccessed: string;
  expiresAt?: string | null;
  isIncorrect: boolean;
  isPermanent: boolean;
}

export interface AdaptationLedgerEntry {
  id: string;
  actionTaken: string;
  rationale: string;
  createdAt: string;
}

export interface IMemoryRepository {
  getMemories(): Promise<MemoryEntry[]>;
  saveMemory(entry: MemoryEntry): Promise<void>;
  deleteMemory(id: string): Promise<void>;
  markIncorrect(id: string): Promise<void>;
}

export interface IAdaptationLedgerRepository {
  getLedgerEntries(): Promise<AdaptationLedgerEntry[]>;
  saveLedgerEntry(entry: AdaptationLedgerEntry): Promise<void>;
}

// In-Memory Fallbacks for local sandboxed environments / unit testing
export class InMemoryMemoryRepository implements IMemoryRepository {
  private memories: Map<string, MemoryEntry> = new Map();

  async getMemories(): Promise<MemoryEntry[]> {
    return Array.from(this.memories.values());
  }

  async saveMemory(entry: MemoryEntry): Promise<void> {
    this.memories.set(entry.id, entry);
  }

  async deleteMemory(id: string): Promise<void> {
    this.memories.delete(id);
  }

  async markIncorrect(id: string): Promise<void> {
    const existing = this.memories.get(id);
    if (existing) {
      existing.isIncorrect = true;
    }
  }
}

export class InMemoryAdaptationLedgerRepository implements IAdaptationLedgerRepository {
  private ledger: Map<string, AdaptationLedgerEntry> = new Map();

  async getLedgerEntries(): Promise<AdaptationLedgerEntry[]> {
    return Array.from(this.ledger.values());
  }

  async saveLedgerEntry(entry: AdaptationLedgerEntry): Promise<void> {
    this.ledger.set(entry.id, entry);
  }
}
