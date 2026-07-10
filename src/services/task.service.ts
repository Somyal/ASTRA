import { useTasksStore, Task } from '../store/tasks.store';
import { repositoryFactory } from '../repositories/index';
import { academicEventBus } from '../events/academic_event';

export interface ITaskService {
  createTask(title: string, subjectId: string, priority: number): Promise<void>;
  toggleTask(id: string): Promise<void>;
  getTasks(): Promise<Task[]>;
}

export class TaskService implements ITaskService {
  async createTask(title: string, subjectId: string, priority: number): Promise<void> {
    const taskRepo = repositoryFactory.getTaskRepository();
    const task: Task = {
      id: 'task-' + Date.now(),
      title,
      subjectId,
      priority,
      status: 'pending',
      taskType: 'manual',
    };
    await taskRepo.saveTask(task);
    
    // Sync store
    useTasksStore.getState().addTask(task);
    
    await academicEventBus.emit({ type: 'TaskCompleted', taskId: task.id });
  }

  async toggleTask(id: string): Promise<void> {
    const taskRepo = repositoryFactory.getTaskRepository();
    const syllabusRepo = repositoryFactory.getSyllabusRepository();
    const tasks = await taskRepo.getTasks();
    const task = tasks.find(t => t.id === id);

    if (task) {
      const isCompleting = task.status !== 'completed';
      const updated: Task = {
        ...task,
        status: isCompleting ? 'completed' : 'pending',
      };
      await taskRepo.saveTask(updated);

      // Perform dynamic academic domain updates if auto-generated
      if (task.generatedFromChapterId) {
        const chapters = await syllabusRepo.getAllChapters();
        const chapter = chapters.find(c => c.id === task.generatedFromChapterId);
        
        if (chapter) {
          if (task.taskType === 'auto_study') {
            const topics = await syllabusRepo.getTopics(chapter.id);
            if (isCompleting) {
              // Mark the first uncompleted topic as completed
              const firstUncompleted = topics.find(t => !t.isCompleted);
              if (firstUncompleted) {
                firstUncompleted.isCompleted = true;
                firstUncompleted.completedAt = new Date().toISOString();
                await syllabusRepo.saveTopic(firstUncompleted);

                chapter.lastStudiedAt = new Date().toISOString();
                await syllabusRepo.saveChapter(chapter);
              }
            } else {
              // Un-completing the task: mark the last completed topic as uncompleted
              const lastCompleted = [...topics].reverse().find(t => t.isCompleted);
              if (lastCompleted) {
                lastCompleted.isCompleted = false;
                lastCompleted.completedAt = null;
                await syllabusRepo.saveTopic(lastCompleted);
              }
            }
          } else if (task.taskType === 'auto_revision') {
            if (isCompleting) {
              chapter.lastStudiedAt = new Date().toISOString();
              await syllabusRepo.saveChapter(chapter);
            }
          }
        }
      }

      // Sync tasks store
      useTasksStore.getState().toggleTask(id);

      // Emit domain events
      await academicEventBus.emit({ type: 'TaskCompleted', taskId: id });
      await academicEventBus.emit({ type: 'SyllabusChanged' });
    }
  }

  async getTasks(): Promise<Task[]> {
    const taskRepo = repositoryFactory.getTaskRepository();
    return await taskRepo.getTasks();
  }
}

export const taskService = new TaskService();
export default taskService;
