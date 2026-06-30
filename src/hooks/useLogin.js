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
      console.log("1. llamando loginApi...");
      const result = await loginApi({ correo, password, recuerdame });
      console.log("2. resultado:", result);
      console.log("3. usuario:", result.usuario);
      console.log("4. rol:", result.usuario?.rol);
      console.log("5. ruta calculada:", ROLE_ROUTES[result.usuario?.rol] ?? '/');
      console.log("6. ROLE_ROUTES completo:", ROLE_ROUTES);

      login(result.usuario);
      console.log("7. login() ejecutado");

      const ruta = ROLE_ROUTES[result.usuario?.rol] ?? '/';
      console.log("8. navegando a:", ruta);
      navigate(ruta);
      console.log("9. navigate() ejecutado");

      toast.success(`Bienvenido, ${result.usuario?.nombres || 'usuario'}`);
    } catch (error) {
      console.error("ERROR en login:", error);
      toast.error(error.message || 'Error al iniciar sesión');
    }
  };

  return { handleLogin };
}