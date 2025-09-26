import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Star, Zap, Crown, Package, Loader2 } from 'lucide-react';

interface PackageItem {
  id: string;
  name: string;
  icon: string;
  duration: string;
  description: string;
  features: string[];
  popular: boolean;
  gradient: string;
  created_at: string;
  updated_at: string;
}

const Packages = () => {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mapare iconuri
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    'Zap': Zap,
    'Star': Star,
    'Crown': Crown,
    'Package': Package,
  };

  // Fetch packages from API
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/packages.php');
      
      if (!response.ok) {
        throw new Error('Failed to fetch packages');
      }
      
      const data = await response.json();
      
      // API-ul returnează direct un array de pachete
      if (Array.isArray(data)) {
        setPackages(data);
        setError(null);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load packages');
      
      // Fallback la datele statice în caz de eroare
      setPackages([
        {
          id: '1',
          name: "Starter",
          icon: "Zap",
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
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: "Professional",
          icon: "Star",
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
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          name: "Premium",
          icon: "Crown",
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
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Loading state
  if (loading) {
    return (
      <section id="pachete" className="section-spacing bg-gradient-to-b from-secondary/20 to-background">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="neon-border text-primary mb-4">
              Pachete Disponibile
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              Alege <span className="gradient-text">Pachetul</span> Perfect
            </h2>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-lg text-muted-foreground">Se încarcă pachetele...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
              <p className="text-red-400 text-sm">
                {error} - Se afișează pachetele implicite.
              </p>
            </div>
          )}
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 pt-8">
          {packages.map((pkg, index) => {
            const IconComponent = iconMap[pkg.icon] || Package;
            
            return (
              <div key={pkg.id || index} className={`${pkg.popular ? 'pt-8' : 'pt-0'} flex flex-col h-full`}>
                <Card 
                  className={`relative group flex-1 ${
                    pkg.popular 
                      ? 'ring-2 ring-primary/50 bg-card/80 border-primary/30 transform scale-105 mt-4' 
                      : 'bg-card/50 border-border/50'
                  } hover:neon-border smooth-transition`}
                >
                  {/* Popular Badge */}
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className={`bg-gradient-to-r ${pkg.gradient} text-white glow-effect px-6 py-2 text-sm font-semibold whitespace-nowrap shadow-lg`}>
                        Cel Mai Popular
                      </Badge>
                    </div>
                  )}

                  <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-4">
                      <div className={`inline-flex p-3 rounded-full bg-gradient-to-br ${pkg.gradient} glow-effect`}>
                        <IconComponent className="w-6 h-6 text-white" />
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
            </div>
            );
          })}
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