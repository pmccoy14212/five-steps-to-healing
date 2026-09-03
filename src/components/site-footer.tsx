import { Link } from "@tanstack/react-router";
import { SafetyNote } from "./safety-note";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-secondary/60">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <p className="font-display text-lg">Ncredible Solutions</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Lived-experience peer support for the griefs that don't fit on a sympathy card.
            </p>
          </div>
          <nav className="flex flex-col gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              The Trigger Map
            </Link>
            <Link to="/bundle" className="text-muted-foreground hover:text-foreground">
              All resources
            </Link>
            <Link to="/library" className="text-muted-foreground hover:text-foreground">
              My library
            </Link>
          </nav>
        </div>
        <div className="paper-rule my-8" />
        <SafetyNote variant="compact" />
        <p className="mt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ncredible Solutions. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
