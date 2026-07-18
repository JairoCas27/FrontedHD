import React, { useState, useMemo, useEffect } from 'react'
import { FiHome, FiUserCheck, FiX, FiSearch, FiChevronLeft, FiChevronRight, FiShield, FiLock } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { useAdminApartments } from '../../hooks/Admin/useAdminApartments'
import { useAdminUsers } from '../../hooks/Admin/useAdminUsers'
import { getAdminStructure } from '../../services/api'

export default function Departamentos() {
  const colorAdmin = "rgb(52,151,195)"

  const [filtroTorre, setFiltroTorre] = useState('todos')
  const { departamentos, loading, meta, pagina, asignarPropietario, irAPagina, paginaSiguiente, paginaAnterior } = useAdminApartments(null, filtroTorre)
  const { usuarios } = useAdminUsers()

  const [busqueda, setBusqueda] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [deptoSeleccionado, setDeptoSeleccionado] = useState(null)
  const [idPropietarioSeleccionado, setIdPropietarioSeleccionado] = useState('')
  const [busquedaPropietario, setBusquedaPropietario] = useState('')
  const [mostrarListaPropietarios, setMostrarListaPropietarios] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [torres, setTorres] = useState([])

  useEffect(() => {
    async function cargarTorres() {
      try {
        const estructura = await getAdminStructure();
        setTorres(estructura.torres || []);
      } catch (error) {
        console.error("Error cargando torres:", error);
      }
    }

    cargarTorres();
  }, []);

  const deptosFiltrados = (departamentos || []).filter(d => {
    if (filtroTorre !== 'todos') {
      const deptoTorre = (d.torreNombre || '').toLowerCase();
      if (!deptoTorre.includes(filtroTorre.toLowerCase())) return false;
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
      const nombreCompleto = `${u.nombres} ${u.apellidos}`.toLowerCase()
      return nombreCompleto.includes(termino) || u.id?.toString().includes(termino)
    })
  }, [usuarios, busquedaPropietario])

  const usuarioSeleccionado = useMemo(() => {
    return (usuarios || []).find(u => u.id?.toString() === idPropietarioSeleccionado?.toString())
  }, [usuarios, idPropietarioSeleccionado])

  const handleOpenAssignModal = (depto) => {
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

  const handleLimpiarSeleccion = () => {
    setIdPropietarioSeleccionado('')
    setBusquedaPropietario('')
    setMostrarListaPropietarios(false)
  }

  const handleSaveOwner = async () => {
    if (!deptoSeleccionado) return
    if (!idPropietarioSeleccionado) {
      alert("Por favor selecciona un usuario válido");
      return;
    }

    try {
      setGuardando(true)
      await asignarPropietario(deptoSeleccionado.id, Number(idPropietarioSeleccionado))
      setShowModal(false)
    } catch (error) {
      console.error("Error al asignar el dueño en el servidor:", error)
      alert("Hubo un error al guardar los cambios en la base de datos.")
    } finally {
      setGuardando(false)
    }
  }

  const handleCambioTorre = (e) => {
    setFiltroTorre(e.target.value);
    irAPagina(0); // Esto es CRÍTICO para evitar que la página 5 de la Torre A falle al cambiar a la Torre B
  };

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

  const estiloBotonPagina = {
    padding: "0.5rem 0.75rem",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    color: "#475569",
    borderRadius: "0.375rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontWeight: "600",
    fontSize: "0.85rem"
  }

  return (
      <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>

        <EncabezadoTabla
            titulo="Departamentos"
            subtitulo="Control de unidades inmobiliarias, ocupantes y asignación legal de propietarios"
        />

        <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>

            <div style={{ width: "240px" }}>
              <select
                  style={estiloInput}
                  value={filtroTorre}
                  onChange={handleCambioTorre} // Cambiamos el onChange aquí
              >
                <option value="todos">Todas las Torres</option>

                {torres.map((torre) => (
                    <option
                        key={torre.id}
                        value={torre.id} // Asegúrate que el value sea el ID
                    >
                      {torre.nombre}
                    </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1, maxWidth: "340px", position: "relative" }}>
              <input
                  type="text"
                  style={estiloInput}
                  placeholder="Buscar por propietario o N° de dpto."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <small style={{ color: "#64748b", fontWeight: "600", marginLeft: "auto" }}>
              {loading ? "Cargando..." : `Página ${meta.pagina + 1} de ${meta.totalPaginas} — ${meta.total} totales`}
            </small>
          </div>
        </div>

        {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b", fontWeight: "600" }}>
              Sincronizando.
            </div>
        ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                {departamentos.map((depto) => {
                  const tienePropietario = !!depto.nombrePropietario;
                  const tieneInquilinos = depto.inquilinos && depto.inquilinos.length > 0;
                  const estadoCalculado = tienePropietario || tieneInquilinos ? "Habitado" : "Desocupado";

                  return (
                      <div
                          key={depto.id}
                          style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "1rem", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}
                      >
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", backgroundColor: "#f1f5f9", padding: "0.25rem 0.5rem", borderRadius: "0.375rem" }}>
                        {depto.torreNombre || 'Sin Bloque'} • Piso {depto.pisoNumero || 0}
                      </span>
                            <span style={{
                              fontSize: "0.7rem", fontWeight: "700", padding: "0.25rem 0.5rem", borderRadius: "0.375rem",
                              backgroundColor: estadoCalculado === "Habitado" ? "rgba(16, 185, 129, 0.1)" : "rgba(148, 163, 184, 0.1)",
                              color: estadoCalculado === "Habitado" ? "#10b981" : "#64748b"
                            }}>
                        {estadoCalculado}
                      </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                            <div style={{ backgroundColor: "rgba(52,151,195,0.08)", color: colorAdmin, padding: "0.5rem", borderRadius: "0.5rem", display: "flex", alignItems: "center" }}>
                              <FiHome size={20} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "800", color: "#0f172a" }}>Dpto. {depto.numero}</h3>
                          </div>

                          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem", marginBottom: "1rem" }}>
                            <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", display: "block", marginBottom: "0.25rem" }}>Propietario / Titular</span>
                            {depto.nombrePropietario ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: colorAdmin, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: "700" }}>
                                    {depto.nombrePropietario.charAt(0).toUpperCase()}
                                  </div>
                                  <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "#334155" }}>{depto.nombrePropietario}</span>
                                </div>
                            ) : (
                                <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic", fontWeight: "500" }}>Sin propietario asignado</span>
                            )}
                          </div>
                        </div>

                        <button
                            onClick={() => handleOpenAssignModal(depto)}
                            style={{
                              width: "100%", padding: "0.6rem",
                              backgroundColor: tienePropietario ? "rgba(52,151,195,0.08)" : "#f8fafc",
                              border: `1px solid ${tienePropietario ? colorAdmin : "#e2e8f0"}`,
                              borderRadius: "0.5rem",
                              color: tienePropietario ? colorAdmin : colorAdmin,
                              fontWeight: "700", fontSize: "0.8rem",
                              cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = tienePropietario ? "rgba(52,151,195,0.15)" : "#f1f5f9"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = tienePropietario ? "rgba(52,151,195,0.08)" : "#f8fafc"
                            }}
                        >
                          {tienePropietario ? <FiUserCheck size={14} /> : <FiUserCheck size={14} />}
                          {tienePropietario ? "Reasignar Propietario" : "Asignar Dueño"}
                        </button>
                      </div>
                  )
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "2.5rem", borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem" }}>
                <button
                    disabled={pagina <= 0}
                    onClick={paginaAnterior}
                    style={{ ...estiloBotonPagina, opacity: pagina <= 0 ? 0.5 : 1, cursor: pagina <= 0 ? "not-allowed" : "pointer" }}
                >
                  <FiChevronLeft size={16} /> Anterior
                </button>
                <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: "700" }}>
              Página {meta.pagina + 1} de {meta.totalPaginas || 1}
            </span>
                <button
                    disabled={!meta.hayMas}
                    onClick={paginaSiguiente}
                    style={{ ...estiloBotonPagina, opacity: !meta.hayMas ? 0.5 : 1, cursor: !meta.hayMas ? "not-allowed" : "pointer" }}
                >
                  Siguiente <FiChevronRight size={16} />
                </button>
              </div>
            </>
        )}

        {showModal && (
            <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
              <div style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", width: "100%", maxWidth: "440px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", border: "1px solid #e2e8f0", overflow: "hidden" }}>

                <div style={{ padding: "1.5rem", background: `linear-gradient(135deg, ${colorAdmin}, rgb(37,110,143))`, position: "relative" }}>
                  <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", color: "#ffffff", borderRadius: "0.5rem", padding: "0.35rem", display: "flex" }}>
                    <FiX size={18} />
                  </button>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ backgroundColor: "rgba(255,255,255,0.2)", padding: "0.65rem", borderRadius: "0.65rem", display: "flex" }}>
                      <FiHome size={22} color="#ffffff" />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#ffffff" }}>
                        {deptoSeleccionado?.nombrePropietario ? "Reasignar Propietario" : "Asignar Propietario"}
                      </h3>
                      <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.85)", fontWeight: "600" }}>Departamento {deptoSeleccionado?.numero} • {deptoSeleccionado?.torreNombre}</span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: "1.5rem" }}>
                  <label style={estiloLabel}>Buscar Propietario</label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "relative" }}>
                      <FiSearch size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                      <input
                          type="text"
                          style={{ ...estiloInput, paddingLeft: "2.25rem", paddingRight: busquedaPropietario ? "2.25rem" : "0.75rem" }}
                          placeholder="Escribe un nombre, apellido o ID..."
                          value={busquedaPropietario}
                          onChange={(e) => {
                            setBusquedaPropietario(e.target.value)
                            setMostrarListaPropietarios(true)
                            setIdPropietarioSeleccionado('')
                          }}
                          onFocus={() => setMostrarListaPropietarios(true)}
                      />
                      {busquedaPropietario && (
                          <button
                              onClick={handleLimpiarSeleccion}
                              style={{ position: "absolute", right: "0.6rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}
                          >
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
                                    <div
                                        key={u.id}
                                        onClick={() => handleSeleccionarPropietario(u)}
                                        style={{
                                          display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.55rem 0.6rem", cursor: "pointer",
                                          borderRadius: "0.5rem", backgroundColor: seleccionado ? "rgba(52,151,195,0.08)" : "transparent"
                                        }}
                                        onMouseEnter={(e) => { if (!seleccionado) e.currentTarget.style.backgroundColor = "#f8fafc" }}
                                        onMouseLeave={(e) => { if (!seleccionado) e.currentTarget.style.backgroundColor = "transparent" }}
                                    >
                                      <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: colorAdmin, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: "700", flexShrink: 0 }}>
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
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#065f46" }}>{usuarioSeleccionado.nombres} {usuarioSeleccionado.apellidos}</span>
                          <span style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: "600" }}>Seleccionado para asignación</span>
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
                  <button
                      onClick={handleSaveOwner}
                      disabled={guardando || !idPropietarioSeleccionado}
                      style={{
                        backgroundColor: colorAdmin, border: "none", color: "#ffffff", padding: "0.55rem 1.35rem", borderRadius: "0.6rem",
                        fontSize: "0.85rem", fontWeight: "700", cursor: guardando || !idPropietarioSeleccionado ? "not-allowed" : "pointer",
                        opacity: guardando || !idPropietarioSeleccionado ? 0.6 : 1
                      }}
                  >
                    {guardando ? "Guardando..." : "Confirmar Asignación"}
                  </button>
                </div>

              </div>
            </div>
        )}

      </div>
  )
}