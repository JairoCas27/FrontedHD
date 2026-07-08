import React, { useState, useEffect, useCallback } from 'react'
import { FiFolder, FiGrid, FiHome, FiMapPin, FiChevronDown, FiChevronRight, FiPlus, FiTrash2, FiLayers, FiX, FiAlertCircle, FiUser } from "react-icons/fi"
import { toast } from 'react-toastify'
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { getCondominiums, getAdminStructure, createAdminStructureNode, deleteAdminStructureNode, getAllUsers } from '../../services/api'

const colorSuper = "rgb(124,58,237)"

const globalResponsive = `
@media (max-width: 767px) {
  .global-card-padding { padding: 1rem !important; }
}
`;

const estiloInput = {
  width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem",
  border: "1px solid #cbd5e1", fontSize: "0.9rem", color: "#334155",
  backgroundColor: "#ffffff", boxSizing: "border-box", outline: "none"
}

const modalOverlay = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)", display: "flex",
  alignItems: "center", justifyContent: "center", zIndex: 1000
}

const modalBox = {
  backgroundColor: "#fff", borderRadius: "1rem", padding: "2rem",
  width: "90%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  position: "relative"
}

export default function GlobalEstructura() {
  const [condominios, setCondominios] = useState([])
  const [condominioId, setCondominioId] = useState('')
  const [structure, setStructure] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [structureLoading, setStructureLoading] = useState(false)
  const [expandedTowers, setExpandedTowers] = useState({})
  const [expandedFloors, setExpandedFloors] = useState({})

  const [showAddTowerModal, setShowAddTowerModal] = useState(false)
  const [towerName, setTowerName] = useState('')
  const [creatingTower, setCreatingTower] = useState(false)

  const [showAddFloorModal, setShowAddFloorModal] = useState(false)
  const [selectedTowerForFloor, setSelectedTowerForFloor] = useState(null)
  const [floorNumber, setFloorNumber] = useState('')
  const [creatingFloor, setCreatingFloor] = useState(false)

  const [deletingId, setDeletingId] = useState(null)

  const [aptDetail, setAptDetail] = useState(null)

  useEffect(() => {
    Promise.all([
      getCondominiums().then(d => setCondominios(d?.items || d || [])).catch(() => {}),
      getAllUsers().then(d => setAllUsers(Array.isArray(d) ? d : (d?.items || []))).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const fetchStructure = useCallback(async (id) => {
    if (!id) { setStructure(null); return }
    setStructureLoading(true)
    try {
      const data = await getAdminStructure(id)
      setStructure(data)
    } catch (err) {
      toast.error(`Error al cargar estructura: ${err.message}`)
      setStructure(null)
    } finally {
      setStructureLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStructure(condominioId)
    setExpandedTowers({})
    setExpandedFloors({})
  }, [condominioId, fetchStructure])

  const condoActual = condominios.find(c => String(c.id) === String(condominioId))

  const totalTorres = structure?.torres?.length || 0
  const totalPisos = structure?.torres?.reduce((sum, t) => sum + (t.pisos?.length || 0), 0) || 0
  const totalApartamentos = structure?.torres?.reduce((sum, t) =>
    sum + (t.pisos?.reduce((s, p) => s + (p.apartamentos?.length || 0), 0) || 0), 0
  ) || 0

  function getOwnerInfo(apt) {
    if (!apt.idPropietario) return null
    return allUsers.find(u => String(u.id) === String(apt.idPropietario)) || null
  }

  const toggleTower = (id) => {
    setExpandedTowers(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleFloor = (id) => {
    setExpandedFloors(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleAddTower = async () => {
    const name = towerName.trim()
    if (!name) { toast.warning('Ingresa un nombre para la torre'); return }
    setCreatingTower(true)
    try {
      await createAdminStructureNode({ tipo: 'TORRE', nombre: name }, condominioId)
      toast.success('Torre creada correctamente')
      setShowAddTowerModal(false)
      setTowerName('')
      await fetchStructure(condominioId)
    } catch (err) {
      toast.error(`Error al crear torre: ${err.message}`)
    } finally {
      setCreatingTower(false)
    }
  }

  const handleDeleteTower = async (id) => {
    if (!window.confirm('¿Eliminar esta torre y todos sus pisos y apartamentos?')) return
    setDeletingId(id)
    try {
      await deleteAdminStructureNode(id, 'TORRE', condominioId)
      toast.success('Torre eliminada')
      await fetchStructure(condominioId)
    } catch (err) {
      toast.error(`Error al eliminar torre: ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  const handleAddFloor = async () => {
    const num = parseInt(floorNumber, 10)
    if (isNaN(num) || num < 1) { toast.warning('Ingresa un número de piso válido'); return }
    if (!selectedTowerForFloor) return
    setCreatingFloor(true)
    try {
      await createAdminStructureNode({
        tipo: 'PISO',
        nombre: `Piso ${num}`,
        numero: num,
        nombreTorre: selectedTowerForFloor.nombre
      }, condominioId)
      toast.success('Piso creado correctamente')
      setShowAddFloorModal(false)
      setFloorNumber('')
      setSelectedTowerForFloor(null)
      if (!expandedTowers[selectedTowerForFloor.id]) {
        setExpandedTowers(prev => ({ ...prev, [selectedTowerForFloor.id]: true }))
      }
      await fetchStructure(condominioId)
    } catch (err) {
      toast.error(`Error al crear piso: ${err.message}`)
    } finally {
      setCreatingFloor(false)
    }
  }

  const handleDeleteFloor = async (id) => {
    if (!window.confirm('¿Eliminar este piso y todos sus apartamentos?')) return
    setDeletingId(id)
    try {
      await deleteAdminStructureNode(id, 'PISO', condominioId)
      toast.success('Piso eliminado')
      await fetchStructure(condominioId)
    } catch (err) {
      toast.error(`Error al eliminar piso: ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  const btnStyle = {
    padding: "0.3rem 0.5rem", borderRadius: "0.4rem", fontSize: "0.7rem", fontWeight: "600",
    border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem",
    transition: "all 0.15s"
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#64748b", fontWeight: "600", textAlign: "center" }}>
        Cargando condominios...
      </div>
    )
  }

  return (
    <div className="global-card-padding" style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      <style>{globalResponsive}</style>
      <EncabezadoTabla titulo="Estructura Global" subtitulo="Organigrama de nodos físicos de todos los condominios" />

      <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <div style={{ width: "100%", maxWidth: "280px" }}>
          <select style={estiloInput} value={condominioId} onChange={(e) => setCondominioId(e.target.value)}>
            <option value="">Seleccionar condominio</option>
            {condominios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      </div>

      {!condominioId ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          <FiFolder size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
          <p>Selecciona un condominio para ver su estructura</p>
        </div>
      ) : structureLoading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          Cargando estructura...
        </div>
      ) : !structure ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          <FiAlertCircle size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
          <p>No se pudo cargar la estructura</p>
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
                    <span style={{ fontSize: "1.25rem", fontWeight: "800", color: colorSuper }}>{totalTorres}</span>
                    <span style={{ display: "block", fontSize: "0.65rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.025em", marginTop: "0.2rem" }}>Torres</span>
                  </div>
                  <div style={{ flex: 1, backgroundColor: "#f8fafc", borderRadius: "0.5rem", padding: "0.75rem", textAlign: "center" }}>
                    <span style={{ fontSize: "1.25rem", fontWeight: "800", color: colorSuper }}>{totalPisos}</span>
                    <span style={{ display: "block", fontSize: "0.65rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.025em", marginTop: "0.2rem" }}>Niveles</span>
                  </div>
                  <div style={{ flex: 1, backgroundColor: "#f8fafc", borderRadius: "0.5rem", padding: "0.75rem", textAlign: "center" }}>
                    <span style={{ fontSize: "1.25rem", fontWeight: "800", color: colorSuper }}>{totalApartamentos}</span>
                    <span style={{ display: "block", fontSize: "0.65rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.025em", marginTop: "0.2rem" }}>Aptos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#0f172a" }}>Torres</h3>
            <button onClick={() => setShowAddTowerModal(true)}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", backgroundColor: colorSuper, color: "#fff", border: "none", borderRadius: "0.5rem", padding: "0.5rem 1rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>
              <FiPlus size={16} /> Agregar Torre
            </button>
          </div>

          {(!structure.torres || structure.torres.length === 0) ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8", fontWeight: "600", background: "#fff", borderRadius: "1rem", border: "1px solid #e2e8f0" }}>
              <FiHome size={40} style={{ marginBottom: "0.75rem", opacity: 0.3 }} />
              <p>No hay torres registradas en este condominio</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {structure.torres.map(torre => {
                const isTowerOpen = expandedTowers[torre.id]
                return (
                  <div key={torre.id} style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                    <div onClick={() => toggleTower(torre.id)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", cursor: "pointer", backgroundColor: isTowerOpen ? "rgba(124,58,237,0.03)" : "#fff", borderBottom: isTowerOpen ? "1px solid #f1f5f9" : "none", transition: "background 0.15s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <FiHome size={20} color={colorSuper} />
                        <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "#0f172a" }}>{torre.nombre}</span>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600", backgroundColor: "#f1f5f9", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>
                          {torre.pisos?.length || 0} pisos
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedTowerForFloor(torre); setShowAddFloorModal(true) }}
                          style={{ ...btnStyle, backgroundColor: "transparent", color: colorSuper, border: `1px solid ${colorSuper}` }}>
                          <FiPlus size={13} /> Piso
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteTower(torre.id) }}
                          disabled={deletingId === torre.id}
                          style={{ ...btnStyle, color: "#ef4444", background: "transparent", fontSize: "0.85rem" }}>
                          {deletingId === torre.id ? '...' : <FiTrash2 size={14} />}
                        </button>
                        {isTowerOpen ? <FiChevronDown size={18} color="#64748b" /> : <FiChevronRight size={18} color="#64748b" />}
                      </div>
                    </div>

                    {isTowerOpen && (
                      <div style={{ padding: "0.75rem 1.25rem 1.25rem", backgroundColor: "#fafbfc" }}>
                        {(!torre.pisos || torre.pisos.length === 0) ? (
                          <div style={{ textAlign: "center", padding: "1.5rem", color: "#94a3b8", fontSize: "0.85rem", fontWeight: "600" }}>
                            <FiLayers size={24} style={{ marginBottom: "0.4rem", opacity: 0.3 }} />
                            <p style={{ margin: 0 }}>No hay pisos en esta torre</p>
                          </div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {torre.pisos.map(piso => {
                              const isFloorOpen = expandedFloors[piso.id]
                              return (
                                <div key={piso.id} style={{ background: "#fff", borderRadius: "0.65rem", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                                  <div onClick={() => toggleFloor(piso.id)}
                                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 1rem", cursor: "pointer", backgroundColor: isFloorOpen ? "rgba(124,58,237,0.02)" : "#fff", borderBottom: isFloorOpen ? "1px solid #f1f5f9" : "none" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                                      <FiLayers size={16} color="#64748b" />
                                      <span style={{ fontWeight: "600", fontSize: "0.9rem", color: "#0f172a" }}>{piso.nombre || `Piso ${piso.numero}`}</span>
                                      <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600", backgroundColor: "#f1f5f9", padding: "0.1rem 0.45rem", borderRadius: "999px" }}>
                                        {piso.apartamentos?.length || 0} aptos
                                      </span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                                      <button onClick={(e) => { e.stopPropagation(); setEditFloorData(piso); setEditFloorNum(String(piso.numero || '')); setShowEditFloorModal(true) }}
                                        style={{ ...btnStyle, backgroundColor: "rgba(124,58,237,0.08)", color: colorSuper }}>
                                        <FiEdit3 size={11} />
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); setSelectedFloorForApt({ id: piso.id, numero: piso.numero, nombreTorre: torre.nombre }); setAptForm({ numero: '', metraje: '', derechoEstacionamiento: false }); setShowAddAptModal(true) }}
                                        style={{ ...btnStyle, backgroundColor: "transparent", color: colorSuper, border: `1px solid ${colorSuper}` }}>
                                        <FiPlus size={11} /> Apto
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); handleDeleteFloor(piso.id) }}
                                        disabled={deletingId === piso.id}
                                        style={{ ...btnStyle, color: "#ef4444", background: "transparent" }}>
                                        {deletingId === piso.id ? '...' : <FiTrash2 size={12} />}
                                      </button>
                                      {isFloorOpen ? <FiChevronDown size={15} color="#94a3b8" /> : <FiChevronRight size={15} color="#94a3b8" />}
                                    </div>
                                  </div>

                                  {isFloorOpen && (
                                    <div style={{ padding: "0.75rem 1rem", backgroundColor: "#f8f9fb" }}>
                                      {(!piso.apartamentos || piso.apartamentos.length === 0) ? (
                                        <div style={{ textAlign: "center", padding: "1rem", color: "#94a3b8", fontSize: "0.8rem", fontWeight: "600" }}>
                                          <p style={{ margin: 0 }}>No hay apartamentos en este piso</p>
                                        </div>
                                      ) : (
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.5rem" }}>
                                          {piso.apartamentos.map(apt => {
                                            const ocupado = apt.idPropietario != null
                                            const owner = getOwnerInfo(apt)
                                            return (
                                              <div key={apt.id} style={{
                                                background: "#fff", borderRadius: "0.5rem", border: `1px solid ${ocupado ? "#bbf7d0" : "#fecaca"}`,
                                                padding: "0.6rem 0.75rem"
                                              }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                                                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                                    <FiGrid size={13} color={colorSuper} />
                                                    <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0f172a" }}>{apt.numero}</span>
                                                    {apt.metraje && <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{apt.metraje}m²</span>}
                                                  </div>
                                                  <span style={{
                                                    fontSize: "0.6rem", fontWeight: "700", padding: "0.1rem 0.4rem", borderRadius: "999px",
                                                    backgroundColor: ocupado ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                                                    color: ocupado ? "#10b981" : "#ef4444"
                                                  }}>
                                                    {ocupado ? 'Ocupado' : 'Disponible'}
                                                  </span>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexWrap: "wrap" }}>
                                                  {apt.derechoEstacionamiento && (
                                                    <span style={{ fontSize: "0.6rem", color: colorSuper, fontWeight: "700", backgroundColor: "rgba(124,58,237,0.08)", padding: "0.05rem 0.35rem", borderRadius: "999px" }}>
                                                      P
                                                    </span>
                                                  )}
                                                  {ocupado ? (
                                                    <span style={{ fontSize: "0.65rem", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}
                                                      onClick={() => setAptDetail({ ...apt, torreNombre: torre.nombre, pisoNumero: piso.numero, owner })}>
                                                      <FiUser size={10} /> {apt.nombrePropietario || 'Ver'}
                                                    </span>
                                                  ) : (
                                                    <span style={{ fontSize: "0.65rem", color: "#94a3b8", fontStyle: "italic" }}>Sin propietario</span>
                                                  )}
                                                  <div style={{ marginLeft: "auto", display: "flex", gap: "0.2rem" }}>
                                                    <button onClick={() => { setEditAptData(apt); setEditAptForm({ numero: apt.numero, metraje: apt.metraje || '', derechoEstacionamiento: apt.derechoEstacionamiento || false }); setShowEditAptModal(true) }}
                                                      style={{ ...btnStyle, padding: "0.15rem 0.35rem", backgroundColor: "rgba(124,58,237,0.08)", color: colorSuper }}>
                                                      <FiEdit3 size={10} />
                                                    </button>
                                                    <button onClick={() => setConfirmDeleteApt(apt)}
                                                      style={{ ...btnStyle, padding: "0.15rem 0.35rem", color: "#ef4444", background: "transparent" }}>
                                                      <FiTrash2 size={10} />
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Add Tower Modal */}
          {showAddTowerModal && (
            <div style={modalOverlay} onClick={() => { if (!creatingTower) { setShowAddTowerModal(false); setTowerName('') } }}>
              <div style={modalBox} onClick={e => e.stopPropagation()}>
                <button onClick={() => { setShowAddTowerModal(false); setTowerName('') }}
                  style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                  <FiX size={20} />
                </button>
                <h3 style={{ margin: "0 0 1.5rem", fontSize: "1.1rem", fontWeight: "700", color: "#0f172a" }}>Agregar Torre</h3>
                <input type="text" placeholder="Nombre de la torre" value={towerName} onChange={e => setTowerName(e.target.value)} style={estiloInput} autoFocus />
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", justifyContent: "flex-end" }}>
                  <button onClick={() => { setShowAddTowerModal(false); setTowerName('') }} disabled={creatingTower}
                    style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}>
                    Cancelar
                  </button>
                  <button onClick={handleAddTower} disabled={creatingTower}
                    style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: colorSuper, color: "#fff", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}>
                    {creatingTower ? 'Creando...' : 'Crear'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Apartment Detail */}
          {aptDetail && (
            <div style={modalOverlay} onClick={() => setAptDetail(null)}>
              <div style={{ ...modalBox, maxWidth: "440px" }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setAptDetail(null)}
                  style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                  <FiX size={20} />
                </button>
                <h3 style={{ margin: "0 0 1.25rem", fontSize: "1.1rem", fontWeight: "700", color: "#0f172a" }}>
                  Apartamento {aptDetail.numero}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div>
                    <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Torre</span>
                    <p style={{ margin: "0.15rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{aptDetail.torreNombre || '-'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Piso</span>
                    <p style={{ margin: "0.15rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{aptDetail.pisoNumero || '-'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Metraje</span>
                    <p style={{ margin: "0.15rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{aptDetail.metraje ? `${aptDetail.metraje} m²` : '-'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Estado</span>
                    <p style={{ margin: "0.15rem 0 0", fontWeight: "600", fontSize: "0.85rem" }}>
                      <span style={{
                        padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.7rem",
                        backgroundColor: aptDetail.idPropietario ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                        color: aptDetail.idPropietario ? "#10b981" : "#ef4444"
                      }}>
                        {aptDetail.idPropietario ? 'Ocupado' : 'Disponible'}
                      </span>
                    </p>
                  </div>
                </div>
                {aptDetail.idPropietario ? (
                  <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Propietario</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.3rem" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: colorSuper, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: "700", flexShrink: 0 }}>
                        <FiUser size={16} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{aptDetail.nombrePropietario || 'Propietario'}</p>
                        {aptDetail.owner && (
                          <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
                            {aptDetail.owner.email && <span>{aptDetail.owner.email}</span>}
                            {aptDetail.owner.email && aptDetail.owner.telefono && <span> · </span>}
                            {aptDetail.owner.telefono && <span>{aptDetail.owner.telefono}</span>}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Propietario</span>
                    <p style={{ margin: "0.3rem 0 0", fontStyle: "italic", color: "#94a3b8", fontSize: "0.85rem" }}>Sin asignar</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
