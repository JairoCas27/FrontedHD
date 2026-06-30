import React, { useState } from 'react'
import { FiShield, FiSearch, FiFilter, FiX } from "react-icons/fi"
import BadgeEstado from '../../components/BadgeEstado'
import { useAdminLogs } from '../../hooks/Admin/useAdminLogs' 

export default function Auditoria() {
  const colorAdmin = "rgb(52,151,195)"
  
  
  const { logs, loading } = useAdminLogs()
  
  const [filtroModulo, setFiltroModulo] = useState('')
  const [filtroUsuario, setFiltroUsuario] = useState('')

  // Filtrado dinámico sobre los logs de la base de datos
  const logsFiltrados = logs.filter(log => {
    if (filtroModulo && log.modulo !== filtroModulo) return false
    if (filtroUsuario && !log.usuario?.toLowerCase().includes(filtroUsuario.toLowerCase())) return false
    return true
  })

  // Extraer módulos dinámicamente de la data real devuelta por el servidor
  const modulos = [...new Set(logs.map(log => log.modulo).filter(Boolean))]

  // Estilos fijos unificados
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
      
      {/* 1. Cabecera */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Auditoría</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>Logs de operaciones y control de historial del sistema (Bitácora)</p>
      </div>

      {/* 2. Filtros de Búsqueda Estilizados */}
      <div style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "end" }}>
          
          <div style={{ flex: 1, minWidth: "240px" }}>
            <label style={estiloLabel}><FiSearch style={{ marginRight: "4px" }} /> Buscar por Usuario</label>
            <input 
              type="text" 
              style={estiloInput} 
              placeholder="Email o nombre de usuario..." 
              value={filtroUsuario} 
              onChange={(e) => setFiltroUsuario(e.target.value)} 
            />
          </div>

          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={estiloLabel}><FiFilter style={{ marginRight: "4px" }} /> Filtrar por Módulo</label>
            <select style={estiloInput} value={filtroModulo} onChange={(e) => setFiltroModulo(e.target.value)}>
              <option value="">Todos los módulos</option>
              {modulos.map(modulo => (
                <option key={modulo} value={modulo}>{modulo}</option>
              ))}
            </select>
          </div>

          <div style={{ minWidth: "150px" }}>
            <button 
              onClick={() => { setFiltroModulo(''); setFiltroUsuario('') }}
              style={{ width: "100%", padding: "0.65rem 1rem", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", color: "#64748b", borderRadius: "0.5rem", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer" }}
            >
              <FiX style={{ marginRight: "4px" }} /> Limpiar Filtros
            </button>
          </div>

        </div>
      </div>

      {/* 3. Tabla de Logs o Spinner de Carga */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#64748b", fontWeight: "600" }}>
          🔄 Recuperando bitácora de eventos del servidor de seguridad...
        </div>
      ) : (
        <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", width: "100%", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "1rem 1.5rem", width: "20%" }}>Fecha / Hora</th>
                  <th style={{ padding: "1rem", width: "25%" }}>Usuario Ejecutor</th>
                  <th style={{ padding: "1rem", width: "25%" }}>Acción Realizada</th>
                  <th style={{ padding: "1rem", width: "10%" }}>Módulo</th>
                  <th style={{ padding: "1rem", width: "10%" }}>Dirección IP</th>
                  <th style={{ padding: "1rem 1.5rem", width: "10%" }}>Estado</th>
                </tr>
              </thead>
              <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                {logsFiltrados.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem 1.5rem", whiteSpace: "nowrap", color: "#64748b", fontWeight: "500" }}>{log.fecha}</td>
                    <td style={{ padding: "1rem", fontWeight: "700", color: "#0f172a" }}>{log.usuario}</td>
                    <td style={{ padding: "1rem", color: "#334155", fontWeight: "600" }}>{log.accion}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ backgroundColor: "#f1f5f9", color: "#475569", padding: "0.25rem 0.5rem", borderRadius: "0.375rem", fontSize: "0.75rem", fontWeight: "700" }}>
                        {log.modulo}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", fontFamily: "monospace", color: "#64748b", fontWeight: "700" }}>{log.ip}</td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <BadgeEstado estado={log.estado === 'Dentro' || log.estado === 'Éxito' || log.estado === 'Activo' ? 'Activo' : 'Inactivo'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4. Estado vacío / No se encontraron registros */}
          {logsFiltrados.length === 0 && (
            <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#94a3b8" }}>
              <FiShield size={44} style={{ color: "#cbd5e1", marginBottom: "1rem" }} />
              <h5 style={{ margin: 0, fontSize: "1rem", fontWeight: "700", color: "#64748b" }}>No se encontraron registros de auditoría</h5>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#94a3b8" }}>Prueba cambiando los parámetros de búsqueda o limpiando los filtros activos.</p>
            </div>
          )}
        </div>
      )}

    </div>
  )
}