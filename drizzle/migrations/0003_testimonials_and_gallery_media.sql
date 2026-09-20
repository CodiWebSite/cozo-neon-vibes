-- Gallery: thumbnails + dimensions for faster, better-looking loading
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS thumb_path TEXT;
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS width INTEGER;
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS height INTEGER;

-- Testimonials / Facebook reviews
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'manual',
  external_id TEXT UNIQUE,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  role TEXT,
  content TEXT NOT NULL,
  rating INTEGER,
  recommendation_type TEXT,
  permalink TEXT,
  reviewed_at TIMESTAMPTZ,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "testimonials_public_read" ON public.testimonials
  FOR SELECT TO anon, authenticated USING (is_visible = true);

CREATE POLICY "testimonials_admin_read" ON public.testimonials
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "testimonials_admin_insert" ON public.testimonials
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "testimonials_admin_update" ON public.testimonials
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "testimonials_admin_delete" ON public.testimonials
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER testimonials_set_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS testimonials_visible_idx ON public.testimonials (is_visible, sort_order, reviewed_at DESC);