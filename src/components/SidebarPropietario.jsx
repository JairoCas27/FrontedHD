// src/components/SidebarPropietario.jsx

import { FiHome, FiTruck, FiUsers, FiClock, FiUser, FiGrid, FiCreditCard, FiMail } from "react-icons/fi"
import { useAuth } from "../context/AuthContext"
import SidebarLayout from "./SidebarLayout"

const menuItems = [
  { section: "Principal" },
  { title: "Dashboard",      icon: <FiHome size={20} />,  path: "/propietario/dashboard"   },
  { section: "Mi Apartamento" },
  { title: "Mi Apartamento", icon: <FiGrid size={20} />,  path: "/propietario/apartamento" },
  { title: "Mis Vehículos",  icon: <FiTruck size={20} />, path: "/propietario/vehiculos"   },
  { title: "Mis Inquilinos", icon: <FiUsers size={20} />, path: "/propietario/inquilinos"  },
  { section: "Sistema" },
  { title: "Historial",      icon: <FiClock size={20} />, path: "/propietario/historial"   },
  { title: "Perfil",         icon: <FiUser size={20} />,  path: "/propietario/perfil"      },
]

export default function SidebarPropietario({ isOpen, setIsOpen }) {
  const { user } = useAuth()

  const userInfo = [
    {
      icon: <FiCreditCard size={18} />,
      value: user?.id ? String(user.id) : "—",
    },
    {
      icon: <FiUser size={18} />,
      value: user ? `${user.nombres ?? ""} ${user.apellidos ?? ""}`.trim() || "—" : "—",
    },
    {
      icon: <FiMail size={18} />,
      value: user?.correo ?? "—",
    },
  ]

  return (
    <SidebarLayout
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      panelLabel="Panel Propietario"
      accentColor="rgb(249,115,22)"
      accentLight="rgba(249,115,22,0.1)"
      accentDark="rgb(234,88,12)"
      menuItems={menuItems}
      storageKey={null}
      userInfo={userInfo}
    />
  )
}