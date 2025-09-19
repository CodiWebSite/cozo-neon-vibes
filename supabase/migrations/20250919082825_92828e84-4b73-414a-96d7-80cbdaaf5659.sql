-- Create table for site content management
CREATE TABLE public.site_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key text NOT NULL UNIQUE,
  content_value text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view site content" 
ON public.site_content 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage site content" 
ON public.site_content 
FOR ALL 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content
INSERT INTO public.site_content (content_key, content_value, content_type, description) VALUES
('hero_title', 'DJ COZO', 'text', 'Main hero title'),
('hero_subtitle', 'PROFESSIONAL DJ & MUSIC PRODUCER', 'text', 'Hero subtitle'),
('hero_description', 'Transforming your events into unforgettable experiences with premium sound and lighting. From intimate gatherings to grand celebrations, I bring the perfect soundtrack to your special moments.', 'text', 'Hero description'),
('about_title', 'About DJ Cozo', 'text', 'About section title'),
('about_description', 'With over 10 years of experience in the music industry, I specialize in creating the perfect atmosphere for your events. My passion for music and attention to detail ensure that every moment is perfectly synchronized with the right sound.', 'text', 'About section description'),
('services_title', 'Our Services', 'text', 'Services section title'),
('contact_title', 'Get In Touch', 'text', 'Contact section title'),
('contact_description', 'Ready to make your event unforgettable? Let us discuss your vision and create the perfect musical experience together.', 'text', 'Contact section description');