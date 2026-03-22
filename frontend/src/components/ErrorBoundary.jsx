/**
 * ErrorBoundary - Catches React errors to prevent white screens
 * Part of Phase 7: Backend Integration & Real API (AIC-700)
 */
import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--bg-secondary, #f8fafc)',
          color: 'var(--text-primary, #1e293b)',
        }}>
          <AlertTriangle size={48} color="#f59e0b" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem', maxWidth: '400px' }}>
            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={this.handleReload}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={16} /> Reload Page
            </button>
            <button
              onClick={this.handleGoHome}
              style={{
                padding: '0.625rem 1.25rem',
                background: 'transparent',
                color: '#3b82f6',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
