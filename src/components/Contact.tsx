import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useContent } from "@/hooks/useContent";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  Calendar,
  Music,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';

const Contact = () => {
  const { getContent, contactInfo: contextContactInfo } = useContent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Folosim informațiile de contact din context dacă există, altfel folosim datele statice
  const defaultContactInfo = {
    phone: "+40 742 123 456",
    email: "contact@djcozo.ro",
    instagram: "https://www.instagram.com/djcozo",
    facebook: "https://www.facebook.com/djcozo",
    youtube: "https://www.youtube.com/djcozo",
    tiktok: "https://www.tiktok.com/@djcozo"
  };
  
  // Folosim informațiile de contact din context dacă există, altfel folosim datele statice
  const contactData = contextContactInfo ? contextContactInfo : defaultContactInfo;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    event_type: '',
    event_date: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Mesaj trimis cu succes!",
        description: "Îți voi răspunde în cel mai scurt timp posibil.",
      });
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        eventDate: '',
        message: ''
      });
    }, 1000);
  };

  const contactInfoDisplay = [
    {
      icon: Phone,
      title: "Telefon",
      detail: contactData.phone,
      action: `tel:${contactData.phone.replace(/\s+/g, '')}`
    },
    {
      icon: Mail,
      title: "Email",
      detail: contactData.email,
      action: `mailto:${contactData.email}`
    },
    {
      icon: MapPin,
      title: "Locație",
      detail: "Iași, România",
      action: null
    },
    {
      icon: Clock,
      title: "Program",
      detail: "24/7 Disponibil",
      action: null
    }
  ];

  const whatsappMessage = encodeURIComponent("Salut DJ Cozo! Sunt interesdat de serviciile tale pentru evenimentul meu. Poți să îmi dai mai multe detalii?");

  return (
    <section id="contact" className="section-spacing">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="neon-border text-primary mb-4">
            Contactează-mă
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Hai să Creăm <span className="gradient-text">Magie</span> Împreună
          </h2>
          <p className="text-lg text-muted-foreground">
            Sunt gata să transform evenimentul tău într-o experiență de neuitat. 
            Contactează-mă pentru o consultație gratuită!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8 bg-card/50 border-border/50 hover:neon-border smooth-transition">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-heading font-bold text-foreground">
                  Trimite-mi un mesaj
                </h3>
                <p className="text-muted-foreground">
                  Completează formularul și îți voi răspunde în maxim 2 ore
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Nume Complet *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ioan Popescu"
                      required
                      className="bg-background/50 border-border focus:neon-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Email *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="ioan@example.com"
                      required
                      className="bg-background/50 border-border focus:neon-border"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Telefon
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+40 749 800 325"
                      className="bg-background/50 border-border focus:neon-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Tip Eveniment *
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-background/50 border border-border rounded-md text-foreground focus:neon-border smooth-transition"
                    >
                      <option value="">Selectează tipul</option>
                      <option value="nunta">Nuntă</option>
                      <option value="corporate">Corporate</option>
                      <option value="club">Club/Bar</option>
                      <option value="private">Eveniment Privat</option>
                      <option value="altul">Altul</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Data Evenimentului
                  </label>
                  <Input
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="bg-background/50 border-border focus:neon-border"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Mesajul Tău *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Descrie-mi evenimentul tău, preferințele muzicale și orice alte detalii importante..."
                    rows={4}
                    required
                    className="bg-background/50 border-border focus:neon-border resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:scale-105 smooth-transition glow-effect text-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Se trimite...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>Trimite Mesajul</span>
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="p-8 bg-card/50 border-border/50 hover:neon-border smooth-transition">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-heading font-bold text-foreground">
                    Informații de Contact
                  </h3>
                  <p className="text-muted-foreground">
                    Sunt mereu disponibil pentru o discuție despre evenimentul tău
                  </p>
                </div>

                <div className="grid gap-4">
                  {contactInfoDisplay.map((info, index) => (
                    <div 
                      key={index}
                      className={`flex items-center space-x-4 p-4 bg-secondary/30 rounded-lg ${
                        info.action ? 'cursor-pointer hover:bg-secondary/50' : ''
                      } smooth-transition`}
                      onClick={info.action ? () => window.open(info.action) : undefined}
                    >
                      <div className="p-2 bg-primary/10 rounded-lg glow-effect">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{info.title}</p>
                        <p className="text-sm text-muted-foreground">{info.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* WhatsApp Quick Contact */}
            <Card className="p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 hover:border-green-500/50 smooth-transition">
              <div className="text-center space-y-4">
                <div className="inline-flex p-3 bg-green-500/20 rounded-full glow-effect">
                  <MessageCircle className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    Contact Rapid WhatsApp
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Pentru răspuns imediat, scrie-mi pe WhatsApp
                  </p>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white hover:scale-105 smooth-transition glow-effect"
                    onClick={() => window.open(`https://wa.me/40749800325?text=${whatsappMessage}`, '_blank')}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Scrie pe WhatsApp
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* Social Media Links */}
            <Card className="p-8 bg-card/50 border-border/50 hover:neon-border smooth-transition">
              <div className="text-center space-y-4">
                <div className="inline-flex p-3 bg-primary/10 rounded-full glow-effect">
                  <Music className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    Urmărește-mă
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Conectează-te cu mine pe rețelele sociale
                  </p>
                  <div className="flex gap-4 justify-center mt-6">
                    <a href={contactData.facebook} target="_blank" rel="noreferrer" className="p-3 bg-secondary/30 rounded-full hover:bg-secondary/50 smooth-transition">
                      <Facebook className="h-5 w-5 text-primary" />
                    </a>
                    <a href={contactData.instagram} target="_blank" rel="noreferrer" className="p-3 bg-secondary/30 rounded-full hover:bg-secondary/50 smooth-transition">
                      <Instagram className="h-5 w-5 text-primary" />
                    </a>
                    <a href={contactData.youtube} target="_blank" rel="noreferrer" className="p-3 bg-secondary/30 rounded-full hover:bg-secondary/50 smooth-transition">
                      <Youtube className="h-5 w-5 text-primary" />
                    </a>
                    <a href={contactData.tiktok} target="_blank" rel="noreferrer" className="p-3 bg-secondary/30 rounded-full hover:bg-secondary/50 smooth-transition">
                      <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.321 5.562a5.122 5.122 0 0 1-3.414-1.267 5.133 5.133 0 0 1-1.635-3.257h-3.858v13.506c0 1.741-1.416 3.158-3.158 3.158-1.742 0-3.158-1.417-3.158-3.158 0-1.741 1.416-3.158 3.158-3.158.348 0 .682.058 1 .16v-3.9a7.067 7.067 0 0 0-1-.072C3.158 7.574 0 10.732 0 14.63s3.158 7.058 7.056 7.058c3.899 0 7.056-3.158 7.056-7.058V9.321c1.537 1.094 3.399 1.745 5.209 1.745v-3.9c0-1.604 0-1.604 0-1.604Z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;