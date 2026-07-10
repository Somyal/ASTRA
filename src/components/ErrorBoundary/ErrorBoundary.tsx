import React, { ReactNode, ReactElement } from 'react';
import { Typography } from '../Typography';
import { Button } from '../Button';
import { useUIStore } from '../../store/ui.store';
import './ErrorBoundary.css';

/**
 * Props for the ErrorBoundary component
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * State for the ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * ErrorBoundary - Catches React component errors and displays a graceful fallback UI
 *
 * Usage:
 * ```jsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error details
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Notify UI store of error if available
    try {
      const store = useUIStore.getState();
      store.setBoot('error', `Component Error: ${error.message}`);
    } catch (storeError) {
      console.error('Failed to notify UI store of error', storeError);
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactElement {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback && this.state.error) {
        return <>{this.props.fallback(this.state.error, this.resetError)}</>;
      }

      // Default error UI
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">⚠️</div>
            <Typography variant="heading" className="error-boundary-title">
              Something Went Wrong
            </Typography>
            <Typography variant="body" color="secondary" className="error-boundary-message">
              An unexpected error occurred in the application.
            </Typography>

            {this.state.error && (
              <div className="error-boundary-details">
                <Typography variant="caption" className="error-boundary-error-title">
                  Error Details:
                </Typography>
                <div className="error-boundary-error-message">{this.state.error.toString()}</div>

                {this.state.errorInfo?.componentStack && (
                  <details className="error-boundary-stack">
                    <summary className="error-boundary-summary">
                      <Typography variant="caption">Stack Trace</Typography>
                    </summary>
                    <pre className="error-boundary-stack-trace">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="error-boundary-actions">
              <Button variant="primary" onClick={this.resetError}>
                Try Again
              </Button>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Reload Application
              </Button>
            </div>

            <Typography variant="caption" color="muted" className="error-boundary-help">
              If this error persists, please check the browser console for more details.
            </Typography>
          </div>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}

export default ErrorBoundary;
