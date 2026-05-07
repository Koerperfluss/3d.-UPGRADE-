import React, { ErrorInfo } from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-background p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-brand-border text-center">
            <h2 className="text-2xl font-serif font-bold text-brand-secondary mb-4">Hoppla! Etwas ist schiefgelaufen.</h2>
            <p className="text-brand-text-on-light-secondary mb-6">
              Es gab einen unerwarteten Fehler. Bitte lade die Seite neu oder kontaktiere unseren Support, falls das Problem weiterhin besteht.
            </p>
            {this.state.error && (
              <pre className="text-left bg-red-50 p-4 rounded-xl text-xs text-red-600 overflow-auto mb-6 max-h-40">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-brand-primary text-brand-secondary rounded-2xl font-bold hover:bg-brand-primary-dark transition-all"
            >
              Seite neu laden
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
