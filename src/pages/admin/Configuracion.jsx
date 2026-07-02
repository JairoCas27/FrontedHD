import React, { useState } from 'react'
import { FiSave, FiSettings, FiTruck, FiClock, FiUsers } from "react-icons/fi"
import { useAdminSettings } from '../../hooks/Admin/useAdminSettings' 

export default function Configuracion() {
  const colorAdmin = "rgb(52,151,195)"
  const [activeTab, setActiveTab] = useState('vehiculos')
  const [mensaje, setMensaje] = useState('')

  //  Cargamos los estados reales desde el Hook unificado
  const { config, loading, guardarConfiguracion } = useAdminSettings()

  // Guardado real enviando la estructura exacta numérica a Spring Boot
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await guardarConfiguracion(config)
      setMensaje('Parámetros del sistema actualizados correctamente')
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) {
      console.error('Error al actualizar la configuración:', error)
      alert('Hubo un problema al guardar la configuración en la base de datos.')
    }
  }

  // Interceptor para mutar los datos numéricos de forma limpia antes del PUT
  const handleNumberChange = (campo, valor) => {
    if (config) {
      config[campo] = Number(valor) || 0
    }
  }

  // Estilos unificados
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

  if (loading || !config) {
    return (
      <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#64748b", fontWeight: "600", textAlign: "center" }}>
        🔄 Sincronizando parámetros globales con el servidor core.
      </div>
    )
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      
      {/* 1. Cabecera */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Configuración</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>Límites operacionales y reglas de negocio del condominio</p>
      </div>

      {/* 2. Alerta */}
      {mensaje && (
        <div style={{ padding: "1rem", borderRadius: "0.5rem", marginBottom: "1.5rem", fontSize: "0.9rem", fontWeight: "600", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
          {mensaje}
        </div>
      )}

      {/* 3. Formulario Maestro Sincronizado */}
      <form onSubmit={handleSubmit}>
        
        {/* Barra de Navegación Filtrada por el Swagger Real */}
        <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
          <button type="button" style={estiloTabBoton('vehiculos')} onClick={() => setActiveTab('vehiculos')}><FiTruck /> Control Vehicular</button>
          <button type="button" style={estiloTabBoton('logistica')} onClick={() => setActiveTab('logistica')}><FiSettings /> Cuotas Globales</button>
          <button type="button" style={estiloTabBoton('prestamos')} onClick={() => setActiveTab('prestamos')}><FiClock /> Préstamos y Multas</button>
        </div>

        {/* Contenedor Único de Tarjeta */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", marginBottom: "2rem" }}>
          
          {/* PESTAÑA VEHÍCULOS */}
          {activeTab === 'vehiculos' && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
              <div>
                <label style={estiloLabel}>Máximo de Autos Permitidos</label>
                <input type="number" min="0" style={estiloInput} defaultValue={config.maxAutos ?? 0} onChange={(e) => handleNumberChange('maxAutos', e.target.value)} />
              </div>
              <div>
                <label style={estiloLabel}>Máximo de Motos Permitidas</label>
                <input type="number" min="0" style={estiloInput} defaultValue={config.maxMotos ?? 0} onChange={(e) => handleNumberChange('maxMotos', e.target.value)} />
              </div>
              <div>
                <label style={estiloLabel}>Límite Total de Vehículos en Tránsito</label>
                <input type="number" min="0" style={estiloInput} defaultValue={config.maxVehiculos ?? 0} onChange={(e) => handleNumberChange('maxVehiculos', e.target.value)} />
              </div>
            </div>
          )}

          {/* PESTAÑA CUOTAS GLOBALES */}
          {activeTab === 'logistica' && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
              <div>
                <label style={estiloLabel}>Capacidad Máxima de Estacionamientos</label>
                <input type="number" min="0" style={estiloInput} defaultValue={config.maxEstacionamientos ?? 0} onChange={(e) => handleNumberChange('maxEstacionamientos', e.target.value)} />
              </div>
              <div>
                <label style={estiloLabel}>Máximo de Inquilinos por Departamento</label>
                <input type="number" min="0" style={estiloInput} defaultValue={config.maxInquilinos ?? 0} onChange={(e) => handleNumberChange('maxInquilinos', e.target.value)} />
              </div>
              <div>
                <label style={estiloLabel}>Total Carritos de Compras Comunes</label>
                <input type="number" min="0" style={estiloInput} defaultValue={config.maxCarritos ?? 0} onChange={(e) => handleNumberChange('maxCarritos', e.target.value)} />
              </div>
            </div>
          )}

          {/* PESTAÑA PRÉSTAMOS Y PENALIZACIONES */}
          {activeTab === 'prestamos' && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
              <div>
                <label style={estiloLabel}>Tiempo Máximo Préstamo Carritos (Minutos)</label>
                <input type="number" min="0" style={estiloInput} defaultValue={config.maxTiempoPrestamoMin ?? 0} onChange={(e) => handleNumberChange('maxTiempoPrestamoMin', e.target.value)} />
              </div>
              <div>
                <label style={estiloLabel}>Penalización por Minuto de Demora (S/.)</label>
                <input type="number" step="0.1" min="0" style={estiloInput} defaultValue={config.penalizacionPorMin ?? 0} onChange={(e) => handleNumberChange('penalizacionPorMin', e.target.value)} />
              </div>
            </div>
          )}

        </div>

        {/* Botón Guardar */}
        <div style={{ textAlign: "right" }}>
          <button type="submit" style={{ backgroundColor: colorAdmin, color: "#fff", border: "none", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 6px -1px rgba(52, 151, 195, 0.2)" }}>
            <FiSave size={18} /> Guardar Configuración
          </button>
        </div>

      </form>
    </div>
  )
}