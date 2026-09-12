const clientToken: string | undefined = import.meta.env["VITE_PAYMENTS_CLIENT_TOKEN"];

export function PaymentTestModeBanner() {
  if (!clientToken) {
    return (
      <div className="w-full border-b border-warning-border bg-warning px-4 py-2 text-center text-sm text-foreground">
        Checkout is not configured for this build yet.
      </div>
    );
  }
  if (clientToken.startsWith("pk_test_")) {
    return (
      <div className="w-full border-b border-warning-border bg-warning px-4 py-2 text-center text-sm text-foreground">
        Payments made in the preview are in test mode — no real money moves.
      </div>
    );
  }
  return null;
}
