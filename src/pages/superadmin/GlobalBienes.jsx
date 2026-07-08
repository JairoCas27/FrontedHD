import React, { useState, useEffect, useCallback } from 'react'
import { FiPackage, FiHome, FiMapPin, FiTruck, FiPlus, FiX, FiInfo, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { getCondominiums, getAdminAssets, createAdminAsset, updateAdminAssetStatus, assignAssetApartment, getAdminApartments } from '../../services/api'

const colorSuper = "rgb(124,58,237)"

const globalResponsive = `
@media (max-width: 767px) {
  .global-card-padding { padding: 1rem !important; }
}
.toggle-switch {
  position: relative; width: 44px; height: 24px; cursor: pointer; display: inline-block;
}
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-slider {
  position: absolute; inset: 0; border-radius: 24px; transition: 0.3s;
}
.toggle-slider::before {
  content: ''; position: absolute; width: 18px; height: 18px; border-radius: 50%;
  top: 3px; left: 3px; transition: 0.3s; background: #fff;
}
.toggle-switch input:checked + .toggle-slider::before { transform: translateX(20px); }
`

const estiloInput = {
  width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem",
  border: "1px solid #cbd5e1", fontSize: "0.9rem", color: "#334155",
  backgroundColor: "#ffffff", boxSizing: "border-box", outline: "none"
}

const estiloLabel = {
  display: "block", fontSize: "0.75rem", fontWeight: "700",
  color: "#475569", marginBottom: "0.4rem",
  textTransform: "uppercase", letterSpacing: "0.025em"
}

const tdCenter = { padding: "1rem" }
const tdRight = { padding: "1rem 1.5rem", textAlign: "right" }

const btnAction = (bg, color) => ({
  padding: "0.3rem 0.55rem", border: "none", borderRadius: "0.4rem", fontSize: "0.7rem",
  fontWeight: "700", cursor: "pointer", backgroundColor: bg, color
})

const modalOverlay = {
  position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.3)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
  backdropFilter: "blur(4px)"
}

const modalBox = {
  backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%",
  maxWidth: "500px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.08)",
  border: "1px solid #e2e8f0", overflow: "hidden", maxHeight: "90vh", overflowY: "auto"
}

const selectEstilo = {
  ...estiloInput,
  appearance: "none",
  backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b'%3E%3Cpath d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.75rem center",
  paddingRight: "2rem"
}

export default function GlobalBienes() {
  const [condominios, setCondominios] = useState([])
  const [condoSeleccionado, setCondoSeleccionado] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingData, setLoadingData] = useState(false)
  const [estacionamientos, setEstacionamientos] = useState([])
  const [carritos, setCarritos] = useState([])
  const [apartamentos, setApartamentos] = useState([])
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' })
  const [showModal, setShowModal] = useState(null)
  const [codigoForm, setCodigoForm] = useState('')
  const [numeroForm, setNumeroForm] = useState('')
  const [editItem, setEditItem] = useState(null)
  const [detailItem, setDetailItem] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ visible: true, mensaje, tipo })
    setTimeout(() => setToast({ visible: false, mensaje: '', tipo: 'success' }), 3000)
  }

  useEffect(() => {
    getCondominiums().then(d => setCondominios(d?.items || d || [])).catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const cargarActivos = useCallback(async (condominioId) => {
    if (!condominioId) return
    setLoadingData(true)
    try {
      const [parkingRes, cartRes, aptRes] = await Promise.all([
        getAdminAssets(condominioId, 'ESTACIONAMIENTO'),
        getAdminAssets(condominioId, 'CARRITO'),
        getAdminApartments(condominioId).catch(() => ({ items: [] }))
      ])
      setEstacionamientos(parkingRes?.items || [])
      setCarritos(cartRes?.items || [])
      setApartamentos(aptRes?.items || [])
    } catch (err) {
      mostrarToast('Error al cargar activos: ' + err.message, 'error')
    } finally {
      setLoadingData(false)
    }
  }, [])

  useEffect(() => {
    cargarActivos(condoSeleccionado)
  }, [condoSeleccionado, cargarActivos])

  const condoActual = condominios.find(c => String(c.id) === String(condoSeleccionado))

  const totalParking = estacionamientos.length
  const parkingDisponible = estacionamientos.filter(e => e.disponible).length
  const parkingOcupado = totalParking - parkingDisponible
  const totalCarts = carritos.length
  const cartsDisponible = carritos.filter(c => c.disponible).length

  const handleCreateAsset = async (e) => {
    e.preventDefault()
    try {
      const tipo = showModal
      const payload = tipo === 'ESTACIONAMIENTO'
        ? { tipo, codigo: codigoForm || null, numero: Number(numeroForm) }
        : { tipo, codigo: codigoForm, numero: numeroForm ? Number(numeroForm) : null }
      await createAdminAsset(payload, condoSeleccionado)
      mostrarToast(`${tipo === 'ESTACIONAMIENTO' ? 'Estacionamiento' : 'Carrito'} registrado con éxito`)
      setShowModal(null)
      setCodigoForm('')
      setNumeroForm('')
      cargarActivos(condoSeleccionado)
    } catch (err) {
      mostrarToast('Error al crear activo: ' + err.message, 'error')
    }
  }

  const handleToggleCarrito = async (item) => {
    try {
      await updateAdminAssetStatus(item.id, { tipo: 'CARRITO', estado: item.disponible ? 'EN_USO' : 'DISPONIBLE' }, condoSeleccionado)
      mostrarToast(item.disponible ? 'En Préstamo' : 'Disponible', 'info')
      cargarActivos(condoSeleccionado)
    } catch (err) {
      mostrarToast('Error al actualizar estado: ' + err.message, 'error')
    }
  }

  const openEdit = (item) => {
    setEditForm({
      tipoVehiculo: item.tipoVehiculo || '',
      capacidadMaxima: item.capacidadMaxima ?? '',
      idApartamento: item.idApartamento || ''
    })
    setEditItem(item)
  }

  const handleEditSave = async (e) => {
    e.preventDefault()
    if (!editItem) return
    setSaving(true)
    try {
      await updateAdminAssetStatus(editItem.id, {
        tipo: 'ESTACIONAMIENTO',
        tipoVehiculo: editForm.tipoVehiculo || null,
        capacidadMaxima: editForm.capacidadMaxima ? Number(editForm.capacidadMaxima) : null
      }, condoSeleccionado)
      if (editForm.idApartamento && String(editForm.idApartamento) !== String(editItem.idApartamento)) {
        try {
          await assignAssetApartment(editItem.id, Number(editForm.idApartamento), condoSeleccionado)
        } catch { }
      }
      mostrarToast('Estacionamiento actualizado con éxito')
      setEditItem(null)
      cargarActivos(condoSeleccionado)
    } catch (err) {
      mostrarToast('Error al actualizar: ' + err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    setConfirmDelete(null)
    try {
      const params = new URLSearchParams()
      if (condoSeleccionado) params.append('condominioId', condoSeleccionado)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/assets/${item.id}?${params.toString()}`, {
        method: 'DELETE', credentials: 'include', headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.message || data?.error || `Error ${response.status}`)
      mostrarToast(`${item.tipo === 'CARRITO' ? 'Carrito' : 'Estacionamiento'} eliminado con éxito`)
      cargarActivos(condoSeleccionado)
    } catch (err) {
      mostrarToast('Error al eliminar: ' + err.message, 'error')
    }
  }

  const openDetail = (item) => setDetailItem(item)

  const getAptLabel = (id) => {
    if (!id) return null
    const apt = apartamentos.find(a => String(a.id) === String(id))
    return apt ? `N° ${apt.numero}${apt.torreNombre ? ` - ${apt.torreNombre}` : ''}${apt.pisoNumero ? ` P${apt.pisoNumero}` : ''}` : `#${id}`
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#64748b", fontWeight: "600", textAlign: "center" }}>
        Sincronizando.
      </div>
    )
  }

  return (
    <div className="global-card-padding" style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left", position: "relative" }}>
      <style>{globalResponsive}</style>

      {toast.visible && (
        <div style={{
          position: "fixed", top: "2rem", right: "2rem", zIndex: 200,
          backgroundColor: toast.tipo === 'success' ? "#10b981" : toast.tipo === 'info' ? "#3b82f6" : "#ef4444",
          color: "#ffffff", padding: "1rem 1.5rem", borderRadius: "0.75rem", fontWeight: "700", fontSize: "0.9rem",
          display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
        }}>
          <FiInfo size={18} /> {toast.mensaje}
        </div>
      )}

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
      ) : loadingData ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#64748b", fontWeight: "600" }}>
          Cargando...
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
                    <span style={{ fontSize: "1.25rem", fontWeight: "800", color: colorSuper }}>{totalParking}</span>
                    <span style={{ display: "block", fontSize: "0.65rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.025em", marginTop: "0.2rem" }}>Estacionamientos</span>
                  </div>
                  <div style={{ flex: 1, backgroundColor: "#f8fafc", borderRadius: "0.5rem", padding: "0.75rem", textAlign: "center" }}>
                    <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "#64748b" }}>{totalCarts}</span>
                    <span style={{ display: "block", fontSize: "0.65rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.025em", marginTop: "0.2rem" }}>Carritos</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <h4 style={{ margin: "0 0 1rem", fontSize: "0.85rem", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.025em" }}>Resumen Estacionamientos</h4>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1, backgroundColor: "rgba(16,185,129,0.08)", borderRadius: "0.5rem", padding: "0.75rem", textAlign: "center" }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "#10b981" }}>{parkingDisponible}</span>
                  <span style={{ display: "block", fontSize: "0.65rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.025em", marginTop: "0.2rem" }}>Disponibles</span>
                </div>
                <div style={{ flex: 1, backgroundColor: "rgba(239,68,68,0.08)", borderRadius: "0.5rem", padding: "0.75rem", textAlign: "center" }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "#ef4444" }}>{parkingOcupado}</span>
                  <span style={{ display: "block", fontSize: "0.65rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.025em", marginTop: "0.2rem" }}>Ocupados</span>
                </div>
              </div>
            </div>

            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <h4 style={{ margin: "0 0 1rem", fontSize: "0.85rem", fontWeight: "800", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.025em" }}>Resumen Carritos</h4>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1, backgroundColor: "rgba(16,185,129,0.08)", borderRadius: "0.5rem", padding: "0.75rem", textAlign: "center" }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "#10b981" }}>{cartsDisponible}</span>
                  <span style={{ display: "block", fontSize: "0.65rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.025em", marginTop: "0.2rem" }}>Disponibles</span>
                </div>
                <div style={{ flex: 1, backgroundColor: "rgba(245,158,11,0.08)", borderRadius: "0.5rem", padding: "0.75rem", textAlign: "center" }}>
                  <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "#f59e0b" }}>{totalCarts - cartsDisponible}</span>
                  <span style={{ display: "block", fontSize: "0.65rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.025em", marginTop: "0.2rem" }}>En Préstamo</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", width: "100%", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiHome size={18} color={colorSuper} />
                  <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "800", color: "#0f172a" }}>Estacionamientos</h3>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>({totalParking})</span>
                </div>
                <button
                  onClick={() => { setShowModal('ESTACIONAMIENTO'); setCodigoForm(''); setNumeroForm('') }}
                  style={{ backgroundColor: colorSuper, color: "#ffffff", border: "none", padding: "0.45rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <FiPlus size={14} /> Nuevo Estacionamiento
                </button>
              </div>
              <div style={{ overflowX: "auto", width: "100%" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ padding: "1rem 1.5rem" }}>Código</th>
                      <th style={{ padding: "1rem" }}>Tipo Vehículo</th>
                      <th style={{ padding: "1rem" }}>Capacidad</th>
                      <th style={{ padding: "1rem" }}>Ocupación</th>
                      <th style={{ padding: "1rem" }}>Estado</th>
                      <th style={{ padding: "1rem" }}>Apartamento</th>
                      <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                    {estacionamientos.map((est) => (
                      <tr key={est.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <span style={{ fontWeight: "700", color: "#0f172a" }}>N° {est.numero}</span>
                          {est.codigo && <span style={{ display: "block", fontSize: "0.7rem", color: "#94a3b8", fontFamily: "monospace" }}>{est.codigo}</span>}
                        </td>
                        <td style={tdCenter}>
                          {est.tipoVehiculo ? (
                            <span style={{
                              fontSize: "0.72rem", fontWeight: "700", padding: "0.25rem 0.6rem", borderRadius: "0.4rem",
                              backgroundColor: est.tipoVehiculo === 'AUTO' ? "rgba(124,58,237,0.1)" : "rgba(139,92,246,0.1)",
                              color: est.tipoVehiculo === 'AUTO' ? colorSuper : "#8b5cf6"
                            }}>{est.tipoVehiculo}</span>
                          ) : (
                            <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontStyle: "italic" }}>Sin asignar</span>
                          )}
                        </td>
                        <td style={{ padding: "1rem", fontWeight: "600", color: "#64748b" }}>{est.capacidadMaxima ?? '—'}</td>
                        <td style={{ padding: "1rem", fontWeight: "600", color: "#64748b" }}>{est.cantidadActual ?? 0} / {est.capacidadMaxima ?? '—'}</td>
                        <td style={tdCenter}>
                          <span style={{
                            backgroundColor: est.disponible ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                            color: est.disponible ? "#10b981" : "#ef4444",
                            padding: "0.25rem 0.6rem", borderRadius: "0.4rem", fontSize: "0.72rem", fontWeight: "700", display: "inline-block"
                          }}>
                            {est.disponible ? 'Disponible' : 'Ocupado'}
                          </span>
                        </td>
                        <td style={{ padding: "1rem", fontSize: "0.8rem", color: "#64748b" }}>{getAptLabel(est.idApartamento) || '—'}</td>
                        <td style={tdRight}>
                          <div style={{ display: "flex", gap: "0.35rem", justifyContent: "flex-end" }}>
                            <button onClick={() => openDetail(est)} style={btnAction("rgba(59,130,246,0.1)", "#3b82f6")} title="Ver detalles"><FiEye size={13} /></button>
                            <button onClick={() => openEdit(est)} style={btnAction("rgba(124,58,237,0.1)", colorSuper)} title="Editar"><FiEdit2 size={13} /></button>
                            <button onClick={() => setConfirmDelete(est)} style={btnAction("rgba(239,68,68,0.1)", "#ef4444")} title="Eliminar"><FiTrash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {estacionamientos.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>No hay estacionamientos registrados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", width: "100%", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiTruck size={18} color={colorSuper} />
                  <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "800", color: "#0f172a" }}>Carritos</h3>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>({totalCarts})</span>
                </div>
                <button
                  onClick={() => { setShowModal('CARRITO'); setCodigoForm(''); setNumeroForm('') }}
                  style={{ backgroundColor: colorSuper, color: "#ffffff", border: "none", padding: "0.45rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <FiPlus size={14} /> Nuevo Carrito
                </button>
              </div>
              <div style={{ overflowX: "auto", width: "100%" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ padding: "1rem 1.5rem" }}>Código</th>
                      <th style={{ padding: "1rem" }}>Número</th>
                      <th style={{ padding: "1rem" }}>Estado</th>
                      <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                    {carritos.map((car) => (
                      <tr key={car.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "1rem 1.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", backgroundColor: "rgba(124,58,237,0.08)", color: colorSuper, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <FiTruck size={16} />
                            </div>
                            <span style={{ fontWeight: "700", color: "#0f172a", fontFamily: "monospace" }}>{car.codigo || '—'}</span>
                          </div>
                        </td>
                        <td style={{ padding: "1rem", fontWeight: "600", color: "#64748b" }}>{car.numero ? `N° ${car.numero}` : '—'}</td>
                        <td style={{ padding: "1rem" }}>
                          <label className="toggle-switch">
                            <input type="checkbox" checked={!car.disponible} onChange={() => handleToggleCarrito(car)} />
                            <span className="toggle-slider" style={{ backgroundColor: car.disponible ? "#10b981" : "#f59e0b" }}></span>
                          </label>
                          <span style={{ fontSize: "0.7rem", fontWeight: "600", marginLeft: "0.4rem", color: car.disponible ? "#10b981" : "#f59e0b" }}>
                            {car.disponible ? 'Disponible' : 'Préstamo'}
                          </span>
                        </td>
                        <td style={tdRight}>
                          <div style={{ display: "flex", gap: "0.35rem", justifyContent: "flex-end" }}>
                            <button onClick={() => openDetail(car)} style={btnAction("rgba(59,130,246,0.1)", "#3b82f6")} title="Ver detalles"><FiEye size={13} /></button>
                            <button onClick={() => setConfirmDelete(car)} style={btnAction("rgba(239,68,68,0.1)", "#ef4444")} title="Eliminar"><FiTrash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {carritos.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>No hay carritos registrados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: "#1e293b" }}>
                {showModal === 'ESTACIONAMIENTO' ? "Nuevo Estacionamiento" : "Nuevo Carrito"}
              </h3>
              <button onClick={() => setShowModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>

            <form onSubmit={handleCreateAsset}>
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={estiloLabel}>Código</label>
                  <input type="text" style={estiloInput} placeholder="Ej: EST-001" value={codigoForm} onChange={(e) => setCodigoForm(e.target.value)} required />
                </div>
                <div>
                  <label style={estiloLabel}>Número</label>
                  <input type="number" min="1" style={estiloInput} placeholder="Ej: 15" value={numeroForm} onChange={(e) => setNumeroForm(e.target.value)} />
                </div>
              </div>

              <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
                <button type="button" onClick={() => setShowModal(null)} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Cancelar</button>
                <button type="submit" style={{ backgroundColor: colorSuper, border: "none", color: "#ffffff", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editItem && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: "#1e293b" }}>Editar Estacionamiento N° {editItem.numero}</h3>
              <button onClick={() => setEditItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>

            <form onSubmit={handleEditSave}>
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={estiloLabel}>Tipo de Vehículo</label>
                  <select style={selectEstilo} value={editForm.tipoVehiculo} onChange={(e) => setEditForm(f => ({ ...f, tipoVehiculo: e.target.value }))}>
                    <option value="">Sin asignar</option>
                    <option value="AUTO">Auto</option>
                    <option value="MOTO">Moto</option>
                  </select>
                </div>
                <div>
                  <label style={estiloLabel}>Capacidad Máxima</label>
                  <input type="number" min="0" style={estiloInput} placeholder="Ej: 2" value={editForm.capacidadMaxima} onChange={(e) => setEditForm(f => ({ ...f, capacidadMaxima: e.target.value }))} />
                </div>
                <div>
                  <label style={estiloLabel}>Apartamento Asignado</label>
                  <select style={selectEstilo} value={editForm.idApartamento} onChange={(e) => setEditForm(f => ({ ...f, idApartamento: e.target.value }))}>
                    <option value="">Sin asignar</option>
                    {apartamentos.map(a => (
                      <option key={a.id} value={a.id}>
                        N° {a.numero}{a.torreNombre ? ` - ${a.torreNombre}` : ''}{a.pisoNumero ? ` (Piso ${a.pisoNumero})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
                <button type="button" onClick={() => setEditItem(null)} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Cancelar</button>
                <button type="submit" disabled={saving} style={{ backgroundColor: colorSuper, border: "none", color: "#ffffff", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailItem && (
        <div style={modalOverlay}>
          <div style={{ ...modalBox, maxWidth: "480px" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: "#1e293b" }}>Detalles {detailItem.tipo === 'CARRITO' ? 'Carrito' : 'Estacionamiento'}</h3>
              <button onClick={() => setDetailItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {[
                ['Número', `N° ${detailItem.numero}`],
                ['Código', detailItem.codigo || '—'],
                ...(detailItem.tipo === 'CARRITO' ? [] : [
                  ['Tipo Vehículo', detailItem.tipoVehiculo || 'Sin asignar'],
                  ['Capacidad Máxima', detailItem.capacidadMaxima ?? '—'],
                  ['Ocupación Actual', detailItem.cantidadActual ?? 0],
                ]),
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.5rem" }}>
                  <span style={{ fontWeight: "600", color: "#64748b", fontSize: "0.8rem" }}>{label}</span>
                  <span style={{ fontWeight: "700", color: "#0f172a" }}>{value}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.5rem" }}>
                <span style={{ fontWeight: "600", color: "#64748b", fontSize: "0.8rem" }}>Estado</span>
                <span style={{
                  backgroundColor: detailItem.disponible ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                  color: detailItem.disponible ? "#10b981" : "#ef4444",
                  padding: "0.25rem 0.6rem", borderRadius: "0.4rem", fontSize: "0.72rem", fontWeight: "700", display: "inline-block"
                }}>
                  {detailItem.disponible ? 'Disponible' : detailItem.tipo === 'CARRITO' ? 'En Préstamo' : 'Ocupado'}
                </span>
              </div>
              {detailItem.idApartamento && (
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.5rem" }}>
                  <span style={{ fontWeight: "600", color: "#64748b", fontSize: "0.8rem" }}>Apartamento</span>
                  <span style={{ fontWeight: "600", color: "#0f172a" }}>{getAptLabel(detailItem.idApartamento)}</span>
                </div>
              )}
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", backgroundColor: "#f8fafc" }}>
              <button onClick={() => setDetailItem(null)} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={modalOverlay}>
          <div style={{ ...modalBox, maxWidth: "400px" }}>
            <div style={{ padding: "1.5rem", textAlign: "center" }}>
              <FiTrash2 size={36} color="#ef4444" style={{ marginBottom: "0.75rem" }} />
              <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.05rem", fontWeight: "800", color: "#1e293b" }}>Confirmar Eliminación</h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                ¿Estás seguro de eliminar {confirmDelete.tipo === 'CARRITO' ? 'el carrito' : 'el estacionamiento'} <strong>{confirmDelete.codigo || `N° ${confirmDelete.numero}`}</strong>?
              </p>
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
              <button onClick={() => setConfirmDelete(null)} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Cancelar</button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ backgroundColor: "#ef4444", border: "none", color: "#ffffff", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}