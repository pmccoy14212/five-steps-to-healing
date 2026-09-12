import { createFileRoute } from "@tanstack/react-router";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";

async function fulfill(session: any) {
  const userId = session.metadata?.["user_id"] ?? session.metadata?.["userId"];
  const slugs = (session.metadata?.["slugs"] ?? "").split(",").filter(Boolean);
  if (!userId || slugs.length === 0) {
    console.error("Webhook session missing userId or slugs");
    return;
  }
  const { grantOrder } = await import("@/lib/fulfillment.server");
  await grantOrder({
    userId,
    email: session.customer_details?.email ?? null,
    slugs,
    amountCents: session.amount_total ?? 0,
    reference: session.id,
  });
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          return Response.json({ received: true, ignored: "invalid env" });
        }
        const env: StripeEnv = rawEnv;
        try {
          const event = await verifyWebhook(request, env);
          switch (event.type) {
            case "checkout.session.completed": {
              const session = event.data.object;
              if (session.payment_status !== "unpaid") {
                await fulfill(session);
              }
              break;
            }
            case "checkout.session.async_payment_succeeded":
              await fulfill(event.data.object);
              break;
            default:
              console.log("Unhandled event:", event.type);
          }
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
