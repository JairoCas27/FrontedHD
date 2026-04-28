import { useState } from "react";

export default function MisEstacionamientos() {

  const [espacios] = useState([
    { codigo: "A-101", estado: "disponible", vehiculo: null },
    { codigo: "A-102", estado: "ocupado", vehiculo: "ABC-123" },
    { codigo: "B-201", estado: "reservado", vehiculo: "XYZ-789" }
  ]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Mis Estacionamientos</h1>

      {espacios.map((e, index) => (
        <div key={index} style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}>
          <p><strong>Código:</strong> {e.codigo}</p>
          <p><strong>Estado:</strong> {e.estado}</p>
          <p><strong>Vehículo:</strong> {e.vehiculo || "Ninguno"}</p>
        </div>
      ))}
    </div>
  );
}