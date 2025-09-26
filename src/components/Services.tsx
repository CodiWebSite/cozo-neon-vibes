import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Music, Users, Building, Heart, Star, Check, Loader2 } from 'lucide-react';
import { getIconComponent } from '@/lib/iconUtils';
import weddingImage from "@/assets/wedding-dj.jpg";
import corporateImage from "@/assets/corporate-event.jpg";
import clubImage from "@/assets/club-night.jpg";
import privateImage from "@/assets/private-party.jpg";

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
  gradient: string;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Servicii implicite ca fallback
  const defaultServices: Service[] = [
    {
      id: 1,
      title: "Nunți",
      description: "Creez atmosfera perfectă pentru cea mai importantă zi din viața voastră",
      image: weddingImage,
      icon: "Heart",
      features: [
        "Consultanță muzicală personalizată",
        "Echipamente premium de sunet și lumini",
        "Mixuri personalizate pentru momentele speciale",
        "Backup complet pentru siguranță",
        "Coordonare cu fotograful și videograful"
      ],
      gradient: "from-pink-500 to-rose-500"
    },
    {
      id: 2,
      title: "Evenimente Corporate",
      description: "Profesionalism și eleganță pentru evenimentele voastre de business",
      image: corporateImage,
      icon: "Building",
      features: [
        "Prezentare profesională și discretă",
        "Muzică adaptată publicului corporate",
        "Sistem de sonorizare pentru prezentări",
        "Coordonare cu organizatorii evenimentului",
        "Flexibilitate în programul muzical"
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      title: "Cluburi & Baruri",
      description: "Energie pură și vibrații electrizante pentru nopțile de neuitat",
      image: clubImage,
      icon: "Music",
      features: [
        "Mixuri live adaptate energiei publicului",
        "Repertoriu vast de muzică electronică",
        "Interacțiune cu publicul",
        "Efecte speciale de lumini și sunet",
        "Experiență în cluburi de top"
      ],
      gradient: "from-purple-500 to-violet-500"
    },
    {
      id: 4,
      title: "Evenimente Private",
      description: "Petreceri personalizate pentru momente speciale cu prietenii",
      image: privateImage,
      icon: "Users",
      features: [
        "Atmosferă intimă și personalizată",
        "Playlist-uri create special pentru voi",
        "Echipamente adaptate spațiului",
        "Flexibilitate maximă în program",
        "Prețuri accesibile pentru grupuri mici"
      ],
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services.php');
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        // Convertim path-urile imaginilor pentru a folosi imaginile locale
        const servicesWithImages = data.map(service => ({
          ...service,
          image: getServiceImage(service.image)
        }));
        setServices(servicesWithImages);
        setError(null);
      } else {
        // Folosim serviciile implicite dacă API-ul nu returnează date
        setServices(defaultServices);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services - Se afișează serviciile implicite');
      setServices(defaultServices);
    } finally {
      setLoading(false);
    }
  };

  const getServiceImage = (imagePath: string) => {
    // Mapăm path-urile din API la imaginile locale
    const imageMap: { [key: string]: string } = {
      '/src/assets/wedding-dj.jpg': weddingImage,
      '/src/assets/corporate-event.jpg': corporateImage,
      '/src/assets/club-night.jpg': clubImage,
      '/src/assets/private-party.jpg': privateImage
    };
    
    return imageMap[imagePath] || imagePath;
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section id="services" className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
              <p className="text-gray-300">Se încarcă serviciile...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-cyan-400 text-cyan-400 mb-4">
            Servicii DJ Premium
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Servicii DJ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Premium</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Oferim servicii complete de DJ în Iași pentru toate tipurile de evenimente: DJ nunți, evenimente corporate, petreceri private și cluburi, cu echipamente premium și experiență vastă în Moldova
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm max-w-md mx-auto">
              {error}
            </div>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => {
            const IconComponent = getIconComponent(service.icon);
            return (
              <Card key={service.id} className="bg-black/40 border-gray-800 overflow-hidden hover:border-cyan-400/50 transition-all duration-300 group">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  
                  {/* Icon */}
                  <div className={`absolute top-4 right-4 p-3 rounded-full bg-gradient-to-r ${service.gradient} shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                    <p className="text-gray-300">{service.description}</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button 
                    onClick={scrollToContact}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                  >
                    Rezervă Acum
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;