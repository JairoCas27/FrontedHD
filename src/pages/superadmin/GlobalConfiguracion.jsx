import React, { useState, useEffect, useMemo } from 'react'
import { FiSettings, FiHome, FiMapPin, FiSave, FiTruck, FiClock, FiCheckCircle, FiAlertCircle, FiLoader, FiGrid, FiCheck, FiX, FiSearch } from "react-icons/fi"
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

const coloresGradiente = [
  ['#7c3aed', '#6d28d9'],
  ['#ec4899', '#be185d'],
  ['#3b82f6', '#1d4ed8'],
  ['#10b981', '#047857'],
  ['#f59e0b', '#b45309'],
  ['#ef4444', '#b91c1c'],
  ['#06b6d4', '#0891b2'],
  ['#8b5cf6', '#6d28d9'],
]

export default function GlobalConfiguracion() {
  const [condominios, setCondominios] = useState([])
  const [condoSeleccionado, setCondoSeleccionado] = useState('')
  const [showCardSelector, setShowCardSelector] = useState(false)
  const [condoSearch, setCondoSearch] = useState('')

  const filteredCondominios = useMemo(() => {
    if (!condoSearch) return condominios
    const q = condoSearch.toLowerCase()
    return condominios.filter(c =>
      (c.nombre?.toLowerCase() || '').includes(q) ||
      (c.direccion?.toLowerCase() || '').includes(q) ||
      (c.ciudad?.toLowerCase() || '').includes(q)
    )
  }, [condominios, condoSearch])
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
      setToast({ type: 'success', message: 'Configuracion guardada exitosamente.' })
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

      <EncabezadoTabla titulo="Configuracion Global" subtitulo="Limites operacionales y reglas de negocio por condominio" />

            <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes cardSelectedPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* --- VISTA COMPACTA --- */}
      {condoSeleccionado && !showCardSelector && (
        <div style={{
          background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
          borderRadius: '1rem',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          border: '1px solid rgba(124,58,237,0.15)',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              backgroundColor: 'rgba(124,58,237,0.12)',
              padding: '0.6rem',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiGrid size={20} color={colorSuper} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>{condoActual?.nombre || 'Condominio'}</div>
              <div style={{ fontSize: '0.75rem', color: '#6d28d9', fontWeight: '600' }}>
                {condoActual?.direccion || ''} &mdash; {condominios.length} condominios
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCardSelector(true)}
            style={{
              backgroundColor: 'rgba(124,58,237,0.1)',
              color: colorSuper,
              border: '1px solid rgba(124,58,237,0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '0.65rem',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <FiGrid size={14} />
            Seleccionar otro condominio
          </button>
        </div>
      )}

      {/* --- SELECTOR DE CONDOMINIOS (TARJETAS) --- */}
      {(!condoSeleccionado || showCardSelector) && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                backgroundColor: 'rgba(124,58,237,0.1)',
                padding: '0.6rem',
                borderRadius: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FiGrid size={20} color={colorSuper} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                  {condoSeleccionado ? 'Seleccionar otro condominio' : 'Selecciona un condominio'}
                </h2>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                  {condoSearch
                    ? `${filteredCondominios.length} de ${condominios.length} condominios`
                    : `${condominios.length} ${condominios.length === 1 ? 'condominio disponible' : 'condominios disponibles'}`
                  }
                </span>
              </div>
            </div>

            <div style={{ width: '260px', maxWidth: '100%', position: 'relative' }}>
              <FiSearch size={14} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Buscar condominio..."
                value={condoSearch}
                onChange={e => setCondoSearch(e.target.value)}
                style={{ ...estiloInput, paddingLeft: '2.2rem', paddingTop: '0.55rem', paddingBottom: '0.55rem', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1rem'
          }}>
            {filteredCondominios.map((c, idx) => {
              const isSelected = String(c.id) === String(condoSeleccionado)
              const [color1, color2] = coloresGradiente[idx % coloresGradiente.length]

              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => { setCondoSeleccionado(String(c.id)); setShowCardSelector(false) }}
                  style={{
                    background: isSelected
                      ? `linear-gradient(145deg, #ffffff, ${color1}04)`
                      : '#ffffff',
                    border: isSelected
                      ? `2px solid ${color1}`
                      : '1.5px solid #e8ecf1',
                    borderRadius: '1.25rem',
                    boxShadow: isSelected
                      ? `0 0 0 4px ${color1}15, 0 8px 32px ${color1}20, 0 2px 8px rgba(0,0,0,0.04)`
                      : '0 2px 8px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    display: 'block',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    lineHeight: 'inherit',
                    overflow: 'hidden',
                    padding: 0,
                    position: 'relative',
                    textAlign: 'left',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: isSelected ? 'scale(1.03) translateY(-2px)' : 'scale(1) translateY(0)',
                    width: '100%',
                    opacity: condoSeleccionado && !isSelected ? 0.55 : 1,
                    filter: condoSeleccionado && !isSelected ? 'grayscale(0.3) saturate(0.7)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && !condoSeleccionado) {
                      e.currentTarget.style.transform = 'scale(1.03) translateY(-3px)'
                      e.currentTarget.style.boxShadow = `0 12px 40px ${color1}15, 0 4px 12px rgba(0,0,0,0.06)`
                      e.currentTarget.style.borderColor = color1
                    } else if (!isSelected) {
                      e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)'
                      e.currentTarget.style.boxShadow = `0 8px 25px ${color1}10, 0 4px 10px rgba(0,0,0,0.04)`
                      e.currentTarget.style.borderColor = '#cbd5e1'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'scale(1) translateY(0)'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)'
                      e.currentTarget.style.borderColor = '#e8ecf1'
                    }
                  }}
                >
                  {/* Barra decorativa superior con gradiente */}
                  <div style={{
                    height: '6px',
                    background: `linear-gradient(90deg, ${color1}, ${color2}, ${color1})`,
                    backgroundSize: '200% 100%',
                    borderRadius: '1.25rem 1.25rem 0 0',
                  }} />

                  <div style={{ padding: '1.25rem 1.25rem 1.15rem' }}>
                    {/* Icono */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '1rem',
                      background: `linear-gradient(135deg, ${color1}18, ${color2}08)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.85rem',
                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      border: `1px solid ${color1}22`,
                    }}>
                      <FiHome size={24} color={color1} />
                    </div>

                    {/* Nombre */}
                    <h3 style={{
                      margin: 0,
                      fontSize: '1rem',
                      fontWeight: '800',
                      color: '#0f172a',
                      lineHeight: 1.35,
                      marginBottom: '0.3rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      letterSpacing: '-0.01em',
                    }}>
                      {c.nombre}
                    </h3>

                    {/* Dirección */}
                    {c.direccion && (
                      <p style={{
                        margin: 0,
                        fontSize: '0.72rem',
                        color: '#94a3b8',
                        fontWeight: '500',
                        marginBottom: '0.85rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {c.direccion}
                      </p>
                    )}

                    {/* Separador sutil */}
                    <div style={{
                      height: '1px',
                      background: `linear-gradient(90deg, ${color1}22, transparent)`,
                      marginBottom: '0.75rem',
                    }} />

                    {/* Footer badges */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      flexWrap: 'wrap',
                    }}>
                      {c.nombreCiudad && (
                        <span style={{
                          fontSize: '0.6rem',
                          fontWeight: '700',
                          color: '#475569',
                          backgroundColor: '#f1f4f9',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          border: '1px solid #e8ecf1',
                        }}>
                          <FiMapPin size={8} color="#94a3b8" /> {c.nombreCiudad}
                        </span>
                      )}
                      <span style={{
                        fontSize: '0.6rem',
                        fontWeight: '700',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                        backgroundColor: c.activo !== false ? '#ecfdf5' : '#fef2f2',
                        color: c.activo !== false ? '#059669' : '#dc2626',
                        border: `1px solid ${c.activo !== false ? '#a7f3d0' : '#fecaca'}`,
                      }}>
                        {c.activo !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    {/* Indicador de seleccionado */}
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${color1}, ${color2})`,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        boxShadow: `0 3px 10px ${color1}40, 0 0 0 4px ${color1}15`,
                      }}>
                        <FiCheck size={15} />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
            {filteredCondominios.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                <p style={{ fontWeight: 600, margin: 0 }}>Ningún condominio coincide con tu búsqueda</p>
              </div>
            )}
          </div>
        </div>
      )}
      {!condoSeleccionado ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          <FiSettings size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
          <p>Selecciona un condominio para gestionar su configuracion</p>
        </div>
      ) : configLoading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          <FiLoader size={36} style={{ marginBottom: "1rem", opacity: 0.4, animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <p>Cargando configuracion...</p>
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
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700" }}>{form.maxVehiculosPorDepto} vehículos/depto</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem" }}>
                    <FiSettings size={14} color="#94a3b8" />
                    <div style={{ flex: 1, fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>Estacionamientos</div>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700" }}>{form.maxEstacionamientosPorDepto} /depto</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", backgroundColor: "#f8fafc", borderRadius: "0.5rem" }}>
                    <FiClock size={14} color="#94a3b8" />
                    <div style={{ flex: 1, fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>Préstamos y multas</div>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700" }}>{form.maxTiempoPrestamoMin} min, ${form.penalizacionPorMin}/min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiTruck size={16} color={colorSuper} /> Vehículos
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {renderField("Máximo autos", "maxAutos")}
                {renderField("Máximo motos", "maxMotos")}
                {renderField("Máximo vehículos por departamento", "maxVehiculosPorDepto")}
              </div>
            </div>

            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiSettings size={16} color={colorSuper} /> Estacionamientos
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {renderField("Máximo estacionamientos por departamento", "maxEstacionamientosPorDepto")}
              </div>
            </div>

            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiTruck size={16} color={colorSuper} /> Carritos
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {renderField("Máximo carritos por departamento", "maxCarritosPorDepto")}
              </div>
            </div>

            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiClock size={16} color={colorSuper} /> Préstamos
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {renderField("Tiempo máximo de préstamo (minutos)", "maxTiempoPrestamoMin")}
                {renderField("Penalización por minuto", "penalizacionPorMin", "0.01")}
              </div>
            </div>

            <div style={{ background: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "1rem", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiHome size={16} color={colorSuper} /> Inquilinos
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {renderField("Máximo inquilinos por departamento", "maxInquilinosPorDepto")}
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
              {saving ? 'Guardando...' : 'Guardar configuracion'}
            </button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          <FiAlertCircle size={36} style={{ marginBottom: "1rem", opacity: 0.4 }} />
          <p>No se pudo cargar la configuracion de este condominio.</p>
        </div>
      )}
    </div>
  )
}