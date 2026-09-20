import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, Loader2, CheckCircle2, XCircle } from 'lucide-react';

type Peek =
  | { state: 'loading' }
  | { state: 'valid'; email: string; expiresAt: string }
  | { state: 'invalid'; reason: string };

const REASONS: Record<string, string> = {
  invalid_token: 'Linkul de invitație nu este valid.',
  expired: 'Invitația a expirat. Cere una nouă administratorului.',
  revoked: 'Invitația a fost anulată.',
  accepted: 'Invitația a fost deja folosită.',
};

const AdminInvite = () => {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navigate = useNavigate();
  const { toast } = useToast();

  const [peek, setPeek] = useState<Peek>({ state: 'loading' });
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase.rpc('peek_admin_invitation', { _token: token });
      if (!active) return;
      const result = (data ?? {}) as { ok?: boolean; error?: string; email?: string; expires_at?: string };
      if (error || !result.ok) {
        setPeek({ state: 'invalid', reason: result.error ?? 'invalid_token' });
        return;
      }
      setPeek({ state: 'valid', email: result.email ?? '', expiresAt: result.expires_at ?? '' });
    })();
    return () => {
      active = false;
    };
  }, [token]);

  const accept = async () => {
    const { data, error } = await supabase.rpc('accept_admin_invitation', { _token: token });
    const result = (data ?? {}) as { ok?: boolean; error?: string; invited_email?: string };
    if (error || !result.ok) {
      const map: Record<string, string> = {
        ...REASONS,
        not_signed_in: 'Trebuie să fii autentificat pentru a accepta invitația.',
        email_mismatch: `Invitația este pentru ${result.invited_email ?? 'alt email'}. Autentifică-te cu acel email.`,
      };
      toast({
        title: 'Invitația nu a putut fi acceptată',
        description: map[result.error ?? ''] ?? error?.message ?? 'Încearcă din nou.',
        variant: 'destructive',
      });
      return false;
    }
    setDone(true);
    setTimeout(() => navigate('/admin'), 1500);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (peek.state !== 'valid') return;
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: peek.email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error && !/already registered/i.test(error.message)) throw error;
        if (error) {
          const { error: signInError } = await supabase.auth.signInWithPassword({ email: peek.email, password });
          if (signInError) throw signInError;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: peek.email, password });
        if (error) throw error;
      }
      await accept();
    } catch (error: unknown) {
      toast({
        title: 'Nu a mers',
        description: error instanceof Error ? error.message : 'Încearcă din nou.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 bg-card/60 border-border/50 space-y-6">
        {peek.state === 'loading' && (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {peek.state === 'invalid' && (
          <div className="text-center space-y-3">
            <XCircle className="w-10 h-10 text-destructive mx-auto" />
            <h1 className="text-xl font-heading font-bold text-foreground">Invitație indisponibilă</h1>
            <p className="text-sm text-muted-foreground">{REASONS[peek.reason] ?? REASONS.invalid_token}</p>
            <Button variant="outline" onClick={() => navigate('/')}>Înapoi la site</Button>
          </div>
        )}

        {peek.state === 'valid' && done && (
          <div className="text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
            <h1 className="text-xl font-heading font-bold text-foreground">Bine ai venit!</h1>
            <p className="text-sm text-muted-foreground">Ai acum acces la panoul de administrare. Te ducem acolo...</p>
          </div>
        )}

        {peek.state === 'valid' && !done && (
          <>
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-full bg-primary/10 glow-effect">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Invitație administrator</h1>
              <p className="text-sm text-muted-foreground">
                Ai fost invitat să administrezi site-ul DJ Cozo cu adresa <span className="text-foreground">{peek.email}</span>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={peek.email} readOnly className="pl-9 bg-background/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {mode === 'signup' ? 'Alege o parolă' : 'Parola ta'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    placeholder="••••••••"
                    className="pl-9 bg-background/50"
                  />
                </div>
              </div>

              <Button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-primary to-accent text-white">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Acceptă invitația'}
              </Button>
            </form>

            <button
              type="button"
              onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
              className="w-full text-sm text-muted-foreground hover:text-primary smooth-transition"
            >
              {mode === 'signup' ? 'Am deja cont cu acest email' : 'Vreau să îmi creez un cont nou'}
            </button>
          </>
        )}
      </Card>
    </div>
  );
};

export default AdminInvite;
