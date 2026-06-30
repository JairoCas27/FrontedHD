import { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiShield, FiEdit2, FiSave, FiLock, FiX, FiLoader } from "react-icons/fi";
import { getCurrentUser } from "../../services/api";

export default function PerfilSeguridad() {
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(true);

  const [perfil, setPerfil] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    email: "",
    telefono: "",
    rol: "Seguridad",
    turno: "Noche (22:00 - 06:00)",
    fechaIngreso: "2024-01-15",
    ultimoAcceso: new Date().toLocaleString(),
  });

  const [formData, setFormData] = useState({ ...perfil });

  useEffect(() => {
    const cargarPerfil = async () => {
      setLoading(true);
      try {
        const data = await getCurrentUser();
        const nuevoPerfil = {
          nombres: data.nombre || data.nombres || data.firstName || "",
          apellidos: data.apellidos || data.lastName || "",
          dni: data.dni || data.documento || "",
          email: data.correo || data.email || "",
          telefono: data.telefono || data.celular || "",
          rol: data.rol || "Seguridad",
          turno: data.turno || "Noche (22:00 - 06:00)",
          fechaIngreso: data.fechaIngreso || "2024-01-15",
          ultimoAcceso: new Date().toLocaleString(),
        };
        setPerfil(nuevoPerfil);
        setFormData(nuevoPerfil);
        localStorage.setItem("perfilSeguridad", JSON.stringify(nuevoPerfil));
      } catch (err) {
        const guardado = JSON.parse(localStorage.getItem("perfilSeguridad") || "null");
        if (guardado) {
          setPerfil(guardado);
          setFormData(guardado);
        }
        console.error("Error cargando perfil:", err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const guardar = (e) => {
    e.preventDefault();
    const nuevo = { ...formData, ultimoAcceso: new Date().toLocaleString() };
    localStorage.setItem("perfilSeguridad", JSON.stringify(nuevo));
    setPerfil(nuevo);
    setEditando(false);
    setMensaje({ tipo: "success", texto: "Perfil actualizado correctamente" });
    setTimeout(() => setMensaje(null), 3000);
  };

  const cancelar = () => {
    setFormData({ ...perfil });
    setEditando(false);
    setMensaje(null);
  };

  const iniciales = `${(perfil.nombres || "U").charAt(0)}${(perfil.apellidos || "D").charAt(0)}`;

  const InfoRow = ({ label, icon: Icon, value, children }) => (
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase mb-1">{label}</p>
      <p className="text-slate-800 font-semibold flex items-center gap-2">
        {Icon && <Icon size={16} className="text-emerald-500" />}
        {children || value}
      </p>
    </div>
  );

  const InputField = ({ label, name, type = "text", icon: Icon, readOnly, value, onChange }) => (
    <div>
      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">{label}</label>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-slate-400" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`w-full px-3 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-400 ${readOnly ? "bg-slate-50" : ""}`}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto flex items-center justify-center h-64">
        <FiLoader size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Perfil</h1>
        <p className="text-slate-500 mt-1 text-sm">Información del agente de seguridad</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
        <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-extrabold">
              {iniciales}
            </div>
            <div>
              <h3 className="text-slate-800 font-extrabold text-lg">
                {perfil.nombres} {perfil.apellidos}
              </h3>
              <p className="text-slate-500 flex items-center gap-2 mt-1">
                <FiShield size={16} className="text-emerald-500" />
                {perfil.rol}
              </p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Activo
              </span>
            </div>
          </div>

          {!editando && (
            <button
              onClick={() => setEditando(true)}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center gap-2 transition-colors"
            >
              <FiEdit2 size={16} />
              Editar Perfil
            </button>
          )}
        </div>

        {mensaje && (
          <div className="p-4 rounded-xl mb-6 bg-emerald-50 border border-emerald-500 text-emerald-800">
            {mensaje.texto}
          </div>
        )}

        {editando ? (
          <form onSubmit={guardar}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <InputField label="Nombres" name="nombres" value={formData.nombres} onChange={handleChange} />
              <InputField label="Apellidos" name="apellidos" value={formData.apellidos} onChange={handleChange} />
              <InputField label="DNI" name="dni" value={formData.dni} readOnly />
              <InputField label="Email" name="email" type="email" icon={FiMail} value={formData.email} onChange={handleChange} />
              <InputField label="Teléfono" name="telefono" icon={FiPhone} value={formData.telefono} onChange={handleChange} />
              <InputField label="Turno" name="turno" value={formData.turno} onChange={handleChange} />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 transition-colors"
              >
                <FiSave size={18} />
                Guardar
              </button>
              <button
                type="button"
                onClick={cancelar}
                className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-bold flex items-center gap-2 transition-colors"
              >
                <FiX size={18} />
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoRow label="Nombre Completo" icon={FiUser} value={`${perfil.nombres} ${perfil.apellidos}`} />
            <InfoRow label="DNI" value={perfil.dni} />
            <InfoRow label="Email" icon={FiMail} value={perfil.email} />
            <InfoRow label="Teléfono" icon={FiPhone} value={perfil.telefono} />
            <InfoRow label="Turno" value={perfil.turno} />
            <InfoRow label="Fecha de Ingreso" value={perfil.fechaIngreso} />
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-md">
        <h5 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FiLock size={20} />
          Información del Sistema
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Rol Asignado</p>
            <p className="text-slate-800 font-bold">{perfil.rol}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Último Acceso</p>
            <p className="text-slate-800 font-semibold">{perfil.ultimoAcceso}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Estado de Cuenta</p>
            <p className="text-emerald-500 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Activa
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}