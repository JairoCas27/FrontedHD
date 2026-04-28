import { useState } from "react";

export default function MisEstacionamientos() {

  const [espacios] = useState([
    { codigo: "A-101", estado: "disponible", vehiculo: null },
    { codigo: "A-102", estado: "ocupado", vehiculo: "ABC-123" },
    { codigo: "B-201", estado: "reservado", vehiculo: "XYZ-789" }
  ]);

  const colores = {
    naranjaPrincipal: "#f97316",
    naranjaOscuro: "#ea580c",
    slate: "#1e293b",
    lightSlate: "#64748b"
  };

  return (
    <div style={{ fontFamily: "system-ui", padding: "1rem" }}>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: colores.slate }}>Mis Estacionamientos</h1>
        <p style={{ color: colores.lightSlate }}>
          Consulta tus espacios asignados
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1rem"
      }}>
        {espacios.map((e, index) => (
          <div key={index}
            style={{
              background: `linear-gradient(135deg, ${colores.naranjaPrincipal}, ${colores.naranjaOscuro})`,
              borderRadius: "20px",
              padding: "1.5rem",
              color: "white"
            }}
          >
            <h3>{e.codigo}</h3>
            <p>Estado: {e.estado}</p>
            <p>{e.vehiculo ? `Vehículo: ${e.vehiculo}` : "Sin vehículo"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}