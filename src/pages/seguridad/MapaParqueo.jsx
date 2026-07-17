import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  FiGrid, FiMapPin, FiFilter, FiList, FiCheck, FiAlertCircle, FiTruck,
  FiRefreshCw, FiX, FiSearch, FiNavigation2, FiInfo,
  FiCamera, FiArrowUp, FiArrowDown, FiActivity, FiEye,
} from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import DataList from '../../components/common/DataList'
import { listParkingSlots, getDashboardStatus, verifyVehicleByPlate, listVehiclesWithoutSpot, registerVehicleExit, getAccessLogs } from '../../services/SeguridadApi'

const VERDE = "#059669"
const VERDE_OSCURO = "#047857"
const VERDE_CLARO = "rgba(5,150,105,0.1)"
const VERDE_BORDE = "rgba(5,150,105,0.25)"
const ROJO = "#dc2626"
const ROJO_CLARO = "rgba(220,38,38,0.1)"
const ROJO_BORDE = "rgba(220,38,38,0.25)"
const AMARILLO = "#d97706"
const AMARILLO_CLARO = "rgba(217,119,6,0.1)"
const AZUL = "#2563eb"
const AZUL_CLARO = "rgba(37,99,235,0.1)"
const MORADO = "#7c3aed"
const TEXTO = "#0f172a"
const TEXTO_SUAVE = "#475569"
const TEXTO_LIGHT = "#94a3b8"
const FONDO = "#f1f5f9"
const BORDE = "#e2e8f0"

const styles = {
  container: { padding: "1.75rem 2rem", backgroundColor: FONDO, minHeight: "100vh", width: "100%", boxSizing: "border-box" },
  card: { backgroundColor: "#fff", borderRadius: "0.75rem", border: `1px solid ${BORDE}`, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)" },
  input: { width: "100%", padding: "0.5rem 0.7rem", borderRadius: "0.4rem", border: "1.5px solid #cbd5e1", fontSize: "0.78rem", color: TEXTO, backgroundColor: "#fff", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s" },
  inputFocus: { borderColor: VERDE, boxShadow: `0 0 0 3px ${VERDE_CLARO}` },
  badge: (bg, color) => ({ fontSize: "0.6rem", fontWeight: "700", padding: "0.15rem 0.45rem", borderRadius: "0.25rem", display: "inline-flex", alignItems: "center", gap: "0.2rem", backgroundColor: bg, color }),
  tab: (active, color = VERDE) => ({ padding: "0.35rem 0.75rem", borderRadius: "0.35rem", fontSize: "0.68rem", fontWeight: 700, cursor: "pointer", border: "none", backgroundColor: active ? color : "#fff", color: active ? "#fff" : TEXTO_SUAVE, boxShadow: active ? "none" : "inset 0 0 0 1px #e2e8f0", transition: "all 0.15s ease", display: "flex", alignItems: "center", gap: "0.25rem" }),
  btnOutline: { backgroundColor: "#fff", color: TEXTO_SUAVE, border: `1.5px solid #cbd5e1`, padding: "0.35rem 0.8rem", borderRadius: "0.35rem", fontSize: "0.68rem", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem", transition: "all 0.15s ease" },
  btnPrimary: { background: `linear-gradient(135deg, ${VERDE}, ${VERDE_OSCURO})`, color: "#fff", border: "none", padding: "0.4rem 1rem", borderRadius: "0.35rem", fontSize: "0.68rem", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem", transition: "all 0.15s ease", boxShadow: `0 2px 6px ${VERDE_CLARO}` },
  btnDanger: { background: `linear-gradient(135deg, ${ROJO}, #b91c1c)`, color: "#fff", border: "none", padding: "0.2rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.55rem", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.15rem", transition: "all 0.15s ease" },
}

const thStyle = { padding: "0.55rem 0.75rem", textAlign: "left", fontWeight: 700, color: TEXTO_SUAVE, fontSize: "0.65rem", textTransform: "uppercase", whiteSpace: "nowrap" }
const tdStyle = { padding: "0.55rem 0.75rem", color: TEXTO, whiteSpace: "nowrap" }

const getVehicleIcon = (tipo) => {
  switch (tipo?.toUpperCase()) {
    case 'MOTO': return '🏍️'
    case 'BICICLETA': return '🚲'
    case 'CAMION': return '🚛'
    case 'SUV': return '🚙'
    case 'VAN': return '🚐'
    case 'DEPORTIVO': return '🏎️'
    default: return '🚗'
  }
}



const colorMap = {
  ROJO: "#ef4444", AZUL: "#3b82f6", VERDE: "#10b981", NEGRO: "#0f172a",
  BLANCO: "#f8fafc", GRIS: "#94a3b8", PLATEADO: "#cbd5e1", AMARILLO: "#eab308",
  NARANJA: "#f97316", MARRON: "#92400e", DORADO: "#b8860b", CELESTE: "#87ceeb",
  BEIGE: "#f5f5dc", VINO: "#722f37", ROSADO: "#ec4899", MORADO: "#8b5cf6",
}
const parseColor = (c) => colorMap[c?.toUpperCase()] || (c?.startsWith('#') ? c : `#${c}`) || "#cbd5e1"
const hexToRgba = (hex, a) => { const h = hex.replace('#', ''); const r = parseInt(h.substring(0, 2), 16); const g = parseInt(h.substring(2, 4), 16); const b = parseInt(h.substring(4, 6), 16); return `rgba(${r},${g},${b},${a})` }

const VehicleMini = ({ color }) => {
  const c = parseColor(color)
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "2px" }}>
      <rect x="3" y="6" width="18" height="12" rx="2" fill={hexToRgba(c, 0.3)} stroke={c} strokeWidth="1.5" />
      <rect x="6" y="4" width="12" height="4" rx="1" fill={hexToRgba(c, 0.3)} stroke={c} strokeWidth="1" />
      <rect x="9.5" y="7" width="5" height="3" rx="0.5" fill={c} opacity="0.6" />
      <rect x="19" y="9" width="3" height="3" rx="0.5" fill={c} />
      <rect x="2" y="9" width="3" height="3" rx="0.5" fill={c} />
    </svg>
  )
}

function ParkingMatrix({ spot }) {
  const totalCells = spot.capacidadMaxima || 1
  const occupied = spot.cantidadActual || 0
  const cells = Array.from({ length: totalCells }, (_, i) => i < occupied)
  const cols = 3

  const CarSilhouette = ({ fill, stroke: strokeColor, ghost }) => {
    return (
      <svg viewBox="110 45 220 360" width="100%" height="100%" style={{ display: "block" }}>
        <g transform="translate(225,220) scale(1.6, 1) translate(-225,-220)" fill={fill} stroke={strokeColor} strokeWidth={ghost ? 1.5 : 2.5} strokeLinejoin="round" strokeLinecap="round" opacity={ghost ? 0.4 : 1}>
          <path d="M221.20,52.53 Q216.66,52.75 214.42,52.88 Q212.18,53.01 209.97,53.20 Q207.76,53.39 205.61,53.67 Q203.45,53.94 201.36,54.35 Q199.26,54.75 197.25,55.32 Q195.23,55.88 193.31,56.64 Q191.38,57.40 189.55,58.38 Q187.73,59.36 186.01,60.58 Q184.29,61.79 182.68,63.20 Q181.06,64.62 179.53,66.20 Q178.01,67.78 176.57,69.49 Q175.12,71.19 173.76,73.00 Q172.39,74.81 171.10,76.67 Q169.80,78.54 168.57,80.43 Q167.33,82.33 166.15,84.22 Q164.97,86.11 163.86,88.01 Q162.74,89.90 161.69,91.80 Q160.64,93.71 159.67,95.63 Q158.70,97.56 157.82,99.51 Q156.94,101.47 156.15,103.46 Q155.36,105.46 154.67,107.51 Q153.99,109.55 153.41,111.66 Q152.84,113.76 152.39,115.93 Q151.93,118.10 151.64,120.29 Q151.35,122.47 151.26,124.61 Q151.18,126.74 151.35,128.75 Q151.51,130.76 151.98,132.59 Q152.45,134.41 153.26,135.97 Q154.08,137.53 155.07,138.83 Q156.06,140.12 156.30,141.36 Q156.54,142.60 155.21,144.05 Q153.87,145.50 152.78,147.37 Q151.69,149.24 151.87,151.43 Q152.05,153.62 152.42,155.75 Q152.80,157.87 152.28,159.55 Q151.76,161.22 150.14,162.47 Q148.51,163.72 146.38,164.90 Q144.26,166.09 142.26,167.59 Q140.26,169.09 139.03,170.98 Q137.79,172.86 137.97,174.56 Q138.14,176.25 139.72,177.05 Q141.30,177.85 143.59,177.35 Q145.88,176.86 148.23,175.93 Q150.59,175.01 152.38,174.81 Q154.17,174.61 154.96,176.00 Q155.75,177.38 156.11,179.57 Q156.47,181.75 156.81,184.02 Q157.16,186.29 157.38,188.58 Q157.60,190.86 157.60,193.11 Q157.59,195.35 157.35,197.54 Q157.11,199.73 156.71,201.87 Q156.32,204.01 155.85,206.11 Q155.39,208.21 154.95,210.28 Q154.51,212.35 154.18,214.40 Q153.85,216.45 153.70,218.49 Q153.56,220.53 153.61,222.56 Q153.66,224.60 153.86,226.64 Q154.06,228.68 154.35,230.74 Q154.64,232.80 154.98,234.87 Q155.32,236.95 155.65,239.06 Q155.99,241.17 156.27,243.30 Q156.56,245.44 156.75,247.60 Q156.95,249.76 157.04,251.95 Q157.13,254.13 157.14,256.33 Q157.15,258.53 157.13,260.73 Q157.12,262.94 157.12,265.14 Q157.11,267.34 157.17,269.52 Q157.23,271.71 157.39,273.87 Q157.55,276.03 157.81,278.17 Q158.07,280.31 158.32,282.45 Q158.56,284.60 158.66,286.77 Q158.76,288.93 158.57,291.16 Q158.39,293.39 157.83,295.68 Q157.28,297.97 156.72,300.14 Q156.15,302.30 156.22,304.04 Q156.29,305.78 157.47,306.86 Q158.65,307.94 159.88,308.96 Q161.11,309.99 161.45,311.67 Q161.78,313.35 162.19,315.66 Q162.60,317.96 163.07,320.39 Q163.54,322.82 163.48,324.70 Q163.42,326.58 162.56,327.66 Q161.71,328.74 160.36,329.45 Q159.01,330.17 157.51,330.99 Q156.01,331.82 154.94,333.17 Q153.88,334.51 153.59,336.43 Q153.30,338.34 153.56,340.57 Q153.83,342.80 154.41,345.09 Q154.99,347.38 155.76,349.59 Q156.53,351.79 157.46,353.90 Q158.40,356.01 159.49,358.00 Q160.58,360.00 161.81,361.87 Q163.04,363.74 164.40,365.48 Q165.77,367.21 167.24,368.80 Q168.72,370.38 170.30,371.80 Q171.88,373.23 173.56,374.49 Q175.23,375.75 177.00,376.87 Q178.76,377.98 180.61,378.96 Q182.45,379.93 184.37,380.77 Q186.29,381.61 188.28,382.33 Q190.26,383.05 192.31,383.65 Q194.35,384.25 196.45,384.74 Q198.54,385.23 200.68,385.63 Q202.82,386.02 205.00,386.32 Q207.18,386.63 209.39,386.85 Q211.60,387.07 213.83,387.21 Q216.06,387.36 218.31,387.44 Q220.55,387.53 222.81,387.55 Q225.06,387.58 227.32,387.55 Q229.58,387.52 231.83,387.44 Q234.08,387.36 236.32,387.22 Q238.55,387.07 240.77,386.85 Q242.98,386.63 245.17,386.33 Q247.35,386.03 249.50,385.64 Q251.65,385.24 253.75,384.75 Q255.85,384.25 257.90,383.65 Q259.95,383.05 261.94,382.33 Q263.92,381.61 265.84,380.76 Q267.76,379.91 269.61,378.92 Q271.45,377.94 273.21,376.81 Q274.97,375.68 276.64,374.40 Q278.30,373.11 279.87,371.66 Q281.44,370.22 282.90,368.60 Q284.36,366.98 285.70,365.21 Q287.04,363.43 288.24,361.53 Q289.44,359.62 290.49,357.61 Q291.54,355.61 292.43,353.52 Q293.31,351.43 294.01,349.30 Q294.71,347.16 295.21,345.00 Q295.71,342.85 296.00,340.69 Q296.29,338.54 296.33,336.43 Q296.37,334.33 295.83,332.66 Q295.28,330.99 293.87,330.01 Q292.45,329.02 290.83,327.60 Q289.21,326.18 287.97,324.16 Q286.72,322.14 286.30,319.99 Q285.87,317.84 286.48,315.89 Q287.09,313.95 288.29,312.16 Q289.50,310.37 290.74,308.63 Q291.98,306.89 292.69,305.07 Q293.40,303.26 293.33,301.31 Q293.26,299.36 292.77,297.30 Q292.27,295.25 291.78,293.14 Q291.29,291.03 291.10,288.90 Q290.91,286.76 290.98,284.61 Q291.05,282.46 291.28,280.30 Q291.52,278.13 291.84,275.95 Q292.16,273.77 292.46,271.57 Q292.76,269.38 292.96,267.17 Q293.15,264.95 293.19,262.73 Q293.24,260.51 293.18,258.29 Q293.12,256.07 293.02,253.86 Q292.93,251.65 292.86,249.47 Q292.80,247.29 292.83,245.14 Q292.86,242.99 293.06,240.90 Q293.26,238.80 293.68,236.76 Q294.11,234.72 294.80,232.75 Q295.49,230.78 296.21,228.83 Q296.93,226.89 297.30,224.90 Q297.67,222.91 297.36,220.82 Q297.05,218.72 296.23,216.56 Q295.42,214.40 294.58,212.24 Q293.73,210.09 293.29,208.03 Q292.85,205.96 292.82,203.94 Q292.79,201.93 292.96,199.87 Q293.13,197.81 293.29,195.61 Q293.44,193.42 293.37,190.99 Q293.29,188.57 293.00,186.01 Q292.71,183.45 292.69,181.23 Q292.66,179.00 293.41,177.61 Q294.17,176.21 295.89,175.84 Q297.61,175.48 299.91,175.78 Q302.20,176.09 304.60,176.65 Q307.00,177.21 308.85,177.27 Q310.70,177.32 311.21,175.94 Q311.73,174.56 310.99,172.65 Q310.26,170.74 308.70,169.17 Q307.14,167.61 305.21,166.25 Q303.29,164.90 301.48,163.54 Q299.66,162.19 298.42,160.62 Q297.18,159.06 296.96,157.09 Q296.74,155.12 297.25,152.87 Q297.76,150.62 297.86,148.60 Q297.97,146.57 296.62,145.25 Q295.27,143.92 293.50,142.99 Q291.73,142.07 291.62,140.94 Q291.51,139.82 293.09,138.92 Q294.67,138.02 296.47,137.01 Q298.27,135.99 298.72,134.17 Q299.17,132.35 299.05,130.23 Q298.93,128.12 298.71,126.00 Q298.48,123.88 298.15,121.75 Q297.82,119.63 297.38,117.51 Q296.95,115.39 296.42,113.28 Q295.89,111.18 295.26,109.09 Q294.64,106.99 293.91,104.92 Q293.19,102.85 292.38,100.81 Q291.57,98.77 290.67,96.76 Q289.76,94.75 288.78,92.77 Q287.79,90.80 286.71,88.87 Q285.64,86.95 284.48,85.07 Q283.33,83.19 282.09,81.37 Q280.86,79.54 279.54,77.78 Q278.23,76.02 276.84,74.32 Q275.45,72.63 273.99,71.01 Q272.52,69.39 270.98,67.86 Q269.45,66.34 267.83,64.92 Q266.22,63.50 264.52,62.21 Q262.83,60.92 261.06,59.77 Q259.29,58.61 257.45,57.62 Q255.60,56.62 253.67,55.80 Q251.74,54.98 249.74,54.34 Q247.73,53.71 245.64,53.28 Q243.55,52.85 241.39,52.60 Q239.23,52.35 237.02,52.25 Q234.81,52.15 232.56,52.16 Q230.30,52.17 228.03,52.25 Q225.76,52.32 223.48,52.43 Z" />
        </g>
      </svg>
    )
  }

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

export default function MapaParqueo() {
  const [loading, setLoading] = useState(true)
  const [parking, setParking] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [filter, setFilter] = useState("TODOS")
  const [searchN, setSearchN] = useState("")
  const [viewMode, setViewMode] = useState("mapa")
  const [selectedSpot, setSelectedSpot] = useState(null)
  const [verifyPlate, setVerifyPlate] = useState("")
  const [vehiculoDetail, setVehiculoDetail] = useState(null)
  const [loadingVerify, setLoadingVerify] = useState(false)
  const [unassignedVehicles, setUnassignedVehicles] = useState([])
  const [loadingUnassigned, setLoadingUnassigned] = useState(false)
  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500) }

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [p, d, logs] = await Promise.all([
        listParkingSlots().catch(() => []),
        getDashboardStatus().catch(() => null),
        getAccessLogs({ page: 0, size: 500 }).catch(() => ({ items: [] })),
      ])
      const activeEntries = (logs?.items || []).filter(l => !l.fechaSalida)
      const enriched = (Array.isArray(p) ? p : []).map(slot => {
        const vehiculosEnSlot = activeEntries
          .filter(l => String(l.idEstacionamiento) === String(slot.id))
          .map(l => ({
            placa: l.placa,
            marca: l.marca || '',
            modelo: l.modelo || '',
            color: l.color || '',
            tipo: l.tipoVehiculo || l.tipo || '',
            idLog: l.id,
            fechaEntrada: l.fechaEntrada,
          }))
        return {
          ...slot,
          vehiculos: vehiculosEnSlot,
          cantidadActual: vehiculosEnSlot.length,
          disponible: slot.capacidadMaxima
            ? vehiculosEnSlot.length < slot.capacidadMaxima
            : vehiculosEnSlot.length < 1,
        }
      })
      setParking(enriched.sort((a, b) => (a.numero || 0) - (b.numero || 0)))
      setDashboard(d)
    } catch { showToast("Error al cargar", "error") }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  useEffect(() => {
    if (selectedSpot) {
      setLoadingUnassigned(true)
      listVehiclesWithoutSpot().then(setUnassignedVehicles).catch(() => setUnassignedVehicles([]))
        .finally(() => setLoadingUnassigned(false))
    }
  }, [selectedSpot])

  // Sync selectedSpot when parking data refreshes (real-time updates after vehicle removal)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selectedSpot && parking.length > 0) {
      const updated = parking.find(s => String(s.id) === String(selectedSpot.id))
      if (updated) {
        setSelectedSpot(updated)
      }
    }
  }, [parking])

  const stats = useMemo(() => ({
    totalParking: parking.length || dashboard?.totalEstacionamientos || 0,
    ocupados: parking.filter(p => !p.disponible).length,
    disponibles: parking.filter(p => p.disponible).length,
    capacidadTotal: parking.reduce((s, p) => s + (p.capacidadMaxima || 0), 0),
    ocupacionActual: parking.reduce((s, p) => s + (p.cantidadActual || 0), 0),
    pctOcupacion: parking.length > 0 ? Math.round((parking.filter(p => !p.disponible).length / parking.length) * 100) : 0,
  }), [parking])

  const filtered = parking.filter(s => {
    if (filter === "DISPONIBLE" && !s.disponible) return false
    if (filter === "LLENO" && s.disponible) return false
    if (searchN && !s.numero?.toString().includes(searchN)) return false
    return true
  })

  const rows = useMemo(() => {
    const cols = 4
    const result = []
    for (let i = 0; i < filtered.length; i += cols) {
      result.push(filtered.slice(i, i + cols))
    }
    return result
  }, [filtered])

  // All known vehicles across all spots + unassigned, for datalist suggestions
  const allKnownVehicles = useMemo(() => {
    const seen = new Set()
    const vehicles = []
    parking.forEach(s => {
      ;(s.vehiculos || []).forEach(v => {
        if (!seen.has(v.placa)) {
          seen.add(v.placa)
          vehicles.push({ ...v, spotNumero: s.numero })
        }
      })
    })
    ;(unassignedVehicles || []).forEach(v => {
      if (!seen.has(v.placa)) {
        seen.add(v.placa)
        vehicles.push({ ...v, spotNumero: null })
      }
    })
    return vehicles
  }, [parking, unassignedVehicles])

  const handleVerificarVehiculo = async () => {
    if (!verifyPlate.trim()) return showToast("Ingresa una placa", "warning")
    setVehiculoDetail(null)
    setLoadingVerify(true)
    try {
      const d = await verifyVehicleByPlate(verifyPlate.trim().toUpperCase())
      setVehiculoDetail(d)
      if (d) showToast(`Vehículo encontrado: ${d.placa}`)
    } catch (e) {
      showToast(e.message || "Vehículo no encontrado", "error")
    }
    finally { setLoadingVerify(false) }
  }

  const handleRemoveVehicleFromSpot = async (plate) => {
    if (!window.confirm(`¿Sacar el vehículo ${plate} del estacionamiento?`)) return
    try {
      const logs = await getAccessLogs({ page: 0, size: 200 })
      const items = logs?.items || []
      const active = items.find(l => l.placa === plate.trim().toUpperCase() && !l.fechaSalida)
      if (!active?.id) throw new Error("No hay un registro de entrada activo para este vehículo. Usa 'Registrar Salida' en Accesos.")
      await registerVehicleExit(active.id)
      showToast(`Vehículo ${plate} retirado y salida registrada`, "success")
      if (vehiculoDetail?.placa === plate) setVehiculoDetail(null)
      if (verifyPlate === plate) setVerifyPlate("")
      loadData()
    } catch (e) {
      showToast(e.message || "Error al retirar vehículo", "error")
    }
  }

  const closeDetailPanel = () => {
    setSelectedSpot(null)
    setVehiculoDetail(null)
    setVerifyPlate("")
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
        @keyframes countUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        .fade-in { animation: fadeSlideIn 0.35s ease both; }
        .slide-right { animation: slideInRight 0.3s ease both; }
        .stat-card { transition: all 0.25s ease; cursor: default; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.07); }
        .spot-card { transition: all 0.2s ease; cursor: pointer; }
        .spot-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); z-index: 5; }
        .spot-card:active { transform: scale(0.97); }
        .aisle-line { border: none; border-top: 1.5px dashed #cbd5e1; margin: 0; }
        .filter-btn { transition: all 0.15s ease; }
        .filter-btn:hover { filter: brightness(0.95); }
      `}</style>

      {toast && (
        <div style={{
          position: "fixed", top: "1.25rem", right: "1.25rem", zIndex: 1300,
          backgroundColor: toast.type === 'error' ? ROJO : toast.type === 'warning' ? AMARILLO : VERDE,
          color: "#fff", padding: "0.7rem 1.1rem", borderRadius: "0.65rem",
          fontWeight: 700, fontSize: "0.8rem", display: "flex", alignItems: "center",
          gap: "0.5rem", boxShadow: "0 8px 20px -4px rgba(0,0,0,0.25)",
          animation: "fadeSlideIn 0.3s ease",
        }}>
          {toast.type === 'error' ? <FiAlertCircle size={16} /> : <FiCheck size={16} />}
          {toast.msg}
        </div>
      )}

      <EncabezadoTabla
        titulo="Mapa de Estacionamiento"
        subtitulo={`${stats.totalParking} espacios · ${stats.disponibles} disponibles · ${stats.ocupados} ocupados · ${stats.pctOcupacion}% ocupación`}
        action={
          <button onClick={loadData} disabled={loading}
            style={{ ...styles.btnOutline, padding: "0.45rem 0.9rem", opacity: loading ? 0.6 : 1 }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f1f5f9"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}>
            <FiRefreshCw size={13} style={loading ? { animation: "spin 0.8s linear infinite" } : {}} /> {loading ? "Cargando..." : "Actualizar"}
          </button>
        }
      />

      <div className="fade-in">
        {/* ─── Stats Cards ─── */}
        <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", marginBottom: "0.75rem" }}>
          {[
            { label: "Total Espacios", value: stats.totalParking, color: "#1e293b", bg: "linear-gradient(135deg, #f8fafc, #f1f5f9)", icon: <FiGrid size={15} />, accent: "#64748b", iconBg: "#e2e8f0" },
            { label: "Disponibles", value: stats.disponibles, color: VERDE_OSCURO, bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)", icon: <FiCheck size={15} />, accent: VERDE, iconBg: VERDE_CLARO },
            { label: "Ocupados", value: stats.ocupados, color: "#991b1b", bg: "linear-gradient(135deg, #fef2f2, #fee2e2)", icon: <FiTruck size={15} />, accent: ROJO, iconBg: ROJO_CLARO },
            { label: "% Ocupación", value: `${stats.pctOcupacion}%`, color: stats.pctOcupacion > 70 ? "#991b1b" : stats.pctOcupacion > 40 ? "#92400e" : VERDE_OSCURO, bg: stats.pctOcupacion > 70 ? "linear-gradient(135deg, #fef2f2, #fee2e2)" : stats.pctOcupacion > 40 ? "linear-gradient(135deg, #fffbeb, #fef3c7)" : "linear-gradient(135deg, #f0fdf4, #dcfce7)", icon: <FiMapPin size={15} />, accent: stats.pctOcupacion > 70 ? ROJO : stats.pctOcupacion > 40 ? AMARILLO : VERDE, iconBg: stats.pctOcupacion > 70 ? ROJO_CLARO : stats.pctOcupacion > 40 ? AMARILLO_CLARO : VERDE_CLARO },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ ...styles.card, padding: "0", overflow: "hidden", background: s.bg }}>
              <div style={{ height: "3px", background: `linear-gradient(90deg, ${s.accent}, ${s.accent}66)`, width: "100%" }} />
              <div style={{ padding: "0.7rem 0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.6rem", fontWeight: 700, color: TEXTO_LIGHT, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.05rem" }}>{s.label}</div>
                  <div style={{ fontSize: "1.35rem", fontWeight: 800, color: s.color, lineHeight: 1.2 }}>{s.value}</div>
                </div>
                <div style={{ background: s.iconBg, padding: "0.45rem", borderRadius: "0.5rem", display: "flex", color: s.color, border: `1px solid ${s.accent}22` }}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Occupancy Bar ─── */}
        <div style={{ ...styles.card, padding: "0.7rem 1rem", marginBottom: "0.75rem", background: "linear-gradient(135deg, #fff, #fafafa)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
            <span style={{ fontWeight: 700, fontSize: "0.72rem", color: TEXTO, display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <FiActivity size={12} color={TEXTO_LIGHT} /> Ocupación General
            </span>
            <span style={{ fontWeight: 800, fontSize: "0.85rem", color: stats.pctOcupacion > 70 ? ROJO : stats.pctOcupacion > 40 ? AMARILLO : VERDE }}>
              <span style={{ fontSize: "0.62rem", fontWeight: 600, color: TEXTO_LIGHT }}>{stats.ocupados}/{stats.totalParking}</span> · {stats.pctOcupacion}%
            </span>
          </div>
          <div style={{ width: "100%", height: "8px", borderRadius: "4px", backgroundColor: "#e2e8f0", overflow: "hidden", position: "relative" }}>
            <div style={{
              width: `${stats.pctOcupacion}%`, height: "100%", borderRadius: "4px",
              background: `linear-gradient(90deg, ${VERDE}, ${stats.pctOcupacion > 70 ? ROJO : stats.pctOcupacion > 40 ? AMARILLO : VERDE})`,
              transition: "width 1s ease",
              boxShadow: `0 0 6px ${stats.pctOcupacion > 70 ? ROJO : stats.pctOcupacion > 40 ? AMARILLO : VERDE}55`,
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", color: TEXTO_LIGHT, marginTop: "0.3rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}><span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: VERDE, display: "inline-block" }} /> {stats.disponibles} libres</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}><span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: ROJO, display: "inline-block" }} /> {stats.ocupados} ocupados</span>
            <span>{stats.capacidadTotal > 0 ? `${stats.ocupacionActual}/${stats.capacidadTotal} vehículos` : `${stats.ocupacionActual} vehículos`}</span>
          </div>
        </div>

        {/* ─── Filter & Controls ─── */}
        <div style={{ ...styles.card, marginBottom: "0.75rem" }}>
          <div style={{ padding: "0.6rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.4rem" }}>
            <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
              {["mapa", "tabla"].map(m => (
                <button key={m} onClick={() => setViewMode(m)}
                  style={{ ...styles.tab(viewMode === m, m === "mapa" ? "#6366f1" : "#3b82f6"), padding: "0.3rem 0.7rem", fontSize: "0.68rem" }}
                  onMouseEnter={e => { if (viewMode !== m) { e.currentTarget.style.backgroundColor = "#f8fafc"; e.currentTarget.style.boxShadow = "inset 0 0 0 1px #94a3b8" } }}
                  onMouseLeave={e => { if (viewMode !== m) { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.boxShadow = "inset 0 0 0 1px #e2e8f0" } }}>
                  {m === "mapa" ? <FiGrid size={11} /> : <FiList size={11} />}
                  {m === "mapa" ? "Matriz" : "Tabla"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.3rem", alignItems: "center", flexWrap: "wrap" }}>
              <FiFilter size={11} color={TEXTO_LIGHT} style={{ marginRight: "0.15rem" }} />
              {["TODOS", "DISPONIBLE", "LLENO"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="filter-btn"
                  style={{
                    ...styles.badge(
                      filter === f ? (f === "LLENO" ? ROJO_CLARO : f === "DISPONIBLE" ? VERDE_CLARO : "#e2e8f0") : "#f1f5f9",
                      filter === f ? (f === "LLENO" ? ROJO : f === "DISPONIBLE" ? VERDE : TEXTO) : TEXTO_LIGHT
                    ),
                    border: `1px solid ${filter === f ? "transparent" : BORDE}`,
                    cursor: "pointer", padding: "0.2rem 0.55rem", fontSize: "0.62rem",
                  }}>
                  {f === "TODOS" ? "Todos" : f === "DISPONIBLE" ? "Disponibles" : "Llenos"}
                </button>
              ))}
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <FiSearch size={11} color={TEXTO_LIGHT} style={{ position: "absolute", left: "0.4rem", pointerEvents: "none" }} />
                <input type="text" placeholder="N°..." value={searchN} onChange={e => setSearchN(e.target.value.replace(/\D/g, ""))}
                  onFocus={e => { e.currentTarget.style.borderColor = VERDE; e.currentTarget.style.boxShadow = `0 0 0 2px ${VERDE_CLARO}` }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.boxShadow = "none" }}
                  style={{ ...styles.input, padding: "0.2rem 0.5rem 0.2rem 1.2rem", fontSize: "0.68rem", width: "50px" }} />
              </div>
            </div>
          </div>
          {filtered.length > 0 && (
            <div style={{ padding: "0 1rem 0.5rem 1rem", display: "flex", gap: "0.6rem", fontSize: "0.6rem", color: TEXTO_LIGHT }}>
              <span>{filtered.length} espacios mostrados</span>
              <span>·</span>
              <span>{filtered.filter(s => s.disponible).length} libres</span>
              <span>·</span>
              <span>{filtered.filter(s => !s.disponible).length} ocupados</span>
            </div>
          )}
        </div>

        {/* ─── Main Content ─── */}
        {viewMode === "mapa" ? (
          <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: selectedSpot ? "1fr 340px" : "1fr", transition: "grid-template-columns 0.3s" }}>
            <div style={{ ...styles.card }}>
              <div style={{ padding: "0.75rem 1rem", borderBottom: `1px solid ${BORDE}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, color: TEXTO, fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <FiMapPin size={13} color={TEXTO_LIGHT} /> Plano del Estacionamiento
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div style={{ display: "flex", gap: "0.4rem", fontSize: "0.6rem", color: TEXTO_LIGHT }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: `${VERDE_CLARO}`, border: `1.5px solid ${VERDE}`, display: "inline-block" }} /> Libre
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: `${ROJO}99`, border: `1.5px solid ${ROJO}`, display: "inline-block" }} /> Ocupado
                    </span>
                  </div>
                </div>
              </div>

              {rows.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2.5rem", color: TEXTO_LIGHT }}>
                  <FiGrid size={32} style={{ opacity: 0.25, marginBottom: "0.4rem" }} />
                  <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>No hay estacionamientos</p>
                  <p style={{ fontSize: "0.7rem", marginTop: "0.2rem" }}>Crea espacios desde el panel de administración</p>
                </div>
              ) : (
                <div style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.6rem", gap: "0.4rem" }}>
                    <div style={{
                      background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", padding: "0.2rem 0.85rem",
                      borderRadius: "0.75rem", fontSize: "0.65rem", fontWeight: 700, color: "#065f46",
                      display: "flex", alignItems: "center", gap: "0.3rem",
                    }}>
                      <FiArrowUp size={12} /> ENTRADA
                    </div>
                  </div>

                  {rows.map((row, rowIdx) => (
                    <div key={rowIdx}>
                      <div style={{
                        display: "grid", gridTemplateColumns: `repeat(${Math.min(row.length, 4)}, 1fr)`, gap: "16px",
                        maxWidth: "1100px", margin: "0 auto",
                      }}>
                        {row.map((spot) => (
                          <SpotCard
                            key={spot.id}
                            spot={spot}
                            isSelected={selectedSpot?.id === spot.id}
                            onClick={() => setSelectedSpot(spot)}
                            onRemoveVehicle={handleRemoveVehicleFromSpot}
                          />
                        ))}
                        {row.length < 4 && Array.from({ length: 4 - row.length }).map((_, i) => (
                          <div key={`empty-${i}`} style={{ visibility: "hidden" }} />
                        ))}
                      </div>

                      {rowIdx < rows.length - 1 && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.6rem auto", maxWidth: "260px" }}>
                          <hr className="aisle-line" style={{ flex: 1 }} />
                          <span style={{ fontSize: "0.6rem", color: TEXTO_LIGHT, fontWeight: 600, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <FiNavigation2 size={10} /> PASILLO
                          </span>
                          <hr className="aisle-line" style={{ flex: 1 }} />
                        </div>
                      )}
                    </div>
                  ))}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "0.6rem", gap: "0.4rem" }}>
                    <div style={{
                      background: "linear-gradient(135deg, #fee2e2, #fecaca)", padding: "0.2rem 0.85rem",
                      borderRadius: "0.75rem", fontSize: "0.65rem", fontWeight: 700, color: "#991b1b",
                      display: "flex", alignItems: "center", gap: "0.3rem",
                    }}>
                      <FiArrowDown size={12} /> SALIDA
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedSpot && (
              <SpotDetailPanel
                spot={selectedSpot}
                verifyPlate={verifyPlate}
                setVerifyPlate={setVerifyPlate}
                vehiculoDetail={vehiculoDetail}
                loadingVerify={loadingVerify}
                onVerify={handleVerificarVehiculo}
                onClose={closeDetailPanel}
                unassignedVehicles={unassignedVehicles}
                onRemoveVehicle={handleRemoveVehicleFromSpot}
                allKnownVehicles={allKnownVehicles}
              />
            )}
          </div>
        ) : (
          <div style={{ ...styles.card, borderRadius: "0.75rem" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc" }}>
                    {["N°", "Tipo", "Capacidad", "Actual", "Estado", "Vehículos", "Ocupación", "Acción"].map(h => <th key={h} style={thStyle}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((slot, idx) => {
                    const pct = slot.capacidadMaxima ? Math.round((slot.cantidadActual / slot.capacidadMaxima) * 100) : 0
                    return (
                      <tr key={slot.id}
                        style={{
                          borderBottom: `1px solid #f1f5f9`, cursor: "pointer",
                          transition: "background 0.15s",
                          backgroundColor: idx % 2 === 0 ? "#fff" : "#fafafa",
                        }}
                        onClick={() => { setSelectedSpot(slot); setViewMode("mapa") }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f0fdf4"}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? "#fff" : "#fafafa"}>
                        <td style={{ ...tdStyle, fontWeight: 700, fontFamily: "monospace", fontSize: "0.85rem" }}>
                          <span style={{ fontSize: "0.95rem", marginRight: 3 }}>{getVehicleIcon(slot.tipoVehiculo)}</span>
                          #{slot.numero}
                        </td>
                        <td style={tdStyle}>
                          <span style={{ ...styles.badge(slot.tipoVehiculo === "MOTO" ? "#f3e8ff" : AZUL_CLARO, slot.tipoVehiculo === "MOTO" ? "#6b21a8" : "#1e40af") }}>
                            {slot.tipoVehiculo || "—"}
                          </span>
                        </td>
                        <td style={tdStyle}>{slot.capacidadMaxima ?? "∞"}</td>
                        <td style={tdStyle}><span style={{ fontWeight: 700, color: slot.cantidadActual > 0 ? AMARILLO : TEXTO }}>{slot.cantidadActual}</span></td>
                        <td style={tdStyle}>
                          <span style={{ ...styles.badge(slot.disponible ? VERDE_CLARO : ROJO_CLARO, slot.disponible ? "#166534" : "#991b1b") }}>
                            {slot.disponible ? <FiCheck size={9} /> : <FiX size={9} />} {slot.disponible ? "Disponible" : "Lleno"}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          {slot.vehiculos?.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                              {slot.vehiculos.map(v => (
                                <span key={v.placa} style={{ fontSize: "0.62rem", fontWeight: 600, fontFamily: "monospace", color: TEXTO, display: "flex", alignItems: "center", gap: "0.15rem" }}>
                                  <VehicleMini color={v.color} /> {v.placa}
                                </span>
                              ))}
                            </div>
                          ) : <span style={{ color: TEXTO_LIGHT, fontSize: "0.62rem" }}>—</span>}
                        </td>
                        <td style={tdStyle}>
                          {slot.capacidadMaxima ? (
                            <div style={{ width: "55px", height: "5px", borderRadius: "3px", backgroundColor: "#e2e8f0", overflow: "hidden" }}>
                              <div style={{ width: `${pct}%`, height: "100%", borderRadius: "3px", backgroundColor: pct >= 100 ? ROJO : pct >= 70 ? AMARILLO : VERDE, transition: "width 0.5s" }} />
                            </div>
                          ) : <span style={{ color: TEXTO_LIGHT, fontSize: "0.62rem" }}>—</span>}
                        </td>
                        <td style={tdStyle}>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedSpot(slot); setViewMode("mapa") }}
                            style={{ ...styles.btnOutline, padding: "0.15rem 0.5rem", fontSize: "0.58rem" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = VERDE; e.currentTarget.style.color = VERDE }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = TEXTO_SUAVE }}>
                            <FiInfo size={9} /> Ver
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SpotCard({ spot, isSelected, onClick, onRemoveVehicle }) {
  const [hover, setHover] = useState(false)
  const ocupado = !spot.disponible
  const pct = spot.capacidadMaxima ? Math.round((spot.cantidadActual / spot.capacidadMaxima) * 100) : 0
  const icon = getVehicleIcon(spot.tipoVehiculo)
  const vehicles = spot.vehiculos || []

  const statusColor = ocupado ? ROJO : VERDE
  const statusBg = ocupado ? "#fef2f2" : "#f0fdf4"
  const statusLight = ocupado ? ROJO_CLARO : VERDE_CLARO
  const isFull = !spot.disponible && spot.capacidadMaxima && spot.cantidadActual >= spot.capacidadMaxima

  return (
    <div
      className="spot-card"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: "0.75rem",
        border: `1.5px solid ${isSelected ? '#6366f1' : statusColor}`,
        background: "#fff",
        boxShadow: hover
          ? `0 6px 20px ${statusColor}18`
          : isSelected
            ? `0 0 0 3px rgba(99,102,241,0.12), 0 2px 8px rgba(0,0,0,0.06)`
            : "0 1px 3px rgba(0,0,0,0.04)",
        overflow: "hidden",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Top accent bar */}
      <div style={{
        height: "3px",
        background: isFull
          ? `linear-gradient(90deg, ${ROJO}, ${AMARILLO})`
          : `linear-gradient(90deg, ${statusColor}, ${statusColor}88)`,
      }} />

      <div style={{ padding: "0.65rem 0.75rem", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header: numero + status */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 800, fontFamily: "monospace", color: TEXTO, letterSpacing: "-0.02em" }}>
            #{spot.numero}
          </span>
          <span style={{
            fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase",
            padding: "0.12rem 0.4rem", borderRadius: "0.25rem",
            backgroundColor: statusLight, color: ocupado ? "#991b1b" : "#166534",
            display: "flex", alignItems: "center", gap: "0.2rem",
          }}>
            {isFull ? <FiAlertCircle size={9} /> : ocupado ? <FiEye size={9} /> : <FiCheck size={9} />}
            {isFull ? "LLENO" : ocupado ? "OCUPADO" : "LIBRE"}
          </span>
        </div>

        {/* Type + capacity */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
          <span style={{ fontSize: "0.62rem", color: TEXTO_SUAVE, display: "flex", alignItems: "center", gap: "0.2rem" }}>
            {icon} {spot.tipoVehiculo || "MIXTO"}
          </span>
          <span style={{ fontSize: "0.58rem", color: TEXTO_LIGHT, fontWeight: 600 }}>
            {spot.cantidadActual ?? 0}/{spot.capacidadMaxima || '∞'}
          </span>
        </div>

        {/* Matrix */}
        <ParkingMatrix spot={spot} />

        {/* Occupancy bar */}
        {spot.capacidadMaxima && (
          <div style={{ marginTop: "0.35rem" }}>
            <div style={{
              width: "100%", height: "3px", backgroundColor: "#f1f5f9",
              borderRadius: "2px", overflow: "hidden",
            }}>
              <div style={{
                width: `${Math.min(pct, 100)}%`, height: "100%",
                backgroundColor: pct >= 100 ? ROJO : pct >= 70 ? AMARILLO : VERDE,
                borderRadius: "2px", transition: "width 0.3s",
              }} />
            </div>
          </div>
        )}

        {/* Vehicles */}
        {vehicles.length > 0 && (
          <div style={{
            marginTop: "0.3rem", borderTop: `1px solid #f1f5f9`,
            paddingTop: "0.25rem",
          }}>
            {vehicles.slice(0, 2).map(v => (
              <div key={v.placa} style={{
                display: "flex", alignItems: "center", gap: "0.15rem",
                fontSize: "0.55rem", marginBottom: "0.1rem",
              }}>
                <VehicleMini color={v.color} />
                <span style={{
                  fontWeight: 700, fontFamily: "monospace", color: "#991b1b",
                  letterSpacing: "0.03em", fontSize: "0.55rem", flex: 1,
                }}>{v.placa}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onRemoveVehicle?.(v.placa) }}
                  title="Sacar vehículo"
                  style={styles.btnDanger}
                  onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.15)" }}
                  onMouseLeave={e => { e.currentTarget.style.filter = "none" }}
                >
                  <FiX size={8} />
                </button>
              </div>
            ))}
            {vehicles.length > 2 && (
              <div style={{ fontSize: "0.48rem", fontWeight: 600, color: "#991b1b", textAlign: "center" }}>
                +{vehicles.length - 2} más
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div style={{
        display: "flex", borderTop: `1px solid ${BORDE}`,
        background: hover ? "#fafafa" : "#fff",
        transition: "background 0.2s",
      }}>
        <button onClick={(e) => { e.stopPropagation(); onClick() }}
          style={{
            flex: 1, padding: "0.3rem", background: "#fff", border: "none", cursor: "pointer",
            color: statusColor, fontSize: "0.58rem", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.2rem",
            borderRight: `1px solid ${BORDE}`, transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, #f8fafc, #fff)` }}
          onMouseLeave={e => { e.currentTarget.style.background = "#fff" }}>
          <FiEye size={10} /> {ocupado ? 'Ver' : 'Detalle'}
        </button>
        <div style={{
          flex: 1, padding: "0.3rem", textAlign: "center",
          fontSize: "0.52rem", color: TEXTO_LIGHT, fontWeight: 600,
          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.15rem",
          background: "linear-gradient(135deg, #fafafa, #fff)",
        }}>
          <FiGrid size={9} /> {spot.capacidadMaxima ? `${spot.cantidadActual}/${spot.capacidadMaxima}` : '∞'}
        </div>
      </div>
    </div>
  )
}

function SpotDetailPanel({ spot, verifyPlate, setVerifyPlate, vehiculoDetail, loadingVerify, onVerify, onClose, unassignedVehicles, onRemoveVehicle, allKnownVehicles }) {
  const ocupado = !spot.disponible
  const pct = spot.capacidadMaxima ? Math.round((spot.cantidadActual / spot.capacidadMaxima) * 100) : 0
  const icon = getVehicleIcon(spot.tipoVehiculo)
  const vehicles = spot.vehiculos || []

  const statusColor = ocupado ? ROJO : VERDE
  const statusBg = ocupado ? "#fef2f2" : "#f0fdf4"

  return (
    <div className="slide-right" style={{
      background: "#fff", borderRadius: "0.85rem", border: `1px solid ${BORDE}`,
      boxShadow: "0 4px 16px rgba(0,0,0,0.06)", overflow: "hidden",
      position: "sticky", top: "1rem", alignSelf: "start",
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${statusBg}, #fff)`,
        borderBottom: `1px solid ${BORDE}`,
      }}>
        <div style={{
          padding: "0.85rem 1rem",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.3rem" }}>{icon}</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.9rem", color: TEXTO, fontFamily: "monospace" }}>Estacionamiento #{spot.numero}</div>
              <div style={{ fontSize: "0.65rem", color: TEXTO_LIGHT, fontWeight: 600 }}>{spot.tipoVehiculo || 'Libre'}</div>
            </div>
          </div>
          <button onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: TEXTO_LIGHT, padding: "0.2rem", borderRadius: "0.3rem" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f1f5f9"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
            <FiX size={16} />
          </button>
        </div>
        {/* Status line */}
        <div style={{
          height: "2px",
          background: `linear-gradient(90deg, ${statusColor}, ${statusColor}44)`,
        }} />
      </div>

      <div style={{ padding: "0.85rem 1rem" }}>
        {/* Info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "0.75rem" }}>
          <InfoCell label="Estado" value={ocupado ? "Ocupado" : "Disponible"} color={statusColor} />
          <InfoCell label="Tipo" value={spot.tipoVehiculo || '—'} icon={icon} />
          <InfoCell label="Capacidad" value={`${spot.cantidadActual}/${spot.capacidadMaxima ?? '∞'}`} />
          <InfoCell label="Ocupación" value={spot.capacidadMaxima ? `${spot.cantidadActual}/${spot.capacidadMaxima}` : `${spot.cantidadActual} veh`} color={pct >= 80 ? ROJO : pct > 0 ? AMARILLO : VERDE} />
        </div>

        {/* Occupancy bar */}
        {spot.capacidadMaxima ? (
          <div style={{ marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: TEXTO_LIGHT, marginBottom: "0.2rem" }}>
              <span>Nivel de ocupación</span>
              <span style={{ fontWeight: 700, color: pct >= 100 ? ROJO : pct >= 70 ? AMARILLO : VERDE }}>{pct}%</span>
            </div>
            <div style={{ width: "100%", height: "5px", borderRadius: "3px", backgroundColor: "#e2e8f0", overflow: "hidden" }}>
              <div style={{
                width: `${pct}%`, height: "100%", borderRadius: "3px",
                background: `linear-gradient(90deg, ${VERDE}, ${pct >= 70 ? (pct >= 100 ? ROJO : AMARILLO) : VERDE})`,
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>
        ) : null}

        {/* Vehicles in this slot */}
        {vehicles.length > 0 && (
          <div style={{ marginBottom: "0.75rem", borderTop: `1px solid #f1f5f9`, paddingTop: "0.65rem" }}>
            <div style={{ fontSize: "0.62rem", fontWeight: 700, color: TEXTO_SUAVE, textTransform: "uppercase", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <FiTruck size={11} /> Vehículos en este espacio ({vehicles.length})
            </div>
            {vehicles.map(v => (
              <div key={v.placa} style={{
                padding: "0.4rem 0.5rem", borderRadius: "0.4rem",
                backgroundColor: "#fef2f2", border: "1px solid #fecaca",
                marginBottom: "0.25rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flex: 1, minWidth: 0 }}>
                    <VehicleMini color={v.color} />
                    <span style={{ fontWeight: 700, fontSize: "0.75rem", fontFamily: "monospace", color: "#991b1b", letterSpacing: "0.05em" }}>
                      {v.placa}
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemoveVehicle(v.placa) }}
                    title="Sacar vehículo"
                    style={styles.btnDanger}
                    onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.15)" }}
                    onMouseLeave={e => { e.currentTarget.style.filter = "none" }}
                  >
                    <FiX size={9} /> Sacar
                  </button>
                </div>
                <div style={{ fontSize: "0.62rem", color: "#7f1d1d", display: "flex", gap: "0.4rem", marginLeft: "1.25rem" }}>
                  <span>{v.marca} {v.modelo}</span>
                  <span>•</span>
                  <span>{v.color}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Verify vehicle */}
        <div style={{ borderTop: `1px solid #f1f5f9`, paddingTop: "0.65rem" }}>
          <div style={{ fontSize: "0.62rem", fontWeight: 700, color: TEXTO_SUAVE, textTransform: "uppercase", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <FiCamera size={11} /> Verificar vehículo
          </div>
          {unassignedVehicles.length > 0 && (
            <select
              style={{ ...styles.input, marginBottom: "0.35rem", fontSize: "0.65rem", padding: "0.35rem 0.45rem", cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.5rem center", paddingRight: "1.5rem" }}
              onChange={e => { if (e.target.value) setVerifyPlate(e.target.value) }}
              onFocus={e => { e.currentTarget.style.borderColor = VERDE; e.currentTarget.style.boxShadow = `0 0 0 3px ${VERDE_CLARO}` }}
              onBlur={e => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.boxShadow = "none" }}
              defaultValue=""
            >
              <option value="" disabled>-- Sin estacionamiento --</option>
              {unassignedVehicles.map(v => (
                <option key={v.idVehiculo} value={v.placa}>
                  {v.placa} · {v.marca} {v.modelo}
                </option>
              ))}
            </select>
          )}            <div style={{ display: "flex", gap: "0.35rem" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <DataList
                  value={verifyPlate}
                  onChange={e => setVerifyPlate(e.target.value.toUpperCase())}
                  placeholder="ABC-123"
                  onKeyDown={e => e.key === "Enter" && onVerify()}
                  onFocus={e => { e.currentTarget.style.borderColor = VERDE; e.currentTarget.style.boxShadow = `0 0 0 3px ${VERDE_CLARO}` }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.boxShadow = "none" }}
                  style={{
                    ...styles.input, padding: "0.4rem 0.55rem", fontSize: "0.72rem",
                    fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.08em",
                    width: "100%",
                  }}
                >
                  <option value="">— Buscar vehículo por placa —</option>
                  {(allKnownVehicles || []).map(v => (
                    <option key={v.placa} value={v.placa}>
                      {v.placa} · {v.marca || ''} {v.modelo || ''} · {v.color || ''}{v.spotNumero ? ` · #${v.spotNumero}` : ''}
                    </option>
                  ))}
                </DataList>
              </div>
            <button onClick={onVerify} disabled={loadingVerify || !verifyPlate.trim()}
              style={{
                ...styles.btnPrimary, padding: "0.4rem 0.65rem", fontSize: "0.68rem",
                opacity: loadingVerify || !verifyPlate.trim() ? 0.5 : 1,
              }}
              onMouseEnter={e => { if (!loadingVerify && verifyPlate.trim()) { e.currentTarget.style.filter = "brightness(1.1)" } }}
              onMouseLeave={e => { e.currentTarget.style.filter = "none" }}>
              <FiSearch size={12} />
            </button>
          </div>

          {loadingVerify && (
            <div style={{ textAlign: "center", padding: "0.6rem", color: TEXTO_LIGHT, fontSize: "0.72rem" }}>
              <FiRefreshCw size={13} style={{ animation: "spin 1s linear infinite", marginRight: 4 }} /> Verificando...
            </div>
          )}
          {vehiculoDetail && !loadingVerify && (
            <div style={{
              marginTop: "0.5rem", padding: "0.6rem 0.7rem", borderRadius: "0.5rem",
              backgroundColor: "#f0fdf4", border: "1px solid #86efac",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.3rem" }}>
                <FiCheck size={13} color={VERDE_OSCURO} />
                <span style={{ fontWeight: 700, fontSize: "0.72rem", color: "#166534" }}>{vehiculoDetail.nombrePropietario || "Sin propietario"}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.15rem 0.4rem", fontSize: "0.65rem", color: "#166534" }}>
                <span><b>Placa:</b> {vehiculoDetail.placa}</span>
                <span><b>Marca:</b> {vehiculoDetail.marca}</span>
                <span><b>Modelo:</b> {vehiculoDetail.modelo}</span>
                <span><b>Color:</b> {vehiculoDetail.color}</span>
                <span><b>Tipo:</b> {vehiculoDetail.tipo}</span>
                {vehiculoDetail.idEstacionamiento && (
                  <span><b>Slot:</b> #{vehiculoDetail.idEstacionamiento}</span>
                )}
              </div>
              {vehiculoDetail.idEstacionamiento === spot.id && (
                <div style={{
                  marginTop: "0.3rem", fontSize: "0.62rem", fontWeight: 700,
                  color: VERDE_OSCURO, display: "flex", alignItems: "center", gap: "0.2rem",
                }}>
                  <FiCheck size={11} /> Está en este estacionamiento ✓
                </div>
              )}
              {vehiculoDetail.idEstacionamiento && vehiculoDetail.idEstacionamiento !== spot.id && (
                <div style={{
                  marginTop: "0.3rem", fontSize: "0.62rem", fontWeight: 700,
                  color: AMARILLO, display: "flex", alignItems: "center", gap: "0.2rem",
                }}>
                  <FiAlertCircle size={11} /> Asignado a Est. #{vehiculoDetail.idEstacionamiento}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoCell({ label, value, color, icon, mono }) {
  return (
    <div style={{ background: "#f8fafc", borderRadius: "0.45rem", padding: "0.4rem 0.55rem", border: "1px solid #f1f5f9" }}>
      <div style={{ fontSize: "0.5rem", fontWeight: 700, color: TEXTO_LIGHT, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.05rem" }}>{label}</div>
      <div style={{ fontWeight: 700, fontSize: "0.75rem", color: color || TEXTO, fontFamily: mono ? "monospace" : "inherit", display: "flex", alignItems: "center", gap: "0.2rem" }}>
        {icon} {value}
      </div>
    </div>
  )
}
