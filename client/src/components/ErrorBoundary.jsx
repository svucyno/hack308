import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-navy flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-8 max-w-md text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="font-heading font-semibold text-xl mb-4">Something went wrong</h2>
            <p className="text-gray-400 mb-6">
              We encountered an unexpected error. Please try reloading the page.
            </p>
            <button
              onClick={this.handleReload}
              className="bg-indigo hover:bg-indigo-600 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Reload Page
            </button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-gray-500 cursor-pointer">Error Details</summary>
                <pre className="text-xs text-red-400 mt-2 overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
