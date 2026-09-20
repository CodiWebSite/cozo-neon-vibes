import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { resolveGalleryItems, type GalleryRow } from '@/lib/galleryUrls';
import { Loader2, Trash2, Upload, LogOut, Save, Mail, ExternalLink } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  event_type: string | null;
  event_date: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminPanel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  /* ---------------- Galerie ---------------- */
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [videoUrl, setVideoUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const galleryQuery = useQuery({
    queryKey: ['admin_gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return resolveGalleryItems((data ?? []) as GalleryRow[]);
    },
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !videoUrl.trim()) {
      toast({ title: 'Alege o poză sau adaugă un link video', variant: 'destructive' });
      return;
    }
    setUploading(true);
    try {
      if (file) {
        const ext = file.name.split('.').pop() ?? 'jpg';
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('gallery').upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });
        if (uploadError) throw uploadError;

        const isVideo = file.type.startsWith('video/');
        const { error } = await supabase.from('gallery_items').insert({
          title: title || file.name,
          category,
          type: isVideo ? 'video' : 'image',
          src: isVideo ? null : path,
          video_url: isVideo ? path : null,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.from('gallery_items').insert({
          title: title || 'Video',
          category,
          type: 'video',
          video_url: videoUrl.trim(),
        });
        if (error) throw error;
      }

      toast({ title: 'Adăugat în galerie' });
      setTitle('');
      setVideoUrl('');
      setFile(null);
      (document.getElementById('gallery-file') as HTMLInputElement | null)?.value &&
        ((document.getElementById('gallery-file') as HTMLInputElement).value = '');
      queryClient.invalidateQueries({ queryKey: ['admin_gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery_items'] });
    } catch (error: unknown) {
      toast({
        title: 'Încărcarea a eșuat',
        description: error instanceof Error ? error.message : 'Încearcă din nou.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteItem = async (id: string, storagePath: string | null) => {
    const { error } = await supabase.from('gallery_items').delete().eq('id', id);
    if (error) {
      toast({ title: 'Nu am putut șterge', description: error.message, variant: 'destructive' });
      return;
    }
    if (storagePath && !/^https?:\/\//i.test(storagePath)) {
      await supabase.storage.from('gallery').remove([storagePath]);
    }
    toast({ title: 'Șters din galerie' });
    queryClient.invalidateQueries({ queryKey: ['admin_gallery'] });
    queryClient.invalidateQueries({ queryKey: ['gallery_items'] });
  };

  /* ---------------- Conținut ---------------- */
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const contentQuery = useQuery({
    queryKey: ['admin_site_content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const saveContent = async (key: string, value: string) => {
    setSavingKey(key);
    const { error } = await supabase
      .from('site_content')
      .update({ content_value: value })
      .eq('content_key', key);
    setSavingKey(null);
    if (error) {
      toast({ title: 'Nu am putut salva', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Text salvat' });
    queryClient.invalidateQueries({ queryKey: ['admin_site_content'] });
    queryClient.invalidateQueries({ queryKey: ['site_content'] });
  };

  /* ---------------- Mesaje ---------------- */
  const messagesQuery = useQuery({
    queryKey: ['admin_messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as ContactMessage[];
    },
  });

  const toggleRead = async (message: ContactMessage) => {
    await supabase.from('contact_messages').update({ is_read: !message.is_read }).eq('id', message.id);
    queryClient.invalidateQueries({ queryKey: ['admin_messages'] });
  };

  const deleteMessage = async (id: string) => {
    await supabase.from('contact_messages').delete().eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['admin_messages'] });
  };

  const sections = Array.from(new Set((contentQuery.data ?? []).map((row) => row.section)));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/40 backdrop-blur-sm sticky top-0 z-20">
        <div className="container-custom flex items-center justify-between py-4">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">Panou Administrare</h1>
            <p className="text-sm text-muted-foreground">Gestionează galeria, textele și mesajele</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.open('/', '_blank')}>
              <ExternalLink className="w-4 h-4 mr-2" /> Vezi site-ul
            </Button>
            <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>
              <LogOut className="w-4 h-4 mr-2" /> Ieși
            </Button>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        <Tabs defaultValue="galerie" className="space-y-6">
          <TabsList>
            <TabsTrigger value="galerie">Galerie</TabsTrigger>
            <TabsTrigger value="continut">Texte site</TabsTrigger>
            <TabsTrigger value="mesaje">
              Mesaje
              {(messagesQuery.data ?? []).some((m) => !m.is_read) && (
                <Badge className="ml-2 bg-primary text-white">
                  {(messagesQuery.data ?? []).filter((m) => !m.is_read).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* GALERIE */}
          <TabsContent value="galerie" className="space-y-6">
            <Card className="p-6 space-y-4 bg-card/50">
              <h2 className="text-lg font-heading font-bold text-foreground">Adaugă în galerie</h2>
              <form onSubmit={handleUpload} className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Titlu</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nuntă la Palas" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Categorie</label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="nunti" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Poză sau video (fișier)</label>
                  <Input
                    id="gallery-file"
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">sau link video (YouTube / Facebook)</label>
                  <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={uploading} className="bg-gradient-to-r from-primary to-accent text-white">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                    Adaugă
                  </Button>
                </div>
              </form>
            </Card>

            {galleryQuery.isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (galleryQuery.data ?? []).length === 0 ? (
              <p className="text-muted-foreground">Galeria este goală. Adaugă primele poze mai sus.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {(galleryQuery.data ?? []).map((item) => (
                  <Card key={item.id} className="overflow-hidden bg-card/50">
                    <div className="aspect-square bg-secondary/30 flex items-center justify-center overflow-hidden">
                      {item.type === 'image' && item.displayUrl ? (
                        <img src={item.displayUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-muted-foreground px-2 text-center break-all">VIDEO</span>
                      )}
                    </div>
                    <div className="p-3 space-y-2">
                      <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{item.category}</Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteItem(item.id, item.src ?? item.video_url)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* CONTINUT */}
          <TabsContent value="continut" className="space-y-6">
            {contentQuery.isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (
              sections.map((section) => (
                <Card key={section} className="p-6 space-y-4 bg-card/50">
                  <h2 className="text-lg font-heading font-bold text-foreground">{section}</h2>
                  {(contentQuery.data ?? [])
                    .filter((row) => row.section === section)
                    .map((row) => {
                      const value = drafts[row.content_key] ?? row.content_value;
                      const long = row.content_value.length > 80;
                      return (
                        <div key={row.content_key} className="space-y-2">
                          <label className="text-sm font-medium text-foreground">{row.label}</label>
                          {long ? (
                            <Textarea
                              rows={3}
                              value={value}
                              onChange={(e) => setDrafts({ ...drafts, [row.content_key]: e.target.value })}
                            />
                          ) : (
                            <Input
                              value={value}
                              onChange={(e) => setDrafts({ ...drafts, [row.content_key]: e.target.value })}
                            />
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={savingKey === row.content_key || value === row.content_value}
                            onClick={() => saveContent(row.content_key, value)}
                          >
                            {savingKey === row.content_key ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                              <Save className="w-4 h-4 mr-2" />
                            )}
                            Salvează
                          </Button>
                        </div>
                      );
                    })}
                </Card>
              ))
            )}
          </TabsContent>

          {/* MESAJE */}
          <TabsContent value="mesaje" className="space-y-4">
            {messagesQuery.isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (messagesQuery.data ?? []).length === 0 ? (
              <p className="text-muted-foreground">Nu ai niciun mesaj încă.</p>
            ) : (
              (messagesQuery.data ?? []).map((message) => (
                <Card key={message.id} className={`p-6 space-y-3 bg-card/50 ${message.is_read ? '' : 'border-primary/50'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">{message.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {message.email}
                        {message.phone ? ` · ${message.phone}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {message.event_type && <Badge variant="outline">{message.event_type}</Badge>}
                      {message.event_date && <Badge variant="outline">{message.event_date}</Badge>}
                      {!message.is_read && <Badge className="bg-primary text-white">Nou</Badge>}
                    </div>
                  </div>
                  <p className="text-muted-foreground whitespace-pre-line">{message.message}</p>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${message.email}`)}>
                      <Mail className="w-4 h-4 mr-2" /> Răspunde
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleRead(message)}>
                      {message.is_read ? 'Marchează necitit' : 'Marchează citit'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteMessage(message.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
