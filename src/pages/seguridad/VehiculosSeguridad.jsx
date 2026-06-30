import { useState } from "react";
import { FiActivity, FiSearch, FiTruck, FiShield, FiLoader } from "react-icons/fi";
import { verifyVehicle } from "../../services/api";

export default function VehiculosSeguridad() {
  const [placaBusqueda, setPlacaBusqueda] = useState("");
  const [resultado, setResultado] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  const buscarVehiculo = async () => {
    setMensaje(null);
    setResultado(null);
    
    if (!placaBusqueda.trim()) {
      setMensaje({ tipo: "warning", texto: "Ingrese una placa para buscar" });
      return;
    }

    setLoading(true);
    try {
      const data = await verifyVehicle(placaBusqueda.trim().toUpperCase());
      setResultado(data);
      setMensaje({ tipo: "success", texto: "✅ Vehículo encontrado" });
    } catch (err) {
      if (err.message.includes("404") || err.message.includes("no registrado")) {
        setMensaje({ tipo: "danger", texto: "❌ Vehículo no registrado en el sistema" });
      } else {
        setMensaje({ tipo: "danger", texto: `❌ Error: ${err.message}` });
      }
    } finally {
      setLoading(false);
    }
  };

  const InfoItem = ({ label, value }) => (
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase mb-1">{label}</p>
      <p className="font-semibold text-slate-800">{value || "-"}</p>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Vehículos</h1>
        <p className="text-slate-500 mt-1 text-sm">Verificación de vehículos registrados</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
        <h5 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FiSearch size={20} />
          Buscar por Placa
        </h5>

        <div className="flex gap-4 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="Ej: ABC-123"
            value={placaBusqueda}
            onChange={(e) => setPlacaBusqueda(e.target.value.toUpperCase())}
            disabled={loading}
            className="flex-1 min-w-[200px] px-4 py-3 rounded-xl border border-slate-200 text-lg tracking-wider outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-slate-100"
          />
          <button
            onClick={buscarVehiculo}
            disabled={loading}
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <FiLoader size={18} className="animate-spin" /> : <FiSearch size={18} />}
            Buscar
          </button>
        </div>

        {mensaje && (
          <div className={`p-4 rounded-xl mb-4 border ${
            mensaje.tipo === "success" 
              ? "bg-emerald-50 border-emerald-500 text-emerald-800" 
              : mensaje.tipo === "danger" 
                ? "bg-red-50 border-red-500 text-red-800" 
                : "bg-amber-50 border-amber-500 text-amber-800"
          }`}>
            {mensaje.texto}
          </div>
        )}

        {resultado && (
          <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-500">
            <div className="flex items-center gap-2 mb-4">
              <FiShield size={20} className="text-emerald-500" />
              <h6 className="font-bold text-slate-800">Vehículo Autorizado</h6>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem label="Propietario" value={resultado.nombrePropietario} />
              <InfoItem label="Placa" value={resultado.placa} />
              <InfoItem label="Marca" value={resultado.marca} />
              <InfoItem label="Modelo" value={resultado.modelo} />
              <InfoItem label="Color" value={resultado.color} />
              <InfoItem label="Tipo" value={resultado.tipo} />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <FiTruck size={20} />
            Vehículos Registrados
          </h5>
          <span className="px-3 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-500">
            Consulta individual
          </span>
        </div>

        <div className="text-center py-12 text-slate-400">
          <FiActivity size={48} className="mx-auto mb-4 opacity-40" />
          <p className="text-base font-medium">Use la búsqueda para verificar vehículos</p>
          <p className="text-sm mt-1">Ingrese una placa y haga clic en Buscar</p>
        </div>
      </div>
    </div>
  );
}