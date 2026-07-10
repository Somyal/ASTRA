import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../store/settings.store';
import { useMemoryStore } from '../store/memory.store';
import { useTheme } from '../hooks/useTheme';
import { backupService, BackupPreviewSummary } from '../services/backup.service';
import { Button } from '../components/Button';
import { Typography } from '../components/Typography';
import { Slider } from '../components/Slider';
import { Dropdown } from '../components/Dropdown';
import { Divider } from '../components/Divider';
import { ScrollArea } from '../components/ScrollArea';
import { Sun, Moon, Volume2, Settings, User, Eye, Brain, Database, AlertCircle } from 'lucide-react';

export const SettingsEnvironment: React.FC = () => {
  const {
    identity: { userName, examinationGoal },
    preferences: { soundVolume, soundscape, recoveryEnabled },
    setUserName,
    setExaminationGoal,
    setSoundVolume,
    setSoundscape,
    setRecoveryEnabled,
  } = useSettingsStore();

  const { theme, toggleTheme } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'audio' | 'appearance' | 'memory'>('profile');
  const [tempName, setTempName] = useState(userName);
  const [tempGoal, setTempGoal] = useState(examinationGoal);

  // Memory Sanctuary states
  const { memories, loadMemories, deleteMemory, markMemoryIncorrect } = useMemoryStore();

  // Backup & Restore states
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showRestorePreview, setShowRestorePreview] = useState(false);
  const [previewSummary, setPreviewSummary] = useState<BackupPreviewSummary | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  useEffect(() => {
    if (activeSubTab === 'memory') {
      loadMemories();
    }
  }, [activeSubTab, loadMemories]);

  const soundscapes = [
    { label: 'Rain Forest', value: 'rain' },
    { label: 'Library Café', value: 'cafe' },
    { label: 'Ocean Waves', value: 'ocean' },
    { label: 'White Noise', value: 'white-noise' },
  ];

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
    }
  };

  const handleSaveGoal = () => {
    if (tempGoal.trim()) {
      setExaminationGoal(tempGoal.trim());
    }
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      await backupService.backupNow();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Backup failed.');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      try {
        setRestoreError(null);
        const summary = await backupService.restorePreview(text);
        setPreviewSummary(summary);
        setShowRestorePreview(true);
      } catch (err) {
        setRestoreError(err instanceof Error ? err.message : 'Invalid backup file.');
      }
    };
    reader.readAsText(file);
    // Reset file input so same file can be selected again if needed
    e.target.value = '';
  };

  const handleConfirmRestore = async () => {
    setIsRestoring(true);
    try {
      await backupService.confirmRestore();
      setShowRestorePreview(false);
      // Hard refresh to reload SQLite data into memory/Zustand on boot
      window.location.reload();
    } catch (e) {
      setRestoreError(e instanceof Error ? e.message : 'Restore failed.');
      setIsRestoring(false);
    }
  };

  return (
    <div className="environment-container fade-in" style={{ justifyContent: 'flex-start', alignItems: 'stretch', position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', height: '100%', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Title Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Settings size={28} style={{ color: 'var(--accent-base)' }} />
          <div>
            <Typography variant="heading" style={{ margin: 0 }}>System Settings</Typography>
            <Typography variant="caption" color="muted">Configure your local study environment preferences</Typography>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 'var(--space-6)', flex: 1, overflow: 'hidden' }}>
          
          {/* Sub Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Button
              variant={activeSubTab === 'profile' ? 'primary' : 'ghost'}
              onClick={() => setActiveSubTab('profile')}
              style={{ justifyContent: 'flex-start', gap: 'var(--space-2)' }}
            >
              <User size={16} />
              Profile & Goal
            </Button>
            <Button
              variant={activeSubTab === 'audio' ? 'primary' : 'ghost'}
              onClick={() => setActiveSubTab('audio')}
              style={{ justifyContent: 'flex-start', gap: 'var(--space-2)' }}
            >
              <Volume2 size={16} />
              Acoustic Mixer
            </Button>
            <Button
              variant={activeSubTab === 'appearance' ? 'primary' : 'ghost'}
              onClick={() => setActiveSubTab('appearance')}
              style={{ justifyContent: 'flex-start', gap: 'var(--space-2)' }}
            >
              <Eye size={16} />
              Preferences
            </Button>
            <Button
              variant={activeSubTab === 'memory' ? 'primary' : 'ghost'}
              onClick={() => setActiveSubTab('memory')}
              style={{ justifyContent: 'flex-start', gap: 'var(--space-2)' }}
            >
              <Brain size={16} />
              Memory Sanctuary
            </Button>
          </div>

          {/* Content Area */}
          <div className="glass-panel" style={{ padding: 'var(--space-6)', overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <ScrollArea style={{ flex: 1 }}>
              
              {activeSubTab === 'profile' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <Typography variant="subtitle">Profile Configuration</Typography>
                  <Typography variant="body" color="secondary">Set your display name and active academic goal.</Typography>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: 'var(--font-size-label)', color: 'var(--text-secondary)' }}>Student Name</label>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <input
                        type="text"
                        value={tempName}
                        onChange={e => setTempName(e.target.value)}
                        style={{
                          flex: 1,
                          background: 'var(--bg-base)',
                          border: '1px solid var(--surface-border)',
                          color: 'var(--text-primary)',
                          padding: 'var(--space-2) var(--space-4)',
                          borderRadius: 'var(--radius-sm)',
                          outline: 'none',
                        }}
                      />
                      <Button variant="secondary" onClick={handleSaveName}>Save</Button>
                    </div>
                  </div>

                  <Divider />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: 'var(--font-size-label)', color: 'var(--text-secondary)' }}>Active Academic Goal</label>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <input
                        type="text"
                        value={tempGoal}
                        onChange={e => setTempGoal(e.target.value)}
                        style={{
                          flex: 1,
                          background: 'var(--bg-base)',
                          border: '1px solid var(--surface-border)',
                          color: 'var(--text-primary)',
                          padding: 'var(--space-2) var(--space-4)',
                          borderRadius: 'var(--radius-sm)',
                          outline: 'none',
                        }}
                      />
                      <Button variant="secondary" onClick={handleSaveGoal}>Save Goal</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeSubTab === 'audio' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <Typography variant="subtitle">Acoustic Soundscapes</Typography>
                  <Typography variant="body" color="secondary">Configure background ambient soundscapes to mask environmental noise.</Typography>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <label style={{ fontSize: 'var(--font-size-label)', color: 'var(--text-secondary)' }}>Primary Ambient Loop</label>
                    <Dropdown
                      value={soundscape}
                      onChange={setSoundscape}
                      options={soundscapes}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label style={{ fontSize: 'var(--font-size-label)', color: 'var(--text-secondary)' }}>Master Volume</label>
                      <Typography variant="label" color="accent">{soundVolume}%</Typography>
                    </div>
                    <Slider
                      value={soundVolume}
                      onChange={setSoundVolume}
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
              )}

              {activeSubTab === 'appearance' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <Typography variant="subtitle">Visual Interface & Flow</Typography>
                  <Typography variant="body" color="secondary">Choose a workspace style and study flow options suited for you.</Typography>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-base)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
                    <div>
                      <Typography variant="body" style={{ fontWeight: 'var(--font-weight-medium)' }}>App Theme Mode</Typography>
                      <Typography variant="caption" color="muted">Toggle between dark night and light paper modes</Typography>
                    </div>
                    
                    <Button variant="secondary" onClick={toggleTheme} style={{ gap: 'var(--space-2)' }}>
                      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                      {theme === 'dark' ? 'Paper Light' : 'Night Dark'}
                    </Button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-base)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-border)' }}>
                    <div>
                      <Typography variant="body" style={{ fontWeight: 'var(--font-weight-medium)' }}>Recovery Breaks</Typography>
                      <Typography variant="caption" color="muted">Enable a 5-minute breathing break after each study session</Typography>
                    </div>
                    
                    <Button variant="secondary" onClick={() => setRecoveryEnabled(!recoveryEnabled)}>
                      {recoveryEnabled ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>

                  <Divider />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div>
                      <Typography variant="body" style={{ fontWeight: 'var(--font-weight-medium)' }}>Local-First Database Backups</Typography>
                      <Typography variant="caption" color="muted" style={{ display: 'block', marginTop: '2px' }}>
                        Manual snapshot backups are downloaded and stored entirely offline in your directory.
                      </Typography>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                      <Button variant="secondary" onClick={handleBackup} disabled={isBackingUp}>
                        <Database size={14} style={{ marginRight: '6px' }} />
                        {isBackingUp ? 'Backing up...' : 'Backup Now'}
                      </Button>
                      
                      <div style={{ position: 'relative' }}>
                        <Button variant="secondary" onClick={() => document.getElementById('restore-file-input')?.click()}>
                          Restore Backup
                        </Button>
                        <input
                          id="restore-file-input"
                          type="file"
                          accept=".json"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                      </div>
                    </div>

                    {restoreError && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--accent-danger)', fontSize: 'var(--font-size-caption)', marginTop: '4px' }}>
                        <AlertCircle size={14} />
                        {restoreError}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSubTab === 'memory' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <Typography variant="subtitle">Memory Sanctuary</Typography>
                  <Typography variant="body" color="secondary">
                    Review and prune structural observations Astra has made to shape your study assistance.
                  </Typography>

                  {/* Empty state for observations */}
                  {memories.length === 0 ? (
                    <div className="glass-panel" style={{ padding: 'var(--space-6)', textAlign: 'center', background: 'var(--bg-base)', borderStyle: 'dashed' }}>
                      <Brain size={36} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-3)', opacity: 0.5 }} />
                      <Typography variant="body" style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-secondary)' }}>
                        No memories have been created yet.
                      </Typography>
                      <Typography variant="caption" color="muted" style={{ display: 'block', marginTop: 'var(--space-1)' }}>
                        Observations will appear here as you log focus sessions.
                      </Typography>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                      {memories.map((m) => (
                        <div key={m.id} className="glass-panel" style={{ padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                          <div>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', alignItems: 'center' }}>
                              <Typography variant="caption" style={{ textTransform: 'uppercase', background: 'var(--bg-base)', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold' }}>
                                {m.category.replace('_', ' ')}
                              </Typography>
                              <Typography variant="caption" style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>
                                {m.tier.replace('_', ' ')} tier
                              </Typography>
                              {m.isIncorrect && (
                                <Typography variant="caption" style={{ fontSize: '9px', color: 'var(--accent-danger)', fontWeight: 'bold' }}>
                                  [Marked Incorrect]
                                </Typography>
                              )}
                            </div>
                            <Typography variant="body" style={{ fontSize: '13px' }}>{m.content}</Typography>
                            {m.evidence && (
                              <Typography variant="caption" color="muted" style={{ display: 'block', marginTop: '6px', fontStyle: 'italic' }}>
                                Evidence: {m.evidence}
                              </Typography>
                            )}
                          </div>
                          
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {!m.isIncorrect && (
                              <Button variant="ghost" onClick={() => markMemoryIncorrect(m.id)} style={{ padding: '2px 8px', fontSize: '10px', minHeight: 'auto' }}>
                                Incorrect
                              </Button>
                            )}
                            <Button variant="ghost" onClick={() => deleteMemory(m.id)} style={{ padding: '2px 8px', fontSize: '10px', color: 'var(--accent-danger)', minHeight: 'auto' }}>
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Divider />

                  {/* Adaptation Ledger section (Honest placeholder) */}
                  <div>
                    <Typography variant="subtitle">Astra System Adaptations</Typography>
                    <Typography variant="body" color="secondary" style={{ marginBottom: 'var(--space-3)' }}>
                      Audit log of automated rhythm adjustments and workspace aids.
                    </Typography>

                    <div className="glass-panel" style={{ padding: 'var(--space-4)', background: 'var(--bg-base)', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <Typography variant="body" style={{ fontWeight: 'var(--font-weight-medium)' }}>Audit Trail</Typography>
                        <span style={{ fontSize: '10px', background: 'hsla(30, 80%, 50%, 0.15)', color: 'var(--accent-base)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                          Coming Soon
                        </span>
                      </div>
                      <Typography variant="caption" color="muted">
                        Adaptations remain inactive during base calibration.
                      </Typography>
                    </div>
                  </div>

                </div>
              )}

            </ScrollArea>
          </div>

        </div>

      </div>

      {/* Manual Restore Confirmation Modal */}
      {showRestorePreview && previewSummary && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: 'var(--space-4)'
        }}>
          <div className="glass-panel fade-in" style={{
            background: 'var(--bg-base)',
            border: '1px solid var(--surface-border)',
            padding: 'var(--space-6)',
            maxWidth: '480px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
            <Typography variant="subtitle" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Database size={20} style={{ color: 'var(--accent-base)' }} />
              Preview Restore Snapshot
            </Typography>
            <Typography variant="body" color="secondary" style={{ fontSize: '13px' }}>
              Verify details before overwriting current application database tables.
            </Typography>

            {/* Summary statistics grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-2)',
              background: 'rgba(255,255,255,0.02)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--surface-border)',
              fontSize: '13px'
            }}>
              <div>
                <Typography variant="caption" color="muted">Backup Date</Typography>
                <div style={{ fontWeight: 'bold', marginTop: '2px' }}>{previewSummary.createdAt}</div>
              </div>
              <div>
                <Typography variant="caption" color="muted">App Version</Typography>
                <div style={{ fontWeight: 'bold', marginTop: '2px' }}>v{previewSummary.astraVersion}</div>
              </div>
              <div style={{ gridColumn: 'span 2', margin: '8px 0' }}><Divider /></div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Completed Sessions:</span>
              </div>
              <div style={{ textAlign: 'right', fontWeight: 'bold' }}>{previewSummary.sessionsCount}</div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Checklist Tasks:</span>
              </div>
              <div style={{ textAlign: 'right', fontWeight: 'bold' }}>{previewSummary.tasksCount}</div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Settings & Configs:</span>
              </div>
              <div style={{ textAlign: 'right', fontWeight: 'bold' }}>{previewSummary.settingsCount} fields</div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Intentional Memories:</span>
              </div>
              <div style={{ textAlign: 'right', fontWeight: 'bold' }}>{previewSummary.memoriesCount}</div>
            </div>

            <div style={{
              display: 'flex',
              gap: 'var(--space-2)',
              background: 'hsla(0, 80%, 50%, 0.05)',
              border: '1px solid hsla(0, 80%, 50%, 0.15)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-danger)',
              fontSize: '11px',
              lineHeight: '1.4'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>
                <strong>Warning:</strong> Restoring will permanently replace all current study history, goal setups, configurations, and memory metrics. This action cannot be undone.
              </span>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
              <Button variant="ghost" onClick={() => setShowRestorePreview(false)} disabled={isRestoring}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmRestore} disabled={isRestoring} style={{ background: 'var(--accent-danger)', color: '#fff' }}>
                {isRestoring ? 'Restoring...' : 'Confirm Overwrite & Restore'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
