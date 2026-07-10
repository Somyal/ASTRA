import { create } from 'zustand';

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  priority: number;
  status: 'pending' | 'active' | 'completed' | 'deferred';
  generatedFromChapterId?: string;
  taskType?: 'manual' | 'auto_study' | 'auto_revision';
}

export interface Deadline {
  id: string;
  title: string;
  dueDate: string;
  subjectId?: string;
}

export interface PriorityQueueItem {
  id: string;
  taskId: string;
  rank: number;
}

export interface RecoveryDay {
  date: string;
  reason: string;
}

export interface TasksState {
  tasks: Task[];
  deadlines: Deadline[];
  priorityQueue: PriorityQueueItem[];
  recoveryDays: RecoveryDay[];

  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'status'>) => void;
  toggleTask: (id: string) => void;
  addDeadline: (deadline: Omit<Deadline, 'id'>) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  deadlines: [],
  priorityQueue: [],
  recoveryDays: [],

  setTasks: (tasks) => set({ tasks }),
  addTask: (task) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...task,
          id: 'task-' + Date.now(),
          status: 'pending',
          taskType: task.taskType || 'manual',
        },
      ],
    })),
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
      ),
    })),
  addDeadline: (deadline) =>
    set((state) => ({
      deadlines: [...state.deadlines, { ...deadline, id: 'deadline-' + Date.now() }],
    })),
}));
export default useTasksStore;
