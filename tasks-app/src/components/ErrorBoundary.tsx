import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary glass-card" style={{ textAlign: "center", marginTop: "2rem" }}>
          <h2>Oops, something went wrong.</h2>
          <p style={{ color: "#94a3b8" }}>{this.state.error?.message}</p>
          <button 
            className="primary" 
            onClick={() => window.location.reload()}
            style={{ marginTop: "1rem" }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
