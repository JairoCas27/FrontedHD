import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { FiGrid, FiHome, FiTruck, FiPlus, FiX, FiEye, FiTrash2, FiCheck, FiAlertCircle, FiTool, FiUsers, FiRefreshCw, FiPrinter, FiLogIn, FiLogOut, FiSearch, FiCalendar, FiNavigation2, FiClock, FiSettings, FiSave, FiEdit3, FiUser, FiUserPlus, FiChevronUp, FiChevronDown, FiFileText, FiMapPin } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import DataList from '../../components/common/DataList'
import {
  getCondominiums, getAdminAssets, createAdminAsset, updateAdminAssetStatus, deleteAdminAsset,
  getAdminApartments, extractItems, getAdminVehicles, getSecurityDashboard, getActiveCartLoans,
  registerVehicleEntry, registerVehicleExit, assignAssetApartment, getAdminAccessLogs, unassignVehicleFromSpot,
  registerCartLoan, returnCartLoan, createAdminVehicle, deleteAdminVehicle, getAllCartLoans
} from '../../services/SuperAdminApi'
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
  modalOverlay: { position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, backdropFilter: "blur(4px)" },
  modalBox: { backgroundColor: "#fff", borderRadius: "1.25rem", width: "100%", maxWidth: "560px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", maxHeight: "90vh", overflowY: "auto" },
  modalContent: { padding: "1.5rem" },
  formGroup: { marginBottom: "1rem" },
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
const hexToRgba = (hex, a) => { const h = hex.replace('#', ''); const r = parseInt(h.substring(0, 2), 16); const g = parseInt(h.substring(2, 4), 16); const b = parseInt(h.substring(4, 6), 16); return `rgba(${r},${g},${b},${a})` }

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
  const [entryOpen, setEntryOpen] = useState(false)
  const [exitOpen, setExitOpen] = useState(false)
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
  const barcodeRef = useRef(null)
  const toastTimer = useRef(null)
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const PER_PAGE = 10
  const [logPage, setLogPage] = useState(1)
  const [logSearch, setLogSearch] = useState('')
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

  const loadData = useCallback(async (id) => {
    if (!id) return
    setLoadingData(true)
    try {
      const [p, c, a, v, l, d, loans, allLoans] = await Promise.all([
        getAdminAssets(id, 'ESTACIONAMIENTO', 0, 100),
        getAdminAssets(id, 'CARRITO', 0, 100),
        getAdminApartments(id).catch(() => ({ items: [] })),
        getAdminVehicles(id).catch(() => []),
        getAdminAccessLogs(id, { type: 'VEHICULAR', page: 0, size: 500 }).catch(() => ({ content: [] })),
        getSecurityDashboard(id).catch(() => null),
        getActiveCartLoans(id).catch(() => []),
        getAllCartLoans(id).catch(() => [])
      ])
      setParking(extractItems(p).sort((a, b) => (parseInt(a.numero, 10) || a.id) - (parseInt(b.numero, 10) || b.id)))
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

  const activeLogEntries = React.useMemo(() => logs.filter(l => !l.fechaSalida), [logs])

  const enrichedParking = React.useMemo(() => {
    if (!parking.length) return []
    return parking.map(slot => {
      const vehiculosEnSlot = activeLogEntries
        .filter(l => String(l.idEstacionamiento) === String(slot.id))
        .map(l => ({
          id: l.idVehiculo || l.id,
          idLogAcceso: l.id,
          placa: l.placa,
          marca: l.marca || '',
          modelo: l.modelo || '',
          color: l.color || '',
          tipo: l.tipoVehiculo || l.tipo || '',
          idEstacionamiento: l.idEstacionamiento,
          fechaEntrada: l.fechaEntrada,
        }))
      const cantidadReal = vehiculosEnSlot.length
      return {
        ...slot,
        vehiculos: vehiculosEnSlot,
        cantidadActual: cantidadReal,
        disponible: slot.capacidadMaxima
          ? cantidadReal < slot.capacidadMaxima
          : cantidadReal < 1,
      }
    })
  }, [parking, activeLogEntries])

  const occupiedParkingIds = new Set(enrichedParking.filter(p => p.cantidadActual > 0).map(p => String(p.id)))

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
    totalParking: enrichedParking.length,
    disponibleParking: enrichedParking.filter(p => p.disponible).length,
    ocupadoParking: enrichedParking.filter(p => !p.disponible).length,
    capacidadTotal: enrichedParking.reduce((s, p) => s + (p.capacidadMaxima || 0), 0),
    ocupacionActual: enrichedParking.reduce((s, p) => s + (p.cantidadActual || 0), 0),
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
      if (vehicle.idLogAcceso) {
        await registerVehicleExit({ idLogAcceso: Number(vehicle.idLogAcceso) })
      }
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

  const openCartTicket = (loan) => {
    const apt = apartments.find(a => String(a.id) === String(loan.idApartamento))
    setCartTicket({
      ...loan,
      aptNumero: apt?.numero || '—',
      aptTorre: apt?.torreNombre || '—',
      aptPiso: apt?.pisoNumero || '—'
    })
    setTimeout(() => {
      if (barcodeRef.current) {
        try {
          JsBarcode(barcodeRef.current, `CTKT-${loan.id}-${loan.codigoCarrito}-${new Date(loan.fechaPrestamo).getTime()}`, {
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

  const CarSilhouette = ({ fill, stroke: strokeColor, ghost }) => {
    return (
      <svg viewBox="110 45 220 360" width="100%" height="100%" style={{ display: "block" }}>
        <g transform="translate(225,220) scale(1.2, 1) translate(-225,-220)" fill={fill} stroke={strokeColor} strokeWidth={ghost ? 1.5 : 2.5} strokeLinejoin="round" strokeLinecap="round" opacity={ghost ? 0.4 : 1}>
          <path d="M221.20,52.53 Q216.66,52.75 214.42,52.88 Q212.18,53.01 209.97,53.20 Q207.76,53.39 205.61,53.67 Q203.45,53.94 201.36,54.35 Q199.26,54.75 197.25,55.32 Q195.23,55.88 193.31,56.64 Q191.38,57.40 189.55,58.38 Q187.73,59.36 186.01,60.58 Q184.29,61.79 182.68,63.20 Q181.06,64.62 179.53,66.20 Q178.01,67.78 176.57,69.49 Q175.12,71.19 173.76,73.00 Q172.39,74.81 171.10,76.67 Q169.80,78.54 168.57,80.43 Q167.33,82.33 166.15,84.22 Q164.97,86.11 163.86,88.01 Q162.74,89.90 161.69,91.80 Q160.64,93.71 159.67,95.63 Q158.70,97.56 157.82,99.51 Q156.94,101.47 156.15,103.46 Q155.36,105.46 154.67,107.51 Q153.99,109.55 153.41,111.66 Q152.84,113.76 152.39,115.93 Q151.93,118.10 151.64,120.29 Q151.35,122.47 151.26,124.61 Q151.18,126.74 151.35,128.75 Q151.51,130.76 151.98,132.59 Q152.45,134.41 153.26,135.97 Q154.08,137.53 155.07,138.83 Q156.06,140.12 156.30,141.36 Q156.54,142.60 155.21,144.05 Q153.87,145.50 152.78,147.37 Q151.69,149.24 151.87,151.43 Q152.05,153.62 152.42,155.75 Q152.80,157.87 152.28,159.55 Q151.76,161.22 150.14,162.47 Q148.51,163.72 146.38,164.90 Q144.26,166.09 142.26,167.59 Q140.26,169.09 139.03,170.98 Q137.79,172.86 137.97,174.56 Q138.14,176.25 139.72,177.05 Q141.30,177.85 143.59,177.35 Q145.88,176.86 148.23,175.93 Q150.59,175.01 152.38,174.81 Q154.17,174.61 154.96,176.00 Q155.75,177.38 156.11,179.57 Q156.47,181.75 156.81,184.02 Q157.16,186.29 157.38,188.58 Q157.60,190.86 157.60,193.11 Q157.59,195.35 157.35,197.54 Q157.11,199.73 156.71,201.87 Q156.32,204.01 155.85,206.11 Q155.39,208.21 154.95,210.28 Q154.51,212.35 154.18,214.40 Q153.85,216.45 153.70,218.49 Q153.56,220.53 153.61,222.56 Q153.66,224.60 153.86,226.64 Q154.06,228.68 154.35,230.74 Q154.64,232.80 154.98,234.87 Q155.32,236.95 155.65,239.06 Q155.99,241.17 156.27,243.30 Q156.56,245.44 156.75,247.60 Q156.95,249.76 157.04,251.95 Q157.13,254.13 157.14,256.33 Q157.15,258.53 157.13,260.73 Q157.12,262.94 157.12,265.14 Q157.11,267.34 157.17,269.52 Q157.23,271.71 157.39,273.87 Q157.55,276.03 157.81,278.17 Q158.07,280.31 158.32,282.45 Q158.56,284.60 158.66,286.77 Q158.76,288.93 158.57,291.16 Q158.39,293.39 157.83,295.68 Q157.28,297.97 156.72,300.14 Q156.15,302.30 156.22,304.04 Q156.29,305.78 157.47,306.86 Q158.65,307.94 159.88,308.96 Q161.11,309.99 161.45,311.67 Q161.78,313.35 162.19,315.66 Q162.60,317.96 163.07,320.39 Q163.54,322.82 163.48,324.70 Q163.42,326.58 162.56,327.66 Q161.71,328.74 160.36,329.45 Q159.01,330.17 157.51,330.99 Q156.01,331.82 154.94,333.17 Q153.88,334.51 153.59,336.43 Q153.30,338.34 153.56,340.57 Q153.83,342.80 154.41,345.09 Q154.99,347.38 155.76,349.59 Q156.53,351.79 157.46,353.90 Q158.40,356.01 159.49,358.00 Q160.58,360.00 161.81,361.87 Q163.04,363.74 164.40,365.48 Q165.77,367.21 167.24,368.80 Q168.72,370.38 170.30,371.80 Q171.88,373.23 173.56,374.49 Q175.23,375.75 177.00,376.87 Q178.76,377.98 180.61,378.96 Q182.45,379.93 184.37,380.77 Q186.29,381.61 188.28,382.33 Q190.26,383.05 192.31,383.65 Q194.35,384.25 196.45,384.74 Q198.54,385.23 200.68,385.63 Q202.82,386.02 205.00,386.32 Q207.18,386.63 209.39,386.85 Q211.60,387.07 213.83,387.21 Q216.06,387.36 218.31,387.44 Q220.55,387.53 222.81,387.55 Q225.06,387.58 227.32,387.55 Q229.58,387.52 231.83,387.44 Q234.08,387.36 236.32,387.22 Q238.55,387.07 240.77,386.85 Q242.98,386.63 245.17,386.33 Q247.35,386.03 249.50,385.64 Q251.65,385.24 253.75,384.75 Q255.85,384.25 257.90,383.65 Q259.95,383.05 261.94,382.33 Q263.92,381.61 265.84,380.76 Q267.76,379.91 269.61,378.92 Q271.45,377.94 273.21,376.81 Q274.97,375.68 276.64,374.40 Q278.30,373.11 279.87,371.66 Q281.44,370.22 282.90,368.60 Q284.36,366.98 285.70,365.21 Q287.04,363.43 288.24,361.53 Q289.44,359.62 290.49,357.61 Q291.54,355.61 292.43,353.52 Q293.31,351.43 294.01,349.30 Q294.71,347.16 295.21,345.00 Q295.71,342.85 296.00,340.69 Q296.29,338.54 296.33,336.43 Q296.37,334.33 295.83,332.66 Q295.28,330.99 293.87,330.01 Q292.45,329.02 290.83,327.60 Q289.21,326.18 287.97,324.16 Q286.72,322.14 286.30,319.99 Q285.87,317.84 286.48,315.89 Q287.09,313.95 288.29,312.16 Q289.50,310.37 290.74,308.63 Q291.98,306.89 292.69,305.07 Q293.40,303.26 293.33,301.31 Q293.26,299.36 292.77,297.30 Q292.27,295.25 291.78,293.14 Q291.29,291.03 291.10,288.90 Q290.91,286.76 290.98,284.61 Q291.05,282.46 291.28,280.30 Q291.52,278.13 291.84,275.95 Q292.16,273.77 292.46,271.57 Q292.76,269.38 292.96,267.17 Q293.15,264.95 293.19,262.73 Q293.24,260.51 293.18,258.29 Q293.12,256.07 293.02,253.86 Q292.93,251.65 292.86,249.47 Q292.80,247.29 292.83,245.14 Q292.86,242.99 293.06,240.90 Q293.26,238.80 293.68,236.76 Q294.11,234.72 294.80,232.75 Q295.49,230.78 296.21,228.83 Q296.93,226.89 297.30,224.90 Q297.67,222.91 297.36,220.82 Q297.05,218.72 296.23,216.56 Q295.42,214.40 294.58,212.24 Q293.73,210.09 293.29,208.03 Q292.85,205.96 292.82,203.94 Q292.79,201.93 292.96,199.87 Q293.13,197.81 293.29,195.61 Q293.44,193.42 293.37,190.99 Q293.29,188.57 293.00,186.01 Q292.71,183.45 292.69,181.23 Q292.66,179.00 293.41,177.61 Q294.17,176.21 295.89,175.84 Q297.61,175.48 299.91,175.78 Q302.20,176.09 304.60,176.65 Q307.00,177.21 308.85,177.27 Q310.70,177.32 311.21,175.94 Q311.73,174.56 310.99,172.65 Q310.26,170.74 308.70,169.17 Q307.14,167.61 305.21,166.25 Q303.29,164.90 301.48,163.54 Q299.66,162.19 298.42,160.62 Q297.18,159.06 296.96,157.09 Q296.74,155.12 297.25,152.87 Q297.76,150.62 297.86,148.60 Q297.97,146.57 296.62,145.25 Q295.27,143.92 293.50,142.99 Q291.73,142.07 291.62,140.94 Q291.51,139.82 293.09,138.92 Q294.67,138.02 296.47,137.01 Q298.27,135.99 298.72,134.17 Q299.17,132.35 299.05,130.23 Q298.93,128.12 298.71,126.00 Q298.48,123.88 298.15,121.75 Q297.82,119.63 297.38,117.51 Q296.95,115.39 296.42,113.28 Q295.89,111.18 295.26,109.09 Q294.64,106.99 293.91,104.92 Q293.19,102.85 292.38,100.81 Q291.57,98.77 290.67,96.76 Q289.76,94.75 288.78,92.77 Q287.79,90.80 286.71,88.87 Q285.64,86.95 284.48,85.07 Q283.33,83.19 282.09,81.37 Q280.86,79.54 279.54,77.78 Q278.23,76.02 276.84,74.32 Q275.45,72.63 273.99,71.01 Q272.52,69.39 270.98,67.86 Q269.45,66.34 267.83,64.92 Q266.22,63.50 264.52,62.21 Q262.83,60.92 261.06,59.77 Q259.29,58.61 257.45,57.62 Q255.60,56.62 253.67,55.80 Q251.74,54.98 249.74,54.34 Q247.73,53.71 245.64,53.28 Q243.55,52.85 241.39,52.60 Q239.23,52.35 237.02,52.25 Q234.81,52.15 232.56,52.16 Q230.30,52.17 228.03,52.25 Q225.76,52.32 223.48,52.43 Z" />
        </g>
      </svg>
    )
  }

  const ParkingMatrix = ({ spot, occupiedCount }) => {
    const totalCells = spot.capacidadMaxima || 1
    const occupied = occupiedCount ?? spot.cantidadActual ?? 0
    const cells = Array.from({ length: totalCells }, (_, i) => i < occupied)
    const cols = 3
    return (
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "3px", padding: "0px" }}>
        {cells.map((isOcc, i) => (
          <div key={i} style={{
            width: "100%", aspectRatio: "1",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <CarSilhouette fill={isOcc ? "#fca5a5" : "#86efac"} stroke={isOcc ? "#dc2626" : "#16a34a"} ghost={!isOcc} />
          </div>
        ))}
      </div>
    )
  }

  if (loading) return <div style={{ ...styles.container, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontWeight: 600 }}>Cargando...</div>

  return (
    <div style={styles.container} className="gb-container">
      {toast && (
        <div style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 1300, backgroundColor: toast.type === 'error' ? "#ef4444" : "#10b981", color: "#fff", padding: "0.75rem 1.25rem", borderRadius: "0.75rem", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.15)" }}>
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
        .gb-stats-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
        .gb-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
        .gb-grid-2 { grid-template-columns: 1fr 1fr; }
        .gb-form-grid { grid-template-columns: 1fr 1fr; }
        .gb-park-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
        .gb-condo-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
        @media (max-width: 900px) {
          .gb-grid-2, .gb-grid-3 { grid-template-columns: 1fr !important; }
          .gb-form-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .gb-stats-grid { grid-template-columns: 1fr !important; }
          .gb-park-grid { grid-template-columns: 1fr !important; }
          .gb-condo-grid { grid-template-columns: 1fr !important; }
          .gb-container { padding: 1rem !important; }
          .gb-modal-box { max-width: 95vw !important; margin: 0 0.5rem; }
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
            gap: '1rem'
          }} className="gb-condo-grid">
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
              { key: 'vehiculos', label: 'Vehículos', icon: <FiNavigation2 size={14} /> },
              { key: 'carritos', label: 'Préstamos', icon: <FiTruck size={14} /> },

            ].map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={styles.tab(activeTab === t.key)}>
                {React.cloneElement(t.icon, { style: { marginRight: 4 } })} {t.label}
              </button>
            ))}
          </div>

          {/* ===== DASHBOARD ===== */}
          {activeTab === 'dashboard' && (
            <>
              <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }} className="gb-stats-grid">
                <StatCard icon={<FiHome />} label="Estacionamientos" value={stats.totalParking} sub={`${stats.disponibleParking} libres · ${stats.ocupadoParking} ocupados`} color={colorSuper} />
                <StatCard icon={<FiUsers />} label="Capacidad Total" value={stats.capacidadTotal} sub={`${stats.ocupacionActual} vehículos ahora (${stats.capacidadTotal > 0 ? ((stats.ocupacionActual / stats.capacidadTotal) * 100).toFixed(0) : 0}%)`} color="#3b82f6" />
                <StatCard icon={<FiTruck />} label="Préstamos" value={stats.totalCarts} sub={`${stats.cartDisponible} disp · ${stats.cartEnUso} uso · ${stats.cartMant} mant`} color={colorSuper} />
                <StatCard icon={<FiNavigation2 />} label="Vehículos Registrados" value={stats.totalVehicles} color="#f59e0b" />
                <StatCard icon={<FiLogIn />} label="Vehículos Dentro" value={activeLogEntries.length} sub={`${stats.disponibleParking} spots libres`} color="#10b981" />
              </div>

              <div style={{ display: "grid" }} className="gb-grid-2">
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
                      <BarChart data={enrichedParking.slice(0, 20).map(p => {
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
                          {enrichedParking.slice(0, 20).map(p => {
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
                    {activeLogEntries.length === 0 ? (
                      <div style={{ padding: "1.5rem", textAlign: "center", color: "#94a3b8", fontSize: "0.8rem" }}>Ningún vehículo dentro</div>
                    ) : activeLogEntries.slice(0, 10).map(l => (
                      <div key={l.id} style={{ padding: "0.5rem 1rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: "0.8rem", color: "#0f172a", fontFamily: "monospace" }}>{l.placa}</span>
                          <span style={{ fontSize: "0.65rem", color: "#94a3b8", marginLeft: "0.5rem" }}>{l.ocupante}</span>
                        </div>
                        <span style={{ fontSize: "0.65rem", color: "#3b82f6" }}>{formatDate(l.fechaEntrada)}</span>
                      </div>
                    ))}
                    {activeLogEntries.length > 10 && <div style={{ padding: "0.5rem", textAlign: "center", fontSize: "0.7rem", color: "#94a3b8" }}>+{activeLogEntries.length - 10} más</div>}
                  </div>
                </div>
              </div>

              {dashboard && (
                <div className="gb-grid-3" style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
                  <div style={styles.card}>
                    <div style={{ padding: "1.25rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Vehículos dentro</div>
                      <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#10b981" }}>{dashboard.vehiculosDentro ?? activeLogEntries.length}</div>
                    </div>
                  </div>
                  <div style={styles.card}>
                    <div style={{ padding: "1.25rem", textAlign: "center" }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Préstamos activos</div>
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
                        <DataList value={assignParkingText} onChange={(e) => { setAssignParkingText(e.target.value); const s = parking.filter(p => p.disponible && !p.idApartamento).find(p => `${p.numero || `#${p.id}`} · ${p.tipoVehiculo || 'Mixto'}` === e.target.value); if (s) setAssignForm(f => ({ ...f, idEstacionamiento: String(s.id) })) }} required style={styles.select}>
                          <option value="">Seleccionar estacionamiento</option>
                          {parking.filter(p => p.disponible && !p.idApartamento).map(p => (
                            <option key={p.id} value={`${p.numero || `#${p.id}`} · ${p.tipoVehiculo || 'Mixto'}`} />
                          ))}
                        </DataList>
                      )}
                    </div>
                    <div style={{ flex: 2 }}>
                      <label style={{ ...styles.label, fontSize: "0.6rem" }}>Departamento</label>
                      {apartments.filter(a => !parking.some(p => String(p.idApartamento) === String(a.id))).length === 0 ? (
                        <div style={{ ...styles.select, display: "flex", alignItems: "center", color: "#ef4444", fontSize: "0.75rem", fontWeight: "600" }}>No hay apartamentos disponibles</div>
                      ) : (
                        <DataList value={assignAptText} onChange={(e) => { setAssignAptText(e.target.value); const s = apartments.filter(a => !parking.some(p => String(p.idApartamento) === String(a.id))).find(a => `N° ${a.numero}${a.torreNombre ? ` · ${a.torreNombre}` : ''}` === e.target.value); if (s) setAssignForm(f => ({ ...f, idApartamento: String(s.id) })) }} required style={styles.select}>
                          <option value="">Seleccionar apartamento</option>
                          {apartments.filter(a => !parking.some(p => String(p.idApartamento) === String(a.id))).map(a => (
                            <option key={a.id} value={`N° ${a.numero}${a.torreNombre ? ` · ${a.torreNombre}` : ''}`} />
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
                    <div className="gb-park-grid" style={{ display: "grid", gap: "1rem" }}>
                      {enrichedParking.map(p => {
                        const vehiclesInSpot = p.vehiculos || []
                        const pct = p.capacidadMaxima > 0 ? ((p.cantidadActual || 0) / p.capacidadMaxima) * 100 : 0
                        return (
                          <div key={p.id} style={{
                            ...styles.card, border: `2px solid ${vehiclesInSpot.length === 0 ? "#10b981" : "#ef4444"}`,
                            transition: "all 0.15s"
                          }}>
                            <div style={{ padding: "0.75rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                                <div style={{ fontSize: "0.6rem", fontWeight: 700, color: vehiclesInSpot.length === 0 ? "#10b981" : "#ef4444", textTransform: "uppercase" }}>
                                  {vehiclesInSpot.length === 0 ? 'Disponible' : vehiclesInSpot.length >= (p.capacidadMaxima || 1) ? 'LLENO' : 'Ocupado'} · {p.tipoVehiculo || 'MIXTO'}
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
                                {vehiclesInSpot.map((v, vi) => (
                                  <div key={v.id || vi} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.7rem", color: "#334155", marginBottom: "0.2rem" }}>
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
                            {occupants.map(o => <option key={o.nombre} value={o.nombre}>{o.label}{o.dni ? `  · DNI: ${o.dni}` : ''}</option>)}
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
                      <div className="gb-form-grid" style={{ display: "grid", gap: "0.75rem" }}>
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
                      <DataList value={entryParkText} onChange={e => { setEntryParkText(e.target.value); const s = parking.filter(p => (p.cantidadActual || 0) < p.capacidadMaxima).find(p => `#${p.numero} (${p.tipoVehiculo}) · ${p.cantidadActual || 0}/${p.capacidadMaxima}` === e.target.value); if (s) setEntryForm(f => ({ ...f, idEstacionamiento: String(s.id) })) }} style={styles.select}>
                        <option value="">Estacionamiento (auto)</option>
                        {parking.filter(p => (p.cantidadActual || 0) < p.capacidadMaxima).map(p => (
                          <option key={p.id} value={`#${p.numero} (${p.tipoVehiculo}) · ${p.cantidadActual || 0}/${p.capacidadMaxima}`} />
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
                      {(() => {
                        const vehiclesInside = enrichedParking.flatMap(p => p.vehiculos || [])
                        return (
                          <DataList value={exitLogText} onChange={e => { setExitLogText(e.target.value); const s = vehiclesInside.find(v => `${v.placa} · Entrada: ${formatDate(v.fechaEntrada)}` === e.target.value); if (s) setExitForm(f => ({ ...f, idLogAcceso: String(s.idLogAcceso) })) }} required style={styles.select}>
                            <option value="">Seleccionar vehículo dentro</option>
                            {vehiclesInside.map(v => (
                              <option key={v.idLogAcceso} value={`${v.placa} · Entrada: ${formatDate(v.fechaEntrada)}`} />
                            ))}
                          </DataList>
                        )
                      })()}
                      {(() => {
                        const vehiclesInside = enrichedParking.flatMap(p => p.vehiculos || [])
                        const sel = vehiclesInside.find(v => String(v.idLogAcceso) === exitForm.idLogAcceso)
                        return sel ? (
                          <div style={{ fontSize: "0.75rem", backgroundColor: "#fef2f2", padding: "0.75rem", borderRadius: "0.5rem", color: "#991b1b" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                              <span><strong>Vehículo:</strong> {sel.placa}</span>
                              <span><strong>Estacionamiento:</strong> #{enrichedParking.find(p => p.vehiculos?.some(v => v.idLogAcceso === sel.idLogAcceso))?.numero || '—'}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span><strong>Entrada:</strong> {formatDate(sel.fechaEntrada)}</span>
                            </div>
                            <div style={{ marginTop: "0.25rem", fontSize: "0.65rem", color: "#dc2626" }}>
                              <FiClock size={11} style={{ marginRight: "0.25rem" }} />
                               Tiempo transcurrido: {sel.fechaEntrada ? (() => {
                                 const diff = now - new Date(sel.fechaEntrada).getTime()
                                const h = Math.floor(diff / 3600000)
                                const m = Math.floor((diff % 3600000) / 60000)
                                return `${h}h ${m}m`
                              })() : '—'}
                            </div>
                          </div>
                        ) : null
                      })()}
                      {enrichedParking.flatMap(p => p.vehiculos || []).length === 0 && <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>No hay vehículos dentro</div>}
                      <button type="submit" disabled={saving || enrichedParking.flatMap(p => p.vehiculos || []).length === 0} style={{ ...styles.btnDanger, width: "100%", justifyContent: "center", padding: "0.6rem" }}>
                        {saving ? 'Registrando...' : <><FiLogOut size={14} /> Registrar Salida  — {new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</>}
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
                    <div style={{ overflowX: "auto" }} className="gb-table-wrap">
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                            <th style={{ padding: "0.75rem 1rem" }}>#</th>
                            <th style={{ padding: "0.75rem" }}>Ticket</th>
                            <th style={{ padding: "0.75rem" }}>Placa</th>
                            <th style={{ padding: "0.75rem" }}>Vehículo</th>
                            <th style={{ padding: "0.75rem" }}>Estacionamiento</th>
                            <th style={{ padding: "0.75rem" }}>Ocupante</th>
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
                                <td style={{ padding: "0.75rem", fontSize: "0.78rem" }}>#{spot?.numero || '—'}{apt ? ` · N°${apt.numero}` : ''}</td>
                                <td style={{ padding: "0.75rem" }}>
                                  <span style={styles.badge(
                                    l.ocupante === 'PROPIETARIO' ? "rgba(16,185,129,0.1)" : l.ocupante === 'INQUILINO' ? "rgba(245,158,11,0.1)" : "rgba(59,130,246,0.1)",
                                    l.ocupante === 'PROPIETARIO' ? "#10b981" : l.ocupante === 'INQUILINO' ? "#f59e0b" : "#3b82f6"
                                  )}>{l.ocupante || '—'}</span>
                                </td>
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
                          {filtered.length === 0 && <tr><td colSpan={11} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Sin registros</td></tr>}
                        </tbody>
                      </table>
                    </div>
                    <Pagination arr={filtered} page={logPage} setPage={setLogPage} />
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
                  <div style={{ overflowX: "auto" }} className="gb-table-wrap">
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
                                  <button onClick={() => { const t = allTenantsList.find(x => String(x.id) === String(v.inquilinoId)); setVehInquilinoText(t ? `${t.nombres} ${t.apellidos} · ${t.numeroDocumento} (Apt ${t.apartamentoNumero})` : ''); setVehicleForm({ id: v.id, placa: v.placa, marca: v.marca, modelo: v.modelo, color: v.color, tipo: v.tipo, inquilinoId: v.inquilinoId ? String(v.inquilinoId) : '' }); setShowModal('vehicle') }}
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
                  <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0f172a" }}>Préstamos</span>
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>({stats.totalCarts})</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <div style={{ position: "relative" }}>
                    <FiSearch size={13} style={{ position: "absolute", left: "0.5rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input type="text" placeholder="Buscar préstamo..." value={cartSearch} onChange={e => { setCartSearch(e.target.value); setCartPage(1) }}
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
                  <div style={{ overflowX: "auto" }} className="gb-table-wrap">
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
                        {filtered.length === 0 && <tr><td colSpan={3} style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>Sin préstamos</td></tr>}
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
                          {occupants.map(o => <option key={o.nombre} value={`${o.tipo}|${o.nombre}`}>{o.label}{o.dni ? `  · DNI: ${o.dni}` : ''}</option>)}
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
                      <div style={{ overflowX: "auto" }} className="gb-table-wrap">
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
                                  <td style={{ ...tdStyle, textAlign: "right" }}>
                                    <button onClick={() => openCartTicket(loan)} style={{ background: "none", border: "none", cursor: "pointer", color: colorSuper }} title="Ver ticket">
                                      <FiEye size={15} />
                                    </button>
                                  </td>
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
          <div style={{ ...styles.modalBox, maxWidth: "400px" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#1e293b" }}>Comprobante de Préstamo</h3>
              <button onClick={() => setCartTicket(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>
            <div id="ticket-content" style={{ padding: "1.5rem", textAlign: "center", fontFamily: "'Courier New', monospace" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.25rem" }}>SGC - Préstamo Carrito</div>
              <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: "0.75rem" }}>{condo?.nombre || 'Condominio'}</div>
              <hr style={{ border: "1px dashed #d1d5db", margin: "0.5rem 0" }} />
              <div style={{ fontSize: "0.8rem", textAlign: "left", margin: "0.5rem 0" }}>
                {[
                  { l: 'Ticket #', v: `CTKT-${cartTicket.id}` },
                  { l: 'Carrito', v: cartTicket.codigoCarrito },
                  { l: 'Solicitante', v: cartTicket.nombreSolicitante },
                  { l: 'DNI', v: cartTicket.dniSolicitante },
                  { l: 'Departamento', v: `N° ${cartTicket.aptNumero}` },
                  { l: 'Torre / Piso', v: `${cartTicket.aptTorre}${cartTicket.aptPiso ? ` · Piso ${cartTicket.aptPiso}` : ''}` },
                  { l: 'Préstamo', v: fmtDate(cartTicket.fechaPrestamo) },
                  { l: 'Devolución', v: cartTicket.fechaDevolucion ? fmtDate(cartTicket.fechaDevolucion) : 'Pendiente' },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.2rem 0" }}>
                    <span style={{ color: "#64748b" }}>{r.l}:</span>
                    <span style={{ fontWeight: 700, color: "#0f172a" }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <hr style={{ border: "1px dashed #d1d5db", margin: "0.5rem 0" }} />
              <div style={{ margin: "0.75rem 0" }}><canvas ref={barcodeRef} style={{ maxWidth: "100%" }} /></div>
              <div style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{condo?.nombre || 'SGC'}  — {new Date().toLocaleDateString('es-PE')}</div>
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "center", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
              <button onClick={printTicket} style={{ backgroundColor: colorSuper, color: "#fff", border: "none", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <FiPrinter size={16} /> Imprimir
              </button>
              <button onClick={() => setCartTicket(null)} style={{ backgroundColor: "#fff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CREATE PARKING MODAL ===== */}
      {(showModal === 'create' || showModal === 'createCart') && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(null)}>
          <div style={styles.modalBox} className="gb-modal-box" onClick={e => e.stopPropagation()}>
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
          <div style={styles.modalBox} className="gb-modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#1e293b" }}>
                <FiNavigation2 size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />{vehicleForm.id ? 'Editar Vehículo' : 'Nuevo Vehículo'}
              </h3>
              <button onClick={() => { setShowModal(null); setVehicleForm({ id: null, marca: '', color: 'BLANCO', modelo: '', placa: '', tipo: 'AUTO', inquilinoId: '' }); setVehInquilinoText('') }} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>
            <form onSubmit={vehicleForm.id ? handleEditVehicle : handleCreateVehicle}>
              <div className="gb-form-grid" style={{ padding: "1.5rem", display: "grid", gap: "1rem" }}>
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
                  <DataList value={vehInquilinoText} onChange={e => { setVehInquilinoText(e.target.value); const t = allTenantsList.find(x => `${x.nombres} ${x.apellidos} · ${x.numeroDocumento} (Apt ${x.apartamentoNumero})` === e.target.value); setVehicleForm(f => ({ ...f, inquilinoId: t ? String(t.id) : '' })) }} style={styles.select}>
                    <option value="">Propietario</option>
                    {allTenantsList.map(t => <option key={t.id} value={`${t.nombres} ${t.apellidos} · ${t.numeroDocumento} (Apt ${t.apartamentoNumero})`} />)}
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
          <div style={styles.modalBox} className="gb-modal-box" onClick={e => e.stopPropagation()}>
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
          <div style={{ ...styles.modalBox, maxWidth: "420px" }} className="gb-modal-box" onClick={e => e.stopPropagation()}>
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
                <DataList value={pickVehicleText} onChange={e => { setPickVehicleText(e.target.value); const v = vehicles.filter(x => !x.idEstacionamiento).find(x => `${x.placa} · ${x.marca} ${x.modelo} (${x.tipo})` === e.target.value); setAssignVehicleForm(f => ({ ...f, idVehiculo: v ? v.placa : '' })) }} required style={styles.select}>
                  <option value="">Seleccionar vehículo</option>
                  {vehicles.filter(v => !v.idEstacionamiento).map(v => (
                    <option key={v.id} value={`${v.placa} · ${v.marca} ${v.modelo} (${v.tipo})`} />
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
          <div style={styles.modalBox} className="gb-modal-box" onClick={e => e.stopPropagation()}>
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
                  <Row label="Capacidad máxima">{detailItem.capacidadMaxima ?? '8'}</Row>
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
              <div style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{condo?.nombre || 'SGC'}  — {new Date().toLocaleDateString('es-PE')}</div>
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