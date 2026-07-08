import SidebarLayout from "./SidebarLayout";
import { FiHome, FiGrid, FiUsers, FiUser, FiBarChart2, FiClock, FiShield, FiUserCheck } from "react-icons/fi";
import { useSidebarUser } from "../hooks/useSidebarUser";

const menuItems = [
  { section: "Principal" },
  { title: "Dashboard", icon: <FiHome size={20} />, path: "/superadmin/dashboard" },
  { section: "Gestión" },
  { title: "Condominios", icon: <FiGrid size={20} />, path: "/superadmin/condominios" },
  { title: "Usuarios", icon: <FiUsers size={20} />, path: "/superadmin/usuarios" },
  { section: "Roles" },
  { title: "Administradores", icon: <FiUsers size={20} />, path: "/superadmin/administradores" },
  { title: "Agentes Seguridad", icon: <FiShield size={20} />, path: "/superadmin/agentes" },
  { title: "Propietarios", icon: <FiUserCheck size={20} />, path: "/superadmin/propietarios" },
  { section: "Monitoreo" },
  { title: "Auditoría", icon: <FiClock size={20} />, path: "/superadmin/auditoria" },
  { title: "Reportes", icon: <FiBarChart2 size={20} />, path: "/superadmin/reportes" },
  { section: "Cuenta" },
  { title: "Perfil", icon: <FiUser size={20} />, path: "/superadmin/perfil" },
];

export default function SidebarSuperAdmin({ isOpen, setIsOpen }) {
  const userInfo = useSidebarUser();
  return (
    <SidebarLayout
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      panelLabel="Super Admin"
      accentColor="rgb(124,58,237)"
      accentLight="rgba(124,58,237,0.1)"
      accentDark="rgb(91,33,182)"
      menuItems={menuItems}
      userInfo={userInfo}
    />
  );
}