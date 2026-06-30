import { useState, useEffect } from "react";
import { FiUser, FiMail, FiShield, FiEdit2, FiSave, FiLock, FiKey, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { getCurrentUser, changePassword } from "../../services/api";

const estiloLabel = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "0.4rem",
};

const estiloInput = (readOnly = false) => ({
  width: "100%",
  padding: "0.65rem 0.75rem",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "0.9rem",
  outline: "none",
  background: readOnly ? "#f1f5f9" : "#f8fafc",
  color: readOnly ? "#94a3b8" : "#1e293b",
  boxSizing: "border-box",
  cursor: readOnly ? "not-allowed" : "text",
});

const estiloBoton = (bg, color = "#fff", disabled = false) => ({
  padding: "0.7rem 1.5rem",
  backgroundColor: disabled ? "#cbd5e1" : bg,
  color,
  border: "none",
  borderRadius: "10px",
  fontWeight: 700,
  fontSize: "0.9rem",
  cursor: disabled ? "not-allowed" : "pointer",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  transition: "all 0.2s ease",
});

export default function PerfilSeguridad() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
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

  if (loading) {
    return (
      <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#64748b", fontWeight: 600 }}>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", boxSizing: "border-box" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Perfil</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>Información del agente de seguridad</p>
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              backgroundColor: "rgb(34,197,94)", display: "flex",
              alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "1.5rem", fontWeight: 800, flexShrink: 0,
            }}>
              {iniciales}
            </div>
            <div>
              <h3 style={{ margin: "0 0 0.25rem", color: "#1e293b", fontWeight: 800, fontSize: "1.1rem" }}>
                {user?.nombres} {user?.apellidos}
              </h3>
              <p style={{ margin: "0 0 0.5rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem" }}>
                <FiShield size={15} color="rgb(34,197,94)" />
                {user?.rol ?? "Seguridad"}
              </p>
              <span style={{ padding: "0.2rem 0.65rem", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700, backgroundColor: "#dcfce7", color: "#166534" }}>
                Activo
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowPasswordForm((v) => !v)}
            style={estiloBoton(showPasswordForm ? "#f1f5f9" : "rgb(34,197,94)", showPasswordForm ? "#64748b" : "#fff")}
          >
            {showPasswordForm ? <><FiX size={16} /> Cancelar</> : <><FiKey size={16} /> Cambiar Contraseña</>}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
          <div>
            <p style={estiloLabel}>ID</p>
            <p style={{ margin: 0, color: "#1e293b", fontWeight: 600, fontFamily: "monospace" }}>#{user?.id}</p>
          </div>
          <div>
            <p style={estiloLabel}>Nombre completo</p>
            <p style={{ margin: 0, color: "#1e293b", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FiUser size={15} color="rgb(34,197,94)" />
              {user?.nombres} {user?.apellidos}
            </p>
          </div>
          <div>
            <p style={estiloLabel}>Correo</p>
            <p style={{ margin: 0, color: "#1e293b", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FiMail size={15} color="rgb(34,197,94)" />
              {user?.correo}
            </p>
          </div>
          <div>
            <p style={estiloLabel}>Rol</p>
            <p style={{ margin: 0, color: "#1e293b", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FiShield size={15} color="rgb(34,197,94)" />
              {user?.rol ?? "—"}
            </p>
          </div>
        </div>
      </div>

      {showPasswordForm && (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "2rem" }}>
          <h5 style={{ fontWeight: 700, color: "#1e293b", margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiLock size={18} color="#64748b" />
            Cambiar Contraseña
          </h5>
          <form onSubmit={handleSubmitPassword}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={estiloLabel}>Contraseña actual</label>
                <input
                  type="password"
                  name="contrasenaActual"
                  value={passwordData.contrasenaActual}
                  onChange={handlePasswordChange}
                  style={estiloInput()}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label style={estiloLabel}>Nueva contraseña</label>
                <input
                  type="password"
                  name="nuevaContrasena"
                  value={passwordData.nuevaContrasena}
                  onChange={handlePasswordChange}
                  style={estiloInput()}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label style={estiloLabel}>Confirmar contraseña</label>
                <input
                  type="password"
                  name="confirmar"
                  value={passwordData.confirmar}
                  onChange={handlePasswordChange}
                  style={estiloInput()}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button type="submit" disabled={loadingPassword} style={estiloBoton("rgb(34,197,94)", "#fff", loadingPassword)}>
              <FiSave size={16} />
              {loadingPassword ? "Guardando..." : "Guardar Contraseña"}
            </button>
          </form>
        </div>
      )}

      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <h5 style={{ fontWeight: 700, color: "#1e293b", margin: "0 0 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiLock size={18} color="#64748b" />
          Información del Sistema
        </h5>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
          {[
            { label: "Rol Asignado", value: user?.rol ?? "—" },
            { label: "Estado de Cuenta", value: "Activa", color: "rgb(34,197,94)" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "10px" }}>
              <p style={{ ...estiloLabel, marginBottom: "0.25rem" }}>{label}</p>
              <p style={{ margin: 0, color: color ?? "#1e293b", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                {color && <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />}
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}