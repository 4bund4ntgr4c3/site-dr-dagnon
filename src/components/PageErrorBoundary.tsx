import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/* A render error inside any routed page used to unmount the whole React tree
   — a blank page that only a manual refresh could bring back (typically when
   a lazy chunk fails to download on a slow connection). The boundary keeps
   the shell (navbar, footer) alive, surfaces a friendly explanation and
   offers the exact reload the visitor was going to perform anyway. */
export class PageErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    try {
      window.dispatchEvent(
        new CustomEvent('page-error', {
          detail: { message: error.message, componentStack: info.componentStack },
        }),
      );
    } catch {
      /* never fail the error path itself */
    }
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="flex min-h-screen items-center justify-center bg-pine-950 px-6 py-24">
        <div className="max-w-md text-center">
          <p className="text-4xl font-display font-semibold text-gold-400">!</p>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ivory">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-pine-100/70">
            Une erreur est survenue pendant le chargement de la page.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-pine-950 transition-colors hover:bg-gold-400"
          >
            Recharger / Reload
          </button>
        </div>
      </main>
    );
  }
}
