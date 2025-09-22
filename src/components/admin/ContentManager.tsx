import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

interface ContentItem {
  id: string;
  content_key: string;
  content_value: string;
  content_type: string;
  description: string;
}

const ContentManager = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  // Date inițiale pentru conținut
  const initialContent: ContentItem[] = [
    {
      id: '1',
      content_key: 'hero_title',
      content_value: 'DJ Neon Vibes',
      content_type: 'text',
      description: 'Titlul principal de pe pagina de start'
    },
    {
      id: '2',
      content_key: 'hero_subtitle',
      content_value: 'Creez atmosfera perfectă pentru evenimentul tău',
      content_type: 'text',
      description: 'Subtitlul de pe pagina de start'
    },
    {
      id: '3',
      content_key: 'about_title',
      content_value: 'Despre Mine',
      content_type: 'text',
      description: 'Titlul secțiunii despre'
    },
    {
      id: '4',
      content_key: 'about_description',
      content_value: 'Cu peste 10 ani de experiență în industria muzicală, aduc energia și profesionalismul de care ai nevoie pentru evenimentul tău special.',
      content_type: 'textarea',
      description: 'Descrierea din secțiunea despre'
    }
  ];

  const loadContent = () => {
    try {
      const stored = localStorage.getItem('site_content');
      if (stored) {
        setContentItems(JSON.parse(stored));
      } else {
        // Dacă nu există conținut salvat, folosim datele inițiale
        setContentItems(initialContent);
        localStorage.setItem('site_content', JSON.stringify(initialContent));
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setContentItems(initialContent);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const updateContent = async (id: string, newValue: string) => {
    setSaving(id);
    try {
      const updatedItems = contentItems.map(item =>
        item.id === id ? { ...item, content_value: newValue } : item
      );
      
      setContentItems(updatedItems);
      localStorage.setItem('site_content', JSON.stringify(updatedItems));
      
      toast({
        title: "Succes",
        description: "Conținutul a fost actualizat cu succes!",
      });
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la actualizarea conținutului.",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setContentItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, content_value: value } : item
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Se încarcă conținutul...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Manager Conținut</h2>
        <p className="text-gray-400">Editează conținutul general al site-ului</p>
      </div>

      <div className="grid gap-6">
        {contentItems.map((item) => (
          <Card key={item.id} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">{item.content_key}</CardTitle>
              <CardDescription className="text-gray-400">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={item.id} className="text-white">
                  Conținut
                </Label>
                {item.content_type === 'textarea' ? (
                  <Textarea
                    id={item.id}
                    value={item.content_value}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    rows={4}
                  />
                ) : (
                  <Input
                    id={item.id}
                    value={item.content_value}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                )}
              </div>
              <Button
                onClick={() => updateContent(item.id, item.content_value)}
                disabled={saving === item.id}
                className="bg-neon-blue hover:bg-neon-blue/80 text-black"
              >
                {saving === item.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Se salvează...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvează
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentManager;