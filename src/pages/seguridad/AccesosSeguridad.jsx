import { useState, useEffect } from "react";
import { FiActivity, FiSearch, FiLogIn, FiLogOut, FiClock, FiUser, FiTruck } from "react-icons/fi";
export default function AccesosSeguridad() {
  const [placaInput, setPlacaInput] = useState("");
  const [residenteEncontrado, setResidenteEncontrado] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [accesosHoy, setAccesosHoy] = useState([]);

  // Cargar accesos del día al iniciar
  useEffect(() => {
    const accesosGuardados = JSON.parse(localStorage.getItem("accesosSeguridad") || "[]");
    const hoy = new Date().toDateString();
    const accesosHoyFiltrados = accesosGuardados.filter(a => new Date(a.fecha).toDateString() === hoy);
    setAccesosHoy(accesosHoyFiltrados);
  }, []);

  // Verificar placa en localStorage
  const verificarPlaca = () => {
    setMensaje(null);
    setResidenteEncontrado(null);
    
    if (!placaInput.trim()) {
      setMensaje({ tipo: "warning", texto: "Ingrese una placa para verificar" });
      return;
    }

    const residente = JSON.parse(localStorage.getItem("urbanParkUser") || "null");
    
    if (residente && residente.vehicle && residente.vehicle.placa.toUpperCase() === placaInput.toUpperCase()) {
      setResidenteEncontrado(residente);
      setMensaje({ tipo: "success", texto: "✅ Residente verificado" });
    } else {
      setMensaje({ tipo: "danger", texto: "❌ Placa no registrada. Registrar como visita." });
    }
  };

  // Registrar entrada o salida
  const registrarAcceso = (tipo) => {
    const nuevoAcceso = {
      id: Date.now(),
      placa: placaInput.toUpperCase(),
      tipo: tipo,
      fecha: new Date().toISOString(),
      hora: new Date().toLocaleTimeString(),
      esResidente: !!residenteEncontrado,
      nombreResidente: residenteEncontrado ? `${residenteEncontrado.nombres} ${residenteEncontrado.apellidos}` : "VISITANTE"
    };

    const accesosGuardados = JSON.parse(localStorage.getItem("accesosSeguridad") || "[]");
    const nuevosAccesos = [nuevoAcceso, ...accesosGuardados];
    
    localStorage.setItem("accesosSeguridad", JSON.stringify(nuevosAccesos));
    
    const hoy = new Date().toDateString();
    setAccesosHoy(nuevosAccesos.filter(a => new Date(a.fecha).toDateString() === hoy));
    
    setMensaje({ tipo: "success", texto: `✅ ${tipo} registrada correctamente` });
    setPlacaInput("");
    setResidenteEncontrado(null);
  };

  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Accesos</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>Registro de ingresos y salidas del día</p>
      </div>

      {/* SECCIÓN DE VERIFICACIÓN */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "2rem" }}>
        <h5 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiTruck size={20} />
          Verificar Vehículo
        </h5>

        {/* INPUT Y BOTÓN */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Ej: ABC-123"
            value={placaInput}
            onChange={(e) => setPlacaInput(e.target.value.toUpperCase())}
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              fontSize: "1.1rem",
              letterSpacing: "1px",
              outline: "none"
            }}
          />
          <button
            onClick={verificarPlaca}
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            <FiSearch size={18} />
            Verificar
          </button>
        </div>

        {/* MENSAJE */}
        {mensaje && (
          <div style={{
            padding: "1rem",
            borderRadius: "10px",
            marginBottom: "1rem",
            backgroundColor: mensaje.tipo === "success" ? "#f0fdf4" : mensaje.tipo === "danger" ? "#fef2f2" : "#fffbeb",
            border: `1px solid ${mensaje.tipo === "success" ? "#10b981" : mensaje.tipo === "danger" ? "#ef4444" : "#f59e0b"}`,
            color: mensaje.tipo === "success" ? "#166534" : mensaje.tipo === "danger" ? "#991b1b" : "#92400e"
          }}>
            {mensaje.texto}
          </div>
        )}

        {/* INFO DEL RESIDENTE */}
        {residenteEncontrado && (
          <div style={{
            padding: "1.5rem",
            borderRadius: "12px",
            backgroundColor: "#f0fdf4",
            border: "1px solid #10b981",
            marginBottom: "1rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h6 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiUser size={18} />
                  {residenteEncontrado.nombres} {residenteEncontrado.apellidos}
                </h6>
                <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#64748b" }}>DNI: {residenteEncontrado.dni}</p>
                <p style={{ margin: "0.25rem 0", fontSize: "0.9rem", color: "#64748b" }}>
                  Vehículo: {residenteEncontrado.vehicle?.modelo} - {residenteEncontrado.vehicle?.color}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => registrarAcceso("ENTRADA")}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#10b981",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <FiLogIn size={16} />
                  Entrada
                </button>
                <button
                  onClick={() => registrarAcceso("SALIDA")}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <FiLogOut size={16} />
                  Salida
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TABLA DE ACCESOS */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h5 style={{ fontWeight: 700, color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiClock size={20} />
            Accesos de Hoy
          </h5>
          <span style={{
            padding: "0.35rem 0.75rem",
            backgroundColor: "#f1f5f9",
            borderRadius: "20px",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#64748b"
          }}>
            {accesosHoy.length} registros
          </span>
        </div>

        {accesosHoy.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 2rem", color: "#94a3b8" }}>
            <FiActivity size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
            <p style={{ fontSize: "1rem", fontWeight: 500 }}>Sin accesos registrados hoy</p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>Los registros aparecerán aquí</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Hora</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Placa</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Tipo</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Residente/Visitante</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {accesosHoy.map((acceso) => (
                  <tr key={acceso.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
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