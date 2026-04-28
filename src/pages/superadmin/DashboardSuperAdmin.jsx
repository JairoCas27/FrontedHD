import { FiHome, FiUsers, FiLayers, FiDollarSign, FiActivity } from "react-icons/fi";

export default function DashboardSuperAdmin() {
  // Datos simulados para las tarjetas
  const stats = [
    { title: "Total Condominios", value: "24", icon: <FiHome size={24} />, color: "#4f46e5", trend: "+2 este mes" },
    { title: "Usuarios Globales", value: "1,280", icon: <FiUsers size={24} />, color: "#10b981", trend: "+15% vs mes anterior" },
    { title: "Suscripciones Activas", value: "18", icon: <FiLayers size={24} />, color: "#f59e0b", trend: "4 por vencer" },
    { title: "Ingresos Mensuales", value: "S/ 12,450", icon: <FiDollarSign size={24} />, color: "#8b5cf6", trend: "+5.2%" },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      {/* Cabecera */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Dashboard Global</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>Vista general de toda la plataforma SaaS</p>
      </div>

      {/* Grid de Tarjetas */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: "1.5rem", 
        marginBottom: "2rem" 
      }}>
        {stats.map((item, index) => (
          <div key={index} style={{ 
            background: "#fff", 
            padding: "1.5rem", 
            borderRadius: "16px", 
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>{item.title}</div>
              <div style={{ color: item.color, background: `${item.color}15`, padding: "8px", borderRadius: "12px" }}>
                {item.icon}
              </div>
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b" }}>{item.value}</div>
            <div style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 500 }}>{item.trend}</div>
          </div>
        ))}
      </div>

      {/* Sección de Actividad Reciente */}
      <div style={{ 
        background: "#fff", 
        borderRadius: "16px", 
        padding: "1.5rem", 
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <FiActivity size={20} style={{ color: "#4f46e5" }} />
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>Actividad de Condominios</h2>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #f1f5f9" }}>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 600 }}>Condominio</th>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 600 }}>Plan</th>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 600 }}>Estado</th>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: 600 }}>Última Actividad</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Urban Park I", plan: "Premium", status: "Activo", date: "Hace 5 min" },
                { name: "Residencial Arboleda", plan: "Básico", status: "Inactivo", date: "Hace 2 horas" },
                { name: "Vista Sol Puente Piedra", plan: "Pro", status: "Activo", date: "Ayer" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "1rem", fontWeight: 500, color: "#334155" }}>{row.name}</td>
                  <td style={{ padding: "1rem", color: "#64748b" }}>{row.plan}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ 
                      padding: "4px 10px", 
                      borderRadius: "20px", 
                      fontSize: "0.75rem", 
                      fontWeight: 600,
                      background: row.status === "Activo" ? "#dcfce7" : "#fee2e2",
                      color: row.status === "Activo" ? "#15803d" : "#b91c1c"
                    }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", color: "#94a3b8" }}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}