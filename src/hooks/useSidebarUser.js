import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail } from 'react-icons/fi';
import { createElement } from 'react';

export function useSidebarUser() {
  const { user } = useAuth();

  return [
    {
      icon: createElement(FiUser, { size: 18 }),
      value: user ? `${user.nombres ?? ''} ${user.apellidos ?? ''}`.trim() || '—' : '—',
    },
    {
      icon: createElement(FiMail, { size: 18 }),
      value: user?.correo ?? '—',
    },
  ];
}