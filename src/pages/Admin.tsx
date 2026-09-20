import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import AdminLogin from '@/components/AdminLogin';
import AdminPanel from '@/components/AdminPanel';
import { Loader2 } from 'lucide-react';

const Admin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = (userId: string) => {
      supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle()
        .then(({ data }) => {
          setIsAdmin(!!data);
          setLoading(false);
        });
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        setLoading(true);
        setTimeout(() => checkRole(newSession.user.id), 0);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session: current } }) => {
      setSession(current);
      if (current?.user) {
        checkRole(current.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Se verifică autentificarea...</p>
        </div>
      </div>
    );
  }

  if (!session) return <AdminLogin />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-heading font-bold text-foreground">Acces restricționat</h1>
          <p className="text-muted-foreground">
            Contul tău nu are drepturi de administrator. Contactează administratorul site-ului.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-primary hover:underline"
          >
            Ieși din cont
          </button>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
};

export default Admin;
