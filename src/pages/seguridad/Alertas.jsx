import { useState, useEffect } from "react";
import { FiActivity, FiAlertTriangle, FiCheckCircle, FiMapPin, FiClock, FiShield } from "react-icons/fi";

export default function Alertas() {
  const [formData, setFormData] = useState({
    tipo: "ACCESO_NO_AUTORIZADO",
    descripcion: "",
    ubicacion: ""
  });
  const [mensaje, setMensaje] = useState(null);
  const [alertas, setAlertas] = useState([]);

  // Cargar alertas al iniciar
  useEffect(() => {
    const alertasGuardadas = JSON.parse(localStorage.getItem("alertasSeguridad") || "[]");
    setAlertas(alertasGuardadas);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const registrarAlerta = (e) => {
    e.preventDefault();
    
    if (!formData.descripcion || !formData.ubicacion) {
      setMensaje({ tipo: "warning", texto: "Complete descripción y ubicación" });
      return;
    }

    const nuevaAlerta = {
      id: Date.now(),
      ...formData,
      fecha: new Date().toISOString(),
      hora: new Date().toLocaleTimeString(),
      estado: "ACTIVA"
    };

    const alertasGuardadas = JSON.parse(localStorage.getItem("alertasSeguridad") || "[]");
    const nuevasAlertas = [nuevaAlerta, ...alertasGuardadas];
    
    localStorage.setItem("alertasSeguridad", JSON.stringify(nuevasAlertas));
    setAlertas(nuevasAlertas);
    
    setMensaje({ tipo: "success", texto: "✅ Alerta registrada correctamente" });
    setFormData({ tipo: "ACCESO_NO_AUTORIZADO", descripcion: "", ubicacion: "" });
  };

  const resolverAlerta = (id) => {
    const alertasGuardadas = JSON.parse(localStorage.getItem("alertasSeguridad") || "[]");
    const alertasActualizadas = alertasGuardadas.map(a => 
      a.id === id ? { ...a, estado: "RESUELTA" } : a
    );
    
    localStorage.setItem("alertasSeguridad", JSON.stringify(alertasActualizadas));
    setAlertas(alertasActualizadas);
    
    setMensaje({ tipo: "success", texto: "✅ Alerta marcada como resuelta" });
  };

  const getTipoColor = (tipo) => {
    const colores = {
      ACCESO_NO_AUTORIZADO: "#ef4444",
      VEHICULO_DANADO: "#f59e0b",
      PERSONA_SOSPECHOSA: "#8b5cf6",
      EMERGENCIA_MEDICA: "#ec4899",
      OTRO: "#64748b"
    };
    return colores[tipo] || "#64748b";
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      ACCESO_NO_AUTORIZADO: "Acceso No Autorizado",
      VEHICULO_DANADO: "Vehículo Dañado",
      PERSONA_SOSPECHOSA: "Persona Sospechosa",
      EMERGENCIA_MEDICA: "Emergencia Médica",
      OTRO: "Otro"
    };
    return labels[tipo] || tipo;
  };

  const alertasActivas = alertas.filter(a => a.estado === "ACTIVA");
  const alertasResueltas = alertas.filter(a => a.estado === "RESUELTA");

  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Alertas</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>Registro de incidentes y alertas de seguridad</p>
      </div>

      {/* FORMULARIO DE NUEVA ALERTA */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "2rem" }}>
        <h5 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiAlertTriangle size={20} />
          Nueva Alerta
        </h5>

        <form onSubmit={registrarAlerta}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Tipo de Alerta</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
              >
                <option value="ACCESO_NO_AUTORIZADO">Acceso No Autorizado</option>
                <option value="VEHICULO_DANADO">Vehículo Dañado</option>
                <option value="PERSONA_SOSPECHOSA">Persona Sospechosa</option>
                <option value="EMERGENCIA_MEDICA">Emergencia Médica</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Ubicación</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiMapPin size={16} color="#94a3b8" />
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  placeholder="Entrada principal, Sótano A, etc."
                  style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
                />
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describa el incidente..."
              rows="3"
              style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", resize: "vertical" }}
            />
          </div>

          {mensaje && (
            <div style={{
              padding: "1rem",
              borderRadius: "10px",
              marginBottom: "1rem",
              backgroundColor: mensaje.tipo === "success" ? "#f0fdf4" : "#fffbeb",
              border: `1px solid ${mensaje.tipo === "success" ? "#10b981" : "#f59e0b"}`,
              color: mensaje.tipo === "success" ? "#166534" : "#92400e"
            }}>
              {mensaje.texto}
            </div>
          )}

          <button
            type="submit"
            style={{
              padding: "0.75rem 2rem",
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
            <FiAlertTriangle size={18} />
            Registrar Alerta
          </button>
        </form>
      </div>

      {/* ALERTAS ACTIVAS */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h5 style={{ fontWeight: 700, color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiShield size={20} />
            Alertas Activas
          </h5>
          <span style={{
            padding: "0.35rem 0.75rem",
            backgroundColor: "#fef2f2",
            borderRadius: "20px",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#ef4444"
          }}>
            {alertasActivas.length} activas
          </span>
        </div>

        {alertasActivas.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
            <FiCheckCircle size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
            <p style={{ fontSize: "1rem", fontWeight: 500 }}>No hay alertas activas</p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>Todas las alertas han sido resueltas</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {alertasActivas.map((alerta) => (
              <div key={alerta.id} style={{
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                borderLeft: `4px solid ${getTipoColor(alerta.tipo)}`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <span style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        backgroundColor: getTipoColor(alerta.tipo) + "20",
                        color: getTipoColor(alerta.tipo)
                      }}>
                        {getTipoLabel(alerta.tipo)}
                      </span>
                      <span style={{ fontSize: "0.85rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <FiClock size={12} />
                        {alerta.hora}
                      </span>
                    </div>
                    <p style={{ margin: "0.5rem 0", color: "#1e293b", fontWeight: 600 }}>{alerta.descripcion}</p>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <FiMapPin size={14} />
                      {alerta.ubicacion}
                    </p>
                  </div>
                  <button
                    onClick={() => resolverAlerta(alerta.id)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#10b981",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      whiteSpace: "nowrap"
                    }}
                  >
                    <FiCheckCircle size={14} />
                    Resolver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ALERTAS RESUELTAS */}
      {alertasResueltas.length > 0 && (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h5 style={{ fontWeight: 700, color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiCheckCircle size={20} />
              Alertas Resueltas
            </h5>
            <span style={{
              padding: "0.35rem 0.75rem",
              backgroundColor: "#f0fdf4",
              borderRadius: "20px",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#10b981"
            }}>
              {alertasResueltas.length} resueltas
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {alertasResueltas.map((alerta) => (
              <div key={alerta.id} style={{
                padding: "1.5rem",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                borderLeft: "4px solid #10b981",
                opacity: 0.7
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    backgroundColor: "#f0fdf4",
                    color: "#10b981"
                  }}>
                    RESUELTA
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <FiClock size={12} />
                    {alerta.hora}
                  </span>
                </div>
                <p style={{ margin: "0.5rem 0", color: "#1e293b", fontWeight: 600 }}>{alerta.descripcion}</p>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <FiMapPin size={14} />
                  {alerta.ubicacion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}