import SidebarLayout from "./SidebarLayout";
import { FiHome, FiActivity, FiGrid, FiShoppingCart, FiClock, FiUser } from "react-icons/fi";
import { useSidebarUser } from "../hooks/useSidebarUser";

const menuItems = [
  { section: "Panel Principal" },
  { title: "Dashboard", icon: <FiHome size={20} />, path: "/seguridad/dashboard" },
  { title: "Accesos", icon: <FiActivity size={20} />, path: "/seguridad/accesos" },
  { title: "Mapa Parqueo", icon: <FiGrid size={20} />, path: "/seguridad/mapa-parqueo" },
  { title: "Préstamos", icon: <FiShoppingCart size={20} />, path: "/seguridad/prestamos" },
  { title: "Movimientos", icon: <FiClock size={20} />, path: "/seguridad/movimientos" },
  { section: "Cuenta" },
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