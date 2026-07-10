import React, { useMemo, useState } from 'react';
import { useStudyStore } from '../store/study.store';
import { useSettingsStore } from '../store/settings.store';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { Flame, Target, Zap, TrendingUp, X } from 'lucide-react';
import './AnalyticsDashboard.css';

/**
 * AnalyticsDashboard - Visualizes study progress and performance metrics
 *
 * Shows:
 * - Today's focus time
 * - Current streak
 * - Weekly/monthly totals
 * - Subject breakdown
 * - Simple bar chart of weekly productivity
 * - Recent sessions with mood indicators and notes
 */
export const AnalyticsDashboard: React.FC = () => {
  const {
    todaySeconds,
    weekSeconds,
    lifetimeSeconds,
    currentStreak,
    recentSessions,
    subjectStats,
  } = useStudyStore();
  const { identity } = useSettingsStore();
  const [selectedSessionIdx, setSelectedSessionIdx] = useState<number | null>(null);

  // Calculate daily breakdown for the past 7 days
  const dailyBreakdown = useMemo(() => {
    const days: { [key: string]: number } = {};
    const now = new Date();

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', {
        weekday: 'short',
      });
      days[dateStr] = 0;
    }

    // Populate with session data
    recentSessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const dateStr = sessionDate.toLocaleDateString('en-US', {
        weekday: 'short',
      });
      if (days[dateStr] !== undefined) {
        days[dateStr] += session.durationSecs;
      }
    });

    return Object.entries(days).map(([day, secs]) => ({
      day,
      secs,
      mins: Math.round(secs / 60),
    }));
  }, [recentSessions]);

  // Calculate max for scaling
  const maxDailyMins = Math.max(...dailyBreakdown.map(d => d.mins), 1);

  const formatMinutes = (secs: number) => {
    const mins = Math.round(secs / 60);
    const hours = Math.floor(mins / 60);
    if (hours > 0) {
      return `${hours}h ${mins % 60}m`;
    }
    return `${mins}m`;
  };

  const getMoodEmoji = (mood?: 'focused' | 'distracted' | 'tired' | 'energized' | null) => {
    switch (mood) {
      case 'focused':
        return '🎯';
      case 'energized':
        return '⚡';
      case 'distracted':
        return '🤔';
      case 'tired':
        return '😴';
      default:
        return '';
    }
  };

  // Top subjects
  const topSubjects = subjectStats.slice(0, 5);


  return (
    <div className="analytics-dashboard fade-in">
      <div style={{ paddingBottom: '2rem' }}>
        <Typography variant="title" style={{ marginBottom: '0.5rem' }}>
          Study Analytics
        </Typography>
        <Typography variant="body" color="secondary">
          {identity.userName}'s focus tracker for {new Date().toLocaleDateString()}
        </Typography>
      </div>

      {/* Key Metrics */}
      <div className="analytics-grid">
        {/* Today's Focus Time */}
        <Card className="analytics-card">
          <div className="analytics-card-icon today">
            <Zap size={24} />
          </div>
          <div>
            <Typography variant="caption" color="muted">
              TODAY
            </Typography>
            <Typography variant="heading" style={{ marginTop: '0.5rem' }}>
              {formatMinutes(todaySeconds)}
            </Typography>
            <Typography variant="caption" color="secondary" style={{ marginTop: '0.25rem' }}>
              {
                recentSessions.filter(
                  s => new Date(s.date).toDateString() === new Date().toDateString()
                ).length
              }{' '}
              session
              {recentSessions.filter(
                s => new Date(s.date).toDateString() === new Date().toDateString()
              ).length !== 1
                ? 's'
                : ''}
            </Typography>
          </div>
        </Card>

        {/* Current Streak */}
        <Card className="analytics-card">
          <div className="analytics-card-icon streak">
            <Flame size={24} />
          </div>
          <div>
            <Typography variant="caption" color="muted">
              STREAK
            </Typography>
            <Typography variant="heading" style={{ marginTop: '0.5rem' }}>
              {currentStreak}d
            </Typography>
            <Typography variant="caption" color="secondary" style={{ marginTop: '0.25rem' }}>
              Keep it going!
            </Typography>
          </div>
        </Card>

        {/* Weekly Total */}
        <Card className="analytics-card">
          <div className="analytics-card-icon weekly">
            <TrendingUp size={24} />
          </div>
          <div>
            <Typography variant="caption" color="muted">
              THIS WEEK
            </Typography>
            <Typography variant="heading" style={{ marginTop: '0.5rem' }}>
              {formatMinutes(weekSeconds)}
            </Typography>
            <Typography variant="caption" color="secondary" style={{ marginTop: '0.25rem' }}>
              {
                recentSessions.filter(s => {
                  const sessionDate = new Date(s.date);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return sessionDate >= weekAgo;
                }).length
              }{' '}
              sessions
            </Typography>
          </div>
        </Card>

        {/* Lifetime Total */}
        <Card className="analytics-card">
          <div className="analytics-card-icon lifetime">
            <Target size={24} />
          </div>
          <div>
            <Typography variant="caption" color="muted">
              LIFETIME
            </Typography>
            <Typography variant="heading" style={{ marginTop: '0.5rem' }}>
              {formatMinutes(lifetimeSeconds)}
            </Typography>
            <Typography variant="caption" color="secondary" style={{ marginTop: '0.25rem' }}>
              All sessions combined
            </Typography>
          </div>
        </Card>
      </div>

      {/* Weekly Breakdown Chart */}
      <div className="analytics-section">
        <Typography variant="title" style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
          Weekly Breakdown
        </Typography>
        <div className="weekly-chart">
          {dailyBreakdown.map((day, idx) => (
            <div key={idx} className="chart-bar-container">
              <div className="chart-bar-label">
                <span className="bar-label">{day.day}</span>
              </div>
              <div className="chart-bar-wrapper">
                <div
                  className="chart-bar"
                  style={{
                    height: `${(day.mins / maxDailyMins) * 100}%`,
                  }}
                  title={`${day.mins}m`}
                />
              </div>
              <div className="chart-bar-value">
                <span>{day.mins > 0 ? day.mins : '—'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Subjects */}
      {topSubjects.length > 0 && (
        <div className="analytics-section">
          <Typography variant="title" style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
            Top Subjects
          </Typography>
          <div className="subject-list">
            {topSubjects.map((subject, idx) => (
              <div key={idx} className="subject-item">
                <div className="subject-rank">
                  <span>{idx + 1}</span>
                </div>
                <div className="subject-info">
                  <Typography variant="body">{subject.subject}</Typography>
                  <Typography variant="caption" color="secondary">
                    {formatMinutes(subject.secs)}
                  </Typography>
                </div>
                <div className="subject-bar-bg">
                  <div
                    className="subject-bar-fill"
                    style={{
                      width: `${(subject.secs / (topSubjects[0]?.secs || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Sessions Preview */}
      <div className="analytics-section">
        <Typography variant="title" style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
          Recent Sessions
        </Typography>
        <div className="recent-sessions">
          {recentSessions.slice(0, 5).map((session, idx) => (
            <div key={idx}>
              <div
                className="session-item"
                onClick={() => setSelectedSessionIdx(selectedSessionIdx === idx ? null : idx)}
                style={{ cursor: 'pointer' }}
              >
                <div className="session-subject">
                  <Typography variant="body">{session.subject}</Typography>
                  <Typography variant="caption" color="secondary">
                    {session.activity}
                  </Typography>
                </div>
                <div className="session-stats">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {session.mood && (
                      <span title={session.mood} style={{ fontSize: '1.1rem' }}>
                        {getMoodEmoji(session.mood)}
                      </span>
                    )}
                    <Typography variant="caption" color="accent">
                      {formatMinutes(session.durationSecs)}
                    </Typography>
                  </div>
                  <Typography variant="caption" color="muted">
                    {session.date}
                  </Typography>
                </div>
              </div>
              {/* Expanded notes view */}
              {selectedSessionIdx === idx && session.notes && (
                <div className="session-notes-detail">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <Typography variant="caption" color="secondary">
                      📝 Notes
                    </Typography>
                    <button
                      onClick={() => setSelectedSessionIdx(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        padding: '0.25rem',
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <Typography variant="body" style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {session.notes}
                  </Typography>
                </div>
              )}
            </div>
          ))}
          {recentSessions.length === 0 && (
            <Typography
              variant="body"
              color="secondary"
              style={{ textAlign: 'center', padding: '2rem' }}
            >
              No sessions yet. Start studying to see your analytics!
            </Typography>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="analytics-section insights">
        <Typography variant="title" style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
          💡 Insights
        </Typography>
        <div className="insights-list">
          {currentStreak > 0 && (
            <div className="insight-item">
              <span>🔥</span>
              <Typography variant="body">
                {currentStreak} day streak! Keep focusing to extend it.
              </Typography>
            </div>
          )}
          {topSubjects.length > 0 && (
            <div className="insight-item">
              <span>📚</span>
              <Typography variant="body">
                {topSubjects[0]?.subject} is your most studied subject.
              </Typography>
            </div>
          )}
          {weekSeconds > 0 && (
            <div className="insight-item">
              <span>⚡</span>
              <Typography variant="body">
                You've studied {formatMinutes(weekSeconds)} this week. Consistent effort!
              </Typography>
            </div>
          )}
          {recentSessions.length === 0 && (
            <div className="insight-item">
              <span>🎯</span>
              <Typography variant="body">Start your first session to build momentum!</Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
