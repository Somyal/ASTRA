import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';

export class WindowService {
  private isMini = false;

  async enterFullscreen(): Promise<void> {
    try {
      const appWindow = getCurrentWindow();
      await appWindow.setFullscreen(true);
    } catch (e) {
      console.error('Failed to enter fullscreen:', e);
    }
  }

  async exitFullscreen(): Promise<void> {
    try {
      const appWindow = getCurrentWindow();
      await appWindow.setFullscreen(false);
    } catch (e) {
      console.error('Failed to exit fullscreen:', e);
    }
  }

  async toggleFullscreen(): Promise<void> {
    try {
      const appWindow = getCurrentWindow();
      const isFullscreen = await appWindow.isFullscreen();
      await appWindow.setFullscreen(!isFullscreen);
    } catch (e) {
      console.error('Failed to toggle fullscreen:', e);
    }
  }

  async enterMiniTimer(): Promise<void> {
    if (this.isMini) return;
    try {
      const appWindow = getCurrentWindow();
      this.isMini = true;

      // Set always on top & resize to logical compact size
      await appWindow.setAlwaysOnTop(true);
      await appWindow.setSize(new LogicalSize(320, 210));
    } catch (e) {
      console.error('Failed to enter mini timer mode:', e);
    }
  }

  async exitMiniTimer(): Promise<void> {
    if (!this.isMini) return;
    try {
      const appWindow = getCurrentWindow();

      this.isMini = false;
      await appWindow.setAlwaysOnTop(false);

      // Restore to standard layout dimensions
      await appWindow.setSize(new LogicalSize(1024, 768));
    } catch (e) {
      console.error('Failed to exit mini timer mode:', e);
    }
  }

  async toggleMiniTimer(): Promise<void> {
    if (this.isMini) {
      await this.exitMiniTimer();
    } else {
      await this.enterMiniTimer();
    }
  }

  getIsMini(): boolean {
    return this.isMini;
  }
}

export const windowService = new WindowService();
export default windowService;
