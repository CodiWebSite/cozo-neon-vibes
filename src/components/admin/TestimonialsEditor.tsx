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

// Tipul pentru testimoniale
interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
}

// Date inițiale pentru testimoniale
const initialTestimonialsData: Testimonial[] = [
  {
    id: '1',
    name: 'Alexandru Popescu',
    role: 'Mire',
    content: 'Cel mai bun DJ pentru nunta noastră! Toată lumea a dansat până dimineața.'
  },
  {
    id: '2',
    name: 'Maria Ionescu',
    role: 'Manager evenimente',
    content: 'Am colaborat la multiple evenimente corporate și de fiecare dată a fost un succes.'
  },
  {
    id: '3',
    name: 'Cristina Dumitrescu',
    role: 'Mireasă',
    content: 'Muzica a fost perfectă pentru nunta noastră. Recomand cu încredere!'
  }
];

const TestimonialsEditor = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { updateTestimonials } = useContent();

  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    // Simulăm încărcarea datelor
    setTimeout(() => {
      setTestimonials(initialTestimonialsData);
      setLoading(false);
      
      // Actualizăm datele în context pentru a fi disponibile pe site
      updateTestimonials(initialTestimonialsData);
    }, 500);
  }, [updateTestimonials]);

  const resetForm = () => {
    setName('');
    setRole('');
    setContent('');
    setEditingTestimonial(null);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setName(testimonial.name);
    setRole(testimonial.role);
    setContent(testimonial.content);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
    setTestimonials(updatedTestimonials);
    
    // Actualizăm și testimonialele pe site
    await updateTestimonialsOnSite(updatedTestimonials);
    
    toast({
      title: 'Testimonial șters',
      description: 'Testimonialul a fost șters cu succes.',
      variant: 'default',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTestimonial) {
      // Actualizăm testimonialul existent
      const updatedTestimonials = testimonials.map(testimonial => 
        testimonial.id === editingTestimonial.id 
          ? { 
              ...testimonial, 
              name, 
              role, 
              content
            } 
          : testimonial
      );
      setTestimonials(updatedTestimonials);
      
      // Actualizăm și testimonialele pe site
      await updateTestimonialsOnSite(updatedTestimonials);
      
      toast({
        title: 'Testimonial actualizat',
        description: 'Testimonialul a fost actualizat cu succes.',
        variant: 'default',
      });
    } else {
      // Adăugăm un testimonial nou
      const newTestimonial: Testimonial = {
        id: Date.now().toString(),
        name,
        role,
        content
      };
      
      const updatedTestimonials = [...testimonials, newTestimonial];
      setTestimonials(updatedTestimonials);
      
      // Actualizăm și testimonialele pe site
      await updateTestimonialsOnSite(updatedTestimonials);
      
      toast({
        title: 'Testimonial adăugat',
        description: 'Testimonialul a fost adăugat cu succes.',
        variant: 'default',
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };
  
  // Funcție pentru actualizarea testimonialelor pe site
  const updateTestimonialsOnSite = async (updatedTestimonials: Testimonial[]) => {
    try {
      // Actualizăm testimonialele în contextul global (async)
      await updateTestimonials(updatedTestimonials);
      console.log('Testimonialele au fost actualizate pe site:', updatedTestimonials);
    } catch (error) {
      console.error('Eroare la actualizarea testimonialelor:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut salva testimonialele în baza de date.',
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
          <h2 className="text-xl font-bold">Editor Testimoniale</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Adaugă Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingTestimonial ? 'Editează Testimonialul' : 'Adaugă Testimonial Nou'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nume</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Input
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Conținut</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={4}
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

        <div className="grid grid-cols-1 gap-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="border rounded-lg p-4">
              <div className="flex flex-col">
                <blockquote className="text-gray-700 italic mb-2">"{testimonial.content}"</blockquote>
                <div className="font-medium">{testimonial.name}</div>
                <div className="text-sm text-gray-500 mb-3">{testimonial.role}</div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(testimonial)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editează
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(testimonial.id)}>
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

export default TestimonialsEditor;