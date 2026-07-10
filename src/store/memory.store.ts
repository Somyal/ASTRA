import { create } from 'zustand';
import { repositoryFactory } from '../repositories';
import { MemoryEntry, AdaptationLedgerEntry } from '../repositories/memory.repository';

export interface MemoryState {
  memories: MemoryEntry[];
  ledger: AdaptationLedgerEntry[];
  isLoading: boolean;
  
  loadMemories: () => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  markMemoryIncorrect: (id: string) => Promise<void>;
  loadLedger: () => Promise<void>;
}

export const useMemoryStore = create<MemoryState>((set) => ({
  memories: [],
  ledger: [],
  isLoading: false,

  loadMemories: async () => {
    set({ isLoading: true });
    try {
      const repo = repositoryFactory.getMemoryRepository();
      const list = await repo.getMemories();
      set({ memories: list, isLoading: false });
    } catch (e) {
      console.error('Failed to load memories:', e);
      set({ isLoading: false });
    }
  },

  deleteMemory: async (id) => {
    try {
      const repo = repositoryFactory.getMemoryRepository();
      await repo.deleteMemory(id);
      set((state) => ({
        memories: state.memories.filter((m) => m.id !== id),
      }));
    } catch (e) {
      console.error('Failed to delete memory:', e);
    }
  },

  markMemoryIncorrect: async (id) => {
    try {
      const repo = repositoryFactory.getMemoryRepository();
      await repo.markIncorrect(id);
      set((state) => ({
        memories: state.memories.map((m) =>
          m.id === id ? { ...m, isIncorrect: true } : m
        ),
      }));
    } catch (e) {
      console.error('Failed to mark memory incorrect:', e);
    }
  },

  loadLedger: async () => {
    try {
      const repo = repositoryFactory.getAdaptationLedgerRepository();
      const list = await repo.getLedgerEntries();
      set({ ledger: list });
    } catch (e) {
      console.error('Failed to load adaptation ledger:', e);
    }
  },
}));
