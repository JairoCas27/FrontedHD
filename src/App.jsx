import { Routes, Route, Navigate } from "react-router-dom";
import UsuarioDashboard from "./pages/Usuario/UsuarioDashboard";
import UsuarioPerfil from "./pages/Usuario/UsuarioPerfil";
import UsuarioVehiculos from "./pages/Usuario/UsuarioVehiculos";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 text-white"><Routes>
        <Route path="/" element={<Navigate to="/usuario" />} />
        <Route path="/usuario" element={<UsuarioDashboard />} />
        <Route path="/perfil" element={<UsuarioPerfil />} />
        <Route path="/vehiculos" element={<UsuarioVehiculos />} />
    </Routes>
    </div>
  );
}

export default App;


