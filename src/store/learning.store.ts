import { create } from 'zustand';
import { LearningItem, LearningAction } from '../repositories/learning.repository';

export interface LearningState {
  items: LearningItem[];
  actions: LearningAction[];
  activeAction: LearningAction | null;
  isLoading: boolean;

  setItems: (items: LearningItem[]) => void;
  setActions: (actions: LearningAction[]) => void;
  setActiveAction: (action: LearningAction | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useLearningStore = create<LearningState>((set) => ({
  items: [],
  actions: [],
  activeAction: null,
  isLoading: false,

  setItems: (items) => set({ items }),
  setActions: (actions) => set({ actions }),
  setActiveAction: (activeAction) => set({ activeAction }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
export default useLearningStore;
