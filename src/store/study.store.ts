import { create } from 'zustand';
import { StudySession, SessionStatus } from '../repositories/session.repository';

export interface DailyTotal {
  date: string;
  secs: number;
}

export interface SessionSummary {
  id: string;
  date: string;
  subject: string;
  activity: string;
  chapter: string | null;
  durationSecs: number;
  notes?: string | null;
  mood?: 'focused' | 'distracted' | 'tired' | 'energized' | null;
}

export interface SubjectStat {
  subject: string;
  secs: number;
}

export interface StudyState {
  status: SessionStatus;
  activeSession: StudySession | null;
  secondsElapsed: number;
  todaySeconds: number;
  weekSeconds: number;
  monthSeconds: number;
  lifetimeSeconds: number;
  currentStreak: number;
  lastStudyDate: string | null;
  dailyTotals: DailyTotal[];
  recentSessions: SessionSummary[];
  subjectStats: SubjectStat[];
  recoveredSession: StudySession | null;

  // Session lifecycle actions
  configureSession: (subject: string, topic: string, durationSecs: number) => void;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => void;
  abandonSession: () => void;
  archiveSession: () => void;
  tickTime: () => void;
  clearRecoveredSession: () => void;
}

export const useStudyStore = create<StudyState>((set, get) => ({
  status: 'idle',
  activeSession: null,
  secondsElapsed: 0,
  todaySeconds: 0,
  weekSeconds: 0,
  monthSeconds: 0,
  lifetimeSeconds: 0,
  currentStreak: 0, // Calculated dynamically on boot
  lastStudyDate: null,
  dailyTotals: [],
  recentSessions: [],
  subjectStats: [],
  recoveredSession: null,

  configureSession: (subject, topic, durationSecs) => {
    const session: StudySession = {
      id: 'session-' + Date.now(),
      subject,
      topic,
      plannedDuration: durationSecs,
      actualDuration: 0,
      startedAt: new Date().toISOString(),
      completedAt: null,
      status: 'configured',
      reflection: null,
      wasInterrupted: false,
    };
    set({
      status: 'configured',
      activeSession: session,
      secondsElapsed: 0,
    });
  },

  clearRecoveredSession: () => set({ recoveredSession: null }),

  startSession: () => {
    const session = get().activeSession;
    if (session && session.status === 'configured') {
      const updated: StudySession = {
        ...session,
        startedAt: new Date().toISOString(),
        status: 'running',
      };
      set({
        status: 'running',
        activeSession: updated,
      });
    }
  },

  pauseSession: () => {
    const session = get().activeSession;
    if (session && session.status === 'running') {
      const updated: StudySession = {
        ...session,
        status: 'paused',
      };
      set({
        status: 'paused',
        activeSession: updated,
      });
    }
  },

  resumeSession: () => {
    const session = get().activeSession;
    if (session && session.status === 'paused') {
      const updated: StudySession = {
        ...session,
        status: 'running',
      };
      set({
        status: 'running',
        activeSession: updated,
      });
    }
  },

  completeSession: () => {
    const session = get().activeSession;
    if (session && (session.status === 'running' || session.status === 'paused')) {
      const updated: StudySession = {
        ...session,
        completedAt: new Date().toISOString(),
        status: 'reflection',
      };
      set({
        status: 'reflection',
        activeSession: updated,
      });
    }
  },

  abandonSession: () => {
    const session = get().activeSession;
    if (session && (session.status === 'running' || session.status === 'paused')) {
      const updated: StudySession = {
        ...session,
        completedAt: new Date().toISOString(),
        status: 'abandoned',
        wasInterrupted: true,
      };
      set({
        status: 'abandoned',
        activeSession: updated,
      });
    }
  },

  archiveSession: () => {
    const session = get().activeSession;
    if (session) {
      const summary: SessionSummary = {
        id: session.id,
        date: new Date(session.startedAt).toLocaleDateString(),
        subject: session.subject,
        activity: session.topic,
        chapter: session.topic,
        durationSecs: session.actualDuration,
      };

      set(state => ({
        status: 'idle',
        activeSession: null,
        secondsElapsed: 0,
        recentSessions: [summary, ...state.recentSessions],
        lifetimeSeconds: state.lifetimeSeconds + session.actualDuration,
        todaySeconds: state.todaySeconds + session.actualDuration,
      }));
    }
  },

  tickTime: () => {
    const { status, activeSession } = get();
    if (status === 'running' && activeSession) {
      const updatedActual = activeSession.actualDuration + 1;
      const updatedSession: StudySession = {
        ...activeSession,
        actualDuration: updatedActual,
      };
      set(state => ({
        secondsElapsed: state.secondsElapsed + 1,
        activeSession: updatedSession,
      }));
    }
  },
}));
