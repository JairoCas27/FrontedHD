import SidebarLayout from "./SidebarLayout"
import {
  FiActivity, FiUserCheck, FiTruck,
  FiList, FiBell, FiUser,
} from "react-icons/fi"

const menuItems = [
  { section: "Operaciones" },
  { title: "Accesos", icon: <FiActivity size={20} />, path: "/seguridad/accesos" },
  { title: "Visitas", icon: <FiUserCheck size={20} />, path: "/seguridad/visitas" },
  { title: "Vehículos", icon: <FiTruck size={20} />, path: "/seguridad/vehiculos" },
  { section: "Historial" },
  { title: "Movimientos", icon: <FiList size={20} />, path: "/seguridad/movimientos" },
  { section: "Sistema" },
  { title: "Alertas", icon: <FiBell size={20} />, path: "/seguridad/alertas" },
  { title: "Perfil", icon: <FiUser size={20} />, path: "/seguridad/perfil" },
]

export default function SidebarSeguridad({ isOpen, setIsOpen }) {
  return (
    <SidebarLayout
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      panelLabel="Panel Seguridad"
      accentColor="rgb(34,197,94)"
      accentLight="rgba(34,197,94,0.1)"
      accentDark="rgb(22,163,74)"
      menuItems={menuItems}
      loginRoute="/login-seguridad"
      storageKey="perfilSeguridad"
    />
  )
}