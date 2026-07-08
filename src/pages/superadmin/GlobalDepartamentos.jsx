import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { FiHome, FiUserCheck, FiX, FiSearch, FiChevronLeft, FiChevronRight, FiShield, FiLock, FiGrid } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { getCondominiums, getSuperAdminApartments, assignApartmentOwnerSuperAdmin, getAllUsers } from '../../services/api'

const colorSuper = "rgb(124,58,237)"

export default function GlobalDepartamentos() {
  const [condominios, setCondominios] = useState([])
  const [condoSeleccionado, setCondoSeleccionado] = useState('')
  const [departamentos, setDepartamentos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorCondo, setErrorCondo] = useState('')
  const [pagina, setPagina] = useState(0)
  const [meta, setMeta] = useState({ total: 0, pagina: 0, tamano: 9, totalPaginas: 0, hayMas: false })
  const [filtroTorre, setFiltroTorre] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [deptoSeleccionado, setDeptoSeleccionado] = useState(null)
  const [idPropietarioSeleccionado, setIdPropietarioSeleccionado] = useState('')
  const [busquedaPropietario, setBusquedaPropietario] = useState('')
  const [mostrarListaPropietarios, setMostrarListaPropietarios] = useState(false)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    getCondominiums().then(data => {
      const lista = data?.items || data || []
      setCondominios(lista)
    }).catch(() => {})
  }, [])

  const cargarDatos = useCallback(async () => {
    if (!condoSeleccionado) return
    setLoading(true)
    setErrorCondo('')
    try {
      const data = await getSuperAdminApartments(condoSeleccionado, `?page=${pagina}&size=9`)
      setDepartamentos(data?.items || [])
      setMeta({
        total: data?.total ?? 0,
        pagina: data?.pagina ?? 0,
        tamano: data?.tamano ?? 9,
        totalPaginas: data?.totalPaginas ?? 0,
        hayMas: data?.hayMas ?? false,
      })
    } catch (err) {
      setErrorCondo(err.message || 'Error al cargar departamentos. Verifica que el backend soporte superadmin.')
      setDepartamentos([])
    } finally {
      setLoading(false)
    }
  }, [condoSeleccionado, pagina])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  useEffect(() => {
    if (!condoSeleccionado) return
    getAllUsers().then(data => {
      const lista = Array.isArray(data) ? data : (data?.items || [])
      setUsuarios(lista)
    }).catch(() => {})
  }, [condoSeleccionado])

  const deptosFiltrados = (departamentos || []).filter(d => {
    if (filtroTorre !== 'todos') {
      const deptoTorre = (d.torreNombre || '').toLowerCase()
      if (!deptoTorre.includes(filtroTorre.toLowerCase())) return false
    }
    const termino = busqueda.toLowerCase().trim()
    if (termino) {
      const cumpleNombre = d.nombrePropietario?.toLowerCase().includes(termino)
      const cumpleNumero = d.numero?.toString().includes(termino)
      return cumpleNombre || cumpleNumero
    }
    return true
  })

  const usuariosFiltrados = useMemo(() => {
    const termino = busquedaPropietario.toLowerCase().trim()
    if (!termino) return usuarios || []
    return (usuarios || []).filter(u => {
      const nc = `${u.nombres} ${u.apellidos}`.toLowerCase()
      return nc.includes(termino) || u.id?.toString().includes(termino)
    })
  }, [usuarios, busquedaPropietario])

  const usuarioSeleccionado = useMemo(() => {
    return (usuarios || []).find(u => u.id?.toString() === idPropietarioSeleccionado?.toString())
  }, [usuarios, idPropietarioSeleccionado])

  const handleOpenAssignModal = (depto) => {
    if (depto.nombrePropietario) return
    setDeptoSeleccionado(depto)
    setIdPropietarioSeleccionado(depto.idPropietario || '')
    setBusquedaPropietario(depto.nombrePropietario || '')
    setMostrarListaPropietarios(false)
    setShowModal(true)
  }

  const handleSeleccionarPropietario = (usuario) => {
    setIdPropietarioSeleccionado(usuario.id)
    setBusquedaPropietario(`${usuario.nombres} ${usuario.apellidos}`)
    setMostrarListaPropietarios(false)
  }

  const handleSaveOwner = async () => {
    if (!deptoSeleccionado || !idPropietarioSeleccionado) return
    try {
      setGuardando(true)
      await assignApartmentOwnerSuperAdmin(deptoSeleccionado.id, Number(idPropietarioSeleccionado), condoSeleccionado)
      setShowModal(false)
      await cargarDatos()
    } catch (error) {
      alert('Error al asignar: ' + (error.message || 'Error de red'))
    } finally {
      setGuardando(false)
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
  const estiloBotonPagina = {
    padding: "0.5rem 0.75rem", border: "1px solid #cbd5e1", backgroundColor: "#ffffff",
    color: "#475569", borderRadius: "0.375rem", cursor: "pointer",
    display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: "600", fontSize: "0.85rem"
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      <EncabezadoTabla titulo="Departamentos Global" subtitulo="Control global de unidades inmobiliarias en todos los condominios" />

      <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: "280px" }}>
            <select
              style={estiloInput}
              value={condoSeleccionado}
              onChange={(e) => { setCondoSeleccionado(e.target.value); setPagina(0) }}
            >
              <option value="">Seleccionar condominio</option>
              {condominios.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          {condoSeleccionado && (
            <>
              <div style={{ width: "200px" }}>
                <select style={estiloInput} value={filtroTorre} onChange={(e) => setFiltroTorre(e.target.value)}>
                  <option value="todos">Todas las Torres</option>
                  <option value="A">Torre A</option>
                  <option value="B">Torre B</option>
                  <option value="C">Torre C</option>
                </select>
              </div>
              <div style={{ flex: 1, maxWidth: "300px" }}>
                <input type="text" style={estiloInput} placeholder="Buscar por propietario o N° dpto." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              </div>
            </>
          )}
          <small style={{ color: "#64748b", fontWeight: "600", marginLeft: "auto" }}>
            {condoSeleccionado ? (loading ? "Cargando..." : `Página ${meta.pagina + 1} de ${meta.totalPaginas || 1} — ${meta.total} totales`) : 'Seleccione un condominio'}
          </small>
        </div>
      </div>

      {errorCondo && (
        <div style={{ padding: "1.5rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "0.75rem", color: "#dc2626", marginBottom: "1.5rem", fontWeight: "600", textAlign: "center" }}>
          {errorCondo}
        </div>
      )}

      {!condoSeleccionado ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          <FiGrid size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
          <p>Selecciona un condominio para gestionar sus departamentos</p>
        </div>
      ) : loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b", fontWeight: "600" }}>Sincronizando.</div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {deptosFiltrados.map((depto) => {
              const tienePropietario = !!depto.nombrePropietario
              const tieneInquilinos = depto.inquilinos && depto.inquilinos.length > 0
              const estado = tienePropietario || tieneInquilinos ? "Habitado" : "Desocupado"
              return (
                <div key={depto.id} style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "1rem", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", backgroundColor: "#f1f5f9", padding: "0.25rem 0.5rem", borderRadius: "0.375rem" }}>
                        {depto.torreNombre || 'Sin Bloque'} • Piso {depto.pisoNumero || 0}
                      </span>
                      <span style={{ fontSize: "0.7rem", fontWeight: "700", padding: "0.25rem 0.5rem", borderRadius: "0.375rem", backgroundColor: estado === "Habitado" ? "rgba(16,185,129,0.1)" : "rgba(148,163,184,0.1)", color: estado === "Habitado" ? "#10b981" : "#64748b" }}>
                        {estado}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                      <div style={{ backgroundColor: "rgba(124,58,237,0.08)", color: colorSuper, padding: "0.5rem", borderRadius: "0.5rem", display: "flex" }}>
                        <FiHome size={20} />
                      </div>
                      <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800", color: "#0f172a" }}>Dpto. {depto.numero}</h3>
                    </div>
                    <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem", marginBottom: "1rem" }}>
                      <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", display: "block", marginBottom: "0.25rem" }}>Propietario / Titular</span>
                      {depto.nombrePropietario ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: colorSuper, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: "700" }}>
                            {depto.nombrePropietario.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "#334155" }}>{depto.nombrePropietario}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic", fontWeight: "500" }}>Sin propietario asignado</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => handleOpenAssignModal(depto)} disabled={tienePropietario}
                    style={{ width: "100%", padding: "0.6rem", backgroundColor: tienePropietario ? "#f1f5f9" : "#f8fafc", border: `1px solid ${tienePropietario ? "#e2e8f0" : "#e2e8f0"}`, borderRadius: "0.5rem", color: tienePropietario ? "#94a3b8" : colorSuper, fontWeight: "700", fontSize: "0.8rem", cursor: tienePropietario ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
                    {tienePropietario ? <FiLock size={14} /> : <FiUserCheck size={14} />}
                    {tienePropietario ? "Propietario Asignado" : "Asignar Dueño"}
                  </button>
                </div>
              )
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "2.5rem", borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem" }}>
            <button disabled={pagina <= 0} onClick={() => setPagina(p => p - 1)} style={{ ...estiloBotonPagina, opacity: pagina <= 0 ? 0.5 : 1, cursor: pagina <= 0 ? "not-allowed" : "pointer" }}>
              <FiChevronLeft size={16} /> Anterior
            </button>
            <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: "700" }}>Página {meta.pagina + 1} de {meta.totalPaginas || 1}</span>
            <button disabled={!meta.hayMas} onClick={() => setPagina(p => p + 1)} style={{ ...estiloBotonPagina, opacity: !meta.hayMas ? 0.5 : 1, cursor: !meta.hayMas ? "not-allowed" : "pointer" }}>
              Siguiente <FiChevronRight size={16} />
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", width: "100%", maxWidth: "440px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "1.5rem", background: `linear-gradient(135deg, ${colorSuper}, rgb(91,33,182))`, position: "relative" }}>
              <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", color: "#ffffff", borderRadius: "0.5rem", padding: "0.35rem", display: "flex" }}>
                <FiX size={18} />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.2)", padding: "0.65rem", borderRadius: "0.65rem", display: "flex" }}>
                  <FiHome size={22} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#ffffff" }}>Asignar Propietario</h3>
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.85)", fontWeight: "600" }}>Departamento {deptoSeleccionado?.numero} • {deptoSeleccionado?.torreNombre}</span>
                </div>
              </div>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <label style={estiloLabel}>Buscar Propietario</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "relative" }}>
                  <FiSearch size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input type="text" style={{ ...estiloInput, paddingLeft: "2.25rem", paddingRight: busquedaPropietario ? "2.25rem" : "0.75rem" }} placeholder="Escribe un nombre, apellido o ID..." value={busquedaPropietario}
                    onChange={(e) => { setBusquedaPropietario(e.target.value); setMostrarListaPropietarios(true); setIdPropietarioSeleccionado('') }}
                    onFocus={() => setMostrarListaPropietarios(true)} />
                  {busquedaPropietario && (
                    <button onClick={() => { setIdPropietarioSeleccionado(''); setBusquedaPropietario(''); setMostrarListaPropietarios(false) }}
                      style={{ position: "absolute", right: "0.6rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                      <FiX size={16} />
                    </button>
                  )}
                </div>
                {mostrarListaPropietarios && (
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.75rem", boxShadow: "0 12px 24px -6px rgba(0,0,0,0.15)", maxHeight: "230px", overflowY: "auto", zIndex: 10, padding: "0.4rem" }}>
                    {usuariosFiltrados.length === 0 ? (
                      <div style={{ padding: "1rem", fontSize: "0.85rem", color: "#94a3b8", textAlign: "center" }}>No se encontraron coincidencias</div>
                    ) : (
                      usuariosFiltrados.map(u => {
                        const iniciales = `${u.nombres?.charAt(0) || ''}${u.apellidos?.charAt(0) || ''}`.toUpperCase()
                        const seleccionado = u.id?.toString() === idPropietarioSeleccionado?.toString()
                        return (
                          <div key={u.id} onClick={() => handleSeleccionarPropietario(u)}
                            style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.55rem 0.6rem", cursor: "pointer", borderRadius: "0.5rem", backgroundColor: seleccionado ? "rgba(124,58,237,0.08)" : "transparent" }}
                            onMouseEnter={(e) => { if (!seleccionado) e.currentTarget.style.backgroundColor = "#f8fafc" }}
                            onMouseLeave={(e) => { if (!seleccionado) e.currentTarget.style.backgroundColor = "transparent" }}>
                            <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: colorSuper, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: "700", flexShrink: 0 }}>
                              {iniciales}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                              <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.nombres} {u.apellidos}</span>
                              <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600" }}>ID: {u.id}</span>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}
              </div>
              {usuarioSeleccionado && (
                <div style={{ marginTop: "0.85rem", display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.65rem 0.85rem", backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "0.65rem" }}>
                  <div style={{ backgroundColor: "#10b981", borderRadius: "50%", padding: "0.3rem", display: "flex" }}>
                    <FiUserCheck size={12} color="#ffffff" />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#065f46" }}>{usuarioSeleccionado.nombres} {usuarioSeleccionado.apellidos}</span>
                    <span style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: "600", display: "block" }}>Seleccionado para asignación</span>
                  </div>
                </div>
              )}
              <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", padding: "0.75rem", backgroundColor: "#f8fafc", borderRadius: "0.65rem", border: "1px solid #f1f5f9" }}>
                <FiShield size={15} color="#94a3b8" style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                <small style={{ color: "#64748b", fontSize: "0.75rem", lineHeight: "1.4" }}>
                  Esta acción vincula de forma oficial al residente seleccionado como propietario legal de la unidad, quedando registrada en el historial administrativo del condominio.
                </small>
              </div>
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
              <button onClick={() => setShowModal(false)} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.55rem 1rem", borderRadius: "0.6rem", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer" }}>Cancelar</button>
              <button onClick={handleSaveOwner} disabled={guardando || !idPropietarioSeleccionado}
                style={{ backgroundColor: colorSuper, border: "none", color: "#ffffff", padding: "0.55rem 1.35rem", borderRadius: "0.6rem", fontSize: "0.85rem", fontWeight: "700", cursor: guardando || !idPropietarioSeleccionado ? "not-allowed" : "pointer", opacity: guardando || !idPropietarioSeleccionado ? 0.6 : 1 }}>
                {guardando ? "Guardando..." : "Confirmar Asignación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
