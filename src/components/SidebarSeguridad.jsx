import SidebarLayout from "./SidebarLayout";
import { FiActivity, FiUserCheck, FiTruck, FiList, FiBell, FiUser } from "react-icons/fi";
import { useSidebarUser } from "../hooks/useSidebarUser";

const menuItems = [
  { section: "Operaciones" },
  { title: "Accesos", icon: <FiActivity size={20} />, path: "/seguridad/accesos" },
  { title: "Estacionamientos", icon: <FiTruck size={20} />, path: "/seguridad/vehiculos" },
  { title: "Carritos", icon: <FiUserCheck size={20} />, path: "/seguridad/visitas" },
  { section: "Historial" },
  { title: "Movimientos", icon: <FiList size={20} />, path: "/seguridad/movimientos" },
  { section: "Sistema" },
  { title: "Perfil", icon: <FiUser size={20} />, path: "/seguridad/perfil" },
]

export default function SidebarSeguridad({ isOpen, setIsOpen }) {
  const userInfo = useSidebarUser();
  return (
    <SidebarLayout
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      panelLabel="Panel Seguridad"
      accentColor="rgb(34,197,94)"
      accentLight="rgba(34,197,94,0.1)"
      accentDark="rgb(22,163,74)"
      menuItems={menuItems}
      userInfo={userInfo}
    />
  );
}