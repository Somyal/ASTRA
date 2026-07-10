import React, { useState } from 'react';
import { useStudyStore } from '../store/study.store';
import { sessionService } from '../services/session.service';
import { Button } from '../components/Button';
import { Typography } from '../components/Typography';
import { Smile, AlertCircle, Frown, Zap } from 'lucide-react';

type MoodType = 'focused' | 'distracted' | 'tired' | 'energized' | null;

export const SessionCompleteEnvironment: React.FC = () => {
  const { secondsElapsed, activeSession } = useStudyStore();
  const [reflection, setReflection] = useState('');
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState<MoodType>(null);

  const durationMins = Math.round(secondsElapsed / 60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass reflection text and mood to service
    const reflectionText = [reflection, notes && `\nNotes: ${notes}`].filter(Boolean).join('');
    sessionService.completeReflection(reflectionText, mood);
  };

  const handleSkip = () => {
    sessionService.completeReflection('');
  };

  const moodOptions: { type: MoodType; icon: React.ReactNode; label: string; color: string }[] = [
    { type: 'focused', icon: <Smile size={20} />, label: 'Focused', color: '#4A90E2' },
    { type: 'energized', icon: <Zap size={20} />, label: 'Energized', color: '#FFA500' },
    { type: 'distracted', icon: <AlertCircle size={20} />, label: 'Distracted', color: '#FF6B6B' },
    { type: 'tired', icon: <Frown size={20} />, label: 'Tired', color: '#999' },
  ];

  return (
    <div className="environment-container fade-in">
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '550px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Typography variant="title" color="accent" style={{ color: 'var(--accent-success)' }}>
            Session Complete! 🎉
          </Typography>
          <Typography variant="body" color="secondary" style={{ marginTop: '0.25rem' }}>
            Well done. You focused on {activeSession?.subject || 'Studies'}{' '}
            {activeSession?.topic ? `(${activeSession.topic})` : ''}.
          </Typography>
        </div>

        {/* Stats cards */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            margin: '2rem 0',
            background: 'rgba(0,0,0,0.15)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--surface-border)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Typography variant="caption" color="muted">
              DURATION
            </Typography>
            <Typography variant="title" color="primary">
              {durationMins}m
            </Typography>
          </div>
        </div>

        {/* Mood Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Typography
            variant="caption"
            color="muted"
            style={{ display: 'block', marginBottom: '0.75rem' }}
          >
            How did you feel?
          </Typography>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            {moodOptions.map(option => (
              <button
                key={option.type}
                onClick={() => setMood(mood === option.type ? null : option.type)}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid',
                  borderColor: mood === option.type ? option.color : 'var(--surface-border)',
                  background: mood === option.type ? `${option.color}15` : 'transparent',
                  color: mood === option.type ? option.color : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  flex: 1,
                }}
                title={option.label}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reflection Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div>
            <label
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              What did you learn? (optional)
            </label>
            <textarea
              placeholder="e.g. Thermodynamics formulas finally make sense!"
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                background: 'var(--bg-base)',
                border: '1px solid var(--surface-border)',
                color: 'var(--text-primary)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
                resize: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Quick notes for next time (optional)
            </label>
            <textarea
              placeholder="e.g. Need to review Chapter 5, practice more problems"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                background: 'var(--bg-base)',
                border: '1px solid var(--surface-border)',
                color: 'var(--text-primary)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                outline: 'none',
                resize: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="ghost" type="button" onClick={handleSkip} style={{ flex: 1 }}>
              Skip
            </Button>
            <Button variant="primary" type="submit" style={{ flex: 1.5 }}>
              Complete Session
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
