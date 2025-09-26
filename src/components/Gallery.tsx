import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight, Play, Upload } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  type: 'image' | 'video';
  src?: string;
  alt?: string;
  videoUrl?: string;
  videoType?: string;
  videoId?: string;
  thumbnail?: string;
  originalUrl?: string;
  created_at: string;
}

const Gallery = () => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Încărcăm imaginile din API
  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery.php');
      if (response.ok) {
        const items = await response.json();
        setGalleryItems(items);
      }
    } catch (error) {
      console.error('Eroare la încărcarea galeriei:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index: number) => {
    setSelectedItem(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedItem(null);
  };

  const nextItem = () => {
    if (selectedItem !== null) {
      setSelectedItem((selectedItem + 1) % galleryItems.length);
    }
  };

  const prevItem = () => {
    if (selectedItem !== null) {
      setSelectedItem(selectedItem === 0 ? galleryItems.length - 1 : selectedItem - 1);
    }
  };

  // Generăm categoriile unice
  const categories = Array.from(new Set(galleryItems.map(item => item.category)));

  return (
    <section id="gallery" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Galerie <span className="text-neon-cyan">Foto & Video</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descoperă momentele speciale și energia unică din evenimentele mele
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
            <p className="text-gray-300 mt-4">Se încarcă galeria...</p>
          </div>
        ) : galleryItems.length === 0 ? (
          <div className="text-center py-20">
            <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-4">Galeria este goală</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Momentan nu există imagini sau video-uri în galerie. 
              Acestea vor fi adăugate în curând prin panoul de administrare.
            </p>
          </div>
        ) : (
          <>
            {/* Filtre categorii */}
            {categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map((category) => (
                  <Badge 
                    key={category} 
                    variant="outline" 
                    className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors cursor-pointer"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            )}

            {/* Grid galerie */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item, index) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <Card 
                  className="group cursor-pointer overflow-hidden bg-gray-900 border-gray-800 hover:border-neon-cyan transition-all duration-300"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    {item.type === 'image' ? (
                      <img
                        src={item.src}
                        alt={item.alt || item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      // Preview pentru video cu thumbnail și icon play
                      <div className="relative w-full h-full">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="bg-neon-cyan/20 rounded-full p-4 backdrop-blur-sm">
                  <Play className="w-12 h-12 text-neon-cyan fill-current" />
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-red-600 text-white text-xs">
                            VIDEO
                          </Badge>
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
              </DialogTrigger>
            </Dialog>
          ))}
            </div>
          </>
        )}

        {/* Lightbox */}
        {isLightboxOpen && selectedItem !== null && (
          <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
            <DialogContent className="max-w-4xl w-full h-[90vh] bg-black border-gray-800 p-0">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Buton închidere */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Buton anterior */}
                <button
                  onClick={prevItem}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Buton următor */}
                <button
                  onClick={nextItem}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Conținutul - imagine sau video */}
                <div className="w-full h-full flex items-center justify-center p-8">
                  {galleryItems[selectedItem].type === 'image' ? (
                    <img
                      src={galleryItems[selectedItem].src}
                      alt={galleryItems[selectedItem].alt || galleryItems[selectedItem].title}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    // Verifică tipul de video pentru a decide între iframe și tag video
                    galleryItems[selectedItem].videoType === 'file' ? (
                      <video
                        src={galleryItems[selectedItem].videoUrl}
                        controls
                        className="max-w-full max-h-full rounded-lg"
                        style={{ maxWidth: '90vw', maxHeight: '90vh' }}
                      />
                    ) : (
                      <iframe
                        src={galleryItems[selectedItem].videoUrl}
                        className="w-full h-full rounded-lg"
                        style={{ maxWidth: '90vw', maxHeight: '90vh', minHeight: '500px' }}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={galleryItems[selectedItem].title}
                      />
                    )
                  )}
                </div>

                {/* Informații item */}
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