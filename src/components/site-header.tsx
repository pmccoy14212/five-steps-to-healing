import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";

export function SiteHeader() {
  const { user, loading } = useSession();
  const navigate = useNavigate();

  return (
    <header className="border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="font-display text-lg tracking-tight">
          Ncredible Solutions
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link to="/bundle" className="text-muted-foreground transition-colors hover:text-foreground">
            All resources
          </Link>
          {!loading && user ? (
            <>
              <Link
                to="/library"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                My library
              </Link>
              <button
                type="button"
                className="text-muted-foreground transition-colors hover:text-foreground"
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate({ to: "/" });
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              search={{ redirect: undefined }}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
