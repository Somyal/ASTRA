import { repositoryFactory } from '../repositories/index';
import { LearningItem, LearningAction } from '../repositories/learning.repository';
import { useLearningStore } from '../store/learning.store';

export class LearningService {
  async createLearningItem(
    title: string,
    sourceType: 'syllabus' | 'manual' = 'manual',
    sourceRef: string | null = null
  ): Promise<LearningItem> {
    const item: LearningItem = {
      id: 'item-' + Date.now(),
      areaId: null,
      title: title.trim(),
      sourceType,
      sourceRef,
      status: 'active',
    };

    const repo = repositoryFactory.getLearningRepository();
    await repo.saveItem(item);
    
    // Refresh store cache
    const items = await repo.getItems();
    useLearningStore.getState().setItems(items);
    
    return item;
  }

  async createLearningAction(
    itemId: string,
    intentionType: string,
    customWording: string,
    dueDate: string | null = null
  ): Promise<LearningAction> {
    const action: LearningAction = {
      id: 'action-' + Date.now(),
      itemId,
      intentionType,
      customWording: customWording.trim(),
      status: 'active',
      dueDate,
      createdAt: new Date().toISOString(),
    };

    const repo = repositoryFactory.getLearningRepository();
    await repo.saveAction(action);
    
    // Refresh store cache
    const actions = await repo.getActions();
    useLearningStore.getState().setActions(actions);
    useLearningStore.getState().setActiveAction(action);
    
    return action;
  }

  async loadInitialData(): Promise<void> {
    const repo = repositoryFactory.getLearningRepository();
    const items = await repo.getItems();
    const actions = await repo.getActions();
    const active = actions.find(a => a.status === 'active') || null;

    useLearningStore.getState().setItems(items);
    useLearningStore.getState().setActions(actions);
    useLearningStore.getState().setActiveAction(active);
  }
}

export const learningService = new LearningService();
export default learningService;
