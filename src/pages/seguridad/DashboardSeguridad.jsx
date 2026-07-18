import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiGrid, FiTruck, FiShoppingCart, FiActivity, FiLogIn, FiLogOut, FiClock, FiMapPin, FiRefreshCw, FiCheck, FiAlertCircle, FiHome, FiArrowRight, FiPercent, FiBarChart2, FiUsers, FiAlertTriangle, FiInfo } from "react-icons/fi"
import { getDashboardStatus, listParkingSlots, getActiveCartLoans } from '../../services/SeguridadApi'

const VERDE = "#10b981"
const VERDE_OSCURO = "#059669"
const VERDE_CLARO = "rgba(16,185,129,0.12)"
const ROJO = "#ef4444"
const ROJO_CLARO = "rgba(239,68,68,0.12)"
const AMARILLO = "#f59e0b"
const AMARILLO_CLARO = "rgba(245,158,11,0.12)"
const AZUL = "#3b82f6"
const AZUL_CLARO = "rgba(59,130,246,0.12)"
const CIAN = "#06b6d4"
const CIAN_CLARO = "rgba(6,182,212,0.12)"
const TEXTO = "#0f172a"
const TEXTO_SUAVE = "#475569"
const TEXTO_LIGHT = "#94a3b8"
const FONDO = "#f1f5f9"
const BORDE = "#e2e8f0"

const styles = {
  container: { padding: "2rem", backgroundColor: FONDO, minHeight: "100vh", width: "100%", boxSizing: "border-box" },
  containerMobile: { padding: "1rem", backgroundColor: FONDO, minHeight: "100vh", width: "100%", boxSizing: "border-box" },
  card: { backgroundColor: "#fff", borderRadius: "1.25rem", border: `1px solid ${BORDE}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" },
  label: { fontSize: "0.72rem", fontWeight: 700, color: TEXTO_SUAVE, textTransform: "uppercase", letterSpacing: "0.5px" },
  btnOutline: { backgroundColor: "#fff", color: TEXTO_SUAVE, border: `1px solid #cbd5e1`, padding: "0.45rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem", transition: "all 0.2s" },
}

const fmtDate = (iso) => {
  if (!iso) return '—'
  try { const d = new Date(iso); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` } catch { return iso }
}

const fmtHora = (iso) => {
  if (!iso) return ''
  try { const d = new Date(iso); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` } catch { return '' }
}

function Clock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const iv = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(iv) }, [])
  const dias = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"]
  const meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"]
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: TEXTO, lineHeight: 1.2, fontFamily: "monospace" }}>
        {String(time.getHours()).padStart(2, '0')}:{String(time.getMinutes()).padStart(2, '0')}:{String(time.getSeconds()).padStart(2, '0')}
      </div>
      <div style={{ fontSize: "0.72rem", color: TEXTO_LIGHT, fontWeight: 600 }}>
        {dias[time.getDay()]}, {time.getDate()} DE {meses[time.getMonth()]} {time.getFullYear()}
      </div>
    </div>
  )
}

export default function DashboardSeguridad() {
  const navigate = useNavigate()
  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500) }
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState(null)
  const [parking, setParking] = useState([])
  const [activeLoans, setActiveLoans] = useState([])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [d, p, loans] = await Promise.all([
        getDashboardStatus().catch(() => null),
        listParkingSlots().catch(() => []),
        getActiveCartLoans().catch(() => []),
      ])
      setDashboard(d)
      setParking(Array.isArray(p) ? p.sort((a, b) => (a.numero || 0) - (b.numero || 0)) : [])
      setActiveLoans(Array.isArray(loans) ? loans : [])
    } catch { showToast("Error al cargar datos", "error") }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const stats = useMemo(() => ({
    totalParking: dashboard?.totalEstacionamientos ?? parking.length ?? 0,
    ocupados: dashboard?.estacionamientosOcupados ?? parking.filter(p => !p.disponible).length ?? 0,
    disponibles: parking.filter(p => p.disponible).length,
    prestamosActivos: dashboard?.prestamosActivos ?? activeLoans.length ?? 0,
    movimientosHoy: dashboard?.movimientosRecientes?.length ?? 0,
    pctOcupacion: parking.length > 0 ? Math.round((parking.filter(p => !p.disponible).length / parking.length) * 100) : 0,
  }), [dashboard, parking, activeLoans])

  const getOcupacionColor = (pct) => pct > 80 ? ROJO : pct > 55 ? AMARILLO : VERDE

  const movimientos = useMemo(() => {
    if (!dashboard?.movimientosRecientes) return []
    return dashboard.movimientosRecientes.slice(0, 5)
  }, [dashboard])

  if (loading) {
    return (
      <div style={{ ...styles.container, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
        <div style={{ width: 42, height: 42, border: "4px solid #e2e8f0", borderTopColor: VERDE, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <span style={{ color: TEXTO_LIGHT, fontWeight: 600, fontSize: "0.85rem" }}>Cargando dashboard...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div className="ds-container" style={styles.container}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: slideIn 0.35s ease both; }
        .stat-card { transition: all 0.25s ease; cursor: default; }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px -8px rgba(0,0,0,0.1); }
        .quick-btn { transition: all 0.2s ease; cursor: pointer; }
        .quick-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.08); }
        .hover-row { transition: background 0.15s; cursor: default; }
        .hover-row:hover { background: #f8fafc; }
        @media (max-width: 768px) {
          .ds-container { padding: 1rem !important; }
          .ds-header { flex-direction: column !important; align-items: stretch !important; gap: 1rem !important; }
          .ds-header-right { flex-direction: row !important; justify-content: space-between !important; }
          .ds-two-col, .ds-bottom-row { grid-template-columns: 1fr !important; }
          .ds-grid-actions { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .ds-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {toast && (
        <div style={{
          position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 1300,
          backgroundColor: toast.type === 'error' ? ROJO : toast.type === 'warning' ? AMARILLO : VERDE,
          color: "#fff", padding: "0.85rem 1.25rem", borderRadius: "0.75rem",
          fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.6rem",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)", animation: "slideIn 0.3s ease",
        }}>
          {toast.type === 'error' ? <FiAlertCircle size={18} /> : <FiCheck size={18} />}
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <div className="ds-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
            <div style={{ backgroundColor: VERDE_CLARO, padding: "0.4rem", borderRadius: "0.5rem", display: "flex" }}>
              <FiHome size={18} color={VERDE} />
            </div>
            <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: TEXTO }}>Dashboard de Seguridad</h1>
          </div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: TEXTO_LIGHT }}>
            Panel de monitoreo en tiempo real
          </p>
        </div>
        <div className="ds-header-right" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Clock />
          <button onClick={loadData}
            style={{ ...styles.btnOutline, padding: "0.5rem 0.75rem" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f1f5f9"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}>
            <FiRefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="fade-in" style={{ animationDelay: "0ms" }}>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", marginBottom: "1.5rem" }}>
          <StatCard
            icon={<FiGrid size={20} />}
            label="Estacionamientos"
            value={stats.totalParking}
            sub={`${stats.disponibles} disponibles`}
            gradient="linear-gradient(135deg, #3b82f6, #1d4ed8)"
          />
          <StatCard
            icon={<FiPercent size={20} />}
            label="Ocupación"
            value={`${stats.pctOcupacion}%`}
            sub={`${stats.ocupados} ocupados`}
            gradient={`linear-gradient(135deg, ${getOcupacionColor(stats.pctOcupacion)}, ${stats.pctOcupacion > 80 ? '#dc2626' : stats.pctOcupacion > 55 ? '#d97706' : '#059669'})`}
          />
          <StatCard
            icon={<FiShoppingCart size={20} />}
            label="Préstamos Activos"
            value={stats.prestamosActivos}
            sub={stats.prestamosActivos === 1 ? "1 carrito en uso" : stats.prestamosActivos > 0 ? `${stats.prestamosActivos} carritos en uso` : "Sin préstamos"}
            gradient="linear-gradient(135deg, #f59e0b, #d97706)"
          />
          <StatCard
            icon={<FiActivity size={20} />}
            label="Movimientos Hoy"
            value={stats.movimientosHoy}
            sub={stats.movimientosHoy > 0 ? "Accesos registrados" : "Sin registros"}
            gradient="linear-gradient(135deg, #06b6d4, #0891b2)"
          />
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="fade-in ds-two-col" style={{ animationDelay: "100ms", display: "grid", gap: "1.5rem", gridTemplateColumns: "1fr 1.2fr", marginBottom: "1.5rem" }}>
        
        {/* LEFT: Occupancy Chart */}
        <div style={{ ...styles.card }}>
          <div style={{ padding: "0.85rem 1.25rem", borderBottom: `1px solid ${BORDE}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: "0.82rem", color: TEXTO, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FiBarChart2 size={14} color={TEXTO_LIGHT} /> Ocupación de Estacionamientos
            </span>
            <button onClick={() => navigate('/seguridad/mapa-parqueo')}
              style={{ background: "none", border: "none", color: VERDE, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}>
              Ver mapa <FiArrowRight size={12} />
            </button>
          </div>
          <OccupancyChart spots={parking} total={stats.totalParking} disponibles={stats.disponibles} ocupados={stats.ocupados} pct={stats.pctOcupacion} />
        </div>

        {/* RIGHT: Activity Feed */}
        <div style={{ ...styles.card }}>
          <div style={{ padding: "0.85rem 1.25rem", borderBottom: `1px solid ${BORDE}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: "0.82rem", color: TEXTO, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FiClock size={14} color={TEXTO_LIGHT} /> Actividad del Día
            </span>
            {stats.movimientosHoy > 0 && (
              <button onClick={() => navigate('/seguridad/movimientos')}
                style={{ background: "none", border: "none", color: VERDE, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                Ver todos <FiArrowRight size={12} />
              </button>
            )}
          </div>
          <ActivityFeed movimientos={movimientos} />
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="fade-in ds-bottom-row" style={{ animationDelay: "160ms", display: "grid", gap: "1.5rem", gridTemplateColumns: "1fr 1fr" }}>
        
        {/* Active Loans */}
        <div style={{ ...styles.card }}>
          <div style={{ padding: "0.85rem 1.25rem", borderBottom: `1px solid ${BORDE}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: "0.82rem", color: TEXTO, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FiShoppingCart size={14} color={TEXTO_LIGHT} /> Préstamos de Carritos
            </span>
            <span style={{ fontSize: "0.7rem", color: TEXTO_LIGHT, fontWeight: 700, backgroundColor: activeLoans.length > 0 ? AMARILLO_CLARO : VERDE_CLARO, padding: "0.15rem 0.5rem", borderRadius: "0.35rem" }}>
              {activeLoans.length} activo{activeLoans.length !== 1 ? 's' : ''}
            </span>
          </div>
          {activeLoans.length === 0 ? (
            <div style={{ textAlign: "center", padding: "1.5rem", color: TEXTO_LIGHT }}>
              <FiShoppingCart size={22} style={{ opacity: 0.3, marginBottom: "0.3rem" }} />
              <p style={{ fontSize: "0.82rem", fontWeight: 600, margin: 0 }}>Sin préstamos activos</p>
              <p style={{ fontSize: "0.7rem", margin: "0.2rem 0 0" }}>Todos los carritos disponibles</p>
            </div>
          ) : (
            <div>
              {activeLoans.map(l => (
                <div key={l.id} className="hover-row" style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.65rem 1.25rem", borderBottom: `1px solid #f1f5f9` }}>
                  <div style={{ width: 34, height: 34, borderRadius: "0.4rem", backgroundColor: AMARILLO_CLARO, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FiShoppingCart size={14} color={AMARILLO} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: TEXTO }}>{l.codigoCarrito || `#${l.id}`}</div>
                    <div style={{ fontSize: "0.7rem", color: TEXTO_LIGHT }}>{l.nombreSolicitante || '—'} · DNI: {l.dniSolicitante || '—'}</div>
                  </div>
                  <div style={{ fontSize: "0.65rem", color: TEXTO_LIGHT, textAlign: "right", whiteSpace: "nowrap" }}>
                    <div style={{ fontFamily: "monospace" }}>{fmtDate(l.fechaPrestamo)}</div>
                    {l.penalizacion > 0 && <div style={{ color: ROJO, fontWeight: 700, fontSize: "0.68rem" }}>S/ {l.penalizacion}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ padding: "0.6rem 1.25rem", borderTop: `1px solid #f1f5f9`, textAlign: "center" }}>
            <button onClick={() => navigate('/seguridad/prestamos')}
              style={{ background: "none", border: "none", color: VERDE, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
              Ir a Préstamos <FiArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ ...styles.card }}>
          <div style={{ padding: "0.85rem 1.25rem", borderBottom: `1px solid ${BORDE}` }}>
            <span style={{ fontWeight: 700, fontSize: "0.82rem", color: TEXTO, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FiActivity size={14} color={TEXTO_LIGHT} /> Acciones Rápidas
            </span>
          </div>
          <div className="ds-grid-actions" style={{ padding: "1rem 1.25rem", display: "grid", gap: "0.65rem", gridTemplateColumns: "1fr 1fr" }}>
            <QuickActionBtn icon={<FiLogIn size={16} />} label="Registrar Entrada" desc="Vehículo" color={VERDE} onClick={() => navigate('/seguridad/accesos')} />
            <QuickActionBtn icon={<FiLogOut size={16} />} label="Registrar Salida" desc="Vehículo" color={ROJO} onClick={() => navigate('/seguridad/accesos')} />
            <QuickActionBtn icon={<FiShoppingCart size={16} />} label="Nuevo Préstamo" desc="Carrito" color={AMARILLO} onClick={() => navigate('/seguridad/prestamos')} />
            <QuickActionBtn icon={<FiMapPin size={16} />} label="Mapa Parqueo" desc="Ver espacios" color={AZUL} onClick={() => navigate('/seguridad/mapa-parqueo')} />
            <QuickActionBtn icon={<FiClock size={16} />} label="Movimientos" desc="Historial" color={CIAN} onClick={() => navigate('/seguridad/movimientos')} />
            <QuickActionBtn icon={<FiUsers size={16} />} label="Devolver Carrito" desc="Finalizar préstamo" color={VERDE_OSCURO} onClick={() => navigate('/seguridad/prestamos')} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== STAT CARD ====================
function StatCard({ icon, label, value, sub, gradient }) {
  return (
    <div className="stat-card" style={{
      background: "#fff", borderRadius: "1.25rem", border: `1px solid ${BORDE}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.02)", padding: "1.25rem", position: "relative", overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: TEXTO, lineHeight: 1.1 }}>{value}</div>
          <div style={{ fontSize: "0.75rem", color: TEXTO_LIGHT, fontWeight: 600, marginTop: "0.1rem" }}>{label}</div>
          {sub && <div style={{ fontSize: "0.68rem", color: TEXTO_LIGHT, marginTop: "0.1rem" }}>{sub}</div>}
        </div>
        <div style={{ background: gradient, padding: "0.6rem", borderRadius: "0.75rem", display: "flex", color: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          {icon}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: gradient, opacity: 0.6 }} />
    </div>
  )
}

// ==================== OCUPANCY CHART ====================
function OccupancyChart({ spots, total, disponibles, ocupados, pct }) {
  const sinDatos = spots.length === 0
  const R = 80, STROKE = 18, CX = 120, CY = 120
  const circ = 2 * Math.PI * R

  const status = sinDatos ? 'sinDatos'
    : pct === 0 ? 'libre'
    : pct > 80 ? 'lleno'
    : 'parcial'

  const statusConfig = {
    libre:   { label: 'Libre',   color: VERDE,  bg: VERDE_CLARO, desc: 'Todos los espacios disponibles' },
    parcial: { label: 'Parcial', color: AMARILLO, bg: AMARILLO_CLARO, desc: `${pct}% ocupado · ${ocupados} espacios` },
    lleno:   { label: 'Lleno',   color: ROJO,   bg: ROJO_CLARO, desc: `${pct}% ocupado · ${ocupados} espacios` },
    sinDatos:{ label: 'Sin datos', color: TEXTO_LIGHT, bg: "rgba(148,163,184,0.1)", desc: 'No hay estacionamientos registrados' },
  }

  const cfg = statusConfig[status]

  return (
    <div style={{ padding: "1.25rem 0.85rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={CX * 2 + 20} height={CY * 2 + 20} viewBox={`0 0 ${CX * 2 + 20} ${CY * 2 + 20}`}>
        <circle cx={CX + 10} cy={CY + 10} r={R} fill="none" stroke="#e2e8f0" strokeWidth={STROKE} />
        {!sinDatos && (
          <circle cx={CX + 10} cy={CY + 10} r={R} fill="none"
            stroke={cfg.color}
            strokeWidth={STROKE}
            strokeDasharray={`${circ * (ocupados / total)} ${circ * (disponibles / total)}`}
            strokeDashoffset={circ * 0.25}
            strokeLinecap="round"
            transform={`rotate(-90 ${CX + 10} ${CY + 10})`}
            style={{ transition: "stroke-dasharray 1.2s ease" }}
          />
        )}
        <text x={CX + 10} y={CY + 6} textAnchor="middle" dominantBaseline="central"
          fontSize="28" fontWeight="800" fill={sinDatos ? TEXTO_LIGHT : cfg.color}>
          {sinDatos ? '—' : `${pct}%`}
        </text>
        <text x={CX + 10} y={CY + 26} textAnchor="middle" dominantBaseline="central"
          fontSize="11" fontWeight="700" fill={cfg.color} letterSpacing="1">
          {cfg.label.toUpperCase()}
        </text>
      </svg>

      <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.25rem", marginBottom: "0.65rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: VERDE }} />
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: TEXTO_SUAVE }}>{disponibles} disponibles</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: ROJO }} />
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: TEXTO_SUAVE }}>{ocupados} ocupados</span>
        </div>
      </div>

      <div style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", backgroundColor: `${cfg.color}12`, border: `1px solid ${cfg.color}25`, display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: cfg.color }} />
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
        <span style={{ fontSize: "0.68rem", color: TEXTO_LIGHT }}>· {cfg.desc}</span>
      </div>
    </div>
  )
}

// ==================== ACTIVITY FEED ====================
function ActivityFeed({ movimientos }) {
  if (movimientos.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: TEXTO_LIGHT }}>
        <div style={{ fontSize: "2rem", opacity: 0.2, marginBottom: "0.5rem" }}>◷</div>
        <p style={{ fontSize: "0.82rem", fontWeight: 600, margin: 0 }}>Sin actividad registrada hoy</p>
        <p style={{ fontSize: "0.7rem", margin: "0.25rem 0 0" }}>Los movimientos de acceso aparecerán aquí</p>
      </div>
    )
  }

  return (
    <div style={{ padding: "0.25rem 0" }}>
      {movimientos.map((m, i) => {
        const esEntrada = m.tipo?.toLowerCase() === 'entrada'
        const color = esEntrada ? VERDE : ROJO
        const bgColor = esEntrada ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)"
        const icon = esEntrada ? <FiLogIn size={13} color={color} /> : <FiLogOut size={13} color={color} />
        const label = esEntrada ? 'Entrada' : 'Salida'
        return (
          <div key={m.id || i} className="hover-row" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.7rem 1.25rem", borderBottom: i < movimientos.length - 1 ? `1px solid #f1f5f9` : "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: "0.5rem", backgroundColor: bgColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: TEXTO }}>{m.descripcion}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.1rem" }}>
                <span style={{ fontSize: "0.62rem", fontWeight: 700, color, backgroundColor: `${color}15`, padding: "0.1rem 0.35rem", borderRadius: "0.25rem" }}>{label}</span>
                {m.tipo && <span style={{ fontSize: "0.62rem", color: TEXTO_LIGHT }}>{m.tipo !== label.toLowerCase() ? m.tipo : ''}</span>}
              </div>
            </div>
            <div style={{ fontSize: "0.65rem", color: TEXTO_LIGHT, textAlign: "right", whiteSpace: "nowrap", fontFamily: "monospace", fontWeight: 600 }}>
              {fmtHora(m.fecha)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ==================== QUICK ACTION BUTTON ====================
function QuickActionBtn({ icon, label, desc, color, onClick }) {
  return (
    <div className="quick-btn" onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: "0.6rem",
      padding: "0.7rem 0.85rem", borderRadius: "0.65rem",
      backgroundColor: `${color}08`, border: `1px solid ${color}20`,
    }}>
      <div style={{ width: 34, height: 34, borderRadius: "0.45rem", backgroundColor: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: TEXTO }}>{label}</div>
        <div style={{ fontSize: "0.65rem", color: TEXTO_LIGHT }}>{desc}</div>
      </div>
    </div>
  )
}
