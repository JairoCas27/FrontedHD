import React, { useState, useEffect, useCallback } from 'react'
import { FiPackage, FiGrid, FiHome, FiMapPin, FiTruck, FiPlus, FiX, FiRefreshCw, FiInfo, FiCheckCircle, FiAlertTriangle } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { getCondominiums, getAdminAssets, createAdminAsset, updateAdminAssetStatus } from '../../services/api'

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
  const [loadingData, setLoadingData] = useState(false)
  const [estacionamientos, setEstacionamientos] = useState([])
  const [carritos, setCarritos] = useState([])
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' })
  const [showModal, setShowModal] = useState(null)
  const [codigoForm, setCodigoForm] = useState('')
  const [numeroForm, setNumeroForm] = useState('')

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
      const [parkingRes, cartRes] = await Promise.all([
        getAdminAssets(condominioId, 'ESTACIONAMIENTO'),
        getAdminAssets(condominioId, 'CARRITO')
      ])
      setEstacionamientos(parkingRes?.items || [])
      setCarritos(cartRes?.items || [])
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

  const handleToggleDisponible = async (item) => {
    try {
      await updateAdminAssetStatus(item.id, { tipo: item.tipo, estado: item.estado, disponible: !item.disponible }, condoSeleccionado)
      mostrarToast(`Estado actualizado: ${item.disponible ? 'Ocupado' : 'Disponible'}`, 'info')
      cargarActivos(condoSeleccionado)
    } catch (err) {
      mostrarToast('Error al actualizar estado: ' + err.message, 'error')
    }
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
          Sincronizando.
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
                      <th style={{ padding: "1rem" }}>Número</th>
                      <th style={{ padding: "1rem" }}>Tipo Vehículo</th>
                      <th style={{ padding: "1rem" }}>Capacidad</th>
                      <th style={{ padding: "1rem" }}>Ocupación</th>
                      <th style={{ padding: "1rem" }}>Estado</th>
                      <th style={{ padding: "1rem" }}>Apartamento</th>
                      <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                    {estacionamientos.map((est) => (
                      <tr key={est.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "1rem 1.5rem", fontFamily: "monospace", fontWeight: "700", color: "#94a3b8" }}>{est.codigo || '—'}</td>
                        <td style={{ padding: "1rem", fontWeight: "700", color: "#0f172a" }}>N° {est.numero}</td>
                        <td style={{ padding: "1rem" }}>
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
                        <td style={{ padding: "1rem" }}>
                          {est.disponible ? (
                            <span style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981", padding: "0.25rem 0.6rem", borderRadius: "0.4rem", fontSize: "0.72rem", fontWeight: "700" }}>Disponible</span>
                          ) : (
                            <span style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "0.25rem 0.6rem", borderRadius: "0.4rem", fontSize: "0.72rem", fontWeight: "700" }}>Ocupado</span>
                          )}
                        </td>
                        <td style={{ padding: "1rem", fontSize: "0.8rem", color: "#64748b" }}>{est.idApartamento ? `#${est.idApartamento}` : '—'}</td>
                        <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                          <button
                            onClick={() => handleToggleDisponible(est)}
                            style={{
                              padding: "0.35rem 0.65rem", border: "1px solid", borderRadius: "0.5rem", fontSize: "0.72rem", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.3rem",
                              borderColor: est.disponible ? "#ef4444" : "#10b981",
                              backgroundColor: est.disponible ? "rgba(239,68,68,0.05)" : "rgba(16,185,129,0.05)",
                              color: est.disponible ? "#ef4444" : "#10b981"
                            }}
                          >
                            <FiRefreshCw size={12} /> {est.disponible ? 'Marcar Ocupado' : 'Marcar Disponible'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {estacionamientos.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontStyle: "italic" }}>No hay estacionamientos registrados.</td>
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
                      <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Acción</th>
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
                          {car.disponible ? (
                            <span style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981", padding: "0.25rem 0.6rem", borderRadius: "0.4rem", fontSize: "0.72rem", fontWeight: "700" }}>Disponible</span>
                          ) : (
                            <span style={{ backgroundColor: "rgba(245,158,11,0.1)", color: "#f59e0b", padding: "0.25rem 0.6rem", borderRadius: "0.4rem", fontSize: "0.72rem", fontWeight: "700" }}>En Préstamo</span>
                          )}
                        </td>
                        <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                          <button
                            onClick={() => handleToggleDisponible(car)}
                            style={{
                              padding: "0.35rem 0.65rem", border: "1px solid", borderRadius: "0.5rem", fontSize: "0.72rem", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.3rem",
                              borderColor: car.disponible ? "#f59e0b" : "#10b981",
                              backgroundColor: car.disponible ? "rgba(245,158,11,0.05)" : "rgba(16,185,129,0.05)",
                              color: car.disponible ? "#f59e0b" : "#10b981"
                            }}
                          >
                            <FiRefreshCw size={12} /> {car.disponible ? 'Marcar Préstamo' : 'Marcar Disponible'}
                          </button>
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
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "440px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.08)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
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
    </div>
  )
}
