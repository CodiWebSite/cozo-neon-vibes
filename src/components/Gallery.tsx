import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

// Import imagini
import djPortrait from '@/assets/dj-portrait.jpg';
import heroImage from '@/assets/hero-dj-new.jpg';
import clubNight from '@/assets/club-night.jpg';
import privateParty from '@/assets/private-party.jpg';
import weddingDj from '@/assets/wedding-dj.jpg';
import corporateEvent from '@/assets/corporate-event.jpg';

interface GalleryItem {
  id: string;
  url?: string;
  iframe?: string;
  title: string;
  category: string;
  type: 'image' | 'video';
  thumbnail?: string; // Pentru preview-urile video-urilor
}

const Gallery = () => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Date pentru galerie - pozele din assets și video-urile Facebook
  const galleryItems: GalleryItem[] = [
    // Pozele din directorul assets
    {
      id: '1',
      url: djPortrait,
      title: 'DJ Cozo - Portret Profesional',
      category: 'Portrete',
      type: 'image'
    },
    {
      id: '2',
      url: heroImage,
      title: 'DJ în Acțiune',
      category: 'Performance',
      type: 'image'
    },
    {
      id: '3',
      url: clubNight,
      title: 'Noapte de Club',
      category: 'Evenimente Club',
      type: 'image'
    },
    {
      id: '4',
      url: privateParty,
      title: 'Petrecere Privată',
      category: 'Evenimente Private',
      type: 'image'
    },
    {
      id: '5',
      url: weddingDj,
      title: 'DJ pentru Nuntă',
      category: 'Nunți',
      type: 'image'
    },
    {
      id: '6',
      url: corporateEvent,
      title: 'Eveniment Corporate',
      category: 'Evenimente Corporate',
      type: 'image'
    },
    // Video-urile Facebook cu thumbnail-uri custom
    {
      id: '7',
      iframe: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F765208199668322%2F&show_text=false&width=267&t=0',
      title: 'DJ Cozo - Performance Live',
      category: 'Video Performance',
      type: 'video',
      thumbnail: djPortrait // Folosim o imagine ca thumbnail
    },
    {
      id: '8',
      iframe: 'https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1821184761810188%2F&show_text=false&width=267&t=0',
      title: 'DJ Cozo - Mix Session',
      category: 'Video Performance',
      type: 'video',
      thumbnail: clubNight // Folosim o imagine ca thumbnail
    }
  ];

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
            Galerie <span className="text-neon-blue">Foto & Video</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Descoperă momentele speciale și energia unică din evenimentele mele
          </p>
        </div>

        {/* Filtre categorii */}
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
          {galleryItems.map((item, index) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <Card 
                  className="group cursor-pointer overflow-hidden bg-gray-900 border-gray-800 hover:border-neon-blue transition-all duration-300"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.title}
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
                          <div className="bg-neon-blue/20 rounded-full p-4 backdrop-blur-sm">
                            <Play className="w-12 h-12 text-neon-blue fill-current" />
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
                        <Badge variant="outline" className="border-neon-blue text-neon-blue">
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
                      src={galleryItems[selectedItem].url}
                      alt={galleryItems[selectedItem].title}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <iframe
                      src={galleryItems[selectedItem].iframe}
                      width="400"
                      height="600"
                      style={{ border: 'none', overflow: 'hidden' }}
                      scrolling="no"
                      frameBorder="0"
                      allowFullScreen={true}
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      className="max-w-full max-h-full rounded-lg"
                    />
                  )}
                </div>

                {/* Informații item */}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <h3 className="text-white text-xl font-semibold mb-2">
                    {galleryItems[selectedItem].title}
                  </h3>
                  <Badge variant="outline" className="border-neon-blue text-neon-blue">
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