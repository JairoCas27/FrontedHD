import React, { useState, useEffect } from 'react'
import { FiHome, FiUser, FiUsers, FiGrid, FiAlertCircle } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { getCondominiums, getAllUsers } from '../../services/api'

const colorSuper = "rgb(124,58,237)"

export default function GlobalDepartamentos() {
  const [condominios, setCondominios] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [condoSeleccionado, setCondoSeleccionado] = useState('')

  useEffect(() => {
    getCondominiums().then(data => setCondominios(data?.items || data || [])).catch(() => {})
    getAllUsers().then(data => {
      const lista = Array.isArray(data) ? data : (data?.items || [])
      setUsuarios(lista)
    }).catch(() => {})
  }, [])

  const condoActual = condominios.find(c => String(c.id) === String(condoSeleccionado))
  const propietarios = usuarios.filter(u => String(u.idCondominio || u.condominioId) === String(condoSeleccionado) && u.rol === 'PROPIETARIO')

  const estiloInput = {
    width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem",
    border: "1px solid #cbd5e1", fontSize: "0.9rem", color: "#334155",
    backgroundColor: "#ffffff", boxSizing: "border-box", outline: "none"
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      <EncabezadoTabla titulo="Departamentos Global" subtitulo="Vista general de unidades inmobiliarias en todos los condominios" />

      <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <div style={{ width: "280px" }}>
          <select style={estiloInput} value={condoSeleccionado} onChange={(e) => setCondoSeleccionado(e.target.value)}>
            <option value="">Seleccionar condominio</option>
            {condominios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      </div>

      {!condoSeleccionado ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          <FiGrid size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
          <p>Selecciona un condominio para ver sus datos</p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ backgroundColor: "rgba(124,58,237,0.1)", padding: "0.65rem", borderRadius: "0.65rem" }}>
                  <FiHome size={22} color={colorSuper} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>{condoActual?.nombre}</h3>
                  <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>{condoActual?.direccion || ''}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                <div>
                  <span style={{ fontSize: "1.5rem", fontWeight: "800", color: colorSuper }}>{propietarios.length}</span>
                  <span style={{ display: "block", fontSize: "0.7rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Propietarios</span>
                </div>
                <div>
                  <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#64748b" }}>—</span>
                  <span style={{ display: "block", fontSize: "0.7rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Departamentos</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: "#fefce8", border: "1px solid #fde047", borderRadius: "0.75rem", padding: "1.5rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <FiAlertCircle size={20} color="#ca8a04" style={{ flexShrink: 0, marginTop: "0.1rem" }} />
            <div>
              <h4 style={{ margin: "0 0 0.25rem", fontSize: "0.9rem", fontWeight: "700", color: "#854d0e" }}>Funcionalidad limitada para superadmin</h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#713f12", lineHeight: "1.5" }}>
                La gesti&oacute;n completa de departamentos (asignar propietarios, ver ocupantes) requiere que el backend exponga endpoints para superadmin en <code style={{ backgroundColor: "rgba(0,0,0,0.05)", padding: "0.1rem 0.3rem", borderRadius: "0.25rem" }}>/api/super-admin/apartments</code>.
                Por ahora puedes ver los propietarios registrados en este condominio desde la secci&oacute;n <strong>Propietarios</strong> del panel.
              </p>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem", backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9", fontWeight: "700", fontSize: "0.85rem", color: "#1e293b" }}>
              Propietarios de {condoActual?.nombre} ({propietarios.length})
            </div>
            {propietarios.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>No hay propietarios registrados en este condominio.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "0.75rem 1.5rem" }}>ID</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Nombre</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Email</th>
                  </tr>
                </thead>
                <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                  {propietarios.map(u => (
                    <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "0.75rem 1.5rem", fontFamily: "monospace", fontWeight: "700", color: "#94a3b8" }}>#{u.id}</td>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: "600" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ width: "26px", height: "26px", borderRadius: "50%", backgroundColor: colorSuper, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: "700" }}>
                            {((u.nombres || '')[0] + (u.apellidos || '')[0]).toUpperCase()}
                          </div>
                          {u.nombres} {u.apellidos}
                        </div>
                      </td>
                      <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>{u.email || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
