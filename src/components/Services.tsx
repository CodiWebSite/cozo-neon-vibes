import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useContent } from "@/hooks/useContent";
import { getIconComponent } from '@/lib/iconUtils';
import weddingImage from '@/assets/wedding-dj.jpg';
import corporateImage from '@/assets/corporate-event.jpg';
import clubImage from '@/assets/club-night.jpg';
import privateImage from '@/assets/private-party.jpg';

const Services = () => {
  const { services: contextServices } = useContent();
  
  // Folosim serviciile din context dacă există, altfel folosim datele statice
  const defaultServices = [
    {
      icon: "Heart",
      title: "Nunți",
      description: "Muzică romantică și atmosferă perfectă pentru cea mai importantă zi din viața voastră.",
      image: weddingImage,
      features: ["Repertoriu personalizat", "Echipament premium", "Coordonare cu fotograful", "Backup garantat"],
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: "Building",
      title: "Evenimente Corporate",
      description: "Profesionalism și eleganță pentru conferințe, lansări de produse și petreceri corporative.",
      image: corporateImage,
      features: ["Prezentare discretă", "Muzică ambientală", "Echipament wireless", "Suport tehnic"],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: "PartyPopper",
      title: "Cluburi & Baruri",
      description: "Energie maximă și hits-uri care țin publicul pe ringul de dans toată noaptea.",
      image: clubImage,
      features: ["Mixing live", "Hits comerciale", "Lecturi de public", "Efecte speciale"],
      gradient: "from-purple-500 to-violet-500",
    },
    {
      icon: "Users",
      title: "Evenimente Private",
      description: "Petreceri private, aniversări și celebrări intime cu atmosfera dorită de tine.",
      image: privateImage,
      features: ["Playlist personalizat", "Flexibilitate maximă", "Echipament compact", "Preț accesibil"],
      gradient: "from-amber-500 to-orange-500",
    },
  ];
  
  // Folosim serviciile din context dacă există, altfel folosim datele statice
  const services = contextServices && contextServices.length > 0 ? contextServices : defaultServices;

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="servicii" className="section-spacing">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="neon-border text-primary mb-4">
            Servicii Premium
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            <span className="gradient-text">Servicii</span> pentru Orice{" "}
            <span className="gradient-text-secondary">Ocazie</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Oferă fiecărui eveniment atmosfera perfectă cu servicii DJ profesionale 
            adaptate nevoilor tale specifice.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const IconComponent = getIconComponent(typeof service.icon === 'string' ? service.icon : 'Music');
            return (
              <Card 
                key={index}
                className="group overflow-hidden bg-card/50 border-border/50 hover:neon-border smooth-transition"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image}
                    alt={`DJ Cozo ${service.title} Services`}
                    className="w-full h-full object-cover group-hover:scale-110 smooth-transition"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-background/80 to-transparent"></div>
                  
                  {/* Icon */}
                  <div className="absolute top-4 left-4">
                    <div className={`p-3 rounded-full bg-gradient-to-br ${service.gradient} glow-effect`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-heading font-bold text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {service.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    variant="outline"
                    className="w-full neon-border hover:glow-effect group-hover:bg-secondary/50 smooth-transition"
                    onClick={scrollToContact}
                  >
                    Rezervă pentru {service.title}
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