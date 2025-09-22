import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { useContent } from "@/hooks/useContent";

const Packages = () => {
  const { getContent, packages: contextPackages } = useContent();
  
  // Folosim pachetele din context dacă există, altfel folosim datele statice
  const defaultPackages = [
    {
      name: "Starter",
      icon: Zap,
      price: "400",
      duration: "4 ore",
      description: "Perfect pentru petreceri mici și evenimente private",
      features: [
        "Echipament DJ profesional",
        "Repertoriu standard",
        "Mixing live 4 ore",
        "Sisteme audio de bază",
        "Suport tehnic"
      ],
      popular: false,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Professional",
      icon: Star,
      price: "650",
      duration: "6 ore",
      description: "Cel mai popular pachet pentru nunți și evenimente corporate",
      features: [
        "Echipament premium",
        "Repertoriu extins personalizat",
        "Mixing live 6 ore",
        "Sisteme audio profesionale",
        "Iluminat de bază",
        "Coordonare cu fotograful",
        "Backup complet echipament"
      ],
      popular: true,
      gradient: "from-purple-500 to-violet-500",
    },
    {
      name: "Premium",
      icon: Crown,
      price: "900",
      duration: "8 ore",
      description: "Experiență completă cu toate serviciile incluse",
      features: [
        "Echipament top premium",
        "Repertoriu nelimitat",
        "Mixing live 8 ore",
        "Sisteme audio high-end",
        "Show de lumini complet",
        "DJ backup disponibil",
        "Coordonare completă eveniment",
        "Efecte speciale",
        "Consultanță muzicală"
      ],
      popular: false,
      gradient: "from-amber-500 to-orange-500",
    },
  ];
  
  // Folosim pachetele din context dacă există, altfel folosim datele statice
  const packages = contextPackages && contextPackages.length > 0 ? contextPackages : defaultPackages;

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pachete" className="section-spacing bg-gradient-to-b from-secondary/20 to-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="neon-border text-primary mb-4">
            Pachete Disponibile
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Alege <span className="gradient-text">Pachetul</span> Perfect
          </h2>
          <p className="text-lg text-muted-foreground">
            Pachete complete adaptate pentru orice tip de eveniment. 
            Servicii profesionale cu echipament, transport și setup inclus.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <Card 
              key={index}
              className={`relative overflow-hidden group ${
                pkg.popular 
                  ? 'ring-2 ring-primary/50 bg-card/80 border-primary/30 scale-105' 
                  : 'bg-card/50 border-border/50'
              } hover:neon-border smooth-transition`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Badge className={`bg-gradient-to-r ${pkg.gradient} text-white glow-effect px-4 py-1`}>
                    Cel Mai Popular
                  </Badge>
                </div>
              )}

              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                  <div className={`inline-flex p-3 rounded-full bg-gradient-to-br ${pkg.gradient} glow-effect`}>
                    <pkg.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-lg font-semibold gradient-text">
                      {pkg.duration} eveniment
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {pkg.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex}
                      className="flex items-center space-x-3"
                    >
                      <div className={`p-1 rounded-full bg-gradient-to-br ${pkg.gradient}`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className={`w-full ${
                    pkg.popular 
                      ? `bg-gradient-to-r ${pkg.gradient} hover:scale-105 glow-effect text-white` 
                      : 'neon-border hover:glow-effect hover:bg-secondary/50'
                  } smooth-transition`}
                  onClick={scrollToContact}
                >
                  {pkg.popular ? 'Rezervă Acum' : 'Selectează Pachetul'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Toate pachetele includ transport în raza de 50km de Iași
          </p>
          <Button variant="outline" className="neon-border hover:glow-effect" onClick={scrollToContact}>
            Solicită Ofertă Personalizată
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Packages;