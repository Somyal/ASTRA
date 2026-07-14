import React from 'react';
import {
  Home,
  Timer,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUIStore } from '../store/ui.store';
import { Typography } from '../components/Typography';
import { IconButton } from '../components/IconButton';
import { featureFlags } from '../config/featureFlags';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, isSidebarExpanded, toggleSidebar } = useUIStore();

  const baseItems = [
    { id: 'dashboard', label: 'Dashboard Home', icon: <Home size={20} /> },
    { id: 'focus', label: 'Focus Sanctuary', icon: <Timer size={20} /> },
    { id: 'analytics', label: 'Analytics & Progress', icon: <BarChart3 size={20} /> },
    { id: 'settings', label: 'Workspace Settings', icon: <Settings size={20} /> },
  ] as const;

  const navItems = featureFlags.developerSurfaces
    ? ([
        ...baseItems,
        { id: 'playground', label: 'Components Playground', icon: <Sparkles size={20} /> },
      ] as const)
    : baseItems;

  return (
    <aside className={`app-sidebar ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Header / Logo */}
      <div className="sidebar-header">
        {isSidebarExpanded ? (
          <div className="sidebar-brand fade-in">
            <Typography
              variant="title"
              style={{
                margin: 0,
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--accent-base)',
              }}
            >
              ASTRA
            </Typography>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Typography
              variant="label"
              style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--accent-base)' }}
            >
              A
            </Typography>
          </div>
        )}
      </div>

      {/* Nav List */}
      <ul className="sidebar-nav-list">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <li key={item.id} className="sidebar-nav-item">
              <button
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isSidebarExpanded ? 'var(--space-3)' : '0',
                  justifyContent: isSidebarExpanded ? 'flex-start' : 'center',
                  width: '100%',
                  height: '48px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: isActive ? 'var(--surface-active)' : 'transparent',
                  color: isActive ? 'var(--accent-base)' : 'var(--text-secondary)',
                  padding: isSidebarExpanded ? '0 var(--space-4)' : '0',
                  cursor: 'pointer',
                  transition: 'var(--transition-quick)',
                }}
              >
                {item.icon}
                {isSidebarExpanded && (
                  <Typography
                    variant="body"
                    style={{
                      margin: 0,
                      fontWeight: isActive
                        ? 'var(--font-weight-medium)'
                        : 'var(--font-weight-regular)',
                    }}
                  >
                    {item.label}
                  </Typography>
                )}
              </button>

              {/* Collapsed Hover Tooltip */}
              {!isSidebarExpanded && <div className="sidebar-tooltip-content">{item.label}</div>}
            </li>
          );
        })}
      </ul>

      {/* Footer Collapse Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: isSidebarExpanded ? 'flex-end' : 'center',
          padding: '0 var(--space-4) var(--space-2)',
        }}
      >
        <IconButton
          ariaLabel={isSidebarExpanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
          onClick={toggleSidebar}
          variant="ghost"
        >
          {isSidebarExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </IconButton>
      </div>
    </aside>
  );
};
