import { useState, useEffect } from "react";
import { FiActivity, FiUserPlus, FiClock, FiLogOut, FiUsers } from "react-icons/fi";

export default function VisitasSeguridad() {
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    placa: "",
    visitaA: "",
    motivo: ""
  });
  const [mensaje, setMensaje] = useState(null);
  const [visitasActivas, setVisitasActivas] = useState([]);

  // Cargar visitas del día al iniciar
  useEffect(() => {
    const visitasGuardadas = JSON.parse(localStorage.getItem("visitasSeguridad") || "[]");
    const hoy = new Date().toDateString();
    const visitasHoy = visitasGuardadas.filter(v => 
      new Date(v.fechaEntrada).toDateString() === hoy && !v.horaSalida
    );
    setVisitasActivas(visitasHoy);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const registrarVisita = (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.dni || !formData.visitaA) {
      setMensaje({ tipo: "warning", texto: "Complete nombre, DNI y a quién visita" });
      return;
    }

    const nuevaVisita = {
      id: Date.now(),
      ...formData,
      placa: formData.placa.toUpperCase() || "SIN PLACA",
      fechaEntrada: new Date().toISOString(),
      horaEntrada: new Date().toLocaleTimeString(),
      horaSalida: null
    };

    const visitasGuardadas = JSON.parse(localStorage.getItem("visitasSeguridad") || "[]");
    const nuevasVisitas = [nuevaVisita, ...visitasGuardadas];
    
    localStorage.setItem("visitasSeguridad", JSON.stringify(nuevasVisitas));
    
    // Actualizar lista de activas
    const hoy = new Date().toDateString();
    setVisitasActivas(nuevasVisitas.filter(v => 
      new Date(v.fechaEntrada).toDateString() === hoy && !v.horaSalida
    ));
    
    setMensaje({ tipo: "success", texto: "✅ Visita registrada correctamente" });
    setFormData({ nombre: "", dni: "", placa: "", visitaA: "", motivo: "" });
  };

  const marcarSalida = (id) => {
    const visitasGuardadas = JSON.parse(localStorage.getItem("visitasSeguridad") || "[]");
    const visitasActualizadas = visitasGuardadas.map(v => 
      v.id === id ? { ...v, horaSalida: new Date().toLocaleTimeString() } : v
    );
    
    localStorage.setItem("visitasSeguridad", JSON.stringify(visitasActualizadas));
    
    const hoy = new Date().toDateString();
    setVisitasActivas(visitasActualizadas.filter(v => 
      new Date(v.fechaEntrada).toDateString() === hoy && !v.horaSalida
    ));
    
    setMensaje({ tipo: "success", texto: "✅ Salida registrada" });
  };

  return (
    <div>
      {/* HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Visitas</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>Registro de visitantes del condominio</p>
      </div>

      {/* FORMULARIO DE REGISTRO */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: "2rem" }}>
        <h5 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiUserPlus size={20} />
          Nueva Visita
        </h5>

        <form onSubmit={registrarVisita}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ana Hurtado"
                style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>DNI</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="73652148"
                style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Placa (opcional)</label>
              <input
                type="text"
                name="placa"
                value={formData.placa}
                onChange={handleChange}
                placeholder="ABC-123"
                style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Visita a</label>
              <input
                type="text"
                name="visitaA"
                value={formData.visitaA}
                onChange={handleChange}
                placeholder="Departamento 101"
                style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.5rem" }}>Motivo</label>
            <input
              type="text"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              placeholder="Entrega de paquete, visita familiar, etc."
              style={{ width: "100%", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
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
            <FiUserPlus size={18} />
            Registrar Visita
          </button>
        </form>
      </div>

      {/* TABLA DE VISITAS ACTIVAS */}
      <div style={{ background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h5 style={{ fontWeight: 700, color: "#1e293b", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiUsers size={20} />
            Visitas Activas
          </h5>
          <span style={{
            padding: "0.35rem 0.75rem",
            backgroundColor: "#f1f5f9",
            borderRadius: "20px",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#64748b"
          }}>
            {visitasActivas.length} activas
          </span>
        </div>

        {visitasActivas.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 2rem", color: "#94a3b8" }}>
            <FiActivity size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
            <p style={{ fontSize: "1rem", fontWeight: 500 }}>No hay visitas activas</p>
            <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>Las visitas aparecerán aquí</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Hora</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Nombre</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>DNI</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Placa</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Visita a</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {visitasActivas.map((visita) => (
                  <tr key={visita.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#1e293b" }}>{visita.horaEntrada}</td>
                    <td style={{ padding: "1rem", color: "#64748b" }}>{visita.nombre}</td>
                    <td style={{ padding: "1rem", color: "#64748b" }}>{visita.dni}</td>
                    <td style={{ padding: "1rem", color: "#64748b" }}>{visita.placa}</td>
                    <td style={{ padding: "1rem", color: "#64748b" }}>{visita.visitaA}</td>
                    <td style={{ padding: "1rem" }}>
                      <button
                        onClick={() => marcarSalida(visita.id)}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#ef4444",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem"
                        }}
                      >
                        <FiLogOut size={14} />
                        Salida
                      </button>
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