import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

// Date inițiale pentru secțiunea About
const initialAboutData = {
  title: 'Despre DJ Cozo',
  subtitle: 'Experiență și pasiune pentru muzică',
  description: 'Cu peste 10 ani de experiență în industria muzicală, DJ Cozo aduce energia și atmosfera perfectă pentru orice eveniment. Specializat în evenimente private, nunți, petreceri corporative și cluburi, DJ Cozo creează experiențe muzicale memorabile adaptate perfect pentru publicul tău.',
  imageUrl: '/src/assets/dj-portrait.jpg'
};

const AboutEditor = () => {
  const [aboutData, setAboutData] = useState(initialAboutData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulăm încărcarea datelor
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAboutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Simulăm salvarea datelor cu async/await
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: 'Salvat cu succes',
        description: 'Informațiile despre DJ Cozo au fost actualizate.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Eroare la salvarea datelor despre DJ:', error);
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titlu</Label>
            <Input
              id="title"
              name="title"
              value={aboutData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitlu</Label>
            <Input
              id="subtitle"
              name="subtitle"
              value={aboutData.subtitle}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descriere</Label>
            <Textarea
              id="description"
              name="description"
              value={aboutData.description}
              onChange={handleChange}
              rows={6}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL Imagine</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              value={aboutData.imageUrl}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="pt-4">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se salvează...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvează modificările
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AboutEditor;