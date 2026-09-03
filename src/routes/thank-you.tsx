import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { listProducts } from "@/lib/catalog.functions";
import { confirmCheckout } from "@/lib/checkout.functions";
import { formatPrice } from "@/lib/format";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { SafetyNote } from "@/components/safety-note";

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const Route = createFileRoute("/thank-you")({
  validateSearch: z.object({
    session_id: z.string().optional(),
    ref: z.string().optional(),
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  head: () => ({
    meta: [
      { title: "Thank you — your resources are ready" },
      {
        name: "description",
        content: "Your order is confirmed. Open your library to begin whenever you're ready.",
      },
      { property: "og:title", content: "Thank you — your resources are ready" },
      { property: "og:description", content: "Your order is confirmed." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  const { session_id, ref } = Route.useSearch();
  const reference = session_id ?? ref;
  const { user, loading } = useSession();
  const confirm = useServerFn(confirmCheckout);
  const { data: products } = useSuspenseQuery(productsQuery);

  const { data, isLoading } = useQuery({
    queryKey: ["confirm", reference],
    queryFn: () => confirm({ data: { reference: reference! } }),
    enabled: Boolean(reference) && Boolean(user),
    retry: 2,
    retryDelay: 1500,
  });

  const granted = data?.granted ?? [];
  const upsell = products.find(
    (p) => p.slug === "complicated-love-permission-pack" && !granted.includes(p.slug),
  );

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">Order confirmed</p>
      <h1 className="mt-5 text-3xl">It's yours. Take your time with it.</h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        There's no right way to start, and no schedule you're behind on. Open it when you have the
        capacity, and not a moment before.
      </p>

      {!loading && !user && (
        <p className="mt-6 leading-relaxed text-muted-foreground">
          <Link to="/auth" search={{ redirect: "/library" }} className="text-primary underline underline-offset-4">
            Sign in
          </Link>{" "}
          with the email you used at checkout to open your library.
        </p>
      )}

      {user && isLoading && <p className="mt-6 text-muted-foreground">Confirming your order…</p>}

      {granted.length > 0 && (
        <ul className="mt-8 border-t border-border/70">
          {granted.map((slug) => {
            const p = products.find((x) => x.slug === slug);
            return (
              <li key={slug} className="border-b border-border/70 py-4 font-display">
                {p?.name ?? slug}
              </li>
            );
          })}
        </ul>
      )}

      <Button asChild size="lg" className="mt-8">
        <Link to="/library">Open my library</Link>
      </Button>

      {upsell && (
        <div className="mt-16 border-t border-border/70 pt-10">
          <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
            If it would help
          </p>
          <h2 className="mt-4 text-2xl">{upsell.name}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {upsell.description || upsell.subtitle}
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/upsell/$slug" params={{ slug: upsell.slug }}>
              Have a look — {formatPrice(upsell.price_cents)}
            </Link>
          </Button>
        </div>
      )}

      <div className="mt-12">
        <SafetyNote variant="compact" />
      </div>
    </div>
  );
}
