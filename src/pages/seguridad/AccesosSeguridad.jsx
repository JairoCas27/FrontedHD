import { useState, useEffect } from "react";
import { FiActivity, FiSearch, FiLogIn, FiLogOut, FiClock, FiUser, FiTruck, FiLoader } from "react-icons/fi";

const API_URL = "https://sgc-backend-vfvl.onrender.com/api/security";

// Helper para headers con token (usando "usuario" de tu localStorage)
const getHeaders = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const token = usuario?.token || "";
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export default function AccesosSeguridad() {
  const [placaInput, setPlacaInput] = useState("");
  const [vehiculoInfo, setVehiculoInfo] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [accesosHoy, setAccesosHoy] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar accesos del día al iniciar
  useEffect(() => {
    cargarAccesosHoy();
  }, []);

  const cargarAccesosHoy = () => {
    const accesosGuardados = JSON.parse(localStorage.getItem("accesosSeguridad") || "[]");
    const hoy = new Date().toDateString();
    const accesosHoyFiltrados = accesosGuardados.filter(a => new Date(a.fecha).toDateString() === hoy);
    setAccesosHoy(accesosHoyFiltrados);
  };

  // Verificar placa en la API
  const verificarPlaca = async () => {
    setMensaje(null);
    setVehiculoInfo(null);
    
    if (!placaInput.trim()) {
      setMensaje({ tipo: "warning", texto: "Ingrese una placa para verificar" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/vehicles/verify/${placaInput.trim().toUpperCase()}`, {
        headers: getHeaders()
      });

      if (!res.ok) {
        if (res.status === 404) {
          setMensaje({ tipo: "danger", texto: "❌ Placa no registrada. Registrar como visita." });
        } else {
          throw new Error("Error al verificar vehículo");
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      setVehiculoInfo(data);
      setMensaje({ tipo: "success", texto: `✅ Vehículo verificado - Propietario: ${data.nombrePropietario || "Residente"}` });
    } catch (err) {
      setMensaje({ tipo: "danger", texto: `❌ Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Registrar ENTRADA en la API
  const registrarEntrada = async () => {
    setLoading(true);
    try {
      const body = {
        placa: placaInput.toUpperCase(),
        tipo: "ENTRADA",
        ocupante: vehiculoInfo ? vehiculoInfo.nombrePropietario || "Residente" : "VISITANTE",
        datosInquilino: vehiculoInfo ? `Propietario: ${vehiculoInfo.nombrePropietario || ""}` : "Visitante sin registro",
        fechaInquilino: new Date().toISOString()
      };

      const res = await fetch(`${API_URL}/access-logs/entry`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Error al registrar entrada");

      const data = await res.json();

      // Guardar en localStorage para mostrar en tabla
      const nuevoAcceso = {
        id: data.id || Date.now(),
        placa: placaInput.toUpperCase(),
        tipo: "ENTRADA",
        fecha: new Date().toISOString(),
        hora: new Date().toLocaleTimeString(),
        esResidente: !!vehiculoInfo,
        nombreResidente: vehiculoInfo ? vehiculoInfo.nombrePropietario || "Residente" : "VISITANTE"
      };

      const accesosGuardados = JSON.parse(localStorage.getItem("accesosSeguridad") || "[]");
      const nuevosAccesos = [nuevoAcceso, ...accesosGuardados];
      localStorage.setItem("accesosSeguridad", JSON.stringify(nuevosAccesos));
      
      const hoy = new Date().toDateString();
      setAccesosHoy(nuevosAccesos.filter(a => new Date(a.fecha).toDateString() === hoy));
      
      setMensaje({ tipo: "success", texto: "✅ ENTRADA registrada correctamente" });
      setPlacaInput("");
      setVehiculoInfo(null);
    } catch (err) {
      setMensaje({ tipo: "danger", texto: `❌ Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Registrar SALIDA en la API
  const registrarSalida = async () => {
    setLoading(true);
    try {
      // Buscar el último acceso de entrada con esta placa
      const accesosGuardados = JSON.parse(localStorage.getItem("accesosSeguridad") || "[]");
      const ultimaEntrada = accesosGuardados.find(a => 
        a.placa === placaInput.toUpperCase() && a.tipo === "ENTRADA"
      );

      const idRegistro = ultimaEntrada ? ultimaEntrada.id : 0;

      const body = { idRegistro };

      const res = await fetch(`${API_URL}/access-logs/exit`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Error al registrar salida");

      const data = await res.json();

      // Guardar en localStorage para mostrar en tabla
      const nuevoAcceso = {
        id: data.id || Date.now(),
        placa: placaInput.toUpperCase(),
        tipo: "SALIDA",
        fecha: new Date().toISOString(),
        hora: new Date().toLocaleTimeString(),
        esResidente: !!vehiculoInfo,
        nombreResidente: vehiculoInfo ? vehiculoInfo.nombrePropietario || "Residente" : "VISITANTE"
      };

      const nuevosAccesos = [nuevoAcceso, ...accesosGuardados];
      localStorage.setItem("accesosSeguridad", JSON.stringify(nuevosAccesos));
      
      const hoy = new Date().toDateString();
      setAccesosHoy(nuevosAccesos.filter(a => new Date(a.fecha).toDateString() === hoy));
      
      setMensaje({ tipo: "success", texto: "✅ SALIDA registrada correctamente" });
      setPlacaInput("");
      setVehiculoInfo(null);
    } catch (err) {
      setMensaje({ tipo: "danger", texto: `❌ Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Accesos</h1>
        <p className="text-slate-500 mt-1 text-sm">Registro de ingresos y salidas del día</p>
      </div>

      {/* SECCIÓN DE VERIFICACIÓN */}
      <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
        <h5 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FiTruck size={20} />
          Verificar Vehículo
        </h5>

        {/* INPUT Y BOTÓN */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="Ej: ABC-123"
            value={placaInput}
            onChange={(e) => setPlacaInput(e.target.value.toUpperCase())}
            disabled={loading}
            className="flex-1 min-w-[200px] px-4 py-3 rounded-xl border border-slate-200 text-lg tracking-wider outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-slate-100"
          />
          <button
            onClick={verificarPlaca}
            disabled={loading}
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <FiLoader size={18} className="animate-spin" /> : <FiSearch size={18} />}
            Verificar
          </button>
        </div>

        {/* MENSAJE */}
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

        {/* INFO DEL VEHÍCULO */}
        {vehiculoInfo && (
          <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-500 mb-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <FiUser size={18} />
                  {vehiculoInfo.nombrePropietario || "Propietario"}
                </h6>
                <p className="text-sm text-slate-500 my-1">
                  Placa: {vehiculoInfo.placa || placaInput}
                </p>
                {vehiculoInfo.marca && (
                  <p className="text-sm text-slate-500 my-1">
                    Marca: {vehiculoInfo.marca} {vehiculoInfo.modelo ? `- ${vehiculoInfo.modelo}` : ""} {vehiculoInfo.color ? `(${vehiculoInfo.color})` : ""}
                  </p>
                )}
                {vehiculoInfo.tipo && (
                  <p className="text-sm text-slate-500 my-1">
                    Tipo: {vehiculoInfo.tipo}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={registrarEntrada}
                  disabled={loading}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  <FiLogIn size={16} />
                  Entrada
                </button>
                <button
                  onClick={registrarSalida}
                  disabled={loading}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  <FiLogOut size={16} />
                  Salida
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TABLA DE ACCESOS */}
      <div className="bg-white rounded-2xl p-8 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <FiClock size={20} />
            Accesos de Hoy
          </h5>
          <span className="px-3 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-500">
            {accesosHoy.length} registros
          </span>
        </div>

        {accesosHoy.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <FiActivity size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-base font-medium">Sin accesos registrados hoy</p>
            <p className="text-sm mt-1">Los registros aparecerán aquí</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase">Hora</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase">Placa</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase">Tipo</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase">Residente/Visitante</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody>
                {accesosHoy.map((acceso) => (
                  <tr key={acceso.id} className="border-b border-slate-100">
                    <td className="p-4 font-bold text-slate-800">{acceso.hora}</td>
                    <td className="p-4 text-slate-500">{acceso.placa}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        acceso.tipo === "ENTRADA" 
                          ? "bg-emerald-100 text-emerald-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {acceso.tipo}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{acceso.nombreResidente}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        acceso.esResidente 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {acceso.esResidente ? "Residente" : "Visitante"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}