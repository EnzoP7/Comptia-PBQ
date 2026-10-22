import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  resetKey: string;
  onReset: () => void;
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

/** Keeps a corrupted saved answer from blanking the whole app; offers a per-PBQ reset. */
export class SimulatorErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prev: Props) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-800 space-y-3 text-sm text-rose-100">
        <div className="flex items-center gap-2 font-bold">
          <AlertTriangle className="w-4 h-4" /> No se pudo cargar el estado guardado de esta PBQ.
        </div>
        <p className="text-xs text-rose-200/80">Probablemente proviene de una versión anterior del simulador.</p>
        <button
          onClick={() => {
            this.setState({ error: null });
            this.props.onReset();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Restablecer esta PBQ
        </button>
      </div>
    );
  }
}
