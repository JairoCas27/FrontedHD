import { useEffect, useState } from "react"
import { FiHome, FiUsers, FiLayers, FiDollarSign, FiActivity } from "react-icons/fi"
import {
  getSuperAdminDashboardMetrics,
  getSuperAdminRecentCondos,
  getSuperAdminRecentAdmins,
} from "../../services/api"

export default function DashboardSuperAdmin() {
  const [metrics, setMetrics] = useState(null)
  const [recentCondos, setRecentCondos] = useState([])
  const [recentAdmins, setRecentAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadDashboard = async () => {
      setLoading(true)
      setError(null)

      try {
        const [metricsData, condosData, adminsData] = await Promise.all([
          getSuperAdminDashboardMetrics(),
          getSuperAdminRecentCondos(),
          getSuperAdminRecentAdmins(),
        ])

        if (!isMounted) return

        setMetrics(metricsData)
        setRecentCondos(condosData || [])
        setRecentAdmins(adminsData || [])
      } catch (err) {
        if (!isMounted) return
        setError(err.message || "No se pudieron cargar los datos del dashboard.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadDashboard()
    return () => {
      isMounted = false
    }
  }, [])

  const stats = [
    {
      title: "Total Condominios",
      value: metrics?.totalCondominios ?? "...",
      icon: <FiHome size={24} />,
      color: "#4f46e5",
      trend: metrics ? `${metrics.condominiosActivos ?? 0} activos` : "Cargando...",
    },
    {
      title: "Total Administradores",
      value: metrics?.totalAdministradores ?? "...",
      icon: <FiUsers size={24} />,
      color: "#10b981",
      trend: metrics ? `${metrics.totalAdministradores ?? 0} administradores` : "Cargando...",
    },
    {
      title: "Total Propietarios",
      value: metrics?.totalPropietarios ?? "...",
      icon: <FiLayers size={24} />,
      color: "#f59e0b",
      trend: metrics ? `${metrics.totalAgentes ?? 0} agentes` : "Cargando...",
    },
    {
      title: "Usuarios Totales",
      value: metrics?.totalUsuarios ?? "...",
      icon: <FiDollarSign size={24} />,
      color: "#8b5cf6",
      trend: metrics ? `${metrics.totalUsuarios ?? 0} usuarios totales` : "Cargando...",
    },
  ];

  const renderRecentCondos = () => {
    if (loading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <tr key={index} style={{ borderBottom: "1px solid #f8fafc" }}>
          <td style={{ padding: "1rem", fontWeight: 500, color: "#334155" }}>Cargando...</td>
          <td style={{ padding: "1rem", color: "#64748b" }}>-</td>
          <td style={{ padding: "1rem", color: "#64748b" }}>-</td>
          <td style={{ padding: "1rem", color: "#94a3b8" }}>-</td>
        </tr>
      ))
    }

    if (recentCondos.length === 0) {
      return (
        <tr>
          <td colSpan={4} style={{ padding: "1rem", color: "#64748b" }}>
            No hay condominios recientes.
          </td>
        </tr>
      )
    }

    return recentCondos.map((row, index) => (
      <tr key={index} style={{ borderBottom: "1px solid #f8fafc" }}>
        <td style={{ padding: "1rem", fontWeight: 500, color: "#334155" }}>{row?.nombre ?? "-"}</td>
        <td style={{ padding: "1rem", color: "#64748b" }}>{row?.nombreCiudad ?? "-"}</td>
        <td style={{ padding: "1rem", color: "#64748b" }}>{row?.nombreAdministrador ?? "-"}</td>
        <td style={{ padding: "1rem", color: "#94a3b8" }}>{row?.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString() : "-"}</td>
      </tr>
    ))
  }

  const renderRecentAdmins = () => {
    if (loading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <tr key={index} style={{ borderBottom: "1px solid #f8fafc" }}>
          <td style={{ padding: "1rem", fontWeight: 500, color: "#334155" }}>Cargando...</td>
          <td style={{ padding: "1rem", color: "#64748b" }}>-</td>
          <td style={{ padding: "1rem", color: "#64748b" }}>-</td>
          <td style={{ padding: "1rem", color: "#94a3b8" }}>-</td>
        </tr>
      ))
    }

    if (recentAdmins.length === 0) {
      return (
        <tr>
          <td colSpan={4} style={{ padding: "1rem", color: "#64748b" }}>
            No hay administradores recientes.
          </td>
        </tr>
      )
    }

    return recentAdmins.map((row, index) => (
      <tr key={index} style={{ borderBottom: "1px solid #f8fafc" }}>
        <td style={{ padding: "1rem", fontWeight: 500, color: "#334155" }}>
          {row ? `${row.nombres} ${row.apellidos}` : "-"}
        </td>
        <td style={{ padding: "1rem", color: "#64748b" }}>{row?.correo ?? "-"}</td>
        <td style={{ padding: "1rem", color: "#64748b" }}>{row?.nombreCondominio ?? "-"}</td>
        <td style={{ padding: "1rem", color: "#94a3b8" }}>{row?.fechaCreacion ? new Date(row.fechaCreacion).toLocaleDateString() : "-"}</td>
      </tr>
    ))
  }

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
      <div style={{ display: "grid", gap: "1.5rem" }}>
        <section style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <FiActivity size={20} style={{ color: "#4f46e5" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>Condominios Recientes</h2>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #f1f5f9" }}>
                  <th style={{ padding: "1rem", color: "#64748b", fontWeight: 600 }}>Nombre</th>
                  <th style={{ padding: "1rem", color: "#64748b", fontWeight: 600 }}>Ciudad</th>
                  <th style={{ padding: "1rem", color: "#64748b", fontWeight: 600 }}>Administrador</th>
                  <th style={{ padding: "1rem", color: "#64748b", fontWeight: 600 }}>Creado</th>
                </tr>
              </thead>
              <tbody>{renderRecentCondos()}</tbody>
            </table>
          </div>
        </section>

        <section style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <FiUsers size={20} style={{ color: "#10b981" }} />
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>Administradores Recientes</h2>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #f1f5f9" }}>
                  <th style={{ padding: "1rem", color: "#64748b", fontWeight: 600 }}>Nombre</th>
                  <th style={{ padding: "1rem", color: "#64748b", fontWeight: 600 }}>Correo</th>
                  <th style={{ padding: "1rem", color: "#64748b", fontWeight: 600 }}>Condominio</th>
                  <th style={{ padding: "1rem", color: "#64748b", fontWeight: 600 }}>Creado</th>
                </tr>
              </thead>
              <tbody>{renderRecentAdmins()}</tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}