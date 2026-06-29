import { useState, useEffect } from "react";
import { FiActivity, FiUserPlus, FiClock, FiLogOut, FiUsers, FiLoader } from "react-icons/fi";

const API_URL = "https://sgc-backend-vfvl.onrender.com/api/security";

const getHeaders = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${usuario?.token || ""}`
  };
};

export default function VisitasSeguridad() {
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    placa: "",
    visitaA: "",
    motivo: ""
  });
  const [mensaje, setMensaje] = useState(null);
  const [visitasActivas, setVisitasActivas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarVisitasActivas();
  }, []);

  const cargarVisitasActivas = () => {
    const guardadas = JSON.parse(localStorage.getItem("visitasSeguridad") || "[]");
    const hoy = new Date().toDateString();
    const activas = guardadas.filter(v => 
      new Date(v.fechaEntrada).toDateString() === hoy && !v.horaSalida
    );
    setVisitasActivas(activas);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const registrarVisita = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.dni || !formData.visitaA) {
      setMensaje({ tipo: "warning", texto: "Complete nombre, DNI y a quién visita" });
      return;
    }

    setLoading(true);
    try {
      const body = {
        placa: formData.placa.toUpperCase() || "SIN-PLACA",
        tipo: "ENTRADA",
        ocupante: formData.nombre,
        datosInquilino: `Visita a: ${formData.visitaA} | Motivo: ${formData.motivo || "No especificado"}`,
        fechaInquilino: new Date().toISOString()
      };

      const res = await fetch(`${API_URL}/access-logs/entry`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Error al registrar visita");

      const data = await res.json();

      const nuevaVisita = {
        id: data.id || Date.now(),
        ...formData,
        placa: formData.placa.toUpperCase() || "SIN PLACA",
        fechaEntrada: new Date().toISOString(),
        horaEntrada: new Date().toLocaleTimeString(),
        horaSalida: null
      };

      const guardadas = JSON.parse(localStorage.getItem("visitasSeguridad") || "[]");
      const nuevas = [nuevaVisita, ...guardadas];
      localStorage.setItem("visitasSeguridad", JSON.stringify(nuevas));
      
      const hoy = new Date().toDateString();
      setVisitasActivas(nuevas.filter(v => 
        new Date(v.fechaEntrada).toDateString() === hoy && !v.horaSalida
      ));
      
      setMensaje({ tipo: "success", texto: "✅ Visita registrada correctamente" });
      setFormData({ nombre: "", dni: "", placa: "", visitaA: "", motivo: "" });
    } catch (err) {
      setMensaje({ tipo: "danger", texto: `❌ Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const marcarSalida = async (id) => {
    setLoading(true);
    try {
      const body = { idRegistro: id };

      const res = await fetch(`${API_URL}/access-logs/exit`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Error al registrar salida");

      const guardadas = JSON.parse(localStorage.getItem("visitasSeguridad") || "[]");
      const actualizadas = guardadas.map(v => 
        v.id === id ? { ...v, horaSalida: new Date().toLocaleTimeString() } : v
      );
      
      localStorage.setItem("visitasSeguridad", JSON.stringify(actualizadas));
      
      const hoy = new Date().toDateString();
      setVisitasActivas(actualizadas.filter(v => 
        new Date(v.fechaEntrada).toDateString() === hoy && !v.horaSalida
      ));
      
      setMensaje({ tipo: "success", texto: "✅ Salida registrada" });
    } catch (err) {
      setMensaje({ tipo: "danger", texto: `❌ Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = "text", placeholder, required }) => (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-400"
      />
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Visitas</h1>
        <p className="text-slate-500 mt-1 text-sm">Registro de visitantes del condominio</p>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
        <h5 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FiUserPlus size={20} />
          Nueva Visita
        </h5>

        <form onSubmit={registrarVisita}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <InputField label="Nombre Completo" name="nombre" placeholder="Ana Hurtado" required />
            <InputField label="DNI" name="dni" placeholder="73652148" required />
            <InputField label="Placa (opcional)" name="placa" placeholder="ABC-123" />
            <InputField label="Visita a" name="visitaA" placeholder="Departamento 101" required />
          </div>
          
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Motivo</label>
            <input
              type="text"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              placeholder="Entrega de paquete, visita familiar, etc."
              className="w-full px-3 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-400"
            />
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

          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <FiLoader size={18} className="animate-spin" /> : <FiUserPlus size={18} />}
            Registrar Visita
          </button>
        </form>
      </div>

      {/* Visitas Activas */}
      <div className="bg-white rounded-2xl p-8 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h5 className="font-bold text-slate-800 flex items-center gap-2">
            <FiUsers size={20} />
            Visitas Activas
          </h5>
          <span className="px-3 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-500">
            {visitasActivas.length} activas
          </span>
        </div>

        {visitasActivas.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <FiActivity size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-base font-medium">No hay visitas activas</p>
            <p className="text-sm mt-1">Las visitas aparecerán aquí</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase">Hora</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase">Nombre</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase">DNI</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase">Placa</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase">Visita a</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-400 uppercase">Acción</th>
                </tr>
              </thead>
              <tbody>
                {visitasActivas.map((visita) => (
                  <tr key={visita.id} className="border-b border-slate-100">
                    <td className="p-4 font-bold text-slate-800">{visita.horaEntrada}</td>
                    <td className="p-4 text-slate-500">{visita.nombre}</td>
                    <td className="p-4 text-slate-500">{visita.dni}</td>
                    <td className="p-4 text-slate-500">{visita.placa}</td>
                    <td className="p-4 text-slate-500">{visita.visitaA}</td>
                    <td className="p-4">
                      <button
                        onClick={() => marcarSalida(visita.id)}
                        disabled={loading}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm flex items-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                      >
                        <FiLogOut size={14} />
                        Salida
                      </button>
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