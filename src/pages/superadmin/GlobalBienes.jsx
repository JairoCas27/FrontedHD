import React, { useState, useEffect, useCallback } from 'react'
import { FiPackage, FiRefreshCw, FiX, FiTool, FiAlertTriangle, FiInfo, FiTruck, FiChevronLeft, FiChevronRight, FiSearch, FiSettings, FiPlayCircle, FiCheckCircle } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import BadgeEstado from '../../components/BadgeEstado'
import { getCondominiums, getAdminAssets, createAdminAsset, updateAdminAssetStatus } from '../../services/api'

const colorSuper = "rgb(124,58,237)"

export default function GlobalBienes() {
  const [condominios, setCondominios] = useState([])
  const [condoSeleccionado, setCondoSeleccionado] = useState('')

  const [tabActiva, setTabActiva] = useState('ESTACIONAMIENTO')
  const [estacionamientos, setEstacionamientos] = useState([])
  const [carritos, setCarritos] = useState([])
  const [loadingEst, setLoadingEst] = useState(false)
  const [loadingCar, setLoadingCar] = useState(false)
  const [errorCondo, setErrorCondo] = useState('')

  const [paginaEst, setPaginaEst] = useState(0)
  const [paginaCar, setPaginaCar] = useState(0)
  const [totalPagEst, setTotalPagEst] = useState(0)
  const [totalPagCar, setTotalPagCar] = useState(0)
  const [totalEst, setTotalEst] = useState(0)
  const [totalCar, setTotalCar] = useState(0)

  const [showModal, setShowModal] = useState(false)
  const [numeroForm, setNumeroForm] = useState('')
  const [codigoForm, setCodigoForm] = useState('')
  const [filtroVehiculo, setFiltroVehiculo] = useState('TODOS')
  const [busquedaCarrito, setBusquedaCarrito] = useState('')
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' })
  const [confirmModal, setConfirmModal] = useState({ visible: false, id: null, etiqueta: '', estadoDestino: '' })
  const [showModalConfig, setShowModalConfig] = useState(false)
  const [estConfig, setEstConfig] = useState(null)
  const [tipoVehiculoForm, setTipoVehiculoForm] = useState('')
  const [capacidadForm, setCapacidadForm] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    getCondominiums().then(data => {
      setCondominios(data?.items || data || [])
    }).catch(() => {})
  }, [])

  const cargarEst = useCallback(async (pagina = 0) => {
    if (!condoSeleccionado) return
    setLoadingEst(true)
    setErrorCondo('')
    try {
      const data = await getAdminAssets(`?type=ESTACIONAMIENTO&page=${pagina}&size=10`)
      setEstacionamientos(data?.items || [])
      setTotalPagEst(data?.totalPaginas || 0)
      setTotalEst(data?.total || 0)
      setPaginaEst(data?.pagina || 0)
    } catch (err) {
      setErrorCondo(err.message || 'Error al cargar estacionamientos.')
      setEstacionamientos([])
    } finally {
      setLoadingEst(false)
    }
  }, [condoSeleccionado])

  const cargarCar = useCallback(async (pagina = 0) => {
    if (!condoSeleccionado) return
    setLoadingCar(true)
    try {
      const data = await getAdminAssets(`?type=CARRITO&page=${pagina}&size=10`)
      setCarritos(data?.items || [])
      setTotalPagCar(data?.totalPaginas || 0)
      setTotalCar(data?.total || 0)
      setPaginaCar(data?.pagina || 0)
    } catch (err) {
      setCarritos([])
    } finally {
      setLoadingCar(false)
    }
  }, [condoSeleccionado])

  useEffect(() => { cargarEst(0); cargarCar(0) }, [cargarEst, cargarCar])

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ visible: true, mensaje, tipo })
    setTimeout(() => setToast({ visible: false, mensaje: '', tipo: 'success' }), 3000)
  }

  const handleSaveAsset = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      if (tabActiva === 'ESTACIONAMIENTO') {
        if (!numeroForm) return
        await createAdminAsset({ tipo: "ESTACIONAMIENTO", numero: Number(numeroForm) })
        mostrarToast("¡Estacionamiento registrado!")
      } else {
        if (!codigoForm.trim()) return
        await createAdminAsset({ tipo: "CARRITO", codigo: codigoForm.trim() })
        mostrarToast("¡Carrito registrado!")
      }
      setShowModal(false)
      setNumeroForm('')
      setCodigoForm('')
      await cargarEst(paginaEst)
      await cargarCar(paginaCar)
    } catch (error) {
      mostrarToast("Error al crear: " + (error.message || ''), "error")
    } finally {
      setGuardando(false)
    }
  }

  const ejecutarCambioEstadoCarrito = async () => {
    try {
      await updateAdminAssetStatus(confirmModal.id, { tipo: "CARRITO", estado: confirmModal.estadoDestino })
      setConfirmModal({ visible: false })
      mostrarToast("Estado actualizado", "info")
      await cargarCar(paginaCar)
    } catch (error) {
      mostrarToast("Error al actualizar estado", "error")
    }
  }

  const guardarConfigEstacionamiento = async (e) => {
    e.preventDefault()
    try {
      await updateAdminAssetStatus(estConfig.id, { tipo: "ESTACIONAMIENTO", tipoVehiculo: tipoVehiculoForm || null, capacidadMaxima: capacidadForm ? Number(capacidadForm) : null })
      setShowModalConfig(false)
      mostrarToast("Configuración actualizada")
      await cargarEst(paginaEst)
    } catch (error) {
      mostrarToast("Error al configurar", "error")
    }
  }

  const reiniciarConfigEstacionamiento = async () => {
    try {
      await updateAdminAssetStatus(estConfig.id, { tipo: "ESTACIONAMIENTO", tipoVehiculo: null, capacidadMaxima: null })
      setShowModalConfig(false)
      mostrarToast("Configuración reiniciada")
      await cargarEst(paginaEst)
    } catch (error) {
      mostrarToast("Error al reiniciar", "error")
    }
  }

  const estacionamientosFiltrados = estacionamientos.filter(est => {
    if (filtroVehiculo === 'TODOS') return true
    if (filtroVehiculo === 'SIN_ASIGNAR') return !est.tipoVehiculo
    return est.tipoVehiculo === filtroVehiculo
  })

  const carritosFiltrados = carritos.filter(car => {
    const termino = busquedaCarrito.toLowerCase().trim()
    if (!termino) return true
    return (car.codigo || '').toLowerCase().includes(termino) || String(car.id).includes(termino)
  })

  const estiloInput = {
    width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem",
    border: "1px solid #cbd5e1", fontSize: "0.9rem", color: "#334155",
    backgroundColor: "#ffffff", boxSizing: "border-box", outline: "none"
  }
  const estiloLabel = {
    display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#475569",
    marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.025em"
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left", position: "relative" }}>
      {toast.visible && (
        <div style={{ position: "fixed", top: "2rem", right: "2rem", zIndex: 200, backgroundColor: toast.tipo === 'success' ? "#10b981" : toast.tipo === 'info' ? "#3b82f6" : "#ef4444", color: "#ffffff", padding: "1rem 1.5rem", borderRadius: "0.75rem", fontWeight: "700", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
          <FiInfo size={18} /> {toast.mensaje}
        </div>
      )}

      <EncabezadoTabla titulo="Bienes y Activos Global" subtitulo="Inventariado global de estacionamientos y carritos de todos los condominios"
        botonTexto={condoSeleccionado ? (tabActiva === 'ESTACIONAMIENTO' ? "Registrar Estacionamiento" : "Registrar Carrito") : undefined}
        accentColor={colorSuper} onBotonClick={() => setShowModal(true)} />

      <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
        <div style={{ width: "280px" }}>
          <select style={estiloInput} value={condoSeleccionado} onChange={(e) => { setCondoSeleccionado(e.target.value); setPaginaEst(0); setPaginaCar(0) }}>
            <option value="">Seleccionar condominio</option>
            {condominios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      </div>

      {errorCondo && (
        <div style={{ padding: "1rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "0.75rem", color: "#dc2626", marginBottom: "1rem", fontWeight: "600", textAlign: "center" }}>
          {errorCondo}
        </div>
      )}

      {!condoSeleccionado ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          <FiPackage size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
          <p>Selecciona un condominio para gestionar sus bienes</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", backgroundColor: "#ffffff", padding: "0.4rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", width: "fit-content" }}>
            <button onClick={() => setTabActiva('ESTACIONAMIENTO')}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.1rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem", backgroundColor: tabActiva === 'ESTACIONAMIENTO' ? colorSuper : "transparent", color: tabActiva === 'ESTACIONAMIENTO' ? "#ffffff" : "#64748b" }}>
              <FiPackage size={15} /> Estacionamientos ({totalEst})
            </button>
            <button onClick={() => setTabActiva('CARRITO')}
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.1rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem", backgroundColor: tabActiva === 'CARRITO' ? colorSuper : "transparent", color: tabActiva === 'CARRITO' ? "#ffffff" : "#64748b" }}>
              <FiTruck size={15} /> Carritos ({totalCar})
            </button>
          </div>

          {tabActiva === 'ESTACIONAMIENTO' ? (
            <>
              <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", marginRight: "0.25rem" }}>Filtrar:</span>
                  {[{ key: 'TODOS', label: 'Todos' }, { key: 'AUTO', label: 'Auto' }, { key: 'MOTO', label: 'Moto' }, { key: 'SIN_ASIGNAR', label: 'Sin Asignar' }].map(op => (
                    <button key={op.key} onClick={() => setFiltroVehiculo(op.key)}
                      style={{ padding: "0.4rem 0.9rem", borderRadius: "0.5rem", border: "1px solid", borderColor: filtroVehiculo === op.key ? colorSuper : "#e2e8f0", backgroundColor: filtroVehiculo === op.key ? "rgba(124,58,237,0.08)" : "#ffffff", color: filtroVehiculo === op.key ? colorSuper : "#64748b", fontWeight: "700", fontSize: "0.78rem", cursor: "pointer" }}>
                      {op.label}
                    </button>
                  ))}
                  <small style={{ marginLeft: "auto", color: "#64748b", fontWeight: "600" }}>{estacionamientosFiltrados.length} de {estacionamientos.length}</small>
                </div>
              </div>
              {loadingEst ? (
                <div style={{ textAlign: "center", padding: "4rem", color: "#64748b", fontWeight: "600" }}>Sincronizando.</div>
              ) : (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", width: "100%", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                          <th style={{ padding: "1rem 1.5rem" }}>ID</th>
                          <th style={{ padding: "1rem" }}>Número</th>
                          <th style={{ padding: "1rem" }}>Tipo Vehículo</th>
                          <th style={{ padding: "1rem" }}>Ocupación</th>
                          <th style={{ padding: "1rem" }}>Disponibilidad</th>
                          <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Acción</th>
                        </tr>
                      </thead>
                      <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                        {estacionamientosFiltrados.map(est => (
                          <tr key={est.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "1rem 1.5rem", fontFamily: "monospace", fontWeight: "700", color: "#94a3b8" }}>#{est.id}</td>
                            <td style={{ padding: "1rem", fontWeight: "700", color: "#0f172a" }}>N° {est.numero}</td>
                            <td style={{ padding: "1rem" }}>
                              {est.tipoVehiculo ? (
                                <span style={{ fontSize: "0.72rem", fontWeight: "700", padding: "0.25rem 0.6rem", borderRadius: "0.4rem", backgroundColor: est.tipoVehiculo === 'AUTO' ? "rgba(124,58,237,0.1)" : "rgba(139,92,246,0.1)", color: est.tipoVehiculo === 'AUTO' ? colorSuper : "#8b5cf6" }}>
                                  {est.tipoVehiculo}
                                </span>
                              ) : (
                                <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontStyle: "italic" }}>Sin asignar</span>
                              )}
                            </td>
                            <td style={{ padding: "1rem", color: "#64748b", fontWeight: "600" }}>{est.cantidadActual ?? 0} / {est.capacidadMaxima ?? '—'}</td>
                            <td style={{ padding: "1rem" }}><BadgeEstado estado={est.disponible ? 'Disponible' : 'Mantenimiento'} /></td>
                            <td style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "flex-end" }}>
                              <button onClick={() => { setEstConfig(est); setTipoVehiculoForm(est.tipoVehiculo || ''); setCapacidadForm(est.capacidadMaxima || ''); setShowModalConfig(true) }}
                                style={{ padding: "0.35rem 0.65rem", border: "1px solid #cbd5e1", backgroundColor: "transparent", color: "#64748b", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                <FiSettings size={12} /> Configurar
                              </button>
                            </td>
                          </tr>
                        ))}
                        {estacionamientosFiltrados.length === 0 && (
                          <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>No hay estacionamientos.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem", padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9" }}>
                    <button onClick={() => cargarEst(paginaEst - 1)} disabled={paginaEst <= 0}
                      style={{ padding: "0.4rem", border: "1px solid #cbd5e1", background: "#fff", borderRadius: "0.5rem", cursor: paginaEst <= 0 ? "not-allowed" : "pointer", opacity: paginaEst <= 0 ? 0.5 : 1, display: "flex" }}>
                      <FiChevronLeft size={16} />
                    </button>
                    <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#64748b" }}>Página {paginaEst + 1} de {totalPagEst || 1}</span>
                    <button onClick={() => cargarEst(paginaEst + 1)} disabled={paginaEst + 1 >= totalPagEst}
                      style={{ padding: "0.4rem", border: "1px solid #cbd5e1", background: "#fff", borderRadius: "0.5rem", cursor: paginaEst + 1 >= totalPagEst ? "not-allowed" : "pointer", opacity: paginaEst + 1 >= totalPagEst ? 0.5 : 1, display: "flex" }}>
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{ flex: 1, maxWidth: "360px", position: "relative" }}>
                    <FiSearch size={15} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input type="text" style={{ ...estiloInput, paddingLeft: "2.2rem" }} placeholder="Buscar por código o ID" value={busquedaCarrito} onChange={(e) => setBusquedaCarrito(e.target.value)} />
                  </div>
                  <small style={{ color: "#64748b", fontWeight: "600" }}>{carritosFiltrados.length} de {carritos.length}</small>
                </div>
              </div>
              {loadingCar ? (
                <div style={{ textAlign: "center", padding: "4rem", color: "#64748b", fontWeight: "600" }}>Sincronizando.</div>
              ) : (
                <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", width: "100%", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                          <th style={{ padding: "1rem 1.5rem" }}>ID</th>
                          <th style={{ padding: "1rem" }}>Código</th>
                          <th style={{ padding: "1rem" }}>Estado</th>
                          <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Acción</th>
                        </tr>
                      </thead>
                      <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                        {carritosFiltrados.map(car => (
                          <tr key={car.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "1rem 1.5rem", fontFamily: "monospace", fontWeight: "700", color: "#94a3b8" }}>#{car.id}</td>
                            <td style={{ padding: "1rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", backgroundColor: "rgba(124,58,237,0.08)", color: colorSuper, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <FiTruck size={16} />
                                </div>
                                <span style={{ fontWeight: "700", color: "#0f172a" }}>{car.codigo}</span>
                              </div>
                            </td>
                            <td style={{ padding: "1rem" }}>
                              <BadgeEstado estado={car.estado === 'DISPONIBLE' ? 'Disponible' : car.estado === 'EN_USO' ? 'En Uso' : 'Mantenimiento'} />
                            </td>
                            <td style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                              {car.estado === 'DISPONIBLE' && (
                                <>
                                  <button onClick={() => setConfirmModal({ visible: true, id: car.id, etiqueta: car.codigo, estadoDestino: 'EN_USO' })}
                                    style={{ padding: "0.35rem 0.65rem", border: "1px solid #3b82f6", backgroundColor: "rgba(59,130,246,0.05)", color: "#3b82f6", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                    <FiPlayCircle size={12} /> Poner en Uso
                                  </button>
                                  <button onClick={() => setConfirmModal({ visible: true, id: car.id, etiqueta: car.codigo, estadoDestino: 'MANTENIMIENTO' })}
                                    style={{ padding: "0.35rem 0.65rem", border: "1px solid #f59e0b", backgroundColor: "rgba(245,158,11,0.05)", color: "#f59e0b", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                    <FiTool size={12} /> Mantenimiento
                                  </button>
                                </>
                              )}
                              {car.estado === 'EN_USO' && (
                                <button onClick={() => setConfirmModal({ visible: true, id: car.id, etiqueta: car.codigo, estadoDestino: 'DISPONIBLE' })}
                                  style={{ padding: "0.35rem 0.65rem", border: "1px solid #10b981", backgroundColor: "rgba(16,185,129,0.05)", color: "#10b981", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                  <FiCheckCircle size={12} /> Marcar Disponible
                                </button>
                              )}
                              {car.estado === 'MANTENIMIENTO' && (
                                <button onClick={() => setConfirmModal({ visible: true, id: car.id, etiqueta: car.codigo, estadoDestino: 'DISPONIBLE' })}
                                  style={{ padding: "0.35rem 0.65rem", border: "1px solid #10b981", backgroundColor: "rgba(16,185,129,0.05)", color: "#10b981", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                  <FiRefreshCw size={12} /> Marcar Disponible
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {carritosFiltrados.length === 0 && (
                          <tr><td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>No hay carritos.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem", padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9" }}>
                    <button onClick={() => cargarCar(paginaCar - 1)} disabled={paginaCar <= 0}
                      style={{ padding: "0.4rem", border: "1px solid #cbd5e1", background: "#fff", borderRadius: "0.5rem", cursor: paginaCar <= 0 ? "not-allowed" : "pointer", opacity: paginaCar <= 0 ? 0.5 : 1, display: "flex" }}>
                      <FiChevronLeft size={16} />
                    </button>
                    <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#64748b" }}>Página {paginaCar + 1} de {totalPagCar || 1}</span>
                    <button onClick={() => cargarCar(paginaCar + 1)} disabled={paginaCar + 1 >= totalPagCar}
                      style={{ padding: "0.4rem", border: "1px solid #cbd5e1", background: "#fff", borderRadius: "0.5rem", cursor: paginaCar + 1 >= totalPagCar ? "not-allowed" : "pointer", opacity: paginaCar + 1 >= totalPagCar ? 0.5 : 1, display: "flex" }}>
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {confirmModal.visible && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "400px", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <div style={{ backgroundColor: "rgba(245,158,11,0.1)", color: "#f59e0b", padding: "0.5rem", borderRadius: "0.5rem", display: "flex" }}>
                <FiAlertTriangle size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 0.5rem 0", fontWeight: "800", color: "#1e293b", fontSize: "1rem" }}>Confirmar Cambio de Estado</h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>¿Cambiar carrito [{confirmModal.etiqueta}] a <strong>{confirmModal.estadoDestino}</strong>?</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1.5rem" }}>
              <button onClick={() => setConfirmModal({ visible: false })} style={{ padding: "0.45rem 1rem", border: "1px solid #cbd5e1", background: "#fff", borderRadius: "0.5rem", cursor: "pointer", color: "#475569", fontWeight: "700", fontSize: "0.8rem" }}>Cancelar</button>
              <button onClick={ejecutarCambioEstadoCarrito} style={{ padding: "0.45rem 1.25rem", background: colorSuper, color: "#fff", border: "none", borderRadius: "0.5rem", fontWeight: "700", fontSize: "0.8rem", cursor: "pointer" }}>Sí, Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {showModalConfig && estConfig && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "420px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: "#1e293b" }}>Configurar Estacionamiento N° {estConfig.numero}</h3>
              <button onClick={() => setShowModalConfig(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>
            <form onSubmit={guardarConfigEstacionamiento}>
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={estiloLabel}>Tipo de Vehículo</label>
                  <select style={estiloInput} value={tipoVehiculoForm} onChange={(e) => setTipoVehiculoForm(e.target.value)}>
                    <option value="">Sin asignar</option>
                    <option value="AUTO">Auto</option>
                    <option value="MOTO">Moto</option>
                  </select>
                </div>
                <div>
                  <label style={estiloLabel}>Capacidad Máxima</label>
                  <input type="number" min="1" style={estiloInput} placeholder="Ej: 2" value={capacidadForm} onChange={(e) => setCapacidadForm(e.target.value)} />
                </div>
              </div>
              <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
                <button type="button" onClick={reiniciarConfigEstacionamiento} style={{ backgroundColor: "#ffffff", border: "1px solid #ef4444", color: "#ef4444", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer" }}>Reiniciar Configuración</button>
                <button type="submit" style={{ backgroundColor: colorSuper, border: "none", color: "#ffffff", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer" }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "440px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: "#1e293b" }}>{tabActiva === 'ESTACIONAMIENTO' ? "Alta de Nuevo Estacionamiento" : "Alta de Nuevo Carrito"}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSaveAsset}>
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {tabActiva === 'ESTACIONAMIENTO' ? (
                  <div>
                    <label style={estiloLabel}>Número de Estacionamiento</label>
                    <input type="number" min="1" style={estiloInput} placeholder="Ej: 15" value={numeroForm} onChange={(e) => setNumeroForm(e.target.value)} required />
                  </div>
                ) : (
                  <div>
                    <label style={estiloLabel}>Código del Carrito</label>
                    <input type="text" style={estiloInput} placeholder="Ej: CARR-005" value={codigoForm} onChange={(e) => setCodigoForm(e.target.value)} required />
                  </div>
                )}
              </div>
              <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Cancelar</button>
                <button type="submit" disabled={guardando} style={{ backgroundColor: colorSuper, border: "none", color: "#ffffff", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer", opacity: guardando ? 0.6 : 1 }}>
                  {guardando ? "Guardando..." : "Guardar e Inventariar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
