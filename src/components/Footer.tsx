import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import logoImg from '@/assets/dj-cozo-logo.png';

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentYear = new Date().getFullYear();

  const navLinks = [
    { id: 'despre', label: 'Despre' },
    { id: 'servicii', label: 'Servicii' },
    { id: 'pachete', label: 'Pachete' },
    { id: 'galerie', label: 'Galerie' },
    { id: 'testimoniale', label: 'Testimoniale' },
    { id: 'contact', label: 'Contact' },
  ];

  const services = [
    "DJ Nunți",
    "Evenimente Corporate", 
    "Cluburi & Baruri",
    "Petreceri Private",
    "Consultanță Muzicală",
    "Echipament Premium"
  ];

  return (
    <footer className="bg-gradient-to-b from-background to-secondary/30 border-t border-border/50">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center">
              <img 
                src={logoImg} 
                alt="DJ Cozo Logo" 
                className="h-20 w-auto object-contain"
              />
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              DJ profesionist cu pasiune pentru muzică și atmosferă perfectă. 
              Creez experiențe memorabile la fiecare eveniment.
            </p>

            <div className="space-y-2">
              <a 
                href="tel:+40749800325" 
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary smooth-transition"
              >
                <Phone className="w-4 h-4" />
                <span>+40 749 800 325</span>
              </a>
              <a 
                href="mailto:contact@djcozo.ro" 
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary smooth-transition"
              >
                <Mail className="w-4 h-4" />
                <span>contact@djcozo.ro</span>
              </a>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Iași, România</span>
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Navigare Rapidă
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-muted-foreground hover:text-primary smooth-transition block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Servicii Oferite
            </h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground text-sm">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Contactează-mă
            </h3>
            
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Disponibil 24/7 pentru consultații și rezervări. Răspund rapid la toate întrebările.
              </p>
              
              <div className="space-y-2">
                <a
                  href={`https://wa.me/40749800325?text=${encodeURIComponent("Salut DJ Cozo! Sunt interesat de serviciile tale.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg smooth-transition text-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.302 1.539-1.124 1.8-2.314 1.125l-2.895-2.135-1.396 1.342c-.155.155-.285.285-.583.285l.208-2.984 5.45-4.93c.238-.21-.05-.33-.37-.12L9.346 13.23l-2.896-.906c-.63-.196-.642-.63.135-.931l11.32-4.364c.52-.194.976.126.81.731z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
                
                <button
                  onClick={() => scrollToSection('contact')}
                  className="block w-full text-left bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg smooth-transition text-sm border border-primary/30"
                >
                  Formular Contact
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <span>© {currentYear} DJ Cozo. Toate drepturile rezervate.</span>
              <span className="text-border">•</span>
              <a href="/admin/auth" className="hover:text-primary smooth-transition text-xs opacity-50">Admin</a>
            </div>
            
            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <span>Făcut cu</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>pentru muzică</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;