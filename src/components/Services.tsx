import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Music, Users, Building, Heart, Star, Check, Loader2 } from 'lucide-react';
import { getIconComponent } from '@/lib/iconUtils';
import { useSiteContent } from '@/hooks/useSiteContent';
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
  const { t, tl } = useSiteContent();
  // Servicii afișate pe site
  const services: Service[] = [

    {
      id: 1,
      title: t('service_1_title', 'Nunți'),
      description: t('service_1_description', 'Creez atmosfera perfectă pentru cea mai importantă zi din viața voastră'),
      image: weddingImage,
      icon: "Heart",
      features: tl('service_1_features', [
        "Consultanță muzicală personalizată",
        "Echipamente premium de sunet și lumini",
        "Mixuri personalizate pentru momentele speciale",
        "Backup complet pentru siguranță",
        "Coordonare cu fotograful și videograful"
      ]),
      gradient: "from-pink-500 to-rose-500"
    },
    {
      id: 2,
      title: t('service_2_title', 'Evenimente Corporate'),
      description: t('service_2_description', 'Profesionalism și eleganță pentru evenimentele voastre de business'),
      image: corporateImage,
      icon: "Building",
      features: tl('service_2_features', [
        "Prezentare profesională și discretă",
        "Muzică adaptată publicului corporate",
        "Sistem de sonorizare pentru prezentări",
        "Coordonare cu organizatorii evenimentului",
        "Flexibilitate în programul muzical"
      ]),
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      title: t('service_3_title', 'Cluburi & Baruri'),
      description: t('service_3_description', 'Energie pură și vibrații electrizante pentru nopțile de neuitat'),
      image: clubImage,
      icon: "Music",
      features: tl('service_3_features', [
        "Mixuri live adaptate energiei publicului",
        "Repertoriu vast de muzică electronică",
        "Interacțiune cu publicul",
        "Efecte speciale de lumini și sunet",
        "Experiență în cluburi de top"
      ]),
      gradient: "from-purple-500 to-violet-500"
    },
    {
      id: 4,
      title: t('service_4_title', 'Evenimente Private'),
      description: t('service_4_description', 'Petreceri personalizate pentru momente speciale cu prietenii'),
      image: privateImage,
      icon: "Users",
      features: tl('service_4_features', [
        "Atmosferă intimă și personalizată",
        "Playlist-uri create special pentru voi",
        "Echipamente adaptate spațiului",
        "Flexibilitate maximă în program",
        "Prețuri accesibile pentru grupuri mici"
      ]),
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <section id="services" className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-cyan-400 text-cyan-400 mb-4">
            {t('services_badge', 'Servicii DJ Premium')}
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {t('services_title', 'Servicii DJ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">{t('services_title_accent', 'Premium')}</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('services_subtitle', 'Oferim servicii complete de DJ în Iași pentru toate tipurile de evenimente: DJ nunți, evenimente corporate, petreceri private și cluburi, cu echipamente premium și experiență vastă')}
          </p>
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
                    {t('services_button', 'Rezervă Acum')}
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