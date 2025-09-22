import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { verifyCredentials } from '@/lib/auth-data';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SimpleAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verifică dacă există un token de autentificare în localStorage
    const token = localStorage.getItem('admin_auth_token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    const isValid = verifyCredentials(username, password);
    
    if (isValid) {
      // În loc de un token JWT real, folosim un timestamp pentru simplitate
      const simpleToken = `auth_${Date.now()}`;
      localStorage.setItem('admin_auth_token', simpleToken);
      setIsAuthenticated(true);
    }
    
    return isValid;
  };

  const logout = () => {
    localStorage.removeItem('admin_auth_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSimpleAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
};