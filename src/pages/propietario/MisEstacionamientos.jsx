import { useState } from "react";
import { Car, MapPin, CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";

export default function MisEstacionamientos() {
  const [espacios] = useState([
    { codigo: "A-101", estado: "disponible", vehiculo: null },
    { codigo: "A-102", estado: "ocupado", vehiculo: "ABC-123" },
    { codigo: "B-201", estado: "reservado", vehiculo: "XYZ-789" },
    { codigo: "C-305", estado: "disponible", vehiculo: null }
  ]);

  const colores = {
    naranja: "#f97316",
    naranjaSuave: "#fff7ed", // Fondo de la card para que no sea blanca
    naranjaBorde: "#ffedd5", // Borde sutil
    verde: "#22c55e",
    rojo: "#ef4444",
    amarillo: "#facc15",
    slate: "#1e293b",
    lightSlate: "#64748b",
    bg: "#f8fafc"
  };

  const estadoInfo = (estado) => {
    switch (estado) {
      case "disponible":
        return { color: colores.verde, icon: <CheckCircle size={14} />, texto: "Disponible" };
      case "ocupado":
        return { color: colores.rojo, icon: <XCircle size={14} />, texto: "En uso" };
      case "reservado":
        return { color: colores.amarillo, icon: <Clock size={14} />, texto: "Reservado" };
      default: return {};
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", backgroundColor: colores.bg, minHeight: "100vh" }}>

      {/* HEADER CENTRADO SIN BARRITA */}
      <div style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: colores.slate, margin: 0 }}>
          Mis Estacionamientos
        </h1>
        <p style={{ color: colores.lightSlate, margin: "8px 0 0 0", fontSize: "1rem" }}>
          Consulta el estado de tus espacios asignados
        </p>
      </div>

      {/* GRID DE TARJETAS CON FONDO NARANJA SUAVE */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "1.5rem",
        maxWidth: "1100px",
        margin: "0 auto"
      }}>
        {espacios.map((e, index) => {
          const info = estadoInfo(e.estado);

          return (
            <div key={index}
              style={{
                background: colores.naranjaSuave, // Fondo diferenciado del blanco
                borderRadius: "28px",
                padding: "2rem",
                border: `1px solid ${colores.naranjaBorde}`,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
                position: "relative"
              }}
              onMouseEnter={(ev) => {
                ev.currentTarget.style.transform = "translateY(-5px)";
                ev.currentTarget.style.borderColor = colores.naranja;
              }}
              onMouseLeave={(ev) => {
                ev.currentTarget.style.transform = "translateY(0)";
                ev.currentTarget.style.borderColor = colores.naranjaBorde;
              }}
            >
              
              {/* CODIGO Y ESTADO */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ background: colores.naranja, color: "white", padding: "8px", borderRadius: "12px" }}>
                    <MapPin size={20} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: colores.slate }}>{e.codigo}</h3>
                </div>
                
                <div style={{
                  color: info.color,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  background: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                }}>
                  {info.icon}
                  {info.texto}
                </div>
              </div>

              {/* CONTENEDOR VEHÍCULO */}
              <div style={{ 
                background: "white", 
                padding: "1.2rem", 
                borderRadius: "20px", 
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <div style={{ background: colores.bg, padding: "8px", borderRadius: "10px", color: colores.lightSlate }}>
                  <Car size={20} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.7rem", color: colores.lightSlate, fontWeight: 700, textTransform: "uppercase" }}>Asignado a:</span>
                  <span style={{ fontSize: "1rem", fontWeight: 700, color: colores.slate }}>
                    {e.vehiculo ? e.vehiculo : "Disponible"}
                  </span>
                </div>
              </div>

              {/* BOTÓN CON COLOR SÓLIDO PARA MÁS NARANJA */}
              <button
                style={{
                  width: "100%",
                  background: colores.naranja,
                  color: "white",
                  border: "none",
                  padding: "12px",
                  borderRadius: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: `0 4px 12px rgba(249, 115, 22, 0.2)`
                }}
                onMouseEnter={(ev) => ev.currentTarget.style.background = "#ea580c"}
                onMouseLeave={(ev) => ev.currentTarget.style.background = colores.naranja}
              >
                Ver actividad <ChevronRight size={18} />
              </button>

            </div>
          );
        })}
      </div>
    </div>
  );
}