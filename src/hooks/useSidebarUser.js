import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail } from 'react-icons/fi';

export function useSidebarUser() {
  const { user } = useAuth();

  return [
    {
      icon: <FiUser size={18} />,
      value: user ? `${user.nombres ?? ''} ${user.apellidos ?? ''}`.trim() || '—' : '—',
    },
    {
      icon: <FiMail size={18} />,
      value: user?.correo ?? '—',
    },
  ];
}