import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music, Award, Users, Clock } from 'lucide-react';
import djPortrait from "@/assets/dj-portrait.jpg";
import { useContent } from "@/hooks/useContent";

const About = () => {
  const stats = [
    {
      icon: Music,
      number: "500+",
      label: "Evenimente Realizate",
    },
    {
      icon: Award,
      number: "8+",
      label: "Ani Experiență",
    },
    {
      icon: Users,
      number: "10K+",
      label: "Invitați Fericiți",
    },
    {
      icon: Clock,
      number: "24/7",
      label: "Disponibilitate",
    },
  ];

  const skills = [
    "Mixing Profesional",
    "Echipamente Premium",
    "Repertoriu Vast",
    "Adaptabilitate",
    "Experiență Live",
    "Muzică Personalizată"
  ];

  return (
    <section id="despre" className="section-spacing bg-gradient-to-b from-background to-secondary/20">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="neon-border text-primary">
                Despre Mine
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">
                <span className="gradient-text">Pasiune</span> și{" "}
                <span className="gradient-text-secondary">Profesionalism</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Sunt DJ Cozo, un artist pasionat de muzică cu peste 8 ani de experiență 
                în industria divertismentului. Specializat în evenimente premium, 
                aduc energie și atmosferă perfectă la fiecare eveniment.
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-muted-foreground">
                De-a lungul carierei mele am avut privilegiul să contribui la crearea 
                de momente magice la sute de evenimente - de la nunți romantice și 
                petreceri corporate elegante până la cluburi exclusiviste și petreceri private.
              </p>
              
              <div className="space-y-3">
                <h3 className="text-xl font-heading font-semibold text-foreground">
                  Expertiza Mea:
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {skills.map((skill, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-2 opacity-0 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                      <span className="text-sm text-muted-foreground">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              {stats.map((stat, index) => (
                <Card 
                  key={index}
                  className="p-4 bg-secondary/30 border-border/50 hover:neon-border smooth-transition group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:glow-effect smooth-transition">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xl font-heading font-bold gradient-text">
                        {stat.number}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src={djPortrait} 
                alt="DJ Cozo - Professional DJ Portrait" 
                className="w-full h-[600px] object-cover hover:scale-105 smooth-transition"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating Element */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full glow-effect animate-float flex items-center justify-center">
              <Music className="w-8 h-8 text-background" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;