import { useState } from "react";
import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { listProducts } from "@/lib/catalog.functions";
import { createCheckoutSession } from "@/lib/checkout.functions";
import { formatPrice } from "@/lib/format";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { SafetyNote } from "@/components/safety-note";

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const Route = createFileRoute("/upsell/$slug")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  head: () => ({
    meta: [
      { title: "A companion resource — Ncredible Solutions" },
      {
        name: "description",
        content:
          "A companion grief resource for the parts of loss that don't fit neatly — offered gently, never with pressure.",
      },
      { property: "og:title", content: "A companion resource — Ncredible Solutions" },
      {
        property: "og:description",
        content: "For the parts of grief that don't fit on a sympathy card.",
      },
    ],
  }),
  notFoundComponent: UpsellNotFound,
  component: UpsellPage,
});

function UpsellNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-3xl">We couldn't find that resource</h1>
      <p className="mt-4 text-muted-foreground">
        <Link to="/bundle" className="text-primary underline underline-offset-4">
          See everything available
        </Link>
      </p>
    </div>
  );
}

function UpsellPage() {
  const { slug } = Route.useParams();
  const { data: products } = useSuspenseQuery(productsQuery);
  const { user } = useSession();
  const navigate = useNavigate();
  const startCheckout = useServerFn(createCheckoutSession);
  const [busy, setBusy] = useState(false);

  const product = products.find((p) => p.slug === slug);
  if (!product) throw notFound();

  async function handleBuy() {
    if (!user) {
      navigate({ to: "/auth", search: { redirect: `/upsell/${slug}` } });
      return;
    }
    setBusy(true);
    try {
      const { url } = await startCheckout({
        data: { slugs: [slug], origin: window.location.origin },
      });
      window.location.href = url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout could not start.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
        A companion resource
      </p>
      <h1 className="mt-5 text-4xl">{product.name}</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{product.subtitle}</p>
      <p className="mt-4 leading-relaxed text-muted-foreground">{product.description}</p>

      {product.inside.length > 0 && (
        <ul className="mt-8 border-t border-border/70">
          {product.inside.map((item) => (
            <li key={item} className="border-b border-border/70 py-4 leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      )}

      <Button size="lg" className="mt-8 w-full sm:w-auto sm:px-10" disabled={busy} onClick={handleBuy}>
        {busy ? "One moment…" : `Add it — ${formatPrice(product.price_cents)}`}
      </Button>

      <p className="mt-4 text-sm text-muted-foreground">
        No thank you is a complete answer.{" "}
        <Link to="/library" className="underline underline-offset-4">
          Go to my library instead
        </Link>
        .
      </p>

      <div className="mt-12">
        <SafetyNote variant="compact" />
      </div>
    </div>
  );
}
