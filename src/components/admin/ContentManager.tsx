import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('content_key');

      if (error) throw error;
      setContentItems(data || []);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut încărca conținutul.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSave = async (item: ContentItem) => {
    setSaving(item.id);
    try {
      const { error } = await supabase
        .from('site_content')
        .update({ content_value: item.content_value })
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: 'Salvat',
        description: 'Conținutul a fost actualizat cu succes.',
      });
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut salva conținutul.',
        variant: 'destructive',
      });
    } finally {
      setSaving(null);
    }
  };

  const handleChange = (id: string, value: string) => {
    setContentItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, content_value: value } : item
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-2">
          <span className="gradient-text">Editare</span> Conținut
        </h2>
        <p className="text-muted-foreground">
          Modifică textul de pe site direct din acest panou.
        </p>
      </div>

      <div className="grid gap-6">
        {contentItems.map((item) => (
          <Card key={item.id} className="bg-card/30 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">{item.description}</CardTitle>
              <CardDescription>Cheie: {item.content_key}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={item.id}>Conținut</Label>
                {item.content_type === 'text' && item.content_value.length > 100 ? (
                  <Textarea
                    id={item.id}
                    value={item.content_value}
                    onChange={(e) => handleChange(item.id, e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                ) : (
                  <Input
                    id={item.id}
                    value={item.content_value}
                    onChange={(e) => handleChange(item.id, e.target.value)}
                    className="mt-1"
                  />
                )}
              </div>
              <Button
                onClick={() => handleSave(item)}
                disabled={saving === item.id}
                size="sm"
              >
                {saving === item.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Salvează
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentManager;