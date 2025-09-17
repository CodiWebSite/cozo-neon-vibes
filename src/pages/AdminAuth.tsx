import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        toast({
          title: 'Eroare',
          description: error.message,
          variant: 'destructive',
        });
      } else if (!isLogin) {
        toast({
          title: 'Cont creat',
          description: 'Verifică-ți emailul pentru a confirma contul.',
        });
      }
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'A apărut o problemă. Încearcă din nou.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Badge variant="outline" className="neon-border text-primary mb-4">
            Admin Portal
          </Badge>
          <h1 className="text-3xl font-heading font-bold">
            <span className="gradient-text">DJ Cozo</span> Admin
          </h1>
        </div>

        <Card className="bg-card/30 border-border/50">
          <CardHeader>
            <CardTitle>{isLogin ? 'Conectare Admin' : 'Înregistrare Admin'}</CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Introdu datele pentru a accesa panoul admin' 
                : 'Creează un cont nou de admin'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="password">Parolă</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? 'Conectare' : 'Înregistrare'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary"
              >
                {isLogin 
                  ? 'Nu ai cont? Înregistrează-te' 
                  : 'Ai deja cont? Conectează-te'
                }
              </Button>
            </div>

            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="text-sm"
              >
                ← Înapoi la site
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuth;