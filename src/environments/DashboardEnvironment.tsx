import React, { useState, useEffect } from 'react';
import { useStudyStore } from '../store/study.store';
import { useContentStore } from '../store/content.store';
import { useTasksStore } from '../store/tasks.store';
import { useSettingsStore } from '../store/settings.store';
import { useLearningStore } from '../store/learning.store';
import { learningService } from '../services/learning.service';
import { featureFlags } from '../config/featureFlags';
import { sessionService } from '../services/session.service';
import { taskService } from '../services/task.service';
import { syllabusService } from '../services/syllabus.service';
import { academicEventBus } from '../events/academic_event';
import { Button } from '../components/Button';
import { Typography } from '../components/Typography';
import { Divider } from '../components/Divider';
import { ScrollArea } from '../components/ScrollArea';
import {
  Flame,
  Brain,
  BookOpen,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Lock,
  CheckCircle,
  Circle,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { repositoryFactory } from '../repositories/index';
import './DashboardEnvironment.css';

export const DashboardEnvironment: React.FC = () => {
  const { currentStreak, recoveredSession, clearRecoveredSession } = useStudyStore();
  const {
    identity: { userName },
  } = useSettingsStore();
  const { subjects, syllabusTree } = useContentStore();
  const { tasks } = useTasksStore();

  const [duration, setDuration] = useState(3000); // 50 mins in seconds

  // Local Accordion States
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  /**
   * Handles reloading syllabus and subjects from the database
   * Properly memoized to prevent stale closures
   */
  const handleReload = React.useCallback(async () => {
    try {
      const tree = await syllabusService.getSyllabusTree();
      const dbSubjects = await repositoryFactory.getContentRepository().getSubjects();
      useContentStore.getState().setSubjects(dbSubjects);
      useContentStore.getState().setSyllabusTree(tree);
      return dbSubjects;
    } catch (error) {
      console.error('[DashboardEnvironment] Failed to reload data:', error);
      return null;
    }
  }, []);

  /**
   * Subscribe to academic events and load initial data
   * Properly cleanup subscription on unmount
   */
  useEffect(() => {
    // Create subscription to academic events
    const unsubscribe = academicEventBus.subscribe(async event => {
      console.log(`[DashboardEnvironment] Refreshing UI states for event:`, event.type);
      await handleReload();
    });

    // Initial load of data
    handleReload().then(dbSubjects => {
      // Expand first subject by default on load
      if (dbSubjects && dbSubjects.length > 0) {
        setExpandedSubjects([dbSubjects[0].id]);
      }
    });

    // Cleanup: Unsubscribe when component unmounts
    // This is critical to prevent event listener accumulation
    return () => {
      unsubscribe();
    };
  }, [handleReload]);


  const { items } = useLearningStore();

  // Local state for onboarding
  const [onboardingItemTitle, setOnboardingItemTitle] = useState('');
  const [onboardingActionWording, setOnboardingActionWording] = useState('');
  const [isOnboardingSubmitting, setIsOnboardingSubmitting] = useState(false);

  // Local state for standard selection flow
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id || 'new');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newActionWording, setNewActionWording] = useState('');

  // Sync selected item when items list loads or changes
  useEffect(() => {
    if (items.length > 0 && selectedItemId === 'new' && !newItemTitle) {
      requestAnimationFrame(() => {
        setSelectedItemId(items[0].id);
      });
    }
  }, [items, selectedItemId, newItemTitle]);

  const handleOnboardingStart = async () => {
    if (!onboardingItemTitle.trim() || !onboardingActionWording.trim()) {
      return;
    }
    setIsOnboardingSubmitting(true);
    try {
      const item = await learningService.createLearningItem(onboardingItemTitle, 'manual');
      const action = await learningService.createLearningAction(item.id, 'study', onboardingActionWording);
      const defaultDuration = useSettingsStore.getState().preferences.focusDefaultDuration || 3000;
      sessionService.configureSession(item.title, action.customWording, defaultDuration);
      await sessionService.startSession();
    } catch (e) {
      console.error('Failed to start onboarding session', e);
    } finally {
      setIsOnboardingSubmitting(false);
    }
  };

  const handleStandardStart = async () => {
    try {
      let item = items.find(i => i.id === selectedItemId);
      if (selectedItemId === 'new') {
        if (!newItemTitle.trim()) return;
        item = await learningService.createLearningItem(newItemTitle, 'manual');
      }
      if (!item) return;

      if (!newActionWording.trim()) return;
      const action = await learningService.createLearningAction(item.id, 'study', newActionWording);

      sessionService.configureSession(item.title, action.customWording, duration);
      await sessionService.startSession();
    } catch (e) {
      console.error('Failed to start standard session', e);
    }
  };

  const toggleSubjectExpand = (subId: string) => {
    setExpandedSubjects(prev =>
      prev.includes(subId) ? prev.filter(id => id !== subId) : [...prev, subId]
    );
  };

  const toggleChapterExpand = (chapId: string) => {
    setExpandedChapters(prev =>
      prev.includes(chapId) ? prev.filter(id => id !== chapId) : [...prev, chapId]
    );
  };

  // Render state indicator badges
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'locked':
        return (
          <span
            style={{
              fontSize: '9px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text-muted)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            <Lock size={10} /> Locked
          </span>
        );
      case 'available':
        return (
          <span
            style={{
              fontSize: '9px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: 'rgba(74,144,226,0.15)',
              color: 'var(--accent-base)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            <Clock size={10} /> Ready
          </span>
        );
      case 'in_progress':
        return (
          <span
            style={{
              fontSize: '9px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: 'rgba(245,166,35,0.15)',
              color: 'var(--accent-warning)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            ⚡ Active
          </span>
        );
      case 'completed':
        return (
          <span
            style={{
              fontSize: '9px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: 'rgba(106,168,79,0.15)',
              color: 'var(--accent-success)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            <CheckCircle size={10} /> Completed
          </span>
        );
      case 'revision_due':
        return (
          <span
            style={{
              fontSize: '9px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: 'rgba(224,102,102,0.15)',
              color: 'var(--accent-danger)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 'bold',
            }}
          >
            <RotateCcw size={10} /> Revise Due
          </span>
        );
      default:
        return null;
    }
  };

  // Sort queue by priority: revision first, then active/in_progress, then manual
  const pendingTasks = tasks.filter(t => t.status === 'pending');

  return (
    <div className="dashboard-container fade-in">
      {recoveredSession && (
        <div
          style={{
            background: 'hsla(150, 42%, 25%, 0.08)',
            border: '1px solid hsla(150, 42%, 25%, 0.2)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-4) var(--space-5)',
            marginBottom: 'var(--space-4)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--space-4)',
            width: '100%',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <Typography
              variant="body"
              style={{
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--accent-success)',
                margin: 0,
              }}
            >
              Your focus progress was saved
            </Typography>
            <Typography
              variant="caption"
              color="secondary"
              style={{ display: 'block', marginTop: 'var(--space-1)', lineHeight: '1.4' }}
            >
              We've preserved your study time from the interrupted {recoveredSession.subject}{' '}
              session. Take a breath and ease back in whenever you're ready.
            </Typography>
          </div>
          <Button
            variant="ghost"
            onClick={clearRecoveredSession}
            style={{ padding: 'var(--space-2) var(--space-3)', fontSize: '12px' }}
          >
            Dismiss
          </Button>
        </div>
      )}
      <div className="dashboard-grid">
        {/* Left Column: Focus controller */}
        <div className="focus-controller-wrapper">
          <div
            className="glass-panel"
            style={{
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            {/* Welcoming Header */}
            <div style={{ textAlign: 'center' }}>
              <Typography
                variant="heading"
                style={{ margin: 0, fontWeight: 'var(--font-weight-bold)' }}
              >
                Astra Sanctuary
              </Typography>
              <Typography variant="body" color="secondary" style={{ marginTop: 'var(--space-1)' }}>
                Welcome back, {userName}.
              </Typography>
              <Typography
                variant="caption"
                color="muted"
                style={{ display: 'block', marginTop: 'var(--space-1)' }}
              >
                Track your studies and master your disciplines
              </Typography>
            </div>

            {/* Streak Badge */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  background: 'hsla(35, 85%, 52%, 0.08)',
                  border: '1px solid hsla(35, 85%, 52%, 0.2)',
                  color: 'var(--accent-warning)',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-size-body)',
                  fontWeight: 'var(--font-weight-bold)',
                }}
              >
                <Flame size={16} />
                <span>{currentStreak} Day Streak</span>
              </div>
            </div>

            <Divider />

            {items.length === 0 ? (
              // 1. Onboarding UI (New User)
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <Typography variant="body" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  Define your first study targets:
                </Typography>
                
                <div>
                  <label
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--text-secondary)',
                      display: 'block',
                      marginBottom: 'var(--space-1)',
                    }}
                  >
                    What specific topic or skill are you learning?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Spanish past tense, Rust pointers"
                    value={onboardingItemTitle}
                    onChange={e => setOnboardingItemTitle(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-base)',
                      border: '1px solid var(--surface-border)',
                      color: 'var(--text-primary)',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-sm)',
                      outline: 'none',
                      fontSize: 'var(--font-size-body)',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--text-secondary)',
                      display: 'block',
                      marginBottom: 'var(--space-1)',
                    }}
                  >
                    What do you intend to do right now?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Read past tense grammar notes"
                    value={onboardingActionWording}
                    onChange={e => setOnboardingActionWording(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-base)',
                      border: '1px solid var(--surface-border)',
                      color: 'var(--text-primary)',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-sm)',
                      outline: 'none',
                      fontSize: 'var(--font-size-body)',
                    }}
                  />
                </div>

                <div style={{ marginTop: 'var(--space-2)' }}>
                  <Button
                    variant="primary"
                    style={{
                      width: '100%',
                      padding: 'var(--space-3) 0',
                      fontWeight: 'var(--font-weight-bold)',
                    }}
                    disabled={!onboardingItemTitle.trim() || !onboardingActionWording.trim() || isOnboardingSubmitting}
                    onClick={handleOnboardingStart}
                  >
                    {isOnboardingSubmitting ? 'Entering focus...' : 'Begin Studying'}
                  </Button>
                </div>
              </div>
            ) : (
              // 2. Standard Selection Flow
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <label
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--text-secondary)',
                      display: 'block',
                      marginBottom: 'var(--space-1)',
                    }}
                  >
                    Select what you are learning:
                  </label>
                  <select
                    value={selectedItemId}
                    onChange={e => setSelectedItemId(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-base)',
                      border: '1px solid var(--surface-border)',
                      color: 'var(--text-primary)',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-sm)',
                      outline: 'none',
                      fontSize: 'var(--font-size-body)',
                    }}
                  >
                    {items.filter(i => i.status === 'active').map(i => (
                      <option key={i.id} value={i.id}>
                        {i.title}
                      </option>
                    ))}
                    <option value="new">[+ Learn something new]</option>
                  </select>
                </div>

                {selectedItemId === 'new' && (
                  <div>
                    <label
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--text-secondary)',
                        display: 'block',
                        marginBottom: 'var(--space-1)',
                      }}
                    >
                      New Topic or Skill Name:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Relative velocity"
                      value={newItemTitle}
                      onChange={e => setNewItemTitle(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-base)',
                        border: '1px solid var(--surface-border)',
                        color: 'var(--text-primary)',
                        padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-sm)',
                        outline: 'none',
                        fontSize: 'var(--font-size-body)',
                      }}
                    />
                  </div>
                )}

                <div>
                  <label
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--text-secondary)',
                      display: 'block',
                      marginBottom: 'var(--space-1)',
                    }}
                  >
                    What do you intend to do right now?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Read notes, Solve 10 problems"
                    value={newActionWording}
                    onChange={e => setNewActionWording(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--bg-base)',
                      border: '1px solid var(--surface-border)',
                      color: 'var(--text-primary)',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-sm)',
                      outline: 'none',
                      fontSize: 'var(--font-size-body)',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--text-secondary)',
                      display: 'block',
                      marginBottom: 'var(--space-1)',
                    }}
                  >
                    Session Duration
                  </label>
                  <select
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    style={{
                      width: '100%',
                      background: 'var(--bg-base)',
                      border: '1px solid var(--surface-border)',
                      color: 'var(--text-primary)',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius-sm)',
                      outline: 'none',
                      fontSize: 'var(--font-size-body)',
                    }}
                  >
                    <option value={1500}>25 Minutes (Pomodoro)</option>
                    <option value={3000}>50 Minutes (Deep Focus)</option>
                    <option value={5400}>90 Minutes (Ultra Focus)</option>
                  </select>
                </div>

                <div style={{ marginTop: 'var(--space-2)' }}>
                  <Button
                    variant="primary"
                    style={{
                      width: '100%',
                      padding: 'var(--space-3) 0',
                      fontWeight: 'var(--font-weight-bold)',
                    }}
                    disabled={
                      (selectedItemId === 'new' && !newItemTitle.trim()) ||
                      !newActionWording.trim()
                    }
                    onClick={handleStandardStart}
                  >
                    Enter Focus Sanctuary
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Widgets Stack */}
        <div className="widgets-stack">
          {featureFlags.inactiveFeatures && (
            <div
              className="glass-panel"
              style={{
                padding: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: 'var(--accent-base)',
                }}
              >
                <MessageSquare size={16} />
                <Typography
                  variant="body"
                  style={{ fontWeight: 'var(--font-weight-bold)', margin: 0 }}
                >
                  Astra Companion
                </Typography>
              </div>
              <div
                style={{
                  background: 'var(--bg-base)',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--surface-border)',
                }}
              >
                <Typography variant="caption" color="secondary">
                  🌟 <strong>Sanctuary Active</strong> — Complete tasks below. Astra is monitoring
                  focus rhythm updates.
                </Typography>
              </div>
            </div>
          )}

          {/* Scrolling Split Panels */}
          <div className="widgets-split-grid">
            {/* Syllabus Widget (Nested Accordion Subjects -> Units -> Chapters -> Topics) */}
            <div
              className="glass-panel"
              style={{
                padding: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  marginBottom: 'var(--space-3)',
                  color: 'var(--accent-base)',
                }}
              >
                <BookOpen size={16} />
                <Typography
                  variant="body"
                  style={{ fontWeight: 'var(--font-weight-bold)', margin: 0 }}
                >
                  Syllabus Track
                </Typography>
              </div>

              <ScrollArea style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-3)',
                    paddingRight: 'var(--space-2)',
                  }}
                >
                  {syllabusTree.map(subjectNode => {
                    const isSubExpanded = expandedSubjects.includes(subjectNode.subject.id);
                    return (
                      <div
                        key={subjectNode.subject.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          border: '1px solid var(--surface-border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '8px',
                          background: 'rgba(255,255,255,0.01)',
                        }}
                      >
                        {/* Subject Heading */}
                        <div
                          onClick={() => toggleSubjectExpand(subjectNode.subject.id)}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            userSelect: 'none',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {isSubExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
                              {subjectNode.subject.emoji} {subjectNode.subject.name}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: '10px',
                              color: 'var(--accent-base)',
                              fontWeight: 'bold',
                            }}
                          >
                            {Math.round(subjectNode.progress)}%
                          </span>
                        </div>

                        {/* Subject Progress Bar */}
                        <div
                          style={{
                            height: '4px',
                            width: '100%',
                            background: 'var(--surface-border)',
                            borderRadius: '2px',
                            overflow: 'hidden',
                            marginTop: '4px',
                          }}
                        >
                          <div
                            style={{
                              width: `${subjectNode.progress}%`,
                              height: '100%',
                              background: subjectNode.subject.color,
                              borderRadius: '2px',
                            }}
                          />
                        </div>

                        {/* Units inside Subject */}
                        {isSubExpanded && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                              paddingLeft: '12px',
                              marginTop: '8px',
                            }}
                          >
                            {subjectNode.units.map(unitNode => (
                              <div
                                key={unitNode.unit.id}
                                style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
                              >
                                <div
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    color: 'var(--text-secondary)',
                                    borderBottom: '1px dashed var(--surface-border)',
                                    paddingBottom: '2px',
                                  }}
                                >
                                  {unitNode.unit.name}
                                </div>

                                {/* Chapters inside Unit */}
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px',
                                    paddingLeft: '4px',
                                  }}
                                >
                                  {unitNode.chapters.map(chapNode => {
                                    const isChapExpanded = expandedChapters.includes(
                                      chapNode.chapter.id
                                    );
                                    return (
                                      <div
                                        key={chapNode.chapter.id}
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: '4px',
                                        }}
                                      >
                                        {/* Chapter row click triggers expand */}
                                        <div
                                          onClick={() => toggleChapterExpand(chapNode.chapter.id)}
                                          style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            padding: '4px 6px',
                                            borderRadius: '4px',
                                            background: isChapExpanded
                                              ? 'rgba(255,255,255,0.03)'
                                              : 'transparent',
                                          }}
                                        >
                                          <div
                                            style={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '4px',
                                            }}
                                          >
                                            {isChapExpanded ? (
                                              <ChevronDown size={12} />
                                            ) : (
                                              <ChevronRight size={12} />
                                            )}
                                            <span
                                              style={{
                                                fontSize: '12px',
                                                color: 'var(--text-primary)',
                                              }}
                                            >
                                              {chapNode.chapter.name}
                                            </span>
                                          </div>
                                          {renderStatusBadge(chapNode.status)}
                                        </div>

                                        {/* Topics inside Chapter */}
                                        {isChapExpanded && (
                                          <div
                                            style={{
                                              display: 'flex',
                                              flexDirection: 'column',
                                              gap: '4px',
                                              paddingLeft: '18px',
                                              borderLeft: '1px dotted var(--surface-border)',
                                              marginLeft: '6px',
                                              marginBottom: '4px',
                                            }}
                                          >
                                            {chapNode.topics.map(t => (
                                              <div
                                                key={t.id}
                                                onClick={() => {
                                                  if (chapNode.status !== 'locked') {
                                                    syllabusService.toggleTopicCompletion(t.id);
                                                  }
                                                }}
                                                style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: '6px',
                                                  cursor:
                                                    chapNode.status === 'locked'
                                                      ? 'not-allowed'
                                                      : 'pointer',
                                                  opacity: chapNode.status === 'locked' ? 0.4 : 1,
                                                  padding: '2px 0',
                                                }}
                                              >
                                                {t.isCompleted ? (
                                                  <CheckCircle
                                                    size={12}
                                                    style={{ color: 'var(--accent-success)' }}
                                                  />
                                                ) : (
                                                  <Circle
                                                    size={12}
                                                    style={{ color: 'var(--text-muted)' }}
                                                  />
                                                )}
                                                <span
                                                  style={{
                                                    fontSize: '11px',
                                                    textDecoration: t.isCompleted
                                                      ? 'line-through'
                                                      : 'none',
                                                    color: t.isCompleted
                                                      ? 'var(--text-muted)'
                                                      : 'var(--text-primary)',
                                                  }}
                                                >
                                                  {t.name}
                                                </span>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Tasks Widget (Dynamic priority daily work queue) */}
            <div
              className="glass-panel"
              style={{
                padding: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  marginBottom: 'var(--space-3)',
                  color: 'var(--accent-base)',
                }}
              >
                <Brain size={16} />
                <Typography
                  variant="body"
                  style={{ fontWeight: 'var(--font-weight-bold)', margin: 0 }}
                >
                  Active Tasks Queue
                </Typography>
              </div>

              <ScrollArea style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-2)',
                    paddingRight: 'var(--space-2)',
                  }}
                >
                  {pendingTasks.length > 0 ? (
                    pendingTasks.map(task => {
                      const sub = subjects.find(s => s.id === task.subjectId);
                      return (
                        <div
                          key={task.id}
                          onClick={() => taskService.toggleTask(task.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            padding: 'var(--space-3)',
                            background: 'var(--bg-base)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--surface-border)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              color: 'var(--text-muted)',
                            }}
                          >
                            <Circle size={14} />
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '2px',
                              flex: 1,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 'var(--font-size-caption)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--text-primary)',
                              }}
                            >
                              {task.title}
                            </span>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <span
                                style={{
                                  fontSize: '9px',
                                  background: sub?.color || '#555',
                                  color: '#fff',
                                  padding: '1px 4px',
                                  borderRadius: '3px',
                                }}
                              >
                                {sub?.emoji} {sub?.name || 'Task'}
                              </span>
                              {task.taskType !== 'manual' && (
                                <span
                                  style={{
                                    fontSize: '9px',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'var(--accent-base)',
                                    padding: '1px 4px',
                                    borderRadius: '3px',
                                    border: '1px solid var(--surface-border)',
                                  }}
                                >
                                  🧠 generated
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: 'var(--space-6) var(--space-4)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <CheckCircle
                        size={28}
                        style={{
                          color: 'var(--accent-success)',
                          opacity: 0.6,
                          marginBottom: 'var(--space-2)',
                        }}
                      />
                      <Typography
                        variant="body"
                        style={{ fontWeight: 'var(--font-weight-medium)' }}
                      >
                        All tasks completed
                      </Typography>
                      <Typography
                        variant="caption"
                        color="muted"
                        style={{ display: 'block', marginTop: '2px' }}
                      >
                        Your work queue is clear for today.
                      </Typography>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
