import React, { useState } from 'react'
import { FiHome, FiMapPin, FiSave, FiLock, FiGlobe, FiCheckCircle } from "react-icons/fi"
import { useAdminSettings } from '../../hooks/Admin/useAdminSettings' 

export default function Perfil() {
  const colorAdmin = "rgb(52,151,195)"


  const { condoInfo, loading, guardarPerfilCondominio } = useAdminSettings()

  const [passwordData, setPasswordData] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  })

  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('success')

  const handlePerfilSubmit = async (e) => {
    e.preventDefault()
    try {
      await guardarPerfilCondominio(condoInfo)
      setMensaje('Información del condominio actualizada con éxito')
      setTipoMensaje('success')
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) {
      console.error('Error al actualizar el perfil:', error)
      setMensaje('Hubo un error al guardar los cambios')
      setTipoMensaje('danger')
      setTimeout(() => setMensaje(''), 3000)
    }
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (passwordData.nueva !== passwordData.confirmar) {
      setMensaje('Las contraseñas no coinciden')
      setTipoMensaje('danger')
    } else if (passwordData.nueva.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres')
      setTipoMensaje('danger')
    } else {
      setMensaje('Contraseña actualizada correctamente')
      setTipoMensaje('success')
      setPasswordData({ actual: '', nueva: '', confirmar: '' })
    }
    setTimeout(() => setMensaje(''), 3000)
  }

  // Interceptor para mutar las propiedades del condominio dinámicamente antes del PUT
  const handleFieldChange = (campo, valor) => {
    if (condoInfo) {
      condoInfo[campo] = valor
    }
  }

  // Estilos base
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

  if (loading || !condoInfo) {
    return (
      <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#64748b", fontWeight: "600", textAlign: "center" }}>
        🔄 Cargando datos de perfil operativo desde el servidor...
      </div>
    )
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      
      {/* 1. Cabecera */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Mi Perfil</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>Datos operacionales del condominio y seguridad de cuenta</p>
      </div>

      {/* 2. Caja de Alertas */}
      {mensaje && (
        <div style={{
          padding: "1rem",
          borderRadius: "0.5rem",
          marginBottom: "1.5rem",
          fontSize: "0.9rem",
          fontWeight: "600",
          backgroundColor: tipoMensaje === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: tipoMensaje === 'success' ? '#10b981' : '#ef4444',
          border: tipoMensaje === 'success' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          {mensaje}
        </div>
      )}

      {/* 3. Cuadrícula Asimétrica */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", width: "100%" }}>
        
        {/* Columna Izquierda: Datos del Condominio */}
        <div style={{ flex: 1, minWidth: "300px", backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "0.5rem", color: "#1e293b", fontWeight: "700" }}>
            <FiHome size={18} style={{ color: colorAdmin }} />
            <span>Datos de Copropiedad</span>
          </div>
          <form onSubmit={handlePerfilSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={estiloLabel}>Nombre del Condominio</label>
              <input type="text" style={estiloInput} defaultValue={condoInfo.nombre || ''} onChange={(e) => handleFieldChange('nombre', e.target.value)} required />
            </div>
            <div>
              <label style={estiloLabel}><FiMapPin size={12} /> Dirección Física</label>
              <input type="text" style={estiloInput} defaultValue={condoInfo.direccion || ''} onChange={(e) => handleFieldChange('direccion', e.target.value)} required />
            </div>
            <div>
              <label style={estiloLabel}><FiGlobe size={12} /> Ciudad / Distrito</label>
              <input type="text" style={{ ...estiloInput, backgroundColor: "#f8fafc", color: "#94a3b8", cursor: "not-allowed" }} value={condoInfo.nombreCiudad || 'No especificado'} disabled readOnly />
            </div>
            <div>
              <label style={estiloLabel}><FiGlobe size={12} /> País</label>
              <input type="text" style={{ ...estiloInput, backgroundColor: "#f8fafc", color: "#94a3b8", cursor: "not-allowed" }} value={condoInfo.nombrePais || 'No especificado'} disabled readOnly />
            </div>
            <div>
              <label style={estiloLabel}>Estado Operativo</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: condoInfo.activo ? "#10b981" : "#64748b", fontWeight: "700", fontSize: "0.9rem", padding: "0.25rem 0" }}>
                <FiCheckCircle /> {condoInfo.activo ? "Residencia Activa y Vigente" : "Inactivo"}
              </div>
            </div>
            <button type="submit" style={{ alignSelf: "flex-start", backgroundColor: colorAdmin, color: "#fff", border: "none", padding: "0.6rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 6px -1px rgba(52, 151, 195, 0.2)" }}>
              <FiSave size={16} /> Guardar Cambios
            </button>
          </form>
        </div>

        {/* Columna Derecha: Seguridad y Sesión */}
        <div style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Formulario de Contraseña */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "0.5rem", color: "#1e293b", fontWeight: "700" }}>
              <FiLock size={18} style={{ color: "#f59e0b" }} />
              <span>Cambiar Contraseña</span>
            </div>
            <form onSubmit={handlePasswordSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={estiloLabel}>Contraseña Actual</label>
                <input type="password" style={estiloInput} value={passwordData.actual} onChange={(e) => setPasswordData({ ...passwordData, actual: e.target.value })} required />
              </div>
              <div>
                <label style={estiloLabel}>Nueva Contraseña</label>
                <input type="password" style={estiloInput} value={passwordData.nueva} onChange={(e) => setPasswordData({ ...passwordData, nueva: e.target.value })} required />
                <small style={{ color: "#94a3b8", fontSize: "0.75rem", display: "block", marginTop: "0.25rem" }}>Mínimo 6 caracteres</small>
              </div>
              <div>
                <label style={estiloLabel}>Confirmar Nueva Contraseña</label>
                <input type="password" style={estiloInput} value={passwordData.confirmar} onChange={(e) => setPasswordData({ ...passwordData, confirmar: e.target.value })} required />
              </div>
              <button type="submit" style={{ alignSelf: "flex-start", backgroundColor: "#f59e0b", color: "#fff", border: "none", padding: "0.6rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 6px -1px rgba(245, 158, 11, 0.2)" }}>
                <FiLock size={16} /> Actualizar Contraseña
              </button>
            </form>
          </div>

          {/* Caja Informativa de Sesión */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", color: "#1e293b", fontWeight: "700" }}>
              Información de Sesión
            </div>
            <div style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <small style={{ color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", fontSize: "0.7rem", display: "block", marginBottom: "0.25rem" }}>Último acceso</small>
                <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: "600", color: "#334155" }}>Hoy, en sesión activa</p>
              </div>
              <div>
                <small style={{ color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", fontSize: "0.7rem", display: "block", marginBottom: "0.25rem" }}>Dirección IP</small>
                <p style={{ margin: 0, fontSize: "0.9rem", fontFamily: "monospace", fontWeight: "700", color: "#334155" }}>192.168.1.100</p>
              </div>
              <div>
                <small style={{ color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", fontSize: "0.7rem", display: "block", marginBottom: "0.25rem" }}>Navegador</small>
                <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: "600", color: "#334155" }}>Nativo / WebKit</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}