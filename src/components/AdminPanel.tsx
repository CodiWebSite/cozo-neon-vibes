import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X, Image, Video, Trash2, LogOut, Plus, Eye, Package, Edit, Star } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  type: 'image' | 'video';
  src?: string;
  alt?: string;
  videoUrl?: string;
  thumbnail?: string;
  created_at: string;
}

interface PackageItem {
  id: string;
  name: string;
  icon: string;
  duration: string;
  description: string;
  features: string[];
  popular: boolean;
  gradient: string;
  created_at: string;
  updated_at: string;
}

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
  gradient: string;
}

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'packages' | 'services'>('gallery');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'image' | 'video'>('image');
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');

  // Package form state
  const [packageName, setPackageName] = useState('');
  const [packageIcon, setPackageIcon] = useState('Star');
  const [packageDuration, setPackageDuration] = useState('');
  const [packageDescription, setPackageDescription] = useState('');
  const [packageFeatures, setPackageFeatures] = useState<string[]>(['']);
  const [packagePopular, setPackagePopular] = useState(false);
  const [packageGradient, setPackageGradient] = useState('from-blue-500 to-cyan-500');

  // Service form state
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceIcon, setServiceIcon] = useState('Star');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceFeatures, setServiceFeatures] = useState<string[]>(['']);
  const [serviceGradient, setServiceGradient] = useState('from-blue-500 to-cyan-500');
  const [serviceImage, setServiceImage] = useState('/src/assets/placeholder.svg');

  const categories = [
    'Portrete',
    'Performance',
    'Evenimente Club',
    'Evenimente Private',
    'Nunți',
    'Evenimente Corporate',
    'Video Performance'
  ];

  useEffect(() => {
    fetchGalleryItems();
    fetchPackages();
    fetchServices();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery.php');
      if (response.ok) {
        const items = await response.json();
        setGalleryItems(items);
      }
    } catch (error) {
      console.error('Eroare la încărcarea galeriei:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages.php');
      if (response.ok) {
        const items = await response.json();
        setPackages(items);
      }
    } catch (error) {
      console.error('Eroare la încărcarea pachetelor:', error);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || (type === 'image' && !file) || (type === 'video' && !videoUrl)) {
      alert('Te rog completează toate câmpurile obligatorii');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('type', type);
      
      if (type === 'image' && file) {
        formData.append('file', file);
      } else if (type === 'video') {
        formData.append('videoUrl', videoUrl);
      }

      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/upload-media.php', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Fișierul a fost încărcat cu succes!');
        resetForm();
        fetchGalleryItems();
        setShowUploadForm(false);
      } else {
        alert(data.message || 'Eroare la încărcare');
      }
    } catch (error) {
      alert('Eroare de conexiune. Încearcă din nou.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ești sigur că vrei să ștergi acest element?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/delete-media.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Elementul a fost șters cu succes!');
        fetchGalleryItems();
      } else {
        alert(data.message || 'Eroare la ștergere');
      }
    } catch (error) {
      alert('Eroare de conexiune. Încearcă din nou.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setType('image');
    setFile(null);
    setVideoUrl('');
  };

  const resetPackageForm = () => {
    setPackageName('');
    setPackageIcon('Star');
    setPackageDuration('');
    setPackageDescription('');
    setPackageFeatures(['']);
    setPackagePopular(false);
    setPackageGradient('from-blue-500 to-cyan-500');
    setEditingPackage(null);
  };

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!packageName || !packageDuration || !packageDescription || packageFeatures.filter(f => f.trim()).length === 0) {
      alert('Te rog completează toate câmpurile obligatorii');
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const packageData: any = {
        name: packageName,
        icon: packageIcon,
        duration: packageDuration,
        description: packageDescription,
        features: packageFeatures.filter(f => f.trim()),
        popular: packagePopular,
        gradient: packageGradient
      };

      const url = '/api/packages.php';
      const method = editingPackage ? 'PUT' : 'POST';
      
      if (editingPackage) {
        packageData.id = editingPackage.id;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(packageData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(editingPackage ? 'Pachetul a fost actualizat cu succes!' : 'Pachetul a fost adăugat cu succes!');
        resetPackageForm();
        fetchPackages();
        setShowPackageForm(false);
      } else {
        alert(data.message || 'Eroare la salvarea pachetului');
      }
    } catch (error) {
      alert('Eroare de conexiune. Încearcă din nou.');
    } finally {
      setUploading(false);
    }
  };

  const handlePackageEdit = (pkg: PackageItem) => {
    setEditingPackage(pkg);
    setPackageName(pkg.name);
    setPackageIcon(pkg.icon);
    setPackageDuration(pkg.duration);
    setPackageDescription(pkg.description);
    setPackageFeatures([...pkg.features]);
    setPackagePopular(pkg.popular);
    setPackageGradient(pkg.gradient);
    setShowPackageForm(true);
  };

  const handlePackageDelete = async (id: string) => {
    if (!confirm('Ești sigur că vrei să ștergi acest pachet?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/packages.php?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Pachetul a fost șters cu succes!');
        fetchPackages();
      } else {
        alert(data.message || 'Eroare la ștergerea pachetului');
      }
    } catch (error) {
      alert('Eroare de conexiune. Încearcă din nou.');
    }
  };

  const addFeatureField = () => {
    setPackageFeatures([...packageFeatures, '']);
  };

  const removeFeatureField = (index: number) => {
    const newFeatures = packageFeatures.filter((_, i) => i !== index);
    setPackageFeatures(newFeatures);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...packageFeatures];
    newFeatures[index] = value;
    setPackageFeatures(newFeatures);
  };

  // Services functions
  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services.php');
      if (response.ok) {
        const items = await response.json();
        setServices(items);
      }
    } catch (error) {
      console.error('Eroare la încărcarea serviciilor:', error);
    }
  };

  const resetServiceForm = () => {
    setServiceTitle('');
    setServiceIcon('Star');
    setServiceDescription('');
    setServiceFeatures(['']);
    setServiceGradient('from-blue-500 to-cyan-500');
    setServiceImage('/src/assets/placeholder.svg');
    setEditingService(null);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validare specifică pentru fiecare câmp
    if (!serviceTitle.trim()) {
      alert('Titlul serviciului este obligatoriu');
      return;
    }
    
    if (!serviceDescription.trim()) {
      alert('Descrierea serviciului este obligatorie');
      return;
    }
    
    const validFeatures = serviceFeatures.filter(f => f.trim());
    if (validFeatures.length === 0) {
      alert('Cel puțin o caracteristică este obligatorie');
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const serviceData: any = {
        title: serviceTitle.trim(),
        icon: serviceIcon,
        description: serviceDescription.trim(),
        features: validFeatures,
        gradient: serviceGradient,
        image: serviceImage
      };

      const url = '/api/services.php';
      const method = editingService ? 'PUT' : 'POST';
      
      if (editingService) {
        serviceData.id = editingService.id;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(editingService ? 'Serviciul a fost actualizat cu succes!' : 'Serviciul a fost adăugat cu succes!');
        resetServiceForm();
        fetchServices();
        setShowServiceForm(false);
      } else {
        alert(data.message || 'Eroare la salvarea serviciului');
      }
    } catch (error) {
      alert('Eroare de conexiune. Încearcă din nou.');
    } finally {
      setUploading(false);
    }
  };

  const handleServiceEdit = (service: ServiceItem) => {
    setEditingService(service);
    setServiceTitle(service.title);
    setServiceIcon(service.icon);
    setServiceDescription(service.description);
    setServiceFeatures([...service.features]);
    setServiceGradient(service.gradient);
    setServiceImage(service.image);
    setShowServiceForm(true);
  };

  const handleServiceDelete = async (id: number) => {
    if (!confirm('Ești sigur că vrei să ștergi acest serviciu?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/services.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Serviciul a fost șters cu succes!');
        fetchServices();
      } else {
        alert(data.message || 'Eroare la ștergerea serviciului');
      }
    } catch (error) {
      alert('Eroare de conexiune. Încearcă din nou.');
    }
  };

  const addServiceFeatureField = () => {
    setServiceFeatures([...serviceFeatures, '']);
  };

  const removeServiceFeatureField = (index: number) => {
    const newFeatures = serviceFeatures.filter((_, i) => i !== index);
    setServiceFeatures(newFeatures);
  };

  const updateServiceFeature = (index: number, value: string) => {
    const newFeatures = [...serviceFeatures];
    newFeatures[index] = value;
    setServiceFeatures(newFeatures);
  };

  const handleServiceImageUpload = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'service');

      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/upload-media.php', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setServiceImage(data.url);
        alert('Imaginea a fost încărcată cu succes!');
      } else {
        alert(data.message || 'Eroare la încărcarea imaginii');
      }
    } catch (error) {
      alert('Eroare de conexiune. Încearcă din nou.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Panou Administrare <span className="text-neon-cyan">DJ Cozo</span>
          </h1>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => window.open('/', '_blank')}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Eye className="w-4 h-4 mr-2" />
              Vezi Site-ul
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-700 text-red-400 hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Deconectează-te
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'gallery'
                  ? 'border-neon-cyan text-neon-cyan'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <Image className="w-4 h-4 inline mr-2" />
              Galerie Media
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'packages'
                  ? 'border-neon-cyan text-neon-cyan'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Pachete
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-neon-cyan text-neon-cyan'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <Star className="w-4 h-4 inline mr-2" />
              Servicii
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {activeTab === 'gallery' && (
          <>
            {/* Upload Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Gestionare Galerie</h2>
            <Button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adaugă Element Nou
            </Button>
          </div>

          {showUploadForm && (
            <Card className="bg-gray-900 border-gray-800 p-6 mb-6">
              <form onSubmit={handleFileUpload} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">Titlu *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Introdu titlul"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-white">Categorie *</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Selectează categoria" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat} className="text-white">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Tip *</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="image"
                        checked={type === 'image'}
                        onChange={(e) => setType(e.target.value as 'image' | 'video')}
                        className="mr-2"
                      />
                      <Image className="w-4 h-4 mr-1" />
                      Imagine
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="video"
                        checked={type === 'video'}
                        onChange={(e) => setType(e.target.value as 'image' | 'video')}
                        className="mr-2"
                      />
                      <Video className="w-4 h-4 mr-1" />
                      Video
                    </label>
                  </div>
                </div>

                {type === 'image' ? (
                  <div className="space-y-2">
                    <Label htmlFor="file" className="text-white">Fișier Imagine *</Label>
                    <Input
                      id="file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl" className="text-white">URL Video (Facebook/YouTube) *</Label>
                    <Textarea
                      id="videoUrl"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Introdu URL-ul video-ului sau iframe embed code"
                      rows={3}
                      required
                    />
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={uploading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Se încarcă...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Încarcă
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowUploadForm(false);
                    }}
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Anulează
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>

        {/* Gallery Items */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Elemente în Galerie ({galleryItems.length})
          </h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
              <p className="text-gray-300 mt-2">Se încarcă...</p>
            </div>
          ) : galleryItems.length === 0 ? (
            <Card className="bg-gray-900 border-gray-800 p-8 text-center">
              <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nu există elemente în galerie</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <Card key={item.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                  <div className="aspect-square relative">
                    {item.type === 'image' ? (
                      <img
                        src={item.src}
                        alt={item.alt || item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Video className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Button
                        onClick={() => handleDelete(item.id)}
                        size="sm"
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.category}</p>
                    <div className="flex items-center mt-2">
                      {item.type === 'image' ? (
                        <Image className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <Video className="w-4 h-4 text-blue-500 mr-1" />
                      )}
                      <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        </>
        )}

        {activeTab === 'packages' && (
          <>
            {/* Packages Management Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Gestionare Pachete</h2>
                <Button
                  onClick={() => {
                    resetPackageForm();
                    setShowPackageForm(!showPackageForm);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adaugă Pachet Nou
                </Button>
              </div>

              {showPackageForm && (
                <Card className="bg-gray-900 border-gray-800 p-6 mb-6">
                  <form onSubmit={handlePackageSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="packageName" className="text-white">Nume Pachet *</Label>
                        <Input
                          id="packageName"
                          value={packageName}
                          onChange={(e) => setPackageName(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="ex: Pachet Premium"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="packageDuration" className="text-white">Durată *</Label>
                        <Input
                          id="packageDuration"
                          value={packageDuration}
                          onChange={(e) => setPackageDuration(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                          placeholder="ex: 4-6 ore"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="packageDescription" className="text-white">Descriere *</Label>
                      <Textarea
                        id="packageDescription"
                        value={packageDescription}
                        onChange={(e) => setPackageDescription(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="Descrierea pachetului..."
                        rows={3}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Caracteristici *</Label>
                      {packageFeatures.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                            placeholder="Caracteristică..."
                          />
                          {packageFeatures.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeFeatureField(index)}
                              variant="outline"
                              size="sm"
                              className="border-red-700 text-red-400 hover:bg-red-900/20"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={addFeatureField}
                        variant="outline"
                        size="sm"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adaugă Caracteristică
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-white">Pachet Popular</Label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={packagePopular}
                            onChange={(e) => setPackagePopular(e.target.checked)}
                            className="mr-2"
                          />
                          <Star className="w-4 h-4 mr-1" />
                          Marchează ca popular
                        </label>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="packageGradient" className="text-white">Gradient Culoare</Label>
                        <Select value={packageGradient} onValueChange={setPackageGradient}>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="from-blue-500 to-cyan-500" className="text-white">Albastru-Cyan</SelectItem>
                            <SelectItem value="from-purple-500 to-pink-500" className="text-white">Violet-Roz</SelectItem>
                            <SelectItem value="from-green-500 to-blue-500" className="text-white">Verde-Albastru</SelectItem>
                            <SelectItem value="from-yellow-500 to-orange-500" className="text-white">Galben-Portocaliu</SelectItem>
                            <SelectItem value="from-red-500 to-pink-500" className="text-white">Roșu-Roz</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        disabled={uploading}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Salvează...
                          </>
                        ) : (
                          <>
                            <Package className="w-4 h-4 mr-2" />
                            {editingPackage ? 'Actualizează Pachet' : 'Salvează Pachet'}
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          resetPackageForm();
                          setShowPackageForm(false);
                        }}
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        Anulează
                      </Button>
                    </div>
                  </form>
                </Card>
              )}
            </div>

            {/* Packages List */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Pachete Disponibile ({packages.length})
              </h3>
              
              {packages.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800 p-8 text-center">
                  <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Nu există pachete create</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pkg) => (
                    <Card key={pkg.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                      <div className={`h-32 bg-gradient-to-r ${pkg.gradient} flex items-center justify-center relative`}>
                        <Package className="w-12 h-12 text-white" />
                        {pkg.popular && (
                          <div className="absolute top-2 left-2">
                            <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                              POPULAR
                            </span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            onClick={() => handlePackageEdit(pkg)}
                            size="sm"
                            variant="outline"
                            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handlePackageDelete(pkg.id)}
                            size="sm"
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-white mb-1">{pkg.name}</h4>
                        <p className="text-sm text-gray-400 mb-2">{pkg.duration}</p>
                        <p className="text-sm text-gray-300 mb-3">{pkg.description}</p>
                        <div className="space-y-1">
                          {pkg.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="text-xs text-gray-400 flex items-center">
                              <span className="w-1 h-1 bg-neon-cyan rounded-full mr-2"></span>
                              {feature}
                            </div>
                          ))}
                          {pkg.features.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{pkg.features.length - 3} mai multe...
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <>
            {/* Services Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Gestionare Servicii</h2>
              <Button
                onClick={() => {
                  resetServiceForm();
                  setShowServiceForm(true);
                }}
                className="bg-neon-cyan hover:bg-cyan-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adaugă Serviciu
              </Button>
            </div>

            {/* Service Form */}
            {showServiceForm && (
              <Card className="bg-gray-900 border-gray-800 p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  {editingService ? 'Editează Serviciul' : 'Adaugă Serviciu Nou'}
                </h3>
                
                <form onSubmit={handleServiceSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="serviceTitle" className="text-gray-300">Titlu Serviciu *</Label>
                      <Input
                        id="serviceTitle"
                        type="text"
                        value={serviceTitle}
                        onChange={(e) => setServiceTitle(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="ex: DJ pentru Nunți"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="serviceIcon" className="text-gray-300">Iconiță</Label>
                      <Select value={serviceIcon} onValueChange={setServiceIcon}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="Star">Star</SelectItem>
                          <SelectItem value="Music">Music</SelectItem>
                          <SelectItem value="Heart">Heart</SelectItem>
                          <SelectItem value="Zap">Zap</SelectItem>
                          <SelectItem value="Crown">Crown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="serviceDescription" className="text-gray-300">Descriere *</Label>
                    <Textarea
                      id="serviceDescription"
                      value={serviceDescription}
                      onChange={(e) => setServiceDescription(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Descrierea serviciului..."
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="serviceGradient" className="text-gray-300">Gradient</Label>
                    <Select value={serviceGradient} onValueChange={setServiceGradient}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="from-blue-500 to-cyan-500">Albastru → Cyan</SelectItem>
                        <SelectItem value="from-purple-500 to-pink-500">Violet → Roz</SelectItem>
                        <SelectItem value="from-green-500 to-blue-500">Verde → Albastru</SelectItem>
                        <SelectItem value="from-yellow-500 to-orange-500">Galben → Portocaliu</SelectItem>
                        <SelectItem value="from-red-500 to-pink-500">Roșu → Roz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-300">Imagine Serviciu</Label>
                    <div className="space-y-2">
                      <Input
                        type="text"
                        value={serviceImage}
                        onChange={(e) => setServiceImage(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="/src/assets/service-image.jpg"
                      />
                      <div className="flex gap-2">
                        <input
                           type="file"
                           accept="image/*"
                           onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                               handleServiceImageUpload(file);
                             }
                           }}
                           className="hidden"
                           id="serviceImageUpload"
                         />
                        <Button
                          type="button"
                          onClick={() => document.getElementById('serviceImageUpload')?.click()}
                          variant="outline"
                          size="sm"
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          disabled={uploading}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {uploading ? 'Se încarcă...' : 'Încarcă Imagine'}
                        </Button>
                        {serviceImage && serviceImage !== '/src/assets/placeholder.svg' && (
                          <Button
                            type="button"
                            onClick={() => setServiceImage('/src/assets/placeholder.svg')}
                            variant="outline"
                            size="sm"
                            className="border-red-700 text-red-400 hover:bg-red-900/20"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Șterge
                          </Button>
                        )}
                      </div>
                      {serviceImage && serviceImage !== '/src/assets/placeholder.svg' && (
                        <div className="mt-2">
                          <img
                            src={serviceImage}
                            alt="Preview"
                            className="w-32 h-20 object-cover rounded border border-gray-700"
                            onError={(e) => {
                              e.currentTarget.src = '/src/assets/placeholder.svg';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300">Caracteristici *</Label>
                    {serviceFeatures.map((feature, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          type="text"
                          value={feature}
                          onChange={(e) => updateServiceFeature(index, e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white flex-1"
                          placeholder={`Caracteristica ${index + 1}`}
                        />
                        {serviceFeatures.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeServiceFeatureField(index)}
                            variant="outline"
                            size="sm"
                            className="border-red-700 text-red-400 hover:bg-red-900/20"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={addServiceFeatureField}
                      variant="outline"
                      size="sm"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adaugă Caracteristică
                    </Button>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={uploading}
                      className="bg-neon-cyan hover:bg-cyan-600"
                    >
                      {uploading ? 'Se salvează...' : (editingService ? 'Actualizează' : 'Adaugă Serviciul')}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowServiceForm(false);
                        resetServiceForm();
                      }}
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      Anulează
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Services List */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Servicii Disponibile ({services.length})
              </h3>
              
              {services.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800 p-8 text-center">
                  <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Nu există servicii create</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <Card key={service.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                      <div className={`h-32 bg-gradient-to-r ${service.gradient} flex items-center justify-center relative`}>
                        <Star className="w-12 h-12 text-white" />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            onClick={() => handleServiceEdit(service)}
                            size="sm"
                            variant="outline"
                            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleServiceDelete(service.id)}
                            size="sm"
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-white mb-1">{service.title}</h4>
                        <p className="text-sm text-gray-300 mb-3">{service.description}</p>
                        <div className="space-y-1">
                          {service.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="text-xs text-gray-400 flex items-center">
                              <span className="w-1 h-1 bg-neon-cyan rounded-full mr-2"></span>
                              {feature}
                            </div>
                          ))}
                          {service.features.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{service.features.length - 3} mai multe...
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;