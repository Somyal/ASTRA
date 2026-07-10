import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { TextArea } from '../components/TextArea';
import { Checkbox } from '../components/Checkbox';
import { Switch } from '../components/Switch';
import { Slider } from '../components/Slider';
import { Badge } from '../components/Badge';
import { Chip } from '../components/Chip';
import { Divider } from '../components/Divider';
import { Modal } from '../components/Modal';
import { Tooltip } from '../components/Tooltip';
import { Dropdown } from '../components/Dropdown';
import { ProgressBar } from '../components/ProgressBar';
import { ScrollArea } from '../components/ScrollArea';
import { Sun, Moon, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

export const DesignSystemPlayground: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // Component States
  const [sliderVal, setSliderVal] = useState(65);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [dropdownVal, setDropdownVal] = useState('focus');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [chips, setChips] = useState(['Calm Design', 'Local-First', 'Tokio Engine', 'Vanilla CSS']);

  const dropdownOptions = [
    { label: 'Focus Session', value: 'focus' },
    { label: 'Short Break', value: 'short' },
    { label: 'Long Break', value: 'long' },
  ];

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-base)',
      color: 'var(--text-primary)',
      overflow: 'hidden',
    }}>
      {/* Top Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-4) var(--space-8)',
        borderBottom: '1px solid var(--surface-border)',
        background: 'var(--surface-base)',
        backdropFilter: 'blur(var(--blur-md))',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Sparkles size={20} style={{ color: 'var(--accent-base)' }} />
          <Typography variant="title" style={{ margin: 0, fontWeight: 'var(--font-weight-bold)' }}>
            Astra Design System
          </Typography>
          <Badge variant="primary">v1.1-alpha</Badge>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <Typography variant="caption" color="muted">
            Theme Mode: <span style={{ textTransform: 'capitalize', color: 'var(--accent-base)', fontWeight: 'var(--font-weight-medium)' }}>{theme}</span>
          </Typography>
          <IconButton
            ariaLabel="Toggle Theme Mode"
            variant="secondary"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </IconButton>
        </div>
      </header>

      {/* Main Workspace split */}
      <main style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        overflow: 'hidden',
      }}>
        {/* Navigation Sidebar */}
        <aside style={{
          borderRight: '1px solid var(--surface-border)',
          background: 'var(--surface-base)',
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)',
        }}>
          <div>
            <Typography variant="label" color="muted">Philosophy</Typography>
            <Typography variant="body" color="secondary" style={{ fontSize: '0.9rem', marginTop: 'var(--space-2)' }}>
              100% tokenized architecture. Pure CSS visual state rules. Generic reusable abstractions.
            </Typography>
          </div>
          <Divider />
          <div>
            <Typography variant="label" color="muted">Active Rules</Typography>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginTop: 'var(--space-2)',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)'
            }}>
              <li style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <ShieldCheck size={14} style={{ color: 'var(--accent-success)', flexShrink: 0 }} />
                <span>Zero hardcoded styles</span>
              </li>
              <li style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <ShieldCheck size={14} style={{ color: 'var(--accent-success)', flexShrink: 0 }} />
                <span>Focus visibility rings</span>
              </li>
              <li style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <ShieldCheck size={14} style={{ color: 'var(--accent-success)', flexShrink: 0 }} />
                <span>Aria standard tags</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Components Playground Scroll View */}
        <ScrollArea maxHeight="100%" className="playground-content" style={{ padding: 'var(--space-8)' }}>
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-8)',
            paddingBottom: 'var(--space-12)'
          }}>

            {/* Typography Scale */}
            <Card variant="glass">
              <Typography variant="subtitle" color="accent" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                01. Typography Scale
              </Typography>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                <div>
                  <Typography variant="caption" color="muted">Display</Typography>
                  <Typography variant="display">Playfair Display Serif</Typography>
                </div>
                <div>
                  <Typography variant="caption" color="muted">Heading</Typography>
                  <Typography variant="heading">Outfit Sans Heading</Typography>
                </div>
                <div>
                  <Typography variant="caption" color="muted">Title</Typography>
                  <Typography variant="title">Sub-title styling font</Typography>
                </div>
                <div>
                  <Typography variant="caption" color="muted">Body</Typography>
                  <Typography variant="body">
                    Astra is designed around calm aesthetics, removing visual distractions and cognitive loads.
                  </Typography>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
                  <div>
                    <Typography variant="caption" color="muted">Label</Typography>
                    <div><Typography variant="label">System Input Field Label</Typography></div>
                  </div>
                  <div>
                    <Typography variant="caption" color="muted">Caption</Typography>
                    <div><Typography variant="caption">Metadata time indicators</Typography></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Interactive Actions */}
            <Card variant="glass">
              <Typography variant="subtitle" color="accent" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                02. Actions (Buttons)
              </Typography>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Danger Button</Button>
                <Button variant="primary" loading>Loading Button</Button>
                <Button variant="primary" disabled>Disabled Button</Button>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                <IconButton variant="primary" ariaLabel="Search icon"><Sparkles size={16} /></IconButton>
                <IconButton variant="secondary" ariaLabel="Info icon"><AlertTriangle size={16} /></IconButton>
                <IconButton variant="ghost" ariaLabel="Settings icon"><Sun size={16} /></IconButton>
                <IconButton variant="secondary" disabled ariaLabel="Disabled icon"><Moon size={16} /></IconButton>
              </div>
            </Card>

            {/* Inputs Section */}
            <Card variant="glass">
              <Typography variant="subtitle" color="accent" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                03. Input & Forms
              </Typography>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <Input
                    label="Username"
                    placeholder="Enter username..."
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                  />
                  <Input
                    label="Email Address (Error State)"
                    placeholder="invalid-email"
                    error="Please specify a valid email address."
                    value="invalid-email"
                    readOnly
                  />
                </div>
                <div>
                  <TextArea
                    label="Session Reflection Notes"
                    placeholder="Reflect on your study progress..."
                    rows={4}
                  />
                </div>
              </div>
            </Card>

            {/* Selection Controls */}
            <Card variant="glass">
              <Typography variant="subtitle" color="accent" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                04. Selection Primitives
              </Typography>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <Checkbox
                    label="Mute all soundscape loops"
                    checked={checkboxChecked}
                    onChange={e => setCheckboxChecked(e.target.checked)}
                  />
                  <Checkbox
                    label="Disabled check state"
                    checked={true}
                    disabled
                  />
                  <Switch
                    label="Sanctuary fullscreen mode"
                    checked={switchChecked}
                    onChange={setSwitchChecked}
                  />
                  <Switch
                    label="Disabled switch button"
                    checked={false}
                    disabled
                    onChange={() => {}}
                  />
                </div>
                <div>
                  <Slider
                    label="Ambient Soundscape Volume"
                    min={0}
                    max={100}
                    value={sliderVal}
                    onChange={setSliderVal}
                  />
                  <Slider
                    label="Disabled volume slider"
                    min={0}
                    max={100}
                    value={25}
                    disabled
                    onChange={() => {}}
                  />
                </div>
              </div>
            </Card>

            {/* Overlays & Popups */}
            <Card variant="glass">
              <Typography variant="subtitle" color="accent" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                05. Overlays, Popups & Badges
              </Typography>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-4)', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <Dropdown
                    label="Dropdown Select List"
                    options={dropdownOptions}
                    value={dropdownVal}
                    onChange={setDropdownVal}
                  />
                  
                  {/* Tooltip trigger */}
                  <div style={{ marginTop: 'var(--space-2)' }}>
                    <Typography variant="label" color="muted" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                      Hover/Focus Tooltip Trigger
                    </Typography>
                    <Tooltip text="Saves current work to SQLite Brain database">
                      <Button variant="secondary">Hover Over Me</Button>
                    </Tooltip>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div>
                    <Typography variant="label" color="muted" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                      Status Badges
                    </Typography>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <Badge variant="primary">Stable</Badge>
                      <Badge variant="success">Completed</Badge>
                      <Badge variant="warning">Reflecting</Badge>
                      <Badge variant="danger">Paused</Badge>
                    </div>
                  </div>

                  <div>
                    <Typography variant="label" color="muted" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                      Dismissible Chips
                    </Typography>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      {chips.map(chip => (
                        <Chip
                          key={chip}
                          label={chip}
                          onClose={() => setChips(prev => prev.filter(c => c !== chip))}
                        />
                      ))}
                      {chips.length === 0 && (
                        <Typography variant="caption" color="muted">
                          All chips removed.
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal trigger */}
              <Divider />
              <div style={{ marginTop: 'var(--space-4)' }}>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  Open Modal Dialog
                </Button>
                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  title="Configure Local Core"
                >
                  <Typography variant="body" color="secondary" style={{ marginBottom: 'var(--space-4)' }}>
                    Astra is designed for complete local privacy. Your database is written in SQLite format on your system disk. No telemetry is collected.
                  </Typography>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button variant="primary" onClick={() => setIsModalOpen(false)}>Confirm</Button>
                  </div>
                </Modal>
              </div>
            </Card>

            {/* Performance/Progress Indicator */}
            <Card variant="glass">
              <Typography variant="subtitle" color="accent" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                06. Progress & Visual Indicators
              </Typography>
              <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <ProgressBar
                  label="Daily Focus Progress Goal"
                  value={sliderVal}
                />
              </div>
            </Card>

          </div>
        </ScrollArea>
      </main>
    </div>
  );
};
export default DesignSystemPlayground;
