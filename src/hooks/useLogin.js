import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../services/api';
import { toast } from 'react-toastify';

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async ({ correo, password, recuerdame }) => {
    try {
      const result = await loginApi({ correo, password, recuerdame });
      // Se espera: { token, usuario }
      login(result.usuario, result.token);
      toast.success(`Bienvenido, ${result.usuario.nombres}`);

      // Redirigir según rol
      const role = result.usuario.rol;
      if (role === 'SUPER_ADMINISTRADOR') navigate('/superadmin/dashboard');
      else if (role === 'ADMINISTRADOR_CONDOMINIO') navigate('/admin/dashboard');
      else if (role === 'AGENTE_SEGURIDAD') navigate('/seguridad/accesos');
      else if (role === 'PROPIETARIO') navigate('/propietario/dashboard');
      else navigate('/');
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
    }
  };

  return { handleLogin };
}