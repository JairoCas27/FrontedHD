import React from "react";
import { FiUsers, FiTruck, FiMapPin, FiActivity, FiBell } from "react-icons/fi";
import { useAdminDashboard } from '../../hooks/Admin/useAdminDashboard'; 

export default function DashboardAdmin() {
  const colorAdmin = "rgb(52,151,195)";

  
  const { metrics, loading } = useAdminDashboard();

  if (loading || !metrics) {
    return (
      <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#64748b", fontWeight: "600", textAlign: "center" }}>
        Sincronizando panel operativo con el servidor central...
      </div>
    );
  }

  // Desestructuración y cálculos dinámicos basados en la respuesta real de la API
  const espaciosPorBloque = metrics.espaciosPorBloque || [];
  const accesosRecientes = metrics.accesosRecientes || [];

  const totalPlazas = espaciosPorBloque.reduce((sum, b) => sum + (b.total || 0), 0);
  const totalOcupados = espaciosPorBloque.reduce((sum, b) => sum + (b.ocupados || 0), 0);
  const totalDisponibles = espaciosPorBloque.reduce((sum, b) => sum + (b.disponibles || 0), 0);
  const totalMantencion = espaciosPorBloque.reduce((sum, b) => sum + (b.mantención || b.mantener || 0), 0);
  const porcentajeOcupacion = totalPlazas > 0 ? Math.round((totalOcupados / totalPlazas) * 100) : 0;

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box" }}>
      
      {/* 1. Cabecera Fija */}
      <div style={{ marginBottom: "2rem", textAlign: "left" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a", margin: 0 }}>Dashboard Admin</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.9rem", fontWeight: "500" }}>Resumen operativo del condominio</p>
      </div>

      {/* 2. Cuadrícula de Tarjetas Horizontal */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2rem", width: "100%" }}>
        
        {/* Usuarios */}
        <div style={{ flex: 1, minWidth: "220px", backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Total Usuarios</span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a", margin: "0.25rem 0 0 0" }}>{metrics.totalUsuarios || 0}</h2>
            <span style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: "700", backgroundColor: "rgba(16,185,129,0.08)", padding: "0.15rem 0.4rem", borderRadius: "0.25rem", display: "inline-block", marginTop: "0.5rem" }}>Cuentas del condominio</span>
          </div>
          <div style={{ color: colorAdmin, backgroundColor: "rgba(52,151,195,0.08)", padding: "0.75rem", borderRadius: "0.75rem" }}>
            <FiUsers size={24} />
          </div>
        </div>

        {/* Vehículos */}
        <div style={{ flex: 1, minWidth: "220px", backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Vehículos</span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a", margin: "0.25rem 0 0 0" }}>{metrics.totalVehiculos || 0}</h2>
            <span style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: "700", backgroundColor: "rgba(16,185,129,0.08)", padding: "0.15rem 0.4rem", borderRadius: "0.25rem", display: "inline-block", marginTop: "0.5rem" }}>Registrados</span>
          </div>
          <div style={{ color: "#10b981", backgroundColor: "rgba(16,185,129,0.08)", padding: "0.75rem", borderRadius: "0.75rem" }}>
            <FiTruck size={24} />
          </div>
        </div>

        {/* Estacionamientos */}
        <div style={{ flex: 1, minWidth: "220px", backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Estacionamientos</span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a", margin: "0.25rem 0 0 0" }}>{totalPlazas}</h2>
            <span style={{ fontSize: "0.7rem", color: "#f59e0b", fontWeight: "700", backgroundColor: "rgba(245,158,11,0.08)", padding: "0.15rem 0.4rem", borderRadius: "0.25rem", display: "inline-block", marginTop: "0.5rem" }}>{porcentajeOcupacion}% ocupación</span>
          </div>
          <div style={{ color: "#f59e0b", backgroundColor: "rgba(245,158,11,0.08)", padding: "0.75rem", borderRadius: "0.75rem" }}>
            <FiMapPin size={24} />
          </div>
        </div>

        {/* Visitas */}
        <div style={{ flex: 1, minWidth: "220px", backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Visitas Hoy</span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a", margin: "0.25rem 0 0 0" }}>{metrics.visitasHoy || 0}</h2>
            <span style={{ fontSize: "0.7rem", color: "#3497C3", fontWeight: "700", backgroundColor: "rgba(52,151,195,0.08)", padding: "0.15rem 0.4rem", borderRadius: "0.25rem", display: "inline-block", marginTop: "0.5rem" }}>Bitácora portón</span>
          </div>
          <div style={{ color: colorAdmin, backgroundColor: "rgba(52,151,195,0.08)", padding: "0.75rem", borderRadius: "0.75rem" }}>
            <FiActivity size={24} />
          </div>
        </div>

      </div>

      {/* 3. Secciones Gráficas Asimétricas */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2rem", width: "100%" }}>
        
        {/* Barras de Estado */}
        <div style={{ flex: "1.6", backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", minWidth: "300px", textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h4 style={{ margin: 0, fontWeight: "700", color: "#1e293b", fontSize: "1rem" }}>Estado de Estacionamientos por Bloque</h4>
            <span style={{ fontSize: "0.75rem", backgroundColor: "#f1f5f9", color: "#475569", fontWeight: "700", padding: "0.25rem 0.5rem", borderRadius: "0.5rem" }}>Total: {totalPlazas} plazas</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {espaciosPorBloque.map((bloque, index) => {
              const mantencionActual = bloque.mantención || bloque.mantener || 0;
              return (
                <div key={index}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.3rem" }}>
                    <span style={{ fontWeight: "700", color: "#475569" }}>{bloque.bloque}</span>
                    <span style={{ color: "#94a3b8", fontWeight: "500" }}>{bloque.ocupados} ocupados / {bloque.disponibles} disponibles</span>
                  </div>
                  <div style={{ width: "100%", height: "10px", backgroundColor: "#f1f5f9", borderRadius: "9999px", overflow: "hidden", display: "flex" }}>
                    <div style={{ width: `${bloque.total > 0 ? (bloque.ocupados / bloque.total) * 100 : 0}%`, backgroundColor: "#f87171" }} />
                    <div style={{ width: `${bloque.total > 0 ? (bloque.disponibles / bloque.total) * 100 : 0}%`, backgroundColor: "#34d399" }} />
                    <div style={{ width: `${bloque.total > 0 ? (mantencionActual / bloque.total) * 100 : 0}%`, backgroundColor: "#fbbf24" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribución Circular */}
        <div style={{ flex: "1", backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", minWidth: "250px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
          <h4 style={{ margin: 0, fontWeight: "700", color: "#1e293b", fontSize: "1rem", width: "100%", textAlign: "left" }}>Distribución de Estacionamientos</h4>
          <div style={{ margin: "1.5rem auto", display: "flex", alignItems: "center", justifyContent: "center", width: "130px", height: "130px", borderRadius: "50%", border: `8px solid ${colorAdmin}`, backgroundColor: "#f8fafc" }}>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ margin: 0, fontSize: "1.6rem", fontWeight: "900", color: "#0f172a" }}>{porcentajeOcupacion}%</h2>
              <p style={{ margin: 0, fontSize: "9px", textTransform: "uppercase", color: "#94a3b8", fontWeight: "700", letterSpacing: "0.5px" }}>Ocupado</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
            <div style={{ flex: 1, backgroundColor: "#f8fafc", padding: "0.5rem", borderRadius: "0.5rem", textAlign: "center", border: "1px solid #f1f5f9" }}>
              <p style={{ color: "#ef4444", fontWeight: "700", margin: 0, fontSize: "1rem" }}>{totalOcupados}</p>
              <span style={{ fontSize: "9px", color: "#94a3b8", fontWeight: "700" }}>Ocupadas</span>
            </div>
            <div style={{ flex: 1, backgroundColor: "#f8fafc", padding: "0.5rem", borderRadius: "0.5rem", textAlign: "center", border: "1px solid #f1f5f9" }}>
              <p style={{ color: "#10b981", fontWeight: "700", margin: 0, fontSize: "1rem" }}>{totalDisponibles}</p>
              <span style={{ fontSize: "9px", color: "#94a3b8", fontWeight: "700" }}>Disponibles</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Tabla de Movimientos en Bitácora */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", width: "100%", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ margin: 0, fontWeight: "700", color: "#1e293b", fontSize: "1rem" }}>Accesos Recientes</h4>
          <FiBell style={{ color: colorAdmin }} />
        </div>
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "1rem 1.5rem" }}>Nombre</th>
                <th style={{ padding: "1rem" }}>Tipo</th>
                <th style={{ padding: "1rem" }}>Hora</th>
                <th style={{ padding: "1rem" }}>Estado</th>
              </tr>
            </thead>
            <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
              {accesosRecientes.map((acceso) => (
                <tr key={acceso.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1rem 1.5rem", fontWeight: "700", color: "#0f172a" }}>{acceso.nombre}</td>
                  <td style={{ padding: "1rem", color: "#64748b", fontWeight: "500" }}>{acceso.tipo}</td>
                  <td style={{ padding: "1rem", fontFamily: "monospace", fontWeight: "700" }}>{acceso.hora}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{
                      backgroundColor: acceso.estado === 'Ingreso' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                      color: acceso.estado === 'Ingreso' ? '#10b981' : '#64748b',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}>
                      {acceso.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}