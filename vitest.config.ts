import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vitest Configuration for ASTRA
 *
 * Configures the test runner with:
 * - React component testing support
 * - Happy DOM for lightweight DOM simulation
 * - Path aliases matching tsconfig.json
 * - Coverage reporting
 * - UI mode for interactive test exploration
 */
export default defineConfig({
  plugins: [react()],
  test: {
    // Use happy-dom for faster, lightweight testing
    // (jsdom is heavier but more complete)
    environment: 'happy-dom',

    // Global test setup
    globals: true,

    // Include test files matching these patterns
    include: ['src/**/*.{test,spec}.{ts,tsx}'],

    // Exclude certain directories
    exclude: ['node_modules', 'dist', 'src-tauri'],

    // Coverage settings
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src-tauri/', '**/*.d.ts', '**/*.config.*', '**/dist/'],
    },

    // Mock modules configuration
    setupFiles: ['./src/tests/setup.ts'],
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
