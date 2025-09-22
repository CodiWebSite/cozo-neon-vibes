import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useContent } from '@/hooks/useContent';
import { Save, Plus, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Importăm tipul Package din useContent
import { Package } from '@/hooks/useContent';

// Date inițiale pentru pachete
const initialPackagesData: Package[] = [
  {
    id: '1',
    name: 'Pachet Basic',
    description: 'Servicii DJ pentru evenimente mici',
    duration: '4 ore',
    price: '500 €',
    features: ['4 ore de muzică', 'Echipament de bază', 'Playlist personalizat'],
    isPopular: false,
    icon: 'music',
    gradient: 'from-blue-500 to-cyan-600'
  },
  {
    id: '2',
    name: 'Pachet Standard',
    description: 'Servicii DJ pentru nunți și evenimente medii',
    duration: '6 ore',
    price: '800 €',
    features: ['6 ore de muzică', 'Echipament profesional', 'Efecte de lumini', 'Playlist personalizat'],
    isPopular: true,
    icon: 'star',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: '3',
    name: 'Pachet Premium',
    description: 'Servicii complete pentru evenimente mari',
    duration: '8 ore',
    price: '1200 €',
    features: ['8 ore de muzică', 'Echipament premium', 'Efecte de lumini avansate', 'Mașină de fum', 'Playlist personalizat'],
    isPopular: false,
    icon: 'crown',
    gradient: 'from-yellow-500 to-orange-600'
  }
];

const PackagesEditor = () => {
  const { updatePackages } = useContent();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [icon, setIcon] = useState('');
  const [gradient, setGradient] = useState('');

  useEffect(() => {
    // Simulăm încărcarea datelor
    setTimeout(() => {
      setPackages(initialPackagesData);
      setLoading(false);
      
      // Actualizăm datele în context pentru a fi disponibile pe site
      updatePackages(initialPackagesData);
    }, 500);
  }, [updatePackages]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setDuration('');
    setPrice('');
    setFeaturesText('');
    setIsPopular(false);
    setIcon('');
    setGradient('');
    setEditingPackage(null);
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setName(pkg.name);
    setDescription(pkg.description);
    setDuration(pkg.duration);
    setPrice(pkg.price);
    setFeaturesText(pkg.features.join('\n'));
    setIsPopular(pkg.isPopular);
    setIcon(pkg.icon);
    setGradient(pkg.gradient);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const updatedPackages = packages.filter(pkg => pkg.id !== id);
    setPackages(updatedPackages);
    
    // Actualizăm și pachetele pe site
    await updatePackagesOnSite(updatedPackages);
    
    toast({
      title: 'Pachet șters',
      description: 'Pachetul a fost șters cu succes.',
      variant: 'default',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const features = featuresText.split('\n').filter(feature => feature.trim() !== '');
    
    if (editingPackage) {
      // Actualizăm pachetul existent
      const updatedPackages = packages.map(pkg => 
        pkg.id === editingPackage.id 
          ? { 
              ...pkg, 
              name,
              description,
              duration,
              price,
              features,
              isPopular,
              icon: icon || 'package',
              gradient: gradient || 'from-blue-500 to-purple-600'
            }
          : pkg
      );
      
      setPackages(updatedPackages);
      
      // Actualizăm și pachetele pe site
      await updatePackagesOnSite(updatedPackages);
      
      toast({
        title: 'Pachet actualizat',
        description: 'Pachetul a fost actualizat cu succes.',
        variant: 'default',
      });
    } else {
      // Adăugăm un pachet nou
      const newPackage: Package = {
        id: Date.now().toString(),
        name,
        description,
        duration,
        price,
        features,
        isPopular,
        icon: icon || 'package',
        gradient: gradient || 'from-blue-500 to-purple-600'
      };
      
      const updatedPackages = [...packages, newPackage];
      setPackages(updatedPackages);
      
      // Actualizăm și pachetele pe site
      await updatePackagesOnSite(updatedPackages);
      
      toast({
        title: 'Pachet adăugat',
        description: 'Pachetul a fost adăugat cu succes.',
        variant: 'default',
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };
  
  // Funcție pentru actualizarea pachetelor pe site
  const updatePackagesOnSite = async (updatedPackages: Package[]) => {
    try {
      // Actualizăm pachetele în contextul global (async)
      await updatePackages(updatedPackages);
      console.log('Pachetele au fost actualizate pe site:', updatedPackages);
    } catch (error) {
      console.error('Eroare la actualizarea pachetelor:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut salva pachetele în baza de date.',
        variant: 'destructive',
      });
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Editor Pachete</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Adaugă Pachet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingPackage ? 'Editează Pachetul' : 'Adaugă Pachet Nou'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nume Pachet</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Numele pachetului"
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
                  <Label htmlFor="price">Preț</Label>
                  <Input
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="features">Caracteristici (una pe linie)</Label>
                  <Textarea
                    id="features"
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    required
                    rows={5}
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
          {packages.map((pkg) => (
            <div key={pkg.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg">{pkg.name}</h3>
                <div className="font-bold text-primary">{pkg.price}</div>
              </div>
              <p className="text-gray-600 mt-2 mb-2">{pkg.description}</p>
              <ul className="list-disc pl-5 mb-4">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="text-sm">{feature}</li>
                ))}
              </ul>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(pkg)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editează
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(pkg.id)}>
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

export default PackagesEditor;