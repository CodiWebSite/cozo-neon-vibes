import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useToast } from '@/hooks/use-toast';
import GalleryEditor from './GalleryEditor';
import AboutEditor from './AboutEditor';
import ServicesEditor from './ServicesEditor';
import PackagesEditor from './PackagesEditor';
import TestimonialsEditor from './TestimonialsEditor';
import ContactEditor from './ContactEditor';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('gallery');
  const { logout } = useSimpleAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Deconectat cu succes',
      description: 'Ai fost deconectat din panoul de administrare.',
      variant: 'default',
    });
    navigate('/admin/login');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panou de Administrare</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Deconectare
        </Button>
      </div>

      <Tabs defaultValue="gallery" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="gallery">Galerie</TabsTrigger>
          <TabsTrigger value="about">Despre</TabsTrigger>
          <TabsTrigger value="services">Servicii</TabsTrigger>
          <TabsTrigger value="packages">Pachete</TabsTrigger>
          <TabsTrigger value="testimonials">Testimoniale</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        <TabsContent value="gallery">
          <GalleryEditor />
        </TabsContent>
        <TabsContent value="about">
          <AboutEditor />
        </TabsContent>
        <TabsContent value="services">
          <ServicesEditor />
        </TabsContent>
        <TabsContent value="packages">
          <PackagesEditor />
        </TabsContent>
        <TabsContent value="testimonials">
          <TestimonialsEditor />
        </TabsContent>
        <TabsContent value="contact">
          <ContactEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;