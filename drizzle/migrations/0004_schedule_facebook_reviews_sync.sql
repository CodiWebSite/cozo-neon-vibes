CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.schedule(
  'sync-facebook-reviews-hourly',
  '17 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://fvssjrkwremskqkfaelp.supabase.co/functions/v1/sync-facebook-reviews',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', '2f1384565d28210e614193af9cf8ea3d7189ac8862ddf6ec'
    ),
    body := '{}'::jsonb
  );
  $$
);