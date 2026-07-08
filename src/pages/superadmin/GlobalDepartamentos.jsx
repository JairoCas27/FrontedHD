import React, { useState, useEffect } from 'react'
import { FiHome, FiUser, FiUsers, FiGrid, FiSearch, FiMail, FiPhone, FiX, FiCheck, FiEye, FiUserPlus, FiAlertTriangle, FiRefreshCw } from "react-icons/fi"
import { toast } from 'react-toastify'
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { getCondominiums, getAdminApartments, assignApartmentOwner, getAllUsers } from '../../services/api'

const colorSuper = "rgb(124,58,237)"

const globalResponsive = `
@media (max-width: 767px) {
  .global-card-padding { padding: 1rem !important; }
  .global-table-wrap { overflow-x: auto !important; }
  .global-search-wrap { width: 100% !important; max-width: 260px !important; }
}
`

const estiloInput = {
  width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem",
  border: "1px solid #cbd5e1", fontSize: "0.9rem", color: "#334155",
  backgroundColor: "#ffffff", boxSizing: "border-box", outline: "none"
}

const modalOverlay = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
  display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
}

const modalContent = {
  backgroundColor: "#fff", borderRadius: "1rem", maxWidth: "600px", width: "100%",
  maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
}

export default function GlobalDepartamentos() {
  const [condominios, setCondominios] = useState([])
  const [apartments, setApartments] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [condoSeleccionado, setCondoSeleccionado] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingApts, setLoadingApts] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [modalAssign, setModalAssign] = useState(null)
  const [assignUserId, setAssignUserId] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [modalDetail, setModalDetail] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getCondominiums().then(d => setCondominios(d?.items || d || [])).catch(() => {}),
      getAllUsers().then(d => {
        const lista = Array.isArray(d) ? d : (d?.items || [])
        setAllUsers(lista)
      }).catch(() => {})
    ]).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!condoSeleccionado) {
      setApartments([])
      return
    }
    setLoadingApts(true)
    getAdminApartments(condoSeleccionado)
      .then(d => {
        const lista = Array.isArray(d) ? d : (d?.items || [])
        setApartments(lista)
      })
      .catch(err => {
        toast.error(`Error al cargar departamentos: ${err.message}`)
        setApartments([])
      })
      .finally(() => setLoadingApts(false))
  }, [condoSeleccionado])

  const condoActual = condominios.find(c => String(c.id) === String(condoSeleccionado))
  const totalApts = apartments.length
  const occupiedApts = apartments.filter(a => a.idPropietario != null)
  const unoccupiedApts = apartments.filter(a => a.idPropietario == null)

  const apartmentsFiltrados = apartments.filter(a => {
    const termino = busqueda.toLowerCase().trim()
    if (!termino) return true
    const nro = String(a.numero || '').toLowerCase()
    const torre = (a.torreNombre || '').toLowerCase()
    const piso = (a.pisoNumero || '').toLowerCase()
    const prop = (a.nombrePropietario || '').toLowerCase()
    return nro.includes(termino) || torre.includes(termino) || piso.includes(termino) || prop.includes(termino)
  })

  const propietariosDisponibles = allUsers.filter(u => {
    const mismoCondo = String(u.idCondominio || u.condominioId || '') === String(condoSeleccionado)
    return mismoCondo && u.rol === 'PROPIETARIO'
  })

  function getContacto(apt) {
    if (!apt.idPropietario) return null
    const user = allUsers.find(u => String(u.id) === String(apt.idPropietario))
    return user || null
  }

  async function handleAssign() {
    if (!assignUserId) {
      toast.warning('Selecciona un propietario')
      return
    }
    setAssigning(true)
    try {
      await assignApartmentOwner(modalAssign.id, assignUserId, condoSeleccionado)
      toast.success('Propietario asignado correctamente')
      setApartments(prev => prev.map(a =>
        String(a.id) === String(modalAssign.id)
          ? { ...a, idPropietario: Number(assignUserId), nombrePropietario: '' }
          : a
      ))
      const assignedUser = allUsers.find(u => String(u.id) === String(assignUserId))
      if (assignedUser) {
        const nombreCompleto = `${assignedUser.nombres || ''} ${assignedUser.apellidos || ''}`.trim()
        setApartments(prev => prev.map(a =>
          String(a.id) === String(modalAssign.id)
            ? { ...a, nombrePropietario: nombreCompleto }
            : a
        ))
      }
      setModalAssign(null)
      setAssignUserId('')
    } catch (err) {
      toast.error(`Error al asignar: ${err.message}`)
    } finally {
      setAssigning(false)
    }
  }

  function openDetail(apt) {
    setModalDetail(apt)
  }

  const btnStyle = {
    padding: "0.45rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700",
    border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem",
    transition: "all 0.2s"
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#64748b", fontWeight: "600", textAlign: "center" }}>
        Cargando...
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
          <p>Selecciona un condominio para ver sus departamentos</p>
        </div>
      ) : loadingApts ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          <FiRefreshCw size={32} style={{ marginBottom: "1rem", opacity: 0.4, animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p>Cargando departamentos...</p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ backgroundColor: "rgba(124,58,237,0.1)", padding: "0.65rem", borderRadius: "0.65rem" }}>
                  <FiHome size={22} color={colorSuper} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>{condoActual?.nombre}</h3>
                  <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>{condoActual?.direccion || ''}</span>
                </div>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: "800", color: colorSuper }}>{totalApts}</div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.025em" }}>Total Departamentos</div>
            </div>

            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ backgroundColor: "rgba(16,185,129,0.1)", padding: "0.65rem", borderRadius: "0.65rem" }}>
                  <FiUser size={22} color="#10b981" />
                </div>
                <span style={{ fontWeight: "700", fontSize: "0.85rem", color: "#1e293b" }}>Ocupados</span>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: "800", color: "#10b981" }}>{occupiedApts.length}</div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.025em" }}>Con propietario</div>
            </div>

            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ backgroundColor: "rgba(239,68,68,0.1)", padding: "0.65rem", borderRadius: "0.65rem" }}>
                  <FiAlertTriangle size={22} color="#ef4444" />
                </div>
                <span style={{ fontWeight: "700", fontSize: "0.85rem", color: "#1e293b" }}>Disponibles</span>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: "800", color: "#ef4444" }}>{unoccupiedApts.length}</div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.025em" }}>Sin asignar</div>
            </div>
          </div>

          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
              <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "#1e293b" }}>
                Departamentos de {condoActual?.nombre} <span style={{ color: "#94a3b8", fontWeight: "600" }}>({apartmentsFiltrados.length})</span>
              </span>
              <div className="global-search-wrap" style={{ width: "260px", maxWidth: "260px", position: "relative" }}>
                <FiSearch size={14} style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input type="text" placeholder="Buscar departamento..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                  style={{ ...estiloInput, paddingLeft: "2rem", paddingTop: "0.45rem", paddingBottom: "0.45rem", fontSize: "0.8rem" }} />
              </div>
            </div>
            {apartmentsFiltrados.length === 0 ? (
              <div style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8", fontStyle: "italic", fontWeight: "600" }}>
                {busqueda ? 'No se encontraron coincidencias.' : 'No hay departamentos registrados en este condominio.'}
              </div>
            ) : (
              <div className="global-table-wrap" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ padding: "0.75rem 1rem" }}>N&deg; Depto</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Torre</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Piso</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Propietario</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Contacto</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Inquilinos</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Estado</th>
                      <th style={{ padding: "0.75rem 1rem" }}>Acci&oacute;n</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                    {apartmentsFiltrados.map((apt, i) => {
                      const contacto = getContacto(apt)
                      const tienePropietario = apt.idPropietario != null
                      return (
                        <tr key={apt.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                          <td style={{ padding: "0.75rem 1rem", fontWeight: "700", color: "#0f172a" }}>
                            <span style={{ cursor: "pointer", color: colorSuper, textDecoration: "underline", textDecorationColor: "rgba(124,58,237,0.3)" }}
                              onClick={() => openDetail(apt)}>
                              {apt.numero}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>{apt.torreNombre || <span style={{ fontStyle: "italic", color: "#cbd5e1" }}>---</span>}</td>
                          <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>{apt.pisoNumero || <span style={{ fontStyle: "italic", color: "#cbd5e1" }}>---</span>}</td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            {tienePropietario ? (
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: colorSuper, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: "700", flexShrink: 0 }}>
                                  {(apt.nombrePropietario || '??').split(' ').map(s => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()}
                                </div>
                                <span style={{ fontWeight: "600", fontSize: "0.8rem", color: "#0f172a" }}>{apt.nombrePropietario}</span>
                              </div>
                            ) : (
                              <span style={{ fontStyle: "italic", color: "#cbd5e1", fontSize: "0.8rem", fontWeight: "600" }}>Sin asignar</span>
                            )}
                          </td>
                          <td style={{ padding: "0.75rem 1rem", fontSize: "0.75rem", color: "#64748b" }}>
                            {contacto ? (
                              <>
                                {contacto.email && <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.15rem" }}><FiMail size={11} /> {contacto.email}</div>}
                                {contacto.telefono && <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}><FiPhone size={11} /> {contacto.telefono}</div>}
                                {!contacto.email && !contacto.telefono && <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>---</span>}
                              </>
                            ) : (
                              <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>---</span>
                            )}
                          </td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#64748b", fontWeight: "600" }}>
                              <FiUsers size={13} />
                              <span>{Array.isArray(apt.inquilinos) ? apt.inquilinos.length : 0}</span>
                            </div>
                          </td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            <span style={{
                              fontSize: "0.65rem", fontWeight: "700", padding: "0.2rem 0.55rem", borderRadius: "0.375rem",
                              backgroundColor: tienePropietario ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                              color: tienePropietario ? "#10b981" : "#ef4444",
                              whiteSpace: "nowrap"
                            }}>
                              {tienePropietario ? 'Ocupado' : 'Disponible'}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem 1rem" }}>
                            {!tienePropietario ? (
                              <button style={{ ...btnStyle, backgroundColor: colorSuper, color: "#fff" }}
                                onClick={() => { setModalAssign(apt); setAssignUserId('') }}>
                                <FiUserPlus size={14} /> Asignar
                              </button>
                            ) : (
                              <button style={{ ...btnStyle, backgroundColor: "rgba(124,58,237,0.1)", color: colorSuper }}
                                onClick={() => openDetail(apt)}>
                                <FiEye size={14} /> Ver
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {modalAssign && (
        <div style={modalOverlay} onClick={() => setModalAssign(null)}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.1rem" }}>Asignar Propietario</h3>
              <button onClick={() => setModalAssign(null)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}>
                <FiX size={20} />
              </button>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <p style={{ margin: "0 0 1rem", fontSize: "0.85rem", color: "#475569" }}>
                Departamento <strong>{modalAssign.numero}</strong>
                {modalAssign.torreNombre && <> &mdash; Torre <strong>{modalAssign.torreNombre}</strong></>}
                {modalAssign.pisoNumero && <> &mdash; Piso <strong>{modalAssign.pisoNumero}</strong></>}
              </p>
              <label style={{ fontWeight: "700", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.5rem", display: "block" }}>Seleccionar propietario</label>
              <select
                style={estiloInput}
                value={assignUserId}
                onChange={(e) => setAssignUserId(e.target.value)}
              >
                <option value="">-- Seleccionar --</option>
                {propietariosDisponibles.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.nombres || ''} {u.apellidos || ''} {u.email ? `(${u.email})` : ''}
                  </option>
                ))}
              </select>
              {propietariosDisponibles.length === 0 && (
                <p style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "#ef4444", fontWeight: "600" }}>
                  No hay propietarios disponibles en este condominio.
                </p>
              )}
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button onClick={() => setModalAssign(null)}
                  style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>
                  Cancelar
                </button>
                <button onClick={handleAssign} disabled={assigning || !assignUserId}
                  style={{
                    padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none",
                    backgroundColor: assignUserId ? colorSuper : "#cbd5e1", color: "#fff",
                    fontWeight: "600", cursor: assignUserId ? "pointer" : "not-allowed", fontSize: "0.85rem",
                    display: "flex", alignItems: "center", gap: "0.4rem"
                  }}>
                  {assigning ? 'Asignando...' : <><FiCheck size={16} /> Asignar</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalDetail && (
        <div style={modalOverlay} onClick={() => setModalDetail(null)}>
          <div style={{ ...modalContent, maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.1rem" }}>
                Depto. {modalDetail.numero}
              </h3>
              <button onClick={() => setModalDetail(null)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}>
                <FiX size={20} />
              </button>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Torre</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{modalDetail.torreNombre || '---'}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Piso</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{modalDetail.pisoNumero || '---'}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Metraje</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{modalDetail.metraje ? `${modalDetail.metraje} m²` : '---'}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Estacionamiento</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{modalDetail.derechoEstacionamiento ? 'Sí' : 'No'}</p>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Propietario</span>
                {modalDetail.idPropietario ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginTop: "0.4rem" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: colorSuper, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: "700", flexShrink: 0 }}>
                      {(modalDetail.nombrePropietario || '??').split(' ').map(s => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: "700", color: "#0f172a", fontSize: "0.95rem" }}>{modalDetail.nombrePropietario}</p>
                      {(() => {
                        const contacto = getContacto(modalDetail)
                        return contacto ? (
                          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                            {contacto.email && <span>{contacto.email}</span>}
                            {contacto.email && contacto.telefono && <span> &middot; </span>}
                            {contacto.telefono && <span>{contacto.telefono}</span>}
                          </span>
                        ) : null
                      })()}
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: "0.4rem 0 0", fontStyle: "italic", color: "#94a3b8", fontSize: "0.9rem" }}>Sin propietario asignado</p>
                )}
              </div>

              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>
                  Inquilinos ({Array.isArray(modalDetail.inquilinos) ? modalDetail.inquilinos.length : 0})
                </span>
                {Array.isArray(modalDetail.inquilinos) && modalDetail.inquilinos.length > 0 ? (
                  <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {modalDetail.inquilinos.map((inq, idx) => (
                      <div key={inq.id || idx} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.5rem 0.75rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#e2e8f0", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: "700", flexShrink: 0 }}>
                          <FiUsers size={14} />
                        </div>
                        <div>
                          <span style={{ fontWeight: "600", fontSize: "0.85rem", color: "#0f172a" }}>{inq.nombre || inq.nombres || 'Inquilino'} {inq.apellidos || ''}</span>
                          {inq.email && <span style={{ display: "block", fontSize: "0.7rem", color: "#64748b" }}>{inq.email}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: "0.4rem 0 0", fontStyle: "italic", color: "#94a3b8", fontSize: "0.85rem" }}>No hay inquilinos registrados</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
