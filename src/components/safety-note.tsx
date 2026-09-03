export function SafetyNote({ variant = "full" }: { variant?: "full" | "compact" }) {
  if (variant === "compact") {
    return (
      <p className="text-sm leading-relaxed text-muted-foreground">
        Peer-support education — not therapy, medical care, or crisis intervention. If you are in
        immediate danger, contact local emergency services or call/text 988.
      </p>
    );
  }

  return (
    <aside className="rounded-sm border border-callout-border bg-callout p-6 text-callout-foreground">
      <h2 className="font-display text-lg">What this is not</h2>
      <p className="mt-3 leading-relaxed">
        This is peer-support education — not therapy, medical care, or crisis intervention. It does
        not diagnose, treat, or promise a timeline for healing. If you are in immediate danger, or
        worried you may harm yourself or someone else, contact local emergency services or call/text{" "}
        <strong>988</strong> right now.
      </p>
    </aside>
  );
}
