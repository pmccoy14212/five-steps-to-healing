import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  type StripeEnv,
  createStripeClient,
  getStripeErrorMessage,
} from "@/lib/stripe.server";

/** Catalog slug → built-in payments price ID (lookup key, stable across test/live). */
const SLUG_TO_PRICE: Record<string, string> = {
  "first-year-trigger-map": "first_year_trigger_map_onetime",
  "tender-dates-gatherings-pack": "tender_dates_pack_onetime",
  "complicated-love-permission-pack": "complicated_love_pack_onetime",
  "grieving-the-body-you-had": "grieving_the_body_onetime",
  "grief-that-doesnt-fit": "grief_not_on_card_onetime",
  "complete-bundle": "complete_bundle_onetime",
};

const checkoutInput = z.object({
  slugs: z.array(z.string().min(1)).min(1),
  origin: z.string().url(),
  environment: z.enum(["sandbox", "live"]),
});

type CheckoutSessionResult = { clientSecret: string } | { error: string };

// Look up an existing customer by userId metadata (then by email), or create
// one. userId on the customer object makes later reads resolvable.
async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string | undefined; userId?: string },
): Promise<string> {
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) {
    throw new Error("Invalid userId");
  }
  if (options.userId) {
    const found = await stripe.customers.search({
      query: `metadata['userId']:'${options.userId}'`,
      limit: 1,
    });
    if (found.data.length) return found.data[0].id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    const customer = existing.data[0];
    if (customer) {
      if (options.userId && customer.metadata?.userId !== options.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: options.userId },
        });
      }
      return customer.id;
    }
  }
  const created = await stripe.customers.create({
    ...(options.email && { email: options.email }),
    ...(options.userId && { metadata: { userId: options.userId } }),
  });
  return created.id;
}

/**
 * Starts an embedded checkout session through the built-in payments
 * integration. Tax compliance is handled end-to-end for eligible buyers.
 */
export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => checkoutInput.parse(data))
  .handler(async ({ data, context }): Promise<CheckoutSessionResult> => {
    try {
      const { userId, claims } = context;
      const email = typeof claims["email"] === "string" ? (claims["email"] as string) : undefined;

      const lookupKeys = data.slugs.map((slug) => {
        const key = SLUG_TO_PRICE[slug];
        if (!key) throw new Error("One of those items is no longer available.");
        return key;
      });

      const stripe = createStripeClient(data.environment as StripeEnv);
      const prices = await stripe.prices.list({ lookup_keys: lookupKeys, limit: 10 });
      if (prices.data.length !== lookupKeys.length) {
        throw new Error("One of those items is no longer available.");
      }

      const customerId = await resolveOrCreateCustomer(stripe, { email, userId });

      // Product names for the payment description / dashboard display.
      const names: string[] = [];
      for (const price of prices.data) {
        const productId = typeof price.product === "string" ? price.product : price.product.id;
        const product = await stripe.products.retrieve(productId);
        names.push(product.name);
      }
      const description = names.join(" + ");

      const session = await stripe.checkout.sessions.create({
        line_items: prices.data.map((price) => ({ price: price.id, quantity: 1 })),
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: `${data.origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
        customer: customerId,
        payment_intent_data: { description },
        metadata: {
          userId,
          user_id: userId,
          slugs: data.slugs.join(","),
          managed_payments: "true",
        },
        managed_payments: { enabled: true },
      } as Parameters<typeof stripe.checkout.sessions.create>[0]);

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

/**
 * Confirms a completed session on the thank-you page (belt and braces
 * alongside the webhook) and grants entitlements.
 */
export const confirmCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({ reference: z.string().min(1), environment: z.enum(["sandbox", "live"]) })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { userId, claims } = context;
    const email = typeof claims["email"] === "string" ? (claims["email"] as string) : null;
    const stripe = createStripeClient(data.environment as StripeEnv);
    const session = await stripe.checkout.sessions.retrieve(data.reference);

    if (session.payment_status !== "paid") return { granted: [] as string[] };
    const sessionUserId = session.metadata?.["user_id"] ?? session.metadata?.["userId"];
    if (sessionUserId !== userId) throw new Error("That order isn't yours.");

    const slugs = (session.metadata?.["slugs"] ?? "").split(",").filter(Boolean);
    const { grantOrder } = await import("./fulfillment.server");
    const granted = await grantOrder({
      userId,
      email,
      slugs,
      amountCents: session.amount_total ?? 0,
      reference: data.reference,
    });
    return { granted };
  });
