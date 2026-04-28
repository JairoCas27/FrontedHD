import SidebarLayout from "./SidebarLayout"
import {
  FiHome, FiGrid, FiUsers, FiCreditCard,
  FiShield, FiSettings, FiUser,
} from "react-icons/fi"

const menuItems = [
  { section: "Principal" },
  { title: "Dashboard Global", icon: <FiHome size={20} />, path: "/superadmin/dashboard" },
  { section: "Plataforma" },
  { title: "Condominios", icon: <FiGrid size={20} />, path: "/superadmin/condominios" },
  { title: "Usuarios Globales", icon: <FiUsers size={20} />, path: "/superadmin/usuarios" },
  { title: "Suscripciones", icon: <FiCreditCard size={20} />, path: "/superadmin/suscripciones" },
  { section: "Sistema" },
  { title: "Auditoría Global", icon: <FiShield size={20} />, path: "/superadmin/auditoria" },
  { title: "Configuración SaaS", icon: <FiSettings size={20} />, path: "/superadmin/configuracion" },
  { title: "Perfil", icon: <FiUser size={20} />, path: "/superadmin/perfil" },
]

export default function SidebarSuperAdmin({ isOpen, setIsOpen }) {
  return (
    <SidebarLayout
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      panelLabel="Super Admin"
      accentColor="rgb(124,58,237)"
      accentLight="rgba(124,58,237,0.1)"
      accentDark="rgb(91,33,182)"
      menuItems={menuItems}
      loginRoute="/login"
      storageKey="perfil_superadmin"
    />
  )
}