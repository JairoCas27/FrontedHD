import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_ROUTES } from '../utils/roleRoutes';

const ALLOWED_ROLES = {
  admin:       ['ADMINISTRADOR_CONDOMINIO'],
  superadmin:  ['SUPER_ADMINISTRADOR'],
  seguridad:   ['AGENTE_SEGURIDAD'],
  propietario: ['PROPIETARIO'],
};

export default function PrivateRoute({ allowedRole, children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  const allowed = ALLOWED_ROLES[allowedRole] || [];
  if (!allowed.includes(user.rol)) {
    return <Navigate to={ROLE_ROUTES[user.rol] ?? '/login'} replace />;
  }

  return children;
}