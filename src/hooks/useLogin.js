// src/hooks/useLogin.js
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
      // Suponemos que la respuesta incluye: { token, usuario }
      login(result.usuario, result.token);
      toast.success(`Bienvenido, ${result.usuario.nombres}`);
      navigate(/* ruta según rol */);
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
    }
  };

  return { handleLogin };
}