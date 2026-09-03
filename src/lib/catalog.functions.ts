import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price_cents: number;
  funnel_role: string;
  sort_order: number;
  bundle_slugs: string[];
  inside: string[];
};

function toProduct(row: {
  slug: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  price_cents: number;
  funnel_role: string;
  sort_order: number;
  bundle_slugs: string[];
  inside: unknown;
}): Product {
  return {
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle ?? "",
    description: row.description ?? "",
    price_cents: row.price_cents,
    funnel_role: row.funnel_role,
    sort_order: row.sort_order,
    bundle_slugs: row.bundle_slugs ?? [],
    inside: Array.isArray(row.inside) ? (row.inside as string[]) : [],
  };
}

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "slug, name, subtitle, description, price_cents, funnel_role, sort_order, bundle_slugs, inside",
    )
    .eq("active", true)
    .order("sort_order");

  if (error) throw new Error(error.message);
  return (data ?? []).map(toProduct);
});

export const getMyLibrary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [{ data: ents, error: entErr }, { data: orders, error: orderErr }] = await Promise.all([
      supabase.from("entitlements").select("product_slug, created_at").eq("user_id", userId),
      supabase
        .from("orders")
        .select("id, amount_cents, product_slugs, status, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    ]);

    if (entErr) throw new Error(entErr.message);
    if (orderErr) throw new Error(orderErr.message);

    return {
      slugs: (ents ?? []).map((e) => e.product_slug),
      orders: orders ?? [],
    };
  });
