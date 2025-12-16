'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-50">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-error mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Algo deu errado</h1>
            <p className="text-neutral-700 mb-6">
              Desculpe, ocorreu um erro inesperado.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="bg-neutral-200 p-4 rounded-md text-left text-sm text-neutral-700 mb-6 max-w-2xl overflow-auto">
                {this.state.error.message}
              </pre>
            )}
            <Button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.href = '/'
              }}
            >
              Voltar para Home
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
