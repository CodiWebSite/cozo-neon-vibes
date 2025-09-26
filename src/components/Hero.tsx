import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Music, Headphones } from 'lucide-react';
import heroImage from "@/assets/hero-dj-new.jpg";
import { useTypewriter } from '@/hooks/useTypewriter';

const Hero = () => {
  const content = {
    title: 'Creez Experiențe Memorabile',
    subtitle: 'DJ Profesionist Iași',
    description: 'DJ profesionist în Iași cu peste 8 ani experiență în evenimente premium. Specializat în DJ nunți, evenimente corporate, petreceri private și cluburi exclusive în Moldova.',
    primaryButton: 'Rezervă DJ Acum',
    secondaryButton: 'Vezi Servicii DJ'
  };

  // Efectul de typing pentru titlu
  const typewriterWords = [
    'Experiențe Memorabile',
    'Momente Magice',
    'Petreceri Perfecte',
    'Atmosfera Ideală',
    'Energie Pură',
    'Vibrații Perfecte',
    'Spectacole Unice',
    'Amintiri de Neuitat'
  ];

  const { text: typedText, cursor } = useTypewriter({
    words: typewriterWords,
    typeSpeed: 120,
    deleteSpeed: 80,
    delayBetweenWords: 2500,
    loop: true,
    cursor: true
  });

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };



  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0">
        <video 
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster={heroImage}
        >
          <source src="/dj-showcase.mp4" type="video/mp4" />
          <source src="/dj-showcase.webm" type="video/webm" />
          {/* Fallback pentru browsere care nu suportă video */}
          <img 
            src={heroImage} 
            alt="DJ Cozo - DJ profesionist Iași pentru nunți, evenimente corporate și petreceri private" 
            className="w-full h-full object-cover"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-transparent"></div>
        <div className="absolute inset-0 hero-bg opacity-30"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 animate-float">
        <Music className="w-8 h-8 text-primary/30" />
      </div>
      <div className="absolute bottom-32 left-10 animate-float" style={{ animationDelay: '1s' }}>
        <Headphones className="w-12 h-12 text-accent/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom">
        <div className="max-w-4xl">
          <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-secondary/20 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 neon-border">
              <Play className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{content.subtitle}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
              <span className="block">Creez</span>
              <span className="block gradient-text typewriter-text">
                {typedText}
                <span className="typewriter-cursor">{cursor}</span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
              {content.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg"
                onClick={scrollToContact}
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:scale-105 smooth-transition glow-effect text-lg px-8 py-6"
              >
                <span className="relative z-10">{content.primaryButton}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 smooth-transition"></div>
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                onClick={scrollToServices}
                className="neon-border hover:glow-effect hover:bg-secondary/50 smooth-transition text-lg px-8 py-6"
              >
                {content.secondaryButton}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;