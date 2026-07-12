import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiFolder, FiGrid, FiHome, FiMapPin, FiChevronDown, FiChevronRight, FiPlus, FiTrash2, FiLayers, FiX, FiAlertCircle, FiEdit3, FiUser, FiUsers, FiCheck, FiSearch } from "react-icons/fi"
import { toast } from 'react-toastify'
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { getCondominiums, getAdminStructure, createAdminStructureNode, deleteAdminStructureNode, getAllUsers, extractItems } from '../../services/api'

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

const coloresGradiente = [
  ['#7c3aed', '#a78bfa'],
  ['#0ea5e9', '#38bdf8'],
  ['#f59e0b', '#fbbf24'],
  ['#10b981', '#34d399'],
  ['#ef4444', '#f87171'],
  ['#ec4899', '#f472b6'],
  ['#14b8a6', '#2dd4bf'],
  ['#f97316', '#fb923c'],
]

const modalBox = {
  backgroundColor: "#fff", borderRadius: "1rem", padding: "2rem",
  width: "90%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  position: "relative"
}

export default function GlobalEstructura() {
  const navigate = useNavigate()
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

  const [showAddAptModal, setShowAddAptModal] = useState(false)
  const [addAptContext, setAddAptContext] = useState(null)
  const [aptNumero, setAptNumero] = useState('')
  const [aptMetraje, setAptMetraje] = useState('')
  const [aptParking, setAptParking] = useState(false)
  const [creatingApt, setCreatingApt] = useState(false)

  const [confirmDeleteApt, setConfirmDeleteApt] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [aptDetail, setAptDetail] = useState(null)
  const [showCardSelector, setShowCardSelector] = useState(true)
  const [condoSearch, setCondoSearch] = useState('')

  const filteredCondominios = useMemo(() => {
    if (!condoSearch) return condominios
    const q = condoSearch.toLowerCase()
    return condominios.filter(c =>
      (c.nombre?.toLowerCase() || '').includes(q) ||
      (c.direccion?.toLowerCase() || '').includes(q) ||
      (c.ciudad?.toLowerCase() || '').includes(q)
    )
  }, [condominios, condoSearch])

  useEffect(() => {
    Promise.all([
      getCondominiums().then(d => setCondominios(extractItems(d))).catch(() => { }),
      getAllUsers().then(d => setAllUsers(extractItems(d))).catch(() => { }),
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

  const toggleTower = (id) => setExpandedTowers(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleFloor = (id) => setExpandedFloors(prev => ({ ...prev, [id]: !prev[id] }))

  const handleAddTower = async () => {
    const name = towerName.trim()
    if (!name) { toast.warning('Ingresa un nombre'); return }
    setCreatingTower(true)
    try {
      await createAdminStructureNode({ tipo: 'TORRE', nombre: name }, condominioId)
      toast.success('Torre creada')
      setShowAddTowerModal(false)
      setTowerName('')
      await fetchStructure(condominioId)
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setCreatingTower(false)
    }
  }

  const handleDeleteTower = async (id) => {
    if (!window.confirm('¿Eliminar esta torre y todo su contenido?')) return
    setDeletingId(id)
    try {
      await deleteAdminStructureNode(id, 'TORRE', condominioId)
      toast.success('Torre eliminada')
      await fetchStructure(condominioId)
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  const handleAddFloor = async () => {
    const num = parseInt(floorNumber, 10)
    if (isNaN(num) || num < 1) { toast.warning('Número de piso inválido'); return }
    setCreatingFloor(true)
    try {
      await createAdminStructureNode({ tipo: 'PISO', nombre: `Piso ${num}`, numero: num, nombreTorre: selectedTowerForFloor.nombre }, condominioId)
      toast.success('Piso creado')
      setShowAddFloorModal(false)
      setFloorNumber('')
      setSelectedTowerForFloor(null)
      if (!expandedTowers[selectedTowerForFloor.id]) setExpandedTowers(prev => ({ ...prev, [selectedTowerForFloor.id]: true }))
      await fetchStructure(condominioId)
    } catch (err) {
      toast.error(`Error: ${err.message}`)
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
      toast.error(`Error: ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  const handleAddApt = async () => {
    if (!aptNumero.trim()) { toast.warning('Ingresa el número del apartamento'); return }
    setCreatingApt(true)
    try {
      await createAdminStructureNode({
        tipo: 'APARTAMENTO',
        nombreTorre: addAptContext.nombreTorre,
        numeroPiso: Number(addAptContext.numeroPiso),
        numeroApartamento: Number(aptNumero.trim()),
        metraje: aptMetraje ? Number(aptMetraje) : 50.0,
      }, condominioId)
      toast.success('Apartamento creado')
      setShowAddAptModal(false)
      setAddAptContext(null)
      setAptNumero('')
      setAptMetraje('')
      setAptParking(false)
      await fetchStructure(condominioId)
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setCreatingApt(false)
    }
  }

  const handleDeleteApt = async () => {
    if (!confirmDeleteApt) return
    setDeletingId('apt-' + confirmDeleteApt.id)
    try {
      await deleteAdminStructureNode(confirmDeleteApt.id, 'APARTAMENTO', condominioId)
      toast.success('Apartamento eliminado')
      setConfirmDeleteApt(null)
      await fetchStructure(condominioId)
    } catch (err) {
      toast.error(`Error: ${err.message}`)
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
    return <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#64748b", fontWeight: "600", textAlign: "center" }}>Cargando condominios...</div>
  }

  return (
    <div className="global-card-padding" style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      <style>{globalResponsive}</style>
      <EncabezadoTabla titulo="Estructura Global" subtitulo="Organigrama de nodos físicos de todos los condominios" />

      {/* --- COMPACT VIEW cuando ya hay un condominio seleccionado --- */}
      {condominioId && !showCardSelector && (
        <div style={{
          marginBottom: "2rem",
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          border: "1px solid #e2e8f0",
          padding: "1rem 1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "0.75rem",
              background: `linear-gradient(135deg, ${colorSuper}22, ${colorSuper}11)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${colorSuper}33`,
            }}>
              <FiHome size={22} color={colorSuper} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: "800", color: "#0f172a" }}>
                {condoActual?.nombre || 'Condominio'}
              </h2>
              <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600" }}>
                {condoActual?.direccion && <>{condoActual.direccion} · </>}
                {totalTorres} torres, {totalApartamentos} aptos
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowCardSelector(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              border: `1px solid ${colorSuper}`,
              backgroundColor: "#ffffff",
              color: colorSuper,
              fontWeight: "700",
              fontSize: "0.8rem",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `rgba(124,58,237,0.08)`
              e.currentTarget.style.boxShadow = `0 2px 8px rgba(124,58,237,0.15)`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff"
              e.currentTarget.style.boxShadow = "none"
            }}
          >
            <FiGrid size={15} />
            Seleccionar otro condominio
          </button>
        </div>
      )}

      {/* --- CARDS GRID visible cuando no hay selección o se presiona 'Seleccionar otro condominio' --- */}
      {(!condominioId || showCardSelector) && (
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                backgroundColor: "rgba(124,58,237,0.1)",
                padding: "0.65rem",
                borderRadius: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <FiGrid size={22} color={colorSuper} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>
                  {condominioId ? 'Condominio seleccionado' : 'Selecciona un condominio'}
                </h2>
                <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>
                  {condoSearch
                    ? `${filteredCondominios.length} de ${condominios.length} condominios`
                    : `${condominios.length} ${condominios.length === 1 ? 'condominio disponible' : 'condominios disponibles'}`
                  }
                </span>
              </div>
            </div>

            <div style={{ width: "260px", maxWidth: "100%", position: "relative" }}>
              <FiSearch size={14} style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Buscar condominio..."
                value={condoSearch}
                onChange={e => setCondoSearch(e.target.value)}
                style={{ ...estiloInput, paddingLeft: "2.2rem", paddingTop: "0.55rem", paddingBottom: "0.55rem", fontSize: "0.85rem" }} />
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1rem"
          }}>
            {filteredCondominios.map((c, idx) => {
              const isSelected = String(c.id) === String(condominioId)
              const [color1, color2] = coloresGradiente[idx % coloresGradiente.length]

              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => { setCondominioId(String(c.id)); setShowCardSelector(false) }}
                  style={{
                    background: isSelected
                      ? `linear-gradient(145deg, #ffffff, ${color1}04)`
                      : '#ffffff',
                    border: isSelected
                      ? `2px solid ${color1}`
                      : '1.5px solid #e8ecf1',
                    borderRadius: '1.25rem',
                    boxShadow: isSelected
                      ? `0 0 0 4px ${color1}15, 0 8px 32px ${color1}20, 0 2px 8px rgba(0,0,0,0.04)`
                      : '0 2px 8px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    display: 'block',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    lineHeight: 'inherit',
                    overflow: 'hidden',
                    padding: 0,
                    position: 'relative',
                    textAlign: 'left',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: isSelected ? 'scale(1.03) translateY(-2px)' : 'scale(1) translateY(0)',
                    width: '100%',
                    opacity: condominioId && !isSelected ? 0.55 : 1,
                    filter: condominioId && !isSelected ? 'grayscale(0.3) saturate(0.7)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && !condominioId) {
                      e.currentTarget.style.transform = 'scale(1.03) translateY(-3px)'
                      e.currentTarget.style.boxShadow = `0 12px 40px ${color1}15, 0 4px 12px rgba(0,0,0,0.06)`
                      e.currentTarget.style.borderColor = color1
                    } else if (!isSelected) {
                      e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)'
                      e.currentTarget.style.boxShadow = `0 8px 25px ${color1}10, 0 4px 10px rgba(0,0,0,0.04)`
                      e.currentTarget.style.borderColor = '#cbd5e1'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'scale(1) translateY(0)'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)'
                      e.currentTarget.style.borderColor = '#e8ecf1'
                    }
                  }}
                >
                  {/* Barra decorativa superior con gradiente */}
                  <div style={{
                    height: '6px',
                    background: `linear-gradient(90deg, ${color1}, ${color2}, ${color1})`,
                    backgroundSize: '200% 100%',
                    borderRadius: '1.25rem 1.25rem 0 0',
                  }} />

                  <div style={{ padding: '1.25rem 1.25rem 1.15rem' }}>
                    {/* Icono con glow */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '1rem',
                      background: `linear-gradient(135deg, ${color1}18, ${color2}08)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.85rem',
                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      border: `1px solid ${color1}22`,
                    }}>
                      <FiHome size={24} color={color1} />
                    </div>

                    {/* Nombre */}
                    <h3 style={{
                      margin: 0,
                      fontSize: '1rem',
                      fontWeight: '800',
                      color: '#0f172a',
                      lineHeight: 1.35,
                      marginBottom: '0.3rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      letterSpacing: '-0.01em',
                    }}>
                      {c.nombre}
                    </h3>

                    {/* Dirección */}
                    {c.direccion && (
                      <p style={{
                        margin: 0,
                        fontSize: '0.72rem',
                        color: '#94a3b8',
                        fontWeight: '500',
                        marginBottom: '0.85rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {c.direccion}
                      </p>
                    )}

                    {/* Separador sutil */}
                    <div style={{
                      height: '1px',
                      background: `linear-gradient(90deg, ${color1}22, transparent)`,
                      marginBottom: '0.75rem',
                    }} />

                    {/* Footer con badges */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      flexWrap: 'wrap',
                    }}>
                      {c.nombreCiudad && (
                        <span style={{
                          fontSize: '0.6rem',
                          fontWeight: '700',
                          color: '#475569',
                          backgroundColor: '#f1f4f9',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          border: '1px solid #e8ecf1',
                        }}>
                          <FiMapPin size={8} color="#94a3b8" /> {c.nombreCiudad}
                        </span>
                      )}
                      <span style={{
                        fontSize: '0.6rem',
                        fontWeight: '700',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                        backgroundColor: c.activo !== false ? '#ecfdf5' : '#fef2f2',
                        color: c.activo !== false ? '#059669' : '#dc2626',
                        border: `1px solid ${c.activo !== false ? '#a7f3d0' : '#fecaca'}`,
                      }}>
                        {c.activo !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    {/* Indicador de seleccionado */}
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${color1}, ${color2})`,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        boxShadow: `0 3px 10px ${color1}40, 0 0 0 4px ${color1}15`,
                      }}>
                        <FiCheck size={15} />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
            {filteredCondominios.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                <p style={{ fontWeight: 600, margin: 0 }}>Ningún condominio coincide con tu búsqueda</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!condominioId ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          <FiFolder size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
          <p>Selecciona un condominio para ver su estructura</p>
        </div>
      ) : structureLoading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>Cargando estructura...</div>
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
              <p>No hay torres registradas</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {structure.torres.map(torre => {
                const isTowerOpen = expandedTowers[torre.id]
                return (
                  <div key={torre.id} style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                    <div onClick={() => toggleTower(torre.id)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", cursor: "pointer", backgroundColor: isTowerOpen ? "rgba(124,58,237,0.03)" : "#fff", borderBottom: isTowerOpen ? "1px solid #f1f5f9" : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <FiHome size={20} color={colorSuper} />
                        <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "#0f172a" }}>{torre.nombre}</span>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600", backgroundColor: "#f1f5f9", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>
                          {torre.pisos?.length || 0} pisos
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedTowerForFloor(torre); setShowAddFloorModal(true) }}
                          style={{ ...btnStyle, backgroundColor: "transparent", color: colorSuper, border: `1px solid ${colorSuper}` }}><FiPlus size={13} /> Piso</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteTower(torre.id) }} disabled={deletingId === torre.id}
                          style={{ ...btnStyle, color: "#ef4444", background: "transparent" }}>{deletingId === torre.id ? '...' : <FiTrash2 size={14} />}</button>
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
                                      <button onClick={(e) => { e.stopPropagation(); setAddAptContext({ nombreTorre: torre.nombre, numeroPiso: piso.numero }); setAptNumero(''); setAptMetraje(''); setAptParking(false); setShowAddAptModal(true) }}
                                        style={{ ...btnStyle, backgroundColor: "transparent", color: colorSuper, border: `1px solid ${colorSuper}` }}><FiPlus size={11} /> Apto</button>
                                      <button onClick={(e) => { e.stopPropagation(); handleDeleteFloor(piso.id) }} disabled={deletingId === piso.id}
                                        style={{ ...btnStyle, color: "#ef4444", background: "transparent" }}>{deletingId === piso.id ? '...' : <FiTrash2 size={12} />}</button>
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
                                                background: "#fff", borderRadius: "0.5rem", border: `1px solid ${ocupado ? "#bbf7d0" : "#fecaca"}`, padding: "0.6rem 0.75rem"
                                              }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                                                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                                    <FiGrid size={13} color={colorSuper} />
                                                    <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0f172a" }}>{apt.numero}</span>
                                                    {apt.metraje && <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{apt.metraje}m²</span>}
                                                  </div>
                                                  <span style={{ fontSize: "0.6rem", fontWeight: "700", padding: "0.1rem 0.4rem", borderRadius: "999px", backgroundColor: ocupado ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: ocupado ? "#10b981" : "#ef4444" }}>
                                                    {ocupado ? 'Ocupado' : 'Disponible'}
                                                  </span>
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", flexWrap: "wrap" }}>
                                                  {apt.derechoEstacionamiento && <span style={{ fontSize: "0.6rem", color: colorSuper, fontWeight: "700", backgroundColor: "rgba(124,58,237,0.08)", padding: "0.05rem 0.35rem", borderRadius: "999px" }}>P</span>}
                                                  {ocupado ? (
                                                    <span style={{ fontSize: "0.65rem", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}
                                                      onClick={() => setAptDetail({ ...apt, torreNombre: torre.nombre, pisoNumero: piso.numero, owner })}>
                                                      <FiUser size={10} /> {owner ? (owner.nombres + ' ' + (owner.apellidos || '')).trim() : 'Ver'}
                                                    </span>
                                                  ) : (
                                                    <span style={{ fontSize: "0.65rem", color: "#94a3b8", fontStyle: "italic" }}>Sin propietario</span>
                                                  )}
                                                  <div style={{ marginLeft: "auto", display: "flex", gap: "0.2rem" }}>
                                                    <button onClick={() => navigate('/superadmin/departamentos?idCondominio=' + condominioId + '&idApartamento=' + apt.id)}
                                                      style={{ ...btnStyle, padding: "0.15rem 0.35rem", color: colorSuper, background: "transparent" }}><FiEdit3 size={10} /></button>
                                                    <button onClick={() => setConfirmDeleteApt(apt)}
                                                      style={{ ...btnStyle, padding: "0.15rem 0.35rem", color: "#ef4444", background: "transparent" }}><FiTrash2 size={10} /></button>
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

          {/* Add Tower */}
          {showAddTowerModal && (
            <div style={modalOverlay} onClick={() => { if (!creatingTower) { setShowAddTowerModal(false); setTowerName('') } }}>
              <div style={modalBox} onClick={e => e.stopPropagation()}>
                <button onClick={() => { setShowAddTowerModal(false); setTowerName('') }} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={20} /></button>
                <h3 style={{ margin: "0 0 1.5rem", fontSize: "1.1rem", fontWeight: "700", color: "#0f172a" }}>Agregar Torre</h3>
                <input type="text" placeholder="Nombre" value={towerName} onChange={e => setTowerName(e.target.value)} style={estiloInput} autoFocus />
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", justifyContent: "flex-end" }}>
                  <button onClick={handleAddTower} disabled={creatingTower} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: colorSuper, color: "#fff", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}>{creatingTower ? 'Creando...' : 'Crear'}</button>
                  <button onClick={() => { setShowAddTowerModal(false); setTowerName('') }} disabled={creatingTower} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}>Cancelar</button>
                </div>
              </div>
            </div>
          )}

          {/* Add Floor */}
          {showAddFloorModal && selectedTowerForFloor && (
            <div style={modalOverlay} onClick={() => { if (!creatingFloor) { setShowAddFloorModal(false); setFloorNumber(''); setSelectedTowerForFloor(null) } }}>
              <div style={modalBox} onClick={e => e.stopPropagation()}>
                <button onClick={() => { setShowAddFloorModal(false); setFloorNumber(''); setSelectedTowerForFloor(null) }} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={20} /></button>
                <h3 style={{ margin: "0 0 0.25rem", fontSize: "1.1rem", fontWeight: "700", color: "#0f172a" }}>Agregar Piso</h3>
                <p style={{ margin: "0 0 1.25rem", fontSize: "0.85rem", color: "#64748b" }}>Torre: <strong>{selectedTowerForFloor.nombre}</strong></p>
                <input type="number" min="1" placeholder="Número" value={floorNumber} onChange={e => setFloorNumber(e.target.value)} style={estiloInput} autoFocus />
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", justifyContent: "flex-end" }}>
                  <button onClick={handleAddFloor} disabled={creatingFloor} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: colorSuper, color: "#fff", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}>{creatingFloor ? 'Creando...' : 'Crear'}</button>
                  <button onClick={() => { setShowAddFloorModal(false); setFloorNumber(''); setSelectedTowerForFloor(null) }} disabled={creatingFloor} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}>Cancelar</button>
                </div>
              </div>
            </div>
          )}

          {/* Add Apartment */}
          {showAddAptModal && (
            <div style={modalOverlay} onClick={() => { if (!creatingApt) { setShowAddAptModal(false); setAddAptContext(null) } }}>
              <div style={modalBox} onClick={e => e.stopPropagation()}>
                <button onClick={() => { setShowAddAptModal(false); setAddAptContext(null) }} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={20} /></button>
                <h3 style={{ margin: "0 0 0.25rem", fontSize: "1.1rem", fontWeight: "700", color: "#0f172a" }}>Agregar Apartamento</h3>
                <p style={{ margin: "0 0 1.25rem", fontSize: "0.85rem", color: "#64748b" }}>
                  Torre: <strong>{addAptContext?.nombreTorre}</strong> &mdash; Piso: <strong>{addAptContext?.numeroPiso}</strong>
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <p style={{ margin: "0 0 1.25rem", color: "#64748b" }}>Número de Departamento: </p>
                  <input type="text" placeholder="Número (ej: 101)" value={aptNumero} onChange={e => setAptNumero(e.target.value)} style={estiloInput} autoFocus />
                  <p style={{ margin: "0 0 1.25rem", color: "#64748b" }}>Medidas de Metraje m²: </p>
                  <input type="number" placeholder="Metraje m² (opcional)" value={aptMetraje} onChange={e => setAptMetraje(e.target.value)} style={estiloInput} />
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#334155", fontWeight: "600", cursor: "pointer" }}>
                    <input type="checkbox" checked={aptParking} onChange={e => setAptParking(e.target.checked)} /> Derecho estacionamiento
                  </label>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", justifyContent: "flex-end" }}>
                  <button onClick={handleAddApt} disabled={creatingApt} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: colorSuper, color: "#fff", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}>{creatingApt ? 'Creando...' : 'Crear'}</button>
                  <button onClick={() => { setShowAddAptModal(false); setAddAptContext(null) }} disabled={creatingApt} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}>Cancelar</button>
                </div>
              </div>
            </div>
          )}

          {/* Confirm Delete Apartment */}
          {confirmDeleteApt && (
            <div style={modalOverlay} onClick={() => setConfirmDeleteApt(null)}>
              <div style={{ ...modalBox, maxWidth: "380px", textAlign: "center" }} onClick={e => e.stopPropagation()}>
                <FiAlertCircle size={40} style={{ color: "#ef4444", marginBottom: "1rem" }} />
                <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", fontWeight: "700", color: "#0f172a" }}>¿Eliminar apartamento?</h3>
                <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "0 0 1.5rem" }}>Apartamento <strong>{confirmDeleteApt.numero}</strong>. Esta acción no se puede deshacer.</p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                  <button onClick={handleDeleteApt} disabled={deletingId === ('apt-' + confirmDeleteApt.id)} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: "#ef4444", color: "#fff", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}>{deletingId === ('apt-' + confirmDeleteApt.id) ? 'Eliminando...' : 'Eliminar'}</button>
                  <button onClick={() => setConfirmDeleteApt(null)} disabled={deletingId === ('apt-' + confirmDeleteApt.id)} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}>Cancelar</button>
                </div>
              </div>
            </div>
          )}

          {/* Apartment Detail */}
          {aptDetail && (
            <div style={modalOverlay} onClick={() => setAptDetail(null)}>
              <div style={{ ...modalBox, maxWidth: "440px" }} onClick={e => e.stopPropagation()}>
                <button onClick={() => setAptDetail(null)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={20} /></button>
                <h3 style={{ margin: "0 0 1.25rem", fontSize: "1.1rem", fontWeight: "700", color: "#0f172a" }}>Apartamento {aptDetail.numero}</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div><span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Torre</span><p style={{ margin: "0.15rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{aptDetail.torreNombre || '-'}</p></div>
                  <div><span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Piso</span><p style={{ margin: "0.15rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{aptDetail.pisoNumero || '-'}</p></div>
                  <div><span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Metraje</span><p style={{ margin: "0.15rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{aptDetail.metraje ? `${aptDetail.metraje} m²` : '-'}</p></div>
                  <div><span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Estado</span><p style={{ margin: "0.15rem 0 0", fontWeight: "600", fontSize: "0.85rem" }}><span style={{ padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.7rem", backgroundColor: aptDetail.idPropietario ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: aptDetail.idPropietario ? "#10b981" : "#ef4444" }}>{aptDetail.idPropietario ? 'Ocupado' : 'Disponible'}</span></p></div>
                </div>
                {aptDetail.idPropietario ? (
                  <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Propietario</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.3rem" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: colorSuper, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: "700" }}><FiUser size={16} /></div>
                      <div>
                        <p style={{ margin: 0, fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{(() => { const o = aptDetail.owner || getOwnerInfo(aptDetail); return o ? (o.nombres + ' ' + (o.apellidos || '')).trim() : 'Propietario'; })()}</p>
                        {(() => { const o = aptDetail.owner || getOwnerInfo(aptDetail); if (!o) return null; const email = o.correo || o.email; const tel = o.telefono; return <span style={{ fontSize: "0.7rem", color: "#64748b" }}>{email && <span>{email}</span>}{email && tel && <span> · </span>}{tel && <span>{tel}</span>}</span>; })()}
                      </div>
                    </div>
                    {Array.isArray(aptDetail.inquilinos) && aptDetail.inquilinos.length > 0 && (
                      <div style={{ marginTop: "1rem", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                        <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Inquilinos ({aptDetail.inquilinos.length})</span>
                        {aptDetail.inquilinos.map((inq, idx) => (
                          <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 0", borderBottom: "1px solid #f8fafc" }}>
                            <FiUsers size={12} color="#64748b" />
                            <span style={{ fontSize: "0.8rem", color: "#0f172a" }}>{inq.nombre || inq.nombres} {inq.apellidos || ''}</span>
                          </div>
                        ))}
                      </div>
                    )}
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