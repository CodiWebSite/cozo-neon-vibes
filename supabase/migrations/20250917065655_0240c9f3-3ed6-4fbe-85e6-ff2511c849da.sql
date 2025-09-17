-- Create admin users table
CREATE TABLE public.admin_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Create gallery images table
CREATE TABLE public.gallery_images (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    storage_path TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_users
CREATE POLICY "Admin users can view own profile" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admin users can update own profile" 
ON public.admin_users 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RLS policies for gallery_images
CREATE POLICY "Anyone can view active gallery images" 
ON public.gallery_images 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can view all gallery images" 
ON public.gallery_images 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can insert gallery images" 
ON public.gallery_images 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update gallery images" 
ON public.gallery_images 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can delete gallery images" 
ON public.gallery_images 
FOR DELETE 
USING (public.is_admin());

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

-- Create storage policies
CREATE POLICY "Anyone can view gallery images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload gallery images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gallery' AND public.is_admin());

CREATE POLICY "Admins can update gallery images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gallery' AND public.is_admin());

CREATE POLICY "Admins can delete gallery images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gallery' AND public.is_admin());

-- Create function to automatically update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at
    BEFORE UPDATE ON public.gallery_images
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample gallery data from existing assets
INSERT INTO public.gallery_images (title, alt_text, category, image_url, display_order) VALUES
('DJ în Acțiune', 'DJ Cozo in actiune la un eveniment premium', 'Club Events', '/src/assets/hero-dj.jpg', 1),
('Nuntă Elegantă', 'Setup DJ profesional pentru nunta eleganta', 'Weddings', '/src/assets/wedding-dj.jpg', 2),
('Eveniment Corporate', 'Eveniment corporate cu DJ Cozo', 'Corporate', '/src/assets/corporate-event.jpg', 3),
('Atmosferă Club', 'Atmosfera de club cu DJ Cozo', 'Club Events', '/src/assets/club-night.jpg', 4),
('Petrecere Privată', 'Petrecere privata cu DJ Cozo', 'Private', '/src/assets/private-party.jpg', 5),
('Portret Profesional', 'DJ Cozo - portret profesional', 'Studio', '/src/assets/dj-portrait.jpg', 6);