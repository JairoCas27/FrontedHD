import { getUsuario } from "../utils/localStorage";

const Header = () => {
  const user = getUsuario();

  return (
    <header className="bg-[#0f172a] p-4 flex justify-between items-center border-b border-gray-700">
      <div className="flex items-center gap-3">
        <div className="bg-purple-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
          {user.nombre.charAt(0)}
        </div>
        <div>
          <p className="font-semibold">{user.nombre}</p>
          <p className="text-sm text-gray-400">{user.rol}</p>
        </div>
      </div>
    </header>
  );
}

export default Header;