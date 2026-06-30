import { useState } from "react";
import {
  FiActivity, FiSearch, FiLogIn, FiLogOut,
  FiClock, FiUser, FiTruck, FiCheckCircle,
} from "react-icons/fi";
import { useSecurityAccess } from "../../hooks/useSecurityAccess";

const estiloLabel = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  color: "#475569",
  marginBottom: "0.25rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const estiloInput = {
  width: "100%",
  padding: "0.65rem 0.75rem",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
  background: "#f8fafc",
  color: "#1e293b",
};

const estiloBoton = (color, disabled) => ({
  padding: "0.75rem 1.5rem",
  backgroundColor: disabled ? "#cbd5e1" : color,
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontWeight: 700,
  fontSize: "0.9rem",
  cursor: disabled ? "not-allowed" : "pointer",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  transition: "all 0.2s ease",
});

export default function AccesosSeguridad() {
  const [placaInput, setPlacaInput] = useState("");
  const [metodo, setMetodo] = useState("MANUAL");
  const [ocupante, setOcupante] = useState("");
  const [datosInquilino, setDatosInquilino] = useState("");

  const {
    vehiculoEncontrado,
    loadingVerify,
    loadingAcceso,
    ultimoLogId,
    accesos,
    verificarPlaca,
    registrarEntrada,
    registrarSalida,
    resetVehiculo,
  } = useSecurityAccess();

  const handleVerificar = () => verificarPlaca(placaInput);

  const handleEntrada = async () => {
    const ok = await registrarEntrada({ placa: placaInput, metodo, ocupante, datosInquilino });
    if (ok) {
      setPlacaInput("");
      setOcupante("");
      setDatosInquilino("");
      resetVehiculo();
    }
  };

  const handleSalida = async () => {
    const ok = await registrarSalida(placaInput);
    if (ok) {
      setPlacaInput("");
      setOcupante("");
      setDatosInquilino("");
      resetVehiculo();
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", boxSizing: "border-box" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Accesos</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
          Registro de ingresos y salidas del condominio
        </p>
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "2rem" }}>
        <h5 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", margin: "0 0 1.5rem" }}>
          <FiTruck size={20} color="#10b981" />
          Verificar Vehículo
        </h5>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Ej: ABC-123"
            value={placaInput}
            onChange={(e) => setPlacaInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleVerificar()}
            style={{
              flex: 1, minWidth: "200px", padding: "0.75rem 1rem",
              borderRadius: "10px", border: "1px solid #e2e8f0",
              fontSize: "1.1rem", letterSpacing: "2px", outline: "none",
              background: "#f8fafc", color: "#1e293b", fontWeight: 700,
            }}
          />
          <button
            onClick={handleVerificar}
            disabled={loadingVerify}
            style={estiloBoton("#10b981", loadingVerify)}
          >
            <FiSearch size={18} />
            {loadingVerify ? "Verificando..." : "Verificar"}
          </button>
        </div>

        {vehiculoEncontrado && (
          <div style={{
            padding: "1.25rem 1.5rem", borderRadius: "12px",
            backgroundColor: "#f0fdf4", border: "1px solid #86efac",
            marginBottom: "1.5rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <FiCheckCircle size={18} color="#16a34a" />
              <span style={{ fontWeight: 700, color: "#166534", fontSize: "0.95rem" }}>
                {vehiculoEncontrado.nombrePropietario}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.5rem", fontSize: "0.85rem", color: "#475569" }}>
              <span><b>Placa:</b> {vehiculoEncontrado.placa}</span>
              <span><b>Marca:</b> {vehiculoEncontrado.marca}</span>
              <span><b>Modelo:</b> {vehiculoEncontrado.modelo}</span>
              <span><b>Color:</b> {vehiculoEncontrado.color}</span>
              <span><b>Tipo:</b> {vehiculoEncontrado.tipo}</span>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <div>
            <label style={estiloLabel}>Método</label>
            <select style={estiloInput} value={metodo} onChange={(e) => setMetodo(e.target.value)}>
              <option value="MANUAL">Manual</option>
              <option value="QR">QR</option>
              <option value="TARJETA">Tarjeta</option>
            </select>
          </div>
          <div>
            <label style={estiloLabel}>Ocupante</label>
            <input
              type="text"
              style={estiloInput}
              placeholder="Nombre del ocupante"
              value={ocupante}
              onChange={(e) => setOcupante(e.target.value)}
            />
          </div>
          <div>
            <label style={estiloLabel}>Datos Inquilino (opcional)</label>
            <input
              type="text"
              style={estiloInput}
              placeholder="DNI o nombre"
              value={datosInquilino}
              onChange={(e) => setDatosInquilino(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            onClick={handleEntrada}
            disabled={loadingAcceso || !placaInput.trim()}
            style={estiloBoton("#10b981", loadingAcceso || !placaInput.trim())}
          >
            <FiLogIn size={16} />
            {loadingAcceso ? "Registrando..." : "Registrar Entrada"}
          </button>
          <button
            onClick={handleSalida}
            disabled={loadingAcceso || !ultimoLogId}
            style={estiloBoton("#ef4444", loadingAcceso || !ultimoLogId)}
          >
            <FiLogOut size={16} />
            {loadingAcceso ? "Registrando..." : "Registrar Salida"}
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h5 style={{ fontWeight: 700, color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiClock size={20} color="#64748b" />
            Accesos de esta sesión
          </h5>
          <span style={{
            padding: "0.35rem 0.75rem", backgroundColor: "#f1f5f9",
            borderRadius: "20px", fontSize: "0.85rem", fontWeight: 600, color: "#64748b",
          }}>
            {accesos.length} registros
          </span>
        </div>

        {accesos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 2rem", color: "#94a3b8" }}>
            <FiActivity size={40} style={{ marginBottom: "1rem", opacity: 0.35, display: "block", margin: "0 auto 1rem" }} />
            <p style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 0.25rem" }}>Sin accesos registrados</p>
            <p style={{ fontSize: "0.85rem", margin: 0 }}>Los registros aparecerán aquí</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  {["Hora", "Placa", "Tipo", "Ocupante", "Estado"].map((h) => (
                    <th key={h} style={{ padding: "0.85rem 1rem", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accesos.map((acceso) => (
                  <tr key={acceso.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "0.85rem 1rem", fontWeight: 700, color: "#1e293b", fontSize: "0.9rem" }}>{acceso.hora}</td>
                    <td style={{ padding: "0.85rem 1rem", fontFamily: "monospace", fontWeight: 700, letterSpacing: "1px", color: "#334155" }}>{acceso.placa}</td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span style={{
                        padding: "0.3rem 0.7rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700,
                        backgroundColor: acceso.tipo === "ENTRADA" ? "#dcfce7" : "#fee2e2",
                        color: acceso.tipo === "ENTRADA" ? "#166534" : "#991b1b",
                        display: "inline-flex", alignItems: "center", gap: "0.3rem",
                      }}>
                        {acceso.tipo === "ENTRADA" ? <FiLogIn size={12} /> : <FiLogOut size={12} />}
                        {acceso.tipo}
                      </span>
                    </td>
                    <td style={{ padding: "0.85rem 1rem", color: "#64748b", fontSize: "0.9rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <FiUser size={14} color="#94a3b8" />
                        {acceso.ocupante}
                      </span>
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span style={{
                        padding: "0.3rem 0.7rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700,
                        backgroundColor: acceso.esResidente ? "#dbeafe" : "#fef3c7",
                        color: acceso.esResidente ? "#1e40af" : "#92400e",
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