import SidebarLayout from "./SidebarLayout"
import {
  FiHome, FiUsers, FiTruck, FiMapPin, FiActivity,
  FiUserCheck, FiBarChart2, FiBell, FiSettings, FiShield, FiUser,
} from "react-icons/fi"

const menuItems = [
  { section: "Principal" },
  { title: "Dashboard", icon: <FiHome size={20} />, path: "/admin/dashboard" },
  { section: "Gestión" },
  { title: "Usuarios", icon: <FiUsers size={20} />, path: "/admin/usuarios" },
  { title: "Vehículos", icon: <FiTruck size={20} />, path: "/admin/vehiculos" },
  { title: "Estacionamientos", icon: <FiMapPin size={20} />, path: "/admin/estacionamientos" },
  { section: "Operaciones" },
  { title: "Accesos", icon: <FiActivity size={20} />, path: "/admin/accesos" },
  { title: "Visitas", icon: <FiUserCheck size={20} />, path: "/admin/visitas" },
  { section: "Análisis" },
  { title: "Reportes", icon: <FiBarChart2 size={20} />, path: "/admin/reportes" },
  { title: "Notificaciones", icon: <FiBell size={20} />, path: "/admin/notificaciones" },
  { section: "Sistema" },
  { title: "Configuración", icon: <FiSettings size={20} />, path: "/admin/configuracion" },
  { title: "Auditoría", icon: <FiShield size={20} />, path: "/admin/auditoria" },
  { title: "Perfil", icon: <FiUser size={20} />, path: "/admin/perfil" },
]

export default function SidebarAdmin({ isOpen, setIsOpen }) {
  return (
    <SidebarLayout
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      panelLabel="Panel Admin"
      accentColor="rgb(52,151,195)"
      accentLight="rgba(52,151,195,0.1)"
      accentDark="rgb(37,117,152)"
      menuItems={menuItems}
      loginRoute="/login"
      storageKey="perfil_condominio_admin"
    />
  )
}