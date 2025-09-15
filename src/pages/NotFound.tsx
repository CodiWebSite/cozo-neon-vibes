import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-heading font-bold gradient-text">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            Pagina nu a fost găsită
          </h2>
          <p className="text-muted-foreground">
            Ne pare rău, dar pagina pe care o cauți nu există sau a fost mutată.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-primary to-accent hover:scale-105 smooth-transition glow-effect"
          >
            <Home className="w-4 h-4 mr-2" />
            Înapoi Acasă
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
            className="neon-border hover:glow-effect"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Înapoi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
