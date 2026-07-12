import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { FiGrid, FiHome, FiTruck, FiPlus, FiX, FiEye, FiTrash2, FiCheck, FiAlertCircle, FiTool, FiUsers, FiRefreshCw, FiPrinter, FiLogIn, FiLogOut, FiSearch, FiCalendar, FiNavigation2, FiClock, FiSettings, FiSave, FiEdit3, FiUser, FiUserPlus, FiChevronUp, FiChevronDown, FiFileText, FiMapPin } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import DataList from '../../components/common/DataList'
import {
  getCondominiums, getAdminAssets, createAdminAsset, updateAdminAssetStatus, deleteAdminAsset,
  getAdminApartments, extractItems, getAdminVehicles, getSecurityDashboard, getActiveCartLoans,
  registerVehicleEntry, registerVehicleExit, assignAssetApartment, getAdminAccessLogs, unassignVehicleFromSpot,
  registerCartLoan, returnCartLoan, createAdminVehicle, deleteAdminVehicle, getAllCartLoans
} from '../../services/api'
import JsBarcode from 'jsbarcode'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'

const colorSuper = "rgb(124,58,237)"

const brandModels = {
  TOYOTA: ['4RUNNER', 'AGYA', 'CAMRY', 'COROLLA', 'ETIOS', 'FORTUNER', 'HILUX', 'LAND CRUISER', 'RAV4', 'YARIS'],
  HONDA: ['ACCORD', 'CITY', 'CR-V', 'CIVIC', 'HR-V', 'ODYSSEY', 'PILOT'],
  NISSAN: ['ALTIMA', 'FRONTIER', 'KICKS', 'MARCH', 'NP300', 'SENTRA', 'VERSA', 'X-TRAIL'],
  CHEVROLET: ['AVEO', 'CAMARO', 'CAPTIVA', 'CRUZE', 'EQUINOX', 'GROOVE', 'ONIX', 'SAIL', 'SPARK', 'TRACKER', 'TRAILBLAZER'],
  FORD: ['ECOSPORT', 'EDGE', 'ESCAPE', 'EXPLORER', 'F-150', 'FIESTA', 'FOCUS', 'MUSTANG', 'RANGER', 'TERRITORY'],
  HYUNDAI: ['ACCENT', 'AZERA', 'CRETA', 'ELANTRA', 'GRAND I10', 'SANTA FE', 'SONATA', 'TUCSON', 'VENUE'],
  VOLKSWAGEN: ['AMAROK', 'BEETLE', 'BORA', 'GOL', 'GOLF', 'JETTA', 'NIVUS', 'PASSAT', 'POLO', 'SANTANA', 'T-CROSS', 'TIGUAN', 'VENTO', 'VIRTUS'],
  BMW: ['1 SERIES', '2 SERIES', '3 SERIES', '4 SERIES', '5 SERIES', 'X1', 'X3', 'X5', 'X6'],
  'MERCEDES-BENZ': ['A-CLASS', 'B-CLASS', 'C-CLASS', 'CLA', 'E-CLASS', 'GLA', 'GLB', 'GLC', 'GLE', 'S-CLASS'],
  AUDI: ['A1', 'A3', 'A4', 'A5', 'A6', 'Q2', 'Q3', 'Q5', 'Q7'],
  KIA: ['CERATO', 'PICANTO', 'RIO', 'SELTOS', 'SORENTO', 'SOUL', 'SPORTAGE', 'STONIC'],
  MAZDA: ['2', '3', '6', 'BT-50', 'CX-30', 'CX-3', 'CX-5', 'CX-9'],
  SUZUKI: ['ALTO', 'BALENO', 'ERTIGA', 'GRAND VITARA', 'JIMNY', 'S-CROSS', 'SWIFT', 'VITARA'],
  MITSUBISHI: ['ASX', 'ECLIPSE CROSS', 'LANCER', 'MONTERO SPORT', 'OUTLANDER', 'MIRAGE'],
  RENAULT: ['CLIO', 'DUSTER', 'FLUENCE', 'KOLEOS', 'KWID', 'LOGAN', 'MEGANE', 'SANDERO', 'STEPWAY'],
  PEUGEOT: ['2008', '208', '3008', '308', '5008', '508'],
  CHERY: ['ARRIZO 5', 'ARRIZO 6', 'TIGGO 2', 'TIGGO 4', 'TIGGO 7', 'TIGGO 8', 'TIGGO 8 PRO'],
  MG: ['HS', 'MG3', 'MG5', 'MG6', 'MG ZS', 'RX8'],
  BYD: ['DOLPHIN', 'E2', 'E6', 'HAN', 'SEAL', 'TANG', 'YUAN PLUS'],
  OTRO: ['OTRO'],
}

const styles = {
  container: { padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box" },
  input: { width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.9rem", color: "#334155", backgroundColor: "#fff", boxSizing: "border-box", outline: "none" },
  label: { display: "block", fontSize: "0.7rem", fontWeight: "700", color: "#475569", marginBottom: "0.35rem", textTransform: "uppercase" },
  select: { width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.9rem", color: "#334155", backgroundColor: "#fff", outline: "none" },
  card: { backgroundColor: "#fff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" },
  cardHeader: { padding: "1rem 1.25rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" },
  btnPrimary: { backgroundColor: colorSuper, color: "#fff", border: "none", padding: "0.45rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" },
  btnSuccess: { backgroundColor: "#10b981", color: "#fff", border: "none", padding: "0.45rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" },
  btnDanger: { backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "0.45rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" },
  btnOutline: { backgroundColor: "#fff", color: "#475569", border: "1px solid #cbd5e1", padding: "0.45rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" },
  btnWarning: { backgroundColor: "#f59e0b", color: "#fff", border: "none", padding: "0.45rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" },
  modalOverlay: { position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" },
  modalBox: { backgroundColor: "#fff", borderRadius: "1.25rem", width: "100%", maxWidth: "560px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto" },
  tab: (active) => ({ padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", border: "none", backgroundColor: active ? colorSuper : "#f1f5f9", color: active ? "#fff" : "#64748b", transition: "all 0.2s" }),
  badge: (bg, color) => ({ fontSize: "0.7rem", fontWeight: "700", padding: "0.2rem 0.5rem", borderRadius: "0.35rem", display: "inline-block", backgroundColor: bg, color }),
}

const states = {
  DISPONIBLE: { label: "Disponible", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  EN_USO: { label: "En uso", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  MANTENIMIENTO: { label: "Mantenimiento", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
}

const thStyle = { padding: "0.55rem 0.75rem", textAlign: "left", fontWeight: 700, color: "#475569", fontSize: "0.65rem", textTransform: "uppercase", whiteSpace: "nowrap" }
const tdStyle = { padding: "0.55rem 0.75rem", color: "#334155", whiteSpace: "nowrap" }

const fmtDate = (iso) => {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const hour = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${day}/${month}/${year} ${hour}:${min}`
  } catch { return iso }
}

const coloresGradiente = [
  ['#7c3aed', '#6d28d9'],
  ['#ec4899', '#be185d'],
  ['#3b82f6', '#1d4ed8'],
  ['#10b981', '#047857'],
  ['#f59e0b', '#b45309'],
  ['#ef4444', '#b91c1c'],
  ['#06b6d4', '#0891b2'],
  ['#8b5cf6', '#6d28d9'],
]

const colorSwatch = (color) => {
  const map = { ROJO: "#ef4444", AZUL: "#3b82f6", VERDE: "#10b981", NEGRO: "#0f172a", BLANCO: "#f8fafc", GRIS: "#94a3b8", PLATEADO: "#cbd5e1", AMARILLO: "#eab308", NARANJA: "#f97316", MARRON: "#92400e", DORADO: "#b8860b", CELESTE: "#87ceeb", BEIGE: "#f5f5dc", VINO: "#722f37", ROSADO: "#ec4899", MORADO: colorSuper }
  return map[color?.toUpperCase()] || (color?.startsWith('#') ? color : `#${color}`) || "#cbd5e1"
}

export default function GlobalBienes() {
  const [condominios, setCondominios] = useState([])
  const [condoId, setCondoId] = useState('')
  const [showCardSelector, setShowCardSelector] = useState(false)
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
  const [loading, setLoading] = useState(true)
  const [loadingData, setLoadingData] = useState(false)
  const [parking, setParking] = useState([])
  const [carts, setCarts] = useState([])
  const [apartments, setApartments] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [logs, setLogs] = useState([])
  const [activeLoans, setActiveLoans] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [toast, setToast] = useState(null)
  const [showModal, setShowModal] = useState(null)
  const [detailItem, setDetailItem] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [ticket, setTicket] = useState(null)
  const [saving, setSaving] = useState(false)
  const [configForm, setConfigForm] = useState({ id: '', tipoVehiculo: 'AUTO', capacidadMaxima: 2 })
  const [entryForm, setEntryForm] = useState({ placa: '', metodo: 'OCR', ocupante: 'PROPIETARIO', datosInquilino: '', idEstacionamiento: '' })
  const [entryFilters, setEntryFilters] = useState({ torre: '', piso: '', aptId: '' })
  const [entryTorreText, setEntryTorreText] = useState('')
  const [entryPisoText, setEntryPisoText] = useState('')
  const [entryAptText, setEntryAptText] = useState('')
  const [entryPlacaText, setEntryPlacaText] = useState('')
  const [entryParkText, setEntryParkText] = useState('')
  const [reserveForm, setReserveForm] = useState({ placa: '', metodo: 'MANUAL', ocupante: 'PROPIETARIO', datosInquilino: '', idEstacionamiento: '', horas: 1 })
  const [reserveFilters, setReserveFilters] = useState({ torre: '', piso: '', aptId: '' })
  const [reserveTorreText, setReserveTorreText] = useState('')
  const [reservePisoText, setReservePisoText] = useState('')
  const [reserveAptText, setReserveAptText] = useState('')
  const [reservePlacaText, setReservePlacaText] = useState('')
  const [reserveParkText, setReserveParkText] = useState('')
  const [entryOpen, setEntryOpen] = useState(false)
  const [exitOpen, setExitOpen] = useState(false)
  const [reserveOpen, setReserveOpen] = useState(false)
  const [exitForm, setExitForm] = useState({ idLogAcceso: '' })
  const [exitLogText, setExitLogText] = useState('')
  const [assignForm, setAssignForm] = useState({ idEstacionamiento: '', idApartamento: '' })
  const [assignParkingText, setAssignParkingText] = useState('')
  const [assignAptText, setAssignAptText] = useState('')
  const [assignParkingOpen, setAssignParkingOpen] = useState(false)
  const [vehicleForm, setVehicleForm] = useState({ id: null, marca: '', color: 'BLANCO', modelo: '', placa: '', tipo: 'AUTO', inquilinoId: '' })
  const [vehInquilinoText, setVehInquilinoText] = useState('')
  const [cartLoanForm, setCartLoanForm] = useState({ codigoCarrito: '', idApartamento: '', numeroApartamento: '', nombreSolicitante: '', dniSolicitante: '', solicitante: 'PROPIETARIO', idPropietario: '', idInquilino: '' })
  const [cartFilters, setCartFilters] = useState({ torre: '', piso: '', aptId: '' })
  const [cartOpen, setCartOpen] = useState(false)
  const [cartCodigoCarritoText, setCartCodigoCarritoText] = useState('')
  const [cartTorreText, setCartTorreText] = useState('')
  const [cartPisoText, setCartPisoText] = useState('')
  const [cartAptText, setCartAptText] = useState('')
  const [createForm, setCreateForm] = useState({ tipo: 'ESTACIONAMIENTO', codigo: '', numero: '', tipoVehiculo: 'AUTO', capacidadMaxima: 2 })
  const [assignVehicleForm, setAssignVehicleForm] = useState({ idEstacionamiento: '', idVehiculo: '' })
  const [pickVehicleText, setPickVehicleText] = useState('')
  const [cartTicket, setCartTicket] = useState(null)
  const [allCartLoans, setAllCartLoans] = useState([])
  const [reservations, setReservations] = useState(() => {
    try { return JSON.parse(localStorage.getItem('reservations') || '[]') } catch { return [] }
  })
  const barcodeRef = useRef(null)
  const toastTimer = useRef(null)
  const PER_PAGE = 5
  const [logPage, setLogPage] = useState(1)
  const [logSearch, setLogSearch] = useState('')
  const [reservaPage, setReservaPage] = useState(1)
  const [reservaSearch, setReservaSearch] = useState('')
  const [vehiclePage, setVehiclePage] = useState(1)
  const [vehicleSearch, setVehicleSearch] = useState('')
  const [cartPage, setCartPage] = useState(1)
  const [cartSearch, setCartSearch] = useState('')
  const [loanPage, setLoanPage] = useState(1)
  const [loanSearch, setLoanSearch] = useState('')

  const paginate = (arr, page) => {
    const start = (page - 1) * PER_PAGE
    return arr.slice(start, start + PER_PAGE)
  }

  const totalPages = (arr) => Math.max(1, Math.ceil(arr.length / PER_PAGE))

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
          style={{ padding: "0.3rem 0.6rem", borderRadius: "0.4rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: page <= 1 ? "#cbd5e1" : "#475569", fontSize: "0.7rem", fontWeight: 600, cursor: page <= 1 ? "not-allowed" : "pointer" }}>
          Atrás
        </button>
        {pages.map((p, i) =>
          p === '...' ? <span key={`e${i}`} style={{ fontSize: "0.7rem", color: "#94a3b8" }}>...</span> :
            <button key={p} onClick={() => setPage(p)}
              style={{ padding: "0.3rem 0.6rem", borderRadius: "0.4rem", border: "none", backgroundColor: p === page ? colorSuper : "#f1f5f9", color: p === page ? "#fff" : "#64748b", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", minWidth: "28px" }}>
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

  const showToast = (msg, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ msg, type })
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    getCondominiums().then(d => setCondominios(extractItems(d))).catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    localStorage.setItem('reservations', JSON.stringify(reservations))
  }, [reservations])

  const loadData = useCallback(async (id) => {
    if (!id) return
    setLoadingData(true)
    try {
      const [p, c, a, v, l, d, loans, allLoans] = await Promise.all([
        getAdminAssets(id, 'ESTACIONAMIENTO', 0, 100),
        getAdminAssets(id, 'CARRITO', 0, 100),
        getAdminApartments(id).catch(() => ({ items: [] })),
        getAdminVehicles(id).catch(() => []),
        getAdminAccessLogs(id, { type: 'VEHICULAR', page: 0, size: 50 }).catch(() => ({ content: [] })),
        getSecurityDashboard(id).catch(() => null),
        getActiveCartLoans(id).catch(() => []),
        getAllCartLoans(id).catch(() => [])
      ])
      setParking(extractItems(p))
      setCarts(extractItems(c))
      setApartments(extractItems(a))
      setVehicles(Array.isArray(v) ? v : [])
      setLogs(l?.content || extractItems(l))
      setDashboard(d)
      setActiveLoans(Array.isArray(loans) ? loans : [])
      setAllCartLoans(Array.isArray(allLoans) ? allLoans : [])
    } catch (e) {
      showToast('Error: ' + e.message, 'error')
    } finally {
      setLoadingData(false)
    }
  }, [])

  useEffect(() => { loadData(condoId) }, [condoId, loadData])

  const condo = condominios.find(c => String(c.id) === String(condoId))

  const occupiedParkingIds = new Set(parking.filter(p => (p.cantidadActual || 0) > 0).map(p => String(p.id)))

  const allOccupants = React.useMemo(() => {
    const names = []
    apartments.forEach(apt => {
      if (apt.nombrePropietario) names.push({ label: `${apt.nombrePropietario} (Dueño, Apt ${apt.numero})`, nombre: apt.nombrePropietario, dni: '' })
      if (apt.inquilinos) apt.inquilinos.forEach(inq => {
        names.push({ label: `${inq.nombres} ${inq.apellidos} (Inquilino, Apt ${apt.numero})`, nombre: `${inq.nombres} ${inq.apellidos}`, dni: inq.numeroDocumento })
      })
    })
    return names
  }, [apartments])

  const towers = React.useMemo(() => [...new Set(apartments.map(a => a.torreNombre).filter(Boolean))], [apartments])
  const floors = React.useMemo(() => [...new Set(apartments.filter(a => !entryFilters.torre || a.torreNombre === entryFilters.torre).map(a => a.pisoNumero).filter(Boolean))], [apartments, entryFilters.torre])
  const filteredApts = React.useMemo(() => apartments.filter(a =>
    (!entryFilters.torre || a.torreNombre === entryFilters.torre) &&
    (!entryFilters.piso || String(a.pisoNumero) === entryFilters.piso) &&
    (!entryFilters.aptId || String(a.id) === entryFilters.aptId)
  ), [apartments, entryFilters])
  const filteredAptIds = React.useMemo(() => new Set(filteredApts.map(a => String(a.id))), [filteredApts])
  const vehicleOwnerMap = React.useMemo(() => {
    const map = {}
    vehicles.forEach(v => {
      if (v.idPropietario != null) {
        const apt = apartments.find(a => String(a.idPropietario) === String(v.idPropietario))
        if (apt) {
          map[v.id] = { nombre: apt.nombrePropietario || 'Propietario', tipo: 'PROPIETARIO', aptNumero: apt.numero, aptId: apt.id, dni: '' }
        }
      }
      if (v.idInquilino != null) {
        for (const apt of apartments) {
          const inq = apt.inquilinos?.find(i => String(i.id) === String(v.idInquilino))
          if (inq) {
            map[v.id] = { nombre: `${inq.nombres} ${inq.apellidos}`, tipo: 'INQUILINO', aptNumero: apt.numero, aptId: apt.id, dni: inq.numeroDocumento }
            break
          }
        }
      }
    })
    return map
  }, [vehicles, apartments])

  const allTenantsList = React.useMemo(() => {
    const list = []
    apartments.forEach(apt => {
      if (apt.inquilinos) apt.inquilinos.forEach(inq => {
        list.push({ ...inq, apartamentoNumero: apt.numero })
      })
    })
    return list
  }, [apartments])

  const stats = {
    totalParking: parking.length,
    disponibleParking: parking.filter(p => !vehicles.some(v => String(v.idEstacionamiento) === String(p.id))).length,
    ocupadoParking: parking.filter(p => vehicles.some(v => String(v.idEstacionamiento) === String(p.id))).length,
    capacidadTotal: parking.reduce((s, p) => s + (p.capacidadMaxima || 0), 0),
    ocupacionActual: parking.reduce((s, p) => s + (p.cantidadActual || 0), 0),
    totalCarts: carts.length,
    cartDisponible: carts.filter(c => c.estado === 'DISPONIBLE').length,
    cartEnUso: carts.filter(c => c.estado === 'EN_USO').length,
    cartMant: carts.filter(c => c.estado === 'MANTENIMIENTO').length,
    totalVehicles: vehicles.length,
    activeEntries: logs.filter(l => !l.fechaSalida),
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = createForm.tipo === 'ESTACIONAMIENTO'
        ? { tipo: 'ESTACIONAMIENTO', numero: createForm.numero ? Number(createForm.numero) : 1 }
        : { tipo: 'CARRITO', codigo: createForm.codigo || `CARR-${Date.now()}` }
      const created = await createAdminAsset(payload, condoId)
      if (createForm.tipo === 'ESTACIONAMIENTO' && created?.id) {
        await updateAdminAssetStatus(created.id, {
          tipo: 'ESTACIONAMIENTO', tipoVehiculo: createForm.tipoVehiculo, capacidadMaxima: Number(createForm.capacidadMaxima)
        }, condoId)
      }
      showToast(`${createForm.tipo === 'ESTACIONAMIENTO' ? 'Estacionamiento' : 'Carrito'} creado`)
      setShowModal(null)
      setCreateForm({ tipo: 'ESTACIONAMIENTO', codigo: '', numero: '', tipoVehiculo: 'AUTO', capacidadMaxima: 2 })
      loadData(condoId)
    } catch (e) {
      showToast('Error: ' + e.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleParking = async (item) => {
    try {
      await updateAdminAssetStatus(item.id, { tipo: 'ESTACIONAMIENTO', disponible: !item.disponible }, condoId)
      showToast(`Estacionamiento #${item.numero || item.id} ${item.disponible ? 'ocupado' : 'liberado'}`)
      loadData(condoId)
    } catch (e) { showToast('Error: ' + e.message, 'error') }
  }

  const handleUpdateParkingConfig = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateAdminAssetStatus(configForm.id, {
        tipo: 'ESTACIONAMIENTO', tipoVehiculo: configForm.tipoVehiculo, capacidadMaxima: Number(configForm.capacidadMaxima)
      }, condoId)
      showToast('Configuración actualizada')
      setShowModal(null)
      loadData(condoId)
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    finally { setSaving(false) }
  }

  const handleCartState = async (item, estado) => {
    if (estado === item.estado) return
    try {
      await updateAdminAssetStatus(item.id, { tipo: 'CARRITO', estado }, condoId)
      showToast(`Estado: ${states[estado]?.label || estado}`)
      loadData(condoId)
    } catch (e) { showToast('Error: ' + e.message, 'error') }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await deleteAdminAsset(confirmDelete.id, condoId, confirmDelete.tipo)
      showToast('Eliminado')
      setConfirmDelete(null)
      loadData(condoId)
    } catch (e) { showToast('Error: ' + e.message, 'error') }
  }

  const handleRegisterEntry = async (e) => {
    e.preventDefault()
    if (!entryForm.placa) return showToast('Selecciona un vehículo', 'error')
    setSaving(true)
    try {
      const selected = vehicles.find(v => v.placa === entryForm.placa)
      const owner = vehicleOwnerMap[selected?.id]
      await registerVehicleEntry({
        placa: entryForm.placa, metodo: entryForm.metodo,
        ocupante: entryForm.ocupante,
        datosInquilino: entryForm.ocupante === 'INQUILINO' ? (entryForm.datosInquilino || owner?.nombre || '') : null,
        idEstacionamiento: entryForm.idEstacionamiento ? parseInt(entryForm.idEstacionamiento) : undefined
      }, condoId)
      showToast(`Entrada: ${entryForm.placa}`)
      setShowModal(null)
      setEntryForm({ placa: '', metodo: 'OCR', ocupante: 'PROPIETARIO', datosInquilino: '', idEstacionamiento: '' })
      setEntryFilters({ torre: '', piso: '', aptId: '' })
      setEntryTorreText(''); setEntryPisoText(''); setEntryAptText(''); setEntryPlacaText(''); setEntryParkText('')
      loadData(condoId)
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    finally { setSaving(false) }
  }

  const handleRegisterExit = async (e) => {
    e.preventDefault()
    if (!exitForm.idLogAcceso) return showToast('Selecciona un registro', 'error')
    setSaving(true)
    try {
      await registerVehicleExit({ idLogAcceso: Number(exitForm.idLogAcceso) })
      showToast('Salida registrada')
      setShowModal(null)
      setExitForm({ idLogAcceso: '' }); setExitLogText('')
      loadData(condoId)
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    finally { setSaving(false) }
  }

  const handleAssignParking = async (e) => {
    e.preventDefault()
    if (!assignForm.idEstacionamiento || !assignForm.idApartamento) return showToast('Completa todos los campos', 'error')
    setSaving(true)
    try {
      await updateAdminAssetStatus(assignForm.idEstacionamiento, {
        tipo: 'ESTACIONAMIENTO', disponible: false, tipoVehiculo: parking.find(p => String(p.id) === String(assignForm.idEstacionamiento))?.tipoVehiculo || 'AUTO'
      }, condoId)
      await assignAssetApartment(Number(assignForm.idEstacionamiento), Number(assignForm.idApartamento), condoId)
      showToast('Estacionamiento asignado')
      setShowModal(null)
      setAssignForm({ idEstacionamiento: '', idApartamento: '' }); setAssignParkingText(''); setAssignAptText('')
      loadData(condoId)
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    finally { setSaving(false) }
  }

  const handleCreateVehicle = async (e) => {
    e.preventDefault()
    if (!vehicleForm.marca || !vehicleForm.placa) return showToast('Completa marca y placa', 'error')
    setSaving(true)
    try {
      const payload = {
        marca: vehicleForm.marca, color: vehicleForm.color, modelo: vehicleForm.modelo,
        placa: vehicleForm.placa.toUpperCase(), tipo: vehicleForm.tipo,
        inquilinoId: vehicleForm.inquilinoId ? Number(vehicleForm.inquilinoId) : null
      }
      await createAdminVehicle(payload, condoId)
      showToast('Vehículo registrado')
      setShowModal(null)
      setVehicleForm({ id: null, marca: '', color: 'BLANCO', modelo: '', placa: '', tipo: 'AUTO', inquilinoId: '' }); setVehInquilinoText('')
      loadData(condoId)
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    finally { setSaving(false) }
  }

  const handleEditVehicle = async (e) => {
    e.preventDefault()
    if (!vehicleForm.marca || !vehicleForm.placa) return showToast('Completa marca y placa', 'error')
    if (!vehicleForm.id) return showToast('Error: vehículo no identificado', 'error')
    setSaving(true)
    try {
      const payload = {
        marca: vehicleForm.marca, color: vehicleForm.color, modelo: vehicleForm.modelo,
        placa: vehicleForm.placa.toUpperCase(), tipo: vehicleForm.tipo,
      }
      if (vehicleForm.inquilinoId) payload.inquilinoId = Number(vehicleForm.inquilinoId)
      await deleteAdminVehicle(vehicleForm.id, condoId)
      await createAdminVehicle(payload, condoId)
      showToast('Vehículo actualizado')
      setShowModal(null)
      setVehicleForm({ id: null, marca: '', color: 'BLANCO', modelo: '', placa: '', tipo: 'AUTO', inquilinoId: '' }); setVehInquilinoText('')
      loadData(condoId)
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    finally { setSaving(false) }
  }

  const handleDeleteVehicle = async (id) => {
    try {
      await deleteAdminVehicle(id, condoId)
      showToast('Vehículo eliminado')
      loadData(condoId)
    } catch (e) { showToast('Error: ' + e.message, 'error') }
  }

  const handleUnassignVehicle = async (vehicle) => {
    try {
      await unassignVehicleFromSpot(vehicle.id, condoId)
      showToast('Vehículo retirado del estacionamiento')
      loadData(condoId)
    } catch (e) { showToast('Error: ' + e.message, 'error') }
  }

  const handleCartLoan = async (e) => {
    e.preventDefault()
    if (!cartLoanForm.codigoCarrito) return showToast('No hay carritos disponibles con código', 'error')
    setSaving(true)
    try {
      const resp = await registerCartLoan({
        codigoCarrito: cartLoanForm.codigoCarrito,
        numeroApartamento: Number(cartLoanForm.numeroApartamento),
        nombreSolicitante: cartLoanForm.nombreSolicitante,
        dniSolicitante: cartLoanForm.dniSolicitante,
        solicitante: cartLoanForm.solicitante,
        idPropietario: cartLoanForm.solicitante === 'PROPIETARIO' ? (cartLoanForm.idPropietario ? Number(cartLoanForm.idPropietario) : null) : null,
        idInquilino: cartLoanForm.solicitante === 'INQUILINO' ? (cartLoanForm.idInquilino ? Number(cartLoanForm.idInquilino) : null) : null
      }, condoId)
      const apt = apartments.find(a => String(a.id) === cartLoanForm.idApartamento)
      setCartTicket({ ...resp, aptNumero: cartLoanForm.numeroApartamento, aptTorre: apt?.torreNombre || '', aptPiso: apt?.pisoNumero || '' })
      showToast('Préstamo registrado')
      setShowModal(null)
      setCartLoanForm({ codigoCarrito: '', idApartamento: '', numeroApartamento: '', nombreSolicitante: '', dniSolicitante: '', solicitante: 'PROPIETARIO', idPropietario: '', idInquilino: '' })
      setCartFilters({ torre: '', piso: '', aptId: '' })
      setCartCodigoCarritoText(''); setCartTorreText(''); setCartPisoText(''); setCartAptText('')
      loadData(condoId)
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    finally { setSaving(false) }
  }

  const handleReturnCart = async (loanId) => {
    try {
      await returnCartLoan(loanId)
      showToast('Carrito devuelto')
      loadData(condoId)
    } catch (e) { showToast('Error: ' + e.message, 'error') }
  }

  const handleAssignVehicleToSpot = async (e) => {
    e.preventDefault()
    if (!assignVehicleForm.idEstacionamiento || !assignVehicleForm.idVehiculo) return showToast('Completa todos los campos', 'error')
    setSaving(true)
    try {
      await registerVehicleEntry({
        placa: assignVehicleForm.idVehiculo,
        metodo: 'MANUAL',
        ocupante: 'PROPIETARIO',
        datosInquilino: null,
        idEstacionamiento: parseInt(assignVehicleForm.idEstacionamiento)
      }, condoId)
      showToast('Vehículo asignado al estacionamiento')
      setShowModal(null)
      setAssignVehicleForm({ idEstacionamiento: '', idVehiculo: '' }); setPickVehicleText('')
      loadData(condoId)
    } catch (e) { showToast('Error: ' + e.message, 'error') }
    finally { setSaving(false) }
  }

  const openTicket = (log) => {
    const veh = vehicles.find(v => String(v.id) === String(log.idVehiculo))
    const spot = parking.find(p => String(p.id) === String(log.idEstacionamiento))
    const apt = spot ? apartments.find(a => String(a.id) === String(spot.idApartamento)) : null
    setTicket({
      ...log,
      vehiculoMarca: veh?.marca || '—',
      vehiculoModelo: veh?.modelo || '—',
      spotNumero: spot?.numero || '—',
      aptNumero: apt?.numero || '—',
      torreNombre: apt?.torreNombre || '—',
      condominioNombre: condo?.nombre || '—'
    })
    setTimeout(() => {
      if (barcodeRef.current) {
        try {
          JsBarcode(barcodeRef.current, `TKT-${log.id}-${log.placa}-${new Date(log.fechaEntrada).getTime()}`, {
            format: "CODE128", width: 2, height: 60, displayValue: true, fontSize: 14, margin: 10
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

  const aptLabel = (id) => {
    if (!id) return null
    const a = apartments.find(x => String(x.id) === String(id))
    return a ? `N°${a.numero}${a.torreNombre ? ` (${a.torreNombre})` : ''}` : `#${id}`
  }

  const formatDate = (d) => {
    if (!d) return '—'
    try { return new Date(d).toLocaleString('es-PE') } catch { return d }
  }

  const StatCard = ({ icon, label, value, sub, color }) => (
    <div style={{ ...styles.card, padding: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ backgroundColor: `${color}15`, padding: "0.65rem", borderRadius: "0.65rem" }}>
          {React.cloneElement(icon, { size: 22, color })}
        </div>
        <div>
          <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>{label}</div>
          {sub && <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.15rem" }}>{sub}</div>}
        </div>
      </div>
    </div>
  )

  const Row = ({ label, children }) => (
    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.4rem" }}>
      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>{label}</span>
      <span style={{ fontSize: "0.8rem", color: "#0f172a", fontWeight: 600 }}>{children}</span>
    </div>
  )

  const ParkingMatrix = ({ spot, occupiedCount }) => {
    const rows = spot.tipoVehiculo === 'AUTO' ? 4 : 2
    const cols = 4
    const totalCells = spot.capacidadMaxima || 1
    const occupied = occupiedCount ?? spot.cantidadActual ?? 0
    const cells = Array.from({ length: totalCells }, (_, i) => i < occupied)
    return (
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "3px", padding: "4px" }}>
        {cells.map((isOcc, i) => (
          <div key={i} style={{
            width: "100%", aspectRatio: "1", borderRadius: "3px",
            backgroundColor: isOcc ? "rgba(239,68,68,0.7)" : "rgba(16,185,129,0.3)",
            border: `1.5px solid ${isOcc ? "#ef4444" : "#10b981"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.55rem", fontWeight: 700, color: isOcc ? "#fff" : "#10b981",
            transition: "all 0.15s"
          }}>
            {isOcc ? '●' : '○'}
          </div>
        ))}
      </div>
    )
  }

  if (loading) return <div style={{ ...styles.container, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontWeight: 600 }}>Cargando...</div>

  return (
    <div style={styles.container}>
      {toast && (
        <div style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 200, backgroundColor: toast.type === 'error' ? "#ef4444" : "#10b981", color: "#fff", padding: "0.75rem 1.25rem", borderRadius: "0.75rem", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.15)" }}>
          {toast.type === 'error' ? <FiAlertCircle size={16} /> : <FiCheck size={16} />} {toast.msg}
        </div>
      )}

      <EncabezadoTabla titulo="Bienes Comunes" subtitulo="Gestión integral de estacionamientos, vehículos y carritos" />

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes cardSelectedPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* --- VISTA COMPACTA (cuando ya hay un condominio seleccionado) --- */}
      {condoId && !showCardSelector && (
        <div style={{
          background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
          borderRadius: '1rem',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          border: '1px solid rgba(124,58,237,0.15)',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              backgroundColor: 'rgba(124,58,237,0.12)',
              padding: '0.6rem',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiGrid size={20} color={colorSuper} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>{condo?.nombre || 'Condominio'}</div>
              <div style={{ fontSize: '0.75rem', color: '#6d28d9', fontWeight: '600' }}>
                {condo?.direccion || ''} &mdash; {condominios.length} condominios
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCardSelector(true)}
            style={{
              backgroundColor: 'rgba(124,58,237,0.1)',
              color: colorSuper,
              border: '1px solid rgba(124,58,237,0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '0.65rem',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <FiGrid size={14} />
            Seleccionar otro condominio
          </button>
        </div>
      )}

      {/* --- SELECTOR DE CONDOMINIOS (TARJETAS) --- */}
      {(!condoId || showCardSelector) && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                backgroundColor: 'rgba(124,58,237,0.1)',
                padding: '0.6rem',
                borderRadius: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FiGrid size={20} color={colorSuper} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                  {condoId ? 'Seleccionar otro condominio' : 'Selecciona un condominio'}
                </h2>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                  {condoSearch
                    ? `${filteredCondominios.length} de ${condominios.length} condominios`
                    : `${condominios.length} ${condominios.length === 1 ? 'condominio disponible' : 'condominios disponibles'}`
                  }
                </span>
              </div>
            </div>

            <div style={{ width: '260px', maxWidth: '100%', position: 'relative' }}>
              <FiSearch size={14} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Buscar condominio..."
                value={condoSearch}
                onChange={e => setCondoSearch(e.target.value)}
                style={{ ...styles.input, paddingLeft: '2.2rem', paddingTop: '0.55rem', paddingBottom: '0.55rem', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1rem'
          }}>
            {filteredCondominios.map((c, idx) => {
              const isSelected = String(c.id) === String(condoId)
              const [color1, color2] = coloresGradiente[idx % coloresGradiente.length]

              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => { setCondoId(String(c.id)); setShowCardSelector(false) }}
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
                    opacity: condoId && !isSelected ? 0.55 : 1,
                    filter: condoId && !isSelected ? 'grayscale(0.3) saturate(0.7)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && !condoId) {
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

                    {/* DirecciÃ³n */}
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
      {!condoId ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: 600 }}>
          <FiGrid size={48} style={{ opacity: 0.3, marginBottom: "0.75rem" }} />
          <p>Selecciona un condominio para gestionar sus bienes comunes</p>
        </div>
      ) : loadingData ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: 600 }}>Cargando...</div>
      ) : (
        <>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            {[
              { key: 'dashboard', label: 'Dashboard', icon: <FiHome size={14} /> },
              { key: 'mapa', label: 'Mapa Parqueo', icon: <FiGrid size={14} /> },
              { key: 'gestion', label: 'Gestión', icon: <FiSettings size={14} /> },
              { key: 'reservas', label: 'Reservas', icon: <FiClock size={14} /> },
              { key: 'vehiculos', label: 'Vehículos', icon: <FiNavigation2 size={14} /> },
              { key: 'carritos', label: 'Carritos', icon: <FiTruck size={14} /> },

            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={styles.tab(activeTab === t.key)}>
                {React.cloneElement(t.icon, { style: { marginRight: 4 } })} {t.label}
              </button>
            ))}
          </div>

          {/* ===== DASHBOARD ===== */}
          {activeTab === 'dashboard' && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                <StatCard icon={<FiHome />} label="Estacionamientos" value={stats.totalParking} sub={`${stats.disponibleParking} libres · ${stats.ocupadoParking} ocupados`} color={colorSuper} />
                <StatCard icon={<FiUsers />} label="Capacidad Total" value={stats.capacidadTotal} sub={`${stats.ocupacionActual} vehículos ahora (${stats.capacidadTotal > 0 ? ((stats.ocupacionActual / stats.capacidadTotal) * 100).toFixed(0) : 0}%)`} color="#3b82f6" />
                <StatCard icon={<FiTruck />} label="Carritos" value={stats.totalCarts} sub={`${stats.cartDisponible} disp · ${stats.cartEnUso} uso · ${stats.cartMant} mant`} color={colorSuper} />
                <StatCard icon={<FiNavigation2 />} label="Vehículos Registrados" value={stats.totalVehicles} color="#f59e0b" />
                <StatCard icon={<FiLogIn />} label="Vehículos Dentro" value={stats.activeEntries.length} sub={`${stats.disponibleParking} spots libres`} color="#10b981" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "#0f172a" }}>Ocupación de Estacionamientos</span>
                    <div style={{ display: "flex", gap: "0.65rem", alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.6rem", display: "flex", alignItems: "center", gap: "0.2rem" }}><span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: "#10b981", display: "inline-block" }} /> Libre</span>
                      <span style={{ fontSize: "0.6rem", display: "flex", alignItems: "center", gap: "0.2rem" }}><span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: "#f59e0b", display: "inline-block" }} /> Parcial</span>
                      <span style={{ fontSize: "0.6rem", display: "flex", alignItems: "center", gap: "0.2rem" }}><span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: "#ef4444", display: "inline-block" }} /> Lleno</span>
                      <span style={{ fontSize: "0.6rem", display: "flex", alignItems: "center", gap: "0.2rem", marginLeft: "0.25rem" }}><span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: "#d1d5db", display: "inline-block" }} /> Sin datos</span>
                    </div>
                  </div>
                  <div style={{ padding: "0.75rem 0.5rem 0 0.5rem" }}>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={parking.slice(0, 20).map(p => {
                        const cap = p.capacidadMaxima || 1
                        const occ = p.cantidadActual || 0
                        const free = Math.max(cap - occ, 0)
                        const pct = (occ / cap) * 100
                        return {
                          name: `#${p.numero || p.id}`,
                          ocupado: occ,
                          disponible: free,
                          capacidad: cap,
                          pct,
                          colorOcupado: pct >= 80 ? "#ef4444" : pct > 0 ? "#f59e0b" : "#10b981",
                          id: p.id
                        }
                      })} margin={{ top: 16, right: 8, left: 0, bottom: 0 }} barCategoryGap="30%">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} interval={0} angle={-20} textAnchor="end" height={30} />
                        <YAxis hide domain={[0, 'auto']} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null
                            const d = payload[0].payload
                            return (
                              <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "0.75rem" }}>
                                <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "0.25rem" }}>Estacionamiento {d.name}</div>
                                <div style={{ color: "#475569" }}>Capacidad: {d.capacidad} vehículos</div>
                                <div style={{ color: "#ef4444", fontWeight: 600 }}>Ocupados: {d.ocupado}</div>
                                <div style={{ color: "#10b981", fontWeight: 600 }}>Libres: {d.disponible}</div>
                                <div style={{ color: d.colorOcupado, fontWeight: 700, marginTop: "0.15rem" }}>{d.pct.toFixed(0)}% ocupado</div>
                              </div>
                            )
                          }}
                        />
                        <Bar dataKey="disponible" stackId="stack" radius={[0, 0, 0, 0]} maxBarSize={36} fill="#10b981" />
                        <Bar dataKey="ocupado" stackId="stack" radius={[6, 6, 0, 0]} maxBarSize={36}>
                          {parking.slice(0, 20).map(p => {
                            const pct = p.capacidadMaxima > 0 ? ((p.cantidadActual || 0) / p.capacidadMaxima) * 100 : 0
                            return <Cell key={p.id} fill={pct >= 80 ? "#ef4444" : pct > 0 ? "#f59e0b" : "#10b981"} />
                          })}
                          <LabelList dataKey="ocupado" position="top" fill="#64748b" fontSize={10} fontWeight={700} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <span style={{ fontWeight: 800, fontSize: "0.8rem", color: "#0f172a" }}>Vehículos dentro ahora</span>
                  </div>
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {stats.activeEntries.length === 0 ? (
                      <div style={{ padding: "1.5rem", textAlign: "center", color: "#94a3b8", fontSize: "0.8rem" }}>Ningún vehículo dentro</div>
                    ) : stats.activeEntries.slice(0, 10).map(l => (
                      <div key={l.id} style={{ padding: "0.5rem 1rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "#0f172a", fontFamily: "monospace" }}>{l.placa}</span>
                          <span style={{ fontSize: "0.65rem", color: "#94a3b8", marginLeft: "0.5rem" }}>{l.ocupante}</span>
                        </div>
                        <span style={{ fontSize: "0.65rem", color: "#3b82f6" }}>{formatDate(l.fechaEntrada)}</span>
                      </div>
                    ))}
                    {stats.activeEntries.length > 10 && <div style={{ padding: "0.5rem", textAlign: "center", fontSize: "0.7rem", color: "#94a3b8" }}>+{stats.activeEntries.length - 10} más</div>}
                  </div>
                </div>
              </div>

              {dashboard && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginTop: "1.5rem" }}>
                  <div style={styles.card}>
                    <div style={{ padding: "1.25rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Vehículos dentro</div>
                      <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#10b981" }}>{dashboard.vehiculosDentro ?? stats.activeEntries.length}</div>
                    </div>
                  </div>
                  <div style={styles.card}>
                    <div style={{ padding: "1.25rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Carritos prestados</div>
                      <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#f59e0b" }}>{dashboard.carritosPrestados ?? activeLoans.length}</div>
                    </div>
                  </div>
                  <div style={styles.card}>
                    <div style={{ padding: "1.25rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Spots disponibles</div>
                      <div style={{ fontSize: "2.5rem", fontWeight: 800, color: colorSuper }}>{dashboard.spotsDisponibles ?? stats.disponibleParking}</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ===== MAPA PARQUEO ===== */}
          {activeTab === 'mapa' && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={styles.card}>
                <div style={{ ...styles.cardHeader, cursor: "pointer" }} onClick={() => setAssignParkingOpen(!assignParkingOpen)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FiGrid size={16} color={colorSuper} />
                    <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0f172a" }}>Matriz de Estacionamientos</span>
                    <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{condo?.nombre}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", color: "#64748b" }}>
                      <span style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: "rgba(16,185,129,0.3)", border: "1.5px solid #10b981", display: "inline-block" }} /> Libre
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.7rem", color: "#64748b" }}>
                      <span style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: "rgba(239,68,68,0.7)", border: "1.5px solid #ef4444", display: "inline-block" }} /> Ocupado
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); setShowModal('create') }} style={styles.btnPrimary}><FiPlus size={14} /> Nuevo</button>
                    <span style={{ color: assignParkingOpen ? colorSuper : "#94a3b8", fontWeight: 700, fontSize: "0.8rem", transition: "transform 0.2s", transform: assignParkingOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                      {assignParkingOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    </span>
                  </div>
                </div>
                {assignParkingOpen && (
                <form onSubmit={handleAssignParking} style={{ padding: "0.75rem 1.25rem", display: "flex", alignItems: "flex-end", gap: "0.75rem", borderBottom: "1px solid #f1f5f9", backgroundColor: "#faf5ff" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ ...styles.label, fontSize: "0.6rem" }}>Estacionamiento</label>
                    {parking.filter(p => p.disponible && !p.idApartamento).length === 0 ? (
                      <div style={{ ...styles.select, display: "flex", alignItems: "center", color: "#ef4444", fontSize: "0.75rem", fontWeight: "600" }}>No hay estacionamientos disponibles</div>
                    ) : (
                      <DataList value={assignParkingText} onChange={(e) => { setAssignParkingText(e.target.value); const s = parking.filter(p => p.disponible && !p.idApartamento).find(p => `${p.numero || `#${p.id}`} — ${p.tipoVehiculo || 'Mixto'}` === e.target.value); if (s) setAssignForm(f => ({ ...f, idEstacionamiento: String(s.id) })) }} required style={styles.select}>
                        <option value="">Seleccionar estacionamiento</option>
                        {parking.filter(p => p.disponible && !p.idApartamento).map(p => (
                          <option key={p.id} value={`${p.numero || `#${p.id}`} — ${p.tipoVehiculo || 'Mixto'}`} />
                        ))}
                      </DataList>
                    )}
                  </div>
                  <div style={{ flex: 2 }}>
                    <label style={{ ...styles.label, fontSize: "0.6rem" }}>Departamento</label>
                    {apartments.filter(a => !parking.some(p => String(p.idApartamento) === String(a.id))).length === 0 ? (
                      <div style={{ ...styles.select, display: "flex", alignItems: "center", color: "#ef4444", fontSize: "0.75rem", fontWeight: "600" }}>No hay apartamentos disponibles</div>
                    ) : (
                      <DataList value={assignAptText} onChange={(e) => { setAssignAptText(e.target.value); const s = apartments.filter(a => !parking.some(p => String(p.idApartamento) === String(a.id))).find(a => `N° ${a.numero}${a.torreNombre ? ` — ${a.torreNombre}` : ''}` === e.target.value); if (s) setAssignForm(f => ({ ...f, idApartamento: String(s.id) })) }} required style={styles.select}>
                        <option value="">Seleccionar apartamento</option>
                        {apartments.filter(a => !parking.some(p => String(p.idApartamento) === String(a.id))).map(a => (
                          <option key={a.id} value={`N° ${a.numero}${a.torreNombre ? ` — ${a.torreNombre}` : ''}`} />
                        ))}
                      </DataList>
                    )}
                  </div>
                  <button type="submit" disabled={saving} style={{ ...styles.btnPrimary, padding: "0.5rem 1rem", whiteSpace: "nowrap", height: "fit-content" }}>
                    {saving ? 'Asignando...' : <><FiHome size={14} /> Asignar Departamento</>}
                  </button>
                </form>
                )}
                <div style={{ padding: "1.25rem" }}>
                  {parking.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8", fontSize: "0.85rem" }}>No hay estacionamientos registrados</div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
                      {parking.map(p => {
                        const vehiclesInSpot = vehicles.filter(v => String(v.idEstacionamiento) === String(p.id))
                        const pct = p.capacidadMaxima > 0 ? ((p.cantidadActual || 0) / p.capacidadMaxima) * 100 : 0
                        return (
                          <div key={p.id} style={{
                            ...styles.card, border: `2px solid ${vehiclesInSpot.length === 0 ? "#10b981" : "#ef4444"}`,
                            transition: "all 0.15s"
                          }}>
                            <div style={{ padding: "0.75rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                                <div style={{ fontSize: "0.6rem", fontWeight: 700, color: vehiclesInSpot.length === 0 ? "#10b981" : "#ef4444", textTransform: "uppercase" }}>
                                  {vehiclesInSpot.length === 0 ? 'Disponible' : 'Ocupado'} · {p.tipoVehiculo || 'MIXTO'}
                                </div>
                                <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>#{p.numero || p.id}</div>
                              </div>
                              <div style={{ fontSize: "0.65rem", color: "#94a3b8", marginBottom: "0.3rem" }}>
                                {p.cantidadActual ?? 0}/{p.capacidadMaxima || '∞'} vehículos
                              </div>
                              <ParkingMatrix spot={p} occupiedCount={vehiclesInSpot.length} />
                              <div style={{ marginTop: "0.3rem" }}>
                                <div style={{ width: "100%", height: "4px", backgroundColor: "#f1f5f9", borderRadius: "2px", overflow: "hidden" }}>
                                  <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", backgroundColor: pct >= 80 ? "#ef4444" : pct > 0 ? "#f59e0b" : "#10b981", borderRadius: "2px", transition: "width 0.3s" }} />
                                </div>
                              </div>
                              {p.idApartamento && <div style={{ fontSize: "0.6rem", color: colorSuper, fontWeight: 600, marginTop: "0.3rem" }}>{aptLabel(p.idApartamento)}</div>}
                            </div>

                            {/* Vehicles occupying this spot */}
                            {vehiclesInSpot.length > 0 && (
                              <div style={{ borderTop: "1px solid #e2e8f0", backgroundColor: "#f8fafc", padding: "0.5rem 0.75rem" }}>
                                <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "#64748b", marginBottom: "0.3rem" }}>Vehículos:</div>
                                {vehiclesInSpot.map(v => (
                                  <div key={v.id} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.7rem", color: "#334155", marginBottom: "0.2rem" }}>
                                    <span style={{
                                      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                                      backgroundColor: colorSwatch(v.color), border: "1px solid #e2e8f0"
                                    }} />
                                    <span style={{ fontWeight: 700, fontFamily: "monospace" }}>{v.placa}</span>
                                    <span style={{ color: "#64748b" }}>{v.marca} {v.modelo}</span>
                                    <button onClick={(e) => { e.stopPropagation(); handleUnassignVehicle(v) }}
                                      style={{ marginLeft: "auto", background: "rgba(239,68,68,0.1)", border: "none", color: "#ef4444", cursor: "pointer", borderRadius: "0.3rem", padding: "0.1rem 0.35rem", fontSize: "0.6rem", fontWeight: 700, lineHeight: 1.2 }}>
                                      <FiX size={10} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div style={{ display: "flex", borderTop: "1px solid #f1f5f9" }}>
                              <button onClick={(e) => { e.stopPropagation(); setConfigForm({ id: p.id, tipoVehiculo: p.tipoVehiculo || 'AUTO', capacidadMaxima: p.capacidadMaxima || 2 }); setShowModal('config') }}
                                style={{ flex: 1, padding: "0.4rem", background: "none", border: "none", cursor: "pointer", color: "#3b82f6", fontSize: "0.65rem", borderRight: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.2rem" }}>
                                <FiTool size={11} /> Config
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setDetailItem(p) }}
                                style={{ flex: 1, padding: "0.4rem", background: "none", border: "none", cursor: "pointer", color: colorSuper, fontSize: "0.65rem", borderRight: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.2rem" }}>
                                <FiEye size={11} /> Ver
                              </button>
                              {vehiclesInSpot.length < (p.capacidadMaxima ?? Infinity) && (
                                <button onClick={(e) => { e.stopPropagation(); setAssignVehicleForm({ idEstacionamiento: p.id, idVehiculo: '' }); setPickVehicleText(''); setShowModal('pickVehicle') }}
                                  style={{ flex: 1, padding: "0.4rem", background: "none", border: "none", cursor: "pointer", color: "#10b981", fontSize: "0.65rem", borderRight: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.2rem" }}>
                                  <FiUserPlus size={11} />
                                </button>
                              )}
                              <button onClick={(e) => { e.stopPropagation(); setConfirmDelete({ id: p.id, tipo: 'ESTACIONAMIENTO' }) }}
                                style={{ flex: 1, padding: "0.4rem", background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "0.65rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.2rem" }}>
                                <FiTrash2 size={11} />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== GESTIÓN ===== */}
          {activeTab === 'gestion' && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={styles.card}>
                  <div style={{ ...styles.cardHeader, cursor: "pointer" }} onClick={() => setEntryOpen(!entryOpen)}>
                    <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <FiLogIn size={14} color="#10b981" /> Registrar Entrada
                    </span>
                    <span style={{ color: entryOpen ? "#10b981" : "#94a3b8", fontWeight: 700, fontSize: "0.8rem", transition: "transform 0.2s", transform: entryOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                      {entryOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    </span>
                  </div>
                  {entryOpen && (
                    <form onSubmit={handleRegisterEntry} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Seleccionar torre</label>
                      <DataList value={entryTorreText} onChange={e => { setEntryTorreText(e.target.value); setEntryFilters(f => ({ ...f, torre: e.target.value, piso: '', aptId: '' })) }} style={{ ...styles.select, fontSize: "0.7rem" }}>
                        <option value="">Torre</option>
                        {towers.map(t => <option key={t} value={t} />)}
                      </DataList>
                      <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Seleccionar piso</label>
                      <DataList value={entryPisoText} onChange={e => { setEntryPisoText(e.target.value); setEntryFilters(f => ({ ...f, piso: e.target.value, aptId: '' })) }} style={{ ...styles.select, fontSize: "0.7rem" }}>
                        <option value="">Piso</option>
                        {floors.map(f => <option key={f} value={f} />)}
                      </DataList>
                      <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Seleccionar departamento</label>
                      <DataList value={entryAptText} onChange={e => { setEntryAptText(e.target.value); const apt = apartments.find(a => `N° ${a.numero}` === e.target.value || String(a.numero) === e.target.value); if (apt) { setEntryFilters(f => ({ ...f, aptId: String(apt.id) })); if (apt.nombrePropietario) setEntryForm(f => ({ ...f, ocupante: 'PROPIETARIO', datosInquilino: apt.nombrePropietario })) } else { setEntryFilters(f => ({ ...f, aptId: '' })); setEntryForm(f => ({ ...f, ocupante: 'PROPIETARIO', datosInquilino: '' })) } }} style={{ ...styles.select, fontSize: "0.7rem" }}>
                        <option value="">Departamento</option>
                        {filteredApts.map(a => <option key={a.id} value={`N° ${a.numero}`} />)}
                      </DataList>
                      {entryFilters.aptId && (() => {
                        const apt = apartments.find(a => String(a.id) === entryFilters.aptId)
                        if (!apt) return null
                        const occupants = []
                        if (apt.nombrePropietario) occupants.push({ label: `${apt.nombrePropietario} (Dueño)`, nombre: apt.nombrePropietario, tipo: 'PROPIETARIO', dni: '' })
                        if (apt.inquilinos) apt.inquilinos.forEach(inq => occupants.push({ label: `${inq.nombres} ${inq.apellidos} (Inquilino)`, nombre: `${inq.nombres} ${inq.apellidos}`, tipo: 'INQUILINO', dni: inq.numeroDocumento }))
                        return occupants.length > 0 ? (
                          <select style={styles.select} value={entryForm.datosInquilino} onChange={e => {
                            const sel = occupants.find(o => o.nombre === e.target.value)
                            if (sel) setEntryForm(f => ({ ...f, ocupante: sel.tipo, datosInquilino: sel.nombre }))
                          }}>
                            <option value="">Seleccionar ocupante de N° {apt.numero}</option>
                            {occupants.map(o => <option key={o.nombre} value={o.nombre}>{o.label}{o.dni ? ` — DNI: ${o.dni}` : ''}</option>)}
                          </select>
                        ) : (
                          <div style={{ fontSize: "0.75rem", color: "#94a3b8", textAlign: "center", padding: "0.5rem" }}>Sin ocupantes registrados en N° {apt.numero}</div>
                        )
                      })()}
                      <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Seleccionar vehículo</label>
                      <DataList value={entryPlacaText} onChange={e => { setEntryPlacaText(e.target.value); const v = vehicles.find(x => x.placa === e.target.value); const owner = vehicleOwnerMap[v?.id]; if (owner && !entryFilters.aptId) { setEntryForm(f => ({ ...f, placa: e.target.value, ocupante: owner.tipo, datosInquilino: owner.nombre })) } else { setEntryForm(f => ({ ...f, placa: e.target.value })) } }} required style={styles.select}>
                        <option value="">Seleccionar vehículo</option>
                        {vehicles.filter(v => !v.idEstacionamiento).map(v => (
                          <option key={v.id} value={v.placa} />
                        ))}
                      </DataList>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                          <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Método</label>
                          <select style={styles.select} value={entryForm.metodo} onChange={e => setEntryForm(f => ({ ...f, metodo: e.target.value }))}>
                            <option value="OCR">OCR</option>
                            <option value="MANUAL">Manual</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Tipo ocupante</label>
                          <select style={styles.select} value={entryForm.ocupante} onChange={e => setEntryForm(f => ({ ...f, ocupante: e.target.value }))}>
                            <option value="PROPIETARIO">Propietario</option>
                            <option value="INQUILINO">Inquilino</option>
                          </select>
                        </div>
                      </div>
                      {entryForm.ocupante === 'INQUILINO' && (
                        <input style={styles.input} placeholder="Nombre del inquilino" value={entryForm.datosInquilino} onChange={e => setEntryForm(f => ({ ...f, datosInquilino: e.target.value }))} />
                      )}
                      <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Seleccionar estacionamiento</label>
                      <DataList value={entryParkText} onChange={e => { setEntryParkText(e.target.value); const s = parking.filter(p => (p.cantidadActual || 0) < p.capacidadMaxima).find(p => `#${p.numero} (${p.tipoVehiculo}) — ${p.cantidadActual || 0}/${p.capacidadMaxima}` === e.target.value); if (s) setEntryForm(f => ({ ...f, idEstacionamiento: String(s.id) })) }} style={styles.select}>
                        <option value="">Estacionamiento (auto)</option>
                        {parking.filter(p => (p.cantidadActual || 0) < p.capacidadMaxima).map(p => (
                          <option key={p.id} value={`#${p.numero} (${p.tipoVehiculo}) — ${p.cantidadActual || 0}/${p.capacidadMaxima}`} />
                        ))}
                      </DataList>
                      {vehicles.length === 0 && <div style={{ fontSize: "0.75rem", color: "#ef4444" }}>No hay vehículos registrados en el sistema</div>}
                      <button type="submit" disabled={saving || vehicles.length === 0} style={{ ...styles.btnSuccess, width: "100%", justifyContent: "center", padding: "0.6rem" }}>
                        {saving ? 'Registrando...' : <><FiLogIn size={14} /> Registrar Entrada</>}
                      </button>
                    </form>
                  )}
                </div>

                <div style={styles.card}>
                  <div style={{ ...styles.cardHeader, cursor: "pointer" }} onClick={() => setExitOpen(!exitOpen)}>
                    <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <FiLogOut size={14} color="#ef4444" /> Registrar Salida
                    </span>
                    <span style={{ color: exitOpen ? "#ef4444" : "#94a3b8", fontWeight: 700, fontSize: "0.8rem", transition: "transform 0.2s", transform: exitOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                      {exitOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    </span>
                  </div>
                  {exitOpen && (
                    <form onSubmit={handleRegisterExit} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Seleccionar vehículo dentro</label>
                      <DataList value={exitLogText} onChange={e => { setExitLogText(e.target.value); const s = stats.activeEntries.find(l => `${l.placa} — ${l.ocupante} — Entrada: ${formatDate(l.fechaEntrada)}` === e.target.value); if (s) setExitForm(f => ({ ...f, idLogAcceso: String(s.id) })) }} required style={styles.select}>
                        <option value="">Seleccionar vehículo dentro</option>
                        {stats.activeEntries.map(l => (
                          <option key={l.id} value={`${l.placa} — ${l.ocupante} — Entrada: ${formatDate(l.fechaEntrada)}`} />
                        ))}
                      </DataList>
                      {(() => {
                        const sel = stats.activeEntries.find(l => String(l.id) === exitForm.idLogAcceso)
                        return sel ? (
                          <div style={{ fontSize: "0.75rem", backgroundColor: "#fef2f2", padding: "0.75rem", borderRadius: "0.5rem", color: "#991b1b" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                              <span><strong>Vehículo:</strong> {sel.placa}</span>
                              <span><strong>Método:</strong> {sel.metodo}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span><strong>Ocupante:</strong> {sel.ocupante}</span>
                              <span><strong>Entrada:</strong> {formatDate(sel.fechaEntrada)}</span>
                            </div>
                            <div style={{ marginTop: "0.25rem", fontSize: "0.65rem", color: "#dc2626" }}>
                              <FiClock size={11} style={{ marginRight: "0.25rem" }} />
                              Tiempo transcurrido: {sel.fechaEntrada ? (() => {
                                const diff = Date.now() - new Date(sel.fechaEntrada).getTime()
                                const h = Math.floor(diff / 3600000)
                                const m = Math.floor((diff % 3600000) / 60000)
                                return `${h}h ${m}m`
                              })() : '—'}
                            </div>
                          </div>
                        ) : null
                      })()}
                      {stats.activeEntries.length === 0 && <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>No hay vehículos dentro</div>}
                      <button type="submit" disabled={saving || stats.activeEntries.length === 0} style={{ ...styles.btnDanger, width: "100%", justifyContent: "center", padding: "0.6rem" }}>
                        {saving ? 'Registrando...' : <><FiLogOut size={14} /> Registrar Salida — {new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</>}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <FiCalendar size={14} color={colorSuper} /> Bitácora de Accesos Vehiculares
                  </span>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <div style={{ position: "relative" }}>
                      <FiSearch size={13} style={{ position: "absolute", left: "0.5rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                      <input type="text" placeholder="Buscar placa, vehículo..." value={logSearch} onChange={e => { setLogSearch(e.target.value); setLogPage(1) }}
                        style={{ ...styles.input, padding: "0.35rem 0.5rem 0.35rem 1.6rem", fontSize: "0.75rem", width: "180px" }} />
                    </div>
                    <button onClick={() => loadData(condoId)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiRefreshCw size={16} /></button>
                  </div>
                </div>
                {(() => {
                  const filtered = logs.filter(l =>
                    !logSearch || l.placa?.toLowerCase().includes(logSearch.toLowerCase()) ||
                    l.ocupante?.toLowerCase().includes(logSearch.toLowerCase()) ||
                    l.datosInquilino?.toLowerCase().includes(logSearch.toLowerCase()) ||
                    l.metodo?.toLowerCase().includes(logSearch.toLowerCase()) ||
                    String(l.id).includes(logSearch)
                  )
                  const paged = paginate(filtered, logPage)
                  return (<>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                            <th style={{ padding: "0.75rem 1rem" }}>#</th>
                            <th style={{ padding: "0.75rem" }}>Ticket</th>
                            <th style={{ padding: "0.75rem" }}>Placa</th>
                            <th style={{ padding: "0.75rem" }}>Vehículo</th>
                            <th style={{ padding: "0.75rem" }}>Estacionamiento</th>
                            <th style={{ padding: "0.75rem" }}>Ocupante</th>
                            <th style={{ padding: "0.75rem" }}>Nombre</th>
                            <th style={{ padding: "0.75rem" }}>Entrada</th>
                            <th style={{ padding: "0.75rem" }}>Salida</th>
                            <th style={{ padding: "0.75rem" }}>Método</th>
                            <th style={{ padding: "0.75rem" }}>Condominio</th>
                            <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Ticket</th>
                          </tr>
                        </thead>
                        <tbody style={{ color: "#334155" }}>
                          {paged.map((l, idx) => {
                            const veh = vehicles.find(v => String(v.id) === String(l.idVehiculo))
                            const spot = parking.find(p => String(p.id) === String(l.idEstacionamiento))
                            const apt = spot ? apartments.find(a => String(a.id) === String(spot.idApartamento)) : null
                            return (
                              <tr key={l.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "0.75rem 1rem", color: "#94a3b8", fontSize: "0.7rem" }}>{(logPage - 1) * PER_PAGE + idx + 1}</td>
                                <td style={{ padding: "0.75rem", fontWeight: 700, fontFamily: "monospace", fontSize: "0.75rem", color: colorSuper }}>TKT-{l.id}</td>
                                <td style={{ padding: "0.75rem", fontWeight: 700, color: "#0f172a", fontFamily: "monospace" }}>{l.placa}</td>
                                <td style={{ padding: "0.75rem", fontSize: "0.78rem" }}>{veh ? `${veh.marca} ${veh.modelo} (${veh.color})` : '—'}</td>
                                <td style={{ padding: "0.75rem", fontSize: "0.78rem" }}>#{spot?.numero || '—'}{apt ? ` — N°${apt.numero}` : ''}</td>
                                <td style={{ padding: "0.75rem" }}>
                                  <span style={styles.badge(
                                    l.ocupante === 'PROPIETARIO' ? "rgba(16,185,129,0.1)" : l.ocupante === 'INQUILINO' ? "rgba(245,158,11,0.1)" : "rgba(59,130,246,0.1)",
                                    l.ocupante === 'PROPIETARIO' ? "#10b981" : l.ocupante === 'INQUILINO' ? "#f59e0b" : "#3b82f6"
                                  )}>{l.ocupante || '—'}</span>
                                </td>
                                <td style={{ padding: "0.75rem", fontSize: "0.78rem" }}>{l.datosInquilino || '—'}</td>
                                <td style={{ padding: "0.75rem", fontSize: "0.75rem", color: "#64748b" }}>{formatDate(l.fechaEntrada)}</td>
                                <td style={{ padding: "0.75rem", fontSize: "0.75rem", color: l.fechaSalida ? "#64748b" : "#10b981", fontWeight: l.fechaSalida ? 400 : 600 }}>
                                  {l.fechaSalida ? formatDate(l.fechaSalida) : <span style={{ color: "#10b981" }}>Dentro</span>}
                                </td>
                                <td style={{ padding: "0.75rem", fontSize: "0.7rem", color: "#64748b" }}>{l.metodo || '—'}</td>
                                <td style={{ padding: "0.75rem", fontSize: "0.7rem", color: "#64748b" }}>{condo?.nombre || '—'}</td>
                                <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                                  <button onClick={() => openTicket(l)} style={{ background: "none", border: "none", cursor: "pointer", color: colorSuper }} title="Ver ticket">
                                    <FiEye size={15} />
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                          {filtered.length === 0 && <tr><td colSpan={12} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Sin registros</td></tr>}
                        </tbody>
                      </table>
                    </div>
                    <Pagination arr={filtered} page={logPage} setPage={setLogPage} />
                  </>)
                })()}
              </div>
            </div>
          )}

          {/* ===== RESERVAS ===== */}
          {activeTab === 'reservas' && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={styles.card}>
                <div style={{ ...styles.cardHeader, cursor: "pointer" }} onClick={() => setReserveOpen(!reserveOpen)}>
                  <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <FiClock size={14} color="#f59e0b" /> Reservar Estacionamiento
                  </span>
                  <span style={{ color: reserveOpen ? "#f59e0b" : "#94a3b8", fontWeight: 700, fontSize: "0.8rem", transition: "transform 0.2s", transform: reserveOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                    {reserveOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                  </span>
                </div>
                {reserveOpen && (
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    if (!reserveForm.placa) return showToast('Selecciona un vehículo', 'error')
                    if (!reserveForm.idEstacionamiento) return showToast('Selecciona un estacionamiento', 'error')
                    setSaving(true)
                    try {
                      const selected = vehicles.find(v => v.placa === reserveForm.placa)
                      const owner = vehicleOwnerMap[selected?.id]
                      const result = await registerVehicleEntry({
                        placa: reserveForm.placa, metodo: reserveForm.metodo,
                        ocupante: reserveForm.ocupante,
                        datosInquilino: reserveForm.ocupante === 'INQUILINO' ? (reserveForm.datosInquilino || owner?.nombre || '') : null,
                        idEstacionamiento: parseInt(reserveForm.idEstacionamiento)
                      }, condoId)
                      if (result?.id) setReservations(prev => {
                        const filtered = prev.filter(r => r.id !== result.id)
                        return [...filtered, { id: result.id, horas: reserveForm.horas }]
                      })
                      showToast(`Reservado por ${reserveForm.horas}h`)
                      setReserveForm({ placa: '', metodo: 'MANUAL', ocupante: 'PROPIETARIO', datosInquilino: '', idEstacionamiento: '', horas: 1 })
                      setReserveFilters({ torre: '', piso: '', aptId: '' })
                      setReserveTorreText(''); setReservePisoText(''); setReserveAptText(''); setReservePlacaText(''); setReserveParkText('')
                      loadData(condoId)
                    } catch (e) { showToast('Error: ' + e.message, 'error') }
                    finally { setSaving(false) }
                  }} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Asigna un estacionamiento a un vehículo por tiempo limitado. Se registrará la entrada y se liberará automáticamente al vencer.</div>
                    <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Seleccionar torre</label>
                    <DataList value={reserveTorreText} onChange={e => { setReserveTorreText(e.target.value); setReserveFilters(f => ({ ...f, torre: e.target.value, piso: '', aptId: '' })) }} style={{ ...styles.select, fontSize: "0.7rem" }}>
                      <option value="">Torre</option>
                      {towers.map(t => <option key={t} value={t} />)}
                    </DataList>
                    <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Seleccionar piso</label>
                    <DataList value={reservePisoText} onChange={e => { setReservePisoText(e.target.value); setReserveFilters(f => ({ ...f, piso: e.target.value, aptId: '' })) }} style={{ ...styles.select, fontSize: "0.7rem" }}>
                      <option value="">Piso</option>
                      {floors.map(f => <option key={f} value={f} />)}
                    </DataList>
                    <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Seleccionar departamento</label>
                    <DataList value={reserveAptText} onChange={e => { setReserveAptText(e.target.value); const apt = apartments.find(a => `N° ${a.numero}` === e.target.value || String(a.numero) === e.target.value); if (apt) { setReserveFilters(f => ({ ...f, aptId: String(apt.id) })); if (apt.nombrePropietario) setReserveForm(f => ({ ...f, ocupante: 'PROPIETARIO', datosInquilino: apt.nombrePropietario })) } else { setReserveFilters(f => ({ ...f, aptId: '' })); setReserveForm(f => ({ ...f, ocupante: 'PROPIETARIO', datosInquilino: '' })) } }} style={{ ...styles.select, fontSize: "0.7rem" }}>
                      <option value="">Departamento</option>
                      {apartments.filter(a =>
                        (!reserveFilters.torre || a.torreNombre === reserveFilters.torre) &&
                        (!reserveFilters.piso || String(a.pisoNumero) === reserveFilters.piso)
                      ).map(a => <option key={a.id} value={`N° ${a.numero}`} />)}
                    </DataList>
                    {reserveFilters.aptId && (() => {
                      const apt = apartments.find(a => String(a.id) === reserveFilters.aptId)
                      if (!apt) return null
                      const occupants = []
                      if (apt.nombrePropietario) occupants.push({ label: `${apt.nombrePropietario} (Dueño)`, nombre: apt.nombrePropietario, tipo: 'PROPIETARIO', dni: '' })
                      if (apt.inquilinos) apt.inquilinos.forEach(inq => occupants.push({ label: `${inq.nombres} ${inq.apellidos} (Inquilino)`, nombre: `${inq.nombres} ${inq.apellidos}`, tipo: 'INQUILINO', dni: inq.numeroDocumento }))
                      return occupants.length > 0 ? (
                        <select style={styles.select} value={reserveForm.datosInquilino} onChange={e => {
                          const sel = occupants.find(o => o.nombre === e.target.value)
                          if (sel) setReserveForm(f => ({ ...f, ocupante: sel.tipo, datosInquilino: sel.nombre }))
                        }}>
                          <option value="">Seleccionar ocupante de N° {apt.numero}</option>
                          {occupants.map(o => <option key={o.nombre} value={o.nombre}>{o.label}{o.dni ? ` — DNI: ${o.dni}` : ''}</option>)}
                        </select>
                      ) : (
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8", textAlign: "center", padding: "0.5rem" }}>Sin ocupantes registrados en N° {apt.numero}</div>
                      )
                    })()}
                    <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Seleccionar vehículo</label>
                    <DataList value={reservePlacaText} onChange={e => { setReservePlacaText(e.target.value); const v = vehicles.find(x => x.placa === e.target.value); const owner = vehicleOwnerMap[v?.id]; if (owner && !reserveFilters.aptId) { setReserveForm(f => ({ ...f, placa: e.target.value, ocupante: owner.tipo, datosInquilino: owner.nombre })) } else { setReserveForm(f => ({ ...f, placa: e.target.value })) } }} required style={styles.select}>
                      <option value="">Seleccionar vehículo</option>
                      {vehicles.filter(v => !v.idEstacionamiento).map(v => (
                        <option key={v.id} value={v.placa} />
                      ))}
                    </DataList>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                      <div>
                        <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Método</label>
                        <select style={styles.select} value={reserveForm.metodo} onChange={e => setReserveForm(f => ({ ...f, metodo: e.target.value }))}>
                          <option value="OCR">OCR</option>
                          <option value="MANUAL">Manual</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Tipo ocupante</label>
                        <select style={styles.select} value={reserveForm.ocupante} onChange={e => setReserveForm(f => ({ ...f, ocupante: e.target.value }))}>
                          <option value="PROPIETARIO">Propietario</option>
                          <option value="INQUILINO">Inquilino</option>
                        </select>
                      </div>
                    </div>
                    {reserveForm.ocupante === 'INQUILINO' && (
                      <input style={styles.input} placeholder="Nombre del inquilino" value={reserveForm.datosInquilino} onChange={e => setReserveForm(f => ({ ...f, datosInquilino: e.target.value }))} />
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                      <div>
                        <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Seleccionar estacionamiento</label>
                        <DataList value={reserveParkText} onChange={e => { setReserveParkText(e.target.value); const s = parking.filter(p => (p.cantidadActual || 0) < (p.capacidadMaxima ?? 1)).find(p => `#${p.numero || p.id} — ${p.tipoVehiculo || 'Mixto'} (${(p.capacidadMaxima || 1) - (p.cantidadActual || 0)} libres)` === e.target.value); if (s) setReserveForm(f => ({ ...f, idEstacionamiento: String(s.id) })) }} required style={styles.select}>
                          <option value="">Estacionamiento</option>
                          {parking.filter(p => (p.cantidadActual || 0) < (p.capacidadMaxima ?? 1)).map(p => (
                            <option key={p.id} value={`#${p.numero || p.id} — ${p.tipoVehiculo || 'Mixto'} (${(p.capacidadMaxima || 1) - (p.cantidadActual || 0)} libres)`} />
                          ))}
                        </DataList>
                      </div>
                      <div>
                        <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Horas</label>
                        <select style={styles.select} value={reserveForm.horas} onChange={e => setReserveForm(f => ({ ...f, horas: Number(e.target.value) }))}>
                          {[1, 2, 3, 4, 6, 8, 12, 24].map(h => <option key={h} value={h}>{h}h</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                      <FiClock size={11} style={{ marginRight: "0.25rem" }} />
                      Expira aprox. {new Date(Date.now() + reserveForm.horas * 3600000).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <button type="submit" disabled={saving || vehicles.length === 0} style={{ ...styles.btnWarning, width: "100%", justifyContent: "center", padding: "0.6rem" }}>
                      {saving ? '...' : <><FiClock size={14} /> Reservar por {reserveForm.horas}h</>}
                    </button>
                  </form>
                )}
              </div>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <FiCalendar size={14} color={colorSuper} /> Historial de Reservas ({logs.filter(l => reservations.some(r => r.id === l.id)).length})
                  </span>
                  <div style={{ position: "relative" }}>
                    <FiSearch size={13} style={{ position: "absolute", left: "0.5rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input type="text" placeholder="Buscar reserva..." value={reservaSearch} onChange={e => { setReservaSearch(e.target.value); setReservaPage(1) }}
                      style={{ ...styles.input, padding: "0.35rem 0.5rem 0.35rem 1.6rem", fontSize: "0.75rem", width: "180px" }} />
                  </div>
                </div>
                {(() => {
                  const reservasFiltradas = logs.filter(l => reservations.some(r => r.id === l.id))
                    .filter(l => !reservaSearch || l.placa?.toLowerCase().includes(reservaSearch.toLowerCase()) ||
                      l.ocupante?.toLowerCase().includes(reservaSearch.toLowerCase()) || String(l.id).includes(reservaSearch))
                  if (reservasFiltradas.length === 0) return (
                    <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>No hay reservas registradas</div>
                  )
                  const paged = paginate(reservasFiltradas, reservaPage)
                  return (<>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                            <th style={{ padding: "0.75rem 1rem" }}>Ticket</th>
                            <th style={{ padding: "0.75rem" }}>Placa</th>
                            <th style={{ padding: "0.75rem" }}>Vehículo</th>
                            <th style={{ padding: "0.75rem" }}>Estacionamiento</th>
                            <th style={{ padding: "0.75rem" }}>Ocupante</th>
                            <th style={{ padding: "0.75rem" }}>Duración</th>
                            <th style={{ padding: "0.75rem" }}>Entrada</th>
                            <th style={{ padding: "0.75rem" }}>Expira</th>
                            <th style={{ padding: "0.75rem" }}>Salida</th>
                            <th style={{ padding: "0.75rem" }}>Método</th>
                            <th style={{ padding: "0.75rem" }}>Ticket</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paged.map(l => {
                            const veh = vehicles.find(v => String(v.id) === String(l.idVehiculo))
                            const spot = parking.find(p => String(p.id) === String(l.idEstacionamiento))
                            const apt = spot ? apartments.find(a => String(a.id) === String(spot.idApartamento)) : null
                            const res = reservations.find(r => r.id === l.id)
                            const horas = res?.horas || 1
                            const expira = l.fechaEntrada ? new Date(new Date(l.fechaEntrada).getTime() + horas * 3600000) : null
                            return (
                              <tr key={l.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "0.6rem 1rem", fontWeight: 700, fontFamily: "monospace", fontSize: "0.75rem" }}>TKT-{l.id}</td>
                                <td style={{ padding: "0.6rem", fontWeight: 700, fontFamily: "monospace" }}>{l.placa}</td>
                                <td style={{ padding: "0.6rem" }}>{veh ? `${veh.marca} ${veh.modelo}` : '—'}</td>
                                <td style={{ padding: "0.6rem" }}>#{spot?.numero || '—'}{apt ? ` (N° ${apt.numero})` : ''}</td>
                                <td style={{ padding: "0.6rem" }}>{l.ocupante || '—'}</td>
                                <td style={{ padding: "0.6rem", fontWeight: 700, color: "#f59e0b" }}>{horas}h</td>
                                <td style={{ padding: "0.6rem", fontSize: "0.75rem" }}>{formatDate(l.fechaEntrada)}</td>
                                <td style={{ padding: "0.6rem", fontSize: "0.75rem" }}>
                                  {l.fechaSalida ? '—' : expira ? (
                                    <span style={Date.now() > expira.getTime() ? { color: '#ef4444', fontWeight: 600 } : { color: '#10b981', fontWeight: 600 }}>
                                      {formatDate(expira.toISOString())}{Date.now() > expira.getTime() ? ' (Vencido)' : ''}
                                    </span>
                                  ) : '—'}
                                </td>
                                <td style={{ padding: "0.6rem", fontSize: "0.75rem" }}>{l.fechaSalida ? formatDate(l.fechaSalida) : <span style={{ color: "#f59e0b", fontWeight: 600 }}>En curso</span>}</td>
                                <td style={{ padding: "0.6rem" }}>{l.metodo || '—'}</td>
                                <td style={{ padding: "0.6rem" }}>
                                  <button onClick={() => openTicket(l)} style={{ background: "none", border: "none", cursor: "pointer", color: colorSuper, fontSize: "0.7rem", fontWeight: 600 }}>
                                    Ver
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                    <Pagination arr={reservasFiltradas} page={reservaPage} setPage={setReservaPage} />
                  </>)
                })()}
              </div>
            </div>
          )}

          {/* ===== VEHÍCULOS ===== */}
          {activeTab === 'vehiculos' && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <FiNavigation2 size={15} color={colorSuper} /> Vehículos Registrados ({vehicles.length})
                </span>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <div style={{ position: "relative" }}>
                    <FiSearch size={13} style={{ position: "absolute", left: "0.5rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input type="text" placeholder="Buscar placa, marca..." value={vehicleSearch} onChange={e => { setVehicleSearch(e.target.value); setVehiclePage(1) }}
                      style={{ ...styles.input, padding: "0.35rem 0.5rem 0.35rem 1.6rem", fontSize: "0.75rem", width: "180px" }} />
                  </div>
                  <button onClick={() => loadData(condoId)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiRefreshCw size={16} /></button>
                  <button onClick={() => { setVehicleForm({ id: null, marca: '', color: 'BLANCO', modelo: '', placa: '', tipo: 'AUTO', inquilinoId: '' }); setVehInquilinoText(''); setShowModal('vehicle') }} style={styles.btnPrimary}>
                    <FiPlus size={14} /> Agregar
                  </button>
                </div>
              </div>
              {(() => {
                const filtered = vehicles.filter(v =>
                  !vehicleSearch || v.placa?.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
                  v.marca?.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
                  v.modelo?.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
                  v.color?.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
                  v.tipo?.toLowerCase().includes(vehicleSearch.toLowerCase())
                )
                if (filtered.length === 0) return (
                  <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>No hay vehículos registrados</div>
                )
                const paged = paginate(filtered, vehiclePage)
                return (<>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                          <th style={{ padding: "0.75rem 1rem" }}>Placa</th>
                          <th style={{ padding: "0.75rem" }}>Marca</th>
                          <th style={{ padding: "0.75rem" }}>Modelo</th>
                          <th style={{ padding: "0.75rem" }}>Color</th>
                          <th style={{ padding: "0.75rem" }}>Tipo</th>
                          <th style={{ padding: "0.75rem" }}>Estacionamiento</th>
                          <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Acción</th>
                        </tr>
                      </thead>
                      <tbody style={{ color: "#334155" }}>
                        {paged.map(v => {
                          const spot = parking.find(p => String(p.id) === String(v.idEstacionamiento))
                          return (
                            <tr key={v.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                              <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "#0f172a", fontFamily: "monospace" }}>{v.placa}</td>
                              <td style={{ padding: "0.75rem" }}>{v.marca}</td>
                              <td style={{ padding: "0.75rem" }}>{v.modelo}</td>
                              <td style={{ padding: "0.75rem" }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                                  <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", backgroundColor: colorSwatch(v.color), border: "1px solid #e2e8f0", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }} />
                                  {v.color}
                                </span>
                              </td>
                              <td style={{ padding: "0.75rem" }}>
                                <span style={styles.badge(v.tipo === 'AUTO' ? "rgba(124,58,237,0.1)" : "rgba(139,92,246,0.1)", v.tipo === 'AUTO' ? colorSuper : "#8b5cf6")}>{v.tipo}</span>
                              </td>
                              <td style={{ padding: "0.75rem", color: "#64748b" }}>{spot ? `#${spot.numero || spot.id}` : '—'}</td>
                              <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                                <div style={{ display: "flex", gap: "0.3rem", justifyContent: "flex-end" }}>
                                  <button onClick={() => { const t = allTenantsList.find(x => String(x.id) === String(v.inquilinoId)); setVehInquilinoText(t ? `${t.nombres} ${t.apellidos} — ${t.numeroDocumento} (Apt ${t.apartamentoNumero})` : ''); setVehicleForm({ id: v.id, placa: v.placa, marca: v.marca, modelo: v.modelo, color: v.color, tipo: v.tipo, inquilinoId: v.inquilinoId ? String(v.inquilinoId) : '' }); setShowModal('vehicle') }}
                                    style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "none", padding: "0.3rem 0.55rem", borderRadius: "0.4rem", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer" }}>
                                    <FiEdit3 size={13} />
                                  </button>
                                  <button onClick={() => handleDeleteVehicle(v.id)}
                                    style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", padding: "0.3rem 0.55rem", borderRadius: "0.4rem", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer" }}>
                                    <FiTrash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <Pagination arr={filtered} page={vehiclePage} setPage={setVehiclePage} />
                </>)
              })()}
            </div>
          )}

          {/* ===== CARRITOS ===== */}
          {activeTab === 'carritos' && (<>
            <div style={{ ...styles.card, marginBottom: "1rem" }}>
              <div style={styles.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiTruck size={16} color={colorSuper} />
                  <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0f172a" }}>Carritos</span>
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>({stats.totalCarts})</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <div style={{ position: "relative" }}>
                    <FiSearch size={13} style={{ position: "absolute", left: "0.5rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input type="text" placeholder="Buscar carrito..." value={cartSearch} onChange={e => { setCartSearch(e.target.value); setCartPage(1) }}
                      style={{ ...styles.input, padding: "0.35rem 0.5rem 0.35rem 1.6rem", fontSize: "0.75rem", width: "160px" }} />
                  </div>
                  <button onClick={() => setShowModal('createCart')} style={styles.btnPrimary}><FiPlus size={14} /> Agregar</button>
                </div>
              </div>
              {(() => {
                const filtered = carts.filter(c =>
                  !cartSearch || c.codigo?.toLowerCase().includes(cartSearch.toLowerCase()) ||
                  c.estado?.toLowerCase().includes(cartSearch.toLowerCase()) ||
                  String(c.id).includes(cartSearch)
                )
                const paged = paginate(filtered, cartPage)
                return (<>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                          <th style={{ padding: "0.75rem 1rem" }}>Código</th>
                          <th style={{ padding: "0.75rem" }}>Estado</th>
                          <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Acción</th>
                        </tr>
                      </thead>
                      <tbody style={{ color: "#334155" }}>
                        {paged.map(c => (
                          <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "#0f172a", fontFamily: "monospace" }}>{c.codigo || `#${c.id}`}</td>
                            <td style={{ padding: "0.75rem" }}>
                              <select value={c.estado || 'DISPONIBLE'} onChange={e => handleCartState(c, e.target.value)}
                                style={{ fontSize: "0.7rem", fontWeight: 700, padding: "0.25rem 0.5rem", borderRadius: "0.4rem", border: "none", cursor: "pointer", outline: "none", backgroundColor: states[c.estado]?.bg || states.DISPONIBLE.bg, color: states[c.estado]?.color || states.DISPONIBLE.color }}>
                                <option value="DISPONIBLE">Disponible</option>
                                <option value="EN_USO">En uso</option>
                                <option value="MANTENIMIENTO">Mantenimiento</option>
                              </select>
                            </td>
                            <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                              <div style={{ display: "flex", gap: "0.3rem", justifyContent: "flex-end" }}>
                                <button onClick={() => setDetailItem(c)} style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "none", padding: "0.3rem 0.55rem", borderRadius: "0.4rem", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer" }}><FiEye size={13} /></button>
                                <button onClick={() => setConfirmDelete({ id: c.id, tipo: 'CARRITO' })} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", padding: "0.3rem 0.55rem", borderRadius: "0.4rem", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer" }}><FiTrash2 size={13} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filtered.length === 0 && <tr><td colSpan={3} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Sin carritos</td></tr>}
                      </tbody>
                    </table>
                  </div>
                  <Pagination arr={filtered} page={cartPage} setPage={setCartPage} />
                </>)
              })()}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={styles.card}>
                <div style={{ ...styles.cardHeader, cursor: "pointer" }} onClick={() => setCartOpen(!cartOpen)}>
                  <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0f172a" }}>Préstamo de Carrito</span>
                  <span style={{ color: cartOpen ? "#10b981" : "#94a3b8", fontWeight: 700, fontSize: "0.8rem", transition: "transform 0.2s", transform: cartOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                    {cartOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                  </span>
                </div>
                {cartOpen && (
                  <form onSubmit={handleCartLoan} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Seleccionar carrito</label>
                    <DataList value={cartCodigoCarritoText} onChange={e => { setCartCodigoCarritoText(e.target.value); setCartLoanForm(f => ({ ...f, codigoCarrito: e.target.value })) }} required style={styles.select}>
                      <option value="">Seleccionar carrito</option>
                      {carts.filter(c => c.estado === 'DISPONIBLE' && c.codigo).map(c => <option key={c.id} value={c.codigo} />)}
                    </DataList>
                    <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Seleccionar torre</label>
                    <DataList value={cartTorreText} onChange={e => { setCartTorreText(e.target.value); setCartFilters(f => ({ ...f, torre: e.target.value, piso: '', aptId: '' })) }} style={{ ...styles.select, fontSize: "0.7rem" }}>
                      <option value="">Torre</option>
                      {towers.map(t => <option key={t} value={t} />)}
                    </DataList>
                    <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Seleccionar piso</label>
                    <DataList value={cartPisoText} onChange={e => { setCartPisoText(e.target.value); setCartFilters(f => ({ ...f, piso: e.target.value, aptId: '' })) }} style={{ ...styles.select, fontSize: "0.7rem" }}>
                      <option value="">Piso</option>
                      {[...new Set(apartments.filter(a => !cartFilters.torre || a.torreNombre === cartFilters.torre).map(a => a.pisoNumero).filter(Boolean))].map(f => <option key={f} value={f} />)}
                    </DataList>
                    <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Seleccionar departamento</label>
                    <DataList value={cartAptText} onChange={e => { setCartAptText(e.target.value); const apt = apartments.find(a => `N° ${a.numero}` === e.target.value || String(a.numero) === e.target.value); if (apt) { setCartFilters(f => ({ ...f, aptId: String(apt.id) })); setCartLoanForm(f => ({ ...f, idApartamento: String(apt.id), numeroApartamento: apt.numero, idPropietario: apt.idPropietario || '', nombreSolicitante: apt.nombrePropietario || '', solicitante: 'PROPIETARIO', dniSolicitante: '' })) } else { setCartFilters(f => ({ ...f, aptId: '' })); setCartLoanForm(f => ({ ...f, idApartamento: '', numeroApartamento: '', idPropietario: '', nombreSolicitante: '', solicitante: 'PROPIETARIO', dniSolicitante: '' })) } }} style={{ ...styles.select, fontSize: "0.7rem" }}>
                      <option value="">Departamento</option>
                      {apartments.filter(a =>
                        (!cartFilters.torre || a.torreNombre === cartFilters.torre) &&
                        (!cartFilters.piso || String(a.pisoNumero) === cartFilters.piso)
                      ).map(a => <option key={a.id} value={`N° ${a.numero}`} />)}
                    </DataList>
                    {cartFilters.aptId && (() => {
                      const apt = apartments.find(a => String(a.id) === cartFilters.aptId)
                      if (!apt) return null
                      const occupants = []
                      if (apt.nombrePropietario) occupants.push({ label: `${apt.nombrePropietario} (Dueño)`, nombre: apt.nombrePropietario, tipo: 'PROPIETARIO', id: apt.idPropietario, dni: '' })
                      if (apt.inquilinos) apt.inquilinos.forEach(inq => occupants.push({ label: `${inq.nombres} ${inq.apellidos} (Inquilino)`, nombre: `${inq.nombres} ${inq.apellidos}`, tipo: 'INQUILINO', id: inq.id, dni: inq.numeroDocumento }))
                      return occupants.length > 0 ? (
                        <select style={styles.select} value={`${cartLoanForm.solicitante}|${cartLoanForm.nombreSolicitante}`} onChange={e => {
                          const sel = occupants.find(o => `${o.tipo}|${o.nombre}` === e.target.value)
                          if (sel) setCartLoanForm(f => ({
                            ...f,
                            solicitante: sel.tipo,
                            nombreSolicitante: sel.nombre,
                            dniSolicitante: sel.dni || '',
                            idPropietario: sel.tipo === 'PROPIETARIO' ? (sel.id || '') : '',
                            idInquilino: sel.tipo === 'INQUILINO' ? (sel.id || '') : ''
                          }))
                        }}>
                          <option value="">Seleccionar ocupante de N° {apt.numero}</option>
                          {occupants.map(o => <option key={o.nombre} value={`${o.tipo}|${o.nombre}`}>{o.label}{o.dni ? ` — DNI: ${o.dni}` : ''}</option>)}
                        </select>
                      ) : (
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8", textAlign: "center", padding: "0.5rem" }}>Sin ocupantes registrados en N° {apt.numero}</div>
                      )
                    })()}
                    <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>Nombre del solicitante</label>
                    <input style={styles.input} placeholder="Nombre del solicitante" value={cartLoanForm.nombreSolicitante} onChange={e => setCartLoanForm(f => ({ ...f, nombreSolicitante: e.target.value }))} required />
                    <label style={{ ...styles.label, fontSize: "0.7rem", color: "#475569", textAlign: "left" }}>DNI</label>
                    <input style={styles.input} placeholder="DNI" value={cartLoanForm.dniSolicitante} onChange={e => setCartLoanForm(f => ({ ...f, dniSolicitante: e.target.value }))} required />
                    {carts.filter(c => c.estado === 'DISPONIBLE').length === 0 && <div style={{ fontSize: "0.75rem", color: "#ef4444" }}>No hay carritos disponibles</div>}
                    <button type="submit" disabled={saving || carts.filter(c => c.estado === 'DISPONIBLE').length === 0} style={{ ...styles.btnSuccess, width: "100%", justifyContent: "center", padding: "0.6rem" }}>
                      {saving ? '...' : 'Prestar Carrito'}
                    </button>
                  </form>
                )}
              </div>

              {activeLoans.length > 0 && (
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0f172a" }}>Préstamos Activos ({activeLoans.length})</span>
                  </div>
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {activeLoans.map(loan => (
                      <div key={loan.id} style={{ padding: "0.6rem 1rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a" }}>{loan.nombreSolicitante}</div>
                          <div style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{loan.codigoCarrito} · {loan.dniSolicitante}</div>
                        </div>
                        <button onClick={() => handleReturnCart(loan.id)} style={styles.btnSuccess}>Devolver</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {allCartLoans.length > 0 && (
              <div style={{ marginTop: "1.5rem" }}>
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#0f172a" }}>Historial de Préstamos ({allCartLoans.length})</span>
                    <div style={{ position: "relative" }}>
                      <FiSearch size={13} style={{ position: "absolute", left: "0.5rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                      <input type="text" placeholder="Buscar préstamo..." value={loanSearch} onChange={e => { setLoanSearch(e.target.value); setLoanPage(1) }}
                        style={{ ...styles.input, padding: "0.35rem 0.5rem 0.35rem 1.6rem", fontSize: "0.75rem", width: "180px" }} />
                    </div>
                  </div>
                  {(() => {
                    const filtered = allCartLoans.filter(l =>
                      !loanSearch || l.codigoCarrito?.toLowerCase().includes(loanSearch.toLowerCase()) ||
                      l.nombreSolicitante?.toLowerCase().includes(loanSearch.toLowerCase()) ||
                      l.dniSolicitante?.toLowerCase().includes(loanSearch.toLowerCase()) ||
                      l.solicitante?.toLowerCase().includes(loanSearch.toLowerCase()) ||
                      String(l.id).includes(loanSearch)
                    )
                    const paged = paginate(filtered, loanPage)
                    return (<>
                      <div style={{ overflowX: "auto" }}>
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
                            </tr>
                          </thead>
                          <tbody>
                            {paged.map((loan, i) => {
                              const apt = apartments.find(a => String(a.id) === String(loan.idApartamento))
                              return (
                                <tr key={loan.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                  <td style={tdStyle}>{(loanPage - 1) * PER_PAGE + i + 1}</td>
                                  <td style={tdStyle}><strong>{loan.codigoCarrito || '—'}</strong></td>
                                  <td style={tdStyle}>{loan.nombreSolicitante}<br /><span style={{ color: "#94a3b8" }}>{loan.dniSolicitante}</span></td>
                                  <td style={tdStyle}>{loan.solicitante === 'PROPIETARIO' ? <span style={styles.badge("#e0e7ff", "#4338ca")}>Dueño</span> : <span style={styles.badge("#fef3c7", "#d97706")}>Inquilino</span>}</td>
                                  <td style={tdStyle}>N° {apt?.numero || '—'}</td>
                                  <td style={tdStyle}>{apt?.torreNombre || '—'}</td>
                                  <td style={tdStyle}>{apt?.pisoNumero != null ? `Piso ${apt.pisoNumero}` : '—'}</td>
                                  <td style={tdStyle}>{fmtDate(loan.fechaPrestamo)}</td>
                                  <td style={tdStyle}>{loan.fechaDevolucion ? fmtDate(loan.fechaDevolucion) : '—'}</td>
                                  <td style={tdStyle}>{loan.fechaDevolucion ? <span style={styles.badge("#dcfce7", "#16a34a")}>Devuelto</span> : <span style={styles.badge("#fef3c7", "#d97706")}>Activo</span>}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                      <Pagination arr={filtered} page={loanPage} setPage={setLoanPage} />
                    </>)
                  })()}
                </div>
              </div>
            )}
          </>)}
        </>
      )}

      {/* ===== CART TICKET MODAL ===== */}
      {cartTicket && (
        <div style={styles.modalOverlay} onClick={() => setCartTicket(null)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", color: colorSuper, marginBottom: "0.5rem" }}><FiFileText /></div>
              <h3 style={{ margin: "0 0 0.25rem", fontSize: "1.1rem", fontWeight: 800, color: "#1e293b" }}>Comprobante de Préstamo</h3>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Préstamo de Carrito · #{cartTicket.id}</div>
            </div>
            <div style={{ padding: "0 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <div style={styles.label}>Carrito</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>{cartTicket.codigoCarrito}</div>
                </div>
                <div>
                  <div style={styles.label}>Fecha de Préstamo</div>
                  <div style={{ fontSize: "0.85rem", color: "#0f172a" }}>{fmtDate(cartTicket.fechaPrestamo)}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <div style={styles.label}>Solicitante</div>
                  <div style={{ fontSize: "0.85rem", color: "#0f172a" }}>{cartTicket.nombreSolicitante}</div>
                </div>
                <div>
                  <div style={styles.label}>DNI</div>
                  <div style={{ fontSize: "0.85rem", color: "#0f172a" }}>{cartTicket.dniSolicitante}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <div style={styles.label}>Departamento</div>
                  <div style={{ fontSize: "0.85rem", color: "#0f172a" }}>N° {cartTicket.aptNumero}</div>
                </div>
                <div>
                  <div style={styles.label}>Torre / Piso</div>
                  <div style={{ fontSize: "0.85rem", color: "#0f172a" }}>{cartTicket.aptTorre}{cartTicket.aptPiso ? ` · Piso ${cartTicket.aptPiso}` : ''}</div>
                </div>
              </div>
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "center" }}>
              <button onClick={() => setCartTicket(null)} style={styles.btnSuccess}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CREATE PARKING MODAL ===== */}
      {(showModal === 'create' || showModal === 'createCart') && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(null)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#1e293b" }}>
                {showModal === 'create' ? 'Nuevo Estacionamiento' : 'Nuevo Carrito'}
              </h3>
              <button onClick={() => setShowModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {showModal === 'createCart' ? (
                  <div>
                    <label style={styles.label}>Código del carrito</label>
                    <input style={styles.input} placeholder="Ej: CARR-001" value={createForm.codigo} onChange={e => setCreateForm(f => ({ ...f, codigo: e.target.value }))} />
                  </div>
                ) : (
                  <>
                    <div>
                      <label style={styles.label}>Número</label>
                      <input type="number" min="1" style={styles.input} placeholder="Ej: 15" value={createForm.numero} onChange={e => setCreateForm(f => ({ ...f, numero: e.target.value }))} />
                    </div>
                    <div>
                      <label style={styles.label}>Tipo de vehículo</label>
                      <select style={styles.select} value={createForm.tipoVehiculo} onChange={e => setCreateForm(f => ({ ...f, tipoVehiculo: e.target.value }))}>
                        <option value="AUTO">Auto (4x4)</option>
                        <option value="MOTO">Moto (4x2)</option>
                      </select>
                    </div>
                    <div>
                      <label style={styles.label}>Capacidad máxima (celdas)</label>
                      <input type="number" min="1" max="16" style={styles.input} value={createForm.capacidadMaxima} onChange={e => setCreateForm(f => ({ ...f, capacidadMaxima: e.target.value }))} />
                    </div>
                  </>
                )}
              </div>
              <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
                <button type="submit" disabled={saving} style={{ backgroundColor: colorSuper, border: "none", color: "#fff", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button type="button" onClick={() => setShowModal(null)} style={{ backgroundColor: "#fff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== VEHICLE MODAL ===== */}
      {showModal === 'vehicle' && (
        <div style={styles.modalOverlay} onClick={() => { setShowModal(null); setVehicleForm({ id: null, marca: '', color: 'BLANCO', modelo: '', placa: '', tipo: 'AUTO', inquilinoId: '' }); setVehInquilinoText('') }}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#1e293b" }}>
                <FiNavigation2 size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />{vehicleForm.id ? 'Editar Vehículo' : 'Nuevo Vehículo'}
              </h3>
              <button onClick={() => { setShowModal(null); setVehicleForm({ id: null, marca: '', color: 'BLANCO', modelo: '', placa: '', tipo: 'AUTO', inquilinoId: '' }); setVehInquilinoText('') }} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>
            <form onSubmit={vehicleForm.id ? handleEditVehicle : handleCreateVehicle}>
              <div style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={styles.label}>Placa</label>
                  <input style={styles.input} placeholder="ABC-123" value={vehicleForm.placa} onChange={e => setVehicleForm(f => ({ ...f, placa: e.target.value }))} required />
                </div>
                <div>
                  <label style={styles.label}>Marca</label>
                  <DataList value={vehicleForm.marca} onChange={e => setVehicleForm(f => ({ ...f, marca: e.target.value.toUpperCase(), modelo: '' }))} required style={styles.select}>
                    <option value="">Seleccionar marca</option>
                    {Object.keys(brandModels).map(b => <option key={b} value={b} />)}
                  </DataList>
                </div>
                <div>
                  <label style={styles.label}>Modelo</label>
                  <DataList value={vehicleForm.modelo} onChange={e => setVehicleForm(f => ({ ...f, modelo: e.target.value.toUpperCase() }))} required={!!vehicleForm.marca} style={styles.select}>
                    <option value="">Seleccionar modelo</option>
                    {(brandModels[vehicleForm.marca] || []).map(m => <option key={m} value={m} />)}
                  </DataList>
                </div>
                <div>
                  <label style={styles.label}>Color</label>
                  <DataList value={vehicleForm.color} onChange={e => setVehicleForm(f => ({ ...f, color: e.target.value }))} required style={styles.select}>
                    <option value="">Seleccionar color</option>
                    {['BLANCO', 'NEGRO', 'ROJO', 'AZUL', 'VERDE', 'GRIS', 'PLATEADO', 'AMARILLO', 'NARANJA', 'MARRON', 'DORADO', 'CELESTE', 'BEIGE', 'VINO'].map(c => <option key={c} value={c} />)}
                  </DataList>
                </div>
                <div>
                  <label style={styles.label}>Tipo</label>
                  <select style={styles.select} value={vehicleForm.tipo} onChange={e => setVehicleForm(f => ({ ...f, tipo: e.target.value }))}>
                    <option value="AUTO">Auto</option>
                    <option value="MOTO">Moto</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Asignar a inquilino (opcional)</label>
                  <DataList value={vehInquilinoText} onChange={e => { setVehInquilinoText(e.target.value); const t = allTenantsList.find(x => `${x.nombres} ${x.apellidos} — ${x.numeroDocumento} (Apt ${x.apartamentoNumero})` === e.target.value); setVehicleForm(f => ({ ...f, inquilinoId: t ? String(t.id) : '' })) }} style={styles.select}>
                    <option value="">Propietario</option>
                    {allTenantsList.map(t => <option key={t.id} value={`${t.nombres} ${t.apellidos} — ${t.numeroDocumento} (Apt ${t.apartamentoNumero})`} />)}
                  </DataList>
                </div>
              </div>
              <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
                <button type="submit" disabled={saving} style={{ backgroundColor: colorSuper, border: "none", color: "#fff", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                  {saving ? 'Guardando...' : <><FiSave size={14} /> Guardar</>}
                </button>
                <button type="button" onClick={() => setShowModal(null)} style={{ backgroundColor: "#fff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== CONFIG MODAL ===== */}
      {showModal === 'config' && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(null)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#1e293b" }}><FiTool size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />Configurar Estacionamiento</h3>
              <button onClick={() => setShowModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>
            <form onSubmit={handleUpdateParkingConfig}>
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={styles.label}>Tipo de vehículo</label>
                  <select style={styles.select} value={configForm.tipoVehiculo} onChange={e => setConfigForm(f => ({ ...f, tipoVehiculo: e.target.value }))}>
                    <option value="AUTO">Auto</option>
                    <option value="MOTO">Moto</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Capacidad máxima (vehículos)</label>
                  <input type="number" min="1" max="16" style={styles.input} value={configForm.capacidadMaxima} onChange={e => setConfigForm(f => ({ ...f, capacidadMaxima: e.target.value }))} />
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", backgroundColor: "#f8fafc", padding: "0.75rem", borderRadius: "0.5rem" }}>
                  {configForm.tipoVehiculo === 'AUTO' ? 'Matriz 4×4: los autos se muestran en una cuadrícula de 4 columnas.' : 'Matriz 4×2: las motos se muestran en una cuadrícula de 4 columnas y 2 filas.'}
                </div>
              </div>
              <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
                <button type="submit" disabled={saving} style={{ backgroundColor: colorSuper, border: "none", color: "#fff", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                  {saving ? 'Guardando...' : <><FiSave size={14} /> Guardar</>}
                </button>
                <button type="button" onClick={() => setShowModal(null)} style={{ backgroundColor: "#fff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== PICK VEHICLE MODAL ===== */}
      {showModal === 'pickVehicle' && (
        <div style={styles.modalOverlay} onClick={() => { setShowModal(null); setAssignVehicleForm({ idEstacionamiento: '', idVehiculo: '' }); setPickVehicleText('') }}>
          <div style={{ ...styles.modalBox, maxWidth: "420px" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#1e293b" }}>Asignar Vehículo</h3>
              <button onClick={() => { setShowModal(null); setAssignVehicleForm({ idEstacionamiento: '', idVehiculo: '' }); setPickVehicleText('') }} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>
            <form onSubmit={handleAssignVehicleToSpot} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div>
                <label style={styles.label}>Estacionamiento</label>
                <input style={styles.input} value={`#${parking.find(p => String(p.id) === assignVehicleForm.idEstacionamiento)?.numero || assignVehicleForm.idEstacionamiento}`} disabled />
              </div>
              <div>
                <label style={styles.label}>Vehículo</label>
                <DataList value={pickVehicleText} onChange={e => { setPickVehicleText(e.target.value); const v = vehicles.filter(x => !x.idEstacionamiento).find(x => `${x.placa} — ${x.marca} ${x.modelo} (${x.tipo})` === e.target.value); setAssignVehicleForm(f => ({ ...f, idVehiculo: v ? v.placa : '' })) }} required style={styles.select}>
                  <option value="">Seleccionar vehículo</option>
                  {vehicles.filter(v => !v.idEstacionamiento).map(v => (
                    <option key={v.id} value={`${v.placa} — ${v.marca} ${v.modelo} (${v.tipo})`} />
                  ))}
                </DataList>
              </div>
              {vehicles.filter(v => !v.idEstacionamiento).length === 0 && (
                <div style={{ fontSize: "0.75rem", color: "#ef4444" }}>No hay vehículos disponibles</div>
              )}
              <button type="submit" disabled={saving || vehicles.filter(v => !v.idEstacionamiento).length === 0} style={{ ...styles.btnSuccess, width: "100%", justifyContent: "center", padding: "0.6rem" }}>
                {saving ? 'Asignando...' : <><FiUserPlus size={14} /> Asignar</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===== DETAIL MODAL ===== */}
      {detailItem && (
        <div style={styles.modalOverlay} onClick={() => setDetailItem(null)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#1e293b" }}>
                {detailItem.tipoVehiculo ? 'Estacionamiento' : 'Carrito'} #{detailItem.numero || detailItem.codigo || detailItem.id}
              </h3>
              <button onClick={() => setDetailItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {detailItem.tipoVehiculo ? (
                <>
                  <Row label="Estado">
                    <span style={{
                      padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700,
                      backgroundColor: (detailItem.cantidadActual || 0) > 0 ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                      color: (detailItem.cantidadActual || 0) > 0 ? "#ef4444" : "#10b981"
                    }}>
                      {(detailItem.cantidadActual || 0) > 0 ? 'Ocupado' : 'Disponible'}
                    </span>
                  </Row>
                  <Row label="Tipo de vehículo">{detailItem.tipoVehiculo || 'MIXTO'}</Row>
                  <Row label="Capacidad máxima">{detailItem.capacidadMaxima ?? '∞'}</Row>
                  <Row label="Ocupación actual">{detailItem.cantidadActual ?? 0}</Row>
                  <Row label="Apartamento">{detailItem.idApartamento ? aptLabel(detailItem.idApartamento) : '—'}</Row>
                  <Row label="Condominio">{condo?.nombre || '—'}</Row>
                  {(() => {
                    const spotVehicles = vehicles.filter(v => String(v.idEstacionamiento) === String(detailItem.id))
                    return spotVehicles.length > 0 ? (
                      <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.75rem" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", marginBottom: "0.5rem" }}>Vehículos ocupando:</div>
                        {spotVehicles.map(v => (
                          <div key={v.id} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#334155", marginBottom: "0.3rem", padding: "0.3rem 0.5rem", backgroundColor: "#f8fafc", borderRadius: "0.4rem" }}>
                            <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", backgroundColor: colorSwatch(v.color), border: "1px solid #e2e8f0" }} />
                            <span style={{ fontWeight: 700, fontFamily: "monospace" }}>{v.placa}</span>
                            <span style={{ color: "#64748b" }}>{v.marca} {v.modelo}</span>
                          </div>
                        ))}
                      </div>
                    ) : null
                  })()}
                  {detailItem.tipoVehiculo && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", marginBottom: "0.5rem" }}>Vista de matriz:</div>
                      <div style={{ maxWidth: "200px", margin: "auto" }}><ParkingMatrix spot={detailItem} occupiedCount={vehicles.filter(v => String(v.idEstacionamiento) === String(detailItem.id)).length} /></div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Row label="Código">{detailItem.codigo || `#${detailItem.id}`}</Row>
                  <Row label="Estado">
                    <span style={{
                      padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700,
                      backgroundColor: (states[detailItem.estado]?.bg || states.DISPONIBLE.bg),
                      color: (states[detailItem.estado]?.color || states.DISPONIBLE.color)
                    }}>
                      {detailItem.estado || 'DISPONIBLE'}
                    </span>
                  </Row>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== TICKET MODAL ===== */}
      {ticket && (
        <div style={styles.modalOverlay} onClick={() => setTicket(null)}>
          <div style={{ ...styles.modalBox, maxWidth: "400px" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#1e293b" }}>Ticket de Acceso</h3>
              <button onClick={() => setTicket(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>
            <div id="ticket-content" style={{ padding: "1.5rem", textAlign: "center", fontFamily: "'Courier New', monospace" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.25rem" }}>SGC - Parqueo</div>
              <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: "0.75rem" }}>{condo?.nombre || 'Condominio'}</div>
              <hr style={{ border: "1px dashed #d1d5db", margin: "0.5rem 0" }} />
              <div style={{ fontSize: "0.8rem", textAlign: "left", margin: "0.5rem 0" }}>
                {[
                  { l: 'Ticket #', v: `TKT-${ticket.id}` },
                  { l: 'Condominio', v: ticket.condominioNombre },
                  { l: 'Torre', v: ticket.torreNombre },
                  { l: 'Departamento', v: ticket.aptNumero },
                  { l: 'Estacionamiento', v: `#${ticket.spotNumero}` },
                  { l: 'Vehículo', v: `${ticket.vehiculoMarca} ${ticket.vehiculoModelo}`.trim() },
                  { l: 'Placa', v: ticket.placa },
                  { l: 'Ocupante', v: ticket.ocupante || '—' },
                  { l: 'Nombre', v: ticket.datosInquilino || '—' },
                  { l: 'Entrada', v: formatDate(ticket.fechaEntrada) },
                  { l: 'Salida', v: ticket.fechaSalida ? formatDate(ticket.fechaSalida) : 'En curso' },
                  { l: 'Método', v: ticket.metodo || '—' }
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.2rem 0" }}>
                    <span style={{ color: "#64748b" }}>{r.l}:</span>
                    <span style={{ fontWeight: 700, color: "#0f172a" }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <hr style={{ border: "1px dashed #d1d5db", margin: "0.5rem 0" }} />
              <div style={{ margin: "0.75rem 0" }}><canvas ref={barcodeRef} style={{ maxWidth: "100%" }} /></div>
              <div style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{condo?.nombre || 'SGC'} · {new Date().toLocaleDateString('es-PE')}</div>
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "center", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
              <button onClick={printTicket} style={{ backgroundColor: colorSuper, color: "#fff", border: "none", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <FiPrinter size={16} /> Imprimir Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM ===== */}
      {confirmDelete && (
        <div style={styles.modalOverlay} onClick={() => setConfirmDelete(null)}>
          <div style={{ ...styles.modalBox, maxWidth: "400px" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.5rem", textAlign: "center" }}>
              <FiAlertCircle size={40} color="#ef4444" style={{ marginBottom: "0.75rem" }} />
              <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", fontWeight: 800, color: "#1e293b" }}>Confirmar eliminación</h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>¿Eliminar {confirmDelete.tipo === 'CARRITO' ? 'carrito' : 'estacionamiento'} #{confirmDelete.id}?</p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.25rem" }}>
                <button onClick={handleDelete} style={{ backgroundColor: "#ef4444", border: "none", color: "#fff", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Eliminar</button>
                <button onClick={() => setConfirmDelete(null)} style={{ backgroundColor: "#fff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}