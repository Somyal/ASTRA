/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Test Setup File for ASTRA
 *
 * This file runs before all tests and sets up:
 * - Global test utilities
 * - Mock configurations
 * - DOM testing library setup
 */

import '@testing-library/jest-dom';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

/**
 * Cleanup after each test to prevent memory leaks
 */
afterEach(() => {
  cleanup();
});

/**
 * Mock window.matchMedia for responsive design tests
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

/**
 * Mock IntersectionObserver for components that use it
 */
globalThis.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

/**
 * Suppress console errors in tests (optional - remove if you want to see all logs)
 */
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    // Suppress React error boundary warnings in tests
    if (typeof args[0] === 'string' && args[0].includes('Warning: ReactDOM.render')) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
