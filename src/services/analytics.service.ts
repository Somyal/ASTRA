import { repositoryFactory, StudySession } from '../repositories/index';
import { SessionSummary, SubjectStat } from '../store/study.store';

export interface AnalyticsStats {
  todaySeconds: number;
  weekSeconds: number;
  monthSeconds: number;
  lifetimeSeconds: number;
  currentStreak: number;
  recentSessions: SessionSummary[];
  subjectStats: SubjectStat[];
}

export interface IAnalyticsService {
  getStats(): Promise<AnalyticsStats>;
}

export class AnalyticsService implements IAnalyticsService {
  /**
   * Compiles dynamic study metrics based on database content.
   * This calculation is pure and deterministic.
   */
  async getStats(): Promise<AnalyticsStats> {
    const sessionRepo = repositoryFactory.getSessionRepository();
    // Query study sessions. Abstraction separates query layer from callers.
    const sessions = await sessionRepo.getSessions();

    const now = new Date();
    const todayStr = this.formatLocalDate(now);

    // Calculate dates for 7-day and 30-day boundaries
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfWeekTime = startOfWeek.getTime();

    const startOfMonth = new Date();
    startOfMonth.setDate(startOfMonth.getDate() - 29);
    startOfMonth.setHours(0, 0, 0, 0);
    const startOfMonthTime = startOfMonth.getTime();

    let todaySeconds = 0;
    let weekSeconds = 0;
    let monthSeconds = 0;
    let lifetimeSeconds = 0;

    const subjectMap: Record<string, number> = {};
    const completedSessions = sessions.filter(s => s.status === 'completed');

    for (const s of completedSessions) {
      const time = new Date(s.startedAt).getTime();
      const dur = s.actualDuration;

      lifetimeSeconds += dur;

      // Timezone-safe daily boundary check
      const localDateStr = this.formatLocalDate(new Date(s.startedAt));
      if (localDateStr === todayStr) {
        todaySeconds += dur;
      }
      if (time >= startOfWeekTime) {
        weekSeconds += dur;
      }
      if (time >= startOfMonthTime) {
        monthSeconds += dur;
      }

      const subName = s.subject || 'General';
      subjectMap[subName] = (subjectMap[subName] || 0) + dur;
    }

    const subjectStats: SubjectStat[] = Object.entries(subjectMap)
      .map(([subject, secs]) => ({
        subject,
        secs,
      }))
      .sort((a, b) => b.secs - a.secs);

    const recentSessions: SessionSummary[] = sessions.map(s => ({
      id: s.id,
      date: new Date(s.startedAt).toLocaleDateString(),
      subject: s.subject || 'General',
      activity: s.topic,
      chapter: s.topic,
      durationSecs: s.actualDuration,
      notes: s.notes || null,
      mood: s.mood || null,
    }));

    const currentStreak = this.calculateStreak(completedSessions);

    return {
      todaySeconds,
      weekSeconds,
      monthSeconds,
      lifetimeSeconds,
      currentStreak,
      recentSessions,
      subjectStats,
    };
  }

  /**
   * Calculates the consecutive daily study streak in local time.
   */
  private calculateStreak(completedSessions: StudySession[]): number {
    if (completedSessions.length === 0) return 0;

    const dates = Array.from(
      new Set(
        completedSessions.map(s => this.formatLocalDate(new Date(s.startedAt)))
      )
    ).sort((a, b) => b.localeCompare(a));

    const now = new Date();
    const todayStr = this.formatLocalDate(now);
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = this.formatLocalDate(yesterday);

    const dateSet = new Set(dates);
    let streak: number;
    let checkDate: Date;

    if (dateSet.has(todayStr)) {
      streak = 1;
      checkDate = now;
    } else if (dateSet.has(yesterdayStr)) {
      streak = 1;
      checkDate = yesterday;
    } else {
      return 0;
    }

    while (true) {
      checkDate.setDate(checkDate.getDate() - 1);
      const prevDayStr = this.formatLocalDate(checkDate);
      if (dateSet.has(prevDayStr)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  private formatLocalDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
