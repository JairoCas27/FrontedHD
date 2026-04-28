import { useState } from "react";
import { Bell, Car, LogIn, LogOut, AlertTriangle } from "lucide-react";

export default function MisNotificaciones() {
  const getNotificaciones = () => {
    const data = localStorage.getItem("notificaciones");
    return data ? JSON.parse(data) : [
      {
        tipo: "ingreso",
        mensaje: "Vehículo ABC-123 ingresó al estacionamiento",
        fecha: "Hace 5 minutos"
      },
      {
        tipo: "salida",
        mensaje: "Vehículo XYZ-789 salió del estacionamiento",
        fecha: "Hace 20 minutos"
      },
      {
        tipo: "alerta",
        mensaje: "Intento de acceso con placa no registrada",
        fecha: "Hace 1 hora"
      }
    ];
  };

  const [notificaciones] = useState(getNotificaciones());
  const [filtro, setFiltro] = useState("todas");

  const colores = {
    ingreso: "#22c55e",
    salida: "#3b82f6",
    alerta: "#ef4444",
    fondo: "#f8fafc",
    texto: "#1e293b"
  };

  const filtrar = () => {
    if (filtro === "todas") return notificaciones;
    return notificaciones.filter(n => n.tipo === filtro);
  };

  const icono = (tipo) => {
    switch (tipo) {
      case "ingreso": return <LogIn size={20} />;
      case "salida": return <LogOut size={20} />;
      case "alerta": return <AlertTriangle size={20} />;
      default: return <Bell size={20} />;
    }
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "600px", margin: "0 auto", fontFamily: "system-ui" }}>
      
      <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Notificaciones</h1>
      <p style={{ color: "#64748b" }}>Actividad de tu estacionamiento</p>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "8px", margin: "1rem 0" }}>
        {["todas", "ingreso", "salida", "alerta"].map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            style={{
              padding: "8px 12px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              background: filtro === f ? "#f97316" : "#e2e8f0",
              color: filtro === f ? "white" : "#1e293b",
              fontWeight: 600
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtrar().map((n, i) => (
          <div
            key={i}
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "16px",
              display: "flex",
              gap: "12px",
              alignItems: "center",
              borderLeft: `5px solid ${colores[n.tipo]}`,
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
            }}
          >
            <div style={{
              background: colores[n.tipo],
              color: "white",
              padding: "10px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {icono(n.tipo)}
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 600, color: colores.texto }}>
                {n.mensaje}
              </p>
              <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                {n.fecha}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}