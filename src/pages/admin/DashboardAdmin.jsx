import React from "react";
import { FiUsers, FiTruck, FiMapPin, FiActivity, FiBell, FiHome, FiLayers } from "react-icons/fi";
import { useAdminDashboard } from '../../hooks/Admin/useAdminDashboard'; 

export default function DashboardAdmin() {
  const colorAdmin = "rgb(52,151,195)";
  
  
  const { metricas, loading } = useAdminDashboard();

  if (loading || !metricas) {
    return (
      <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#64748b", fontWeight: "600", textAlign: "center" }}>
        Sincronizando panel operativo con el servidor central...
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box" }}>
      
      {/* 1. Cabecera Fija */}
      <div style={{ marginBottom: "2rem", textAlign: "left" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a", margin: 0 }}>Dashboard Admin</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.9rem", fontWeight: "500" }}>Resumen operativo del condominio</p>
      </div>

      {/* 2. Cuadrícula de Tarjetas Horizontal Con Data Real del Swagger */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2rem", width: "100%" }}>
        
        {/* Torres */}
        <div style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Total Torres</span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a", margin: "0.25rem 0 0 0" }}>{metricas.totalTorres}</h2>
            <span style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: "700", backgroundColor: "rgba(16,185,129,0.08)", padding: "0.15rem 0.4rem", borderRadius: "0.25rem", display: "inline-block", marginTop: "0.5rem" }}>Estructuras</span>
          </div>
          <div style={{ color: colorAdmin, backgroundColor: "rgba(52,151,195,0.08)", padding: "0.75rem", borderRadius: "0.75rem" }}>
            <FiHome size={24} />
          </div>
        </div>

        {/* Departamentos */}
        <div style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Apartamentos</span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a", margin: "0.25rem 0 0 0" }}>{metricas.totalApartamentos}</h2>
            <span style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: "700", backgroundColor: "rgba(16,185,129,0.08)", padding: "0.15rem 0.4rem", borderRadius: "0.25rem", display: "inline-block", marginTop: "0.5rem" }}>Total inmuebles</span>
          </div>
          <div style={{ color: "#10b981", backgroundColor: "rgba(16,185,129,0.08)", padding: "0.75rem", borderRadius: "0.75rem" }}>
            <FiLayers size={24} />
          </div>
        </div>

        {/* Propietarios */}
        <div style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Propietarios</span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a", margin: "0.25rem 0 0 0" }}>{metricas.totalPropietarios}</h2>
            <span style={{ fontSize: "0.7rem", color: "#f59e0b", fontWeight: "700", backgroundColor: "rgba(245,158,11,0.08)", padding: "0.15rem 0.4rem", borderRadius: "0.25rem", display: "inline-block", marginTop: "0.5rem" }}>Titulares directos</span>
          </div>
          <div style={{ color: "#f59e0b", backgroundColor: "rgba(245,158,11,0.08)", padding: "0.75rem", borderRadius: "0.75rem" }}>
            <FiUsers size={24} />
          </div>
        </div>

        {/* Vehículos */}
        <div style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Vehículos</span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#0f172a", margin: "0.25rem 0 0 0" }}>{metricas.totalVehiculos}</h2>
            <span style={{ fontSize: "0.7rem", color: "#3497C3", fontWeight: "700", backgroundColor: "rgba(52,151,195,0.08)", padding: "0.15rem 0.4rem", borderRadius: "0.25rem", display: "inline-block", marginTop: "0.5rem" }}>Unidades móviles</span>
          </div>
          <div style={{ color: colorAdmin, backgroundColor: "rgba(52,151,195,0.08)", padding: "0.75rem", borderRadius: "0.75rem" }}>
            <FiTruck size={24} />
          </div>
        </div>

      </div>

      {/* 3. Secciones Informativas Auxiliares */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", width: "100%" }}>
        
        {/* Resumen Técnico de Infraestructura */}
        <div style={{ flex: "1", backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", minWidth: "300px", textAlign: "left" }}>
          <h4 style={{ margin: "0 0 1.5rem 0", fontWeight: "700", color: "#1e293b", fontSize: "1rem" }}>Infraestructura de Copropiedad</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.5rem" }}>
              <span style={{ color: "#64748b", fontWeight: "500" }}>Pisos Totales Distribuidos</span>
              <strong style={{ color: "#0f172a" }}>{metricas.totalPisos} pisos</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.5rem" }}>
              <span style={{ color: "#64748b", fontWeight: "500" }}>Agentes de Seguridad</span>
              <strong style={{ color: "#0f172a" }}>{metricas.totalAgentes} activos</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.5rem" }}>
              <span style={{ color: "#64748b", fontWeight: "500" }}>Carritos de Compras Comunes</span>
              <strong style={{ color: "#0f172a" }}>{metricas.totalCarritos} unidades</strong>
            </div>
          </div>
        </div>

        {/* Estado Informativo de Portón */}
        <div style={{ flex: "1", backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", minWidth: "250px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <FiBell size={32} style={{ color: colorAdmin, marginBottom: "1rem" }} />
          <h4 style={{ margin: "0 0 0.25rem 0", fontWeight: "700", color: "#1e293b", fontSize: "0.95rem" }}>Consola Operativa Sincronizada</h4>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b", textAlign: "center" }}>
            Los contadores reflejan el estado del censo logístico del condominio en tiempo real. Para auditar los accesos individuales diríjase al módulo de reportes.
          </p>
        </div>

      </div>

    </div>
  );
}