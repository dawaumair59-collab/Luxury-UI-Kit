import { Component, type ReactNode, type ErrorInfo } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[MenuLux ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          className="flex flex-col items-center justify-center min-h-[400px] p-8"
          style={{ backgroundColor: "hsl(0 0% 4%)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="glass border-gold-gradient rounded-md p-8 max-w-md w-full text-center"
          >
            <div
              className="text-4xl mb-4"
              style={{ color: "rgba(212,175,55,0.3)" }}
            >
              ◇
            </div>
            <h2
              className="text-lg font-bold mb-2 text-gold-gradient"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Something went wrong
            </h2>
            <p
              className="text-xs mb-6"
              style={{ color: "rgba(212,175,55,0.38)", fontFamily: "'Inter', sans-serif" }}
            >
              {this.state.error?.message ?? "An unexpected error occurred. Please refresh and try again."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-sm text-sm font-semibold transition-all duration-300 hover:glow-gold-sm"
              style={{
                background: "linear-gradient(135deg, #a07830, #d4af37, #f0d080)",
                color: "hsl(0 0% 4%)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Reload Page
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
