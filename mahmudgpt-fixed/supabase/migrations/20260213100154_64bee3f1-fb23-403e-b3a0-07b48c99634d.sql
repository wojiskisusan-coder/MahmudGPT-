
-- Pro subscriptions table - admin-controlled
CREATE TABLE public.pro_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  granted_by text NOT NULL DEFAULT 'admin',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

ALTER TABLE public.pro_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only read their own subscription status
CREATE POLICY "Users can view own subscription"
ON public.pro_subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- No insert/update/delete from client - only via service role or admin edge function
