import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchX, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SEO } from "@/components/SEO";

const WITTY_LINES = [
  "Looks like this deal fell out of the pipeline.",
  "This page ghosted us harder than a cold lead.",
  "We searched every stage of the funnel. Nothing.",
  "Even our best sales rep couldn't close this page.",
];

const REDIRECT_AFTER_SECONDS = 15;

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [countdown, setCountdown] = useState(REDIRECT_AFTER_SECONDS);

  // Pick a witty line once on mount; previously this was recomputed on every render.
  const randomLine = useMemo(
    () => WITTY_LINES[Math.floor(Math.random() * WITTY_LINES.length)],
    []
  );

  // Anonymous visitors don't have a dashboard to land on — send them home instead.
  const redirectTarget = session ? "/dashboard" : "/";
  const redirectLabel = session ? "Dashboard" : "Home";

  useEffect(() => {
    if (typeof console !== "undefined") {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname
      );
    }
  }, [location.pathname]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(redirectTarget);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate, redirectTarget]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SEO
        title="Page not found"
        description="The page you're looking for doesn't exist."
        path={location.pathname}
        noindex
      />
      <main className="text-center max-w-lg space-y-6">
        <div
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"
          aria-hidden="true"
        >
          <SearchX className="h-12 w-12 text-primary" />
        </div>

        <div className="space-y-2">
          <h1
            className="text-7xl font-bold text-primary"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            404
          </h1>
          <p className="text-xl font-medium text-foreground">Page Not Found</p>
        </div>

        <p className="text-muted-foreground text-lg italic">"{randomLine}"</p>

        <p className="text-sm text-muted-foreground" aria-live="polite">
          Redirecting to your {redirectLabel.toLowerCase()} in{" "}
          <span className="font-semibold text-primary">{countdown}s</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Go Back
          </Button>
          <Button onClick={() => navigate(redirectTarget)} className="gap-2">
            <Home className="h-4 w-4" aria-hidden="true" />
            {redirectLabel}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground/60">
          Tried to reach:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">{location.pathname}</code>
        </p>
      </main>
    </div>
  );
};

export default NotFound;
