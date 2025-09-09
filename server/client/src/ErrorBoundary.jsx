import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(p) {
    super(p);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err, info) {
    console.error("UI error:", err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Something went wrong.</h2>
          <p>Please refresh — if it persists I’ll fix it asap.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
