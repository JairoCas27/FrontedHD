import { useState } from "react";
import { Car, MapPin, CheckCircle, XCircle, Clock } from "lucide-react";

export default function MisEstacionamientos() {

  const [espacios] = useState([
    { codigo: "A-101", estado: "disponible", vehiculo: null },
    { codigo: "A-102", estado: "ocupado", vehiculo: "ABC-123" },
    { codigo: "B-201", estado: "reservado", vehiculo: "XYZ-789" }
  ]);

  const colores = {
    naranjaPrincipal: "#f97316",
    naranjaOscuro: "#ea580c",
    verde: "#22c55e",
    rojo: "#ef4444",
    amarillo: "#facc15",
    slate: "#1e293b"
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
    <div style={{ fontFamily: "system-ui", padding: "1rem" }}>

      <h1 style={{ color: colores.slate }}>Mis Estacionamientos</h1>

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
                padding: "1.5rem",
                color: "white"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <MapPin />
                <h3>{e.codigo}</h3>
              </div>

              <div style={{
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                {estado.icon}
                <span>{estado.texto}</span>
              </div>

              <div style={{ marginTop: "10px" }}>
                <Car size={16} />
                <span style={{ marginLeft: "6px" }}>
                  {e.vehiculo || "Sin vehículo"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}