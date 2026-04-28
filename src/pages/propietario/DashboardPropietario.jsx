import { useState, useEffect } from "react";
import { 
  Car, Bell, UserCheck, TrendingUp, ChevronRight, 
  ArrowUpRight, Clock, ShieldCheck, Zap, Map 
} from "lucide-react";

export default function Dashboard() {
  const [cargando, setCargando] = useState(true);
  const [notificaciones, setNotificaciones] = useState(3);
  
  const colores = {
    naranja: "#f97316",
    naranjaHover: "#ea580c",
    naranjaSuave: "#fff7ed",
    naranjaBorde: "#ffedd5",
    slate: "#1e293b",
    lightSlate: "#64748b",
    bg: "#f8fafc",
    white: "#ffffff"
  };

  useEffect(() => {
    const timer = setTimeout(() => setCargando(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleNuevoPermiso = () => {
    alert("Generando acceso QR para nuevo invitado...");
  };

  const [stats] = useState([
    { label: "Libres", valor: "12", icono: <Car size={20}/>, color: colores.naranja },
    { label: "Alertas", valor: "03", icono: <Bell size={20}/>, color: "#ef4444" },
    { label: "Visitas", valor: "08", icono: <UserCheck size={20}/>, color: "#3b82f6" },
  ]);

  if (cargando) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: colores.naranja, fontWeight: 800 }}>Cargando Dashboard...</div>;

  return (
    <div style={{ 
      fontFamily: "system-ui, sans-serif", padding: "2rem", backgroundColor: colores.bg, 
      minHeight: "100vh", maxWidth: "1200px", margin: "0 auto",
      animation: "fadeInUp 0.6s ease-out"
    }}>
      
      {/* ESTILO PARA ANIMACIONES */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hover-card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
        .hover-btn:active { transform: scale(0.96); }
      `}</style>
      
      <div style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: colores.slate, margin: 0 }}>¡Hola, Bienvenido!</h1>
          <p style={{ color: colores.lightSlate, marginTop: "4px" }}>Resumen operativo de hoy</p>
        </div>
        <div style={{ background: colores.white, padding: "8px 16px", borderRadius: "14px", border: `1px solid ${colores.naranjaBorde}`, display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
          <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Sistema Online</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
        {stats.map((s, i) => (
          <div key={i} className="hover-card" style={{ 
            background: s.label === "Libres" ? colores.naranja : colores.white, 
            padding: "2rem", borderRadius: "32px", position: "relative", overflow: "hidden",
            border: s.label === "Libres" ? "none" : `1px solid ${colores.naranjaBorde}`,
            display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", cursor: "default"
          }}>
            <div style={{ position: "absolute", right: "-20px", top: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: s.label === "Libres" ? "rgba(255,255,255,0.1)" : `${s.color}08` }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 1 }}>
              <div style={{ background: s.label === "Libres" ? "rgba(255,255,255,0.2)" : `${s.color}15`, color: s.label === "Libres" ? colores.white : s.color, padding: "12px", borderRadius: "16px", display: "flex" }}>{s.icono}</div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 800, color: s.label === "Libres" ? "rgba(255,255,255,0.7)" : colores.lightSlate, textTransform: "uppercase" }}>{s.label}</p>
                <h2 style={{ margin: 0, fontSize: "2.5rem", fontWeight: 800, color: s.label === "Libres" ? colores.white : colores.slate }}>{s.valor}</h2>
              </div>
            </div>
            <div style={{ zIndex: 1, marginTop: "1rem", paddingTop: "1rem", borderTop: s.label === "Libres" ? "1px solid rgba(255,255,255,0.2)" : "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp size={14} color={s.label === "Libres" ? "white" : s.color} />
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: s.label === "Libres" ? "white" : colores.slate }}>{s.label === "Libres" ? "Piso 1 y 2 disponibles" : "Actualizado ahora"}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem", marginBottom: "2.5rem" }}>
        <div style={{ 
          background: `linear-gradient(135deg, ${colores.naranja}, #ea580c)`, padding: "2.5rem", borderRadius: "32px", color: colores.white,
          display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 20px 30px rgba(249,115,22,0.2)"
        }}>
          <div>
            <div style={{ background: "rgba(255,255,255,0.2)", width: "fit-content", padding: "8px", borderRadius: "12px", marginBottom: "1.5rem" }}><ShieldCheck size={28} /></div>
            <h3 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800 }}>Gestión de Accesos</h3>
            <p style={{ opacity: 0.9, fontSize: "1rem", marginTop: "10px" }}>Genera permisos temporales para visitas.</p>
          </div>
          <button onClick={handleNuevoPermiso} className="hover-btn" style={{ 
            marginTop: "2rem", width: "100%", background: colores.white, color: colores.naranja, border: "none", 
            padding: "1.2rem", borderRadius: "20px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "0.2s"
          }}>
            <Zap size={18} fill={colores.naranja} /> Iniciar Registro
          </button>
        </div>

        <div style={{ background: colores.white, padding: "2rem", borderRadius: "32px", border: `1px solid ${colores.naranjaBorde}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, color: colores.slate }}>Actividad Crítica</h3>
            <button onClick={() => setNotificaciones(0)} style={{ background: "none", border: "none", color: colores.naranja, fontWeight: 700, cursor: "pointer" }}>Limpiar</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {notificaciones > 0 ? (
              [
                { t: "Ingreso", d: "ABC-123 en A-102", h: "2 min", c: "#22c55e" },
                { t: "Salida", d: "XYZ-789 de B-201", h: "15 min", c: colores.naranja }
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "15px", padding: "15px", borderRadius: "22px", background: colores.bg, border: "1px solid #f1f5f9" }}>
                  <div style={{ width: "45px", height: "45px", borderRadius: "14px", background: `${item.c}15`, display: "flex", alignItems: "center", justifyContent: "center", color: item.c }}><Car size={18}/></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: colores.slate }}>{item.t}</p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: colores.lightSlate }}>{item.d}</p>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700 }}>{item.h}</span>
                </div>
              ))
            ) : <p style={{ textAlign: 'center', color: colores.lightSlate }}>No hay actividad nueva</p>}
          </div>
        </div>
      </div>

      <div style={{ background: colores.white, padding: "2rem", borderRadius: "32px", border: `1px solid ${colores.naranjaBorde}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ background: colores.naranja, color: colores.white, padding: "15px", borderRadius: "20px" }}><TrendingUp size={28} /></div>
          <div>
            <h4 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>Ocupación: 75%</h4>
            <div style={{ width: "150px", height: "8px", background: "#f1f5f9", borderRadius: "10px", marginTop: "8px", overflow: "hidden" }}>
              <div style={{ width: "75%", height: "100%", background: colores.naranja, borderRadius: "10px", transition: "width 1s ease-in-out" }} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="hover-btn" style={{ background: colores.bg, border: "none", padding: "12px 24px", borderRadius: "16px", fontWeight: 700, cursor: "pointer" }}><Map size={18} /></button>
          <button className="hover-btn" style={{ background: colores.slate, border: "none", padding: "12px 24px", borderRadius: "16px", color: colores.white, fontWeight: 700, cursor: "pointer" }}>Reportes</button>
        </div>
      </div>
    </div>
  );
}