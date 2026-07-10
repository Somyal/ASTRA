import { create } from 'zustand';

export type AppTab =
  | 'dashboard'
  | 'focus'
  | 'analytics'
  | 'settings'
  | 'playground'
  | 'recovery'
  | 'complete';

export interface UIState {
  bootState: 'booting' | 'migrating' | 'hydrating' | 'ready' | 'error';
  bootError: string | null;
  activeTab: AppTab;
  focusModeActive: boolean;
  openModal: string | null;
  settingsOpen: boolean;
  isSidebarExpanded: boolean;
  isCommandPaletteOpen: boolean;
  activeSettingsTab: string;
  recoveryElapsedSecs: number;

  // Actions
  setBootState: (state: 'booting' | 'migrating' | 'hydrating' | 'ready' | 'error') => void;
  setBootError: (error: string | null) => void;
  setActiveTab: (tab: AppTab) => void;
  setFocusModeActive: (active: boolean) => void;
  setOpenModal: (modal: string | null) => void;
  setSettingsOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setActiveSettingsTab: (tab: string) => void;
  tickRecovery: () => void;
  resetRecovery: () => void;
  setBoot: (state: 'booting' | 'migrating' | 'hydrating' | 'ready' | 'error', error: string | null) => void;
}

export const useUIStore = create<UIState>(set => ({
  bootState: 'booting',
  bootError: null,
  activeTab: 'dashboard',
  focusModeActive: false,
  openModal: null,
  settingsOpen: false,
  isSidebarExpanded: false,
  isCommandPaletteOpen: false,
  activeSettingsTab: 'general',
  recoveryElapsedSecs: 0,

  setBootState: bootState => set({ bootState }),
  setBootError: bootError => set({ bootError }),
  setActiveTab: activeTab => set({ activeTab }),
  setFocusModeActive: focusModeActive => set({ focusModeActive }),
  setOpenModal: openModal => set({ openModal }),
  setSettingsOpen: settingsOpen => set({ settingsOpen }),
  toggleSidebar: () => set(state => ({ isSidebarExpanded: !state.isSidebarExpanded })),
  setCommandPaletteOpen: isCommandPaletteOpen => set({ isCommandPaletteOpen }),
  setActiveSettingsTab: activeSettingsTab => set({ activeSettingsTab }),
  tickRecovery: () => set(state => ({ recoveryElapsedSecs: state.recoveryElapsedSecs + 1 })),
  resetRecovery: () => set({ recoveryElapsedSecs: 0 }),
  setBoot: (bootState, bootError) => set({ bootState, bootError }),
}));
