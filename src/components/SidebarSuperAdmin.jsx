// SidebarSuperAdmin.jsx
import SidebarLayout from './SidebarLayout';
import { FiHome, FiGrid, FiUsers, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { section: 'Principal' },
  { title: 'Dashboard', icon: <FiHome size={20} />, path: '/superadmin/dashboard' },
  { section: 'Gestión' },
  { title: 'Condominios', icon: <FiGrid size={20} />, path: '/superadmin/condominios' },
  { title: 'Administradores', icon: <FiUsers size={20} />, path: '/superadmin/administradores' },
  { title: 'Usuarios', icon: <FiUsers size={20} />, path: '/superadmin/usuarios' },
  { title: 'Perfil', icon: <FiUser size={20} />, path: '/superadmin/perfil' },
];

export default function SidebarSuperAdmin({ isOpen, setIsOpen }) {
  const { user } = useAuth();
  return (
    <SidebarLayout
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      panelLabel="Super Admin"
      accentColor="rgb(124,58,237)"
      accentLight="rgba(124,58,237,0.1)"
      accentDark="rgb(91,33,182)"
      menuItems={menuItems}
      user={user}
    />
  );
}