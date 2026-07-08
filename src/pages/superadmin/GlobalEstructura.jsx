import React, { useState, useEffect } from 'react'
import { FiFolder, FiGrid, FiAlertCircle, FiMapPin, FiHome } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { getCondominiums } from '../../services/api'

const colorSuper = "rgb(124,58,237)"

export default function GlobalEstructura() {
  const [condominios, setCondominios] = useState([])
  const [condoSeleccionado, setCondoSeleccionado] = useState('')

  useEffect(() => {
    getCondominiums().then(data => setCondominios(data?.items || data || [])).catch(() => {})
  }, [])

  const condoActual = condominios.find(c => String(c.id) === String(condoSeleccionado))

  const estiloInput = {
    width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem",
    border: "1px solid #cbd5e1", fontSize: "0.9rem", color: "#334155",
    backgroundColor: "#ffffff", boxSizing: "border-box", outline: "none"
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      <EncabezadoTabla titulo="Estructura Global" subtitulo="Organigrama de nodos físicos de todos los condominios" />

      <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
        <div style={{ width: "280px" }}>
          <select style={estiloInput} value={condoSeleccionado} onChange={(e) => setCondoSeleccionado(e.target.value)}>
            <option value="">Seleccionar condominio</option>
            {condominios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      </div>

      {!condoSeleccionado ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          <FiFolder size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
          <p>Selecciona un condominio para ver su estructura</p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ backgroundColor: "rgba(124,58,237,0.1)", padding: "0.65rem", borderRadius: "0.65rem" }}>
                  <FiHome size={22} color={colorSuper} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>{condoActual?.nombre}</h3>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{condoActual?.direccion || ''}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: "#fefce8", border: "1px solid #fde047", borderRadius: "0.75rem", padding: "1.5rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <FiAlertCircle size={20} color="#ca8a04" style={{ flexShrink: 0, marginTop: "0.1rem" }} />
            <div>
              <h4 style={{ margin: "0 0 0.25rem", fontSize: "0.9rem", fontWeight: "700", color: "#854d0e" }}>Requiere implementación en el backend</h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#713f12", lineHeight: "1.5" }}>
                La gesti&oacute;n de torres y pisos desde superadmin requiere el endpoint <code style={{ backgroundColor: "rgba(0,0,0,0.05)", padding: "0.1rem 0.3rem", borderRadius: "0.25rem" }}>GET /api/super-admin/structure</code> en el backend.
                Las rutas existen pero devuelven error 500. Una vez corregidas, esta p&aacute;gina mostrar&aacute; y permitir&aacute; editar la estructura completa.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
