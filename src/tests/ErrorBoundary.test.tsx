/**
 * Error Boundary Component Tests
 *
 * Tests for the ErrorBoundary error handling and UI rendering
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary';

// Test component that throws an error
const ThrowingComponent: React.FC = () => {
  throw new Error('Test error in component');
};

// Safe test component
const SafeComponent: React.FC = () => {
  return <div>Safe content</div>;
};

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    // Suppress console.error for these tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe content')).toBeTruthy();
  });

  it('displays error UI when a component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    // Error boundary should show error message
    expect(screen.getByText(/Something Went Wrong/i)).toBeTruthy();
    expect(screen.getByText(/Test error in component/i)).toBeTruthy();
  });

  it('provides a "Try Again" button to reset error state', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Try Again/i)).toBeTruthy();

    // After retry, should show error again (component still throws)
    // This is expected behavior
  });

  it('accepts custom fallback UI', () => {
    const customFallback = (error: Error) => <div>Custom error: {error.message}</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Custom error: Test error/)).toBeTruthy();
  });

  it('calls onError callback when error is caught', () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    // onError should have been called with the error
    expect(onError).toHaveBeenCalled();
    const errorArg = onError.mock.calls[0][0];
    expect(errorArg.message).toContain('Test error');
  });

  it('shows stack trace in collapsible details', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    // Error boundary renders stack trace in a collapsible details element
    const stackTraceElements = screen.queryAllByText(/Stack Trace/i);
    expect(stackTraceElements.length).toBeGreaterThan(0);
  });
});
