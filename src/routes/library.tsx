import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listProducts, getMyLibrary } from "@/lib/catalog.functions";
import { formatPrice } from "@/lib/format";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SafetyNote } from "@/components/safety-note";

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const Route = createFileRoute("/library")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  head: () => ({
    meta: [
      { title: "My library — Ncredible Solutions" },
      {
        name: "description",
        content: "Your grief resources and the Next Survivable Step Companion, waiting for you.",
      },
      { property: "og:title", content: "My library — Ncredible Solutions" },
      { property: "og:description", content: "Your resources, waiting for you." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const { user, loading } = useSession();
  const { data: products } = useSuspenseQuery(productsQuery);
  const fetchLibrary = useServerFn(getMyLibrary);

  const { data, isLoading } = useQuery({
    queryKey: ["library", user?.id],
    queryFn: () => fetchLibrary(),
    enabled: Boolean(user),
  });

  if (!loading && !user) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="text-3xl">Your library</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Sign in with the email you used at checkout and everything you own will be here.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/auth" search={{ redirect: "/library" }}>
            Sign in
          </Link>
        </Button>
      </div>
    );
  }

  const owned = products.filter((p) => (data?.slugs ?? []).includes(p.slug));
  const notOwned = products.filter(
    (p) => !(data?.slugs ?? []).includes(p.slug) && p.slug !== "complete-bundle",
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl">Your library</h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Nothing here expires. Open what helps, when it helps.
      </p>

      {isLoading && <p className="mt-8 text-muted-foreground">Gathering your resources…</p>}

      {!isLoading && owned.length === 0 && (
        <p className="mt-8 leading-relaxed text-muted-foreground">
          Nothing here yet.{" "}
          <Link to="/" className="text-primary underline underline-offset-4">
            Start with The First-Year Trigger Map.
          </Link>
        </p>
      )}

      <div className="mt-8 grid gap-4">
        {owned.map((p) => (
          <Card key={p.slug} className="border-border/80">
            <CardContent className="p-6">
              <p className="font-display text-lg">{p.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.subtitle}</p>
              {p.inside.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {p.inside.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {data?.orders && data.orders.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl">Your orders</h2>
          <ul className="mt-4 border-t border-border/70">
            {data.orders.map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border/70 py-4 text-sm"
              >
                <span className="text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString()} · {o.product_slugs.join(", ")}
                </span>
                <span>{formatPrice(o.amount_cents)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isLoading && notOwned.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl">Also available</h2>
          <ul className="mt-4 border-t border-border/70">
            {notOwned.map((p) => (
              <li
                key={p.slug}
                className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border/70 py-4"
              >
                <span className="font-display">{p.name}</span>
                <Link
                  to="/upsell/$slug"
                  params={{ slug: p.slug }}
                  className="text-sm text-primary underline underline-offset-4"
                >
                  {formatPrice(p.price_cents)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12">
        <SafetyNote variant="compact" />
      </div>
    </div>
  );
}
