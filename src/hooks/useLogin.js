import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../services/api';
import { ROLE_ROUTES } from '../utils/roleRoutes';
import { toast } from 'react-toastify';

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async ({ correo, password, recuerdame }) => {
    try {
      const result = await loginApi({ correo, password, recuerdame });
      login(result.usuario);
      toast.success(`Bienvenido, ${result.usuario?.nombres || 'usuario'}`);
      navigate(ROLE_ROUTES[result.usuario?.rol] ?? '/');
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
    }
  };

  return { handleLogin };
}