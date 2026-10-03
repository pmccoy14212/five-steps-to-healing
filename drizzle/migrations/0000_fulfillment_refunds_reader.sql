ALTER TABLE public.products ADD COLUMN IF NOT EXISTS content_md text;
UPDATE public.products SET file_path = slug || '.pdf' WHERE file_path IS NULL AND slug <> 'complete-bundle';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_payment_intent text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS refunded_at timestamptz;
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent ON public.orders(stripe_payment_intent);
CREATE UNIQUE INDEX IF NOT EXISTS uq_entitlements_user_slug ON public.entitlements(user_id, product_slug);