import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api';
import { ROLE_ROUTES } from '../utils/roleRoutes';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(data => setUser(data.usuario || data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  const getHomeRoute = (rol) => ROLE_ROUTES[rol] ?? '/login';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getHomeRoute }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }