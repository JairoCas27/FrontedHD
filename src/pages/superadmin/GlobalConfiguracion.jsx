import React, { useState, useEffect } from 'react'
import { FiSave, FiSettings, FiTruck, FiClock, FiGrid } from "react-icons/fi"
import { getCondominiums, getAdminCondoConfig, updateAdminCondoConfig } from '../../services/api'

const colorSuper = "rgb(124,58,237)"

export default function GlobalConfiguracion() {
  const [condominios, setCondominios] = useState([])
  const [condoSeleccionado, setCondoSeleccionado] = useState('')
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorCondo, setErrorCondo] = useState('')
  const [activeTab, setActiveTab] = useState('vehiculos')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    getCondominiums().then(data => {
      setCondominios(data?.items || data || [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!condoSeleccionado) return
    setLoading(true)
    setErrorCondo('')
    getAdminCondoConfig()
      .then(data => setConfig(data))
      .catch(err => {
        setErrorCondo(err.message || 'Error. Verifica que el backend soporte superadmin para configuración.')
        setConfig(null)
      })
      .finally(() => setLoading(false))
  }, [condoSeleccionado])

  const handleNumberChange = (campo, valor) => {
    if (config) {
      setConfig({ ...config, [campo]: Number(valor) || 0 })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!config) return
    try {
      const data = await updateAdminCondoConfig(config)
      setConfig(data)
      setMensaje('Parámetros actualizados correctamente')
      setTimeout(() => setMensaje(''), 3000)
    } catch (error) {
      alert('Error al guardar: ' + (error.message || ''))
    }
  }

  const estiloInput = {
    width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem",
    border: "1px solid #cbd5e1", fontSize: "0.9rem", color: "#334155",
    backgroundColor: "#ffffff", boxSizing: "border-box", outline: "none"
  }
  const estiloLabel = {
    display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#475569",
    marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.025em"
  }
  const estiloTabBoton = (tabId) => ({
    flex: 1, padding: "1rem", border: "none", background: "none",
    borderBottom: activeTab === tabId ? `3px solid ${colorSuper}` : "3px solid transparent",
    color: activeTab === tabId ? colorSuper : "#64748b", fontWeight: "700", fontSize: "0.9rem",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "all 0.2s"
  })

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Configuración Global</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>Límites operacionales y reglas de negocio por condominio</p>
      </div>

      <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
        <div style={{ width: "280px" }}>
          <select style={estiloInput} value={condoSeleccionado}
            onChange={(e) => { setCondoSeleccionado(e.target.value); setMensaje(''); setConfig(null) }}>
            <option value="">Seleccionar condominio</option>
            {condominios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      </div>

      {errorCondo && (
        <div style={{ padding: "1rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "0.75rem", color: "#dc2626", marginBottom: "1rem", fontWeight: "600", textAlign: "center" }}>
          {errorCondo}
        </div>
      )}

      {!condoSeleccionado ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          <FiSettings size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
          <p>Selecciona un condominio para gestionar su configuración</p>
        </div>
      ) : loading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#64748b", fontWeight: "600" }}>Sincronizando.</div>
      ) : config ? (
        <>
          {mensaje && (
            <div style={{ padding: "1rem", borderRadius: "0.5rem", marginBottom: "1.5rem", fontSize: "0.9rem", fontWeight: "600", backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
              <button type="button" style={estiloTabBoton('vehiculos')} onClick={() => setActiveTab('vehiculos')}><FiTruck /> Control Vehicular</button>
              <button type="button" style={estiloTabBoton('logistica')} onClick={() => setActiveTab('logistica')}><FiSettings /> Cuotas Globales</button>
              <button type="button" style={estiloTabBoton('prestamos')} onClick={() => setActiveTab('prestamos')}><FiClock /> Préstamos y Multas</button>
            </div>

            <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", marginBottom: "2rem" }}>
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

            <div style={{ textAlign: "right" }}>
              <button type="submit" style={{ backgroundColor: colorSuper, color: "#fff", border: "none", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 6px -1px rgba(124,58,237,0.2)" }}>
                <FiSave size={18} /> Guardar Configuración
              </button>
            </div>
          </form>
        </>
      ) : null}
    </div>
  )
}
