import React, { useState } from 'react'
import { FiShield, FiSearch, FiX } from "react-icons/fi"
import { useAdminLogs } from '../../hooks/Admin/useAdminLogs' 

export default function Auditoria() {
  const colorAdmin = "rgb(52,151,195)"
  
  const { logs, loading } = useAdminLogs()
  const [busqueda, setBusqueda] = useState('')

  // 🟢 CORREGIDO: Filtrado ultra seguro a prueba de objetos o propiedades nulas
  const logsFiltrados = (logs || []).filter(log => {
    const termino = (busqueda || '').toLowerCase().trim()
    if (!termino) return true

    const placa = (log.placa || '').toLowerCase()
    const ocupante = (log.ocupante || '').toLowerCase()
    const solicitante = (log.nombreSolicitante || '').toLowerCase()

    return placa.includes(termino) || ocupante.includes(termino) || solicitante.includes(termino)
  })

  // 🟢 Función auxiliar para formatear fechas de manera segura sin romper la UI
  const formatearFecha = (fechaString) => {
    if (!fechaString || fechaString === '---') return '---'
    const fecha = new Date(fechaString)
    return isNaN(fecha.getTime()) ? fechaString : fecha.toLocaleString('es-PE')
  }

  const estiloInput = {
    width: "100%",
    padding: "0.65rem 0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
    color: "#334155",
    backgroundColor: "#ffffff",
    boxSizing: "border-box",
    outline: "none"
  }

  const estiloLabel = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "0.4rem",
    textTransform: "uppercase",
    letterSpacing: "0.025em"
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Auditoría de Accesos</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>Historial y bitácora de control de movimientos vehiculares y préstamos comunes</p>
      </div>

      <div style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "end" }}>
          
          <div style={{ flex: 1, minWidth: "280px" }}>
            <label style={estiloLabel}><FiSearch style={{ marginRight: "4px" }} /> Filtrar Registro</label>
            <input 
              type="text" 
              style={estiloInput} 
              placeholder="Buscar por placa, conductor o solicitante."
              value={busqueda} 
              onChange={(e) => setBusqueda(e.target.value)} 
            />
          </div>

          <div>
            <button 
              type="button"
              onClick={() => setBusqueda('')}
              style={{ padding: "0.65rem 1rem", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", color: "#64748b", borderRadius: "0.5rem", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <FiX style={{ marginRight: "4px" }} /> Limpiar Filtro
            </button>
          </div>

        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#64748b", fontWeight: "600" }}>
          Sincronizando.
        </div>
      ) : (
        <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", width: "100%", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "1rem 1.5rem", width: "15%" }}>Recurso / Tipo</th>
                  <th style={{ padding: "1rem", width: "15%" }}>Identificador / Placa</th>
                  <th style={{ padding: "1rem", width: "25%" }}>Responsable / Ocupante</th>
                  <th style={{ padding: "1rem", width: "15%" }}>Fecha Entrada / Préstamo</th>
                  <th style={{ padding: "1rem", width: "15%" }}>Fecha Salida / Devolución</th>
                  <th style={{ padding: "1rem 1.5rem", width: "15%" }}>Penalización</th>
                </tr>
              </thead>
              <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                {logsFiltrados.map((log) => {
                  const esPrestamoItem = log.tipo === 'Carrito' || !log.placa;
                  const entradaPintar = log.fechaEntrada || log.fechaPrestamo || '---';
                  const salidaPintar = log.fechaSalida || log.fechaDevolucion || '---';
                  const responsable = log.ocupante || log.nombreSolicitante || 'No especificado';

                  return (
                    <tr key={log.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span style={{ backgroundColor: esPrestamoItem ? "rgba(245, 158, 11, 0.1)" : "rgba(52, 151, 195, 0.1)", color: esPrestamoItem ? "#f59e0b" : colorAdmin, padding: "0.25rem 0.5rem", borderRadius: "0.375rem", fontSize: "0.75rem", fontWeight: "700" }}>
                          {log.tipo || 'Vehículo'}
                        </span>
                      </td>
                      <td style={{ padding: "1rem", fontFamily: "monospace", fontWeight: "700", color: "#0f172a" }}>
                        {log.placa || `CÓD-${log.id}`}
                      </td>
                      <td style={{ padding: "1rem", color: "#334155", fontWeight: "600" }}>
                        {responsable}
                      </td>
                      <td style={{ padding: "1rem", color: "#64748b", fontSize: "0.8rem" }}>
                        {/* 🟢 CORREGIDO: Formateador a prueba de errores de casteo */}
                        {formatearFecha(entradaPintar)}
                      </td>
                      <td style={{ padding: "1rem", color: "#64748b", fontSize: "0.8rem" }}>
                        {/* 🟢 CORREGIDO: Formateador a prueba de errores de casteo */}
                        {salidaPintar !== '---' ? formatearFecha(salidaPintar) : 'En curso / Pendiente'}
                      </td>
                      <td style={{ padding: "1rem 1.5rem", fontWeight: "700", color: log.penalizacion > 0 ? "#ef4444" : "#10b981" }}>
                        {log.penalizacion > 0 ? `S/ ${log.penalizacion}` : 'Ninguna'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {logsFiltrados.length === 0 && (
            <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#94a3b8" }}>
              <FiShield size={44} style={{ color: "#cbd5e1", marginBottom: "1rem" }} />
              <h5 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#64748b" }}>No se encontraron movimientos en la bitácora</h5>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#94a3b8" }}>No hay registros que coincidan con la búsqueda actual.</p>
            </div>
          )}
        </div>
      )}

    </div>
  )
}