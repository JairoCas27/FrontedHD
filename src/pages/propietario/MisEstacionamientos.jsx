import { useState } from "react";
import { Car, MapPin, CheckCircle, XCircle, Clock } from "lucide-react";

export default function MisEstacionamientos() {

  const [espacios] = useState([
    { codigo: "A-101", estado: "disponible", vehiculo: null },
    { codigo: "A-102", estado: "ocupado", vehiculo: "ABC-123" },
    { codigo: "B-201", estado: "reservado", vehiculo: "XYZ-789" },
    { codigo: "C-305", estado: "disponible", vehiculo: null }
  ]);

  const colores = {
    naranjaPrincipal: "#f97316",
    naranjaOscuro: "#ea580c",
    verde: "#22c55e",
    rojo: "#ef4444",
    amarillo: "#facc15",
    slate: "#1e293b",
    lightSlate: "#64748b"
  };

  const estadoInfo = (estado) => {
    switch (estado) {
      case "disponible":
        return { color: colores.verde, icon: <CheckCircle size={18} />, texto: "Disponible" };
      case "ocupado":
        return { color: colores.rojo, icon: <XCircle size={18} />, texto: "Ocupado" };
      case "reservado":
        return { color: colores.amarillo, icon: <Clock size={18} />, texto: "Reservado" };
      default:
        return {};
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "1rem" }}>

      {/* HEADER */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: colores.slate, margin: 0 }}>
          Mis Estacionamientos
        </h1>
        <p style={{ color: colores.lightSlate, margin: "4px 0 0 0" }}>
          Consulta el estado de tus espacios asignados
        </p>
      </div>

      {/* GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem"
      }}>
        {espacios.map((e, index) => {
          const estado = estadoInfo(e.estado);

          return (
            <div key={index}
              style={{
                background: `linear-gradient(135deg, ${colores.naranjaPrincipal}, ${colores.naranjaOscuro})`,
                borderRadius: "24px",
                padding: "1.8rem",
                color: "white",
                transition: "0.3s",
                position: "relative"
              }}
            >

              {/* HEADER CARD */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.2rem" }}>
                <div style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "10px",
                  borderRadius: "12px"
                }}>
                  <MapPin size={28} />
                </div>

                <div>
                  <h3 style={{ margin: 0 }}>{e.codigo}</h3>
                  <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.8 }}>
                    ESPACIO DE PARQUEO
                  </p>
                </div>
              </div>

              {/* ESTADO */}
              <div style={{
                background: "rgba(0,0,0,0.15)",
                padding: "0.8rem",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "1rem"
              }}>
                <div style={{
                  background: estado.color,
                  padding: "6px",
                  borderRadius: "8px",
                  display: "flex"
                }}>
                  {estado.icon}
                </div>

                <span style={{ fontWeight: 600 }}>
                  {estado.texto}
                </span>
              </div>

              {/* VEHÍCULO */}
              <div style={{
                background: "rgba(255,255,255,0.1)",
                padding: "1rem",
                borderRadius: "14px",
                marginBottom: "1rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Car size={18} />
                  <span style={{ fontSize: "0.9rem" }}>
                    {e.vehiculo ? `Vehículo: ${e.vehiculo}` : "Sin vehículo asignado"}
                  </span>
                </div>
              </div>

              {/* BOTÓN */}
              <button
                onMouseEnter={(ev) => {
                  ev.currentTarget.style.transform = "translateY(-2px)";
                  ev.currentTarget.style.boxShadow = "0 8px 15px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(ev) => {
                  ev.currentTarget.style.transform = "translateY(0)";
                  ev.currentTarget.style.boxShadow = "none";
                }}
                style={{
                  width: "100%",
                  background: "white",
                  color: colores.naranjaOscuro,
                  border: "none",
                  padding: "0.7rem",
                  borderRadius: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "0.2s"
                }}
              >
                Ver detalle
              </button>

            </div>
          );
        })}
      </div>
    </div>
  );
}