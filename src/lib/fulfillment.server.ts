import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Expands bundles into the individual products they contain.
 */
export async function expandSlugs(slugs: string[]): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("slug, bundle_slugs")
    .in("slug", slugs);
  if (error) throw new Error(error.message);

  const out = new Set<string>();
  for (const row of data ?? []) {
    out.add(row.slug);
    for (const child of row.bundle_slugs ?? []) out.add(child);
  }
  return [...out];
}

export async function priceFor(slugs: string[]): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("price_cents")
    .in("slug", slugs);
  if (error) throw new Error(error.message);
  return (data ?? []).reduce((sum, r) => sum + r.price_cents, 0);
}

/**
 * Idempotently records a paid order and grants entitlements for everything it
 * contains (bundles expanded). Safe to call from both the webhook and the
 * thank-you page confirmation.
 */
export async function grantOrder(params: {
  userId: string;
  email: string | null;
  slugs: string[];
  amountCents: number;
  reference: string;
}): Promise<string[]> {
  const { userId, email, slugs, amountCents, reference } = params;

  const { data: existing } = await supabaseAdmin
    .from("orders")
    .select("id")
    .eq("stripe_session_id", reference)
    .maybeSingle();

  let orderId = existing?.id ?? null;

  if (!orderId) {
    const { data: inserted, error } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        email,
        product_slugs: slugs,
        amount_cents: amountCents,
        status: "paid",
        stripe_session_id: reference,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    orderId = inserted.id;
  }

  const owned = await expandSlugs(slugs);

  const { data: already } = await supabaseAdmin
    .from("entitlements")
    .select("product_slug")
    .eq("user_id", userId);
  const have = new Set((already ?? []).map((r) => r.product_slug));

  const toInsert = owned
    .filter((slug) => !have.has(slug))
    .map((slug) => ({ user_id: userId, product_slug: slug, order_id: orderId }));

  if (toInsert.length > 0) {
    const { error } = await supabaseAdmin.from("entitlements").insert(toInsert);
    if (error) throw new Error(error.message);
  }

  return owned;
}
