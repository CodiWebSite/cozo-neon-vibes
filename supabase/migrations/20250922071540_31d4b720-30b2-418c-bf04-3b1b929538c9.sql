-- Enable RLS (if not already)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow the very first authenticated user to bootstrap themselves as admin
CREATE POLICY "Bootstrap first admin"
ON public.admin_users
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND NOT EXISTS (SELECT 1 FROM public.admin_users)
);
