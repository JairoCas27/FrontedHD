import { Link, useLocation } from "react-router-dom";
import { getUsuario } from "../utils/localStorage";
import {
  LayoutDashboard,
  User,
  Car,
  Building2,
} from "lucide-react";

const Layout = ({ children }) => {
  const location = useLocation();
  const user = getUsuario();

  const menu = [
    { name: "Inicio", path: "/usuario", icon: LayoutDashboard },
    { name: "Mi Perfil", path: "/perfil", icon: User },
    { name: "Mis Vehiculos", path: "/vehiculos", icon: Car },
  ];

  return (
    <div className="flex h-screen bg-[#0B0F1A] text-white">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-[#1a1333] to-[#0f0b1f] flex flex-col">

        {/* LOGO */}
        <div className="p-6 border-b border-purple-900/30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-extrabold tracking-wide text-white">
                URBAN PARK
              </h1>
              <p className="text-xs text-purple-400 tracking-widest">
                CONDOMINIOS
              </p>
            </div>

            <Building2 className="text-purple-500" size={40} />
          </div>
        </div>

        {/* sidebar */}
        <nav className="flex flex-col mt-4">

          {menu.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-6 py-4 no-underline text-white transition-all duration-200
                  ${active? "bg-gradient-to-r from-purple-600/80 to-indigo-600/80 border-l-4 border-purple-400": "hover:bg-purple-900/30"}`}>
                <Icon size={20} className="text-purple-300" />
                <span className="text-sm font-medium tracking-wide">
                  {item.name}
                </span>
              </Link>
            );
          })}

        </nav>

      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-6 overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 font-bold">
            {user?.nombre?.charAt(0) || "U"}
          </div>

          <div>
            <p className="font-semibold">{user?.nombre}</p>
            <p className="text-sm text-gray-400">Residente</p>
          </div>

        </div>

        {children}
      </main>
    </div>
  );
};

export default Layout;