import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import heroImage from '@/assets/hero-dj.jpg';
import weddingImage from '@/assets/wedding-dj.jpg';
import corporateImage from '@/assets/corporate-event.jpg';
import clubImage from '@/assets/club-night.jpg';
import privateImage from '@/assets/private-party.jpg';
import djPortrait from '@/assets/dj-portrait.jpg';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const images = [
    {
      src: heroImage,
      alt: "DJ Cozo in actiune la un eveniment premium",
      category: "Club Events"
    },
    {
      src: weddingImage,
      alt: "Setup DJ profesional pentru nunta eleganta",
      category: "Weddings"
    },
    {
      src: corporateImage,
      alt: "Eveniment corporate cu DJ Cozo",
      category: "Corporate"
    },
    {
      src: clubImage,
      alt: "Atmosfera de club cu DJ Cozo",
      category: "Club Events"
    },
    {
      src: privateImage,
      alt: "Petrecere privata cu DJ Cozo",
      category: "Private"
    },
    {
      src: djPortrait,
      alt: "DJ Cozo - portret profesional",
      category: "Studio"
    }
  ];

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
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  return (
    <section id="galerie" className="section-spacing">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="neon-border text-primary mb-4">
            Galerie Foto
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            <span className="gradient-text">Momente</span> Captivante
          </h2>
          <p className="text-lg text-muted-foreground">
            O privire în culisele evenimentelor pe care le-am animat și momentele 
            speciale pe care le-am contribuit să le creez.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <Card 
              key={index}
              className="group overflow-hidden cursor-pointer bg-card/30 border-border/50 hover:neon-border smooth-transition"
              onClick={() => openLightbox(index)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 smooth-transition"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 smooth-transition">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-background/90 backdrop-blur-sm rounded-full p-4 glow-effect">
                      <svg 
                        className="w-6 h-6 text-primary" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-background/80 text-primary border-primary/30">
                    {image.category}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Lightbox */}
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogContent className="max-w-4xl w-full h-full max-h-[90vh] p-0 bg-background/95 border-border">
            {selectedImage !== null && (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Close Button */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 z-50 p-2 bg-background/80 rounded-full hover:bg-background smooth-transition"
                >
                  <X className="w-6 h-6 text-foreground" />
                </button>

                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 p-3 bg-background/80 rounded-full hover:bg-background smooth-transition hover:glow-effect"
                >
                  <ChevronLeft className="w-6 h-6 text-foreground" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 p-3 bg-background/80 rounded-full hover:bg-background smooth-transition hover:glow-effect"
                >
                  <ChevronRight className="w-6 h-6 text-foreground" />
                </button>

                {/* Image */}
                <img 
                  src={images[selectedImage].src}
                  alt={images[selectedImage].alt}
                  className="max-w-full max-h-full object-contain"
                />

                {/* Image Info */}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 elegant-shadow">
                    <p className="text-foreground font-medium">
                      {images[selectedImage].alt}
                    </p>
                    <Badge className="mt-2 bg-primary/20 text-primary">
                      {images[selectedImage].category}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Gallery;