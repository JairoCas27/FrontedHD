import { useState } from "react";
import { Bell, LogIn, LogOut, AlertTriangle, Clock, Filter, ChevronRight } from "lucide-react";

export default function MisNotificaciones() {
  const getNotificaciones = () => {
    const data = localStorage.getItem("notificaciones");
    return data ? JSON.parse(data) : [
      {
        tipo: "ingreso",
        mensaje: "Vehículo ABC-123 ingresó al estacionamiento",
        fecha: "Hace 5 minutos",
        leido: false
      },
      {
        tipo: "salida",
        mensaje: "Vehículo XYZ-789 salió del estacionamiento",
        fecha: "Hace 20 minutos",
        leido: true
      },
      {
        tipo: "alerta",
        mensaje: "Intento de acceso con placa no registrada",
        fecha: "Hace 1 hora",
        leido: false
      }
    ];
  };

  const [notificaciones] = useState(getNotificaciones());
  const [filtro, setFiltro] = useState("todas");

  const colores = {
    naranja: "#f97316",
    naranjaOscuro: "#ea580c",
    ingreso: "#22c55e",
    salida: "#3b82f6",
    alerta: "#ef4444",
    slate: "#1e293b",
    lightSlate: "#64748b",
    indigoPalido: "#94a3b8",
    bg: "#f8fafc"
  };

  const filtrar = () => {
    if (filtro === "todas") return notificaciones;
    return notificaciones.filter(n => n.tipo === filtro);
  };

  const getIcono = (tipo) => {
    switch (tipo) {
      case "ingreso": return <LogIn size={20} />;
      case "salida": return <LogOut size={20} />;
      case "alerta": return <AlertTriangle size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const chipStyle = (active) => ({
    padding: "10px 18px",
    borderRadius: "16px",
    border: "none",
    cursor: "pointer",
    background: active ? colores.naranja : "white",
    color: active ? "white" : colores.lightSlate,
    fontWeight: 700,
    fontSize: "0.85rem",
    boxShadow: active ? "0 4px 12px rgba(249,115,22,0.2)" : "0 2px 4px rgba(0,0,0,0.02)",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  });

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: "1.5rem", maxWidth: "600px", margin: "0 auto", backgroundColor: colores.bg, minHeight: "100vh" }}>
      
      {/* HEADER */}
      <div style={{ 
  marginBottom: "2.5rem", 
  textAlign: "center", // Centra todo el contenido
  display: "flex", 
  flexDirection: "column", 
  alignItems: "center" 
}}>
  <h1 style={{ 
    fontSize: "1.8rem", 
    fontWeight: 800, 
    color: colores.slate, 
    margin: 0 
  }}>
    Notificaciones
  </h1>
  <p style={{ 
    color: colores.lightSlate, 
    margin: "4px 0 0 0", 
    paddingLeft: "0" // Quitamos los 42px para que no se desfase del centro
  }}>
    Seguimiento en tiempo real de tu espacio
  </p>

      {/* FILTROS (CHIPS) */}
      <div style={{ 
        display: "flex", 
        gap: "10px", 
        margin: "1.5rem 0", 
        overflowX: "auto", 
        paddingBottom: "10px",
        msOverflowStyle: "none",
        scrollbarWidth: "none"
      }}>
        {["todas", "ingreso", "salida", "alerta"].map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            style={chipStyle(filtro === f)}
          >
            {f === "todas" && <Filter size={14} />}
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      </div>

      {/* LISTA DE NOTIFICACIONES */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtrar().length > 0 ? (
          filtrar().map((n, i) => (
            <div
              key={i}
              style={{
                background: "white",
                padding: "1.2rem",
                borderRadius: "24px",
                display: "flex",
                gap: "14px",
                alignItems: "center",
                border: "1px solid #f1f5f9",
                boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                position: "relative",
                transition: "transform 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0)"}
            >
              {/* PUNTO DE NO LEÍDO */}
              {!n.leido && (
                <div style={{ 
                  position: "absolute", 
                  top: "12px", 
                  right: "12px", 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  background: colores.naranja 
                }} />
              )}

              {/* ICONO CON COLOR DINÁMICO */}
              <div style={{
                background: `${colores[n.tipo]}15`, // Color con 15% opacidad
                color: colores[n.tipo],
                padding: "12px",
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {getIcono(n.tipo)}
              </div>

              {/* CONTENIDO */}
              <div style={{ flex: 1 }}>
                <p style={{ 
                  margin: 0, 
                  fontWeight: 700, 
                  color: colores.slate, 
                  fontSize: "0.95rem",
                  lineHeight: "1.3" 
                }}>
                  {n.mensaje}
                </p>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "4px", 
                  marginTop: "6px", 
                  color: colores.indigoPalido,
                  fontSize: "0.8rem" 
                }}>
                  <Clock size={12} />
                  <span>{n.fecha}</span>
                </div>
              </div>

              <ChevronRight size={18} color={colores.indigoPalido} />
            </div>
          ))
        ) : (
          /* ESTADO VACÍO */
          <div style={{ 
            textAlign: "center", 
            padding: "4rem 2rem", 
            background: "white", 
            borderRadius: "28px", 
            border: "1px dashed #e2e8f0" 
          }}>
            <div style={{ color: colores.indigoPalido, marginBottom: "1rem" }}>
              <Bell size={48} strokeWidth={1} style={{ opacity: 0.5 }} />
            </div>
            <h3 style={{ color: colores.slate, margin: "0 0 8px 0" }}>Sin novedades</h3>
            <p style={{ color: colores.lightSlate, margin: 0, fontSize: "0.9rem" }}>
              No hay notificaciones en la categoría <strong>{filtro}</strong>.
            </p>
          </div>
        )}
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}