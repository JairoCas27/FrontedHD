import { useState } from "react";
import {
  FiActivity, FiSearch, FiLogIn, FiLogOut,
  FiClock, FiUser, FiTruck, FiCheckCircle, FiEdit3,
} from "react-icons/fi";
import { useSecurityAccess } from "../../hooks/useSecurityAccess";

const VERDE = "#10b981";
const VERDE_OSCURO = "#059669";
const ROJO = "#ef4444";
const BORDE = "#e2e8f0";
const TEXTO = "#1e293b";
const TEXTO_SUAVE = "#64748b";
const FONDO = "#f8fafc";

const estiloLabel = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  color: "#475569",
  marginBottom: "0.35rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const estiloInput = {
  width: "100%",
  padding: "0.7rem 0.85rem",
  borderRadius: "10px",
  border: `1.5px solid ${BORDE}`,
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
  background: "#f8fafc",
  color: TEXTO,
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
};

const estiloBoton = (color, disabled) => ({
  padding: "0.75rem 1.4rem",
  backgroundColor: disabled ? "#cbd5e1" : color,
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontWeight: 700,
  fontSize: "0.87rem",
  cursor: disabled ? "not-allowed" : "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  transition: "all 0.2s ease",
  boxShadow: disabled ? "none" : `0 4px 12px ${color}33`,
  whiteSpace: "nowrap",
});

const tarjeta = {
  background: "#fff",
  borderRadius: "18px",
  boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
  border: "1px solid #f1f5f9",
};

function formatFecha(str) {
  if (!str) return "—";
  try {
    return new Date(str).toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return str;
  }
}

function CampoSelect({ label, value, onChange, opciones }) {
  return (
    <div>
      <label style={estiloLabel}>{label}</label>
      <select style={estiloInput} value={value} onChange={onChange}>
        {opciones.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function AccesosSeguridad() {
  const [placaInput, setPlacaInput] = useState("");
  const [metodo, setMetodo] = useState("MANUAL");
  const [ocupante, setOcupante] = useState("PROPIETARIO");
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

  const hayAccesoPendiente = !!ultimoLogId;

  const handleVerificar = () => verificarPlaca(placaInput);

  const handleEntrada = async () => {
    const ok = await registrarEntrada({
      placa: placaInput,
      metodo,
      ocupante,
      datosInquilino: ocupante === "INQUILINO" ? datosInquilino : "",
    });
    if (ok) {
      setPlacaInput("");
      setOcupante("PROPIETARIO");
      setDatosInquilino("");
      resetVehiculo();
    }
  };

  const handleSalida = async () => {
    const ok = await registrarSalida();
    if (ok) {
      setPlacaInput("");
      setOcupante("PROPIETARIO");
      setDatosInquilino("");
      resetVehiculo();
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: FONDO, minHeight: "100vh", boxSizing: "border-box" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: TEXTO, margin: 0 }}>Accesos</h1>
        <p style={{ color: TEXTO_SUAVE, marginTop: "0.25rem", fontSize: "0.95rem" }}>
          Registro de ingresos y salidas del condominio
        </p>
      </div>

      <div style={{ ...tarjeta, padding: "2rem", marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FiTruck size={19} color={VERDE_OSCURO} />
          </div>
          <h5 style={{ fontWeight: 800, color: TEXTO, margin: 0, fontSize: "1.05rem" }}>Verificar vehículo</h5>
        </div>

        <div style={{ display: "flex", gap: "0.9rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Ej: ABC-123"
            value={placaInput}
            onChange={(e) => setPlacaInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleVerificar()}
            style={{
              flex: 1, minWidth: "220px", padding: "0.85rem 1.1rem",
              borderRadius: "12px", border: `2px solid ${BORDE}`,
              fontSize: "1.15rem", letterSpacing: "3px", outline: "none",
              background: "#f8fafc", color: TEXTO, fontWeight: 800,
              textAlign: "center",
            }}
          />
          <button
            onClick={handleVerificar}
            disabled={loadingVerify}
            style={estiloBoton(VERDE, loadingVerify)}
          >
            <FiSearch size={18} />
            {loadingVerify ? "Verificando..." : "Verificar"}
          </button>
        </div>

        {vehiculoEncontrado && (
          <div style={{
            padding: "1.4rem 1.6rem", borderRadius: "14px",
            backgroundColor: "#f0fdf4", border: "1px solid #86efac",
            marginBottom: "1.75rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.9rem" }}>
              <FiCheckCircle size={18} color={VERDE_OSCURO} />
              <span style={{ fontWeight: 800, color: "#166534", fontSize: "0.95rem" }}>
                {vehiculoEncontrado.nombrePropietario}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.6rem", fontSize: "0.85rem", color: "#166534" }}>
              <span><b>Placa:</b> {vehiculoEncontrado.placa}</span>
              <span><b>Marca:</b> {vehiculoEncontrado.marca}</span>
              <span><b>Modelo:</b> {vehiculoEncontrado.modelo}</span>
              <span><b>Color:</b> {vehiculoEncontrado.color}</span>
              <span><b>Tipo:</b> {vehiculoEncontrado.tipo}</span>
            </div>
          </div>
        )}

        <div style={{ borderTop: `1px solid ${BORDE}`, paddingTop: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.1rem" }}>
            <FiEdit3 size={16} color={TEXTO_SUAVE} />
            <span style={{ fontWeight: 700, color: TEXTO, fontSize: "0.9rem" }}>Datos del acceso</span>
          </div>

          <div style={{ display: "flex", gap: "1.1rem", flexWrap: "wrap", alignItems: "flex-end", marginBottom: ocupante === "INQUILINO" ? "1.1rem" : 0 }}>
            <div style={{ flex: "1 1 180px", minWidth: "180px" }}>
              <CampoSelect
                label="Método"
                value={metodo}
                onChange={(e) => setMetodo(e.target.value)}
                opciones={[
                  { value: "MANUAL", label: "Manual" },
                  { value: "OCR", label: "OCR" },
                ]}
              />
            </div>
            <div style={{ flex: "1 1 180px", minWidth: "180px" }}>
              <CampoSelect
                label="Tipo de ocupante"
                value={ocupante}
                onChange={(e) => setOcupante(e.target.value)}
                opciones={[
                  { value: "PROPIETARIO", label: "Propietario" },
                  { value: "INQUILINO", label: "Inquilino" },
                ]}
              />
            </div>
            <button
              onClick={handleEntrada}
              disabled={loadingAcceso || !placaInput.trim() || hayAccesoPendiente}
              style={{ ...estiloBoton(VERDE, loadingAcceso || !placaInput.trim() || hayAccesoPendiente), flex: "1 1 170px" }}
            >
              <FiLogIn size={17} />
              {loadingAcceso ? "Registrando..." : "Registrar entrada"}
            </button>
            <button
              onClick={handleSalida}
              disabled={loadingAcceso || !hayAccesoPendiente}
              style={{ ...estiloBoton(ROJO, loadingAcceso || !hayAccesoPendiente), flex: "1 1 170px" }}
            >
              <FiLogOut size={17} />
              {loadingAcceso ? "Registrando..." : "Registrar salida"}
            </button>
          </div>

          {ocupante === "INQUILINO" && (
            <div style={{ maxWidth: "320px" }}>
              <label style={estiloLabel}>Datos del inquilino</label>
              <input
                type="text"
                style={estiloInput}
                placeholder="Nombre del inquilino"
                value={datosInquilino}
                onChange={(e) => setDatosInquilino(e.target.value)}
              />
            </div>
          )}

          {hayAccesoPendiente && (
            <p style={{ marginTop: "1rem", marginBottom: 0, fontSize: "0.8rem", color: "#b45309", background: "#fffbeb", padding: "0.6rem 0.9rem", borderRadius: "8px", border: "1px solid #fde68a" }}>
              Hay un acceso pendiente de salida. Registra la salida antes de habilitar una nueva entrada.
            </p>
          )}
        </div>
      </div>

      <div style={{ ...tarjeta, padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiClock size={18} color={TEXTO_SUAVE} />
            </div>
            <h5 style={{ fontWeight: 800, color: TEXTO, margin: 0, fontSize: "1.05rem" }}>Accesos de esta sesión</h5>
          </div>
          <span style={{
            padding: "0.4rem 0.9rem", backgroundColor: "#f1f5f9",
            borderRadius: "20px", fontSize: "0.82rem", fontWeight: 700, color: TEXTO_SUAVE,
          }}>
            {accesos.length} registros
          </span>
        </div>

        {accesos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3.5rem 2rem", color: "#94a3b8" }}>
            <FiActivity size={42} style={{ marginBottom: "1rem", opacity: 0.3, display: "block", margin: "0 auto 1rem" }} />
            <p style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 0.3rem", color: "#64748b" }}>Sin accesos registrados</p>
            <p style={{ fontSize: "0.85rem", margin: 0 }}>Los registros aparecerán aquí</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: FONDO }}>
                  {["Placa", "Ocupante", "Método", "Entrada", "Salida", "Estado"].map((h) => (
                    <th key={h} style={{ padding: "0.9rem 1rem", textAlign: "center", fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accesos.map((acceso) => {
                  const enCurso = !acceso.fechaSalida;
                  return (
                    <tr key={acceso.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "0.9rem 1rem", fontFamily: "monospace", fontWeight: 700, letterSpacing: "1px", color: "#334155", textAlign: "center" }}>
                        {acceso.placa}
                      </td>
                      <td style={{ padding: "0.9rem 1rem", color: TEXTO_SUAVE, fontSize: "0.9rem", textAlign: "center" }}>
                        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "0.15rem" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: 600, color: TEXTO }}>
                            <FiUser size={14} color="#94a3b8" />
                            {acceso.ocupante}
                          </span>
                          {acceso.datosInquilino && (
                            <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{acceso.datosInquilino}</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "0.9rem 1rem", textAlign: "center" }}>
                        <span style={{
                          padding: "0.32rem 0.75rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700,
                          backgroundColor: "#e0e7ff", color: "#3730a3",
                        }}>
                          {acceso.metodo}
                        </span>
                      </td>
                      <td style={{ padding: "0.9rem 1rem", fontSize: "0.85rem", color: TEXTO, textAlign: "center" }}>
                        {formatFecha(acceso.fechaEntrada)}
                      </td>
                      <td style={{ padding: "0.9rem 1rem", fontSize: "0.85rem", color: TEXTO, textAlign: "center" }}>
                        {formatFecha(acceso.fechaSalida)}
                      </td>
                      <td style={{ padding: "0.9rem 1rem", textAlign: "center" }}>
                        <span style={{
                          padding: "0.32rem 0.75rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700,
                          backgroundColor: enCurso ? "#dcfce7" : "#fee2e2",
                          color: enCurso ? "#166534" : "#991b1b",
                          display: "inline-flex", alignItems: "center", gap: "0.35rem",
                        }}>
                          {enCurso ? <FiLogIn size={12} /> : <FiLogOut size={12} />}
                          {enCurso ? "En el condominio" : "Salió"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}