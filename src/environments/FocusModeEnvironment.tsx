import React, { useEffect, useState } from 'react';
import { useStudyStore } from '../store/study.store';
import { sessionService } from '../services/session.service';
import { windowService } from '../services/window.service';
import { Button } from '../components/Button';
import { Typography } from '../components/Typography';
import { IconButton } from '../components/IconButton';

export const FocusModeEnvironment: React.FC = () => {
  const { secondsElapsed, activeSession, status } = useStudyStore();
  const [isMiniMode, setIsMiniMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const targetSecs = activeSession?.plannedDuration || 1500;
  const isPaused = status === 'paused';

  // Clean up window properties when session finishes/unmounts
  useEffect(() => {
    return () => {
      // Ensure we restore window defaults if the user exits focus
      windowService.exitFullscreen().catch(console.error);
      windowService.exitMiniTimer().catch(console.error);
    };
  }, []);

  // If timer finishes, transition to complete
  useEffect(() => {
    if (secondsElapsed >= targetSecs) {
      sessionService.completeSession();
    }
  }, [secondsElapsed, targetSecs]);

  const remaining = Math.max(0, targetSecs - secondsElapsed);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handlePauseToggle = () => {
    if (isPaused) {
      sessionService.resumeSession();
    } else {
      sessionService.pauseSession();
    }
  };

  const handleEndSession = () => {
    sessionService.completeSession();
  };

  const handleToggleFullscreen = async () => {
    await windowService.toggleFullscreen();
    setIsFullscreen(prev => !prev);
  };

  const handleToggleMiniTimer = async () => {
    if (isMiniMode) {
      await windowService.exitMiniTimer();
      setIsMiniMode(false);
    } else {
      // Ensure we exit fullscreen before going mini
      if (isFullscreen) {
        await windowService.exitFullscreen();
        setIsFullscreen(false);
      }
      await windowService.enterMiniTimer();
      setIsMiniMode(true);
    }
  };

  if (isMiniMode) {
    return (
      <div 
        className="fade-in" 
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100vh',
          width: '100vw',
          padding: 'var(--space-4)',
          background: 'var(--bg-gradient)',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Header: Subject & Topic */}
        <div style={{ textAlign: 'center', width: '100%', marginTop: 'var(--space-1)' }}>
          <Typography 
            variant="caption" 
            color="accent" 
            style={{ 
              fontSize: '11px', 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              letterSpacing: '0.12em', 
              display: 'block' 
            }}
          >
            {activeSession?.subject || 'Focus Sanctuary'}
          </Typography>
          {activeSession?.topic && (
            <Typography 
              variant="caption" 
              color="secondary" 
              style={{ 
                fontSize: '11px', 
                fontStyle: 'italic', 
                display: 'block', 
                marginTop: '2px', 
                textOverflow: 'ellipsis', 
                overflow: 'hidden', 
                whiteSpace: 'nowrap', 
                maxWidth: '260px' 
              }}
            >
              {activeSession.topic}
            </Typography>
          )}
        </div>

        {/* Center: Large legibly spaced countdown */}
        <div 
          style={{
            fontSize: '3.6rem',
            fontWeight: 300,
            color: 'var(--text-primary)',
            lineHeight: 1,
            fontFamily: 'var(--font-sans)',
            letterSpacing: '-0.02em',
            margin: 'var(--space-2) 0',
          }}
        >
          {formattedTime}
        </div>

        {/* Bottom: Elegant Circle Control Buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
          <IconButton 
            variant={isPaused ? 'primary' : 'secondary'} 
            onClick={handlePauseToggle} 
            ariaLabel={isPaused ? 'Resume' : 'Pause'}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? '▶' : '⏸'}
          </IconButton>
          <IconButton 
            variant="secondary" 
            onClick={handleEndSession} 
            ariaLabel="End Session"
            title="End Session"
            style={{ color: 'var(--accent-danger)' }}
          >
            ■
          </IconButton>
          <IconButton 
            variant="secondary" 
            onClick={handleToggleMiniTimer} 
            ariaLabel="Exit Mini Mode"
            title="Exit Mini Mode"
          >
            ⛶
          </IconButton>
        </div>
      </div>
    );
  }

  return (
    <div className="environment-container fade-in" style={{ justifyContent: 'center' }}>
      
      {/* Ambient Breathing Background Element */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'var(--accent-glow)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        zIndex: -1,
        animation: isPaused ? 'none' : 'breathing 8s ease-in-out infinite',
        opacity: 0.8
      }} />

      {/* Styled breathing animation */}
      <style>{`
        @keyframes breathing {
          0% { transform: scale(0.9); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.85; }
          100% { transform: scale(0.9); opacity: 0.5; }
        }
      `}</style>

      {/* Main Focus Content */}
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <Typography variant="caption" color="accent" style={{ textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          Focusing on {activeSession?.subject || 'Studies'}
        </Typography>
        {activeSession?.topic && (
          <Typography variant="subtitle" color="secondary" style={{ marginTop: '0.25rem', fontStyle: 'italic' }}>
            {activeSession.topic}
          </Typography>
        )}

        {/* Large Timer Display */}
        <div style={{
          fontSize: '9rem',
          fontWeight: 300,
          fontFamily: 'var(--font-sans)',
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          margin: '2rem 0',
          lineHeight: 1
        }}>
          {formattedTime}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Button variant={isPaused ? 'primary' : 'secondary'} onClick={handlePauseToggle}>
            {isPaused ? 'Resume Session' : 'Pause'}
          </Button>
          <Button variant="ghost" onClick={handleEndSession} style={{ color: 'var(--accent-danger)' }}>
            End Session
          </Button>
        </div>

        {/* Window controls panel */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', opacity: 0.7 }}>
          <Button variant="ghost" onClick={handleToggleFullscreen} style={{ fontSize: '12px' }}>
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Sanctuary'}
          </Button>
          <Button variant="ghost" onClick={handleToggleMiniTimer} style={{ fontSize: '12px' }}>
            Mini-Timer Mode
          </Button>
        </div>
      </div>
    </div>
  );
};
