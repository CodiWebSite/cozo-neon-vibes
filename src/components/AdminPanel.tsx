import { useCallback, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { resolveGalleryItems, type GalleryRow } from '@/lib/galleryUrls';
import { prepareImage, formatBytes } from '@/lib/imageUpload';
import {
  Loader2, Trash2, Upload, LogOut, Save, Mail, ExternalLink,
  ImagePlus, Link2, RefreshCw, Star, Eye, EyeOff, Plus, CheckCircle2, XCircle,
} from 'lucide-react';

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

interface TestimonialRow {
  id: string;
  source: string;
  author_name: string;
  author_avatar: string | null;
  role: string | null;
  content: string;
  rating: number | null;
  recommendation_type: string | null;
  permalink: string | null;
  reviewed_at: string | null;
  is_visible: boolean;
  sort_order: number;
}

type QueueStatus = 'pending' | 'working' | 'done' | 'error';

interface QueueItem {
  id: string;
  file: File;
  preview: string;
  status: QueueStatus;
  progress: number;
  error?: string;
}

const CATEGORIES = ['nunti', 'corporate', 'club', 'private', 'general'];

const AdminPanel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const refreshGallery = () => {
    queryClient.invalidateQueries({ queryKey: ['admin_gallery'] });
    queryClient.invalidateQueries({ queryKey: ['gallery_items'] });
  };

  /* ---------------- Galerie: încărcare multiplă ---------------- */
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('general');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const accepted = Array.from(files).filter(
      (f) => f.type.startsWith('image/') || f.type.startsWith('video/'),
    );
    if (accepted.length === 0) return;
    setQueue((prev) => [
      ...prev,
      ...accepted.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        status: 'pending' as QueueStatus,
        progress: 0,
      })),
    ]);
  }, []);

  const removeFromQueue = (id: string) =>
    setQueue((prev) => prev.filter((item) => item.id !== id));

  const uploadAll = async () => {
    const pending = queue.filter((item) => item.status === 'pending' || item.status === 'error');
    if (pending.length === 0) return;
    setUploading(true);

    const setItem = (id: string, patch: Partial<QueueItem>) =>
      setQueue((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));

    let ok = 0;
    for (const item of pending) {
      setItem(item.id, { status: 'working', progress: 10, error: undefined });
      try {
        const isVideo = item.file.type.startsWith('video/');
        const base = crypto.randomUUID();

        if (isVideo) {
          const ext = item.file.name.split('.').pop() ?? 'mp4';
          const path = `${base}.${ext}`;
          setItem(item.id, { progress: 40 });
          const { error } = await supabase.storage.from('gallery').upload(path, item.file, {
            cacheControl: '31536000',
            contentType: item.file.type,
          });
          if (error) throw error;
          setItem(item.id, { progress: 80 });
          const { error: dbError } = await supabase.from('gallery_items').insert({
            title: item.file.name.replace(/\.[^.]+$/, ''),
            category,
            type: 'video',
            video_url: path,
          });
          if (dbError) throw dbError;
        } else {
          setItem(item.id, { progress: 25 });
          const prepared = await prepareImage(item.file);
          setItem(item.id, { progress: 45 });

          const fullPath = `${base}.webp`;
          const thumbPath = `${base}-thumb.webp`;

          const up1 = await supabase.storage.from('gallery').upload(fullPath, prepared.full, {
            cacheControl: '31536000',
            contentType: 'image/webp',
          });
          if (up1.error) throw up1.error;
          setItem(item.id, { progress: 70 });

          const up2 = await supabase.storage.from('gallery').upload(thumbPath, prepared.thumb, {
            cacheControl: '31536000',
            contentType: 'image/webp',
          });
          if (up2.error) throw up2.error;
          setItem(item.id, { progress: 90 });

          const { error: dbError } = await supabase.from('gallery_items').insert({
            title: item.file.name.replace(/\.[^.]+$/, ''),
            category,
            type: 'image',
            src: fullPath,
            thumb_path: thumbPath,
            width: prepared.width,
            height: prepared.height,
          });
          if (dbError) throw dbError;
        }

        setItem(item.id, { status: 'done', progress: 100 });
        ok++;
      } catch (error) {
        setItem(item.id, {
          status: 'error',
          progress: 0,
          error: error instanceof Error ? error.message : 'Eroare',
        });
      }
    }

    setUploading(false);
    refreshGallery();
    if (ok > 0) toast({ title: `${ok} fișiere adăugate în galerie` });
  };

  const clearFinished = () =>
    setQueue((prev) => prev.filter((item) => item.status !== 'done'));

  const addVideoLink = async () => {
    if (!videoUrl.trim()) return;
    const { error } = await supabase.from('gallery_items').insert({
      title: videoTitle.trim() || 'Video',
      category,
      type: 'video',
      video_url: videoUrl.trim(),
    });
    if (error) {
      toast({ title: 'Nu am putut adăuga', description: error.message, variant: 'destructive' });
      return;
    }
    setVideoUrl('');
    setVideoTitle('');
    toast({ title: 'Video adăugat' });
    refreshGallery();
  };

  const galleryQuery = useQuery({
    queryKey: ['admin_gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return resolveGalleryItems((data ?? []) as GalleryRow[]);
    },
  });

  const updateGalleryItem = async (id: string, patch: { title?: string; category?: string }) => {
    const { error } = await supabase.from('gallery_items').update(patch).eq('id', id);
    if (error) {
      toast({ title: 'Nu am putut salva', description: error.message, variant: 'destructive' });
      return;
    }
    refreshGallery();
  };

  const deleteItem = async (id: string, paths: (string | null | undefined)[]) => {
    const { error } = await supabase.from('gallery_items').delete().eq('id', id);
    if (error) {
      toast({ title: 'Nu am putut șterge', description: error.message, variant: 'destructive' });
      return;
    }
    const storagePaths = paths.filter(
      (p): p is string => !!p && !/^https?:\/\//i.test(p),
    );
    if (storagePaths.length) await supabase.storage.from('gallery').remove(storagePaths);
    toast({ title: 'Șters din galerie' });
    refreshGallery();
  };

  /* ---------------- Recenzii ---------------- */
  const [syncing, setSyncing] = useState(false);
  const [newReview, setNewReview] = useState({ author_name: '', role: '', content: '', rating: 5 });

  const reviewsQuery = useQuery({
    queryKey: ['admin_testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('reviewed_at', { ascending: false, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as TestimonialRow[];
    },
  });

  const refreshReviews = () => {
    queryClient.invalidateQueries({ queryKey: ['admin_testimonials'] });
    queryClient.invalidateQueries({ queryKey: ['testimonials'] });
  };

  const syncFacebook = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-facebook-reviews', { body: {} });
      if (error) throw error;
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
      const result = data as { fetched: number; imported: number };
      toast({
        title: 'Sincronizare reușită',
        description: `${result.imported} recenzii aduse de pe Facebook.`,
      });
      refreshReviews();
    } catch (error) {
      toast({
        title: 'Sincronizarea nu a reușit',
        description: error instanceof Error ? error.message : 'Încearcă din nou.',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  const addReview = async () => {
    if (!newReview.author_name.trim() || !newReview.content.trim()) {
      toast({ title: 'Completează numele și textul', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('testimonials').insert({
      source: 'manual',
      author_name: newReview.author_name.trim(),
      role: newReview.role.trim() || null,
      content: newReview.content.trim(),
      rating: newReview.rating,
      reviewed_at: new Date().toISOString(),
    });
    if (error) {
      toast({ title: 'Nu am putut adăuga', description: error.message, variant: 'destructive' });
      return;
    }
    setNewReview({ author_name: '', role: '', content: '', rating: 5 });
    toast({ title: 'Recenzie adăugată' });
    refreshReviews();
  };

  const toggleReview = async (item: TestimonialRow) => {
    await supabase.from('testimonials').update({ is_visible: !item.is_visible }).eq('id', item.id);
    refreshReviews();
  };

  const deleteReview = async (id: string) => {
    await supabase.from('testimonials').delete().eq('id', id);
    refreshReviews();
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

  /* ---------------- Administratori ---------------- */
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [savingAdmin, setSavingAdmin] = useState(false);

  const adminsQuery = useQuery({
    queryKey: ['admin_admins'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('list_admins');
      if (error) throw error;
      return (data ?? []) as { user_id: string; email: string; created_at: string }[];
    },
  });

  const addAdmin = async () => {
    const email = newAdminEmail.trim();
    if (!email) return;
    setSavingAdmin(true);
    const { data, error } = await supabase.rpc('grant_admin_by_email', { _email: email });
    setSavingAdmin(false);
    const result = (data ?? {}) as { ok?: boolean; error?: string };
    if (error || !result.ok) {
      const map: Record<string, string> = {
        user_not_found: 'Nu există niciun cont cu acest email. Persoana trebuie mai întâi să își creeze cont pe /admin.',
        not_authorized: 'Nu ai dreptul să faci această modificare.',
      };
      toast({
        title: 'Nu am putut adăuga administratorul',
        description: map[result.error ?? ''] ?? error?.message ?? 'Încearcă din nou.',
        variant: 'destructive',
      });
      return;
    }
    setNewAdminEmail('');
    toast({ title: 'Administrator adăugat', description: email });
    queryClient.invalidateQueries({ queryKey: ['admin_admins'] });
  };

  const removeAdmin = async (userId: string) => {
    const { data, error } = await supabase.rpc('revoke_admin', { _user_id: userId });
    const result = (data ?? {}) as { ok?: boolean; error?: string };
    if (error || !result.ok) {
      const map: Record<string, string> = {
        cannot_remove_self: 'Nu îți poți retrage ție drepturile de administrator.',
        last_admin: 'Trebuie să rămână cel puțin un administrator.',
        not_authorized: 'Nu ai dreptul să faci această modificare.',
      };
      toast({
        title: 'Nu am putut retrage accesul',
        description: map[result.error ?? ''] ?? error?.message ?? 'Încearcă din nou.',
        variant: 'destructive',
      });
      return;
    }
    toast({ title: 'Acces retras' });
    queryClient.invalidateQueries({ queryKey: ['admin_admins'] });
  };

  const sections = Array.from(new Set((contentQuery.data ?? []).map((row) => row.section)));
  const pendingCount = queue.filter((i) => i.status === 'pending' || i.status === 'error').length;


  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/40 backdrop-blur-sm sticky top-0 z-20">
        <div className="container-custom flex items-center justify-between py-4">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">Panou Administrare</h1>
            <p className="text-sm text-muted-foreground">Galerie, recenzii, texte și mesaje</p>
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
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="galerie">Galerie</TabsTrigger>
            <TabsTrigger value="recenzii">Recenzii</TabsTrigger>
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
            <Card className="p-6 space-y-5 bg-card/50">
              <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Categorie pentru încărcare</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <Badge
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`cursor-pointer ${
                          category === c
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  addFiles(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
                  dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/60'
                }`}
              >
                <ImagePlus className="w-10 h-10 mx-auto mb-3 text-primary" />
                <p className="font-medium text-foreground">
                  Trage pozele aici sau apasă pentru a le alege
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Poți selecta oricâte deodată. Pozele sunt optimizate automat (WebP) ca site-ul să rămână rapid.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    e.target.value = '';
                  }}
                />
              </div>

              {queue.length > 0 && (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {queue.map((item) => (
                      <Card key={item.id} className="overflow-hidden bg-secondary/20">
                        <div className="aspect-video bg-black/40 flex items-center justify-center overflow-hidden">
                          {item.preview ? (
                            <img src={item.preview} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-muted-foreground">VIDEO</span>
                          )}
                        </div>
                        <div className="p-3 space-y-2">
                          <p className="text-xs truncate text-foreground">{item.file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatBytes(item.file.size)}</p>
                          {item.status === 'working' && <Progress value={item.progress} className="h-1" />}
                          <div className="flex items-center justify-between">
                            {item.status === 'done' ? (
                              <span className="text-xs text-green-500 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> gata
                              </span>
                            ) : item.status === 'error' ? (
                              <span className="text-xs text-destructive flex items-center gap-1">
                                <XCircle className="w-3 h-3" /> {item.error?.slice(0, 24)}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">în așteptare</span>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => removeFromQueue(item.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={uploadAll}
                      disabled={uploading || pendingCount === 0}
                      className="bg-gradient-to-r from-primary to-accent text-white"
                    >
                      {uploading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      Încarcă {pendingCount > 0 ? `(${pendingCount})` : ''}
                    </Button>
                    <Button variant="ghost" onClick={clearFinished} disabled={uploading}>
                      Curăță lista
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] items-end border-t border-border/50 pt-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Titlu video</label>
                  <Input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Nuntă la Palas" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Link video (YouTube / Facebook)</label>
                  <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
                </div>
                <Button variant="outline" onClick={addVideoLink}>
                  <Link2 className="w-4 h-4 mr-2" /> Adaugă link
                </Button>
              </div>
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
                      {item.type === 'image' && item.thumbUrl ? (
                        <img src={item.thumbUrl} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-muted-foreground px-2 text-center break-all">VIDEO</span>
                      )}
                    </div>
                    <div className="p-3 space-y-2">
                      <Input
                        defaultValue={item.title}
                        className="h-8 text-sm"
                        onBlur={(e) =>
                          e.target.value !== item.title &&
                          updateGalleryItem(item.id, { title: e.target.value })
                        }
                      />
                      <div className="flex items-center justify-between gap-2">
                        <select
                          defaultValue={item.category}
                          onChange={(e) => updateGalleryItem(item.id, { category: e.target.value })}
                          className="h-8 rounded-md bg-secondary/40 border border-border text-xs px-2 text-foreground"
                        >
                          {Array.from(new Set([...CATEGORIES, item.category])).map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteItem(item.id, [item.src, item.video_url, item.thumb_path])}
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

          {/* RECENZII */}
          <TabsContent value="recenzii" className="space-y-6">
            <Card className="p-6 space-y-4 bg-card/50">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-heading font-bold text-foreground">Recenzii Facebook</h2>
                  <p className="text-sm text-muted-foreground">
                    Aduce automat recenziile de pe pagina ta și le afișează pe site.
                  </p>
                </div>
                <Button onClick={syncFacebook} disabled={syncing} variant="outline">
                  {syncing ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Sincronizează acum
                </Button>
              </div>
            </Card>

            <Card className="p-6 space-y-4 bg-card/50">
              <h2 className="text-lg font-heading font-bold text-foreground">Adaugă recenzie manual</h2>
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  placeholder="Nume client"
                  value={newReview.author_name}
                  onChange={(e) => setNewReview({ ...newReview, author_name: e.target.value })}
                />
                <Input
                  placeholder="Tip eveniment (ex: Nuntă)"
                  value={newReview.role}
                  onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                />
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  className="h-10 rounded-md bg-secondary/40 border border-border px-3 text-sm text-foreground"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} stele
                    </option>
                  ))}
                </select>
              </div>
              <Textarea
                rows={4}
                placeholder="Textul recenziei"
                value={newReview.content}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
              />
              <Button onClick={addReview} className="bg-gradient-to-r from-primary to-accent text-white">
                <Plus className="w-4 h-4 mr-2" /> Adaugă recenzie
              </Button>
            </Card>

            {reviewsQuery.isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (
              <div className="space-y-3">
                {(reviewsQuery.data ?? []).map((item) => (
                  <Card key={item.id} className="p-5 space-y-3 bg-card/50">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-foreground">{item.author_name}</p>
                        {item.rating && (
                          <span className="flex items-center gap-0.5 text-yellow-400">
                            {Array.from({ length: item.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </span>
                        )}
                        <Badge variant="outline">{item.source}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {item.is_visible ? (
                            <Eye className="w-4 h-4 text-primary" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          )}
                          <Switch checked={item.is_visible} onCheckedChange={() => toggleReview(item)} />
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => deleteReview(item.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{item.content}</p>
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
