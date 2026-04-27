import { FiHome } from "react-icons/fi"

export default function DashboardAdmin() {
  return (
    <div style={{ padding: "0" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
          Dashboard Admin
        </h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
          Resumen operativo del condominio
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "3rem 2rem",
          textAlign: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          color: "#94a3b8",
        }}
      >
        <FiHome size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
        <p style={{ fontSize: "1rem", fontWeight: 500 }}>Módulo en construcción</p>
        <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
          El contenido de este módulo estará disponible próximamente.
        </p>
      </div>
    </div>
  )
}