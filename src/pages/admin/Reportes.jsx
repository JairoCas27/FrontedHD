import React, { useState } from 'react'
import { FiBarChart2, FiDownload, FiPieChart, FiHome } from "react-icons/fi"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAdminDashboard } from '../../hooks/Admin/useAdminDashboard' 

const COLORS = ['#3497C3', '#10b981', '#f59e0b']

export default function Reportes() {
  const colorAdmin = "rgb(52,151,195)"
  const [reporteSeleccionado, setReporteSeleccionado] = useState('censo')

  //  Consumimos 'metricas' tal como lo estructuramos en el hook adaptado
  const { metricas, loading } = useAdminDashboard()

  const handleExportar = () => {
    alert('Función de exportación de reportes en desarrollo')
  }

  // Estilos fijos comunes
  const estiloInput = {
    padding: "0.5rem 0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #cbd5e1",
    fontSize: "0.85rem",
    color: "#334155",
    backgroundColor: "#ffffff",
    outline: "none"
  }

  if (loading || !metricas) {
    return (
      <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#64748b", fontWeight: "600", textAlign: "center" }}>
         Sincronizando reportes y balances con el servidor de base de datos...
      </div>
    )
  }

  // 🟢 Mapeamos los datos reales del censo e inventario para los gráficos de torta y barras
  const datosDistribuciónInmuebles = [
    { name: 'Apartamentos', cantidad: metricas.totalApartamentos || 0 },
    { name: 'Propietarios', cantidad: metricas.totalPropietarios || 0 }
  ]

  const datosInventarioBienes = [
    { name: 'Vehículos', cantidad: metricas.totalVehiculos || 0, fill: '#3497C3' },
    { name: 'Carritos', cantidad: metricas.totalCarritos || 0, fill: '#10b981' },
    { name: 'Agentes Seg.', cantidad: metricas.totalAgentes || 0, fill: '#f59e0b' }
  ]

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      
      {/* 1. Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Reportes</h1>
          <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem", margin: '0.25rem 0 0 0' }}>Métricas consolidadas y balances operativos del censo</p>
        </div>
        <button 
          onClick={handleExportar}
          style={{ backgroundColor: "#10b981", color: "#fff", border: "none", padding: "0.6rem 1.25rem", borderRadius: "0.75rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)" }}
        >
          <FiDownload size={16} /> Exportar Datos
        </button>
      </div>

      {/* 2. Selector de Pestañas Real */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <button
          onClick={() => setReporteSeleccionado('censo')}
          style={{ padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", backgroundColor: reporteSeleccionado === 'censo' ? "#ffffff" : "transparent", boxShadow: reporteSeleccionado === 'censo' ? "0 4px 6px -1px rgba(0,0,0,0.02)" : "none", borderLeft: reporteSeleccionado === 'censo' ? `4px solid ${colorAdmin}` : "1px solid #e2e8f0", cursor: "pointer", textAlign: "left" }}
        >
          <FiPieChart size={20} style={{ color: reporteSeleccionado === 'censo' ? colorAdmin : "#94a3b8", marginBottom: "0.5rem" }} />
          <div style={{ fontWeight: "700", color: "#1e293b", fontSize: "0.9rem" }}>Distribución Inmobiliaria</div>
          <small style={{ color: "#64748b", fontSize: "0.75rem" }}>Censo de departamentos y titulares</small>
        </button>

        <button
          onClick={() => setReporteSeleccionado('inventario')}
          style={{ padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", backgroundColor: reporteSeleccionado === 'inventario' ? "#ffffff" : "transparent", boxShadow: reporteSeleccionado === 'inventario' ? "0 4px 6px -1px rgba(0,0,0,0.02)" : "none", borderLeft: reporteSeleccionado === 'inventario' ? `4px solid ${colorAdmin}` : "1px solid #e2e8f0", cursor: "pointer", textAlign: "left" }}
        >
          <FiBarChart2 size={20} style={{ color: reporteSeleccionado === 'inventario' ? colorAdmin : "#94a3b8", marginBottom: "0.5rem" }} />
          <div style={{ fontWeight: "700", color: "#1e293b", fontSize: "0.9rem" }}>Inventario Logístico</div>
          <small style={{ color: "#64748b", fontSize: "0.75rem" }}>Vehículos, carritos y personal</small>
        </button>
      </div>

      {/* 3. Panel de Gráficos */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
        
        {/* PESTAÑA CENSO */}
        {reporteSeleccionado === 'censo' && (
          <div>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#1e293b" }}>Relación de Unidades versus Propietarios Titulares</h3>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center" }}>
              <div style={{ flex: "1", minWidth: "260px" }}>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={datosDistribuciónInmuebles}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      dataKey="cantidad"
                    >
                      {datosDistribuciónInmuebles.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} registros`, 'Cantidad']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ flex: "1", minWidth: "280px", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: "700", color: "#334155" }}>Resumen Estructural</h4>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Total Torres Físicas</span>
                  <strong style={{ color: "#0f172a" }}>{metricas.totalTorres} bloques</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Total Pisos Distribuidos</span>
                  <strong style={{ color: "#0f172a" }}>{metricas.totalPisos} niveles</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA INVENTARIO */}
        {reporteSeleccionado === 'inventario' && (
          <div>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#1e293b" }}>Métricas de Activos Circulantes y Personal</h3>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosInventarioBienes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip formatter={(value) => [`${value} asignados`, 'Total']} />
                <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
                  {datosInventarioBienes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 4. Glosa Unificada */}
        <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
          <small style={{ color: "#64748b", fontSize: "0.8rem", display: "block", fontWeight: "500" }}>
            <strong>Glosa Informativa:</strong> Este módulo compila las analíticas consolidadas de la base de datos de Spring Boot. 
            {reporteSeleccionado === 'censo' && " Los datos de distribución inmobiliaria facilitan la auditoría censal de torres y departamentos frente a sus titulares."}
            {reporteSeleccionado === 'inventario' && " Las barras reflejan el inventario total de activos vehiculares, carritos comunes de compras y personal de vigilancia."}
          </small>
        </div>

      </div>

    </div>
  )
}