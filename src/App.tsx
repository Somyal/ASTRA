import React, { useEffect } from 'react';
import { ThemeProvider } from './providers/ThemeProvider';
import { AppConfigProvider } from './providers/AppConfigProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppShell } from './ui/AppShell';
import { useUIStore } from './store/ui.store';
import { bootService } from './services/boot.service';
import { Typography } from './components/Typography';
import { Button } from './components/Button';
import './App.css';

const BootLoader: React.FC = () => {
  const { bootState, bootError } = useUIStore();

  useEffect(() => {
    bootService.boot();
  }, []);

  if (bootState === 'ready') {
    return <AppShell />;
  }

  const getLoadingMessage = () => {
    switch (bootState) {
      case 'booting':
        return 'Initializing core modules...';
      case 'migrating':
        return 'Running secure database migrations...';
      case 'hydrating':
        return 'Hydrating workspace state...';
      default:
        return 'Entering focus sanctuary...';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: 'var(--bg-base)',
        color: 'var(--text-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient Breathing Background */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'var(--accent-glow)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'breathing 8s ease-in-out infinite',
          opacity: 0.6,
          zIndex: 0,
        }}
      />
      <style>{`
        @keyframes breathing {
          0% { transform: scale(0.9); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.75; }
          100% { transform: scale(0.9); opacity: 0.4; }
        }
      `}</style>

      <div
        style={{
          zIndex: 1,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          maxWidth: '400px',
          padding: 'var(--space-6)',
        }}
      >
        {bootState === 'error' ? (
          <>
            <Typography variant="heading" style={{ color: 'var(--accent-danger)' }}>
              Sanctuary Failure
            </Typography>
            <Typography variant="body" color="secondary">
              Astra encountered a fatal startup error:
            </Typography>
            <div
              style={{
                background: 'rgba(0,0,0,0.2)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--surface-border)',
                fontFamily: 'monospace',
                fontSize: '12px',
                textAlign: 'left',
                wordBreak: 'break-all',
              }}
            >
              {bootError}
            </div>
            <Button
              variant="primary"
              onClick={() => bootService.boot()}
              style={{ marginTop: 'var(--space-2)' }}
            >
              Retry Boot
            </Button>
          </>
        ) : (
          <>
            <Typography
              variant="title"
              color="accent"
              style={{ fontWeight: 'var(--font-weight-bold)', letterSpacing: '0.15em' }}
            >
              ASTRA
            </Typography>
            <Typography variant="caption" color="muted">
              {getLoadingMessage()}
            </Typography>
          </>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppConfigProvider>
          <BootLoader />
        </AppConfigProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
