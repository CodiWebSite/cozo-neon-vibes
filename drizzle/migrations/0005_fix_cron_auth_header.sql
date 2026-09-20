SELECT cron.unschedule('sync-facebook-reviews-hourly');

SELECT cron.schedule(
  'sync-facebook-reviews-hourly',
  '17 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://fvssjrkwremskqkfaelp.supabase.co/functions/v1/sync-facebook-reviews',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer sb_publishable_FjcgbbaW535bUFU-8sZuNw_Lkfo7_SM',
      'apikey', 'sb_publishable_FjcgbbaW535bUFU-8sZuNw_Lkfo7_SM',
      'x-cron-secret', '2f1384565d28210e614193af9cf8ea3d7189ac8862ddf6ec'
    ),
    body := '{}'::jsonb
  );
  $$
);