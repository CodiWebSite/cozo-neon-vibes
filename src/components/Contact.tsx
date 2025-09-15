import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  Calendar,
  Music
} from 'lucide-react';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    message: ''
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

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefon",
      detail: "+40 749 800 325",
      action: "tel:+40749800325"
    },
    {
      icon: Mail,
      title: "Email",
      detail: "contact@djcozo.ro",
      action: "mailto:contact@djcozo.ro"
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
                  {contactInfo.map((info, index) => (
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;