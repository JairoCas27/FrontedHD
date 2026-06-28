import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser()
        .then((data) => {
          // Si la respuesta es { usuario: {...} }
          setUser(data.usuario || data);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    if (token) localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const getHomeRoute = (rol) => {
    switch (rol) {
      case 'SUPER_ADMINISTRADOR': return '/superadmin/dashboard';
      case 'ADMINISTRADOR_CONDOMINIO': return '/admin/dashboard';
      case 'AGENTE_SEGURIDAD': return '/seguridad/accesos';
      case 'PROPIETARIO': return '/propietario/dashboard';
      default: return '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getHomeRoute }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }