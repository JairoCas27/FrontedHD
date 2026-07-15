import { useState, useEffect } from "react";
import { FiActivity, FiAlertTriangle, FiCheckCircle, FiMapPin, FiClock, FiShield } from "react-icons/fi";

export default function Alertas() {
  const [formData, setFormData] = useState({
    tipo: "ACCESO_NO_AUTORIZADO",
    descripcion: "",
    ubicacion: ""
  });
  const [mensaje, setMensaje] = useState(null);
  const [alertas, setAlertas] = useState([]);

  // Cargar alertas al iniciar
  useEffect(() => {
    const alertasGuardadas = JSON.parse(localStorage.getItem("alertasSeguridad") || "[]");
    setAlertas(alertasGuardadas);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const registrarAlerta = (e) => {
    e.preventDefault();
    
    if (!formData.descripcion || !formData.ubicacion) {
      setMensaje({ tipo: "warning", texto: "Complete descripción y ubicación" });
      return;
    }

    const nuevaAlerta = {
      id: Date.now(),
      ...formData,
      fecha: new Date().toISOString(),
      hora: new Date().toLocaleTimeString(),
      estado: "ACTIVA"
    };

    const alertasGuardadas = JSON.parse(localStorage.getItem("alertasSeguridad") || "[]");
    const nuevasAlertas = [nuevaAlerta, ...alertasGuardadas];
    
    localStorage.setItem("alertasSeguridad", JSON.stringify(nuevasAlertas));
    setAlertas(nuevasAlertas);
    
    setMensaje({ tipo: "success", texto: "✅ Alerta registrada correctamente" });
    setFormData({ tipo: "ACCESO_NO_AUTORIZADO", descripcion: "", ubicacion: "" });
  };

  const resolverAlerta = (id) => {
    const alertasGuardadas = JSON.parse(localStorage.getItem("alertasSeguridad") || "[]");
    const alertasActualizadas = alertasGuardadas.map(a => 
      a.id === id ? { ...a, estado: "RESUELTA" } : a
    );
    
    localStorage.setItem("alertasSeguridad", JSON.stringify(alertasActualizadas));
    setAlertas(alertasActualizadas);
    
    setMensaje({ tipo: "success", texto: "✅ Alerta marcada como resuelta" });
  };

  const getTipoColor = (tipo) => {
    const colores = {
      ACCESO_NO_AUTORIZADO: "text-red-500 bg-red-50",
      VEHICULO_DANADO: "text-amber-500 bg-amber-50",
      PERSONA_SOSPECHOSA: "text-violet-500 bg-violet-50",
      EMERGENCIA_MEDICA: "text-pink-500 bg-pink-50",
      OTRO: "text-slate-500 bg-slate-50"
    };
    return colores[tipo] || "text-slate-500 bg-slate-50";
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      ACCESO_NO_AUTORIZADO: "Acceso No Autorizado",
      VEHICULO_DANADO: "Vehículo Dañado",
      PERSONA_SOSPECHOSA: "Persona Sospechosa",
      EMERGENCIA_MEDICA: "Emergencia Médica",
      OTRO: "Otro"
    };
    return labels[tipo] || tipo;
  };

  const alertasActivas = alertas.filter(a => a.estado === "ACTIVA");
  const alertasResueltas = alertas.filter(a => a.estado === "RESUELTA");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Alertas</h1>
        <p className="text-slate-500 mt-1 text-sm">Registro de incidentes y alertas de seguridad</p>
      </div>

      {/* FORMULARIO DE NUEVA ALERTA */}
      <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
        <h5 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FiAlertTriangle size={20} />
          Nueva Alerta
        </h5>

        <form onSubmit={registrarAlerta}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tipo de Alerta</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="w-full px-3 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="ACCESO_NO_AUTORIZADO">Acceso No Autorizado</option>
                <option value="VEHICULO_DANADO">Vehículo Dañado</option>
                <option value="PERSONA_SOSPECHOSA">Persona Sospechosa</option>
                <option value="EMERGENCIA_MEDICA">Emergencia Médica</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Ubicación</label>
              <div className="flex items-center gap-2">
                <FiMapPin size={16} className="text-slate-400" />
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  placeholder="Entrada principal, Sótano A, etc."
                  className="flex-1 px-3 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describa el incidente..."
              rows="3"
              className="w-full px-3 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-400 resize-y"
            />
          </div>

          {mensaje && (
            <div className={`p-4 rounded-xl mb-4 border ${
              mensaje.tipo === "success" 
                ? "bg-emerald-50 border-emerald-500 text-emerald-800" 
                : "bg-amber-50 border-amber-500 text-amber-800"
            }`}>
              {mensaje.texto}
            </div>
          )}

          <button
            type="submit"
            className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center gap-2 transition-colors"
          >
            <FiAlertTriangle size={18} />
            Registrar Alerta
          </button>
        </form>
      </div>

      {/* ALERTAS ACTIVAS */}
      <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
        <div className="flex justify-between items-center mb-6">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <FiShield size={20} />
            Alertas Activas
          </h5>
          <span className="px-3 py-1.5 bg-red-50 rounded-full text-xs font-semibold text-red-500">
            {alertasActivas.length} activas
          </span>
        </div>

        {alertasActivas.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <FiCheckCircle size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-base font-medium">No hay alertas activas</p>
            <p className="text-sm mt-1">Todas las alertas han sido resueltas</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {alertasActivas.map((alerta) => (
              <div key={alerta.id} className="p-6 rounded-xl border border-slate-200 border-l-4 border-l-red-500">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTipoColor(alerta.tipo)}`}>
                        {getTipoLabel(alerta.tipo)}
                      </span>
                      <span className="text-sm text-slate-400 flex items-center gap-1">
                        <FiClock size={12} />
                        {alerta.hora}
                      </span>
                    </div>
                    <p className="my-2 text-slate-800 font-semibold">{alerta.descripcion}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <FiMapPin size={14} />
                      {alerta.ubicacion}
                    </p>
                  </div>
                  <button
                    onClick={() => resolverAlerta(alerta.id)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-colors"
                  >
                    <FiCheckCircle size={14} />
                    Resolver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ALERTAS RESUELTAS */}
      {alertasResueltas.length > 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h5 className="font-bold text-slate-800 flex items-center gap-2">
              <FiCheckCircle size={20} />
              Alertas Resueltas
            </h5>
            <span className="px-3 py-1.5 bg-emerald-50 rounded-full text-xs font-semibold text-emerald-500">
              {alertasResueltas.length} resueltas
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {alertasResueltas.map((alerta) => (
              <div key={alerta.id} className="p-6 rounded-xl border border-slate-200 border-l-4 border-l-emerald-500 opacity-70">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-500">
                    RESUELTA
                  </span>
                  <span className="text-sm text-slate-400 flex items-center gap-1">
                    <FiClock size={12} />
                    {alerta.hora}
                  </span>
                </div>
                <p className="my-2 text-slate-800 font-semibold">{alerta.descripcion}</p>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <FiMapPin size={14} />
                  {alerta.ubicacion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}