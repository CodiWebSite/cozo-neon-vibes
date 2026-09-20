import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Lock, Mail, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }

      // Primul cont creat devine administrator
      await supabase.rpc('claim_admin_if_none');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Încearcă din nou.';
      toast({
        title: mode === 'signup' ? 'Nu am putut crea contul' : 'Autentificare eșuată',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 bg-card/60 border-border/50 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-primary/10 glow-effect">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Panou Administrare</h1>
          <p className="text-sm text-muted-foreground">
            {mode === 'login' ? 'Autentifică-te pentru a gestiona site-ul' : 'Creează contul de administrator'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="email@exemplu.ro"
                className="pl-9 bg-background/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Parolă</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder="••••••••"
                className="pl-9 bg-background/50"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-accent text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === 'login' ? 'Intră în panou' : 'Creează cont'}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="w-full text-sm text-muted-foreground hover:text-primary smooth-transition"
        >
          {mode === 'login' ? 'Nu ai încă un cont? Creează-l aici' : 'Ai deja cont? Autentifică-te'}
        </button>
      </Card>
    </div>
  );
};

export default AdminLogin;
