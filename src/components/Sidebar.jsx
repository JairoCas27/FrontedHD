import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  const item = (to, label) => (
    <Link
      to={to}
      className={`block px-4 py-3 rounded-lg mb-2 transition ${
        pathname === to
          ? "bg-gradient-to-r from-purple-600 to-indigo-600"
          : "hover:bg-slate-800"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="w-64 bg-[#0f172a] text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">ParkingOS</h2>

      {item("/usuario", "Dashboard")}
      {item("/perfil", "Profile")}
      {item("/vehiculos", "Vehicles")}
    </div>
  );
};

export default Sidebar;