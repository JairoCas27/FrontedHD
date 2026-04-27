import { FiList } from "react-icons/fi"
export default function Movimientos() {
  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Movimientos</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>Historial de entradas y salidas</p>
      </div>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "3rem 2rem", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", color: "#94a3b8" }}>
        <FiList size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
        <p style={{ fontSize: "1rem", fontWeight: 500 }}>Módulo en construcción</p>
        <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>El contenido estará disponible próximamente.</p>
      </div>
    </div>
  )
}