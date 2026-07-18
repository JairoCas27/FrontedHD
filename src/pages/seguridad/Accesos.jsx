import { useState, useEffect, useRef, useMemo } from 'react'
import JsBarcode from 'jsbarcode'
import { FiCamera, FiSearch, FiLogIn, FiLogOut, FiX, FiCheck, FiActivity, FiUser, FiClock, FiAlertCircle, FiInfo, FiAlertTriangle, FiCalendar, FiRefreshCw, FiEye, FiFileText, FiPrinter } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import DataList from '../../components/common/DataList'
import { useAuth } from '../../context/AuthContext'
import { verifyVehicleByPlate, registerVehicleEntry, registerVehicleExit, listParkingSlots, listVehiclesWithoutSpot, getAccessLogs } from '../../services/SeguridadApi'

// ==================== CONSTANTES ====================
const VERDE = "#10b981"
const VERDE_OSCURO = "#059669"
const VERDE_CLARO = "rgba(16,185,129,0.12)"
const ROJO = "#ef4444"
const ROJO_CLARO = "rgba(239,68,68,0.12)"
const AMARILLO = "#f59e0b"
const AMARILLO_CLARO = "rgba(245,158,11,0.12)"
const AZUL = "#3b82f6"
const AZUL_CLARO = "rgba(59,130,246,0.12)"
const TEXTO = "#0f172a"
const TEXTO_SUAVE = "#475569"
const TEXTO_LIGHT = "#94a3b8"
const FONDO = "#f8fafc"
const BORDE = "#e2e8f0"
const COLOR_SEGURIDAD = "#059669"

const styles = {
  container: { padding: "2rem", backgroundColor: FONDO, minHeight: "100vh", width: "100%", boxSizing: "border-box" },
  card: { backgroundColor: "#fff", borderRadius: "1rem", border: `1px solid ${BORDE}`, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" },
  input: { width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.9rem", color: TEXTO, backgroundColor: "#fff", boxSizing: "border-box", outline: "none" },
  label: { display: "block", fontSize: "0.7rem", fontWeight: "700", color: TEXTO_SUAVE, marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.04em" },
  select: { width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.9rem", color: TEXTO, backgroundColor: "#fff", outline: "none" },
  badge: (bg, color) => ({ fontSize: "0.7rem", fontWeight: "700", padding: "0.22rem 0.55rem", borderRadius: "0.35rem", display: "inline-flex", alignItems: "center", gap: "0.25rem", backgroundColor: bg, color }),
  btnPrimary: { backgroundColor: VERDE, color: "#fff", border: "none", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem", transition: "all 0.2s" },
  btnDanger: { backgroundColor: ROJO, color: "#fff", border: "none", padding: "0.45rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem", transition: "all 0.2s" },
  btnOutline: { backgroundColor: "#fff", color: TEXTO_SUAVE, border: `1px solid #cbd5e1`, padding: "0.45rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem", transition: "all 0.2s" },
}

const thStyle = { padding: "0.75rem 1rem", textAlign: "left", fontWeight: 700, color: TEXTO_SUAVE, fontSize: "0.65rem", textTransform: "uppercase", whiteSpace: "nowrap", borderBottom: "1px solid #e2e8f0" }
const tdStyle = { padding: "0.75rem 1rem", color: TEXTO, whiteSpace: "nowrap" }

const fmtDate = (iso) => {
  if (!iso) return '—'
  try { const d = new Date(iso); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` } catch { return iso }
}

export default function Accesos() {
  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500) }

  const { user } = useAuth()

  // ========== COMPARTIDO ==========
  const [parking, setParking] = useState([])
  const [loading, setLoading] = useState(false)

  // ========== LOGS DESDE BD ==========
  const [allLogs, setAllLogs] = useState([])
  const [loadingLogs, setLoadingLogs] = useState(false)
  const [logPage, setLogPage] = useState(1)
  const [logSearch, setLogSearch] = useState('')
  const PER_PAGE = 10

  // ========== MODALES ==========
  const [detailItem, setDetailItem] = useState(null)
  const [ticket, setTicket] = useState(null)
  const barcodeRef = useRef(null)

  // ========== ENTRADA ==========
  const [placa, setPlaca] = useState("")
  const [idSlot, setIdSlot] = useState("")
  const [vehiculo, setVehiculo] = useState(null)
  const [loadingV, setLoadingV] = useState(false)
  const [parkingMsg, setParkingMsg] = useState(null)
  const [vehiculosSinSpot, setVehiculosSinSpot] = useState([])
  const [selectedPlaca, setSelectedPlaca] = useState("")
  const [vehiculoText, setVehiculoText] = useState("")
  const [estText, setEstText] = useState("")

  // ========== SALIDA ==========
  const [loadingS, setLoadingS] = useState(false)
  const [salidaPlaca, setSalidaPlaca] = useState("")
  const [salidaIdLog, setSalidaIdLog] = useState("")

  // ========== COMPUTED ==========
  const activeEntries = useMemo(() => allLogs.filter(l => !l.fechaSalida), [allLogs])
  const disponibles = useMemo(() => parking.filter(s => s.disponible).length, [parking])
  const estacionamientoLleno = disponibles === 0 && parking.length > 0
  const filteredActive = useMemo(() => {
    if (!salidaPlaca) return activeEntries
    return activeEntries.filter(l =>
      l.placa?.toLowerCase().includes(salidaPlaca.toLowerCase()) ||
      l.nombrePropietario?.toLowerCase().includes(salidaPlaca.toLowerCase()) ||
      l.marca?.toLowerCase().includes(salidaPlaca.toLowerCase()) ||
      String(l.id).includes(salidaPlaca)
    )
  }, [activeEntries, salidaPlaca])

  // ========== CARGA DE DATOS ==========
  const cargarSlots = async () => {
    try {
      const [p, logs] = await Promise.all([
        listParkingSlots().catch(() => []),
        getAccessLogs({ condominioId: user?.idCondominio, page: 0, size: 500 }).catch(() => ({ items: [] })),
      ])
      const activeEntries = (logs?.items || []).filter(l => !l.fechaSalida)
      const enriched = (Array.isArray(p) ? p : []).map(slot => {
        const vehiculosEnSlot = activeEntries.filter(l => String(l.idEstacionamiento) === String(slot.id))
        const cant = vehiculosEnSlot.length
        return {
          ...slot,
          cantidadActual: cant,
          disponible: slot.capacidadMaxima ? cant < slot.capacidadMaxima : cant < 1,
        }
      })
      setParking(enriched)
    } catch { }
  }

  const cargarVehiculosSinSpot = async () => {
    try { const v = await listVehiclesWithoutSpot(user?.idCondominio); setVehiculosSinSpot(Array.isArray(v) ? v : []) } catch { }
  }

  const cargarAccessLogs = async () => {
    setLoadingLogs(true)
    try {
      const result = await getAccessLogs({ condominioId: user?.idCondominio, page: 0, size: 500 })
      const items = result?.items || (Array.isArray(result) ? result : [])
      setAllLogs(items)
      // Re-enrich parking after logs are loaded
      setParking(prev => {
        const active = items.filter(l => !l.fechaSalida)
        return prev.map(slot => {
          const vehiculosEnSlot = active.filter(l => String(l.idEstacionamiento) === String(slot.id))
          const cant = vehiculosEnSlot.length
          return { ...slot, cantidadActual: cant, disponible: slot.capacidadMaxima ? cant < slot.capacidadMaxima : cant < 1 }
        })
      })
    } catch {
      // Silently fail
    } finally {
      setLoadingLogs(false)
    }
  }

  useEffect(() => { cargarSlots(); cargarVehiculosSinSpot(); cargarAccessLogs() }, [])

  // ========== PAGINACIÓN ==========
  const paginate = (arr, page) => {
    const start = (page - 1) * PER_PAGE
    return arr.slice(start, start + PER_PAGE)
  }

  const totalPages = (arr) => Math.max(1, Math.ceil(arr.length / PER_PAGE))

  const filteredLogs = useMemo(() => {
    return allLogs.filter(l =>
      !logSearch ||
      l.placa?.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.nombrePropietario?.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.ocupante?.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.metodo?.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.marca?.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.modelo?.toLowerCase().includes(logSearch.toLowerCase()) ||
      String(l.id).includes(logSearch)
    )
  }, [allLogs, logSearch])

  const pagedLogs = paginate(filteredLogs, logPage)

  const Pagination = ({ arr, page, setPage }) => {
    const total = totalPages(arr)
    if (arr.length <= PER_PAGE) return null
    const pages = []
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= page - 1 && i <= page + 1)) pages.push(i)
      else if (pages[pages.length - 1] !== '...') pages.push('...')
    }
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", padding: "0.75rem", borderTop: "1px solid #f1f5f9" }}>
        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
          style={{ padding: "0.3rem 0.6rem", borderRadius: "0.4rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: page <= 1 ? "#cbd5e1" : TEXTO_SUAVE, fontSize: "0.7rem", fontWeight: 600, cursor: page <= 1 ? "not-allowed" : "pointer" }}>
          Atrás
        </button>
        {pages.map((p, i) =>
          p === '...' ? <span key={`e${i}`} style={{ fontSize: "0.7rem", color: TEXTO_LIGHT }}>...</span> :
            <button key={p} onClick={() => setPage(p)}
              style={{ padding: "0.3rem 0.6rem", borderRadius: "0.4rem", border: "none", backgroundColor: p === page ? COLOR_SEGURIDAD : "#f1f5f9", color: p === page ? "#fff" : "#64748b", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", minWidth: "28px" }}>
              {p}
            </button>
        )}
        <button onClick={() => setPage(Math.min(total, page + 1))} disabled={page >= total}
          style={{ padding: "0.3rem 0.6rem", borderRadius: "0.4rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: page >= total ? "#cbd5e1" : TEXTO_SUAVE, fontSize: "0.7rem", fontWeight: 600, cursor: page >= total ? "not-allowed" : "pointer" }}>
          Siguiente
        </button>
      </div>
    )
  }

  // ========== VERIFICAR PLACA ==========
  const verificar = async () => {
    if (!placa.trim()) return showToast("Ingresa una placa", "warning")
    setVehiculo(null); setParkingMsg(null); setLoadingV(true)
    try {
      const d = await verifyVehicleByPlate(placa.trim().toUpperCase())
      setVehiculo(d)

      const idSlotAsignado = d.idEstacionamiento || d.idEstacionamientoApartamento

      if (idSlotAsignado) {
        const slot = Array.isArray(parking) ? parking.find(s => s.id === idSlotAsignado) : null
        if (slot && slot.disponible) {
          setIdSlot(String(idSlotAsignado))
          setEstText(`#${slot.numero} ${(slot.tipoVehiculo || '').toUpperCase()} (${slot.cantidadActual ?? 0}/${slot.capacidadMaxima || '∞'})`)
          const origen = d.idEstacionamiento ? 'al vehículo' : 'al departamento'
          showToast(`✅ Estacionamiento #${slot.numero} asignado ${origen}`, "success")
        } else {
          setIdSlot(""); setEstText("")
          const numSlot = slot?.numero || idSlotAsignado
          setParkingMsg({
            type: "warning",
            title: "Estacionamiento asignado no disponible",
            text: `El estacionamiento #${numSlot} está ocupado. Selecciona otro manualmente.`
          })
          showToast(`⚠️ Estacionamiento #${numSlot} ocupado — asigne manualmente`, "warning")
        }
      } else {
        setIdSlot("")
        if (d.derechoEstacionamiento === false) {
          setParkingMsg({
            type: "warning",
            title: "Sin derecho de estacionamiento",
            text: `El departamento #${d.numeroDepartamento || '?'} no tiene derecho de estacionamiento.`
          })
          showToast(`⚠️ Depto #${d.numeroDepartamento || '?'} sin derecho de estacionamiento`, "warning")
        } else if (d.derechoEstacionamiento === true) {
          const disponibles = Array.isArray(parking) ? parking.filter(s => s.disponible).length : 0
          if (disponibles === 0) {
            setParkingMsg({
              type: "warning",
              title: "Sin estacionamientos disponibles",
              text: `No hay estacionamientos libres. Libera un espacio o asigna manualmente.`
            })
            showToast(`⚠️ No hay estacionamientos disponibles`, "warning")
          } else {
            setParkingMsg({
              type: "info",
              title: "Seleccionar estacionamiento",
              text: `El vehículo no tiene estacionamiento asignado. Hay ${disponibles} espacio(s) disponible(s).`
            })
            showToast(`ℹ️ Seleccione un estacionamiento manualmente`, "info")
          }
        }
      }
    }
    catch (e) { showToast(e.message || "No registrado", "error") }
    finally { setLoadingV(false) }
  }

  // ========== ENTRADA ==========
  const registrarEntrada = async () => {
    if (!placa.trim()) return showToast("Ingresa una placa", "error")
    if (estacionamientoLleno) return showToast("Estacionamiento lleno — no hay espacios disponibles", "error")
    setLoading(true)
    try {
      const payload = { placa: placa.trim().toUpperCase(), metodo: "MANUAL", ocupante: "PROPIETARIO" }
      if (idSlot) payload.idEstacionamiento = Number(idSlot)
      const r = await registerVehicleEntry(payload)
      showToast("✅ Entrada registrada correctamente")
      setPlaca(""); setIdSlot(""); setVehiculo(null); setSelectedPlaca(""); setVehiculoText(""); setEstText(""); setParkingMsg(null)
      // Recargar logs y slots desde BD
      setTimeout(() => { cargarAccessLogs(); cargarSlots() }, 300)
    } catch (e) { showToast(e.message || "Error", "error") }
    finally { setLoading(false) }
  }

  // ========== SALIDA ==========
  const registrarSalida = async (idLogAcceso) => {
    if (!idLogAcceso) return showToast("Selecciona un vehículo activo", "error")
    setLoadingS(true)
    try {
      const r = await registerVehicleExit(idLogAcceso)
      showToast("✅ Salida registrada correctamente")
      setSalidaPlaca(""); setSalidaIdLog("")
      // Recargar logs y slots desde BD
      setTimeout(() => { cargarAccessLogs(); cargarSlots() }, 300)
    } catch (e) { showToast(e.message || "Error", "error") }
    finally { setLoadingS(false) }
  }

  const limpiarEntrada = () => {
    setPlaca(""); setIdSlot(""); setVehiculo(null); setSelectedPlaca(""); setVehiculoText(""); setEstText(""); setParkingMsg(null)
  }

  // ========== MODAL: DETALLE ==========
  const openDetail = (l) => {
    const spot = parking.find(p => String(p.id) === String(l.idEstacionamiento))
    setDetailItem({
      ...l,
      spotNumero: spot?.numero || '—',
      spotTipo: spot?.tipoVehiculo || '—',
      spotCapacidad: spot?.capacidadMaxima || '—',
    })
  }

  // ========== MODAL: TICKET ==========
  const openTicket = (l) => {
    const spot = parking.find(p => String(p.id) === String(l.idEstacionamiento))
    setTicket({
      ...l,
      spotNumero: spot?.numero || '—',
    })
    setTimeout(() => {
      if (barcodeRef.current) {
        try {
          JsBarcode(barcodeRef.current, `TKT-${l.id}`, {
            format: "CODE128", width: 1.5, height: 50, displayValue: true, fontSize: 11, margin: 5
          })
        } catch (e) { console.error('Barcode error:', e) }
      }
    }, 100)
  }

  const printTicket = () => {
    const content = document.getElementById('ticket-content')
    if (!content) return
    const win = window.open('', '_blank')
    win.document.write(`
      <html><head><title>Ticket de Parqueo</title>
      <style>
        body { font-family: 'Courier New', monospace; padding: 2rem; text-align: center; }
        .ticket { max-width: 350px; margin: auto; border: 2px dashed #333; padding: 1.5rem; }
        h1 { font-size: 1.2rem; margin-bottom: 0.5rem; }
        .detail { margin: 0.25rem 0; font-size: 0.9rem; }
        .barcode { margin: 1rem 0; }
        hr { border: 1px dashed #ccc; }
      </style></head><body>
      <div class="ticket">${content.innerHTML}</div>
      <script>window.print();window.close();<\/script>
      </body></html>
    `)
    win.document.close()
  }

  const Row = ({ label, children }) => (
    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.4rem", paddingTop: "0.4rem" }}>
      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: TEXTO_SUAVE }}>{label}</span>
      <span style={{ fontSize: "0.8rem", color: TEXTO, fontWeight: 600 }}>{children}</span>
    </div>
  )

  return (
    <div className="ac-container" style={styles.container}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .fade-in { animation: slideIn 0.3s ease both; }
        .spin { animation: spin 1s linear infinite; }
        .btn-hover:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(16,185,129,0.3); }
        .btn-hover-red:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(239,68,68,0.3); }
        @media (max-width: 768px) {
          .ac-container { padding: 1rem !important; }
          .ac-forms-grid { grid-template-columns: 1fr !important; }
          .ac-buscar-input { width: 100% !important; }
          .ac-modal-box { max-width: 95vw !important; margin: 0 0.5rem !important; }
          .ac-ticket-modal { max-width: 95vw !important; }
          .ac-log-table table { font-size: 0.7rem !important; }
          .ac-log-table th, .ac-log-table td { padding: 0.4rem 0.5rem !important; }
        }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 1300,
          backgroundColor: toast.type === 'error' ? ROJO : toast.type === 'warning' ? AMARILLO : toast.type === 'info' ? AZUL : VERDE,
          color: "#fff", padding: "0.85rem 1.25rem", borderRadius: "0.75rem",
          fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center",
          gap: "0.6rem", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
          animation: "slideIn 0.3s ease",
        }}>
          {toast.type === 'error' ? <FiAlertCircle size={18} /> : toast.type === 'warning' ? <FiAlertTriangle size={18} /> : toast.type === 'info' ? <FiInfo size={18} /> : <FiCheck size={18} />}
          {toast.msg}
        </div>
      )}

      <EncabezadoTabla
        titulo="Control de Accesos"
        subtitulo="Registro de entrada y salida de vehículos · Verificación por placa"
      />

      {/* ===== DOS FORMULARIOS EN GRID ===== */}
      <div className="fade-in ac-forms-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>

        {/* ============ FORMULARIO 1: ENTRADA ============ */}
        <div style={{ ...styles.card, background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)" }}>
          <div style={{ padding: "1.25rem" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ background: VERDE_CLARO, padding: "0.6rem", borderRadius: "0.65rem", display: "flex" }}>
                <FiLogIn size={20} color={VERDE} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1rem", color: TEXTO }}>Registrar Entrada</div>
                <div style={{ fontSize: "0.72rem", color: TEXTO_LIGHT }}>Verifica la placa y registra el ingreso</div>
              </div>
            </div>

            {/* DataList vehículos sin estacionamiento */}
            {vehiculosSinSpot.length > 0 && (
              <div style={{ marginBottom: "0.65rem" }}>
                <label style={styles.label}>Vehículo registrado (sin estacionamiento)</label>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <DataList
                      value={vehiculoText}
                      onChange={e => {
                        const txt = e.target.value
                        setVehiculoText(txt)
                        const v = vehiculosSinSpot.find(vh => vh.placa === txt)
                        if (v) {
                          setSelectedPlaca(v.placa)
                          setPlaca(v.placa)
                          setVehiculo(null)
                          setTimeout(() => verificar(), 150)
                        } else {
                          setSelectedPlaca("")
                        }
                      }}
                      placeholder="Buscar vehículo por placa..."
                      style={{ width: "100%", boxSizing: "border-box", padding: "0.55rem 0.7rem", borderRadius: "0.5rem", border: `2px solid ${selectedPlaca ? VERDE : '#cbd5e1'}`, fontSize: "0.85rem", outline: "none", fontWeight: 600, color: TEXTO, background: "#fff" }}
                    >
                      <option value="">— Elegir vehículo —</option>
                      {vehiculosSinSpot.map(v => (
                        <option key={v.idVehiculo} value={v.placa}>🚗 {v.placa} — {v.marca} {v.modelo}</option>
                      ))}
                    </DataList>
                  </div>
                  <button onClick={() => { setPlaca(vehiculoText?.toUpperCase() || ""); setTimeout(verificar, 50) }} disabled={loadingV || !vehiculoText?.trim()}
                    className="btn-hover"
                    style={{ ...styles.btnPrimary, padding: "0.55rem 1rem", fontSize: "0.85rem", whiteSpace: "nowrap", opacity: loadingV || !vehiculoText?.trim() ? 0.6 : 1 }}>
                    <FiSearch size={16} /> {loadingV ? "..." : "Verificar"}
                  </button>
                </div>
              </div>
            )}

            {/* Resultado vehículo */}
            {vehiculo && (
              <div style={{ padding: "0.75rem 1rem", borderRadius: "0.65rem", backgroundColor: "#f0fdf4", border: "1px solid #86efac", marginBottom: "0.65rem" }}>
                <div className="ac-vehiculo-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.25rem 1rem", fontSize: "0.82rem", color: "#065f46" }}>
                  <span><b>Dueño:</b> {vehiculo.nombrePropietario || 'Sin propietario'}</span>
                  <span><b>Placa:</b> <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{vehiculo.placa}</span></span>
                  <span><b>Modelo:</b> {vehiculo.modelo}</span>
                  <span><b>Color:</b> {vehiculo.color}</span>
                  <span><b>Tipo:</b> {vehiculo.tipo}</span>
                </div>
                <style>{`@media (max-width: 768px) { .ac-vehiculo-grid { grid-template-columns: 1fr !important; } }`}</style>
              </div>
            )}

            {/* Mensaje estacionamiento */}
            {parkingMsg && (
              <div style={{
                padding: "0.65rem 0.85rem", borderRadius: "0.5rem", marginBottom: "0.65rem", display: "flex", alignItems: "flex-start", gap: "0.5rem",
                backgroundColor: parkingMsg.type === 'warning' ? AMARILLO_CLARO : AZUL_CLARO,
                border: `1px solid ${parkingMsg.type === 'warning' ? AMARILLO : AZUL}`, fontSize: "0.78rem"
              }}>
                {parkingMsg.type === 'warning' ? <FiAlertTriangle size={15} color={AMARILLO} style={{ flexShrink: 0, marginTop: "2px" }} /> : <FiInfo size={15} color={AZUL} style={{ flexShrink: 0, marginTop: "2px" }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: parkingMsg.type === 'warning' ? "#92400e" : "#1e40af" }}>{parkingMsg.title}</div>
                  <div style={{ color: parkingMsg.type === 'warning' ? "#78350f" : "#1e3a5f" }}>{parkingMsg.text}</div>
                </div>
                <button onClick={() => setParkingMsg(null)} style={{ background: "none", border: "none", cursor: "pointer", color: parkingMsg.type === 'warning' ? "#92400e" : "#1e40af", flexShrink: 0, padding: "2px" }}><FiX size={14} /></button>
              </div>
            )}

            {/* Indicador de estacionamiento lleno */}
            {estacionamientoLleno && (
              <div style={{
                padding: "0.65rem 0.85rem", borderRadius: "0.5rem", marginBottom: "0.65rem", display: "flex", alignItems: "flex-start", gap: "0.5rem",
                backgroundColor: ROJO_CLARO,
                border: `1px solid ${ROJO}`, fontSize: "0.78rem"
              }}>
                <FiAlertTriangle size={15} color={ROJO} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: "#991b1b" }}>🚫 Estacionamiento lleno</div>
                  <div style={{ color: "#7f1d1d" }}>Todos los espacios están ocupados. Registra una salida para liberar espacio.</div>
                </div>
              </div>
            )}

            {/* Indicador de espacios disponibles */}
            {!estacionamientoLleno && parking.length > 0 && (
              <div style={{
                padding: "0.4rem 0.75rem", borderRadius: "0.5rem", marginBottom: "0.65rem", display: "flex", alignItems: "center", gap: "0.5rem",
                backgroundColor: disponibles <= 2 ? AMARILLO_CLARO : "rgba(16,185,129,0.08)",
                border: `1px solid ${disponibles <= 2 ? AMARILLO : VERDE}`, fontSize: "0.78rem"
              }}>
                {disponibles <= 2 ? <FiAlertTriangle size={14} color={AMARILLO} /> : <FiCheck size={14} color={VERDE} />}
                <span style={{ fontWeight: 600, color: disponibles <= 2 ? "#92400e" : "#065f46" }}>
                  {disponibles} de {parking.length} espacios disponibles
                </span>
              </div>
            )}

            {/* DataList estacionamiento + botón entrada */}
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Estacionamiento</label>
                <DataList
                  value={estText}
                  onChange={e => {
                    const txt = e.target.value
                    setEstText(txt)
                    if (!txt) { setIdSlot(""); return }
                    const spot = parking.find(s => s.disponible && (
                      `#${s.numero} ${(s.tipoVehiculo || '').toUpperCase()} (${s.cantidadActual ?? 0}/${s.capacidadMaxima || '∞'})` === txt ||
                      `#${s.numero}` === txt?.trim() ||
                      String(s.numero) === txt?.trim()
                    ))
                    if (spot) setIdSlot(String(spot.id))
                  }}
                  placeholder="Buscar estacionamiento..."
                  style={{
                    width: "100%", boxSizing: "border-box", padding: "0.55rem 0.7rem",
                    borderRadius: "0.5rem", border: `2px solid ${idSlot ? VERDE : '#cbd5e1'}`,
                    fontSize: "0.85rem", outline: "none", fontWeight: 600, color: TEXTO, background: "#fff",
                  }}
                >
                  <option value="">Automático</option>
                  {parking.filter(s => s.disponible).map(s => (
                    <option key={s.id} value={`#${s.numero} ${(s.tipoVehiculo || '').toUpperCase()} (${s.cantidadActual ?? 0}/${s.capacidadMaxima || '∞'})`}>
                      #{s.numero} {s.tipoVehiculo || ''} ({s.cantidadActual ?? 0}/{s.capacidadMaxima || '∞'})
                    </option>
                  ))}
                </DataList>
              </div>
              <button onClick={registrarEntrada} disabled={loading || !placa.trim() || estacionamientoLleno}
                className="btn-hover"
                style={{ ...styles.btnPrimary, padding: "0.65rem 1.25rem", opacity: loading || !placa.trim() || estacionamientoLleno ? 0.5 : 1, whiteSpace: "nowrap" }}>
                <FiLogIn size={16} /> {loading ? "..." : "Entrada"}
              </button>
              <button onClick={limpiarEntrada} disabled={!placa && !vehiculo}
                style={{ ...styles.btnOutline, padding: "0.65rem 0.85rem", opacity: !placa && !vehiculo ? 0.5 : 1 }}>
                <FiX size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ============ FORMULARIO 2: SALIDA ============ */}
        <div style={{ ...styles.card, background: "linear-gradient(135deg, #fef2f2 0%, #fef2f2 100%)" }}>
          <div style={{ padding: "1.25rem" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ background: ROJO_CLARO, padding: "0.6rem", borderRadius: "0.65rem", display: "flex" }}>
                <FiLogOut size={20} color={ROJO} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: "1rem", color: TEXTO }}>Registrar Salida</div>
                <div style={{ fontSize: "0.72rem", color: TEXTO_LIGHT }}>Finaliza el acceso de un vehículo activo</div>
              </div>
              {activeEntries.length > 0 && (
                <div style={{ marginLeft: "auto", ...styles.badge(VERDE_CLARO, "#166534") }}>
                  <FiUser size={12} /> {activeEntries.length} activo(s)
                </div>
              )}
            </div>

            {activeEntries.length > 0 ? (
              <>
                {/* Buscador de vehículo activo */}
                <div style={{ marginBottom: "0.65rem" }}>
                  <label style={styles.label}>Buscar vehículo activo</label>
                  <div style={{ position: "relative" }}>
                    <FiSearch size={14} style={{ position: "absolute", left: "0.6rem", top: "50%", transform: "translateY(-50%)", color: TEXTO_LIGHT }} />
                    <input type="text" placeholder="Buscar por placa, dueño..." value={salidaPlaca}
                      onChange={e => { setSalidaPlaca(e.target.value); setSalidaIdLog("") }}
                      style={{ width: "100%", boxSizing: "border-box", padding: "0.55rem 0.6rem 0.55rem 2rem", borderRadius: "0.5rem", border: `1px solid ${salidaIdLog ? ROJO : '#cbd5e1'}`, fontSize: "0.85rem", outline: "none", color: TEXTO, background: "#fff" }} />
                  </div>
                </div>

                {/* Lista de vehículos activos filtrados */}
                <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "0.75rem", borderRadius: "0.5rem", border: `1px solid ${BORDE}` }}>
                  {filteredActive.length === 0 ? (
                    <div style={{ padding: "1rem", textAlign: "center", color: TEXTO_LIGHT, fontSize: "0.78rem" }}>
                      No se encontraron vehículos activos
                    </div>
                  ) : (
                    filteredActive.map(l => {
                      const selected = salidaIdLog === String(l.id)
                      return (
                        <div key={l.id}
                          onClick={() => { setSalidaIdLog(String(l.id)); setSalidaPlaca(l.placa + ' - ' + (l.nombrePropietario || '')) }}
                          style={{
                            padding: "0.6rem 0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem",
                            borderBottom: "1px solid #f1f5f9", transition: "all 0.15s",
                            backgroundColor: selected ? "rgba(239,68,68,0.08)" : "transparent",
                            borderLeft: selected ? `3px solid ${ROJO}` : "3px solid transparent",
                          }}
                          onMouseEnter={e => { if (!selected) e.currentTarget.style.backgroundColor = "#f8fafc" }}
                          onMouseLeave={e => { if (!selected) e.currentTarget.style.backgroundColor = "transparent" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.82rem", color: TEXTO }}>{l.placa}</span>
                              <span style={styles.badge(
                                l.ocupante === 'PROPIETARIO' ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                                l.ocupante === 'PROPIETARIO' ? "#10b981" : "#f59e0b"
                              )}>{l.ocupante || ''}</span>
                            </div>
                            <div style={{ fontSize: "0.72rem", color: TEXTO_SUAVE, marginTop: "0.15rem" }}>
                              {l.nombrePropietario || ''} · {l.marca || ''} {l.modelo || ''} · Ingresó: {fmtDate(l.fechaEntrada)}
                            </div>
                          </div>
                          {selected && <FiCheck size={16} color={ROJO} />}
                        </div>
                      )
                    })
                  )}
                </div>

                <button onClick={() => registrarSalida(Number(salidaIdLog))} disabled={loadingS || !salidaIdLog}
                  className="btn-hover-red"
                  style={{ ...styles.btnDanger, padding: "0.75rem 2rem", fontSize: "0.9rem", width: "100%", justifyContent: "center", opacity: loadingS || !salidaIdLog ? 0.6 : 1 }}>
                  <FiLogOut size={18} /> {loadingS ? "Registrando..." : "Registrar Salida"}
                </button>
              </>
            ) : (
              /* Sin activos */
              <div style={{ textAlign: "center", padding: "2rem 1rem", color: TEXTO_LIGHT }}>
                <FiClock size={32} style={{ opacity: 0.3, marginBottom: "0.5rem" }} />
                <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>Sin accesos activos</p>
                <p style={{ fontSize: "0.78rem", marginTop: "0.2rem" }}>No hay vehículos dentro del estacionamiento</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== BITÁCORA DE ACCESOS VEHICULARES ===== */}
      <div className="fade-in" style={{ ...styles.card, animationDelay: "0.1s" }}>
        <div style={{ padding: "0.85rem 1.25rem", borderBottom: `1px solid ${BORDE}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <span style={{ fontWeight: 700, fontSize: "0.85rem", color: TEXTO, display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <FiCalendar size={14} color={COLOR_SEGURIDAD} /> Bitácora de Accesos Vehiculares
          </span>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <FiSearch size={13} style={{ position: "absolute", left: "0.5rem", top: "50%", transform: "translateY(-50%)", color: TEXTO_LIGHT }} />
              <input type="text" placeholder="Buscar placa, vehículo..." value={logSearch} onChange={e => { setLogSearch(e.target.value); setLogPage(1) }}
                className="ac-buscar-input"
                style={{ ...styles.input, padding: "0.35rem 0.5rem 0.35rem 1.6rem", fontSize: "0.75rem", width: "180px" }} />
            </div>
            <button onClick={cargarAccessLogs} style={{ background: "none", border: "none", cursor: "pointer", color: TEXTO_LIGHT }} title="Recargar">
              <FiRefreshCw size={16} className={loadingLogs ? "spin" : ""} />
            </button>
            <span style={{ fontSize: "0.7rem", color: TEXTO_LIGHT, fontWeight: 600 }}>{filteredLogs.length} registros</span>
          </div>
        </div>
        {loadingLogs ? (
          <div style={{ textAlign: "center", padding: "2.5rem", color: TEXTO_LIGHT }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Cargando registros...</div>
          </div>
        ) : pagedLogs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2.5rem", color: TEXTO_LIGHT }}>
            <FiCalendar size={32} style={{ opacity: 0.3, marginBottom: "0.5rem" }} />
            <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>Sin registros de acceso</p>
            <p style={{ fontSize: "0.78rem", marginTop: "0.2rem" }}>Los accesos registrados aparecerán aquí</p>
          </div>
        ) : (
          <>
            <div className="ac-log-table" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                <thead>
                  <tr style={{ backgroundColor: FONDO }}>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>Placa</th>
                    <th style={thStyle}>Vehículo</th>
                    <th style={thStyle}>Dueño</th>
                    <th style={thStyle}>Estacionamiento</th>
                    <th style={thStyle}>Entrada</th>
                    <th style={thStyle}>Salida</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Estado</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody style={{ color: TEXTO }}>
                  {pagedLogs.map((l, idx) => {
                    const enCurso = !l.fechaSalida
                    const spot = parking.find(p => String(p.id) === String(l.idEstacionamiento))
                    return (
                      <tr key={l.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: enCurso ? "rgba(16,185,129,0.03)" : "transparent" }}>
                        <td style={{ ...tdStyle, color: TEXTO_LIGHT, fontSize: "0.7rem" }}>{(logPage - 1) * PER_PAGE + idx + 1}</td>
                        <td style={{ ...tdStyle, fontWeight: 700, fontFamily: "monospace", color: TEXTO }}>{l.placa}</td>
                        <td style={tdStyle}>
                          <span style={{ fontSize: "0.78rem" }}>
                            {l.marca ? `${l.marca} ${l.modelo || ''}` : '—'}
                            {l.color && <span style={{ color: TEXTO_LIGHT }}> ({l.color})</span>}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                            <FiUser size={12} color={TEXTO_LIGHT} />
                            <span style={{ fontSize: "0.78rem" }}>{l.nombrePropietario || '—'}</span>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: TEXTO_SUAVE }}>
                            #{spot?.numero || '—'}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, fontSize: "0.75rem", color: TEXTO_SUAVE }}>{fmtDate(l.fechaEntrada)}</td>
                        <td style={{ ...tdStyle, fontSize: "0.75rem", color: enCurso ? VERDE : TEXTO_SUAVE, fontWeight: enCurso ? 600 : 400 }}>
                          {l.fechaSalida ? fmtDate(l.fechaSalida) : <span style={{ color: VERDE }}>Dentro</span>}
                        </td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>
                          <span style={styles.badge(
                            enCurso ? VERDE_CLARO : "rgba(148,163,184,0.1)",
                            enCurso ? "#166534" : "#64748b"
                          )}>
                            {enCurso ? <FiLogIn size={11} /> : <FiLogOut size={11} />}
                            {enCurso ? "Activo" : "Finalizado"}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "0.3rem", justifyContent: "center" }}>
                            <button onClick={() => openDetail(l)}
                              style={{ background: "rgba(16,185,129,0.1)", color: VERDE_OSCURO, border: "none", padding: "0.3rem 0.5rem", borderRadius: "0.4rem", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}
                              title="Ver detalle">
                              <FiEye size={13} />
                            </button>
                            <button onClick={() => openTicket(l)}
                              style={{ background: "rgba(59,130,246,0.1)", color: "#1e40af", border: "none", padding: "0.3rem 0.5rem", borderRadius: "0.4rem", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}
                              title="Ver ticket">
                              <FiFileText size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {filteredLogs.length === 0 && (
                    <tr><td colSpan={9} style={{ padding: "2rem", textAlign: "center", color: TEXTO_LIGHT }}>Sin registros</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination arr={filteredLogs} page={logPage} setPage={setLogPage} />
          </>
        )}
      </div>
      {/* ===== MODAL DETALLE ===== */}
      {detailItem && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, backdropFilter: "blur(4px)"
        }} onClick={() => setDetailItem(null)}>
          <div className="ac-modal-box" style={{
            backgroundColor: "#fff", borderRadius: "1.25rem", width: "100%", maxWidth: "560px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto"
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: `1px solid ${BORDE}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: TEXTO, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiEye size={16} color={COLOR_SEGURIDAD} />
                Detalle de Acceso #{detailItem.id}
              </h3>
              <button onClick={() => setDetailItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: TEXTO_LIGHT }}><FiX size={18} /></button>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Row label="Ticket">
                <span style={{ fontFamily: "monospace", fontWeight: 700, color: COLOR_SEGURIDAD }}>TKT-{detailItem.id}</span>
              </Row>
              <Row label="Placa">
                <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{detailItem.placa}</span>
              </Row>
              <Row label="Vehículo">{[detailItem.marca, detailItem.modelo].filter(Boolean).join(' ') || '—'}</Row>
              <Row label="Color">{detailItem.color || '—'}</Row>
              <Row label="Tipo">{detailItem.tipoVehiculo || '—'}</Row>
              <Row label="Dueño">{detailItem.nombrePropietario || '—'}</Row>
              <Row label="Estacionamiento">#{detailItem.spotNumero || detailItem.idEstacionamiento || '—'}</Row>
              <Row label="Tipo estacionamiento">{detailItem.spotTipo || '—'}</Row>
              <Row label="Ocupante">
                <span style={styles.badge(
                  detailItem.ocupante === 'PROPIETARIO' ? "rgba(16,185,129,0.1)" : detailItem.ocupante === 'INQUILINO' ? "rgba(245,158,11,0.1)" : "rgba(59,130,246,0.1)",
                  detailItem.ocupante === 'PROPIETARIO' ? "#10b981" : detailItem.ocupante === 'INQUILINO' ? "#f59e0b" : "#3b82f6"
                )}>{detailItem.ocupante || '—'}</span>
              </Row>
              <Row label="Datos inquilino">{detailItem.datosInquilino || '—'}</Row>
              <Row label="Entrada">{fmtDate(detailItem.fechaEntrada)}</Row>
              <Row label="Salida">{detailItem.fechaSalida ? fmtDate(detailItem.fechaSalida) : <span style={{ color: VERDE, fontWeight: 600 }}>En curso</span>}</Row>
              <Row label="Método">
                <span style={styles.badge(
                  detailItem.metodo === 'OCR' ? "rgba(59,130,246,0.1)" : "rgba(245,158,11,0.1)",
                  detailItem.metodo === 'OCR' ? "#3b82f6" : "#f59e0b"
                )}>{detailItem.metodo || '—'}</span>
              </Row>
              <Row label="Estado">
                <span style={styles.badge(
                  detailItem.fechaSalida ? "rgba(148,163,184,0.1)" : VERDE_CLARO,
                  detailItem.fechaSalida ? "#64748b" : "#166534"
                )}>{detailItem.fechaSalida ? 'Finalizado' : 'Activo'}</span>
              </Row>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL TICKET ===== */}
      {ticket && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, backdropFilter: "blur(4px)"
        }} onClick={() => setTicket(null)}>
          <div className="ac-ticket-modal" style={{
            backgroundColor: "#fff", borderRadius: "1.25rem", width: "100%", maxWidth: "440px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto"
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${BORDE}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: TEXTO, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiFileText size={15} color={COLOR_SEGURIDAD} />
                Ticket de Parqueo
              </h3>
              <button onClick={() => setTicket(null)} style={{ background: "none", border: "none", cursor: "pointer", color: TEXTO_LIGHT }}><FiX size={18} /></button>
            </div>
            <div id="ticket-content" style={{ padding: "1.25rem", textAlign: "center", fontFamily: "'Courier New', monospace" }}>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: TEXTO, marginBottom: "0.2rem" }}>SGC - Parqueo</div>
              <div style={{ fontSize: "0.65rem", color: TEXTO_SUAVE, marginBottom: "0.5rem" }}>Sistema de Gestión de Condominios</div>
              <hr style={{ border: "1px dashed #d1d5db", margin: "0.4rem 0" }} />
              <div style={{ fontSize: "0.75rem", textAlign: "left", margin: "0.4rem 0" }}>
                {[
                  { l: 'Ticket #', v: `TKT-${ticket.id}` },
                  { l: 'Placa', v: ticket.placa },
                  { l: 'Vehículo', v: [ticket.marca, ticket.modelo].filter(Boolean).join(' ') || '—' },
                  { l: 'Color', v: ticket.color || '—' },
                  { l: 'Dueño', v: ticket.nombrePropietario || '—' },
                  { l: 'Estacionamiento', v: `#${ticket.spotNumero || ticket.idEstacionamiento || '—'}` },
                  { l: 'Ocupante', v: ticket.ocupante || '—' },
                  { l: 'Entrada', v: fmtDate(ticket.fechaEntrada) },
                  { l: 'Salida', v: ticket.fechaSalida ? fmtDate(ticket.fechaSalida) : 'En curso' },
                  { l: 'Método', v: ticket.metodo || '—' }
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.15rem 0" }}>
                    <span style={{ color: TEXTO_SUAVE }}>{r.l}:</span>
                    <span style={{ fontWeight: 700, color: TEXTO }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <hr style={{ border: "1px dashed #d1d5db", margin: "0.4rem 0" }} />
              <div className="barcode" style={{ margin: "0.5rem auto", overflow: "hidden", display: "flex", justifyContent: "center" }}>
                <svg ref={barcodeRef} style={{ maxWidth: "100%", height: "auto", display: "block" }}></svg>
              </div>
              <button onClick={printTicket} style={{
                backgroundColor: COLOR_SEGURIDAD, color: "#fff", border: "none", padding: "0.45rem 1rem",
                borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: "0.35rem", marginTop: "0.25rem"
              }}>
                <FiPrinter size={14} /> Imprimir Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
