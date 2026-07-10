# ASTRA Testing Guide

This document explains how to write and run tests for ASTRA using Vitest.

## Quick Start

### Running Tests

```bash
# Run all tests in watch mode
npm test

# Run tests with interactive UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Generate coverage report
npm run test:coverage
```

## Test Structure

### File Organization

```
src/
├── components/
│   ├── Button/
│   ├── ErrorBoundary/
│   │   └── __tests__/
│   │       └── ErrorBoundary.test.tsx
│   └── ...
├── services/
│   ├── session.service.ts
│   └── session.service.test.ts  (or in src/tests/)
├── stores/
│   └── study.store.test.ts
└── tests/
    ├── setup.ts                 (global setup)
    ├── ErrorBoundary.test.tsx
    ├── SessionService.test.ts
    └── helpers/
        └── test-utils.ts
```

### Test File Naming

- Component tests: `ComponentName.test.tsx` or `__tests__/ComponentName.test.tsx`
- Service tests: `serviceName.test.ts`
- Store tests: `storeName.test.ts`
- Utility tests: `utilName.test.ts`

## Writing Tests

### 1. Component Tests

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with label', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 2. Service Tests

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MyService } from '../myService';

// Mock dependencies
vi.mock('../repository', () => ({
  repository: {
    getData: vi.fn(),
  },
}));

describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    service = new MyService();
    vi.clearAllMocks();
  });

  it('should fetch and transform data', async () => {
    const { repository } = await import('../repository');
    repository.getData.mockResolvedValue({ id: 1, name: 'Test' });

    const result = await service.loadData();
    expect(result).toEqual({ id: 1, name: 'Test' });
  });

  it('should handle errors gracefully', async () => {
    const { repository } = await import('../repository');
    repository.getData.mockRejectedValue(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'error');
    await service.loadData();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
```

### 3. Store Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useStudyStore } from '../study.store';

describe('Study Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useStudyStore.getState();
    store.reset?.();
  });

  it('should initialize with default state', () => {
    const store = useStudyStore.getState();
    expect(store.currentStreak).toBe(0);
    expect(store.lifetimeSeconds).toBe(0);
  });

  it('should update state when session completes', () => {
    const store = useStudyStore.getState();
    store.archiveSession();
    // Add assertions about updated state
  });
});
```

## Testing Best Practices

### 1. Isolation

Each test should be independent:

```typescript
// ✅ Good: Each test sets up its own mocks
it('test 1', () => {
  const mock = vi.fn();
  // ... test code
});

it('test 2', () => {
  const mock = vi.fn();
  // ... test code
});

// ❌ Bad: Tests depend on each other
let mock;
it('test 1', () => {
  mock = vi.fn();
});
it('test 2', () => {
  expect(mock).toBeDefined(); // Depends on test 1
});
```

### 2. Clear Test Names

```typescript
// ✅ Good: Clearly describes what is tested
it('should display error message when session save fails');
it('should clear timer when session is paused');
it('renders children when there is no error');

// ❌ Bad: Vague
it('works');
it('test');
it('should work');
```

### 3. Use Descriptive Matchers

```typescript
// ✅ Good
expect(screen.getByText('Error')).toBeTruthy();
expect(timer).toBeNull();
expect(handleClick).toHaveBeenCalledWith('submit');

// ❌ Bad
expect(component).toBe(true);
expect(timer === null).toBe(true);
expect(handleClick.mock.calls.length > 0).toBe(true);
```

### 4. Test User Behavior, Not Implementation

```typescript
// ✅ Good: Tests what the user sees
it('submits form when user clicks submit button', () => {
  render(<Form onSubmit={handleSubmit} />);
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  expect(handleSubmit).toHaveBeenCalled();
});

// ❌ Bad: Tests implementation details
it('calls setState when button is clicked', () => {
  // ... directly testing internal state
});
```

## Testing Common ASTRA Patterns

### Testing Timer Cleanup

Since ASTRA has had timer leak issues, always test that timers are cleaned up:

```typescript
it('should clear timer on pause', async () => {
  await service.startSession();
  const timerBefore = getActiveTimer();
  expect(timerBefore).toBeTruthy();

  await service.pauseSession();
  const timerAfter = getActiveTimer();
  expect(timerAfter).toBeNull();
});
```

### Testing Database Error Handling

```typescript
it('should handle database errors', async () => {
  repository.save.mockRejectedValue(new Error('DB failed'));

  const consoleSpy = vi.spyOn(console, 'error');
  await service.saveData();

  expect(consoleSpy).toHaveBeenCalled();
  expect(consoleSpy.mock.calls[0][0]).toContain('Database');
});
```

### Testing Event Subscriptions

```typescript
it('should clean up event subscriptions on unmount', () => {
  const unsubscribe = vi.fn();
  eventBus.subscribe = vi.fn(() => unsubscribe);

  const { unmount } = render(<Component />);
  expect(eventBus.subscribe).toHaveBeenCalled();

  unmount();
  expect(unsubscribe).toHaveBeenCalled();
});
```

## Debugging Tests

### Run Single Test

```bash
npm test -- ErrorBoundary.test.tsx
```

### Run Tests Matching Pattern

```bash
npm test -- --grep "timer"
```

### Debug Mode

```bash
npm test -- --inspect-brk
```

Then open `chrome://inspect` in Chrome.

## Common Issues

### Issue: "Cannot find module" in tests

**Solution:** Check your import paths. Use relative paths or configure tsconfig paths.

```typescript
// ✅ Good
import { service } from '../services/session.service';

// ❌ Avoid mixing styles
import { service } from '@/services/session.service';
```

### Issue: Tests pass locally but fail in CI

**Solution:**

- Mock `window` and browser APIs
- Ensure tests don't depend on execution order
- Clear timers and subscriptions after each test

### Issue: Async test timeouts

**Solution:** Increase timeout for slow operations:

```typescript
it('should fetch large dataset', async () => {
  // ... test code
}, 10000); // 10 second timeout
```

## Coverage Goals

- **Target:** 70%+ line coverage
- **Critical paths:** 90%+ coverage
  - Error boundaries
  - Timer management
  - Database operations
  - Session state transitions

Generate coverage:

```bash
npm run test:coverage
```

See coverage report in `coverage/index.html`

## Useful Links

- [Vitest Documentation](https://vitest.dev)
- [Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing Tests

When adding new features:

1. Write tests first (TDD) or alongside implementation
2. Ensure all error paths are tested
3. Test cleanup (timers, subscriptions, mocks)
4. Avoid testing implementation details
5. Keep tests maintainable and readable
6. Aim for high coverage on critical code

Questions? Refer to existing tests for examples!
