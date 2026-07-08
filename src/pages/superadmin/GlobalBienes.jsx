import React, { useState, useEffect } from 'react'
import { FiPackage, FiGrid, FiAlertCircle, FiHome, FiMapPin, FiTruck } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { getCondominiums } from '../../services/api'

const colorSuper = "rgb(124,58,237)"

const globalResponsive = `
@media (max-width: 767px) {
  .global-card-padding { padding: 1rem !important; }
}
`;

export default function GlobalBienes() {
  const [condominios, setCondominios] = useState([])
  const [condoSeleccionado, setCondoSeleccionado] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCondominiums().then(d => setCondominios(d?.items || d || [])).catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const condoActual = condominios.find(c => String(c.id) === String(condoSeleccionado))

  const estiloInput = {
    width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem",
    border: "1px solid #cbd5e1", fontSize: "0.9rem", color: "#334155",
    backgroundColor: "#ffffff", boxSizing: "border-box", outline: "none"
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#64748b", fontWeight: "600", textAlign: "center" }}>
        Sincronizando.
      </div>
    )
  }

  return (
    <div className="global-card-padding" style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      <style>{globalResponsive}</style>
      <EncabezadoTabla titulo="Bienes y Activos Global" subtitulo="Inventariado global de estacionamientos y carritos de todos los condominios" />

      <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <div style={{ width: "100%", maxWidth: "280px" }}>
          <select style={estiloInput} value={condoSeleccionado} onChange={(e) => setCondoSeleccionado(e.target.value)}>
            <option value="">Seleccionar condominio</option>
            {condominios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      </div>

      {!condoSeleccionado ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          <FiPackage size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
          <p>Selecciona un condominio para ver sus bienes</p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ backgroundColor: "rgba(124,58,237,0.1)", padding: "0.65rem", borderRadius: "0.65rem" }}>
                  <FiHome size={22} color={colorSuper} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>{condoActual?.nombre}</h3>
                  <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <FiMapPin size={12} /> {condoActual?.direccion || ''}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: "1rem", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ flex: 1, backgroundColor: "#f8fafc", borderRadius: "0.5rem", padding: "0.75rem", textAlign: "center" }}>
                    <span style={{ fontSize: "1.25rem", fontWeight: "800", color: colorSuper }}>—</span>
                    <span style={{ display: "block", fontSize: "0.65rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.025em", marginTop: "0.2rem" }}>Estacionamientos</span>
                  </div>
                  <div style={{ flex: 1, backgroundColor: "#f8fafc", borderRadius: "0.5rem", padding: "0.75rem", textAlign: "center" }}>
                    <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "#64748b" }}>—</span>
                    <span style={{ display: "block", fontSize: "0.65rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.025em", marginTop: "0.2rem" }}>Carritos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: "#fefce8", border: "1px solid #fde047", borderRadius: "0.75rem", padding: "1.25rem 1.5rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <FiAlertCircle size={20} color="#ca8a04" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
            <div>
              <h4 style={{ margin: "0 0 0.25rem", fontSize: "0.9rem", fontWeight: "700", color: "#854d0e" }}>Requiere implementaci&oacute;n en el backend</h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#713f12", lineHeight: "1.5" }}>
                La gesti&oacute;n de estacionamientos y carritos desde superadmin requiere el endpoint <code style={{ backgroundColor: "rgba(0,0,0,0.05)", padding: "0.1rem 0.35rem", borderRadius: "0.25rem", fontSize: "0.8rem" }}>GET /api/super-admin/assets</code> en el backend (actualmente devuelve 500).
                Una vez corregido, esta p&aacute;gina permitir&aacute; gestionar todos los activos de cada condominio.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
