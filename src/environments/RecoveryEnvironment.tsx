import React from 'react';
import { useUIStore } from '../store/ui.store';
import { sessionService } from '../services/session.service';
import { Button } from '../components/Button';
import { Typography } from '../components/Typography';

export const RecoveryEnvironment: React.FC = () => {
  const { recoveryElapsedSecs } = useUIStore();
  const breakDuration = 300; // 5 mins in seconds

  const remaining = Math.max(0, breakDuration - recoveryElapsedSecs);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleSkipBreak = () => {
    sessionService.endRecovery();
  };

  return (
    <div className="environment-container fade-in" style={{ background: 'radial-gradient(circle, hsla(150, 65%, 42%, 0.08) 0%, var(--bg-base) 100%)' }}>
      
      {/* Soft Green Breathing Light */}
      <div style={{
        position: 'absolute',
        width: '450px',
        height: '450px',
        background: 'hsla(150, 65%, 42%, 0.15)',
        borderRadius: '50%',
        filter: 'blur(70px)',
        zIndex: -1,
        animation: 'recoveryGlow 6s ease-in-out infinite'
      }} />

      <style>{`
        @keyframes recoveryGlow {
          0% { transform: scale(0.95); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 0.9; }
          100% { transform: scale(0.95); opacity: 0.6; }
        }
      `}</style>

      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <Typography variant="caption" color="accent" style={{ color: 'var(--accent-success)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          Recovery Phase
        </Typography>
        <Typography variant="display" style={{ fontFamily: 'var(--font-serif)', marginTop: '1rem', fontSize: '2.5rem' }}>
          Take a deep breath.
        </Typography>
        <Typography variant="body" color="secondary" style={{ marginTop: '0.5rem', marginBottom: '3rem' }}>
          Rest your eyes. Stand up, stretch, or drink some water. Astra will wait.
        </Typography>

        {/* Break timer */}
        <div style={{
          fontSize: '6rem',
          fontWeight: 300,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '3rem'
        }}>
          {formattedTime}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button variant="secondary" onClick={handleSkipBreak}>
            Skip Break & Return
          </Button>
        </div>
      </div>
    </div>
  );
};
