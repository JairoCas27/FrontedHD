import React, { useState, useEffect } from 'react'
import { FiHome, FiUser, FiUsers, FiGrid, FiAlertCircle, FiSearch, FiMail, FiPhone, FiCalendar, FiChevronDown } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { getCondominiums, getAllUsers } from '../../services/api'

const colorSuper = "rgb(124,58,237)"

const globalResponsive = `
@media (max-width: 767px) {
  .global-card-padding { padding: 1rem !important; }
  .global-table-wrap { overflow-x: auto !important; }
  .global-search-wrap { width: 100% !important; max-width: 260px !important; }
}
`;

export default function GlobalDepartamentos() {
  const [condominios, setCondominios] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [condoSeleccionado, setCondoSeleccionado] = useState('')
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    Promise.all([
      getCondominiums().then(d => setCondominios(d?.items || d || [])).catch(() => {}),
      getAllUsers().then(d => {
        const lista = Array.isArray(d) ? d : (d?.items || [])
        setUsuarios(lista)
      }).catch(() => {})
    ]).finally(() => setLoading(false))
  }, [])

  const condoActual = condominios.find(c => String(c.id) === String(condoSeleccionado))
  const totalDepartamentos = usuarios.filter(u => String(u.idCondominio || u.condominioId) === String(condoSeleccionado)).length
  const propietarios = usuarios.filter(u => {
    const mismoCondo = String(u.idCondominio || u.condominioId) === String(condoSeleccionado)
    return mismoCondo && u.rol === 'PROPIETARIO'
  })
  const propietariosFiltrados = propietarios.filter(u => {
    const termino = busqueda.toLowerCase().trim()
    if (!termino) return true
    const nc = `${u.nombres || ''} ${u.apellidos || ''}`.toLowerCase()
    return nc.includes(termino) || (u.email || '').toLowerCase().includes(termino) || String(u.id).includes(termino)
  })

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
      <EncabezadoTabla titulo="Departamentos Global" subtitulo="Vista general de unidades inmobiliarias en todos los condominios" />

      <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <div style={{ width: "100%", maxWidth: "280px" }}>
          <select style={estiloInput} value={condoSeleccionado} onChange={(e) => { setCondoSeleccionado(e.target.value); setBusqueda('') }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
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
              <div style={{ display: "flex", gap: "1.5rem", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                <div>
                  <span style={{ fontSize: "1.5rem", fontWeight: "800", color: colorSuper }}>{propietarios.length}</span>
                  <span style={{ display: "block", fontSize: "0.7rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.025em" }}>Propietarios</span>
                </div>
                <div>
                  <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#64748b" }}>{totalDepartamentos}</span>
                  <span style={{ display: "block", fontSize: "0.7rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.025em" }}>Vinculados</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: "#fefce8", border: "1px solid #fde047", borderRadius: "0.75rem", padding: "1.25rem 1.5rem", display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
            <FiAlertCircle size={20} color="#ca8a04" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
            <div>
              <h4 style={{ margin: "0 0 0.25rem", fontSize: "0.9rem", fontWeight: "700", color: "#854d0e" }}>Funcionalidad limitada para superadmin</h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#713f12", lineHeight: "1.5" }}>
                La gesti&oacute;n completa de departamentos requiere el endpoint <code style={{ backgroundColor: "rgba(0,0,0,0.05)", padding: "0.1rem 0.35rem", borderRadius: "0.25rem", fontSize: "0.8rem" }}>GET /api/super-admin/apartments</code> en el backend (actualmente devuelve 500).
                Mientras tanto, puedes consultar los propietarios registrados.
              </p>
            </div>
          </div>

          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "#1e293b" }}>
                Propietarios de {condoActual?.nombre} <span style={{ color: "#94a3b8", fontWeight: "600" }}>({propietariosFiltrados.length})</span>
              </span>
              <div className="global-search-wrap" style={{ width: "260px", maxWidth: "260px", position: "relative" }}>
                <FiSearch size={14} style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input type="text" placeholder="Buscar propietario..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                  style={{ ...estiloInput, paddingLeft: "2rem", paddingTop: "0.45rem", paddingBottom: "0.45rem", fontSize: "0.8rem" }} />
              </div>
            </div>
            {propietariosFiltrados.length === 0 ? (
              <div style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8", fontStyle: "italic", fontWeight: "600" }}>
                {busqueda ? 'No se encontraron coincidencias.' : 'No hay propietarios registrados en este condominio.'}
              </div>
            ) : (
              <div className="global-table-wrap" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "0.75rem 1.5rem" }}>ID</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Nombre</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Contacto</th>
                    <th style={{ padding: "0.75rem 1.5rem" }}>Estado</th>
                  </tr>
                </thead>
                <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                  {propietariosFiltrados.map((u, i) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                      <td style={{ padding: "0.75rem 1.5rem", fontFamily: "monospace", fontWeight: "700", color: "#94a3b8", fontSize: "0.8rem" }}>#{u.id}</td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: colorSuper, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: "700", flexShrink: 0 }}>
                            {((u.nombres || '')[0] + (u.apellidos || '')[0]).toUpperCase()}
                          </div>
                          <div>
                            <span style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.85rem" }}>{u.nombres} {u.apellidos}</span>
                            <span style={{ display: "block", fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600" }}>PROPIETARIO</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "0.75rem 1rem", color: "#64748b", fontSize: "0.8rem" }}>
                        {u.email ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.2rem" }}>
                            <FiMail size={12} /> {u.email}
                          </div>
                        ) : null}
                        {u.telefono ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                            <FiPhone size={12} /> {u.telefono}
                          </div>
                        ) : null}
                        {!u.email && !u.telefono && <span style={{ fontStyle: "italic", color: "#cbd5e1" }}>Sin datos</span>}
                      </td>
                      <td style={{ padding: "0.75rem 1.5rem" }}>
                        <span style={{
                          fontSize: "0.7rem", fontWeight: "700", padding: "0.2rem 0.55rem", borderRadius: "0.375rem",
                          backgroundColor: u.activo !== false ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                          color: u.activo !== false ? "#10b981" : "#ef4444"
                        }}>
                          {u.activo !== false ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
