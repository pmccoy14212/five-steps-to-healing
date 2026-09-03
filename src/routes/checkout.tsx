import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { toast } from "sonner";
import { listProducts } from "@/lib/catalog.functions";
import { createCheckoutSession } from "@/lib/checkout.functions";
import { formatPrice } from "@/lib/format";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SafetyNote } from "@/components/safety-note";

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const Route = createFileRoute("/checkout")({
  validateSearch: z.object({ bundle: z.boolean().optional() }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  head: () => ({
    meta: [
      { title: "Checkout — The First-Year Trigger Map" },
      {
        name: "description",
        content:
          "Complete your order for The First-Year Trigger Map, add the Tender Dates & Gatherings Pack, or take the complete five-resource bundle.",
      },
      { property: "og:title", content: "Checkout — The First-Year Trigger Map" },
      {
        property: "og:description",
        content: "One payment, instant access, yours to keep.",
      },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const search = Route.useSearch();
  const { data: products } = useSuspenseQuery(productsQuery);
  const { user, loading } = useSession();
  const navigate = useNavigate();
  const startCheckout = useServerFn(createCheckoutSession);

  const [bumpOn, setBumpOn] = useState(false);
  const [bundleOn, setBundleOn] = useState(search.bundle === true);
  const [busy, setBusy] = useState(false);

  const flagship = products.find((p) => p.slug === "first-year-trigger-map");
  const bump = products.find((p) => p.slug === "tender-dates-gatherings-pack");
  const bundle = products.find((p) => p.slug === "complete-bundle");
  if (!flagship || !bump || !bundle) return null;

  const lines = bundleOn ? [bundle] : bumpOn ? [flagship, bump] : [flagship];
  const total = lines.reduce((sum, l) => sum + l.price_cents, 0);
  const bundleSaving =
    products
      .filter((p) => bundle.bundle_slugs.includes(p.slug))
      .reduce((s, p) => s + p.price_cents, 0) - bundle.price_cents;

  async function handlePay() {
    if (!user) {
      navigate({ to: "/auth", search: { redirect: "/checkout" } });
      return;
    }
    setBusy(true);
    try {
      const { url } = await startCheckout({
        data: { slugs: lines.map((l) => l.slug), origin: window.location.origin },
      });
      window.location.href = url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout could not start.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl">Your order</h1>

      <div className="mt-8 border-t border-border/70">
        {lines.map((l) => (
          <div
            key={l.slug}
            className="flex items-baseline justify-between gap-6 border-b border-border/70 py-5"
          >
            <div>
              <p className="font-display text-lg">{l.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{l.subtitle}</p>
            </div>
            <span className="shrink-0">{formatPrice(l.price_cents)}</span>
          </div>
        ))}
        <div className="flex items-baseline justify-between py-5 font-display text-lg">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {!bundleOn && (
        <label className="mt-4 flex cursor-pointer gap-4 rounded-sm border border-dashed border-primary/50 bg-card p-5">
          <Checkbox
            checked={bumpOn}
            onCheckedChange={(v) => setBumpOn(v === true)}
            className="mt-1"
          />
          <span>
            <span className="font-display text-base">
              Add the {bump.name} — {formatPrice(bump.price_cents)}
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
              {bump.description || bump.subtitle}
            </span>
          </span>
        </label>
      )}

      <label className="mt-4 flex cursor-pointer gap-4 rounded-sm border border-primary/60 bg-secondary p-5">
        <Checkbox
          checked={bundleOn}
          onCheckedChange={(v) => setBundleOn(v === true)}
          className="mt-1"
        />
        <span>
          <span className="font-display text-base">
            Take all five resources instead — {formatPrice(bundle.price_cents)}
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
            Everything on the shelf, saving {formatPrice(bundleSaving)}. No pressure — the Trigger
            Map on its own is a complete resource.
          </span>
        </span>
      </label>

      <Button size="lg" className="mt-8 w-full" disabled={busy || loading} onClick={handlePay}>
        {busy ? "One moment…" : `Continue — ${formatPrice(total)}`}
      </Button>

      {!user && !loading && (
        <p className="mt-3 text-center text-sm text-muted-foreground">
          You'll create an account first, so your resources are always waiting in your library.
        </p>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/" className="underline underline-offset-4">
          Back to the guide
        </Link>
      </p>

      <div className="mt-10">
        <SafetyNote variant="compact" />
      </div>
    </div>
  );
}
