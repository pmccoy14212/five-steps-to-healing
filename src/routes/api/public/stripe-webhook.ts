import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["STRIPE_WEBHOOK_SECRET"];
        const stripeKey = process.env["STRIPE_SECRET_KEY"];
        if (!secret || !stripeKey) {
          return new Response("Payments not configured", { status: 503 });
        }

        const signature = request.headers.get("stripe-signature");
        if (!signature) return new Response("Missing signature", { status: 401 });

        const body = await request.text();
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(stripeKey, { httpClient: Stripe.createFetchHttpClient() });

        let event: import("stripe").Stripe.Event;
        try {
          event = await stripe.webhooks.constructEventAsync(body, signature, secret);
        } catch {
          return new Response("Invalid signature", { status: 401 });
        }

        if (event.type === "checkout.session.completed") {
          const session = event.data.object;
          if (session.payment_status === "paid") {
            const userId = session.metadata?.["user_id"];
            const slugs = (session.metadata?.["slugs"] ?? "").split(",").filter(Boolean);
            if (userId && slugs.length > 0) {
              const { grantOrder } = await import("@/lib/fulfillment.server");
              await grantOrder({
                userId,
                email: session.customer_details?.email ?? null,
                slugs,
                amountCents: session.amount_total ?? 0,
                reference: session.id,
              });
            }
          }
        }

        return new Response("ok");
      },
    },
  },
});
