-- Server-side validation + rate limiting for public contact form submissions

CREATE INDEX IF NOT EXISTS contact_messages_email_created_idx
  ON public.contact_messages (lower(email), created_at DESC);

CREATE OR REPLACE FUNCTION public.validate_contact_message()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  recent_count integer;
  link_count integer;
BEGIN
  NEW.name := btrim(NEW.name);
  NEW.email := lower(btrim(NEW.email));
  NEW.message := btrim(NEW.message);
  NEW.phone := nullif(btrim(coalesce(NEW.phone, '')), '');

  IF length(NEW.name) < 2 OR length(NEW.name) > 100 THEN
    RAISE EXCEPTION 'invalid_name';
  END IF;

  IF NEW.email !~ '^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$' OR length(NEW.email) > 255 THEN
    RAISE EXCEPTION 'invalid_email';
  END IF;

  IF length(NEW.message) < 10 OR length(NEW.message) > 2000 THEN
    RAISE EXCEPTION 'invalid_message';
  END IF;

  IF NEW.phone IS NOT NULL AND (length(NEW.phone) > 30 OR NEW.phone !~ '^[0-9+()\-\s.]+$') THEN
    RAISE EXCEPTION 'invalid_phone';
  END IF;

  IF NEW.event_type IS NOT NULL AND length(NEW.event_type) > 50 THEN
    RAISE EXCEPTION 'invalid_event_type';
  END IF;

  IF NEW.event_date IS NOT NULL AND length(NEW.event_date) > 30 THEN
    RAISE EXCEPTION 'invalid_event_date';
  END IF;

  -- spam heuristics: too many links or raw html in the message
  link_count := (length(NEW.message) - length(regexp_replace(lower(NEW.message), 'https?://', '', 'g'))) / 8;
  IF link_count > 2 OR NEW.message ~* '<\s*(a|script|iframe)\b' THEN
    RAISE EXCEPTION 'spam_detected';
  END IF;

  -- rate limit: max 3 messages per email address per hour
  SELECT count(*) INTO recent_count
  FROM public.contact_messages
  WHERE lower(email) = NEW.email
    AND created_at > now() - interval '1 hour';

  IF recent_count >= 3 THEN
    RAISE EXCEPTION 'rate_limited';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS contact_messages_validate ON public.contact_messages;
CREATE TRIGGER contact_messages_validate
  BEFORE INSERT ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.validate_contact_message();
