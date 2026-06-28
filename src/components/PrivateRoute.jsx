import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ALLOWED_ROLES = {
  admin: ['ADMINISTRADOR_CONDOMINIO'],
  superadmin: ['SUPER_ADMINISTRADOR'],
  seguridad: ['AGENTE_SEGURIDAD'],
  propietario: ['PROPIETARIO'],
};

export default function PrivateRoute({ allowedRole, children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const allowed = ALLOWED_ROLES[allowedRole] || [];
  if (!allowed.includes(user.rol)) {
    // Redirigir al home del rol o a login
    return <Navigate to="/login" replace />;
  }

  return children;
}