# Grief Offer Stack — Sales Funnel Site

A complete funnel site for The First-Year Trigger Map: a flagship $47 sales page with an order bump, two post-purchase upsells, a bundle anchor, real Stripe checkout, and a login-protected member area where buyers download what they own.

## The offer stack being built

| Offer | Price | Role |
| --- | --- | --- |
| The First-Year Trigger Map | $47 | Flagship front-end offer |
| Tender Dates & Gatherings Pack | $17 | Order bump at checkout |
| The Complicated Love Permission Pack | $37 | Upsell #1 |
| Grieving the Body You Had | $37 | Upsell #2 |
| The Grief That Doesn't Fit on a Sympathy Card | $67 | Best-value anchor |
| Complete Bundle (all 5) | $97 | One-click bundle at checkout |

Per your note, the estrangement and breakup/divorce workbooks stay as separate products for now (option a) — the catalog is data-driven, so merging them later is a config change, not a rebuild.

## Pages

- `/` — Flagship sales page for the Trigger Map: hero, the "first-year trigger" story, what's inside, AI companion tool teaser, testimonials placeholder, pricing block, FAQ, buy button.
- `/checkout` — Order summary with the $17 order bump checkbox and the $97 Complete Bundle swap, then to Stripe.
- `/thank-you` — Post-purchase confirmation, access instructions, first upsell offer.
- `/upsell/complicated-love` and `/upsell/grieving-the-body` — One-click add-on offer pages for buyers.
- `/bundle` — Best-value anchor page for the $67 anthology and the $97 bundle.
- `/library` — Protected member area listing owned products with download links.
- `/auth` — Sign up / sign in.

## Design

Since you haven't specified a visual direction, I'll go with a warm, quiet, editorial look appropriate for grief work — soft paper-toned background, a muted deep plum accent echoing your document, generous serif headlines, no aggressive marketing-red urgency bars. If you'd prefer to see rendered options first, say so and I'll generate design directions before building.

## Backend

Enable Lovable Cloud for:
- Accounts (email/password sign-in) and the member area gate.
- `products` table (slug, name, price, description, funnel role, file path) seeded with all six offers.
- `orders` and `entitlements` tables recording who owns what, keyed to the signed-in user.
- Private storage bucket for the product files (PDFs/workbooks) — you upload them; downloads use short-lived signed URLs so files can't be shared publicly.
- Row-level security so a buyer can only see their own orders and entitlements.

## Stripe

- Checkout Session created server-side with the selected line items (main offer + optional bump, or the bundle).
- A public webhook endpoint verifies Stripe's signature and grants entitlements on `checkout.session.completed` — entitlements are never granted from the browser.
- One-click upsells create a second Checkout Session from the thank-you/upsell pages.
- Stripe test-mode keys first so we can run a full purchase end to end before you go live.

## Technical notes

- TanStack Start routes; catalog lives in the database and renders from a loader so prices/copy change without code edits.
- Checkout session creation and entitlement reads run in server functions; the webhook is a server route under `/api/public/`.
- Product downloads issue signed URLs from a server function after verifying the caller's entitlement.
- Per-route SEO metadata on every public page.

## What I need from you

- Your Stripe secret key (test mode is fine to start) — I'll open the secure key dialog.
- The five product files when ready; until then the library shows "coming soon" placeholders.
