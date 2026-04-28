import SidebarLayout from "./SidebarLayout"
import {
  FiHome, FiTruck, FiMapPin,
  FiUserCheck, FiBell, FiUser,
} from "react-icons/fi"

const menuItems = [
  { section: "Principal" },
  { title: "Dashboard", icon: <FiHome size={20} />, path: "/propietario/dashboard" },
  { section: "Mis Recursos" },
  { title: "Mis Vehículos", icon: <FiTruck size={20} />, path: "/propietario/vehiculos" },
  { title: "Mis Estacionamientos", icon: <FiMapPin size={20} />, path: "/propietario/estacionamientos" },
  { title: "Mis Visitas", icon: <FiUserCheck size={20} />, path: "/propietario/visitas" },
  { section: "Sistema" },
  { title: "Notificaciones", icon: <FiBell size={20} />, path: "/propietario/notificaciones" },
  { title: "Perfil", icon: <FiUser size={20} />, path: "/propietario/perfil" },
]

export default function SidebarPropietario({ isOpen, setIsOpen }) {
  return (
    <SidebarLayout
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      panelLabel="Panel Propietario"
      accentColor="rgb(249,115,22)"
      accentLight="rgba(249,115,22,0.1)"
      accentDark="rgb(234,88,12)"
      menuItems={menuItems}
      loginRoute="/login-propietario"
      storageKey="usuario"
    />
  )
}