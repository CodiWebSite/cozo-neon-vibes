CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE (user_id uuid, email text, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT r.user_id, u.email::text, r.created_at
  FROM public.user_roles r
  JOIN auth.users u ON u.id = r.user_id
  WHERE r.role = 'admin'
    AND public.has_role(auth.uid(), 'admin')
  ORDER BY r.created_at
$$;

CREATE OR REPLACE FUNCTION public.grant_admin_by_email(_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  target uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_authorized');
  END IF;

  SELECT id INTO target FROM auth.users WHERE lower(email) = lower(trim(_email)) LIMIT 1;

  IF target IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'user_not_found');
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (target, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN jsonb_build_object('ok', true, 'user_id', target);
END;
$$;

CREATE OR REPLACE FUNCTION public.revoke_admin(_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  admin_count integer;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_authorized');
  END IF;

  IF _user_id = auth.uid() THEN
    RETURN jsonb_build_object('ok', false, 'error', 'cannot_remove_self');
  END IF;

  SELECT count(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
  IF admin_count <= 1 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'last_admin');
  END IF;

  DELETE FROM public.user_roles WHERE user_id = _user_id AND role = 'admin';
  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.list_admins() FROM anon;
REVOKE ALL ON FUNCTION public.grant_admin_by_email(text) FROM anon;
REVOKE ALL ON FUNCTION public.revoke_admin(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.list_admins() TO authenticated;
GRANT EXECUTE ON FUNCTION public.grant_admin_by_email(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_admin(uuid) TO authenticated;