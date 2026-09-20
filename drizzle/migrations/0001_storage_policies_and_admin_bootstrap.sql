CREATE POLICY "Anyone can read gallery files"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload gallery files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'gallery' AND public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.claim_admin_if_none()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claimed BOOLEAN := false;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (auth.uid(), 'admin')
    ON CONFLICT DO NOTHING;
    claimed := true;
  END IF;
  RETURN claimed;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_admin_if_none() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_admin_if_none() TO authenticated;