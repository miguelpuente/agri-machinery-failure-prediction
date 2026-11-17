import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RotateCcw, TriangleAlert } from 'lucide-react'

interface Props {
  children: ReactNode
  label?: string
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Lab error', error, info)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-rose-400/30 bg-rose-400/[0.06] p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-rose-200">
            <TriangleAlert className="size-4" aria-hidden="true" />
            Este laboratorio no pudo cargar
          </p>
          <p className="mt-1 text-xs leading-5 text-mist">
            {this.props.label ? `${this.props.label}: ` : ''}el resto del día sigue disponible.
            Reintentá o recargá la página.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-foam"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Reintentar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
