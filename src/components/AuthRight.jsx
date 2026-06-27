import "bootstrap-icons/font/bootstrap-icons.css"
import { useState } from "react"
import { toast } from "react-toastify"
import ForgotPasswordModal from "./ForgotPassword"
import LogoSolo from "../images/LogoSolo.png"
import { validateLoginForm } from "../utils/validators"

function AuthRight({ accentColor, accentColorDark, onSubmit, phase, ease }) {
  const [correo, setCorreo] = useState("")
  const [password, setPassword] = useState("")
  const [recuerdame, setRecuerdame] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [openForgot, setOpenForgot] = useState(false)
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({ correo: false, password: false })
  const [errors, setErrors] = useState({ correo: false, password: false })

  const dark = accentColorDark || accentColor

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ correo: true, password: true })
    const { valid, message, field } = validateLoginForm({ correo, password })
    if (!valid) {
      toast.warning(message)
      if (field === "both") setErrors({ correo: true, password: true })
      else if (field) setErrors((p) => ({ ...p, [field]: true }))
      return
    }
    setErrors({ correo: false, password: false })
    setLoading(true)
    await onSubmit({ correo: correo.trim(), password: password.trim(), recuerdame })
    setLoading(false)
  }

  const fadeUp = (show, delay = "0s") => ({
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0px)" : "translateY(24px)",
    transition: `opacity 0.5s ${ease} ${delay}, transform 0.5s ${ease} ${delay}`
  })

  const inputStyle = (field) => ({
    width: "100%",
    padding: "13px 14px 13px 42px",
    borderRadius: "12px",
    border: `1.5px solid ${errors[field] ? "#ef4444" : "#e2e8f0"}`,
    outline: "none",
    transition: "border-color 0.2s ease",
    background: "#f8fafc",
    color: "#1e293b",
    fontSize: "0.92rem",
    colorScheme: "light"
  })

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100%", padding: "clamp(20px, 3vw, 40px)", overflow: "hidden" }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.92)",
          borderRadius: "24px",
          padding: "clamp(20px, 2.5vh, 40px) clamp(20px, 2.5vw, 36px)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          ...fadeUp(phase >= 1)
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "clamp(12px, 1.8vh, 28px)" }}>
          <img
            src={LogoSolo}
            alt="Logo"
            style={{ width: "clamp(40px, 4.5vh, 72px)", height: "clamp(40px, 4.5vh, 72px)", objectFit: "contain", marginBottom: "clamp(8px, 1vh, 14px)" }}
          />
          <h2 style={{ fontSize: "clamp(1.1rem, 1.8vh, 1.7rem)", fontWeight: 800, color: "#1e293b", marginBottom: "4px" }}>Bienvenido</h2>
          <div style={{ width: "40px", height: "3px", background: accentColor, borderRadius: "2px", margin: "6px auto 10px" }} />
          <p style={{ color: "#64748b", fontSize: "clamp(0.72rem, 1.1vh, 0.88rem)", lineHeight: 1.5, margin: 0 }}>
            Ingresa a tu plataforma de gestión y mantén tu condominio siempre organizado, seguro y eficiente.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ ...fadeUp(phase >= 2, "0.04s"), marginBottom: "clamp(8px, 1vh, 14px)" }}>
            <div style={{ position: "relative" }}>
              <i className="bi bi-envelope" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "0.95rem" }} />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => { setCorreo(e.target.value); setErrors((p) => ({ ...p, correo: false })) }}
                onBlur={() => setTouched((p) => ({ ...p, correo: true }))}
                style={inputStyle("correo")}
              />
            </div>
          </div>

          <div style={{ ...fadeUp(phase >= 2, "0.1s"), marginBottom: "clamp(10px, 1.2vh, 18px)" }}>
            <div style={{ position: "relative" }}>
              <i className="bi bi-lock" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "0.95rem" }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: false })) }}
                onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                style={inputStyle("password")}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#94a3b8" }}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
              </span>
            </div>
          </div>

          <div style={{ ...fadeUp(phase >= 3, "0.05s"), display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(12px, 1.5vh, 22px)" }}>
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
              style={{ fontSize: "0.85rem", color: accentColor, fontWeight: 600, cursor: "pointer" }}
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
                padding: "clamp(10px, 1.3vh, 14px)",
                borderRadius: "12px",
                border: "none",
                background: loading ? "#94a3b8" : `linear-gradient(90deg, ${accentColor}, ${dark})`,
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.filter = "brightness(1.1)" } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0px)"; e.currentTarget.style.filter = "brightness(1)" }}
            >
              {loading ? "Iniciando sesión..." : <> Ingresar <i className="bi bi-arrow-right" /> </>}
            </button>
          </div>
        </form>

        <div style={{ textAlign: "center", marginTop: "clamp(10px, 1.2vh, 18px)" }}>
          <span style={{ fontSize: "0.8rem", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <i className="bi bi-lock-fill" />
            Conexión segura y cifrada
          </span>
        </div>
      </div>

      <ForgotPasswordModal open={openForgot} onClose={() => setOpenForgot(false)} />
    </div>
  )
}

export default AuthRight