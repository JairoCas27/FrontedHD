import { useState } from "react";
import { Car, Bell, UserCheck, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [stats] = useState([
    { label: "Libres", valor: "12", icono: <Car size={20}/>, color: "#f97316" },
    { label: "Alertas", valor: "03", icono: <Bell size={20}/>, color: "#ef4444" },
    { label: "Visitas", valor: "08", icono: <UserCheck size={20}/>, color: "#3b82f6" },
  ]);

  const colores = {
    naranja: "#f97316", naranjaBorde: "#ffedd5",
    slate: "#1e293b", lightSlate: "#64748b",
    bg: "#f8fafc", white: "#ffffff"
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", backgroundColor: colores.bg, minHeight: "100vh", maxWidth: "1200px", margin: "0 auto" }}>
      
      <div style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: colores.slate, margin: 0, letterSpacing: "-0.5px" }}>¡Hola, Bienvenido!</h1>
          <p style={{ color: colores.lightSlate, marginTop: "4px", fontSize: "1.1rem" }}>Resumen operativo de hoy</p>
        </div>
        <div style={{ background: colores.white, padding: "8px 16px", borderRadius: "14px", border: `1px solid ${colores.naranjaBorde}`, display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: colores.slate }}>Sistema Online</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: s.label === "Libres" ? colores.naranja : colores.white, padding: "2rem", borderRadius: "32px", boxShadow: "0 15px 30px rgba(0,0,0,0.05)", position: "relative", overflow: "hidden", border: s.label === "Libres" ? "none" : `1px solid ${colores.naranjaBorde}`, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "160px" }}>
            <div style={{ position: "absolute", right: "-20px", top: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: s.label === "Libres" ? "rgba(255,255,255,0.1)" : `${s.color}08`, zIndex: 0 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 1 }}>
              <div style={{ background: s.label === "Libres" ? "rgba(255,255,255,0.2)" : `${s.color}15`, color: s.label === "Libres" ? colores.white : s.color, padding: "12px", borderRadius: "16px", display: "flex" }}>{s.icono}</div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 800, color: s.label === "Libres" ? "rgba(255,255,255,0.7)" : colores.lightSlate, textTransform: "uppercase" }}>{s.label}</p>
                <h2 style={{ margin: 0, fontSize: "2.5rem", fontWeight: 800, color: s.label === "Libres" ? colores.white : colores.slate, lineHeight: 1 }}>{s.valor}</h2>
              </div>
            </div>
            <div style={{ zIndex: 1, marginTop: "1rem", paddingTop: "1rem", borderTop: s.label === "Libres" ? "1px solid rgba(255,255,255,0.2)" : "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp size={14} color={s.label === "Libres" ? "white" : s.color} />
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: s.label === "Libres" ? "white" : colores.slate }}>{s.label === "Libres" ? "Piso 1 y 2 disponibles" : s.label === "Alertas" ? "Revisar cámaras" : "3 en espera"}</span>
            </div>
          </div>
        ))}
        
      </div>
        // ... (Código anterior)
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem", marginBottom: "2.5rem" }}>
        
        <div style={{ background: `linear-gradient(135deg, ${colores.naranja}, #ea580c)`, padding: "2.5rem", borderRadius: "32px", color: colores.white, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 20px 30px rgba(249,115,22,0.2)" }}>
          <div>
            <div style={{ background: "rgba(255,255,255,0.2)", width: "fit-content", padding: "8px", borderRadius: "12px", marginBottom: "1.5rem" }}><ShieldCheck size={28} /></div>
            <h3 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800 }}>Gestión de Accesos</h3>
            <p style={{ opacity: 0.9, fontSize: "1rem", marginTop: "10px", lineHeight: "1.5" }}>Autoriza invitados y genera códigos QR temporales en segundos.</p>
          </div>
          <button style={{ marginTop: "2rem", width: "100%", background: colores.white, color: colores.naranja, border: "none", padding: "1.2rem", borderRadius: "20px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "1rem" }}>
            <Zap size={18} fill={colores.naranja} /> Iniciar Nuevo Registro
          </button>
        </div>

        <div style={{ background: colores.white, padding: "2rem", borderRadius: "32px", border: `1px solid ${colores.naranjaBorde}`, boxShadow: "0 10px 20px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, color: colores.slate }}>Actividad Crítica</h3>
            <span style={{ background: "#fff7ed", color: colores.naranja, padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 800 }}>VIVO</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {[
              { t: "Ingreso", d: "ABC-123 en A-102", h: "2 min", c: "#22c55e" },
              { t: "Salida", d: "XYZ-789 de B-201", h: "15 min", c: colores.naranja },
              { t: "Alerta", d: "Placa no reconocida", h: "1 h", c: "#ef4444" }
            ].map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "15px", padding: "15px", borderRadius: "22px", background: colores.bg, border: "1px solid #f1f5f9" }}>
                <div style={{ width: "45px", height: "45px", borderRadius: "14px", background: `${item.c}15`, display: "flex", alignItems: "center", justifyContent: "center", color: item.c }}>
                  {item.t === "Alerta" ? <Bell size={18}/> : <Car size={18}/>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: colores.slate }}>{item.t}</p>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: colores.lightSlate }}>{item.d}</p>
                </div>
                <div style={{ textAlign: "right" }}><p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8" }}>{item.h}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}