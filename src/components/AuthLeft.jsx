import "bootstrap-icons/font/bootstrap-icons.css"

const BOTTOM_BADGES = [
  { icon: "bi-shield-check",   label: "Seguridad garantizada" },
  { icon: "bi-clock",          label: "Información en tiempo real" },
  { icon: "bi-bar-chart-line", label: "Reportes y estadísticas" },
  { icon: "bi-cloud",          label: "Acceso desde cualquier lugar" }
]

function AuthLeft({ phase, ease, accentColor, heroTitle, heroTitleAccent, heroDescription }) {
  const fadeUp = (show, delay = "0s") => ({
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0px)" : "translateY(24px)",
    transition: `opacity 0.5s ${ease} ${delay}, transform 0.5s ${ease} ${delay}`
  })

  const cardHover = (e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.75)"
    e.currentTarget.style.transform = "translateY(-4px)"
    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"
  }

  const cardLeave = (e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.35)"
    e.currentTarget.style.transform = "translateY(0px)"
    e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)"
  }

  return (
    <div
      className="d-none d-md-flex flex-column align-items-center justify-content-center"
      style={{ height: "100%", padding: "clamp(24px, 4vw, 48px) clamp(24px, 5vw, 72px) clamp(24px, 4vw, 48px) clamp(20px, 4vw, 52px)", gap: "clamp(18px, 2.5vw, 36px)" }}
    >
      <div style={{ ...fadeUp(phase >= 1), textAlign: "center" }}>
        <h1 style={{ fontWeight: 800, fontSize: "clamp(1.6rem, 2.8vw, 3.2rem)", color: "#fff", lineHeight: 1.15, marginBottom: "0px" }}>
          {heroTitle}
        </h1>
        <h1 style={{ fontWeight: 800, fontSize: "clamp(1.6rem, 2.8vw, 3.2rem)", color: accentColor, lineHeight: 1.15, marginBottom: "clamp(10px, 1.5vw, 20px)" }}>
          {heroTitleAccent}
        </h1>
        <p style={{ color: "#ffffff", fontSize: "clamp(0.8rem, 1vw, 1.15rem)", lineHeight: 1.85, margin: "0 auto" }}>
          {heroDescription}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(8px, 1vw, 14px)", width: "100%" }}>
        {BOTTOM_BADGES.map((card, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.35)",
              borderRadius: "16px",
              padding: "clamp(10px, 1.4vw, 18px) clamp(10px, 1.5vw, 20px)",
              display: "flex",
              alignItems: "center",
              gap: "clamp(8px, 1vw, 14px)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.40)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              cursor: "default",
              transition: "all 0.22s ease",
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "translateY(0)" : "translateY(18px)",
              transitionDelay: `${i * 0.08}s`
            }}
            onMouseEnter={cardHover}
            onMouseLeave={cardLeave}
          >
            <div style={{
              background: accentColor,
              borderRadius: "10px",
              padding: "clamp(6px, 0.8vw, 10px)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <i className={`bi ${card.icon}`} style={{ fontSize: "clamp(0.8rem, 1vw, 1.1rem)", color: "#fff" }} />
            </div>
            <span style={{ color: "#ffffff", fontSize: "clamp(0.7rem, 0.8vw, 0.86rem)", fontWeight: 600, lineHeight: 1.3 }}>{card.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AuthLeft