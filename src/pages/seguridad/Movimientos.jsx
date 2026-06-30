import { useState, useEffect } from "react";
import { FiActivity, FiFilter, FiLogIn, FiLogOut, FiCalendar, FiSearch, FiUser } from "react-icons/fi";
import { getSecurityDashboardStatus } from "../../services/api";

export default function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [stats, setStats] = useState({ totalEstacionamientos: 0, estacionamientosOcupados: 0, prestamosActivos: 0 });
  const [filtroTipo, setFiltroTipo] = useState("TODOS");
  const [filtroDesc, setFiltroDesc] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getSecurityDashboardStatus();
        setMovimientos(data.movimientosRecientes || []);
        setStats({
          totalEstacionamientos: data.totalEstacionamientos,
          estacionamientosOcupados: data.estacionamientosOcupados,
          prestamosActivos: data.prestamosActivos,
        });
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const movimientosFiltrados = movimientos.filter((m) => {
    const coincideTipo = filtroTipo === "TODOS" || m.tipo?.toUpperCase() === filtroTipo;
    const coincideDesc = !filtroDesc || m.descripcion?.toLowerCase().includes(filtroDesc.toLowerCase());
    const coincideFecha = !filtroFecha || (m.fecha && m.fecha.startsWith(filtroFecha));
    return coincideTipo && coincideDesc && coincideFecha;
  });

  const estiloTh = {
    padding: "0.85rem 1rem",
    textAlign: "left",
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };

  const estiloTd = { padding: "0.85rem 1rem", color: "#64748b", fontSize: "0.9rem" };

  const estiloLabel = {
    display: "block",
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.4rem",
  };

  const estiloInput = {
    width: "100%",
    padding: "0.65rem 0.75rem",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "0.9rem",
    outline: "none",
    background: "#f8fafc",
    color: "#1e293b",
    boxSizing: "border-box",
  };

  const statCard = (label, value, color = "#1e293b") => (
    <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", textAlign: "center" }}>
      <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem", margin: "0 0 0.5rem" }}>{label}</p>
      <p style={{ fontSize: "1.8rem", fontWeight: 800, color, margin: 0 }}>{value}</p>
    </div>
  );

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", boxSizing: "border-box" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Movimientos</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>Historial de actividad reciente del condominio</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {statCard("Estacionamientos", stats.totalEstacionamientos)}
        {statCard("Ocupados", stats.estacionamientosOcupados, "#ef4444")}
        {statCard("Préstamos Activos", stats.prestamosActivos, "#10b981")}
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "2rem" }}>
        <h5 style={{ fontWeight: 700, color: "#1e293b", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiFilter size={18} color="#64748b" />
          Filtros
        </h5>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
          <div>
            <label style={estiloLabel}>Tipo</label>
            <select style={estiloInput} value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="TODOS">Todos</option>
              <option value="ENTRADA">Entrada</option>
              <option value="SALIDA">Salida</option>
              <option value="PRESTAMO">Préstamo</option>
              <option value="DEVOLUCION">Devolución</option>
            </select>
          </div>
          <div>
            <label style={estiloLabel}>Descripción</label>
            <div style={{ position: "relative" }}>
              <FiSearch size={14} color="#94a3b8" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Buscar..."
                value={filtroDesc}
                onChange={(e) => setFiltroDesc(e.target.value)}
                style={{ ...estiloInput, paddingLeft: "2rem" }}
              />
            </div>
          </div>
          <div>
            <label style={estiloLabel}>Fecha</label>
            <div style={{ position: "relative" }}>
              <FiCalendar size={14} color="#94a3b8" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                style={{ ...estiloInput, paddingLeft: "2rem" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h5 style={{ fontWeight: 700, color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiActivity size={20} color="#64748b" />
            Registro de Movimientos
          </h5>
          <span style={{ padding: "0.35rem 0.75rem", backgroundColor: "#f1f5f9", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>
            {movimientosFiltrados.length} registros
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem 2rem", color: "#94a3b8" }}>
            <FiActivity size={36} style={{ marginBottom: "1rem", opacity: 0.35, display: "block", margin: "0 auto 1rem" }} />
            <p style={{ fontWeight: 600, margin: 0 }}>Cargando movimientos...</p>
          </div>
        ) : movimientosFiltrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 2rem", color: "#94a3b8" }}>
            <FiActivity size={40} style={{ display: "block", margin: "0 auto 1rem", opacity: 0.35 }} />
            <p style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 0.25rem" }}>Sin movimientos registrados</p>
            <p style={{ fontSize: "0.85rem", margin: 0 }}>Los registros aparecerán aquí</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  {["ID", "Tipo", "Descripción", "Fecha"].map((h) => (
                    <th key={h} style={estiloTh}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {movimientosFiltrados.map((m) => (
                  <tr key={m.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ ...estiloTd, fontWeight: 700, color: "#1e293b", fontFamily: "monospace" }}>#{m.id}</td>
                    <td style={estiloTd}>
                      <span style={{
                        padding: "0.3rem 0.7rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700,
                        backgroundColor: m.tipo?.toUpperCase() === "ENTRADA" ? "#dcfce7" : m.tipo?.toUpperCase() === "SALIDA" ? "#fee2e2" : "#dbeafe",
                        color: m.tipo?.toUpperCase() === "ENTRADA" ? "#166534" : m.tipo?.toUpperCase() === "SALIDA" ? "#991b1b" : "#1e40af",
                        display: "inline-flex", alignItems: "center", gap: "0.3rem",
                      }}>
                        {m.tipo?.toUpperCase() === "ENTRADA" ? <FiLogIn size={11} /> : m.tipo?.toUpperCase() === "SALIDA" ? <FiLogOut size={11} /> : <FiActivity size={11} />}
                        {m.tipo}
                      </span>
                    </td>
                    <td style={{ ...estiloTd, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <FiUser size={14} color="#94a3b8" />
                      {m.descripcion}
                    </td>
                    <td style={estiloTd}>{m.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}