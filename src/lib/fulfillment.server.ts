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

/** Slugs (bundles expanded) the user already owns. */
export async function ownedSlugs(userId: string): Promise<Set<string>> {
  const { data, error } = await supabaseAdmin
    .from("entitlements")
    .select("product_slug")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((r) => r.product_slug));
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
  paymentIntent?: string | null;
}): Promise<string[]> {
  const { userId, email, slugs, amountCents, reference, paymentIntent } = params;

  const { data: existing } = await supabaseAdmin
    .from("orders")
    .select("id, refunded_at")
    .eq("stripe_session_id", reference)
    .maybeSingle();

  // Never re-grant access for an order that has been refunded.
  if (existing?.refunded_at) return [];

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
        stripe_payment_intent: paymentIntent ?? null,
      })
      .select("id")
      .single();
    if (error) {
      // Concurrent webhook + thank-you confirmation: fall back to the winner.
      const { data: again } = await supabaseAdmin
        .from("orders")
        .select("id")
        .eq("stripe_session_id", reference)
        .maybeSingle();
      if (!again) throw new Error(error.message);
      orderId = again.id;
    } else {
      orderId = inserted.id;
    }
  } else if (paymentIntent) {
    await supabaseAdmin
      .from("orders")
      .update({ stripe_payment_intent: paymentIntent })
      .eq("id", orderId)
      .is("stripe_payment_intent", null);
  }

  const owned = await expandSlugs(slugs);
  const have = await ownedSlugs(userId);

  const toInsert = owned
    .filter((slug) => !have.has(slug))
    .map((slug) => ({ user_id: userId, product_slug: slug, order_id: orderId }));

  if (toInsert.length > 0) {
    const { error } = await supabaseAdmin
      .from("entitlements")
      .upsert(toInsert, { onConflict: "user_id,product_slug", ignoreDuplicates: true });
    if (error) throw new Error(error.message);
  }

  return owned;
}

/**
 * Marks an order refunded and removes the access it granted.
 * Matches by checkout session id or payment intent.
 */
export async function revokeOrder(match: { sessionId?: string | null; paymentIntent?: string | null }) {
  let query = supabaseAdmin.from("orders").select("id");
  if (match.sessionId) query = query.eq("stripe_session_id", match.sessionId);
  else if (match.paymentIntent) query = query.eq("stripe_payment_intent", match.paymentIntent);
  else return;

  const { data: orders, error } = await query;
  if (error) throw new Error(error.message);
  for (const order of orders ?? []) {
    await supabaseAdmin.from("entitlements").delete().eq("order_id", order.id);
    await supabaseAdmin
      .from("orders")
      .update({ status: "refunded", refunded_at: new Date().toISOString() })
      .eq("id", order.id);
  }
}
