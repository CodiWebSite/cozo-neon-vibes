import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useContent } from '@/hooks/useContent';
import { Loader2, Save, Plus, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Importăm tipul Service din useContent
import { Service } from '@/hooks/useContent';

// Date inițiale pentru servicii
const initialServicesData: Service[] = [
  {
    id: '1',
    title: 'DJ pentru Nunți',
    description: 'Servicii complete de DJ pentru nunți, cu muzică personalizată și efecte de lumini.',
    features: ['Muzică personalizată', 'Efecte de lumini', 'Echipament profesional', 'MC pentru eveniment'],
    icon: 'music',
    image: '/src/assets/wedding-dj.jpg',
    gradient: 'from-pink-500 to-purple-600'
  },
  {
    id: '2',
    title: 'DJ pentru Petreceri Private',
    description: 'Creează atmosfera perfectă pentru petrecerea ta privată cu un DJ profesionist.',
    features: ['Playlist personalizat', 'Echipament portabil', 'Efecte speciale', 'Interacțiune cu invitații'],
    icon: 'party',
    image: '/src/assets/private-party.jpg',
    gradient: 'from-blue-500 to-cyan-600'
  },
  {
    id: '3',
    title: 'DJ pentru Evenimente Corporative',
    description: 'Servicii de DJ pentru evenimente corporative, conferințe și gale.',
    features: ['Muzică de fundal', 'Echipament discret', 'Profesionalism', 'Adaptabilitate'],
    icon: 'business',
    image: '/src/assets/corporate-event.jpg',
    gradient: 'from-gray-500 to-slate-600'
  }
];

const ServicesEditor = () => {
  const { updateServices } = useContent();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [image, setImage] = useState('');
  const [gradient, setGradient] = useState('');

  useEffect(() => {
    // Simulăm încărcarea datelor
    setTimeout(() => {
      setServices(initialServicesData);
      setLoading(false);
      
      // Actualizăm datele în context pentru a fi disponibile pe site
      updateServices(initialServicesData);
    }, 500);
  }, [updateServices]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setIcon('');
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setTitle(service.title);
    setDescription(service.description);
    setIcon(service.icon);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const updatedServices = services.filter(service => service.id !== id);
    setServices(updatedServices);
    
    // Actualizăm și serviciile pe site
    await updateServicesOnSite(updatedServices);
    
    toast({
      title: 'Serviciu șters',
      description: 'Serviciul a fost șters cu succes.',
      variant: 'default',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingService) {
      // Actualizăm serviciul existent
      const updatedServices = services.map(service => 
        service.id === editingService.id 
          ? { 
              ...service, 
              title, 
              description, 
              icon
            } 
          : service
      );
      setServices(updatedServices);
      
      // Actualizăm și serviciile pe site
      await updateServicesOnSite(updatedServices);
      
      toast({
        title: 'Serviciu actualizat',
        description: 'Serviciul a fost actualizat cu succes.',
        variant: 'default',
      });
    } else {
      // Adăugăm un serviciu nou
      const newService: Service = {
        id: Date.now().toString(),
        title,
        description,
        icon,
        features: features.length > 0 ? features : ['Serviciu profesional'],
        image: image || '/src/assets/dj-portrait.jpg',
        gradient: gradient || 'from-blue-500 to-purple-600'
      };
      
      const updatedServices = [...services, newService];
      setServices(updatedServices);
      
      // Actualizăm și serviciile pe site
      await updateServicesOnSite(updatedServices);
      
      toast({
        title: 'Serviciu adăugat',
        description: 'Serviciul a fost adăugat cu succes.',
        variant: 'default',
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };
  
  // Funcție pentru actualizarea serviciilor pe site
  const updateServicesOnSite = async (updatedServices: Service[]) => {
    try {
      // Actualizăm serviciile în contextul global (async)
      await updateServices(updatedServices);
      console.log('Serviciile au fost actualizate pe site:', updatedServices);
    } catch (error) {
      console.error('Eroare la actualizarea serviciilor:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut salva serviciile în baza de date.',
        variant: 'destructive',
      });
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Editor Servicii</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Adaugă Serviciu
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? 'Editează Serviciul' : 'Adaugă Serviciu Nou'}
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
                  <Label htmlFor="description">Descriere</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (nume)</Label>
                  <Input
                    id="icon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Salvează
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <div key={service.id} className="border rounded-lg p-4">
              <h3 className="font-medium text-lg">{service.title}</h3>
              <p className="text-gray-600 mt-2 mb-4">{service.description}</p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(service)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editează
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(service.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Șterge
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicesEditor;