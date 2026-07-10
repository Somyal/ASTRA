import React from 'react';
import { useUIStore } from '../store/ui.store';
import { useStudyStore } from '../store/study.store';
import { Sidebar } from './Sidebar';
import { PresenceBar } from './PresenceBar';
import { DashboardEnvironment } from '../environments/DashboardEnvironment';
import { FocusModeEnvironment } from '../environments/FocusModeEnvironment';
import { AnalyticsDashboard } from '../environments/AnalyticsDashboard';
import { SettingsEnvironment } from '../environments/SettingsEnvironment';
import { DesignSystemPlayground } from '../environments/DesignSystemPlayground';
import { RecoveryEnvironment } from '../environments/RecoveryEnvironment';
import { SessionCompleteEnvironment } from '../environments/SessionCompleteEnvironment';
import './AppShell.css';

export const AppShell: React.FC = () => {
  const { activeTab } = useUIStore();
  const { status } = useStudyStore();

  const renderActiveEnvironment = () => {
    // Check state machine status
    if (status === 'running' || status === 'paused') {
      return <FocusModeEnvironment />;
    }
    if (status === 'reflection' || status === 'completed' || status === 'abandoned') {
      return <SessionCompleteEnvironment />;
    }

    // Default route-based environments
    switch (activeTab) {
      case 'dashboard':
        return <DashboardEnvironment />;
      case 'focus':
        return <DashboardEnvironment />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'settings':
        return <SettingsEnvironment />;
      case 'playground':
        return <DesignSystemPlayground />;
      case 'recovery':
        return <RecoveryEnvironment />;
      default:
        return <DashboardEnvironment />;
    }
  };

  const isFocusActive = status === 'running' || status === 'paused';

  return (
    <div className={`app-shell-container ${isFocusActive ? 'focus-active' : ''}`}>
      <div className="app-shell-main-grid">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Viewport content */}
        <main className="app-shell-viewport">{renderActiveEnvironment()}</main>
      </div>

      {/* Bottom presence status bar */}
      <PresenceBar />
    </div>
  );
};
export { RecoveryEnvironment }; // just in case it is imported elsewhere
