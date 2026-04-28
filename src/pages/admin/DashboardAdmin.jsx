import { FiHome } from "react-icons/fi"

// Datos de ejemplo para estacionamientos

//simulacion de espacios por bloques
const espaciosPorBloque = [
    { bloque: 'Bloque A', total: 60, ocupados: 48, disponibles: 8, mantención: 4 },
    { bloque: 'Bloque B', total: 60, ocupados: 47, disponibles: 9, mantención: 4 },
    { bloque: 'Bloque C', total: 60, ocupados: 46, disponibles: 8, mantención: 6 },
    { bloque: 'Bloque D', total: 60, ocupados: 45, disponibles: 9, mantención: 6 },
    { bloque: 'Bloque E', total: 60, ocupados: 48, disponibles: 6, mantención: 6 },
    { bloque: 'Visitas', total: 42, ocupados: 33, disponibles: 5, mantención: 4 },
]

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