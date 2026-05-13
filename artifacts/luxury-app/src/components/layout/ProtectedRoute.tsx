import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "hsl(0 0% 4%)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "rgba(212,175,55,0.4)", borderTopColor: "transparent" }}
          />
          <span
            className="text-xs tracking-widest-luxury uppercase"
            style={{ color: "rgba(212,175,55,0.4)", fontFamily: "'Inter', sans-serif" }}
          >
            Verifying access
          </span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
