import { Component } from "react";

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorFallback extends Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[hsl(0,0%,4%)] flex items-center justify-center p-6">
          <div className="max-w-md text-center text-white space-y-4">
            <h1 className="text-xl font-semibold">Algo salió mal</h1>
            <p className="text-sm text-[hsl(0,0%,60%)]">
              Si acabas de desplegar en Vercel, añade las variables de entorno en el proyecto:
              <br />
              <strong>VITE_SUPABASE_URL</strong> y <strong>VITE_SUPABASE_ANON_KEY</strong>
              <br />
              (Supabase → Settings → API) y vuelve a desplegar.
            </p>
            <p className="text-xs text-[hsl(0,0%,50%)]">
              {this.state.error?.message}
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-pink-600 rounded-lg text-sm font-medium hover:bg-pink-500"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
