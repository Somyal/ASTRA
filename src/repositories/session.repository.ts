export type SessionStatus =
  | 'idle'
  | 'configured'
  | 'running'
  | 'paused'
  | 'completed'
  | 'abandoned'
  | 'reflection';

export interface StudySession {
  id: string;
  subject: string;
  topic: string;
  plannedDuration: number; // in seconds
  actualDuration: number; // in seconds
  startedAt: string;
  completedAt: string | null;
  status: SessionStatus;
  reflection?: string | null;
  notes?: string | null;
  mood?: 'focused' | 'distracted' | 'tired' | 'energized' | null;
  wasInterrupted?: boolean;
}

export interface ISessionRepository {
  saveSession(session: StudySession): Promise<void>;
  getSessions(): Promise<StudySession[]>;
  getActiveSession(): Promise<StudySession | null>;
}

export class InMemorySessionRepository implements ISessionRepository {
  private sessions: StudySession[] = [];
  private activeSession: StudySession | null = null;

  async saveSession(session: StudySession): Promise<void> {
    if (
      session.status === 'running' ||
      session.status === 'paused' ||
      session.status === 'configured'
    ) {
      this.activeSession = session;
    } else {
      this.activeSession = null;
      const idx = this.sessions.findIndex(s => s.id === session.id);
      if (idx !== -1) {
        this.sessions[idx] = session;
      } else {
        this.sessions.push(session);
      }
    }
  }

  async getSessions(): Promise<StudySession[]> {
    return [...this.sessions];
  }

  async getActiveSession(): Promise<StudySession | null> {
    return this.activeSession;
  }
}
