export interface ISettingsRepository {
  saveSettings(settings: Record<string, unknown>): Promise<void>;
  getSettings(): Promise<Record<string, unknown>>;
}

export class InMemorySettingsRepository implements ISettingsRepository {
  private settings: Record<string, unknown> = {
    userName: 'Gautam',
    examinationGoal: 'Joint Entrance Examination (JEE) Preparation',
    theme: 'dark',
    soundVolume: 50,
    soundscape: 'rain',
  };

  async saveSettings(settings: Record<string, unknown>): Promise<void> {
    this.settings = { ...this.settings, ...settings };
  }

  async getSettings(): Promise<Record<string, unknown>> {
    return { ...this.settings };
  }
}
