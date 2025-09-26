import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Music, Award, Users, Clock } from 'lucide-react';
import djPortrait from "@/assets/dj-portrait.jpg";

const About = () => {
  const skills = [
    "Mixing Profesional",
    "Echipamente Premium", 
    "Repertoriu Vast",
    "Adaptabilitate",
    "Experiență Live",
    "Tehnologie Avansată"
  ];

  const stats = [
    {
      icon: Music,
      number: "500+",
      label: "Evenimente"
    },
    {
      icon: Award,
      number: "8+",
      label: "Ani Experiență"
    },
    {
      icon: Users,
      number: "10K+",
      label: "Oameni Fericiți"
    },
    {
      icon: Clock,
      number: "24/7",
      label: "Disponibilitate"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="border-cyan-400 text-cyan-400">
                Despre Mine
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                Pasiune și <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Profesionalism</span>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Sunt DJ Cozo, un DJ profesionist din Iași cu peste 8 ani de experiență în industria divertismentului. 
                Activez în Iași și întreaga regiune Moldova, specializat în evenimente premium unde aduc energie și atmosferă perfectă.
              </p>
              <p className="text-gray-400 leading-relaxed">
                De-a lungul carierei mele am avut privilegiul să contribui la crearea de momente magice la sute de evenimente în Iași - 
                de la DJ nunți romantice și evenimente corporate elegante până la cluburi exclusiviste și petreceri private în Moldova.
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Expertiza Mea:</h3>
              <div className="grid grid-cols-2 gap-3">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
                    <span className="text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-black/40 border-gray-800 p-4 text-center hover:border-cyan-400/50 transition-colors">
                  <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src={djPortrait} 
                alt="DJ Cozo - DJ profesionist cu experiență în Iași, specializat în nunți și evenimente" 
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            
            {/* Floating Element */}
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-cyan-400 to-purple-400 p-6 rounded-2xl shadow-2xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">DJ COZO</div>
                <div className="text-sm text-black/80">Professional DJ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;