import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Edit, Upload, LogOut } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContentManager from '@/components/admin/ContentManager';

interface GalleryImage {
  id: string;
  title: string;
  alt_text: string;
  category: string;
  image_url: string;
  storage_path?: string;
  display_order: number;
  is_active: boolean;
}

const AdminDashboard = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/admin/auth');
      return;
    }
    fetchImages();
  }, [user, isAdmin, navigate]);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca imaginile.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error } = await supabase.storage
      .from('gallery')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = editingImage?.image_url || '';
      let storagePath = editingImage?.storage_path || '';

      if (file) {
        imageUrl = await uploadFile(file);
        storagePath = `gallery/${file.name}`;
      }

      const imageData = {
        title,
        alt_text: altText,
        category,
        image_url: imageUrl,
        storage_path: storagePath,
        display_order: displayOrder,
        is_active: true,
      };

      if (editingImage) {
        const { error } = await supabase
          .from('gallery_images')
          .update(imageData)
          .eq('id', editingImage.id);

        if (error) throw error;
        toast({ title: 'Succes', description: 'Imaginea a fost actualizată.' });
      } else {
        const { error } = await supabase
          .from('gallery_images')
          .insert([imageData]);

        if (error) throw error;
        toast({ title: 'Succes', description: 'Imaginea a fost adăugată.' });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchImages();
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut salva imaginea.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setTitle(image.title);
    setAltText(image.alt_text);
    setCategory(image.category);
    setDisplayOrder(image.display_order);
    setFile(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ești sigur că vrei să ștergi această imagine?')) return;

    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Succes', description: 'Imaginea a fost ștearsă.' });
      fetchImages();
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut șterge imaginea.',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setEditingImage(null);
    setTitle('');
    setAltText('');
    setCategory('');
    setDisplayOrder(0);
    setFile(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Badge variant="outline" className="neon-border text-primary mb-4">
              Admin Dashboard
            </Badge>
            <h1 className="text-3xl font-heading font-bold">
              <span className="gradient-text">Panou</span> Admin
            </h1>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/')} variant="outline">
              ← Site
            </Button>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Deconectare
            </Button>
          </div>
        </div>

        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gallery">Galerie</TabsTrigger>
            <TabsTrigger value="content">Conținut Site</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery" className="space-y-6">
            {/* Add Image Button */}
            <div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adaugă Imagine
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingImage ? 'Editează Imaginea' : 'Adaugă Imagine Nouă'}
                    </DialogTitle>
                    <DialogDescription>
                      Completează detaliile pentru imagine.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Titlu</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="altText">Text alternativ</Label>
                      <Input
                        id="altText"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Categorie</Label>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Alege categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Weddings">Weddings</SelectItem>
                          <SelectItem value="Corporate">Corporate</SelectItem>
                          <SelectItem value="Club Events">Club Events</SelectItem>
                          <SelectItem value="Private">Private</SelectItem>
                          <SelectItem value="Studio">Studio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="displayOrder">Ordine afișare</Label>
                      <Input
                        id="displayOrder"
                        type="number"
                        value={displayOrder}
                        onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="file">
                        {editingImage ? 'Înlocuiește imaginea (opțional)' : 'Imagine'}
                      </Label>
                      <Input
                        id="file"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        required={!editingImage}
                      />
                    </div>
                    <Button type="submit" disabled={uploading} className="w-full">
                      {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingImage ? 'Actualizează' : 'Adaugă'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <Card key={image.id} className="bg-card/30 border-border/50">
                  <CardHeader className="pb-2">
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <img
                        src={image.image_url}
                        alt={image.alt_text}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-sm">{image.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {image.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {image.alt_text}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-muted-foreground">
                          Ordine: {image.display_order}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(image)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(image.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {images.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nu există imagini în galerie.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="content">
            <ContentManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;