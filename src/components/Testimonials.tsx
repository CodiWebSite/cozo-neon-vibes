import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Maria & Alexandru Popescu",
      event: "Nuntă - Septembrie 2024",
      rating: 5,
      text: "DJ Cozo a făcut nunta noastră să fie perfectă! Muzica a fost exact ce ne-am dorit și toți invitații au dansat până dimineața. Profesionalism de 10 stele!",
      initials: "MP"
    },
    {
      name: "Ana Gheorghe",
      event: "Eveniment Corporate - August 2024",
      rating: 5,
      text: "Pentru lansarea produsului nostru aveam nevoie de cineva profesionist care să creeze atmosfera potrivită. DJ Cozo a depășit toate așteptările!",
      initials: "AG"
    },
    {
      name: "Club Platinum",
      event: "Evenimente Săptămânale",
      rating: 5,
      text: "Colaborăm cu DJ Cozo de peste 2 ani. Știe perfect să citească publicul și să mențină energia pe ringul de dans. Un adevărat profesionist!",
      initials: "CP"
    },
    {
      name: "Mihai Ionescu",
      event: "Aniversare 40 ani - Iulie 2024",
      rating: 5,
      text: "Petrecerea aniversării mele a fost un succes total datorită lui DJ Cozo. Atmosferă perfectă, muzică variată și un DJ care știe să facă show!",
      initials: "MI"
    },
    {
      name: "Elena & Radu Cristea",
      event: "Nuntă - Iunie 2024",
      rating: 5,
      text: "Am avut o nuntă de vis! DJ Cozo a respectat toate cerințele noastre muzicale și a adăugat și surprize care au încântat invitații. Mulțumim!",
      initials: "EC"
    },
    {
      name: "TechFlow Solutions",
      event: "Team Building - Mai 2024",
      rating: 5,
      text: "Evenimentul nostru de team building a fost animat perfect de DJ Cozo. Echipa lui profesională și adaptabilitatea au făcut diferența!",
      initials: "TS"
    }
  ];

  return (
    <section id="testimoniale" className="section-spacing bg-gradient-to-b from-background to-secondary/20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="neon-border text-primary mb-4">
            Ce Spun Clienții
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            <span className="gradient-text">Experiențe</span> Autentice
          </h2>
          <p className="text-lg text-muted-foreground">
            Feedback-ul clienților noștri vorbește despre calitatea și profesionalismul 
            cu care abordăm fiecare eveniment.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="group bg-card/50 border-border/50 hover:neon-border smooth-transition p-6 relative overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-20">
                <Quote className="w-8 h-8 text-primary" />
              </div>

              <div className="space-y-4">
                {/* Stars */}
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i}
                      className="w-4 h-4 fill-primary text-primary" 
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-muted-foreground leading-relaxed text-sm">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-3 pt-4 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect">
                    <span className="text-sm font-bold text-background">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.event}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 smooth-transition pointer-events-none"></div>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-heading font-bold gradient-text mb-2">
              98%
            </div>
            <p className="text-sm text-muted-foreground">
              Clienți Mulțumiți
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading font-bold gradient-text mb-2">
              500+
            </div>
            <p className="text-sm text-muted-foreground">
              Evenimente Reușite
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading font-bold gradient-text mb-2">
              5⭐
            </div>
            <p className="text-sm text-muted-foreground">
              Rating Mediu
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading font-bold gradient-text mb-2">
              100%
            </div>
            <p className="text-sm text-muted-foreground">
              Recomandări
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;