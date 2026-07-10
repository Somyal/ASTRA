export type AcademicEvent =
  | { type: 'TopicCompleted'; topicId: string }
  | { type: 'SessionCompleted'; sessionId: string }
  | { type: 'TaskCompleted'; taskId: string }
  | { type: 'SyllabusChanged' };

type AcademicEventListener = (event: AcademicEvent) => void | Promise<void>;

class AcademicEventBus {
  private listeners: AcademicEventListener[] = [];

  subscribe(listener: AcademicEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  async emit(event: AcademicEvent): Promise<void> {
    console.log(`[AcademicEventBus] Emitting event:`, event);
    for (const listener of this.listeners) {
      try {
        await listener(event);
      } catch (e) {
        console.error(`Error in academic event listener for ${event.type}:`, e);
      }
    }
  }
}

export const academicEventBus = new AcademicEventBus();
export default academicEventBus;
