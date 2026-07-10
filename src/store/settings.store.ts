import { create } from 'zustand';
import { repositoryFactory } from '../repositories/index';

export interface IdentityInfo {
  userName: string;
  examinationGoal: string;
}

export interface UserPreferences {
  theme: string;
  wallpaper: string;
  soundVolume: number;
  soundscape: string;
  recoveryEnabled: boolean;
  focusDefaultDuration: number;
}

interface SettingsState {
  identity: IdentityInfo;
  preferences: UserPreferences;

  // Actions
  setUserName: (name: string) => Promise<void>;
  setExaminationGoal: (goal: string) => Promise<void>;
  setTheme: (theme: string) => Promise<void>;
  setWallpaper: (wallpaper: string) => Promise<void>;
  setSoundVolume: (vol: number) => Promise<void>;
  setSoundscape: (sound: string) => Promise<void>;
  setRecoveryEnabled: (enabled: boolean) => Promise<void>;
  setFocusDefaultDuration: (duration: number) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => {
  const saveToRepo = async (updates: Record<string, unknown>) => {
    const settingsRepo = repositoryFactory.getSettingsRepository();
    await settingsRepo.saveSettings(updates);
  };

  return {
    identity: {
      userName: 'Gautam',
      examinationGoal: 'JEE Advanced (45 days remaining)',
    },
    preferences: {
      theme: 'dark',
      wallpaper: 'default-stars',
      soundVolume: 50,
      soundscape: 'rain',
      recoveryEnabled: true,
      focusDefaultDuration: 3000, // 50 mins
    },

    setUserName: async (name) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      set((state) => ({
        identity: { ...state.identity, userName: trimmed },
      }));
      await saveToRepo({ userName: trimmed });
    },

    setExaminationGoal: async (goal) => {
      set((state) => ({
        identity: { ...state.identity, examinationGoal: goal },
      }));
      await saveToRepo({ examinationGoal: goal });
    },

    setTheme: async (theme) => {
      set((state) => ({
        preferences: { ...state.preferences, theme },
      }));
      await saveToRepo({ theme });
    },

    setWallpaper: async (wallpaper) => {
      set((state) => ({
        preferences: { ...state.preferences, wallpaper },
      }));
      await saveToRepo({ wallpaper });
    },

    setSoundVolume: async (vol) => {
      set((state) => ({
        preferences: { ...state.preferences, soundVolume: vol },
      }));
      await saveToRepo({ soundVolume: vol });
    },

    setSoundscape: async (sound) => {
      set((state) => ({
        preferences: { ...state.preferences, soundscape: sound },
      }));
      await saveToRepo({ soundscape: sound });
    },

    setRecoveryEnabled: async (enabled) => {
      set((state) => ({
        preferences: { ...state.preferences, recoveryEnabled: enabled },
      }));
      await saveToRepo({ recoveryEnabled: enabled });
    },

    setFocusDefaultDuration: async (duration) => {
      set((state) => ({
        preferences: { ...state.preferences, focusDefaultDuration: duration },
      }));
      await saveToRepo({ focusDefaultDuration: duration });
    },
  };
});
