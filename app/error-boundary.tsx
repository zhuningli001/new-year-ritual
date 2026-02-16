'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-cream-50 to-cream-100 flex items-center justify-center px-5">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-deepRed-500">出错了</h2>
            <p className="text-charcoal-600">{this.state.error?.message || '未知错误'}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-deepRed-500 text-cream-50 px-6 py-2 rounded-lg hover:bg-deepRed-600 transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
