import { useState, useEffect } from "react";
import { FiActivity, FiSearch, FiLogIn, FiLogOut, FiClock, FiUser, FiTruck, FiLoader } from "react-icons/fi";
import { verifyVehicle, registerEntry, registerExit } from "../../services/api";

export default function AccesosSeguridad() {
  const [placaInput, setPlacaInput] = useState("");
  const [vehiculoInfo, setVehiculoInfo] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [accesosHoy, setAccesosHoy] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarAccesosHoy();
  }, []);

  const cargarAccesosHoy = () => {
    const guardados = JSON.parse(localStorage.getItem("accesosSeguridad") || "[]");
    const hoy = new Date().toDateString();
    setAccesosHoy(guardados.filter(a => new Date(a.fecha).toDateString() === hoy));
  };

  const verificarPlaca = async () => {
    setMensaje(null);
    setVehiculoInfo(null);
    
    if (!placaInput.trim()) {
      setMensaje({ tipo: "warning", texto: "Ingrese una placa para verificar" });
      return;
    }

    setLoading(true);
    try {
      const data = await verifyVehicle(placaInput.trim().toUpperCase());
      setVehiculoInfo(data);
      setMensaje({ tipo: "success", texto: `✅ Vehículo verificado - Propietario: ${data.nombrePropietario || "Residente"}` });
    } catch (err) {
      if (err.message.includes("404") || err.message.includes("no registrado")) {
        setMensaje({ tipo: "danger", texto: "❌ Placa no registrada. Registrar como visita." });
      } else {
        setMensaje({ tipo: "danger", texto: `❌ Error: ${err.message}` });
      }
    } finally {
      setLoading(false);
    }
  };

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

      const data = await registerEntry(body);

      const nuevoAcceso = {
        id: data.id || Date.now(),
        placa: placaInput.toUpperCase(),
        tipo: "ENTRADA",
        fecha: new Date().toISOString(),
        hora: new Date().toLocaleTimeString(),
        esResidente: !!vehiculoInfo,
        nombreResidente: vehiculoInfo ? vehiculoInfo.nombrePropietario || "Residente" : "VISITANTE"
      };

      const guardados = JSON.parse(localStorage.getItem("accesosSeguridad") || "[]");
      const nuevos = [nuevoAcceso, ...guardados];
      localStorage.setItem("accesosSeguridad", JSON.stringify(nuevos));
      
      const hoy = new Date().toDateString();
      setAccesosHoy(nuevos.filter(a => new Date(a.fecha).toDateString() === hoy));
      
      setMensaje({ tipo: "success", texto: "✅ ENTRADA registrada correctamente" });
      setPlacaInput("");
      setVehiculoInfo(null);
    } catch (err) {
      setMensaje({ tipo: "danger", texto: `❌ Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const registrarSalida = async () => {
    setLoading(true);
    try {
      const guardados = JSON.parse(localStorage.getItem("accesosSeguridad") || "[]");
      const ultimaEntrada = guardados.find(a => 
        a.placa === placaInput.toUpperCase() && a.tipo === "ENTRADA"
      );
      const idRegistro = ultimaEntrada ? ultimaEntrada.id : 0;

      await registerExit(idRegistro);

      const nuevoAcceso = {
        id: Date.now(),
        placa: placaInput.toUpperCase(),
        tipo: "SALIDA",
        fecha: new Date().toISOString(),
        hora: new Date().toLocaleTimeString(),
        esResidente: !!vehiculoInfo,
        nombreResidente: vehiculoInfo ? vehiculoInfo.nombrePropietario || "Residente" : "VISITANTE"
      };

      const nuevos = [nuevoAcceso, ...guardados];
      localStorage.setItem("accesosSeguridad", JSON.stringify(nuevos));
      
      const hoy = new Date().toDateString();
      setAccesosHoy(nuevos.filter(a => new Date(a.fecha).toDateString() === hoy));
      
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
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Accesos</h1>
        <p className="text-slate-500 mt-1 text-sm">Registro de ingresos y salidas del día</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
        <h5 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FiTruck size={20} />
          Verificar Vehículo
        </h5>

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

        {vehiculoInfo && (
          <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-500 mb-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <FiUser size={18} />
                  {vehiculoInfo.nombrePropietario || "Propietario"}
                </h6>
                <p className="text-sm text-slate-500 my-1">Placa: {vehiculoInfo.placa || placaInput}</p>
                {vehiculoInfo.marca && (
                  <p className="text-sm text-slate-500 my-1">
                    Marca: {vehiculoInfo.marca} {vehiculoInfo.modelo ? `- ${vehiculoInfo.modelo}` : ""} {vehiculoInfo.color ? `(${vehiculoInfo.color})` : ""}
                  </p>
                )}
                {vehiculoInfo.tipo && <p className="text-sm text-slate-500 my-1">Tipo: {vehiculoInfo.tipo}</p>}
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
                        acceso.tipo === "ENTRADA" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}>
                        {acceso.tipo}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{acceso.nombreResidente}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        acceso.esResidente ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
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