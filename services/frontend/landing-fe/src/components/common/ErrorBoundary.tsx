/**
 * Purpose: React Error Boundary for graceful error handling.
 * Exports: ErrorBoundary (React class component)
 * Side effects: Logs errors to console via componentDidCatch.
 *
 * Wraps child components and displays a fallback UI if a render error occurs.
 * Supports custom fallback prop or displays default "Component Unavailable" message.
 */

import { Component, type ReactNode } from 'react';


interface Props {
    fallback?: ReactNode;
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            // Default fallback if none provided
            return (
                <div className="flex items-center justify-center w-full h-full min-h-[200px] bg-black/20 rounded-lg border border-white/5 p-4">
                    <div className="text-center">
                        <p className="text-white/60 text-sm font-mono">Component Unavailable</p>
                        <button
                            onClick={() => this.setState({ hasError: false })}
                            className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
