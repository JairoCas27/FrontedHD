import { useState, useEffect, useCallback } from 'react'
import { FiActivity, FiFilter, FiSearch, FiCalendar, FiRefreshCw, FiX, FiLogIn, FiUser, FiCheck, FiAlertCircle } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { getDashboardStatus } from '../../services/SeguridadApi'

// ==================== CONSTANTES ====================
const VERDE = "#10b981"
const VERDE_CLARO = "rgba(16,185,129,0.12)"
const ROJO = "#ef4444"
const AMARILLO = "#f59e0b"
const TEXTO = "#0f172a"
const TEXTO_SUAVE = "#475569"
const TEXTO_LIGHT = "#94a3b8"
const FONDO = "#f8fafc"
const BORDE = "#e2e8f0"

const styles = {
  container: { padding: "2rem", backgroundColor: FONDO, minHeight: "100vh", width: "100%", boxSizing: "border-box" },
  card: { backgroundColor: "#fff", borderRadius: "1rem", border: `1px solid ${BORDE}`, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" },
  input: { width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.9rem", color: TEXTO, backgroundColor: "#fff", boxSizing: "border-box", outline: "none" },
  label: { display: "block", fontSize: "0.7rem", fontWeight: "700", color: TEXTO_SUAVE, marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.04em" },
  select: { width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem", border: "1px solid #cbd5e1", fontSize: "0.9rem", color: TEXTO, backgroundColor: "#fff", outline: "none" },
  badge: (bg, color) => ({ fontSize: "0.7rem", fontWeight: "700", padding: "0.22rem 0.55rem", borderRadius: "0.35rem", display: "inline-flex", alignItems: "center", gap: "0.25rem", backgroundColor: bg, color }),
  btnOutline: { backgroundColor: "#fff", color: TEXTO_SUAVE, border: `1px solid #cbd5e1`, padding: "0.45rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem", transition: "all 0.2s" },
}

const thStyle = { padding: "0.55rem 0.75rem", textAlign: "left", fontWeight: 700, color: TEXTO_SUAVE, fontSize: "0.65rem", textTransform: "uppercase", whiteSpace: "nowrap" }
const tdStyle = { padding: "0.55rem 0.75rem", color: TEXTO, whiteSpace: "nowrap" }

const fmtDate = (iso) => {
  if (!iso) return '—'
  try { const d = new Date(iso); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` } catch { return iso }
}

export default function Movimientos() {
  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500) }
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState(null)
  const [filtroTipo, setFiltroTipo] = useState("TODOS")
  const [filtroDesc, setFiltroDesc] = useState("")
  const [filtroFecha, setFiltroFecha] = useState("")

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const d = await getDashboardStatus()
      setDashboard(d)
    } catch { showToast("Error al cargar movimientos", "error") }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const movimientos = dashboard?.movimientosRecientes || []

  const filtrados = movimientos.filter(m => {
    if (filtroTipo !== "TODOS" && m.tipo?.toUpperCase() !== filtroTipo) return false
    if (filtroDesc && !m.descripcion?.toLowerCase().includes(filtroDesc.toLowerCase())) return false
    if (filtroFecha && !m.fecha?.startsWith(filtroFecha)) return false
    return true
  })

  const hayFiltros = filtroTipo !== "TODOS" || filtroDesc || filtroFecha

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: slideIn 0.3s ease both; }
      `}</style>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 1300,
          backgroundColor: toast.type === 'error' ? ROJO : VERDE,
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
        titulo="Movimientos"
        subtitulo={`${movimientos.length} registros de acceso vehicular`}
        action={
          <button onClick={loadData} disabled={loading}
            style={{ ...styles.btnOutline, padding: "0.5rem 1rem", opacity: loading ? 0.6 : 1 }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f1f5f9"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff"}>
            <FiRefreshCw size={14} /> {loading ? "..." : "Actualizar"}
          </button>
        }
      />

      <div className="fade-in">
        {/* Filtros */}
        <div style={{ ...styles.card, marginBottom: "1rem" }}>
          <div style={{ padding: "0.85rem 1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, fontSize: "0.85rem", color: TEXTO, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <FiFilter size={14} color={TEXTO_LIGHT} /> Filtros
              </span>
              {hayFiltros && (
                <button onClick={() => { setFiltroTipo("TODOS"); setFiltroDesc(""); setFiltroFecha("") }}
                  style={{ ...styles.btnOutline, padding: "0.25rem 0.75rem", fontSize: "0.7rem" }}>
                  <FiX size={12} /> Limpiar
                </button>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.85rem" }}>
              <div>
                <label style={styles.label}>Tipo</label>
                <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} style={styles.select}>
                  <option value="TODOS">Todos</option>
                  <option value="VEHICULAR">Vehicular</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Descripción</label>
                <div style={{ position: "relative" }}>
                  <FiSearch size={12} color={TEXTO_LIGHT} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
                  <input type="text" placeholder="Buscar..." value={filtroDesc} onChange={e => setFiltroDesc(e.target.value)}
                    style={{ ...styles.input, paddingLeft: "2rem" }} />
                </div>
              </div>
              <div>
                <label style={styles.label}>Fecha</label>
                <div style={{ position: "relative" }}>
                  <FiCalendar size={12} color={TEXTO_LIGHT} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
                  <input type="date" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)}
                    style={{ ...styles.input, paddingLeft: "2rem" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de movimientos */}
        <div style={{ ...styles.card }}>
          <div style={{ padding: "0.85rem 1.25rem", borderBottom: `1px solid ${BORDE}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: "0.85rem", color: TEXTO, display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FiActivity size={14} color={TEXTO_LIGHT} /> Registro de Movimientos
            </span>
            <span style={{ fontSize: "0.7rem", color: TEXTO_LIGHT, fontWeight: 600 }}>{filtrados.length} registros</span>
          </div>
          {filtrados.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2.5rem", color: TEXTO_LIGHT }}>
              <FiActivity size={32} style={{ opacity: 0.3, marginBottom: "0.5rem" }} />
              <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>
                {hayFiltros ? "Sin resultados con los filtros aplicados" : "Sin movimientos registrados"}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ backgroundColor: FONDO }}>
                  {["ID", "Tipo", "Descripción", "Fecha"].map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {filtrados.map(m => (
                    <tr key={m.id} style={{ borderBottom: `1px solid #f1f5f9` }}>
                      <td style={{ ...tdStyle, fontWeight: 700, fontFamily: "monospace" }}>#{m.id}</td>
                      <td style={tdStyle}>
                        <span style={{ ...styles.badge(VERDE_CLARO, "#166534") }}>
                          <FiLogIn size={10} style={{ marginRight: 3 }} /> {m.tipo}
                        </span>
                      </td>
                      <td style={tdStyle}><FiUser size={12} style={{ marginRight: 4, color: TEXTO_LIGHT }} />{m.descripcion}</td>
                      <td style={{ ...tdStyle, fontSize: "0.8rem", color: TEXTO_LIGHT }}>{fmtDate(m.fecha)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
