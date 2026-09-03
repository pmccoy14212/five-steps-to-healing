import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { listProducts } from "@/lib/catalog.functions";
import { createCheckoutSession } from "@/lib/checkout.functions";
import { formatPrice } from "@/lib/format";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SafetyNote } from "@/components/safety-note";

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const Route = createFileRoute("/bundle")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  head: () => ({
    meta: [
      { title: "The Complete Bundle — all five grief resources" },
      {
        name: "description",
        content:
          "All five Ncredible Solutions grief resources — the Trigger Map, Tender Dates, Complicated Love, Grieving the Body You Had, and the full anthology — for $97.",
      },
      { property: "og:title", content: "The Complete Bundle — all five resources" },
      {
        property: "og:description",
        content: "The whole shelf, at your own pace, for $97.",
      },
    ],
  }),
  component: BundlePage,
});

function BundlePage() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { user } = useSession();
  const navigate = useNavigate();
  const startCheckout = useServerFn(createCheckoutSession);
  const [busy, setBusy] = useState(false);

  const bundle = products.find((p) => p.slug === "complete-bundle");
  if (!bundle) return null;
  const included = products.filter((p) => bundle.bundle_slugs.includes(p.slug));
  const full = included.reduce((s, p) => s + p.price_cents, 0);

  async function handleBuy() {
    if (!user) {
      navigate({ to: "/auth", search: { redirect: "/bundle" } });
      return;
    }
    setBusy(true);
    try {
      const { url } = await startCheckout({
        data: { slugs: ["complete-bundle"], origin: window.location.origin },
      });
      window.location.href = url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout could not start.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">Best value</p>
      <h1 className="mt-5 text-4xl">{bundle.name}</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
        {bundle.description || bundle.subtitle}
      </p>

      <div className="mt-10 grid gap-4">
        {included.map((p) => (
          <Card key={p.slug} className="border-border/80">
            <CardContent className="flex flex-wrap items-baseline justify-between gap-4 p-6">
              <div>
                <p className="font-display text-lg">{p.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.subtitle}</p>
              </div>
              <span className="text-muted-foreground line-through">
                {formatPrice(p.price_cents)}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 rounded-sm border border-primary/60 bg-secondary p-8">
        <p className="text-muted-foreground line-through">{formatPrice(full)} separately</p>
        <p className="mt-1 font-display text-4xl text-primary">{formatPrice(bundle.price_cents)}</p>
        <Button size="lg" className="mt-6 w-full sm:w-auto sm:px-10" disabled={busy} onClick={handleBuy}>
          {busy ? "One moment…" : `Get the complete bundle — ${formatPrice(bundle.price_cents)}`}
        </Button>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Nothing here expires, and nothing needs reading in order. Take what helps, when it helps.{" "}
          <Link to="/" className="underline underline-offset-4">
            Or start with the Trigger Map alone.
          </Link>
        </p>
      </div>

      <div className="mt-12">
        <SafetyNote />
      </div>
    </div>
  );
}
