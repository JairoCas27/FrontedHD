import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FiHome, FiUser, FiUsers, FiGrid, FiSearch, FiMail, FiPhone, FiX, FiCheck, FiEye, FiUserPlus, FiAlertTriangle, FiRefreshCw, FiEdit3, FiTrash2, FiPlus, FiChevronDown, FiChevronRight } from "react-icons/fi"
import { toast } from 'react-toastify'
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { getCondominiums, getAdminApartments, assignApartmentOwner, getAllUsers, getAdminAssets, assignAssetApartment, updateApartmentOccupants, createAdminStructureNode, deleteAdminStructureNode, extractItems } from '../../services/api'

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
  const [parkingAssets, setParkingAssets] = useState([])
  const [condoSeleccionado, setCondoSeleccionado] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingApts, setLoadingApts] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [modalAssign, setModalAssign] = useState(null)
  const [assignUserId, setAssignUserId] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [modalDetail, setModalDetail] = useState(null)
  const [modalTenant, setModalTenant] = useState(null)
  const [tenantForm, setTenantForm] = useState({ nombres: '', apellidos: '', tipoDocumento: 'DNI', numeroDocumento: '' })
  const [addingTenant, setAddingTenant] = useState(false)
  const [modalParking, setModalParking] = useState(null)
  const [selectedParkingId, setSelectedParkingId] = useState('')
  const [assigningParking, setAssigningParking] = useState(false)
  const [confirmRemoveTenantIdx, setConfirmRemoveTenantIdx] = useState(null)
  const [tenantDetail, setTenantDetail] = useState(null)
  const [editingTenantIdx, setEditingTenantIdx] = useState(null)
  const [showCreateApt, setShowCreateApt] = useState(false)
  const [createAptForm, setCreateAptForm] = useState({ numero: '', metraje: '', torreNombre: '', pisoNumero: '', derechoEstacionamiento: false })
  const [creatingApt, setCreatingApt] = useState(false)
  const [confirmDeleteApt, setConfirmDeleteApt] = useState(null)
  const [deletingAptId, setDeletingAptId] = useState(null)
  const [highlightedAptId, setHighlightedAptId] = useState(null)
  const [expandedTorres, setExpandedTorres] = useState({})
  const aptRefs = useRef({})
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [showOwnersModal, setShowOwnersModal] = useState(false)

  const toggleTorre = (torre) => {
    setExpandedTorres(prev => ({ ...prev, [torre]: !prev[torre] }))
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getCondominiums().then(d => setCondominios(extractItems(d))).catch(() => {}),
      getAllUsers().then(d => setAllUsers(extractItems(d))).catch(() => {})
    ]).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const idCondo = searchParams.get('idCondominio')
    const idApt = searchParams.get('idApartamento')
    if (idCondo) {
      setCondoSeleccionado(idCondo)
    }
    if (idApt) {
      setHighlightedAptId(Number(idApt))
    }
  }, [searchParams])

  useEffect(() => {
    if (!condoSeleccionado) {
      setApartments([])
      setParkingAssets([])
      return
    }
    setLoadingApts(true)
    Promise.all([
      getAdminApartments(condoSeleccionado)
        .then(d => setApartments(extractItems(d)))
        .catch(() => setApartments([])),
      getAdminAssets(condoSeleccionado, 'ESTACIONAMIENTO', 0, 200)
        .then(d => setParkingAssets(extractItems(d)))
        .catch(() => setParkingAssets([])),
    ]).finally(() => setLoadingApts(false))
  }, [condoSeleccionado])

  useEffect(() => {
    if (highlightedAptId && apartments.length > 0) {
      const apt = apartments.find(a => Number(a.id) === Number(highlightedAptId))
      if (apt && apt.torreNombre) {
        setExpandedTorres(prev => ({ ...prev, [apt.torreNombre]: true }))
        setTimeout(() => {
          const el = aptRefs.current[highlightedAptId]
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 300)
      }
    }
  }, [apartments, highlightedAptId])

  const condoActual = condominios.find(c => String(c.id) === String(condoSeleccionado))

  const torres = useMemo(() => {
    const set = new Set(apartments.map(a => a.torreNombre).filter(Boolean))
    return [...set].sort()
  }, [apartments])

  const pisos = useMemo(() => {
    const set = new Set(apartments.map(a => a.pisoNumero).filter(Boolean))
    return [...set].sort((a, b) => Number(a) - Number(b))
  }, [apartments])

  const filteredApts = useMemo(() => {
    let list = apartments
    const q = busqueda.toLowerCase().trim()
    if (q) {
      list = list.filter(a => {
        const nro = String(a.numero || '').toLowerCase()
        const torre = (a.torreNombre || '').toLowerCase()
        const piso = (a.pisoNumero || '').toLowerCase()
        const prop = (a.nombrePropietario || '').toLowerCase()
        return nro.includes(q) || torre.includes(q) || piso.includes(q) || prop.includes(q)
      })
    }
    return list
  }, [apartments, busqueda])

  const totalApts = apartments.length
  const occupiedApts = apartments.filter(a => a.idPropietario != null)
  const unoccupiedApts = apartments.filter(a => a.idPropietario == null)

  const propietariosDisponibles = allUsers.filter(u => {
    const mismoCondo = String(u.idCondominio || u.condominioId || '') === String(condoSeleccionado)
    return mismoCondo && u.rol === 'PROPIETARIO'
  })

  function getContacto(apt) {
    if (!apt.idPropietario) return null
    return allUsers.find(u => String(u.id) === String(apt.idPropietario)) || null
  }

  function openDetail(apt) {
    setModalDetail(apt)
  }

  function getAssignedParking(apt) {
    return parkingAssets.find(p => String(p.idApartamento) === String(apt.id))
  }

  async function handleAssignOwner() {
    if (!assignUserId) {
      toast.warning('Selecciona un propietario')
      return
    }
    setAssigning(true)
    try {
      await assignApartmentOwner(modalAssign.id, assignUserId, condoSeleccionado)
      toast.success('Propietario asignado correctamente')
      const assignedUser = allUsers.find(u => String(u.id) === String(assignUserId))
      const nombreCompleto = assignedUser ? `${assignedUser.nombres || ''} ${assignedUser.apellidos || ''}`.trim() : ''
      setApartments(prev => prev.map(a =>
        String(a.id) === String(modalAssign.id)
          ? { ...a, idPropietario: Number(assignUserId), nombrePropietario: nombreCompleto }
          : a
      ))
      if (modalDetail && String(modalDetail.id) === String(modalAssign.id)) {
        setModalDetail(prev => ({ ...prev, idPropietario: Number(assignUserId), nombrePropietario: nombreCompleto }))
      }
      setModalAssign(null)
      setAssignUserId('')
    } catch (err) {
      toast.error(`Error al asignar: ${err.message}`)
    } finally {
      setAssigning(false)
    }
  }

  async function handleCreateApt() {
    if (!createAptForm.numero.trim()) { toast.warning('Ingresa el número del departamento'); return }
    if (!createAptForm.torreNombre) { toast.warning('Selecciona una torre'); return }
    if (!createAptForm.pisoNumero) { toast.warning('Selecciona un piso'); return }
    setCreatingApt(true)
    try {
        await createAdminStructureNode({
          tipo: 'APARTAMENTO',
          nombreTorre: createAptForm.torreNombre,
          numeroPiso: Number(createAptForm.pisoNumero),
          numeroApartamento: Number(createAptForm.numero.trim()),
          metraje: createAptForm.metraje ? Number(createAptForm.metraje) : 50.0,
        }, condoSeleccionado)
      toast.success('Departamento creado correctamente')
      setShowCreateApt(false)
      setCreateAptForm({ numero: '', metraje: '', torreNombre: '', pisoNumero: '', derechoEstacionamiento: false })
      const data = await getAdminApartments(condoSeleccionado)
      setApartments(extractItems(data))
    } catch (err) {
      toast.error(`Error al crear: ${err.message}`)
    } finally {
      setCreatingApt(false)
    }
  }

  async function handleDeleteApt() {
    if (!confirmDeleteApt) return
    setDeletingAptId(confirmDeleteApt.id)
    try {
      await deleteAdminStructureNode(confirmDeleteApt.id, 'APARTAMENTO', condoSeleccionado)
      toast.success('Departamento eliminado')
      setConfirmDeleteApt(null)
      const data = await getAdminApartments(condoSeleccionado)
      setApartments(extractItems(data))
    } catch (err) {
      toast.error(`Error al eliminar: ${err.message}`)
    } finally {
      setDeletingAptId(null)
    }
  }

  async function handleAddTenant() {
    if (!tenantForm.nombres.trim()) {
      toast.warning('El nombre del inquilino es obligatorio')
      return
    }
    setAddingTenant(true)
    try {
      const currentTenants = Array.isArray(modalTenant.inquilinos) ? modalTenant.inquilinos : []
      const tenantData = {
        nombres: tenantForm.nombres.trim(),
        apellidos: tenantForm.apellidos.trim(),
        tipoDocumento: tenantForm.tipoDocumento.trim() || 'DNI',
        numeroDocumento: tenantForm.numeroDocumento.trim() || '00000000',
      }
      let updatedTenants
      if (editingTenantIdx !== null) {
        updatedTenants = currentTenants.map((t, i) => i === editingTenantIdx ? tenantData : t)
      } else {
        updatedTenants = [...currentTenants, tenantData]
      }
      await updateApartmentOccupants(modalTenant.id, { inquilinos: updatedTenants }, condoSeleccionado)
      toast.success(editingTenantIdx !== null ? 'Inquilino actualizado correctamente' : 'Inquilino agregado correctamente')
      setApartments(prev => prev.map(a =>
        String(a.id) === String(modalTenant.id)
          ? { ...a, inquilinos: updatedTenants }
          : a
      ))
      if (modalDetail && String(modalDetail.id) === String(modalTenant.id)) {
        setModalDetail(prev => ({ ...prev, inquilinos: updatedTenants }))
      }
      setModalTenant(null)
      setTenantForm({ nombres: '', apellidos: '', tipoDocumento: 'DNI', numeroDocumento: '' })
      setEditingTenantIdx(null)
    } catch (err) {
      toast.error(`Error al ${editingTenantIdx !== null ? 'actualizar' : 'agregar'} inquilino: ${err.message}`)
    } finally {
      setAddingTenant(false)
    }
  }

  async function handleRemoveTenant(idx) {
    setConfirmRemoveTenantIdx(null)
    try {
      const currentTenants = Array.isArray(modalDetail.inquilinos) ? modalDetail.inquilinos : []
      const updatedTenants = currentTenants.filter((_, i) => i !== idx)
      await updateApartmentOccupants(modalDetail.id, { inquilinos: updatedTenants }, condoSeleccionado)
      toast.success('Inquilino eliminado')
      setApartments(prev => prev.map(a =>
        String(a.id) === String(modalDetail.id)
          ? { ...a, inquilinos: updatedTenants }
          : a
      ))
      setModalDetail(prev => ({ ...prev, inquilinos: updatedTenants }))
    } catch (err) {
      toast.error(`Error al eliminar inquilino: ${err.message}`)
    }
  }

  async function handleAssignParking() {
    if (!selectedParkingId) {
      toast.warning('Selecciona un estacionamiento')
      return
    }
    setAssigningParking(true)
    try {
      await assignAssetApartment(selectedParkingId, modalParking.id, condoSeleccionado)
      toast.success('Estacionamiento asignado correctamente')
      setParkingAssets(prev => prev.map(p =>
        String(p.id) === String(selectedParkingId)
          ? { ...p, idApartamento: modalParking.id }
          : p
      ))
      if (modalDetail && String(modalDetail.id) === String(modalParking.id)) {
        setModalDetail(prev => ({ ...prev }))
      }
      setModalParking(null)
      setSelectedParkingId('')
    } catch (err) {
      toast.error(`Error al asignar estacionamiento: ${err.message}`)
    } finally {
      setAssigningParking(false)
    }
  }

  const parkingDisponibles = parkingAssets.filter(p =>
    String(p.idApartamento) !== String(modalParking?.id) && p.disponible === true
  )

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
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "#1e293b" }}>
                  Departamentos de {condoActual?.nombre} <span style={{ color: "#94a3b8", fontWeight: "600" }}>({filteredApts.length})</span>
                </span>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                <button onClick={() => setShowCreateApt(true)}
                  style={{ backgroundColor: colorSuper, color: "#ffffff", border: "none", padding: "0.4rem 0.85rem", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <FiPlus size={14} /> Nuevo Depto
                </button>
                {condoSeleccionado && (
                  <button onClick={() => setShowOwnersModal(true)}
                    style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981", border: "none", padding: "0.4rem 0.85rem", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <FiUser size={14} /> Ver propietarios
                  </button>
                )}
                {condoSeleccionado && (
                  <button onClick={() => navigate('/superadmin/usuarios?tab=propietarios')}
                    style={{ backgroundColor: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "none", padding: "0.4rem 0.85rem", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <FiUserPlus size={14} /> Agregar propietario
                  </button>
                )}
                <div className="global-search-wrap" style={{ width: "220px", maxWidth: "220px", position: "relative" }}>
                  <FiSearch size={14} style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input type="text" placeholder="Buscar departamento..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                    style={{ ...estiloInput, paddingLeft: "2rem", paddingTop: "0.45rem", paddingBottom: "0.45rem", fontSize: "0.8rem" }} />
                </div>
              </div>
            </div>
          </div>
            {filteredApts.length === 0 ? (
              <div style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8", fontStyle: "italic", fontWeight: "600" }}>
                No se encontraron coincidencias.
              </div>
            ) : (
              <div>
                {(() => {
                  const agrupadas = {}
                  filteredApts.forEach(a => {
                    const t = a.torreNombre || 'Sin torre'
                    if (!agrupadas[t]) agrupadas[t] = {}
                    const p = a.pisoNumero || '0'
                    if (!agrupadas[t][p]) agrupadas[t][p] = []
                    agrupadas[t][p].push(a)
                  })
                  const torresOrdenadas = Object.keys(agrupadas).sort()
                  return torresOrdenadas.map(torre => {
                    const pisosOrdenados = Object.keys(agrupadas[torre]).sort((a, b) => Number(a) - Number(b))
                    const totalTorre = Object.values(agrupadas[torre]).flat().length
                    const occupedTorre = Object.values(agrupadas[torre]).flat().filter(a => a.idPropietario != null).length
                    const expanded = expandedTorres[torre] === true
                    return (
                      <div key={torre}>
                        <div onClick={() => toggleTorre(torre)}
                          style={{ padding: "0.6rem 1.25rem", backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", borderTop: "1px solid #e2e8f0", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.6rem", userSelect: "none" }}>
                          {expanded ? <FiChevronDown size={15} color={colorSuper} /> : <FiChevronRight size={15} color="#94a3b8" />}
                          <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "#0f172a", textTransform: "uppercase" }}>{torre}</span>
                          <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600 }}>{totalTorre} deptos</span>
                          <span style={{ fontSize: "0.65rem", color: "#10b981", fontWeight: 700 }}>{occupedTorre} ocupados</span>
                          <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>·</span>
                          <span style={{ fontSize: "0.65rem", color: "#ef4444", fontWeight: 700 }}>{totalTorre - occupedTorre} libres</span>
                        </div>
                        {expanded && (
                          <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                              <thead>
                                <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                                  <th style={{ padding: "0.5rem 1rem" }}>N° Depto</th>
                                  <th style={{ padding: "0.5rem" }}>Piso</th>
                                  <th style={{ padding: "0.5rem" }}>Propietario</th>
                                  <th style={{ padding: "0.5rem" }}>Contacto</th>
                                  <th style={{ padding: "0.5rem" }}>Inquilinos</th>
                                  <th style={{ padding: "0.5rem" }}>Estacionamiento</th>
                                  <th style={{ padding: "0.5rem" }}>Estado</th>
                                  <th style={{ padding: "0.5rem 1rem", textAlign: "right" }}>Acción</th>
                                </tr>
                              </thead>
                              <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                                {pisosOrdenados.map(piso => {
                                  const aptsPiso = agrupadas[torre][piso]
                                  return (
                                    <React.Fragment key={piso}>
                                      <tr style={{ backgroundColor: "#fafafa" }}>
                                        <td colSpan={8} style={{ padding: "0.3rem 1rem", fontWeight: 700, color: "#64748b", fontSize: "0.7rem", textTransform: "uppercase", borderBottom: "1px solid #f1f5f9" }}>
                                          <FiHome size={11} style={{ marginRight: "0.3rem", verticalAlign: "middle" }} /> Piso {piso} ({aptsPiso.length} deptos)
                                        </td>
                                      </tr>
                                      {aptsPiso.map((apt, i) => {
                                        const contacto = getContacto(apt)
                                        const tienePropietario = apt.idPropietario != null
                                        const parking = getAssignedParking(apt)
                                        const isHighlighted = Number(apt.id) === Number(highlightedAptId)
                                        return (
                                          <tr key={apt.id} ref={el => { aptRefs.current[apt.id] = el }}
                                            style={{
                                              borderBottom: "1px solid #f1f5f9",
                                              backgroundColor: isHighlighted ? "rgba(124,58,237,0.08)" : (i % 2 === 0 ? "#ffffff" : "#fafafa"),
                                              transition: "background-color 0.5s",
                                              outline: isHighlighted ? `2px solid ${colorSuper}` : 'none',
                                              outlineOffset: '-1px'
                                            }}>
                                            <td style={{ padding: "0.5rem 1rem", fontWeight: "700", color: "#0f172a" }}>{apt.numero}</td>
                                            <td style={{ padding: "0.5rem", color: "#64748b" }}>{apt.pisoNumero || '—'}</td>
                                            <td style={{ padding: "0.5rem" }}>
                                              {tienePropietario ? (
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: colorSuper, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.5rem", fontWeight: "700", flexShrink: 0 }}>
                                                    {(apt.nombrePropietario || '??').split(' ').map(s => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()}
                                                  </div>
                                                  <span style={{ fontWeight: "600", fontSize: "0.78rem", color: "#0f172a" }}>{apt.nombrePropietario}</span>
                                                </div>
                                              ) : (
                                                <span style={{ fontStyle: "italic", color: "#cbd5e1", fontSize: "0.78rem", fontWeight: "600" }}>Sin asignar</span>
                                              )}
                                            </td>
                                            <td style={{ padding: "0.5rem", fontSize: "0.72rem", color: "#64748b" }}>
                                              {contacto ? (
                                                <>
                                                  {contacto.email && <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginBottom: "0.1rem" }}><FiMail size={10} /> {contacto.email}</div>}
                                                  {contacto.telefono && <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><FiPhone size={10} /> {contacto.telefono}</div>}
                                                  {!contacto.email && !contacto.telefono && <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>—</span>}
                                                </>
                                              ) : <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>—</span>}
                                            </td>
                                            <td style={{ padding: "0.5rem" }}>
                                              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#64748b", fontWeight: "600", fontSize: "0.78rem" }}>
                                                <FiUsers size={12} />
                                                <span>{Array.isArray(apt.inquilinos) ? apt.inquilinos.length : 0}</span>
                                              </div>
                                            </td>
                                            <td style={{ padding: "0.5rem", fontSize: "0.78rem", color: "#64748b" }}>
                                              {parking ? (
                                                <span style={{ fontWeight: "600", color: "#0f172a", fontSize: "0.75rem" }}>N° {parking.numero}</span>
                                              ) : (
                                                <span style={{ fontStyle: "italic", color: "#cbd5e1", fontSize: "0.72rem" }}>No asignado</span>
                                              )}
                                            </td>
                                            <td style={{ padding: "0.5rem" }}>
                                              <span style={{
                                                fontSize: "0.6rem", fontWeight: "700", padding: "0.15rem 0.45rem", borderRadius: "0.3rem",
                                                backgroundColor: tienePropietario ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                                                color: tienePropietario ? "#10b981" : "#ef4444",
                                                whiteSpace: "nowrap"
                                              }}>
                                                {tienePropietario ? 'Ocupado' : 'Disponible'}
                                              </span>
                                            </td>
                                            <td style={{ padding: "0.5rem 1rem", whiteSpace: "nowrap", textAlign: "right" }}>
                                              <button style={{ ...btnStyle, backgroundColor: colorSuper, color: "#fff", padding: "0.3rem 0.6rem", fontSize: "0.7rem" }}
                                                onClick={() => openDetail(apt)}>
                                                <FiEye size={12} /> Detalle
                                              </button>
                                              <button onClick={() => setConfirmDeleteApt(apt)}
                                                style={{ ...btnStyle, backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "0.3rem 0.5rem", fontSize: "0.7rem", marginLeft: "0.3rem" }}>
                                                <FiTrash2 size={12} />
                                              </button>
                                            </td>
                                          </tr>
                                        )
                                      })}
                                    </React.Fragment>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )
                  })
                })()}
              </div>
            )}
          </div>
        </>
      )}

      {/* Detail Modal */}
      {modalDetail && (
        <div style={modalOverlay} onClick={() => setModalDetail(null)}>
          <div style={{ ...modalContent, maxWidth: "640px" }} onClick={(e) => e.stopPropagation()}>
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
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
              </div>

              {/* Owner Section */}
              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Propietario</span>
                  <button onClick={() => { setModalAssign(modalDetail); setAssignUserId(modalDetail.idPropietario ? String(modalDetail.idPropietario) : '') }}
                    style={{ ...btnStyle, backgroundColor: "rgba(124,58,237,0.1)", color: colorSuper, fontSize: "0.7rem" }}>
                    <FiEdit3 size={12} /> {modalDetail.idPropietario ? 'Cambiar' : 'Asignar'}
                  </button>
                </div>
                {modalDetail.idPropietario ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginTop: "0.2rem" }}>
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
                  <p style={{ margin: "0.2rem 0 0", fontStyle: "italic", color: "#94a3b8", fontSize: "0.9rem" }}>Sin propietario asignado</p>
                )}
              </div>

              {/* Parking Section */}
              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Estacionamiento</span>
                  <button onClick={() => { setModalParking(modalDetail); setSelectedParkingId('') }}
                    style={{ ...btnStyle, backgroundColor: "rgba(124,58,237,0.1)", color: colorSuper, fontSize: "0.7rem" }}>
                    <FiEdit3 size={12} /> Asignar
                  </button>
                </div>
                {(() => {
                  const parking = getAssignedParking(modalDetail)
                  return parking ? (
                    <p style={{ margin: "0.2rem 0 0", fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>
                      N° {parking.numero}
                    </p>
                  ) : (
                    <p style={{ margin: "0.2rem 0 0", fontStyle: "italic", color: "#94a3b8", fontSize: "0.9rem" }}>Sin estacionamiento asignado</p>
                  )
                })()}
              </div>

              {/* Tenants Section */}
              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>
                    Inquilinos ({Array.isArray(modalDetail.inquilinos) ? modalDetail.inquilinos.length : 0})
                  </span>
                  <button onClick={() => { setModalTenant(modalDetail); setTenantForm({ nombres: '', apellidos: '', tipoDocumento: 'DNI', numeroDocumento: '' }) }}
                    style={{ ...btnStyle, backgroundColor: "rgba(124,58,237,0.1)", color: colorSuper, fontSize: "0.7rem" }}>
                    <FiPlus size={12} /> Agregar
                  </button>
                </div>
                {Array.isArray(modalDetail.inquilinos) && modalDetail.inquilinos.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {modalDetail.inquilinos.map((inq, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.5rem 0.75rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#e2e8f0", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: "700", flexShrink: 0 }}>
                          <FiUsers size={14} />
                        </div>
                        <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setTenantDetail(inq)}>
                          <span style={{ fontWeight: "600", fontSize: "0.85rem", color: "#0f172a" }}>{inq.nombre || inq.nombres || 'Inquilino'} {inq.apellidos || ''}</span>
                          <span style={{ display: "block", fontSize: "0.7rem", color: "#64748b" }}>
                            {inq.tipoDocumento && inq.numeroDocumento ? `${inq.tipoDocumento}: ${inq.numeroDocumento}` : ''}
                          </span>
                        </div>
                        <button onClick={() => { setEditingTenantIdx(idx); setTenantForm({ nombres: inq.nombres || inq.nombre || '', apellidos: inq.apellidos || '', tipoDocumento: inq.tipoDocumento || 'DNI', numeroDocumento: inq.numeroDocumento || '' }); setModalTenant(modalDetail) }}
                          style={{ background: "none", border: "none", cursor: "pointer", color: colorSuper, padding: "0.25rem", display: "flex" }}
                          title="Editar inquilino">
                          <FiEdit3 size={14} />
                        </button>
                        <button onClick={() => setConfirmRemoveTenantIdx(idx)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "0.25rem", display: "flex" }}
                          title="Eliminar inquilino">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: "0.2rem 0 0", fontStyle: "italic", color: "#94a3b8", fontSize: "0.85rem" }}>No hay inquilinos registrados</p>
                )}
              </div>
              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem", marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => setConfirmDeleteApt(modalDetail)}
                  style={{ ...btnStyle, backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: "0.75rem" }}>
                  <FiTrash2 size={14} /> Eliminar departamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Owner Modal */}
      {modalAssign && (
        <div style={modalOverlay} onClick={() => setModalAssign(null)}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.1rem" }}>{modalAssign.idPropietario ? 'Cambiar Propietario' : 'Asignar Propietario'}</h3>
              <button onClick={() => setModalAssign(null)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}>
                <FiX size={20} />
              </button>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <p style={{ margin: "0 0 1rem", fontSize: "0.85rem", color: "#475569" }}>
                Departamento <strong>{modalAssign.numero}</strong>
                {modalAssign.torreNombre && <> &mdash; Torre <strong>{modalAssign.torreNombre}</strong></>}
              </p>
              <label style={{ fontWeight: "700", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.5rem", display: "block" }}>Seleccionar propietario</label>
              <select style={estiloInput} value={assignUserId} onChange={(e) => setAssignUserId(e.target.value)}>
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
                <button onClick={handleAssignOwner} disabled={assigning || !assignUserId}
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

      {/* Add Tenant Modal */}
      {modalTenant && (
        <div style={modalOverlay} onClick={() => setModalTenant(null)}>
          <div style={{ ...modalContent, maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.1rem" }}>{editingTenantIdx !== null ? 'Editar Inquilino' : 'Agregar Inquilino'}</h3>
              <button onClick={() => { setModalTenant(null); setEditingTenantIdx(null); setTenantForm({ nombres: '', apellidos: '', tipoDocumento: 'DNI', numeroDocumento: '' }) }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}>
                <FiX size={20} />
              </button>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <p style={{ margin: "0 0 1rem", fontSize: "0.85rem", color: "#475569" }}>
                Departamento <strong>{modalTenant.numero}</strong>
                {modalTenant.torreNombre && <> &mdash; Torre <strong>{modalTenant.torreNombre}</strong></>}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Nombres *</label>
                  <input type="text" value={tenantForm.nombres} onChange={(e) => setTenantForm({ ...tenantForm, nombres: e.target.value })}
                    style={estiloInput} placeholder="Nombres del inquilino" />
                </div>
                <div>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Apellidos</label>
                  <input type="text" value={tenantForm.apellidos} onChange={(e) => setTenantForm({ ...tenantForm, apellidos: e.target.value })}
                    style={estiloInput} placeholder="Apellidos del inquilino" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.5rem" }}>
                  <div>
                    <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Tipo Doc. *</label>
                    <select value={tenantForm.tipoDocumento} onChange={(e) => setTenantForm({ ...tenantForm, tipoDocumento: e.target.value })}
                      style={estiloInput}>
                      <option value="DNI">DNI</option>
                      <option value="CE">CE</option>
                      <option value="RUC">RUC</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>N° Documento *</label>
                    <input type="text" value={tenantForm.numeroDocumento} onChange={(e) => setTenantForm({ ...tenantForm, numeroDocumento: e.target.value })}
                      style={estiloInput} placeholder="Número de documento" />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
<button onClick={() => { setModalTenant(null); setEditingTenantIdx(null); setTenantForm({ nombres: '', apellidos: '', tipoDocumento: 'DNI', numeroDocumento: '' }) }}
                  style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>
                  Cancelar
                </button>
                <button onClick={handleAddTenant} disabled={addingTenant || !tenantForm.nombres.trim()}
                  style={{
                    padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none",
                    backgroundColor: tenantForm.nombres.trim() ? colorSuper : "#cbd5e1", color: "#fff",
                    fontWeight: "600", cursor: tenantForm.nombres.trim() ? "pointer" : "not-allowed", fontSize: "0.85rem",
                    display: "flex", alignItems: "center", gap: "0.4rem"
                  }}>
                  {addingTenant ? 'Guardando...' : <><FiCheck size={16} /> {editingTenantIdx !== null ? 'Guardar' : 'Agregar'}</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Parking Modal */}
      {modalParking && (
        <div style={modalOverlay} onClick={() => setModalParking(null)}>
          <div style={{ ...modalContent, maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.1rem" }}>Asignar Estacionamiento</h3>
              <button onClick={() => setModalParking(null)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}>
                <FiX size={20} />
              </button>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <p style={{ margin: "0 0 1rem", fontSize: "0.85rem", color: "#475569" }}>
                Departamento <strong>{modalParking.numero}</strong>
                {modalParking.torreNombre && <> &mdash; Torre <strong>{modalParking.torreNombre}</strong></>}
              </p>
              <label style={{ fontWeight: "700", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.5rem", display: "block" }}>
                Estacionamientos disponibles
              </label>
              <select style={estiloInput} value={selectedParkingId} onChange={(e) => setSelectedParkingId(e.target.value)}>
                <option value="">-- Seleccionar --</option>
                {parkingDisponibles.map(p => (
                  <option key={p.id} value={p.id}>
                    N° {p.numero}{p.tipoVehiculo ? ` (${p.tipoVehiculo})` : ''}
                  </option>
                ))}
              </select>
              {parkingDisponibles.length === 0 && (
                <p style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "#ef4444", fontWeight: "600" }}>
                  No hay estacionamientos disponibles en este condominio.
                </p>
              )}
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button onClick={() => setModalParking(null)}
                  style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>
                  Cancelar
                </button>
                <button onClick={handleAssignParking} disabled={assigningParking || !selectedParkingId}
                  style={{
                    padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none",
                    backgroundColor: selectedParkingId ? colorSuper : "#cbd5e1", color: "#fff",
                    fontWeight: "600", cursor: selectedParkingId ? "pointer" : "not-allowed", fontSize: "0.85rem",
                    display: "flex", alignItems: "center", gap: "0.4rem"
                  }}>
                  {assigningParking ? 'Asignando...' : <><FiCheck size={16} /> Asignar</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tenantDetail && (
        <div style={modalOverlay} onClick={() => setTenantDetail(null)}>
          <div style={{ ...modalContent, maxWidth: "420px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.1rem" }}>Detalle del Inquilino</h3>
              <button onClick={() => setTenantDetail(null)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}>
                <FiX size={20} />
              </button>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Nombres</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{tenantDetail.nombres || tenantDetail.nombre || '-'}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Apellidos</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{tenantDetail.apellidos || '-'}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Tipo Documento</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{tenantDetail.tipoDocumento || '-'}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>N° Documento</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{tenantDetail.numeroDocumento || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmRemoveTenantIdx !== null && (
        <div style={modalOverlay} onClick={() => setConfirmRemoveTenantIdx(null)}>
          <div style={{ ...modalContent, maxWidth: "400px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "1.5rem", textAlign: "center" }}>
              <FiAlertTriangle size={40} style={{ color: "#ef4444", marginBottom: "1rem" }} />
              <h3 style={{ margin: "0 0 0.5rem", fontWeight: "800", color: "#0f172a", fontSize: "1.1rem" }}>¿Eliminar inquilino?</h3>
              <p style={{ color: "#64748b", fontSize: "0.85rem" }}>Esta acción no se puede deshacer.</p>
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <button onClick={() => setConfirmRemoveTenantIdx(null)}
                  style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>
                  Cancelar
                </button>
                <button onClick={() => handleRemoveTenant(confirmRemoveTenantIdx)}
                  style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: "#ef4444", color: "#fff", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Apartment Modal */}
      {showCreateApt && (
        <div style={modalOverlay} onClick={() => { if (!creatingApt) { setShowCreateApt(false); setCreateAptForm({ numero: '', metraje: '', torreNombre: '', pisoNumero: '', derechoEstacionamiento: false }) }}}>
          <div style={{ ...modalContent, maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.1rem" }}>Nuevo Departamento</h3>
              <button onClick={() => { setShowCreateApt(false); setCreateAptForm({ numero: '', metraje: '', torreNombre: '', pisoNumero: '', derechoEstacionamiento: false }) }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={20} /></button>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <p style={{ margin: "0 0 1rem", fontSize: "0.85rem", color: "#475569" }}>
                Condominio: <strong>{condoActual?.nombre}</strong>
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Torre *</label>
                  <select style={estiloInput} value={createAptForm.torreNombre} onChange={(e) => setCreateAptForm(f => ({ ...f, torreNombre: e.target.value, pisoNumero: '' }))}>
                    <option value="">Seleccionar torre</option>
                    {torres.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Piso *</label>
                  <select style={estiloInput} value={createAptForm.pisoNumero} onChange={(e) => setCreateAptForm(f => ({ ...f, pisoNumero: e.target.value }))} disabled={!createAptForm.torreNombre}>
                    <option value="">Seleccionar piso</option>
                    {createAptForm.torreNombre && pisos.map(p => <option key={p} value={p}>Piso {p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Número *</label>
                  <input type="text" style={estiloInput} placeholder="Ej: 101" value={createAptForm.numero} onChange={(e) => setCreateAptForm(f => ({ ...f, numero: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Metraje m²</label>
                  <input type="number" min="0" style={estiloInput} placeholder="Opcional" value={createAptForm.metraje} onChange={(e) => setCreateAptForm(f => ({ ...f, metraje: e.target.value }))} />
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#334155", fontWeight: "600", cursor: "pointer" }}>
                  <input type="checkbox" checked={createAptForm.derechoEstacionamiento} onChange={(e) => setCreateAptForm(f => ({ ...f, derechoEstacionamiento: e.target.checked }))} /> Derecho estacionamiento
                </label>
              </div>
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button onClick={() => { setShowCreateApt(false); setCreateAptForm({ numero: '', metraje: '', torreNombre: '', pisoNumero: '', derechoEstacionamiento: false }) }}
                  style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>Cancelar</button>
                <button onClick={handleCreateApt} disabled={creatingApt || !createAptForm.numero.trim() || !createAptForm.torreNombre || !createAptForm.pisoNumero}
                  style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: (creatingApt || !createAptForm.numero.trim() || !createAptForm.torreNombre || !createAptForm.pisoNumero) ? "#cbd5e1" : colorSuper, color: "#fff", fontWeight: "600", cursor: (creatingApt || !createAptForm.numero.trim() || !createAptForm.torreNombre || !createAptForm.pisoNumero) ? "not-allowed" : "pointer", fontSize: "0.85rem" }}>
                  {creatingApt ? 'Creando...' : 'Crear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Propietarios Modal */}
      {showOwnersModal && (
        <div style={modalOverlay} onClick={() => setShowOwnersModal(false)}>
          <div style={{ ...modalContent, maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.05rem" }}>
                Propietarios de {condominios.find(c => c.id === Number(condoSeleccionado))?.nombre || ''}
              </h3>
              <button onClick={() => setShowOwnersModal(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}>
                <FiX size={20} />
              </button>
            </div>
            <div style={{ padding: "1.5rem", maxHeight: "60vh", overflowY: "auto" }}>
              {(() => {
                const owners = allUsers.filter(u => u.rol === 'PROPIETARIO' && u.idCondominio === Number(condoSeleccionado))
                if (owners.length === 0) {
                  return (
                    <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8", fontStyle: "italic", fontWeight: "600" }}>
                      No hay propietarios registrados en este condominio.
                    </div>
                  )
                }
                return owners.map((o, i) => (
                  <div key={o.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0", borderBottom: i < owners.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: colorSuper, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: "700", flexShrink: 0 }}>
                      {((o.nombres || '??').charAt(0) + (o.apellidos || '').charAt(0)).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{o.nombres} {o.apellidos}</div>
                      <div style={{ fontSize: "0.78rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.15rem" }}>
                        <FiMail size={12} /> {o.correo}
                        {o.telefono && <><FiPhone size={12} /> {o.telefono}</>}
                      </div>
                    </div>
                    <span style={{ fontSize: "0.65rem", fontWeight: "700", padding: "0.2rem 0.55rem", borderRadius: "0.375rem", backgroundColor: o.activo ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: o.activo ? "#10b981" : "#ef4444", whiteSpace: "nowrap" }}>
                      {o.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                ))
              })()}
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setShowOwnersModal(false)} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Department */}
      {confirmDeleteApt && (
        <div style={modalOverlay} onClick={() => setConfirmDeleteApt(null)}>
          <div style={{ ...modalContent, maxWidth: "400px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "1.5rem", textAlign: "center" }}>
              <FiTrash2 size={40} color="#ef4444" style={{ marginBottom: "0.75rem" }} />
              <h3 style={{ margin: "0 0 0.5rem", fontWeight: "800", color: "#0f172a", fontSize: "1.1rem" }}>Eliminar Departamento</h3>
              <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
                ¿Eliminar el departamento <strong>{confirmDeleteApt.numero}</strong>? Esta acción no se puede deshacer.
              </p>
              <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <button onClick={() => setConfirmDeleteApt(null)}
                  style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>Cancelar</button>
                <button onClick={handleDeleteApt} disabled={deletingAptId === confirmDeleteApt.id}
                  style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: "#ef4444", color: "#fff", fontWeight: "600", cursor: deletingAptId === confirmDeleteApt.id ? "not-allowed" : "pointer", fontSize: "0.85rem" }}>
                  {deletingAptId === confirmDeleteApt.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
