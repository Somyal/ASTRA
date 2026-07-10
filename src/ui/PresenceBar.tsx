import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock } from 'lucide-react';
import { useAppConfig } from '../providers/AppConfigProvider';
import { useTheme } from '../hooks/useTheme';

export const PresenceBar: React.FC = () => {
  const config = useAppConfig();
  const { theme } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <footer className="app-presence-bar">
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <ShieldCheck size={14} style={{ color: 'var(--accent-success)' }} />
        <span>Astra Secure • {config.version}</span>
      </div>

      {/* Middle Section - Live Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Clock size={14} />
        <span>{formattedDate} {formattedTime}</span>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <span style={{ textTransform: 'capitalize' }}>Theme: {theme}</span>
      </div>
    </footer>
  );
};
