import "bootstrap-icons/font/bootstrap-icons.css"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import fondoParking from "../images/FondoParking.png"
import ForgotPasswordModal from "./ForgotPassword"

const LEFT_CARDS = [
  { icon: "bi-shield-lock",    label: "Acceso seguro y protegido" },
  { icon: "bi-diagram-3",      label: "Administración centralizada" },
  { icon: "bi-graph-up-arrow", label: "Analítica avanzada del sistema" },
  { icon: "bi-camera-video",   label: "Integración con cámaras LPR" }
]

function AuthLayout({ heroImage, accentColor, accentColorDark, onSubmit }) {
  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [recuerdame, setRecuerdame] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [openForgot, setOpenForgot] = useState(false)
  const [phase, setPhase] = useState(0)
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({ correo: false, password: false })

  const dark = accentColorDark || accentColor

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 50)
    const t2 = setTimeout(() => setPhase(2), 250)
    const t3 = setTimeout(() => setPhase(3), 450)
    const t4 = setTimeout(() => setPhase(4), 620)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ correo: true, password: true })
    if (!correo.trim() && !password.trim()) {
      toast.warning("Por favor completa todos los campos")
      return
    }
    if (!correo.trim()) {
      toast.warning("El correo es obligatorio")
      return
    }
    if (!password.trim()) {
      toast.warning("La contraseña es obligatoria")
      return
    }
    setLoading(true)
    await onSubmit({ correo, password, recuerdame })
    setLoading(false)
  }

  const ease = "cubic-bezier(0.22, 1, 0.36, 1)"

  const fadeUp = (show, delay = "0s") => ({
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0px)" : "translateY(24px)",
    transition: `opacity 0.5s ${ease} ${delay}, transform 0.5s ${ease} ${delay}`
  })

  const inputStyle = (field) => ({
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: `1px solid ${touched[field] && !(field === "correo" ? correo.trim() : password.trim()) ? "#ef4444" : "#e2e8f0"}`,
    outline: "none",
    transition: "border-color 0.2s ease",
    background: "#ffffff",
    color: "#1e293b",
    colorScheme: "light"
  })

  const cardStyle = {
    background: "rgba(255,255,255,0.14)",
    borderRadius: "14px",
    padding: "14px",
    color: "#fff",
    backdropFilter: "blur(8px)",
    transition: "all 0.22s ease",
    cursor: "default"
  }

  const cardHover = (e) => {
    e.currentTarget.style.transform = "translateY(-6px) scale(1.03)"
    e.currentTarget.style.background = "rgba(255,255,255,0.22)"
  }

  const cardLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0px) scale(1)"
    e.currentTarget.style.background = "rgba(255,255,255,0.14)"
  }

  return (
    <div className="container-fluid vh-100 p-0 overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="row h-100 g-0">

        <div
          className="col-md-6 d-none d-md-flex flex-column align-items-center justify-content-center position-relative"
          style={{ background: `linear-gradient(135deg, ${accentColor}, ${dark})`, overflow: "hidden", padding: "40px" }}
        >
          <div style={{ position: "absolute", inset: 0, opacity: 0.8 }} />

          <div style={{ zIndex: 2, textAlign: "center", color: "#fff", marginBottom: "20px", ...fadeUp(phase >= 1) }}>
            <h2 style={{ fontWeight: 800, fontSize: "1.7rem", marginBottom: "6px" }}>
              Control inteligente de accesos
            </h2>
            <p style={{ opacity: 0.9, fontSize: "0.95rem" }}>
              Plataforma segura para administración de estacionamientos
            </p>
          </div>

          <img
            src={heroImage}
            alt="login-visual"
            style={{
              width: "85%",
              maxWidth: "520px",
              zIndex: 2,
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "translateY(0) scale(1)" : "translateY(30px) scale(0.96)",
              transition: `opacity 0.55s ${ease}, transform 0.55s ${ease}`
            }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", width: "100%", maxWidth: "520px", zIndex: 2, marginTop: "25px" }}>
            {LEFT_CARDS.map((card, i) => (
              <div
                key={i}
                style={{
                  ...cardStyle,
                  opacity: phase >= 3 ? 1 : 0,
                  transform: phase >= 3 ? "translateY(0px)" : "translateY(18px)",
                  transition: `opacity 0.4s ${ease} ${i * 0.07}s, transform 0.4s ${ease} ${i * 0.07}s, background 0.22s ease, box-shadow 0.22s ease`
                }}
                onMouseEnter={cardHover}
                onMouseLeave={cardLeave}
              >
                <i className={`bi ${card.icon}`} style={{ fontSize: "1.3rem" }} />
                <p style={{ margin: "6px 0 0", fontSize: "0.85rem" }}>{card.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="col-md-6 d-flex align-items-center justify-content-center position-relative"
          style={{ background: "#ffffff", padding: "40px", overflow: "hidden", overflowY: "auto" }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${fondoParking})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.60, zIndex: 0 }} />

          <div style={{ width: "100%", maxWidth: "420px", zIndex: 2 }}>
            <div style={fadeUp(phase >= 1)}>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e293b" }}>Bienvenido</h2>
              <p style={{ color: "#64748b", marginBottom: "30px", fontWeight: 700 }}>
                Ingresa tus credenciales para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ ...fadeUp(phase >= 2, "0.04s"), marginBottom: "14px" }}>
                <input
                  type="email"
                  placeholder="Correo"
                  className="auth-input"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, correo: true }))}
                  style={inputStyle("correo")}
                />
              </div>

              <div style={{ ...fadeUp(phase >= 2, "0.1s"), marginBottom: "14px" }}>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    className="auth-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                    style={inputStyle("password")}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#64748b" }}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                  </span>
                </div>
              </div>

              <div style={{ ...fadeUp(phase >= 3, "0.05s"), display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem", color: "#475569", fontWeight: 500, userSelect: "none" }}>
                  <input
                    type="checkbox"
                    checked={recuerdame}
                    onChange={(e) => setRecuerdame(e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: accentColor, cursor: "pointer" }}
                  />
                  Recuérdame
                </label>
                <span
                  onClick={() => setOpenForgot(true)}
                  style={{ fontSize: "0.85rem", color: accentColor, fontWeight: 500, cursor: "pointer" }}
                >
                  ¿Olvidaste tu contraseña?
                </span>
              </div>

              <div style={fadeUp(phase >= 4)}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                    background: loading ? "#94a3b8" : `linear-gradient(90deg, ${accentColor}, ${dark})`,
                    color: "#fff",
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.filter = "brightness(1.1)" } }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0px) scale(1)"; e.currentTarget.style.filter = "brightness(1)" }}
                >
                  {loading ? "Iniciando sesión..." : "Ingresar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ForgotPasswordModal open={openForgot} onClose={() => setOpenForgot(false)} />
    </div>
  )
}

export default AuthLayout