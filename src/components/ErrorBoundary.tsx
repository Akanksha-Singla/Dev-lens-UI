import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Application render failed", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="fatal-state">
          <span className="fatal-icon"><AlertTriangle size={23} /></span>
          <span className="eyebrow">SOMETHING WENT WRONG</span>
          <h1>This view could not load.</h1>
          <p>Refresh the workspace to try again.</p>
          <button className="button button-primary" onClick={() => window.location.reload()}><RotateCcw size={16} /> Reload workspace</button>
        </main>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;