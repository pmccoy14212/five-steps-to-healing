import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const checkoutInput = z.object({
  slugs: z.array(z.string().min(1)).min(1),
  origin: z.string().url(),
});

/**
 * Starts a checkout.
 *
 * With STRIPE_SECRET_KEY configured this creates a real Stripe Checkout
 * Session. Without it, the funnel runs in test mode: the order is recorded and
 * entitlements are granted immediately so the whole flow can be walked
 * end-to-end before payments are connected.
 */
export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => checkoutInput.parse(data))
  .handler(async ({ data, context }) => {
    const { userId, claims } = context;
    const email = typeof claims["email"] === "string" ? (claims["email"] as string) : null;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("products")
      .select("slug, name, subtitle, price_cents")
      .in("slug", data.slugs)
      .eq("active", true);
    if (error) throw new Error(error.message);
    if (!rows || rows.length !== data.slugs.length) {
      throw new Error("One of those items is no longer available.");
    }

    const amountCents = rows.reduce((sum, r) => sum + r.price_cents, 0);
    const stripeKey = process.env["STRIPE_SECRET_KEY"];

    if (!stripeKey) {
      // ---- Test mode (no payment provider connected yet) ----
      const { grantOrder } = await import("./fulfillment.server");
      const reference = `testmode_${crypto.randomUUID()}`;
      await grantOrder({
        userId,
        email,
        slugs: data.slugs,
        amountCents,
        reference,
      });
      return { mode: "test" as const, url: `${data.origin}/thank-you?ref=${reference}` };
    }

    // ---- Live/Stripe test-key mode ----
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, { httpClient: Stripe.createFetchHttpClient() });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ...(email ? { customer_email: email } : {}),
      line_items: rows.map((r) => ({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: r.price_cents,
          product_data: { name: r.name, ...(r.subtitle ? { description: r.subtitle } : {}) },
        },
      })),
      metadata: {
        user_id: userId,
        slugs: data.slugs.join(","),
      },
      success_url: `${data.origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${data.origin}/checkout`,
    });

    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    return { mode: "stripe" as const, url: session.url };
  });

/**
 * Confirms a completed Stripe session on the thank-you page (belt and braces
 * alongside the webhook). Test-mode references are already fulfilled.
 */
export const confirmCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ reference: z.string().min(1) }).parse(data))
  .handler(async ({ data, context }) => {
    const { userId, claims } = context;
    const { reference } = data;

    if (reference.startsWith("testmode_")) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: order } = await supabaseAdmin
        .from("orders")
        .select("product_slugs, user_id")
        .eq("stripe_session_id", reference)
        .maybeSingle();
      if (!order || order.user_id !== userId) return { granted: [] as string[] };
      const { expandSlugs } = await import("./fulfillment.server");
      return { granted: await expandSlugs(order.product_slugs) };
    }

    const stripeKey = process.env["STRIPE_SECRET_KEY"];
    if (!stripeKey) return { granted: [] as string[] };

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, { httpClient: Stripe.createFetchHttpClient() });
    const session = await stripe.checkout.sessions.retrieve(reference);

    if (session.payment_status !== "paid") return { granted: [] as string[] };
    if (session.metadata?.["user_id"] !== userId) throw new Error("That order isn't yours.");

    const slugs = (session.metadata?.["slugs"] ?? "").split(",").filter(Boolean);
    const { grantOrder } = await import("./fulfillment.server");
    const granted = await grantOrder({
      userId,
      email: typeof claims["email"] === "string" ? (claims["email"] as string) : null,
      slugs,
      amountCents: session.amount_total ?? 0,
      reference,
    });
    return { granted };
  });
