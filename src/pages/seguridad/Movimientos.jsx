import { useState, useEffect } from "react";
import { FiActivity, FiFilter, FiLogIn, FiLogOut, FiCalendar, FiSearch } from "react-icons/fi";

export default function Movimientos() {
  const [accesos, setAccesos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("TODOS");
  const [filtroPlaca, setFiltroPlaca] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  // Cargar todos los accesos
  useEffect(() => {
    const accesosGuardados = JSON.parse(localStorage.getItem("accesosSeguridad") || "[]");
    setAccesos(accesosGuardados);
  }, []);

  // Filtrar accesos
  const accesosFiltrados = accesos.filter(acceso => {
    const coincideTipo = filtroTipo === "TODOS" || acceso.tipo === filtroTipo;
    const coincidePlaca = !filtroPlaca || acceso.placa.includes(filtroPlaca.toUpperCase());
    const coincideFecha = !filtroFecha || new Date(acceso.fecha).toISOString().split('T')[0] === filtroFecha;
    return coincideTipo && coincidePlaca && coincideFecha;
  });

  // Estadísticas
  const totalHoy = accesos.filter(a => new Date(a.fecha).toDateString() === new Date().toDateString()).length;
  const entradasHoy = accesos.filter(a => new Date(a.fecha).toDateString() === new Date().toDateString() && a.tipo === "ENTRADA").length;
  const salidasHoy = accesos.filter(a => new Date(a.fecha).toDateString() === new Date().toDateString() && a.tipo === "SALIDA").length;

  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Movimientos</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>Historial completo de accesos al condominio</p>
      </div>

      {/* ESTADÍSTICAS RÁPIDAS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Total Hoy</p>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>{totalHoy}</p>
        </div>
        <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Entradas</p>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#10b981", margin: 0 }}>{entradasHoy}</p>
        </div>
        <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Salidas</p>
          <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#ef4444", margin: 0 }}>{salidasHoy}</p>
        </div>
      </div>

      {/* FILTROS */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "2rem" }}>
        <h5 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiFilter size={18} />
          Filtros
        </h5>
        
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "end" }}>
          <div style={{ flex: 1, minWidth: "150px" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Tipo</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
            >
              <option value="TODOS">Todos</option>
              <option value="ENTRADA">Entradas</option>
              <option value="SALIDA">Salidas</option>
            </select>
          </div>
          
          <div style={{ flex: 1, minWidth: "150px" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Placa</label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiSearch size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="ABC-123"
                value={filtroPlaca}
                onChange={(e) => setFiltroPlaca(e.target.value.toUpperCase())}
                style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
              />
            </div>
          </div>
          
          <div style={{ flex: 1, minWidth: "150px" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Fecha</label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiCalendar size={16} color="#94a3b8" />
              <input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TABLA DE MOVIMIENTOS */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h5 style={{ fontWeight: 700, color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiActivity size={20} />
            Registro de Movimientos
          </h5>
          <span style={{
            padding: "0.35rem 0.75rem",
            backgroundColor: "#f1f5f9",
            borderRadius: "20px",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#64748b"
          }}>
            {accesosFiltrados.length} registros
          </span>
        </div>

        {accesosFiltrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 2rem", color: "#94a3b8" }}>
            <FiActivity size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
            <p style={{ fontSize: "1rem", fontWeight: 500 }}>No hay movimientos registrados</p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>Los registros aparecerán aquí</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Fecha</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Hora</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Placa</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Tipo</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Residente/Visitante</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {accesosFiltrados.map((acceso) => (
                  <tr key={acceso.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem", color: "#64748b" }}>{new Date(acceso.fecha).toLocaleDateString()}</td>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#1e293b" }}>{acceso.hora}</td>
                    <td style={{ padding: "1rem", color: "#64748b" }}>{acceso.placa}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{
                        padding: "0.35rem 0.75rem",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        backgroundColor: acceso.tipo === "ENTRADA" ? "#dcfce7" : "#fee2e2",
                        color: acceso.tipo === "ENTRADA" ? "#166534" : "#991b1b"
                      }}>
                        {acceso.tipo === "ENTRADA" ? <FiLogIn size={12} style={{ marginRight: "4px" }} /> : <FiLogOut size={12} style={{ marginRight: "4px" }} />}
                        {acceso.tipo}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", color: "#64748b" }}>{acceso.nombreResidente}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{
                        padding: "0.35rem 0.75rem",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        backgroundColor: acceso.esResidente ? "#dbeafe" : "#fef3c7",
                        color: acceso.esResidente ? "#1e40af" : "#92400e"
                      }}>
                        {acceso.esResidente ? "Residente" : "Visitante"}
                      </span>
                    </td>
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