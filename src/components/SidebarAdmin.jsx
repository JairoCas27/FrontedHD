import SidebarLayout from "./SidebarLayout";
import { FiHome, FiUsers, FiLayers, FiGrid , FiPackage, FiBarChart2, FiSettings, FiShield, FiUser } from "react-icons/fi";
import { useSidebarUser } from "../hooks/useSidebarUser";


const menuItems = [
  { section: "Principal" },
  { title: "Dashboard", icon: <FiHome size={20} />, path: "/admin/dashboard" },
  { section: "Gestión Inmobiliaria" },
  { title: "Usuarios", icon: <FiUsers size={20} />, path: "/admin/usuarios" },
  { title: "Departamentos", icon: <FiLayers size={20} />, path: "/admin/departamentos" },
  { title: "Estructura", icon: <FiGrid size={20} />, path: "/admin/estructura" },
  { title: "Bienes Comunes", icon: <FiPackage size={20} />, path: "/admin/bienes" },
  { section: "Análisis y Sistema" },
  { title: "Reportes", icon: <FiBarChart2 size={20} />, path: "/admin/reportes" },
  { title: "Configuración", icon: <FiSettings size={20} />, path: "/admin/configuracion" },
  { title: "Auditoría", icon: <FiShield size={20} />, path: "/admin/auditoria" },
  { title: "Perfil", icon: <FiUser size={20} />, path: "/admin/perfil" },
];

export default function SidebarAdmin({ isOpen, setIsOpen }) {
  const userInfo = useSidebarUser();
  
  return (
    <SidebarLayout
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      panelLabel="Panel Admin"
      accentColor="rgb(52,151,195)"
      accentLight="rgba(52,151,195,0.1)"
      accentDark="rgb(37,117,152)"
      menuItems={menuItems}
      userInfo={userInfo}
    />
  );
}