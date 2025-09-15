import { Button } from '@/components/ui/button';
import { Play, Music, Headphones } from 'lucide-react';
import heroImage from '@/assets/hero-dj.jpg';

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('servicii');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="DJ Cozo - Professional DJ Services" 
          className="w-full h-full object-cover"
        />
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
              <span className="text-sm font-medium text-primary">DJ Profesionist</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
              <span className="block">Creez</span>
              <span className="block gradient-text">Experiențe</span>
              <span className="block">Memorabile</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
              DJ profesionist cu peste 8 ani experiență în evenimente premium. 
              De la nunți elegante la petreceri corporate și cluburi exclusive.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg"
                onClick={scrollToContact}
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:scale-105 smooth-transition glow-effect text-lg px-8 py-6"
              >
                <span className="relative z-10">Rezervă Acum</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 smooth-transition"></div>
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                onClick={scrollToServices}
                className="neon-border hover:glow-effect hover:bg-secondary/50 smooth-transition text-lg px-8 py-6"
              >
                Vezi Servicii
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