import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      // Si hay token y usuario en localStorage, lo usamos directamente
      setUser(JSON.parse(storedUser));
      setLoading(false);
      // Opcional: validar el token con el backend
      getCurrentUser()
        .then(data => {
          const userData = data.usuario || data;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else if (token) {
      // Solo token, obtener usuario
      getCurrentUser()
        .then(data => {
          const userData = data.usuario || data;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    if (token) localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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