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

const estiloLabel = {
  display: "block",
  fontSize: "0.7rem",
  fontWeight: 600,
  color: "#9ca3af",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "0.5rem",
};

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

export default function PerfilSeguridad() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [campoEnfocado, setCampoEnfocado] = useState("");
  const [passwordData, setPasswordData] = useState({
    contrasenaActual: "",
    nuevaContrasena: "",
    confirmar: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        toast.error(err.message || "Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (!passwordData.contrasenaActual || !passwordData.nuevaContrasena || !passwordData.confirmar) {
      toast.warning("Completa todos los campos");
      return;
    }
    if (passwordData.nuevaContrasena !== passwordData.confirmar) {
      toast.warning("Las contraseñas no coinciden");
      return;
    }
    if (passwordData.nuevaContrasena.length < 6) {
      toast.warning("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoadingPassword(true);
    try {
      await changePassword({
        contrasenaActual: passwordData.contrasenaActual,
        nuevaContrasena: passwordData.nuevaContrasena,
      });
      toast.success("Contraseña actualizada correctamente");
      setShowPasswordForm(false);
      setPasswordData({ contrasenaActual: "", nuevaContrasena: "", confirmar: "" });
    } catch (err) {
      toast.error(err.message || "Error al cambiar la contraseña");
    } finally {
      setLoadingPassword(false);
    }
  };

  const iniciales = user
    ? `${user.nombres?.charAt(0) ?? ""}${user.apellidos?.charAt(0) ?? ""}`.toUpperCase()
    : "?";

  const fortaleza = evaluarFortaleza(passwordData.nuevaContrasena);
  const coincide = passwordData.nuevaContrasena && passwordData.confirmar && passwordData.nuevaContrasena === passwordData.confirmar;

  if (loading) {
    return (
      <div style={{ padding: "2rem", backgroundColor: FONDO, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.85rem" }}>
          <div style={{ width: "34px", height: "34px", border: `3px solid ${BORDE}`, borderTopColor: VERDE, borderRadius: "50%", animation: "girar 0.7s linear infinite" }} />
          <p style={{ color: TEXTO_SUAVE, fontWeight: 500, margin: 0, fontSize: "0.9rem" }}>Cargando perfil...</p>
        </div>
        <style>{`@keyframes girar { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: "2.5rem", backgroundColor: FONDO, minHeight: "100vh", boxSizing: "border-box" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: TEXTO, margin: 0, letterSpacing: "-0.01em" }}>Mi perfil</h1>
          <p style={{ color: TEXTO_SUAVE, marginTop: "0.3rem", fontSize: "0.9rem" }}>Gestiona tu información personal y seguridad de la cuenta</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1.5rem", alignItems: "start" }}>

          <div style={{ ...tarjeta, padding: "2rem 1.5rem", textAlign: "center", position: "sticky", top: "1.5rem" }}>
            <div style={{
              width: "84px", height: "84px", borderRadius: "50%",
              backgroundColor: VERDE_SUAVE, display: "flex",
              alignItems: "center", justifyContent: "center",
              color: VERDE, fontSize: "1.6rem", fontWeight: 700,
              margin: "0 auto 1.1rem", border: `2px solid ${VERDE}`,
            }}>
              {iniciales}
            </div>
            <h3 style={{ margin: "0 0 0.3rem", color: TEXTO, fontWeight: 700, fontSize: "1.05rem" }}>
              {user?.nombres} {user?.apellidos}
            </h3>
            <p style={{ margin: "0 0 0.9rem", color: TEXTO_SUAVE, fontSize: "0.85rem" }}>
              {user?.correo}
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.8rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600, backgroundColor: VERDE_SUAVE, color: VERDE }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: VERDE }} />
              Cuenta activa
            </div>

            <div style={{ borderTop: `1px solid ${BORDE}`, marginTop: "1.5rem", paddingTop: "1.5rem", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.9rem" }}>
                <FiShield size={14} color={TEXTO_SUAVE} />
                <span style={{ fontSize: "0.83rem", color: TEXTO_SUAVE }}>Rol</span>
                <span style={{ marginLeft: "auto", fontSize: "0.83rem", fontWeight: 600, color: TEXTO }}>{user?.rol ?? "—"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <FiHash size={14} color={TEXTO_SUAVE} />
                <span style={{ fontSize: "0.83rem", color: TEXTO_SUAVE }}>ID</span>
                <span style={{ marginLeft: "auto", fontSize: "0.83rem", fontWeight: 600, color: TEXTO, fontFamily: "monospace" }}>#{user?.id}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            <div style={{ ...tarjeta, padding: "1.75rem" }}>
              <h5 style={{ fontWeight: 700, color: TEXTO, margin: "0 0 1.25rem", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiUser size={16} color={VERDE} />
                Información personal
              </h5>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem" }}>
                {[
                  { icon: FiUser, label: "Nombre completo", value: `${user?.nombres ?? ""} ${user?.apellidos ?? ""}` },
                  { icon: FiMail, label: "Correo electrónico", value: user?.correo },
                  { icon: FiActivity, label: "Estado", value: "Activa" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <p style={estiloLabel}>{label}</p>
                    <p style={{ margin: 0, color: TEXTO, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                      <Icon size={14} color={TEXTO_SUAVE} style={{ flexShrink: 0 }} />
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...tarjeta, padding: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: showPasswordForm ? "1.5rem" : 0 }}>
                <h5 style={{ fontWeight: 700, color: TEXTO, margin: 0, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiLock size={16} color={VERDE} />
                  Seguridad de la cuenta
                </h5>
                <button
                  onClick={() => setShowPasswordForm((v) => !v)}
                  style={{
                    padding: "0.55rem 1.1rem",
                    backgroundColor: showPasswordForm ? "#f3f4f6" : TEXTO,
                    color: showPasswordForm ? TEXTO_SUAVE : "#fff",
                    border: "none",
                    borderRadius: "9px",
                    fontWeight: 600,
                    fontSize: "0.83rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  {showPasswordForm ? <><FiX size={14} /> Cancelar</> : <><FiKey size={14} /> Cambiar contraseña</>}
                </button>
              </div>

              {showPasswordForm && (
                <form onSubmit={handleSubmitPassword} style={{ animation: "aparecer 0.2s ease both" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <PasswordInput
                      label="Contraseña actual"
                      name="contrasenaActual"
                      value={passwordData.contrasenaActual}
                      onChange={handlePasswordChange}
                      placeholder="Ingresa tu contraseña actual"
                      focused={campoEnfocado === "contrasenaActual"}
                      onFocus={() => setCampoEnfocado("contrasenaActual")}
                      onBlur={() => setCampoEnfocado("")}
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                      <div>
                        <PasswordInput
                          label="Nueva contraseña"
                          name="nuevaContrasena"
                          value={passwordData.nuevaContrasena}
                          onChange={handlePasswordChange}
                          placeholder="Mínimo 6 caracteres"
                          focused={campoEnfocado === "nuevaContrasena"}
                          onFocus={() => setCampoEnfocado("nuevaContrasena")}
                          onBlur={() => setCampoEnfocado("")}
                        />
                        {passwordData.nuevaContrasena && (
                          <div style={{ marginTop: "0.6rem" }}>
                            <div style={{ display: "flex", gap: "4px", marginBottom: "0.35rem" }}>
                              {[0, 1, 2, 3].map((i) => (
                                <div key={i} style={{ flex: 1, height: "4px", borderRadius: "2px", backgroundColor: i < fortaleza.nivel ? fortaleza.color : BORDE, transition: "background-color 0.2s ease" }} />
                              ))}
                            </div>
                            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: fortaleza.color }}>{fortaleza.texto}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <PasswordInput
                          label="Confirmar contraseña"
                          name="confirmar"
                          value={passwordData.confirmar}
                          onChange={handlePasswordChange}
                          placeholder="Repite la nueva contraseña"
                          focused={campoEnfocado === "confirmar"}
                          onFocus={() => setCampoEnfocado("confirmar")}
                          onBlur={() => setCampoEnfocado("")}
                        />
                        {passwordData.confirmar && (
                          <div style={{ marginTop: "0.6rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                            <FiCheckCircle size={13} color={coincide ? VERDE : "#ef4444"} />
                            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: coincide ? VERDE : "#ef4444" }}>
                              {coincide ? "Las contraseñas coinciden" : "No coinciden"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
                      <button
                        type="submit"
                        disabled={loadingPassword}
                        style={{
                          padding: "0.75rem 1.6rem",
                          backgroundColor: loadingPassword ? "#d1d5db" : VERDE,
                          color: "#fff",
                          border: "none",
                          borderRadius: "10px",
                          fontWeight: 700,
                          fontSize: "0.88rem",
                          cursor: loadingPassword ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <FiSave size={15} />
                        {loadingPassword ? "Guardando..." : "Guardar contraseña"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>

      <style>{`@keyframes aparecer { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}