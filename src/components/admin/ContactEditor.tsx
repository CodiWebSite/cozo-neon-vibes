import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useContent } from '@/hooks/useContent';
import { Save, Phone, Mail, MapPin } from 'lucide-react';

// Tipul pentru informațiile de contact (local, cu proprietăți suplimentare)
interface LocalContactInfo {
  phone: string;
  email: string;
  address: string;
  workHours: string;
  mapEmbed: string;
}

// Date inițiale pentru contact
const initialContactData: LocalContactInfo = {
  phone: '+40 722 123 456',
  email: 'contact@dj-neonvibes.ro',
  address: 'Strada Exemplu, Nr. 123, București',
  workHours: 'Luni - Vineri: 10:00 - 18:00',
  mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d91158.11089630395!2d26.0311529!3d44.439663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1f93abf3cad4f%3A0xac0632e37c9ca628!2sBucure%C8%99ti!5e0!3m2!1sro!2sro!4v1654789123456!5m2!1sro!2sro" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
};

const ContactEditor = () => {
  const { updateContactInfo } = useContent();
  const [contactInfo, setContactInfo] = useState<LocalContactInfo>(initialContactData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Simulăm încărcarea datelor din baza de date
  useEffect(() => {
    const loadContactData = async () => {
      try {
        // Aici ar trebui să încarci datele din baza de date
        // Pentru moment, folosim datele inițiale
        setContactInfo(initialContactData);
        
        // Convertim LocalContactInfo la ContactInfo pentru hook
        const contactForHook = {
          phone: initialContactData.phone,
          email: initialContactData.email,
          address: initialContactData.address,
          schedule: initialContactData.workHours
        };
        updateContactInfo(contactForHook);
      } catch (error) {
        console.error('Eroare la încărcarea datelor de contact:', error);
        toast({
          title: 'Eroare',
          description: 'Nu s-au putut încărca datele de contact.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadContactData();
  }, [toast, updateContactInfo]);

  const handleInputChange = (field: keyof LocalContactInfo, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    handleInputChange(name as keyof LocalContactInfo, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Convertim LocalContactInfo la ContactInfo pentru hook
      const contactForHook = {
        phone: contactInfo.phone,
        email: contactInfo.email,
        address: contactInfo.address,
        schedule: contactInfo.workHours
      };
      
      // Actualizăm informațiile de contact în contextul global (async)
      await updateContactInfo(contactForHook);
      
      // Aici ar trebui să salvezi în baza de date
      console.log('Informațiile de contact au fost actualizate:', contactInfo);
      
      toast({
        title: 'Salvat cu succes',
        description: 'Informațiile de contact au fost actualizate.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Eroare la salvarea datelor de contact:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut salva modificările.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-bold mb-6">Editor Informații Contact</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Telefon
            </Label>
            <Input
              id="phone"
              name="phone"
              value={contactInfo.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={contactInfo.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Adresă
            </Label>
            <Input
              id="address"
              name="address"
              value={contactInfo.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workHours">Program de lucru</Label>
            <Input
              id="workHours"
              name="workHours"
              value={contactInfo.workHours}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mapEmbed">Cod embed hartă Google</Label>
            <Textarea
              id="mapEmbed"
              name="mapEmbed"
              value={contactInfo.mapEmbed}
              onChange={handleChange}
              rows={4}
            />
          </div>
          
          <div className="pt-4">
            <Button onClick={handleSubmit} className="w-full" disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Se salvează...' : 'Salvează modificările'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactEditor;