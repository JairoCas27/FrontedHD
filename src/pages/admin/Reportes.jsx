import React, { useState } from 'react'
import { FiBarChart2, FiDownload, FiCalendar, FiPieChart } from "react-icons/fi"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import EncabezadoTabla from '../../components/EncabezadoTabla'

// Datos financieros en Soles Peruanos
const datosIngresos = [
  { mes: 'Ene', ingresos: 12500, egresos: 8900 },
  { mes: 'Feb', ingresos: 13200, egresos: 9100 },
  { mes: 'Mar', ingresos: 14100, egresos: 9500 },
  { mes: 'Abr', ingresos: 13800, egresos: 9300 },
  { mes: 'May', ingresos: 14500, egresos: 9800 },
  { mes: 'Jun', ingresos: 15200, egresos: 10100 },
]

// Datos para el gráfico de pastel
const datosAccesos = [
  { tipo: 'Residentes', cantidad: 1250, descripcion: 'Propietarios e inquilinos' },
  { tipo: 'Visitas', cantidad: 450, descripcion: 'Invitados de residentes' },
  { tipo: 'Proveedores', cantidad: 180, descripcion: 'Delivery, servicios, repartos' },
]

// Datos para el gráfico de barras de ocupación de estacionamientos
const datosEstacionamientos = [
  { estado: 'Ocupados', cantidad: 267, explicacion: 'Plazas con vehículo estacionado', color: '#ef4444' }, // Rose/Red
  { estado: 'Disponibles', cantidad: 45, explicacion: 'Plazas libres para usar', color: '#10b981' }, // Emerald
  { estado: 'Mantención', cantidad: 30, explicacion: 'Plazas en reparación o limpieza', color: '#f59e0b' }, // Amber
]

const COLORS = ['#3497C3', '#10b981', '#f59e0b']

const totalPlazas = datosEstacionamientos.reduce((sum, item) => sum + item.cantidad, 0)
const porcentajeOcupacion = Math.round((datosEstacionamientos[0].cantidad / totalPlazas) * 100)

export default function Reportes() {
  const colorAdmin = "rgb(52,151,195)"
  const [reporteSeleccionado, setReporteSeleccionado] = useState('accesos')

  const handleExportar = () => {
    alert('Función de exportación en desarrollo')
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
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

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      
      {/* 1. Encabezado Reutilizable */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Reportes</h1>
          <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem", margin: '0.25rem 0 0 0' }}>Métricas y exportación de datos operativos</p>
        </div>
        <button 
          onClick={handleExportar}
          style={{ backgroundColor: "#10b981", color: "#fff", border: "none", padding: "0.6rem 1.25rem", borderRadius: "0.75rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)" }}
        >
          <FiDownload size={16} /> Exportar Datos
        </button>
      </div>

      {/* 2. Selector de Pestañas Tipo Tarjeta */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <button
          onClick={() => setReporteSeleccionado('accesos')}
          style={{ padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", backgroundColor: reporteSeleccionado === 'accesos' ? "#ffffff" : "transparent", boxShadow: reporteSeleccionado === 'accesos' ? "0 4px 6px -1px rgba(0,0,0,0.02)" : "none", borderLeft: reporteSeleccionado === 'accesos' ? `4px solid ${colorAdmin}` : "1px solid #e2e8f0", cursor: "pointer", textAlign: "left" }}
        >
          <FiBarChart2 size={20} style={{ color: reporteSeleccionado === 'accesos' ? colorAdmin : "#94a3b8", marginBottom: "0.5rem" }} />
          <div style={{ fontWeight: "700", color: "#1e293b", fontSize: "0.9rem" }}>Reporte de Accesos</div>
          <small style={{ color: "#64748b", fontSize: "0.75rem" }}>Tráfico de personas y visitas</small>
        </button>

        <button
          onClick={() => setReporteSeleccionado('financiero')}
          style={{ padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", backgroundColor: reporteSeleccionado === 'financiero' ? "#ffffff" : "transparent", boxShadow: reporteSeleccionado === 'financiero' ? "0 4px 6px -1px rgba(0,0,0,0.02)" : "none", borderLeft: reporteSeleccionado === 'financiero' ? `4px solid ${colorAdmin}` : "1px solid #e2e8f0", cursor: "pointer", textAlign: "left" }}
        >
          <FiPieChart size={20} style={{ color: reporteSeleccionado === 'financiero' ? colorAdmin : "#94a3b8", marginBottom: "0.5rem" }} />
          <div style={{ fontWeight: "700", color: "#1e293b", fontSize: "0.9rem" }}>Reporte Financiero</div>
          <small style={{ color: "#64748b", fontSize: "0.75rem" }}>Balance de fondo común (S/.)</small>
        </button>

        <button
          onClick={() => setReporteSeleccionado('estacionamientos')}
          style={{ padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", backgroundColor: reporteSeleccionado === 'estacionamientos' ? "#ffffff" : "transparent", boxShadow: reporteSeleccionado === 'estacionamientos' ? "0 4px 6px -1px rgba(0,0,0,0.02)" : "none", borderLeft: reporteSeleccionado === 'estacionamientos' ? `4px solid ${colorAdmin}` : "1px solid #e2e8f0", cursor: "pointer", textAlign: "left" }}
        >
          <FiBarChart2 size={20} style={{ color: reporteSeleccionado === 'estacionamientos' ? colorAdmin : "#94a3b8", marginBottom: "0.5rem" }} />
          <div style={{ fontWeight: "700", color: "#1e293b", fontSize: "0.9rem" }}>Estacionamientos</div>
          <small style={{ color: "#64748b", fontSize: "0.75rem" }}>Estado de ocupación de cocheras</small>
        </button>
      </div>

      {/* 3. Panel de Gráficos según Pestaña */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
        
        {/* PESTAÑA ACCESOS */}
        {reporteSeleccionado === 'accesos' && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#1e293b" }}>Tráfico de Accesos Semanal por Tipo</h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input type="date" style={estiloInput} />
                <input type="date" style={estiloInput} />
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
              <div style={{ flex: "2", minWidth: "300px" }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { dia: 'Lun', residentes: 145, visitas: 32, proveedores: 12 },
                    { dia: 'Mar', residentes: 178, visitas: 45, proveedores: 15 },
                    { dia: 'Mié', residentes: 210, visitas: 38, proveedores: 18 },
                    { dia: 'Jue', residentes: 192, visitas: 41, proveedores: 14 },
                    { dia: 'Vie', residentes: 225, visitas: 58, proveedores: 22 },
                    { dia: 'Sáb', residentes: 180, visitas: 72, proveedores: 10 },
                    { dia: 'Dom', residentes: 95, visitas: 48, proveedores: 5 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="dia" stroke="#64748b" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="residentes" fill="#3497C3" name="Residentes" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="visitas" fill="#10b981" name="Visitas" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="proveedores" fill="#f59e0b" name="Proveedores" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ flex: "1", minWidth: "250px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={datosAccesos}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={70}
                      dataKey="cantidad"
                    >
                      {datosAccesos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} ingresos`, 'Cantidad']} />
                  </PieChart>
                </ResponsiveContainer>
                <p style={{ margin: "1rem 0 0 0", fontSize: "0.8rem", color: "#64748b", textAlign: "center", fontWeight: "500" }}>Distribución porcentual de ingresos registrados en el periodo</p>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA FINANCIERO */}
        {reporteSeleccionado === 'financiero' && (
          <div>
            <div style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#1e293b" }}>Historial del Fondo Común (Soles Peruanos)</h3>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={datosIngresos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mes" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis tickFormatter={(value) => `S/ ${value}`} stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip formatter={(value) => [`S/ ${value.toLocaleString()}`, '']} />
                <Legend />
                <Line type="monotone" dataKey="ingresos" stroke="#3497C3" strokeWidth={3} name="Ingresos (Cuotas, alquileres, multas)" activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="egresos" stroke="#ef4444" strokeWidth={3} name="Egresos (Gastos operativos)" />
              </LineChart>
            </ResponsiveContainer>

            {/* Tabla Financiera de Alta Fidelidad */}
            <div style={{ marginTop: "2rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", textTransform: "uppercase", fontSize: "11px", borderBottom: "1px solid #e2e8f0" }}>
                    <th style={{ padding: "0.75rem 1rem" }}>Mes</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Ingresos Totales</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Egresos Ejecutados</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Balance Neto</th>
                  </tr>
                </thead>
                <tbody style={{ color: "#334155", fontWeight: "600" }}>
                  {datosIngresos.map((item, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "0.75rem 1rem", color: "#0f172a", fontWeight: "700" }}>{item.mes}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#10b981" }}>{formatCurrency(item.ingresos)}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#ef4444" }}>{formatCurrency(item.egresos)}</td>
                      <td style={{ padding: "0.75rem 1rem", color: "#3497C3" }}>{formatCurrency(item.ingresos - item.egresos)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA ESTACIONAMIENTOS */}
        {reporteSeleccionado === 'estacionamientos' && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#1e293b" }}>Estado de Ocupación Global</h3>
              <span style={{ fontSize: "0.75rem", backgroundColor: "#f1f5f9", color: "#475569", fontWeight: "700", padding: "0.25rem 0.6rem", borderRadius: "0.5rem" }}>Total: {totalPlazas} cocheras</span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
              <div style={{ flex: "1", minWidth: "260px" }}>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={datosEstacionamientos}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      dataKey="cantidad"
                    >
                      {datosEstacionamientos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} plazas`, props.payload.estado]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ flex: "1", minWidth: "280px", display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center" }}>
                <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: "700", color: "#334155" }}>Desglose Operativo</h4>
                {datosEstacionamientos.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: "flex", justifyContext: "space-between", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                      <span style={{ fontWeight: "600" }}><span style={{ color: item.color, marginRight: "4px" }}>●</span> {item.estado}</span>
                      <strong style={{ color: "#0f172a" }}>{item.cantidad} cocheras</strong>
                    </div>
                    <div style={{ width: "100%", height: "6px", backgroundColor: "#f1f5f9", borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{ width: `${(item.cantidad / totalPlazas) * 100}%`, backgroundColor: item.color, height: "100%" }} />
                    </div>
                    <small style={{ color: "#94a3b8", fontSize: "0.7rem", display: "block", marginTop: "0.2rem" }}>{item.explicacion}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. Glosa Explicativa Informativa Unificada */}
        <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
          <small style={{ color: "#64748b", fontSize: "0.8rem", display: "block", fontWeight: "500" }}>
            <strong>Glosa del Sistema:</strong> Este panel compila métricas consolidadas del condominio. 
            {reporteSeleccionado === 'accesos' && " Los accesos diferencian flujos de residentes frente a visitas y personal externo para auditorías de seguridad."}
            {reporteSeleccionado === 'financiero' && " El reporte financiero detalla ingresos por cuotas frente a egresos logísticos de mantenimiento técnico."}
            {reporteSeleccionado === 'estacionamientos' && " La ocupación de cocheras refleja la disponibilidad en tiempo real de espacios asignados versus zonas de mantenimiento."}
          </small>
        </div>

      </div>

    </div>
  )
}