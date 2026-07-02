import { useState, useEffect } from "react";
import { FiUser, FiMail, FiShield, FiSave, FiLock, FiKey, FiX, FiEye, FiEyeOff, FiHash, FiCheckCircle, FiActivity } from "react-icons/fi";
import { toast } from "react-toastify";
import { getCurrentUser, changePassword } from "../../services/api";

const VERDE = "#16a34a";
const VERDE_SUAVE = "#f0fdf4";
const BORDE = "#e5e7eb";
const TEXTO = "#111827";
const TEXTO_SUAVE = "#6b7280";
const FONDO = "#fafafa";

const estiloLabel = {
  display: "block",
  fontSize: "0.7rem",
  fontWeight: 600,
  color: "#9ca3af",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "0.5rem",
};

const estiloInput = {
  width: "100%",
  padding: "0.75rem 2.75rem 0.75rem 1rem",
  borderRadius: "10px",
  border: `1.5px solid ${BORDE}`,
  fontSize: "0.9rem",
  outline: "none",
  background: "#ffffff",
  color: TEXTO,
  boxSizing: "border-box",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
};

const tarjeta = {
  background: "#ffffff",
  borderRadius: "16px",
  border: `1px solid ${BORDE}`,
};

function evaluarFortaleza(pass) {
  if (!pass) return { nivel: 0, texto: "", color: BORDE };
  let puntos = 0;
  if (pass.length >= 6) puntos++;
  if (pass.length >= 10) puntos++;
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) puntos++;
  if (/[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) puntos++;
  const niveles = [
    { texto: "Muy débil", color: "#ef4444" },
    { texto: "Débil", color: "#f97316" },
    { texto: "Aceptable", color: "#eab308" },
    { texto: "Fuerte", color: "#22c55e" },
    { texto: "Muy fuerte", color: "#16a34a" },
  ];
  return { nivel: puntos, ...niveles[puntos] };
}

function PasswordInput({ label, name, value, onChange, placeholder, focused, onFocus, onBlur }) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label style={estiloLabel}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          style={{
            ...estiloInput,
            borderColor: focused ? VERDE : BORDE,
            boxShadow: focused ? `0 0 0 3px ${VERDE_SUAVE}` : "none",
          }}
          placeholder={placeholder}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          style={{
            position: "absolute", right: "0.85rem", top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex",
          }}
        >
          {visible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
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