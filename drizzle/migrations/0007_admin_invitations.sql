CREATE TABLE public.admin_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  token_hash text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending',
  invited_by uuid,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  accepted_by uuid,
  email_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_invitations TO authenticated;
GRANT ALL ON public.admin_invitations TO service_role;

ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read invitations" ON public.admin_invitations
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update invitations" ON public.admin_invitations
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete invitations" ON public.admin_invitations
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER admin_invitations_set_updated_at
  BEFORE UPDATE ON public.admin_invitations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX admin_invitations_status_idx ON public.admin_invitations (status, created_at DESC);

CREATE OR REPLACE FUNCTION public.create_admin_invitation(_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  raw_token text;
  new_id uuid;
  clean_email text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_authorized');
  END IF;

  clean_email := lower(trim(_email));
  IF clean_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_email');
  END IF;

  IF EXISTS (
    SELECT 1 FROM auth.users u
    JOIN public.user_roles r ON r.user_id = u.id AND r.role = 'admin'
    WHERE lower(u.email) = clean_email
  ) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'already_admin');
  END IF;

  UPDATE public.admin_invitations
     SET status = 'revoked'
   WHERE lower(email) = clean_email AND status = 'pending';

  raw_token := encode(extensions.gen_random_bytes(24), 'hex');

  INSERT INTO public.admin_invitations (email, token_hash, invited_by)
  VALUES (clean_email, encode(extensions.digest(raw_token, 'sha256'), 'hex'), auth.uid())
  RETURNING id INTO new_id;

  RETURN jsonb_build_object('ok', true, 'id', new_id, 'token', raw_token, 'email', clean_email);
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_admin_invitation(_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_authorized');
  END IF;

  UPDATE public.admin_invitations
     SET status = 'revoked'
   WHERE id = _id AND status = 'pending';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_pending');
  END IF;

  RETURN jsonb_build_object('ok', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.accept_admin_invitation(_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  inv public.admin_invitations%ROWTYPE;
  current_email text;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_signed_in');
  END IF;

  SELECT * INTO inv FROM public.admin_invitations
   WHERE token_hash = encode(extensions.digest(coalesce(_token, ''), 'sha256'), 'hex');

  IF inv.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_token');
  END IF;

  IF inv.status = 'accepted' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'already_accepted');
  END IF;

  IF inv.status <> 'pending' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'revoked');
  END IF;

  IF inv.expires_at < now() THEN
    UPDATE public.admin_invitations SET status = 'expired' WHERE id = inv.id;
    RETURN jsonb_build_object('ok', false, 'error', 'expired');
  END IF;

  SELECT lower(email) INTO current_email FROM auth.users WHERE id = auth.uid();

  IF current_email IS DISTINCT FROM lower(inv.email) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'email_mismatch', 'invited_email', inv.email);
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  UPDATE public.admin_invitations
     SET status = 'accepted', accepted_at = now(), accepted_by = auth.uid()
   WHERE id = inv.id;

  RETURN jsonb_build_object('ok', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.peek_admin_invitation(_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  inv public.admin_invitations%ROWTYPE;
BEGIN
  SELECT * INTO inv FROM public.admin_invitations
   WHERE token_hash = encode(extensions.digest(coalesce(_token, ''), 'sha256'), 'hex');

  IF inv.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_token');
  END IF;

  IF inv.status <> 'pending' THEN
    RETURN jsonb_build_object('ok', false, 'error', inv.status);
  END IF;

  IF inv.expires_at < now() THEN
    RETURN jsonb_build_object('ok', false, 'error', 'expired');
  END IF;

  RETURN jsonb_build_object('ok', true, 'email', inv.email, 'expires_at', inv.expires_at);
END;
$$;

REVOKE ALL ON FUNCTION public.create_admin_invitation(text) FROM anon;
REVOKE ALL ON FUNCTION public.revoke_admin_invitation(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.create_admin_invitation(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_admin_invitation(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_admin_invitation(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.peek_admin_invitation(text) TO anon, authenticated;