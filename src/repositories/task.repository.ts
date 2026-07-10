import { Task } from '../store/tasks.store';
export type { Task };

export interface ITaskRepository {
  saveTask(task: Task): Promise<void>;
  getTasks(): Promise<Task[]>;
  deleteTask(id: string): Promise<void>;
}

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Task[] = [];

  async saveTask(task: Task): Promise<void> {
    const idx = this.tasks.findIndex(t => t.id === task.id);
    if (idx !== -1) {
      this.tasks[idx] = task;
    } else {
      this.tasks.push(task);
    }
  }

  async getTasks(): Promise<Task[]> {
    return [...this.tasks];
  }

  async deleteTask(id: string): Promise<void> {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }
}
