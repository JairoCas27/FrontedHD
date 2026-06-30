import React, { useState, useEffect } from 'react'
import { FiSave, FiGlobe, FiShield, FiBell, FiMail } from "react-icons/fi"
import { getAdminCondoConfig, updateAdminCondoConfig } from '../../services/api' // Ajusta la ruta de tus servicios

export default function Configuracion() {
  const colorAdmin = "rgb(52,151,195)"
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState(null)
  const [mensaje, setMensaje] = useState('')

  // 🔄 Cargar configuración real desde Spring Boot
  useEffect(() => {
    cargarConfiguracion()
  }, [])

  const cargarConfiguracion = async () => {
    try {
      setLoading(true)
      const data = await getAdminCondoConfig()
      setConfig(data)
    } catch (error) {
      console.error('Error al traer la configuración del servidor:', error)
    } finally {
      setLoading(false)
    }
  }

  // 💾 Persistencia real PUT /api/admin/condominium/configuracion
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateAdminCondoConfig(config)
      setMensaje('Configuración guardada correctamente en el servidor')
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) {
      console.error('Error al actualizar la configuración:', error)
      alert('Hubo un problema al guardar la configuración en la base de datos.')
    }
  }

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

  const estiloTabBoton = (tabId) => ({
    flex: 1,
    padding: "1rem",
    border: "none",
    background: "none",
    borderBottom: activeTab === tabId ? `3px solid ${colorAdmin}` : "3px solid transparent",
    color: activeTab === tabId ? colorAdmin : "#64748b",
    fontWeight: "700",
    fontSize: "0.9rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    transition: "all 0.2s"
  })

  // Componente interno para el Switch Premium
  const RenderSwitch = ({ id, label, checked, onChange }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #e2e8f0", marginBottom: "1rem" }}>
      <label htmlFor={id} style={{ fontSize: "0.9rem", fontWeight: "600", color: "#334155", cursor: "pointer", margin: 0 }}>{label}</label>
      <div style={{ position: "relative", width: "44px", height: "24px" }}>
        <input 
          type="checkbox" 
          id={id} 
          checked={checked || false} 
          onChange={onChange} 
          style={{ opacity: 0, width: 0, height: 0 }} 
        />
        <span 
          onClick={onChange}
          style={{
            position: "absolute", inset: 0, cursor: "pointer", borderRadius: "9999px", transition: "0.2s",
            backgroundColor: checked ? colorAdmin : "#cbd5e1",
            boxShadow: checked ? "0 2px 4px rgba(52,151,195,0.2)" : "none"
          }}
        >
          <span style={{
            position: "absolute", height: "18px", width: "18px", left: checked ? "22px" : "3px", bottom: "3px", backgroundColor: "white", borderRadius: "50%", transition: "0.2s"
          }} />
        </span>
      </div>
    </div>
  )

  if (loading || !config) {
    return (
      <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#64748b", fontWeight: "600", textAlign: "center" }}>
        🔄 Cargando parámetros globales desde el backend...
      </div>
    )
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      
      {/* 1. Cabecera */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Configuración</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>Parámetros globales y reglas del condominio</p>
      </div>

      {/* 2. Notificación Alerta */}
      {mensaje && (
        <div style={{ padding: "1rem", borderRadius: "0.5rem", marginBottom: "1.5rem", fontSize: "0.9rem", fontWeight: "600", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
          {mensaje}
        </div>
      )}

      {/* 3. Formulario Maestro */}
      <form onSubmit={handleSubmit}>
        
        {/* Barra de Navegación de Pestañas (Tabs) */}
        <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
          <button type="button" style={estiloTabBoton('general')} onClick={() => setActiveTab('general')}><FiGlobe /> General</button>
          <button type="button" style={estiloTabBoton('horarios')} onClick={() => setActiveTab('horarios')}><FiBell /> Horarios</button>
          <button type="button" style={estiloTabBoton('seguridad')} onClick={() => setActiveTab('seguridad')}><FiShield /> Seguridad</button>
          <button type="button" style={estiloTabBoton('notificaciones')} onClick={() => setActiveTab('notificaciones')}><FiMail /> Notificaciones</button>
        </div>

        {/* Contenedor Único de Tarjeta */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", marginBottom: "2rem" }}>
          
          {/* PESTAÑA GENERAL */}
          {activeTab === 'general' && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
              <div>
                <label style={estiloLabel}>Nombre del Condominio</label>
                <input type="text" style={estiloInput} value={config.nombreCondominio || ''} onChange={(e) => setConfig({ ...config, nombreCondominio: e.target.value })} />
              </div>
              <div>
                <label style={estiloLabel}>Dirección Fiscal</label>
                <input type="text" style={estiloInput} value={config.direccion || ''} onChange={(e) => setConfig({ ...config, direccion: e.target.value })} />
              </div>
              <div>
                <label style={estiloLabel}>Teléfono Central</label>
                <input type="text" style={estiloInput} value={config.telefono || ''} onChange={(e) => setConfig({ ...config, telefono: e.target.value })} />
              </div>
              <div>
                <label style={estiloLabel}>Email de Soporte/Contacto</label>
                <input type="email" style={estiloInput} value={config.email || ''} onChange={(e) => setConfig({ ...config, email: e.target.value })} />
              </div>
            </div>
          )}

          {/* PESTAÑA HORARIOS */}
          {activeTab === 'horarios' && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
                <div>
                  <label style={estiloLabel}>Horario Apertura (Acceso General)</label>
                  <input type="time" style={estiloInput} value={config.horarioInicio || ''} onChange={(e) => setConfig({ ...config, horarioInicio: e.target.value })} />
                </div>
                <div>
                  <label style={estiloLabel}>Horario Cierre (Acceso General)</label>
                  <input type="time" style={estiloInput} value={config.horarioFin || ''} onChange={(e) => setConfig({ ...config, horarioFin: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={estiloLabel}>Límite de visitas diarias por departamento</label>
                <input type="number" min="1" style={estiloInput} value={config.maxVisitasDiarias || 0} onChange={(e) => setConfig({ ...config, maxVisitasDiarias: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
          )}

          {/* PESTAÑA SEGURIDAD */}
          {activeTab === 'seguridad' && (
            <div>
              <RenderSwitch 
                id="acceso-automatico" 
                label="Reconocimiento Inteligente de Placas (Acceso Portón Automático)" 
                checked={config.accesoAutomatico} 
                onChange={() => setConfig({ ...config, accesoAutomatico: !config.accesoAutomatico })} 
              />
              <RenderSwitch 
                id="registro-visitantes" 
                label="Registro Obligatorio de DNI / Datos para Visitantes No Residentes" 
                checked={config.registroVisitantes} 
                onChange={() => setConfig({ ...config, registroVisitantes: !config.registroVisitantes })} 
              />
            </div>
          )}

          {/* PESTAÑA NOTIFICACIONES */}
          {activeTab === 'notificaciones' && (
            <div>
              <RenderSwitch 
                id="notif-email" 
                label="Habilitar envío automático de alertas por Correo Electrónico" 
                checked={config.notificacionesEmail} 
                onChange={() => setConfig({ ...config, notificacionesEmail: !config.notificacionesEmail })} 
              />
              <RenderSwitch 
                id="notif-push" 
                label="Habilitar notificaciones en tiempo real en la App del Propietario (Push)" 
                checked={config.notificacionesPush} 
                onChange={() => setConfig({ ...config, notificacionesPush: !config.notificacionesPush })} 
              />
            </div>
          )}

        </div>

        {/* Botón Guardar Centrado/Alineado */}
        <div style={{ textAlign: "right" }}>
          <button type="submit" style={{ backgroundColor: colorAdmin, color: "#fff", border: "none", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 6px -1px rgba(52, 151, 195, 0.2)" }}>
            <FiSave size={18} /> Guardar Configuración
          </button>
        </div>

      </form>
    </div>
  )
}