import { useState, useEffect, useRef, useMemo } from 'react'
import JsBarcode from 'jsbarcode'
import { FiTruck, FiPackage, FiPlus, FiCalendar, FiUser, FiLogOut, FiSearch, FiShoppingCart, FiCheck, FiAlertCircle, FiRefreshCw, FiEye, FiTrash2, FiFileText, FiChevronDown, FiChevronUp, FiPrinter, FiX } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import DataList from '../../components/common/DataList'
import { getActiveCartLoans, getAllCartLoans, createCartLoan, returnCartLoan, listCartAssets, listSecurityApartments, updateCartState } from '../../services/SeguridadApi'

const COLOR = "#f59e0b"
const COLOR_BG = "rgba(245,158,11,0.12)"

const states = {
  DISPONIBLE: { label: "Disponible", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  EN_USO: { label: "En uso", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  MANTENIMIENTO: { label: "Mantenimiento", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
}

const styles = {
  container: { padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box" },
  card: { backgroundColor: "#fff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" },
  cardHeader: { padding: "0.85rem 1.25rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" },
  input: { width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.9rem", color: "#0f172a", backgroundColor: "#fff", boxSizing: "border-box", outline: "none" },
  label: { display: "block", fontSize: "0.7rem", fontWeight: "700", color: "#475569", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.04em" },
  select: { width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.9rem", color: "#0f172a", backgroundColor: "#fff", outline: "none" },
  badge: (bg, color) => ({ fontSize: "0.7rem", fontWeight: "700", padding: "0.22rem 0.55rem", borderRadius: "0.35rem", display: "inline-flex", alignItems: "center", gap: "0.25rem", backgroundColor: bg, color }),
  tab: (active, color = COLOR) => ({ padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", border: "none", backgroundColor: active ? color : "#f1f5f9", color: active ? "#fff" : "#94a3b8", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "0.35rem" }),
  btnPrimary: { backgroundColor: COLOR, color: "#fff", border: "none", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem", transition: "all 0.2s" },
  btnSuccess: { backgroundColor: "#10b981", color: "#fff", border: "none", padding: "0.45rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem" },
  btnDanger: { backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "0.45rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem" },
  btnOutline: { backgroundColor: "#fff", color: "#475569", border: "1px solid #cbd5e1", padding: "0.45rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem" },
  modalOverlay: { position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, backdropFilter: "blur(4px)" },
  modalBox: { backgroundColor: "#fff", borderRadius: "1.25rem", width: "100%", maxWidth: "500px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto" },
}

const thStyle = { padding: "0.55rem 0.75rem", textAlign: "left", fontWeight: 700, color: "#475569", fontSize: "0.65rem", textTransform: "uppercase", whiteSpace: "nowrap" }
const tdStyle = { padding: "0.55rem 0.75rem", color: "#0f172a", whiteSpace: "nowrap" }

const fmtDate = (iso) => {
  if (!iso) return '—'
  try { const d = new Date(iso); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` } catch { return iso }
}

const PER_PAGE = 10

export default function Prestamos() {
  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500) }
  const [loading, setLoading] = useState(true)
  const [carts, setCarts] = useState([])
  const [activeLoans, setActiveLoans] = useState([])
  const [allLoans, setAllLoans] = useState([])
  const [apartments, setApartments] = useState([])
  const [tab, setTab] = useState("gestion")

  // Form
  const [form, setForm] = useState({ codigoCarrito: "", idApartamento: "", numeroApartamento: "", nombreSolicitante: "", dniSolicitante: "", solicitante: "PROPIETARIO", idPropietario: "", idInquilino: "" })
  const [cartFilters, setCartFilters] = useState({ torre: "", piso: "", aptId: "" })
  const [cartCodigoText, setCartCodigoText] = useState("")
  const [cartTorreText, setCartTorreText] = useState("")
  const [cartPisoText, setCartPisoText] = useState("")
  const [cartAptText, setCartAptText] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [loadingRet, setLoadingRet] = useState(null)

  // Loan form collapse
  const [formOpen, setFormOpen] = useState(false)

  // Carts table
  const [cartSearch, setCartSearch] = useState("")
  const [cartPage, setCartPage] = useState(1)

  // Search & pagination history
  const [searchHist, setSearchHist] = useState("")
  const [histPage, setHistPage] = useState(1)

  // Ticket modal
  const [ticket, setTicket] = useState(null)
  const barcodeRef = useRef(null)

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState(null)

  const towers = useMemo(() => [...new Set(apartments.map(a => a.torreNombre).filter(Boolean))], [apartments])

  const floors = useMemo(() =>
    [...new Set(apartments.filter(a => !cartFilters.torre || a.torreNombre === cartFilters.torre).map(a => a.pisoNumero).filter(Boolean))],
    [apartments, cartFilters.torre]
  )

  const filteredApts = useMemo(() =>
    apartments.filter(a =>
      (!cartFilters.torre || a.torreNombre === cartFilters.torre) &&
      (!cartFilters.piso || String(a.pisoNumero) === cartFilters.piso)
    ),
    [apartments, cartFilters]
  )

  const loadAll = async () => {
    setLoading(true)
    try {
      const [c, a, active, hist] = await Promise.all([
        listCartAssets().catch(() => []),
        listSecurityApartments().catch(() => []),
        getActiveCartLoans().catch(() => []),
        getAllCartLoans().catch(() => []),
      ])
      setCarts(Array.isArray(c) ? c : [])
      setApartments(Array.isArray(a) ? a : [])
      setActiveLoans(Array.isArray(active) ? active : [])
      setAllLoans(Array.isArray(hist) ? hist : [])
    } catch { showToast("Error al cargar datos", "error") }
    finally { setLoading(false) }
  }

  useEffect(() => { loadAll() }, [])

  useEffect(() => { if (tab === "history" && allLoans.length === 0) getAllCartLoans().then(d => setAllLoans(Array.isArray(d) ? d : [])).catch(() => {}) }, [tab])

  // --- Cart state change ---
  const handleCartState = async (item, estado) => {
    if (estado === (item.estado || 'DISPONIBLE')) return
    try {
      await updateCartState(item.id, estado)
      showToast(`Estado: ${states[estado]?.label || estado}`)
      listCartAssets().then(d => setCarts(Array.isArray(d) ? d : [])).catch(() => {})
    } catch (e) { showToast(e.message, "error") }
  }

  // --- Delete cart ---
  const handleDeleteCart = async () => {
    if (!confirmDelete) return
    try {
      // No hay endpoint para eliminar carrito desde seguridad, solo lo ocultamos del estado
      showToast("Eliminación no disponible desde seguridad", "error")
      setConfirmDelete(null)
    } catch (e) { showToast(e.message, "error") }
  }

  // --- Create loan ---
  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.codigoCarrito || !form.numeroApartamento || !form.nombreSolicitante || !form.dniSolicitante)
      return showToast("Completa todos los campos requeridos", "error")
    setSubmitting(true)
    try {
      const resp = await createCartLoan({
        codigoCarrito: form.codigoCarrito.trim().toUpperCase(),
        numeroApartamento: Number(form.numeroApartamento),
        nombreSolicitante: form.nombreSolicitante.trim(),
        dniSolicitante: form.dniSolicitante.trim(),
        solicitante: form.solicitante,
        idPropietario: form.solicitante === 'PROPIETARIO' && form.idPropietario ? Number(form.idPropietario) : null,
        idInquilino: form.solicitante === 'INQUILINO' && form.idInquilino ? Number(form.idInquilino) : null,
      })
      const apt = apartments.find(a => String(a.id) === form.idApartamento)
      openTicket({ ...resp, aptNumero: form.numeroApartamento, aptTorre: apt?.torreNombre || "", aptPiso: apt?.pisoNumero || "" })
      showToast("Préstamo registrado exitosamente")
      setForm({ codigoCarrito: "", idApartamento: "", numeroApartamento: "", nombreSolicitante: "", dniSolicitante: "", solicitante: "PROPIETARIO", idPropietario: "", idInquilino: "" })
      setCartFilters({ torre: "", piso: "", aptId: "" })
      setCartCodigoText(""); setCartTorreText(""); setCartPisoText(""); setCartAptText("")
      loadAll()
    } catch (e) { showToast(e.message, "error") }
    finally { setSubmitting(false) }
  }

  // --- Ticket with barcode ---
  const openTicket = (data) => {
    setTicket(data)
    setTimeout(() => {
      if (barcodeRef.current) {
        try {
          JsBarcode(barcodeRef.current, `TKT-CRT-${data.id}`, {
            format: "CODE128", width: 1.5, height: 50, displayValue: true, fontSize: 11, margin: 5
          })
        } catch (e) { console.error('Barcode error:', e) }
      }
    }, 100)
  }

  const printCartTicket = () => {
    const content = document.getElementById('ticket-content')
    if (!content) return
    const win = window.open('', '_blank')
    win.document.write(`
      <html><head><title>Comprobante de Préstamo</title>
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

  // --- Return loan ---
  const handleReturn = async id => {
    setLoadingRet(id)
    try { await returnCartLoan(id); showToast("Carrito devuelto"); setActiveLoans(prev => prev.filter(p => p.id !== id)); loadAll() }
    catch (e) { showToast(e.message, "error") }
    finally { setLoadingRet(null) }
  }

  // --- Carts filtered & paginated ---
  const filteredCarts = useMemo(() => {
    if (!cartSearch) return carts
    const q = cartSearch.toLowerCase()
    return carts.filter(c => c.codigo?.toLowerCase().includes(q) || c.estado?.toLowerCase().includes(q) || String(c.id).includes(q))
  }, [carts, cartSearch])

  const pagedCarts = useMemo(() => {
    const start = (cartPage - 1) * PER_PAGE
    return filteredCarts.slice(start, start + PER_PAGE)
  }, [filteredCarts, cartPage])

  const totalCartPages = useMemo(() => Math.max(1, Math.ceil(filteredCarts.length / PER_PAGE)), [filteredCarts])

  // --- History filtered & paginated ---
  const historialFiltrado = useMemo(() => {
    if (!searchHist) return allLoans
    const q = searchHist.toLowerCase()
    return allLoans.filter(p =>
      p.nombreSolicitante?.toLowerCase().includes(q) ||
      p.dniSolicitante?.toLowerCase().includes(q) ||
      p.codigoCarrito?.toLowerCase().includes(q) ||
      p.solicitante?.toLowerCase().includes(q)
    )
  }, [allLoans, searchHist])

  const pagedHistory = useMemo(() => {
    const start = (histPage - 1) * PER_PAGE
    return historialFiltrado.slice(start, start + PER_PAGE)
  }, [historialFiltrado, histPage])

  const totalHistPages = useMemo(() => Math.max(1, Math.ceil(historialFiltrado.length / PER_PAGE)), [historialFiltrado])

  // --- Pagination component ---
  const Pagination = ({ total, page, setPage }) => {
    if (total <= 1) return null
    const pages = []
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= page - 1 && i <= page + 1)) pages.push(i)
      else if (pages[pages.length - 1] !== '...') pages.push('...')
    }
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", padding: "0.75rem", borderTop: "1px solid #f1f5f9" }}>
        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
          style={{ padding: "0.3rem 0.6rem", borderRadius: "0.4rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: page <= 1 ? "#cbd5e1" : "#475569", fontSize: "0.7rem", fontWeight: 600, cursor: page <= 1 ? "not-allowed" : "pointer" }}>
          Atrás
        </button>
        {pages.map((p, i) =>
          p === '...' ? <span key={`e${i}`} style={{ fontSize: "0.7rem", color: "#94a3b8" }}>...</span> :
          <button key={p} onClick={() => setPage(p)}
            style={{ padding: "0.3rem 0.6rem", borderRadius: "0.4rem", border: "none", backgroundColor: p === page ? COLOR : "#f1f5f9", color: p === page ? "#fff" : "#64748b", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", minWidth: "28px" }}>
            {p}
          </button>
        )}
        <button onClick={() => setPage(Math.min(total, page + 1))} disabled={page >= total}
          style={{ padding: "0.3rem 0.6rem", borderRadius: "0.4rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: page >= total ? "#cbd5e1" : "#475569", fontSize: "0.7rem", fontWeight: 600, cursor: page >= total ? "not-allowed" : "pointer" }}>
          Siguiente
        </button>
      </div>
    )
  }

  return (
    <div className="pr-container" style={styles.container}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: slideIn 0.3s ease both; }
        .btn-hover:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(245,158,11,0.3); }
        @media (max-width: 768px) {
          .pr-container { padding: 1rem !important; }
          .pr-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pr-form-grid { grid-template-columns: 1fr !important; }
          .pr-search-input { width: 100% !important; }
          .pr-tabs-wrap { flex-wrap: wrap !important; }
          .pr-modal-box { max-width: 95vw !important; margin: 0 0.5rem !important; }
          .pr-table table { font-size: 0.65rem !important; }
          .pr-table th, .pr-table td { padding: 0.4rem 0.5rem !important; }
        }
        @media (max-width: 480px) {
          .pr-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {toast && (
        <div style={{
          position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 1300,
          backgroundColor: toast.type === 'error' ? "#ef4444" : toast.type === 'warning' ? "#f59e0b" : "#10b981",
          color: "#fff", padding: "0.85rem 1.25rem", borderRadius: "0.75rem",
          fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center",
          gap: "0.6rem", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
          animation: "slideIn 0.3s ease",
        }}>
          {toast.type === 'error' ? <FiAlertCircle size={18} /> : <FiCheck size={18} />}
          {toast.msg}
        </div>
      )}

      <EncabezadoTabla
        titulo="Préstamos de Carritos"
        subtitulo={`${carts.length} carritos · ${activeLoans.length} préstamos activos`}
        action={
          <button onClick={loadAll}
            style={{ ...styles.btnOutline, padding: "0.5rem 1rem" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f1f5f9"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}>
            <FiRefreshCw size={14} /> Actualizar
          </button>
        }
      />

      <div className="pr-tabs-wrap" style={{ display: "flex", gap: "0.35rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {[
          { id: "gestion", label: "Gestión", icon: <FiTruck size={13} /> },
          { id: "history", label: "Historial", icon: <FiCalendar size={13} /> },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={styles.tab(tab === t.id, COLOR)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="fade-in">

        {/* ===== TAB: GESTIÓN (Carritos + Activos + Nuevo Préstamo) ===== */}
        {tab === "gestion" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Stats bar */}
            <div className="pr-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem" }}>
              {[
                { label: "Carritos", value: carts.length, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
                { label: "Disponibles", value: carts.filter(c => c.estado === 'DISPONIBLE').length, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
                { label: "En uso", value: carts.filter(c => c.estado === 'EN_USO').length, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
                { label: "Mantenimiento", value: carts.filter(c => c.estado === 'MANTENIMIENTO').length, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
                { label: "Préstamos Activos", value: activeLoans.length, color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
              ].map(s => (
                <div key={s.label} style={{ backgroundColor: "#fff", borderRadius: "0.75rem", border: "1px solid #e2e8f0", padding: "0.85rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ backgroundColor: s.bg, padding: "0.5rem", borderRadius: "0.5rem" }}>
                    <FiPackage size={16} color={s.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Nuevo Préstamo */}
            <div style={styles.card}>
              <div style={{ ...styles.cardHeader, cursor: "pointer" }} onClick={() => setFormOpen(!formOpen)}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiPlus size={15} color={COLOR} />
                  <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>Nuevo Préstamo</span>
                </div>
                <span style={{ color: formOpen ? COLOR : "#94a3b8", transition: "transform 0.2s", transform: formOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                  {formOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                </span>
              </div>
              {formOpen && (
                <form onSubmit={handleSubmit} className="pr-form-grid" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  <div>
                    <label style={styles.label}>Carrito</label>
                    <DataList value={cartCodigoText} onChange={e => { setCartCodigoText(e.target.value); setForm(f => ({ ...f, codigoCarrito: e.target.value })) }} required style={styles.select}>
                      <option value="">Seleccionar carrito</option>
                      {carts.filter(c => c.estado === 'DISPONIBLE' && c.codigo).map(c => <option key={c.id} value={c.codigo} />)}
                    </DataList>
                  </div>
                  <div>
                    <label style={styles.label}>Torre</label>
                    <DataList value={cartTorreText} onChange={e => { setCartTorreText(e.target.value); setCartFilters(f => ({ ...f, torre: e.target.value, piso: '', aptId: '' })) }} style={{ ...styles.select, fontSize: "0.7rem" }}>
                      <option value="">Torre</option>
                      {towers.map(t => <option key={t} value={t} />)}
                    </DataList>
                  </div>
                  <div>
                    <label style={styles.label}>Piso</label>
                    <DataList value={cartPisoText} onChange={e => { setCartPisoText(e.target.value); setCartFilters(f => ({ ...f, piso: e.target.value, aptId: '' })) }} style={{ ...styles.select, fontSize: "0.7rem" }}>
                      <option value="">Piso</option>
                      {floors.map(f => <option key={f} value={f} />)}
                    </DataList>
                  </div>
                  <div>
                    <label style={styles.label}>Departamento</label>
                    <DataList value={cartAptText} onChange={e => {
                      setCartAptText(e.target.value)
                      const apt = apartments.find(a => `N° ${a.numero}` === e.target.value || String(a.numero) === e.target.value)
                      if (apt) {
                        setCartFilters(f => ({ ...f, aptId: String(apt.id) }))
                        setForm(f => ({ ...f, idApartamento: String(apt.id), numeroApartamento: apt.numero, idPropietario: apt.idPropietario || '', nombreSolicitante: apt.nombrePropietario || '', solicitante: 'PROPIETARIO', dniSolicitante: '' }))
                      } else {
                        setCartFilters(f => ({ ...f, aptId: '' }))
                        setForm(f => ({ ...f, idApartamento: '', numeroApartamento: '', idPropietario: '', nombreSolicitante: '', solicitante: 'PROPIETARIO', dniSolicitante: '' }))
                      }
                    }} style={{ ...styles.select, fontSize: "0.7rem" }}>
                      <option value="">Departamento</option>
                      {filteredApts.map(a => <option key={a.id} value={`N° ${a.numero}`} />)}
                    </DataList>
                  </div>
                  {cartFilters.aptId && (() => {
                    const apt = apartments.find(a => String(a.id) === cartFilters.aptId)
                    if (!apt) return null
                    const occupants = []
                    if (apt.nombrePropietario) occupants.push({ label: `${apt.nombrePropietario} (Dueño)`, nombre: apt.nombrePropietario, tipo: 'PROPIETARIO', id: apt.idPropietario, dni: '' })
                    if (apt.inquilinos) apt.inquilinos.forEach(inq => occupants.push({ label: `${inq.nombres} ${inq.apellidos} (Inquilino)`, nombre: `${inq.nombres} ${inq.apellidos}`, tipo: 'INQUILINO', id: inq.id, dni: inq.numeroDocumento }))
                    return occupants.length > 0 ? (
                      <div>
                        <label style={styles.label}>Ocupante de N° {apt.numero}</label>
                        <select style={styles.select} value={`${form.solicitante}|${form.nombreSolicitante}`} onChange={e => {
                          const sel = occupants.find(o => `${o.tipo}|${o.nombre}` === e.target.value)
                          if (sel) setForm(f => ({
                            ...f, solicitante: sel.tipo, nombreSolicitante: sel.nombre,
                            dniSolicitante: sel.dni || '',
                            idPropietario: sel.tipo === 'PROPIETARIO' ? (sel.id || '') : '',
                            idInquilino: sel.tipo === 'INQUILINO' ? (sel.id || '') : ''
                          }))
                        }}>
                          <option value="">Seleccionar ocupante</option>
                          {occupants.map(o => <option key={o.nombre} value={`${o.tipo}|${o.nombre}`}>{o.label}{o.dni ? `  · DNI: ${o.dni}` : ''}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8", textAlign: "center", padding: "0.5rem" }}>
                        Sin ocupantes registrados en N° {apt.numero}
                      </div>
                    )
                  })()}
                  <div>
                    <label style={styles.label}>Nombre del solicitante</label>
                    <input style={styles.input} placeholder="Nombre completo" value={form.nombreSolicitante} onChange={e => setForm(f => ({ ...f, nombreSolicitante: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={styles.label}>DNI</label>
                    <input style={styles.input} placeholder="00000000" value={form.dniSolicitante} onChange={e => setForm(f => ({ ...f, dniSolicitante: e.target.value }))} required />
                  </div>
                  {carts.filter(c => c.estado === 'DISPONIBLE').length === 0 && (
                    <div style={{ fontSize: "0.75rem", color: "#ef4444" }}>No hay carritos disponibles</div>
                  )}
                  <button type="submit" disabled={submitting || carts.filter(c => c.estado === 'DISPONIBLE').length === 0}
                    style={{ ...styles.btnPrimary, justifyContent: "center", padding: "0.7rem", opacity: submitting ? 0.5 : 1 }}>
                    {submitting ? "Registrando..." : "Prestar Carrito"}
                  </button>
                </form>
              )}
            </div>

            {/* Préstamos Activos */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiPackage size={15} color={COLOR} />
                  <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>Préstamos Activos</span>
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>({activeLoans.length})</span>
                </div>
              </div>
              {activeLoans.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                  <FiShoppingCart size={28} style={{ opacity: 0.3, marginBottom: "0.5rem" }} />
                  <p style={{ fontWeight: 600, fontSize: "0.85rem", margin: 0 }}>Sin préstamos activos</p>
                </div>
              ) : (
                <div className="pr-table" style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ backgroundColor: "#f8fafc" }}>
                      {["Carrito", "Solicitante", "DNI", "Fecha", "Acción"].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {activeLoans.map(p => (
                        <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ ...tdStyle, fontWeight: 700, fontFamily: "monospace" }}>{p.codigoCarrito}</td>
                          <td style={tdStyle}><FiUser size={12} style={{ marginRight: 4, color: "#94a3b8" }} />{p.nombreSolicitante}</td>
                          <td style={{ ...tdStyle, fontFamily: "monospace" }}>{p.dniSolicitante}</td>
                          <td style={{ ...tdStyle, fontSize: "0.8rem" }}>{fmtDate(p.fechaPrestamo)}</td>
                          <td style={tdStyle}>
                            <button onClick={() => handleReturn(p.id)} disabled={loadingRet === p.id}
                              style={{ ...styles.btnDanger, padding: "0.35rem 0.85rem", opacity: loadingRet === p.id ? 0.5 : 1 }}>
                              <FiLogOut size={12} /> {loadingRet === p.id ? "..." : "Devolver"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Carritos inventory */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiTruck size={16} color={COLOR} />
                  <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>Inventario de Carritos</span>
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>({carts.length})</span>
                </div>
                <div style={{ position: "relative" }}>
                  <FiSearch size={13} style={{ position: "absolute", left: "0.5rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input type="text" placeholder="Buscar carrito..." value={cartSearch} onChange={e => { setCartSearch(e.target.value); setCartPage(1) }}
                    className="pr-search-input"
                    style={{ ...styles.input, padding: "0.35rem 0.5rem 0.35rem 1.6rem", fontSize: "0.75rem", width: "160px" }} />
                </div>
              </div>
              {loading ? (
                <div style={{ textAlign: "center", padding: "2.5rem", color: "#94a3b8" }}>
                  <FiRefreshCw size={24} style={{ opacity: 0.3 }} />
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: "0.5rem 0 0" }}>Cargando...</p>
                </div>
              ) : (
                <>
                  <div className="pr-table" style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                          <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 700, color: "#475569", fontSize: "0.65rem", textTransform: "uppercase", whiteSpace: "nowrap" }}>Código</th>
                          <th style={{ padding: "0.75rem", textAlign: "left", fontWeight: 700, color: "#475569", fontSize: "0.65rem", textTransform: "uppercase", whiteSpace: "nowrap" }}>Estado</th>
                          <th style={{ padding: "0.75rem 1rem", textAlign: "right", fontWeight: 700, color: "#475569", fontSize: "0.65rem", textTransform: "uppercase", whiteSpace: "nowrap" }}>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagedCarts.map(c => (
                          <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "0.75rem 1rem", fontWeight: 700, fontFamily: "monospace", color: "#0f172a" }}>{c.codigo || `#${c.id}`}</td>
                            <td style={{ padding: "0.75rem" }}>
                              <select value={c.estado || 'DISPONIBLE'} onChange={e => handleCartState(c, e.target.value)}
                                style={{ fontSize: "0.7rem", fontWeight: 700, padding: "0.25rem 0.5rem", borderRadius: "0.4rem", border: "none", cursor: "pointer", outline: "none", backgroundColor: states[c.estado]?.bg || states.DISPONIBLE.bg, color: states[c.estado]?.color || states.DISPONIBLE.color }}>
                                <option value="DISPONIBLE">Disponible</option>
                                <option value="EN_USO">En uso</option>
                                <option value="MANTENIMIENTO">Mantenimiento</option>
                              </select>
                            </td>
                            <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                              <button onClick={() => setConfirmDelete({ id: c.id, tipo: 'CARRITO' })}
                                style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", padding: "0.3rem 0.55rem", borderRadius: "0.4rem", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer" }}>
                                <FiTrash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {pagedCarts.length === 0 && (
                          <tr><td colSpan={3} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Sin carritos</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Pagination total={totalCartPages} page={cartPage} setPage={setCartPage} />
                </>
              )}
            </div>

          </div>
        )}

        {/* ===== TAB: HISTORIAL ===== */}
        {tab === "history" && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>Historial Completo ({allLoans.length})</span>
              <div style={{ position: "relative" }}>
                <FiSearch size={13} style={{ position: "absolute", left: "0.5rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input type="text" placeholder="Buscar..." value={searchHist} onChange={e => { setSearchHist(e.target.value); setHistPage(1) }}
                  style={{ ...styles.input, padding: "0.35rem 0.5rem 0.35rem 1.6rem", fontSize: "0.75rem", width: "180px" }} />
              </div>
            </div>
            {allLoans.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2.5rem", color: "#94a3b8" }}>
                <FiCalendar size={32} style={{ opacity: 0.3, marginBottom: "0.5rem" }} />
                <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>{searchHist ? "Sin resultados" : "Sin historial"}</p>
              </div>
            ) : (
              <>
                <div className="pr-table" style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.72rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                        <th style={thStyle}>#</th>
                        <th style={thStyle}>Carrito</th>
                        <th style={thStyle}>Solicitante</th>
                        <th style={thStyle}>Tipo</th>
                        <th style={thStyle}>Departamento</th>
                        <th style={thStyle}>Torre</th>
                        <th style={thStyle}>Piso</th>
                        <th style={thStyle}>Préstamo</th>
                        <th style={thStyle}>Devolución</th>
                        <th style={thStyle}>Estado</th>
                        <th style={{ ...thStyle, textAlign: "right" }}>Ticket</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedHistory.map((p, i) => {
                        const apt = apartments.find(a => String(a.id) === String(p.idApartamento))
                        return (
                          <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={tdStyle}>{(histPage - 1) * PER_PAGE + i + 1}</td>
                            <td style={{ ...tdStyle, fontWeight: 700, fontFamily: "monospace" }}>{p.codigoCarrito || '—'}</td>
                            <td style={tdStyle}>{p.nombreSolicitante}<br /><span style={{ color: "#94a3b8" }}>{p.dniSolicitante}</span></td>
                            <td style={tdStyle}>
                              {p.solicitante === 'PROPIETARIO'
                                ? <span style={styles.badge("#e0e7ff", "#4338ca")}>Dueño</span>
                                : <span style={styles.badge("#fef3c7", "#d97706")}>Inquilino</span>}
                            </td>
                            <td style={tdStyle}>N° {apt?.numero || '—'}</td>
                            <td style={tdStyle}>{apt?.torreNombre || '—'}</td>
                            <td style={tdStyle}>{apt?.pisoNumero != null ? `Piso ${apt.pisoNumero}` : '—'}</td>
                            <td style={{ ...tdStyle, fontSize: "0.8rem" }}>{fmtDate(p.fechaPrestamo)}</td>
                            <td style={{ ...tdStyle, fontSize: "0.8rem" }}>{fmtDate(p.fechaDevolucion)}</td>
                            <td style={tdStyle}>
                              {p.fechaDevolucion
                                ? <span style={styles.badge("#dcfce7", "#16a34a")}>Devuelto</span>
                                : <span style={styles.badge("#fef3c7", "#d97706")}>Activo</span>}
                            </td>
                            <td style={{ ...tdStyle, textAlign: "right" }}>
                              <button onClick={() => {
                                const a = apartments.find(x => String(x.id) === String(p.idApartamento))
                                openTicket({ ...p, aptNumero: a?.numero || '—', aptTorre: a?.torreNombre || '—', aptPiso: a?.pisoNumero || '—' })
                              }} style={{ background: "none", border: "none", cursor: "pointer", color: COLOR }} title="Ver ticket">
                                <FiEye size={15} />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <Pagination total={totalHistPages} page={histPage} setPage={setHistPage} />
              </>
            )}
          </div>
        )}

      </div>

      {/* ===== TICKET MODAL ===== */}
      {ticket && (
        <div style={styles.modalOverlay} onClick={() => setTicket(null)}>
          <div className="pr-modal-box" style={{ ...styles.modalBox, maxWidth: "420px" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiFileText size={15} color={COLOR} />
                Comprobante de Préstamo
              </h3>
              <button onClick={() => setTicket(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>
            <div id="ticket-content" style={{ padding: "1.25rem", textAlign: "center", fontFamily: "'Courier New', monospace" }}>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.2rem" }}>SGC - Préstamo de Carrito</div>
              <div style={{ fontSize: "0.65rem", color: "#475569", marginBottom: "0.5rem" }}>Sistema de Gestión de Condominios</div>
              <hr style={{ border: "1px dashed #d1d5db", margin: "0.4rem 0" }} />
              <div style={{ fontSize: "0.75rem", textAlign: "left", margin: "0.4rem 0" }}>
                {[
                  { l: 'Ticket #', v: `TKT-CRT-${ticket.id}` },
                  { l: 'Carrito', v: ticket.codigoCarrito || '—' },
                  { l: 'Solicitante', v: ticket.nombreSolicitante || '—' },
                  { l: 'DNI', v: ticket.dniSolicitante || '—' },
                  { l: 'Departamento', v: `N° ${ticket.aptNumero || ticket.numeroApartamento || '—'}` },
                  { l: 'Torre', v: ticket.aptTorre || '—' },
                  { l: 'Piso', v: ticket.aptPiso != null ? `${ticket.aptPiso}` : '—' },
                  { l: 'Préstamo', v: fmtDate(ticket.fechaPrestamo) },
                  { l: 'Devolución', v: ticket.fechaDevolucion ? fmtDate(ticket.fechaDevolucion) : 'En curso' },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.15rem 0" }}>
                    <span style={{ color: "#475569" }}>{r.l}:</span>
                    <span style={{ fontWeight: 700, color: "#0f172a" }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <hr style={{ border: "1px dashed #d1d5db", margin: "0.4rem 0" }} />
              <div className="barcode" style={{ margin: "0.5rem auto", overflow: "hidden", display: "flex", justifyContent: "center" }}>
                <svg ref={barcodeRef} style={{ maxWidth: "100%", height: "auto", display: "block" }}></svg>
              </div>
              <button onClick={printCartTicket} style={{
                backgroundColor: COLOR, color: "#fff", border: "none", padding: "0.45rem 1rem",
                borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: "0.35rem", marginTop: "0.25rem"
              }}>
                <FiPrinter size={14} /> Imprimir Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM ===== */}
      {confirmDelete && (
        <div style={styles.modalOverlay} onClick={() => setConfirmDelete(null)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", color: "#ef4444", marginBottom: "0.5rem" }}><FiAlertCircle /></div>
              <h3 style={{ margin: "0 0 0.25rem", fontSize: "1rem", fontWeight: 800, color: "#1e293b" }}>Confirmar</h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
                {confirmDelete.tipo === 'CARRITO' ? '¿Confirmar acción?' : '¿Confirmar acción?'}
              </p>
            </div>
            <div style={{ padding: "0 1.5rem 1.5rem", display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button onClick={() => setConfirmDelete(null)} style={styles.btnOutline}>Cancelar</button>
              <button onClick={handleDeleteCart} style={styles.btnDanger}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}