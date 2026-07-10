import { repositoryFactory } from '../repositories';
import { syllabusService } from './syllabus.service';
import { academicEventBus } from '../events/academic_event';
import { useTasksStore } from '../store/tasks.store';

export class TaskIntelligenceService {
  constructor() {
    academicEventBus.subscribe(async (event) => {
      console.log(`[TaskIntelligenceService] Processing academic change event: ${event.type}`);
      await this.generateDailyWorkQueue();
    });
  }

  async generateDailyWorkQueue(): Promise<void> {
    console.log('[TaskIntelligenceService] Compiling daily work queue...');
    const taskRepo = repositoryFactory.getTaskRepository();
    const currentTasks = await taskRepo.getTasks();

    // 1. Remove pending auto-generated tasks to avoid duplicates or orphaned items
    const tasksToDelete = currentTasks.filter(
      t => t.status === 'pending' && (t.taskType === 'auto_study' || t.taskType === 'auto_revision')
    );
    for (const t of tasksToDelete) {
      await taskRepo.deleteTask(t.id);
    }

    // 2. Fetch fresh syllabus trees
    const tree = await syllabusService.getSyllabusTree();
    const updatedTasksList = await taskRepo.getTasks();

    // 3. Scan the tree and compile focus tasks
    for (const subjectNode of tree) {
      for (const unitNode of subjectNode.units) {
        for (const chapterNode of unitNode.chapters) {
          const { chapter, status, topics } = chapterNode;

          if (status === 'locked' || status === 'completed') {
            continue;
          }

          // Case A: Revision Due
          if (status === 'revision_due') {
            const hasRevisionTask = updatedTasksList.some(
              t => t.generatedFromChapterId === chapter.id && t.taskType === 'auto_revision'
            );
            if (!hasRevisionTask) {
              await taskRepo.saveTask({
                id: `task-rev-${chapter.id}`,
                title: `Revise ${subjectNode.subject.emoji} ${chapter.name}`,
                subjectId: subjectNode.subject.id,
                priority: 1, // High
                status: 'pending',
                generatedFromChapterId: chapter.id,
                taskType: 'auto_revision',
              });
            }
          }

          // Case B: Study or Resume Study
          if (status === 'available' || status === 'in_progress') {
            const firstUncompleted = topics.find(t => !t.isCompleted);
            if (firstUncompleted) {
              const hasStudyTask = updatedTasksList.some(
                t => t.generatedFromChapterId === chapter.id && t.taskType === 'auto_study' && t.status === 'pending'
              );
              if (!hasStudyTask) {
                const prefix = status === 'in_progress' ? 'Resume' : 'Study';
                await taskRepo.saveTask({
                  id: `task-std-${chapter.id}-${firstUncompleted.id}`,
                  title: `${prefix} ${subjectNode.subject.emoji} ${chapter.name}: ${firstUncompleted.name}`,
                  subjectId: subjectNode.subject.id,
                  priority: status === 'in_progress' ? 2 : 3, // Medium vs Standard
                  status: 'pending',
                  generatedFromChapterId: chapter.id,
                  taskType: 'auto_study',
                });
              }
            }
          }
        }
      }
    }

    // 4. Hydrate Zustand state
    const finalTasks = await taskRepo.getTasks();
    useTasksStore.getState().setTasks(finalTasks);
    console.log('[TaskIntelligenceService] Work queue generation completed.');
  }
}

export const taskIntelligenceService = new TaskIntelligenceService();
export default taskIntelligenceService;
