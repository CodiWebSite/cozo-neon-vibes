import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoImg from '@/assets/dj-cozo-logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'despre', label: 'Despre' },
    { id: 'servicii', label: 'Servicii' },
    { id: 'pachete', label: 'Pachete' },
    { id: 'galerie', label: 'Galerie' },
    { id: 'testimoniale', label: 'Testimoniale' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 smooth-transition ${
        isScrolled 
          ? 'bg-background/90 backdrop-blur-lg border-b border-border elegant-shadow' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => scrollToSection('hero')}
          >
            <img 
              src={logoImg} 
              alt="DJ Cozo Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-foreground/80 hover:text-primary smooth-transition font-medium relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent smooth-transition group-hover:w-full"></span>
              </button>
            ))}
            <Button 
              variant="outline" 
              className="neon-border hover:glow-effect smooth-transition"
              onClick={() => scrollToSection('contact')}
            >
              Rezervă Acum
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-card/95 backdrop-blur-lg border border-border rounded-lg mt-2 elegant-shadow">
            <div className="flex flex-col space-y-2 p-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left p-3 text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-lg smooth-transition"
                >
                  {item.label}
                </button>
              ))}
              <Button 
                className="mt-2 w-full neon-border hover:glow-effect"
                onClick={() => scrollToSection('contact')}
              >
                Rezervă Acum
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;