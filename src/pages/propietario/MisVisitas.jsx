import { useState } from "react";
import { Car } from "lucide-react";

export default function PermisosEstacionamiento() {

  const getData = () => {
    const data = localStorage.getItem("permisos");
    return data ? JSON.parse(data) : {
      estacionamiento: "A-1234",
      permisos: []
    };
  };

  const [data] = useState(getData());

  return (
    <div style={{ padding: "1rem" }}>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem" }}>
          Permisos de Estacionamiento
        </h1>
        <p>Gestiona préstamos y accesos temporales</p>
      </div>

      <div style={{
        background: "#f97316",
        borderRadius: "24px",
        padding: "2rem",
        color: "white"
      }}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Car size={40}/>
          <div>
            <h2>{data.estacionamiento}</h2>
            <p>Disponible</p>
          </div>
        </div>
      </div>

    </div>
  );
}