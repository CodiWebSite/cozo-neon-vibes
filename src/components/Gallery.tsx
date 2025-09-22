import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent, GalleryImage } from "@/hooks/useContent";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { galleryImages, loading } = useContent();

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
    }
  };

  const categories = Array.from(new Set(galleryImages.map(img => img.category)));

  if (loading) {
    return (
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Galerie</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Se încarcă galeria...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Galerie</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Descoperă momentele magice create la evenimentele noastre
          </p>
        </div>

        {/* Categorii */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Badge 
              key={category} 
              variant="outline" 
              className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black transition-colors cursor-pointer"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Grid galerie */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <Dialog key={image.id}>
              <DialogTrigger asChild>
                <Card 
                  className="group cursor-pointer overflow-hidden bg-gray-900 border-gray-800 hover:border-neon-blue transition-all duration-300"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={image.image_url}
                      alt={image.alt_text}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-lg font-semibold mb-2">{image.title}</h3>
                        <Badge variant="outline" className="border-neon-blue text-neon-blue">
                          {image.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </DialogTrigger>
            </Dialog>
          ))}
        </div>

        {/* Lightbox */}
        {isLightboxOpen && selectedImage !== null && (
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
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Buton următor */}
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Imaginea */}
                <div className="w-full h-full flex items-center justify-center p-8">
                  <img
                    src={galleryImages[selectedImage].image_url}
                    alt={galleryImages[selectedImage].alt_text}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Informații imagine */}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <h3 className="text-white text-xl font-semibold mb-2">
                    {galleryImages[selectedImage].title}
                  </h3>
                  <Badge variant="outline" className="border-neon-blue text-neon-blue">
                    {galleryImages[selectedImage].category}
                  </Badge>
                  <p className="text-gray-400 text-sm mt-2">
                    {selectedImage + 1} din {galleryImages.length}
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