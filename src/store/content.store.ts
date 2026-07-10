import { create } from 'zustand';
import { SubjectTree } from '../services/syllabus.service';

export interface Subject {
  id: string;
  name: string;
  color: string;
  emoji?: string;
}

export interface BacklogItem {
  id: string;
  title: string;
  subject: string;
  addedDate: string;
}

export interface Mistake {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  loggedDate: string;
}

export interface Revision {
  id: string;
  title: string;
  subject: string;
  scheduledDate: string;
  isDone: boolean;
}

export interface QuestionSolved {
  id: string;
  subject: string;
  count: number;
  date: string;
}

export interface ContentState {
  subjects: Subject[];
  syllabusTree: SubjectTree[];
  backlog: BacklogItem[];
  mistakes: Mistake[];
  revisions: Revision[];
  questionsSolvedLog: QuestionSolved[];

  setSubjects: (subjects: Subject[]) => void;
  setSyllabusTree: (tree: SubjectTree[]) => void;
  addBacklog: (item: Omit<BacklogItem, 'id' | 'addedDate'>) => void;
  addMistake: (mistake: Omit<Mistake, 'id' | 'loggedDate'>) => void;
  completeRevision: (id: string) => void;
  logQuestions: (subject: string, count: number) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  subjects: [],
  syllabusTree: [],
  backlog: [],
  mistakes: [],
  revisions: [],
  questionsSolvedLog: [],

  setSubjects: (subjects) => set({ subjects }),
  setSyllabusTree: (tree) => set({ syllabusTree: tree }),
  addBacklog: (item) =>
    set(state => ({
      backlog: [
        ...state.backlog,
        { ...item, id: 'backlog-' + Date.now(), addedDate: new Date().toISOString() },
      ],
    })),
  addMistake: (mistake) =>
    set(state => ({
      mistakes: [
        ...state.mistakes,
        { ...mistake, id: 'mistake-' + Date.now(), loggedDate: new Date().toISOString() },
      ],
    })),
  completeRevision: (id) =>
    set(state => ({
      revisions: state.revisions.map(r => r.id === id ? { ...r, isDone: true } : r),
    })),
  logQuestions: (subject, count) =>
    set(state => ({
      questionsSolvedLog: [
        ...state.questionsSolvedLog,
        { id: 'q-' + Date.now(), subject, count, date: new Date().toISOString() },
      ],
    })),
}));
export default useContentStore;
