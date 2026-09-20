import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight, Play, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { resolveGalleryItems, type GalleryRow } from '@/lib/galleryUrls';
import { useSiteContent } from '@/hooks/useSiteContent';

const Gallery = () => {
  const { t } = useSiteContent();
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['gallery_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return resolveGalleryItems((data ?? []) as GalleryRow[]);
    },
  });

  const allItems = data ?? [];
  const categories = Array.from(new Set(allItems.map((item) => item.category)));
  const galleryItems = activeCategory
    ? allItems.filter((item) => item.category === activeCategory)
    : allItems;

  const openLightbox = (index: number) => {
    setSelectedItem(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedItem(null);
  };

  const nextItem = () => {
    if (selectedItem !== null) setSelectedItem((selectedItem + 1) % galleryItems.length);
  };

  const prevItem = () => {
    if (selectedItem !== null)
      setSelectedItem(selectedItem === 0 ? galleryItems.length - 1 : selectedItem - 1);
  };

  const isEmbed = (url: string | null) => !!url && /^https?:\/\//i.test(url);

  // Navigare din tastatură în lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextItem();
      if (e.key === 'ArrowLeft') prevItem();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <section id="gallery" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('gallery_title', 'Galerie')} <span className="text-neon-cyan">{t('gallery_title_accent', 'Foto & Video')}</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('gallery_subtitle', 'Descoperă momentele speciale și energia unică din evenimentele mele')}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
            <p className="text-gray-300 mt-4">Se încarcă galeria...</p>
          </div>
        ) : allItems.length === 0 ? (
          <div className="text-center py-20">
            <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-4">{t('gallery_empty_title', 'Galeria este goală')}</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {t('gallery_empty_text', 'Momentan nu există imagini sau video-uri în galerie. Acestea vor fi adăugate în curând prin panoul de administrare.')}
            </p>
          </div>
        ) : (
          <>
            {categories.length > 1 && (
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Badge
                  variant="outline"
                  onClick={() => setActiveCategory(null)}
                  className={`cursor-pointer transition-colors ${
                    activeCategory === null
                      ? 'bg-neon-cyan text-black border-neon-cyan'
                      : 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black'
                  }`}
                >
                  Toate
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant="outline"
                    onClick={() => setActiveCategory(category)}
                    className={`cursor-pointer transition-colors ${
                      activeCategory === category
                        ? 'bg-neon-cyan text-black border-neon-cyan'
                        : 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black'
                    }`}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            )}

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
              {galleryItems.map((item, index) => (
                <Card
                  key={item.id}
                  className="group cursor-pointer overflow-hidden bg-gray-900 border-gray-800 hover:border-neon-cyan transition-all duration-300 mb-6 break-inside-avoid"
                  onClick={() => openLightbox(index)}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{
                      aspectRatio:
                        item.width && item.height ? `${item.width} / ${item.height}` : '1 / 1',
                    }}
                  >
                    {item.type === 'image' ? (
                      <img
                        src={item.thumbUrl ?? item.displayUrl ?? ''}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        width={item.width ?? undefined}
                        height={item.height ?? undefined}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="relative w-full h-full bg-gradient-to-br from-purple-900 to-black flex items-center justify-center">
                        {item.thumb_path && item.thumbUrl ? (
                          <img
                            src={item.thumbUrl}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : null}
                        <div className="relative bg-neon-cyan/20 rounded-full p-4 backdrop-blur-sm">
                          <Play className="w-12 h-12 text-neon-cyan fill-current" />
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-red-600 text-white text-xs">VIDEO</Badge>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <Badge variant="outline" className="border-neon-cyan text-neon-cyan">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {isLightboxOpen && selectedItem !== null && galleryItems[selectedItem] && (
          <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
            <DialogContent className="max-w-4xl w-full h-[90vh] bg-black border-gray-800 p-0">
              <div className="relative w-full h-full flex items-center justify-center">
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <button
                  onClick={prevItem}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextItem}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="w-full h-full flex items-center justify-center px-6 pt-12 pb-28 overflow-hidden">
                  {galleryItems[selectedItem].type === 'image' ? (
                    <img
                      src={galleryItems[selectedItem].displayUrl ?? ''}
                      alt={galleryItems[selectedItem].title}
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                    />
                  ) : isEmbed(galleryItems[selectedItem].video_url) ? (
                    <iframe
                      src={galleryItems[selectedItem].video_url ?? ''}
                      className="w-full h-full max-h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={galleryItems[selectedItem].title}
                    />
                  ) : (
                    <video
                      src={galleryItems[selectedItem].displayUrl ?? ''}
                      poster={
                        galleryItems[selectedItem].thumb_path
                          ? galleryItems[selectedItem].thumbUrl ?? undefined
                          : undefined
                      }
                      controls
                      playsInline
                      className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
                    />
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <h3 className="text-white text-xl font-semibold mb-2">
                    {galleryItems[selectedItem].title}
                  </h3>
                  <Badge variant="outline" className="border-neon-cyan text-neon-cyan">
                    {galleryItems[selectedItem].category}
                  </Badge>
                  <p className="text-gray-400 text-sm mt-2">
                    {selectedItem + 1} din {galleryItems.length}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
};

export default Gallery;
