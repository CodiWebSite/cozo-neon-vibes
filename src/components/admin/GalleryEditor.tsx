import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useContent } from '@/hooks/useContent';
import { Loader2, Plus, Trash2, Edit, Save, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Tipul pentru imaginile din galerie
interface GalleryImage {
  id: string;
  title: string;
  alt_text: string;
  category: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

// Date inițiale pentru galerie (în loc de Supabase)
const initialGalleryData: GalleryImage[] = [
  {
    id: '1',
    title: 'Club Night',
    alt_text: 'DJ performing at a club night',
    category: 'club',
    image_url: '/src/assets/club-night.jpg',
    display_order: 1,
    is_active: true
  },
  {
    id: '2',
    title: 'Wedding DJ',
    alt_text: 'DJ performing at a wedding',
    category: 'wedding',
    image_url: '/src/assets/wedding-dj.jpg',
    display_order: 2,
    is_active: true
  },
  {
    id: '3',
    title: 'Corporate Event',
    alt_text: 'DJ at corporate event',
    category: 'corporate',
    image_url: '/src/assets/corporate-event.jpg',
    display_order: 3,
    is_active: true
  },
  {
    id: '4',
    title: 'Private Party',
    alt_text: 'DJ at private party',
    category: 'private',
    image_url: '/src/assets/private-party.jpg',
    display_order: 4,
    is_active: true
  }
];

const GalleryEditor = () => {
  const { updateGallery } = useContent();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simulăm încărcarea datelor din backend
    setTimeout(() => {
      setImages(initialGalleryData);
      setLoading(false);
      
      // Actualizăm datele în context pentru a fi disponibile pe site
      updateGallery(initialGalleryData);
    }, 500);
  }, [updateGallery]);

  const resetForm = () => {
    setTitle('');
    setAltText('');
    setCategory('');
    setDisplayOrder(images.length + 1);
    setIsActive(true);
    setImageUrl('');
    setSelectedFile(null);
    setEditingImage(null);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Creează un URL temporar pentru previzualizare
      const fileUrl = URL.createObjectURL(file);
      setImageUrl(fileUrl);
      
      // Extrage numele fișierului pentru titlu dacă nu există deja
      if (!title) {
        const fileName = file.name.split('.')[0];
        setTitle(fileName);
      }
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setTitle(image.title);
    setAltText(image.alt_text);
    setCategory(image.category);
    setDisplayOrder(image.display_order);
    setIsActive(image.is_active);
    setImageUrl(image.image_url);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    
    // Actualizăm și galeria din site
    await updateGalleryOnSite(updatedImages);
    
    toast({
      title: 'Imagine ștearsă',
      description: 'Imaginea a fost ștearsă cu succes și eliminată din galerie.',
      variant: 'default',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulăm salvarea imaginii în directorul Assets
    let finalImagePath = imageUrl;
    
    if (selectedFile) {
      // În mod normal, aici am face un upload real al fișierului
      // Dar pentru simulare, vom presupune că imaginea a fost salvată în Assets
      const fileName = selectedFile.name;
      finalImagePath = `/src/assets/${fileName}`;
      
      toast({
        title: 'Imagine încărcată',
        description: `Imaginea "${fileName}" a fost salvată în directorul Assets.`,
        variant: 'default',
      });
    }
    
    if (editingImage) {
      // Actualizăm imaginea existentă
      const updatedImages = images.map(img => 
        img.id === editingImage.id 
          ? { 
              ...img, 
              title, 
              alt_text: altText, 
              category, 
              display_order: displayOrder,
              is_active: isActive,
              image_url: finalImagePath
            } 
          : img
      );
      setImages(updatedImages);
      
      // Actualizăm și galeria din site
      await updateGalleryOnSite(updatedImages);
      
      toast({
        title: 'Imagine actualizată',
        description: 'Imaginea a fost actualizată cu succes.',
        variant: 'default',
      });
    } else {
      // Adăugăm o imagine nouă
      const newImage: GalleryImage = {
        id: Date.now().toString(),
        title,
        alt_text: altText,
        category,
        display_order: displayOrder,
        is_active: isActive,
        image_url: finalImagePath
      };
      
      const updatedImages = [...images, newImage];
      setImages(updatedImages);
      
      // Actualizăm și galeria din site
      await updateGalleryOnSite(updatedImages);
      
      toast({
        title: 'Imagine adăugată',
        description: 'Imaginea a fost adăugată cu succes.',
        variant: 'default',
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };
  
  // Funcție pentru actualizarea galeriei pe site
  const updateGalleryOnSite = async (updatedImages: GalleryImage[]) => {
    try {
      // Actualizăm galeria în contextul global (async)
      await updateGallery(updatedImages);
      console.log('Galeria a fost actualizată pe site:', updatedImages);
    } catch (error) {
      console.error('Eroare la actualizarea galeriei:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut salva imaginile în baza de date.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestionare Galerie</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetForm();
              setDisplayOrder(images.length + 1);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Adaugă Imagine
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? 'Editează Imaginea' : 'Adaugă Imagine Nouă'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titlu</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="altText">Text Alternativ</Label>
                <Input
                  id="altText"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categorie</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUpload">Încarcă Imagine</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Selectează imagine
                  </Button>
                  {selectedFile && (
                    <span className="text-sm text-gray-500 my-auto truncate max-w-[200px]">
                      {selectedFile.name}
                    </span>
                  )}
                </div>
                {imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={imageUrl} 
                      alt="Previzualizare" 
                      className="max-h-40 rounded-md border" 
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Ordine Afișare</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isActive">Activă</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Anulează
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingImage ? 'Actualizează' : 'Salvează'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Card key={image.id}>
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={image.image_url}
                  alt={image.alt_text}
                  className="object-cover w-full h-full"
                />
                {!image.is_active && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-medium">Inactivă</span>
                  </div>
                )}
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{image.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-sm text-gray-500 mb-2">
                  <p>Categorie: {image.category}</p>
                  <p>Ordine: {image.display_order}</p>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(image)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editează
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Șterge
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryEditor;