import React, { useState, useEffect } from 'react'
import { FiSettings, FiHome, FiMapPin, FiSave, FiTruck, FiClock, FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { getCondominiums, getAdminCondoConfig, updateAdminCondoConfig, extractItems } from '../../services/api'

const colorSuper = "rgb(124,58,237)"

const globalResponsive = `
@media (max-width: 767px) {
  .global-card-padding { padding: 1rem !important; }
}
`;

const estiloInput = {
  width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem",
  border: "1px solid #cbd5e1", fontSize: "0.9rem", color: "#334155",
  backgroundColor: "#ffffff", boxSizing: "border-box", outline: "none"
};

const initialForm = {
  maxAutos: 0,
  maxMotos: 0,
  penalizacionPorMin: 0,
  maxTiempoPrestamoMin: 0,
  maxEstacionamientosPorDepto: 0,
  maxCarritosPorDepto: 0,
  maxVehiculosPorDepto: 0,
  maxInquilinosPorDepto: 0
};

export default function GlobalConfiguracion() {
  const [condominios, setCondominios] = useState([])
  const [condoSeleccionado, setCondoSeleccionado] = useState('')
  const [loading, setLoading] = useState(true)
  const [configLoading, setConfigLoading] = useState(false)
  const [configData, setConfigData] = useState(null)
  const [form, setForm] = useState({ ...initialForm })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    getCondominiums().then(d => setCondominios(extractItems(d))).catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!condoSeleccionado) {
      setConfigData(null)
      setForm({ ...initialForm })
      return
    }
    setConfigLoading(true)
    setToast(null)
    getAdminCondoConfig(condoSeleccionado)
      .then(data => {
        setConfigData(data)
        setForm({
          maxAutos: data.maxAutos ?? 0,
          maxMotos: data.maxMotos ?? 0,
          penalizacionPorMin: data.penalizacionPorMin ?? 0,
          maxTiempoPrestamoMin: data.maxTiempoPrestamoMin ?? 0,
          maxEstacionamientosPorDepto: data.maxEstacionamientosPorDepto ?? 0,
          maxCarritosPorDepto: data.maxCarritosPorDepto ?? 0,
          maxVehiculosPorDepto: data.maxVehiculosPorDepto ?? 0,
          maxInquilinosPorDepto: data.maxInquilinosPorDepto ?? 0
        })
      })
      .catch(err => setToast({ type: 'error', message: `Error al cargar: ${err.message}` }))
      .finally(() => setConfigLoading(false))
  }, [condoSeleccionado])

  const handleChange = (field) => (e) => {
    const val = e.target.value === '' ? '' : Number(e.target.value)
    setForm(prev => ({ ...prev, [field]: val }))
  }

  const validar = () => {
    for (const key of Object.keys(form)) {
      if (form[key] === '' || form[key] < 0) {
        setToast({ type: 'error', message: 'Todos los valores deben ser mayores o iguales a 0.' })
        return false
      }
    }
    return true
  }

  const handleSave = async () => {
    if (!validar()) return
    setSaving(true)
    setToast(null)
    try {
      await updateAdminCondoConfig({
        maxAutos: Number(form.maxAutos),
        maxMotos: Number(form.maxMotos),
        penalizacionPorMin: Number(form.penalizacionPorMin),
        maxTiempoPrestamoMin: Number(form.maxTiempoPrestamoMin),
        maxEstacionamientosPorDepto: Number(form.maxEstacionamientosPorDepto),
        maxCarritosPorDepto: Number(form.maxCarritosPorDepto),
        maxVehiculosPorDepto: Number(form.maxVehiculosPorDepto),
        maxInquilinosPorDepto: Number(form.maxInquilinosPorDepto)
      }, condoSeleccionado)
      setToast({ type: 'success', message: 'Configuración guardada exitosamente.' })
    } catch (err) {
      setToast({ type: 'error', message: `Error al guardar: ${err.message}` })
    } finally {
      setSaving(false)
    }
  }

  const condoActual = condominios.find(c => String(c.id) === String(condoSeleccionado))

  const renderField = (label, field, step = "1") => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0.75rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem" }}>
      <span style={{ fontSize: "0.85rem", color: "#334155", fontWeight: "600" }}>{label}</span>
      <input
        type="number"
        step={step}
        min="0"
        value={form[field]}
        onChange={handleChange(field)}
        style={{ width: "110px", padding: "0.4rem 0.6rem", borderRadius: "0.4rem", border: "1px solid #cbd5e1", fontSize: "0.85rem", color: "#334155", backgroundColor: "#ffffff", boxSizing: "border-box", outline: "none", textAlign: "right" }}
      />
    </div>
  )

  if (loading) {
    return (
      <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", color: "#64748b", fontWeight: "600", textAlign: "center" }}>
        Sincronizando.
      </div>
    )
  }

  return (
    <div className="global-card-padding" style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      <style>{globalResponsive}</style>

      {toast && (
        <div style={{
          position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 9999,
          display: "flex", alignItems: "center", gap: "0.6rem",
          padding: "0.9rem 1.5rem", borderRadius: "0.75rem",
          backgroundColor: toast.type === 'success' ? '#f0fdf4' : '#fef2f2',
          border: toast.type === 'success' ? '1px solid #86efac' : '1px solid #fca5a5',
          color: toast.type === 'success' ? '#166534' : '#991b1b',
          fontSize: "0.9rem", fontWeight: "600", boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          {toast.type === 'success' ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} style={{ background: "none", border: "none", cursor: "pointer", marginLeft: "0.5rem", color: "inherit", fontSize: "1.1rem", lineHeight: 1 }}>&times;</button>
        </div>
      )}

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Configuraci&oacute;n Global</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>L&iacute;mites operacionales y reglas de negocio por condominio</p>
      </div>

      <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <div style={{ width: "100%", maxWidth: "280px" }}>
          <select style={estiloInput} value={condoSeleccionado} onChange={(e) => setCondoSeleccionado(e.target.value)}>
            <option value="">Seleccionar condominio</option>
            {condominios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      </div>

      {!condoSeleccionado ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          <FiSettings size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
          <p>Selecciona un condominio para gestionar su configuraci&oacute;n</p>
        </div>
      ) : configLoading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          <FiLoader size={36} style={{ marginBottom: "1rem", opacity: 0.4, animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <p>Cargando configuraci&oacute;n...</p>
        </div>
      ) : configData ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ backgroundColor: "rgba(124,58,237,0.1)", padding: "0.65rem", borderRadius: "0.65rem" }}>
                  <FiHome size={22} color={colorSuper} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>{condoActual?.nombre}</h3>
                  <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <FiMapPin size={12} /> {condoActual?.direccion || ''}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: "1rem", borderTop: "1px solid #f1f5f9", paddingTop: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem" }}>
                    <FiTruck size={14} color="#94a3b8" />
                    <div style={{ flex: 1, fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>Control vehicular</div>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700" }}>{form.maxVehiculosPorDepto} veh&iacute;culos/depto</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem" }}>
                    <FiSettings size={14} color="#94a3b8" />
                    <div style={{ flex: 1, fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>Estacionamientos</div>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700" }}>{form.maxEstacionamientosPorDepto} /depto</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem" }}>
                    <FiClock size={14} color="#94a3b8" />
                    <div style={{ flex: 1, fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>Pr&eacute;stamos y multas</div>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700" }}>{form.maxTiempoPrestamoMin} min, ${form.penalizacionPorMin}/min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiTruck size={16} color={colorSuper} /> Veh&iacute;culos
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {renderField("M&aacute;ximo autos", "maxAutos")}
                {renderField("M&aacute;ximo motos", "maxMotos")}
                {renderField("M&aacute;ximo veh&iacute;culos por departamento", "maxVehiculosPorDepto")}
              </div>
            </div>

            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiSettings size={16} color={colorSuper} /> Estacionamientos
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {renderField("M&aacute;ximo estacionamientos por departamento", "maxEstacionamientosPorDepto")}
              </div>
            </div>

            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiTruck size={16} color={colorSuper} /> Carritos
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {renderField("M&aacute;ximo carritos por departamento", "maxCarritosPorDepto")}
              </div>
            </div>

            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiClock size={16} color={colorSuper} /> Pr&eacute;stamos
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {renderField("Tiempo m&aacute;ximo de pr&eacute;stamo (minutos)", "maxTiempoPrestamoMin")}
                {renderField("Penalizaci&oacute;n por minuto", "penalizacionPorMin", "0.01")}
              </div>
            </div>

            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiHome size={16} color={colorSuper} /> Inquilinos
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {renderField("M&aacute;ximo inquilinos por departamento", "maxInquilinosPorDepto")}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.75rem 2rem", borderRadius: "0.5rem", border: "none",
                backgroundColor: saving ? "#a78bfa" : colorSuper, color: "#ffffff",
                fontSize: "0.95rem", fontWeight: "700", cursor: saving ? "not-allowed" : "pointer",
                transition: "background-color 0.2s"
              }}
            >
              {saving ? <FiLoader size={18} style={{ animation: "spin 1s linear infinite" }} /> : <FiSave size={18} />}
              {saving ? 'Guardando...' : 'Guardar configuraci&oacute;n'}
            </button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          <FiAlertCircle size={36} style={{ marginBottom: "1rem", opacity: 0.4 }} />
          <p>No se pudo cargar la configuraci&oacute;n de este condominio.</p>
        </div>
      )}
    </div>
  )
}
