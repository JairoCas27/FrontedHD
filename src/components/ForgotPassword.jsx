import { useState } from "react"
import { forgotPasswordApi, resetPasswordApi } from "../services/api"


function ForgotPasswordModal({ open, onClose, resetToken = null }) {
  const [correo, setCorreo] = useState("")
  const [nuevaContrasena, setNuevaContrasena] = useState("")
  const [confirmar, setConfirmar] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [sent, setSent] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")


  const isResetMode = !!resetToken


  if (!open) return null


  const handleClose = () => {
    setCorreo("")
    setNuevaContrasena("")
    setConfirmar("")
    setShowPassword(false)
    setShowConfirm(false)
    setSent(false)
    setSuccess(false)
    setError("")
    onClose()
  }


  const handleForgot = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await forgotPasswordApi(correo)
      setSent(true)
    } catch (err) {
      setError(err.message || "No se pudo enviar el correo. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }


  const handleReset = async (e) => {
    e.preventDefault()
    setError("")
    if (nuevaContrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }
    if (nuevaContrasena !== confirmar) {
      setError("Las contraseñas no coinciden.")
      return
    }
    setLoading(true)
    try {
      await resetPasswordApi({ token: resetToken, nuevaContrasena })
      setSuccess(true)
    } catch (err) {
      setError(err.message || "El enlace es inválido o ha expirado.")
    } finally {
      setLoading(false)
    }
  }


  const inputStyle = {
    width: "100%", padding: "14px", paddingRight: "44px", borderRadius: "14px",
    border: "1px solid #e2e8f0", outline: "none", fontSize: "0.95rem",
    background: "#f8fafc", boxSizing: "border-box", transition: "all .25s ease",
  }


  const focusStyle = (e) => {
    e.target.style.border = "1px solid rgb(52,151,195)"
    e.target.style.boxShadow = "0 0 0 4px rgba(52,151,195,0.15)"
    e.target.style.background = "#ffffff"
  }


  const blurStyle = (e) => {
    e.target.style.border = "1px solid #e2e8f0"
    e.target.style.boxShadow = "none"
    e.target.style.background = "#f8fafc"
  }


  const btnStyle = (disabled) => ({
    width: "100%", padding: "14px", borderRadius: "14px", border: "none",
    background: disabled ? "#94a3b8" : "linear-gradient(90deg, rgb(52,151,195), rgb(37,117,152))",
    color: "#fff", fontWeight: 700, fontSize: "0.95rem",
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: "0 10px 25px rgba(52,151,195,0.25)",
    transition: "all 0.25s ease",
  })


  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(2,6,23,0.65)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, animation: "fadeBg 0.25s ease", padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "460px", background: "#ffffff",
          borderRadius: "20px", padding: "30px",
          boxShadow: "0 35px 90px rgba(0,0,0,0.35)",
          animation: "modalPop 0.28s cubic-bezier(.2,.9,.2,1)",
        }}
      >
        {isResetMode ? (
          <>
            <h2 style={{ fontWeight: 800, color: "#0f172a", marginBottom: "6px", fontSize: "1.4rem", letterSpacing: "-0.3px" }}>
              Nueva contraseña
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.92rem", marginBottom: "22px", lineHeight: "1.5" }}>
              Elige una contraseña segura para tu cuenta.
            </p>


            {!success ? (
              <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: "6px" }}>
                    Nueva contraseña
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={nuevaContrasena}
                      onChange={(e) => setNuevaContrasena(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      required
                      style={inputStyle}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#94a3b8" }}
                    >
                      <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                    </span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: "6px" }}>
                    Confirmar contraseña
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmar}
                      onChange={(e) => setConfirmar(e.target.value)}
                      placeholder="Repite tu contraseña"
                      required
                      style={inputStyle}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                    <span
                      onClick={() => setShowConfirm(!showConfirm)}
                      style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#94a3b8" }}
                    >
                      <i className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`} />
                    </span>
                  </div>
                </div>


                {error && (
                  <p style={{ color: "#ef4444", fontSize: "0.85rem", fontWeight: 600, margin: 0 }}>
                    {error}
                  </p>
                )}


                <button
                  type="submit"
                  disabled={loading}
                  style={btnStyle(loading)}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)" }}
                >
                  {loading ? "Guardando..." : "Guardar nueva contraseña"}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "10px 0", animation: "fadeIn 0.3s ease" }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "16px",
                  background: "rgba(34,197,94,0.12)", display: "flex",
                  alignItems: "center", justifyContent: "center", margin: "0 auto 12px auto",
                }}>
                  <i className="bi bi-check-circle" style={{ fontSize: "1.5rem", color: "rgb(34,197,94)" }} />
                </div>
                <p style={{ fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>¡Contraseña actualizada!</p>
                <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
                  Ya puedes iniciar sesión con tu nueva contraseña.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 style={{ fontWeight: 800, color: "#0f172a", marginBottom: "6px", fontSize: "1.4rem", letterSpacing: "-0.3px" }}>
              Recuperar acceso
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.92rem", marginBottom: "22px", lineHeight: "1.5" }}>
              Ingresa tu correo registrado y te enviaremos un enlace seguro para restablecer tu contraseña.
            </p>


            {!sent ? (
              <form onSubmit={handleForgot}>
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: "6px" }}>
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    required
                    style={{ ...inputStyle, paddingRight: "14px" }}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </div>


                {error && (
                  <p style={{ color: "#ef4444", fontSize: "0.85rem", fontWeight: 600, marginBottom: "12px" }}>
                    {error}
                  </p>
                )}


                <button
                  type="submit"
                  disabled={loading}
                  style={btnStyle(loading)}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)" }}
                >
                  {loading ? "Enviando..." : "Enviar enlace"}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "10px 0", animation: "fadeIn 0.3s ease" }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "16px",
                  background: "rgba(52,151,195,0.12)", display: "flex",
                  alignItems: "center", justifyContent: "center", margin: "0 auto 12px auto",
                }}>
                  <i className="bi bi-envelope-check" style={{ fontSize: "1.5rem", color: "rgb(52,151,195)" }} />
                </div>
                <p style={{ fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>Correo enviado</p>
                <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
                  Si el correo existe en nuestro sistema, recibirás un enlace de recuperación en breve.
                </p>
              </div>
            )}
          </>
        )}


        <button
          onClick={handleClose}
          style={{
            marginTop: "20px", width: "100%", background: "#f1f5f9",
            border: "1px solid #e2e8f0", borderRadius: "14px", padding: "12px",
            color: "#475569", fontWeight: 600, cursor: "pointer", transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#e2e8f0" }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#f1f5f9" }}
        >
          Cerrar
        </button>


        <style>{`
          @keyframes fadeBg { from { opacity: 0; } to { opacity: 1; } }
          @keyframes modalPop { from { opacity: 0; transform: translateY(18px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    </div>
  )
}


export default ForgotPasswordModal