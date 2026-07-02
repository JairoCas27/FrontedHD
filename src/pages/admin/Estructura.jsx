import React, { useState, useMemo } from 'react'
import { FiGitCommit, FiTrash2, FiFolder, FiX, FiPlus, FiAlertTriangle, FiLayers, FiCheckCircle, FiHome, FiMail, FiPhone, FiMaximize2, FiTruck, FiCalendar } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { useAdminStructure } from '../../hooks/Admin/useAdminStructure'
import { useAdminUsers } from '../../hooks/Admin/useAdminUsers'

export default function Estructura() {
  const colorAdmin = "rgb(52,151,195)"

  const { estructura, loading, insertarNodo, eliminarNodo } = useAdminStructure()
  const { usuarios } = useAdminUsers()

  const [showModalTorre, setShowModalTorre] = useState(false)
  const [showModalPiso, setShowModalPiso] = useState(false)
  const [torreParaPiso, setTorreParaPiso] = useState(null)
  const [procesando, setProcesando] = useState(false)

  const [showModalEliminar, setShowModalEliminar] = useState(false)
  const [nodoAEliminar, setNodoAEliminar] = useState(null)

  const [modalNotificacion, setModalNotificacion] = useState({ visible: false, tipo: 'exito', titulo: '', mensaje: '' })

  const [showModalDepto, setShowModalDepto] = useState(false)
  const [deptoDetalle, setDeptoDetalle] = useState(null)
  const [contextoDepto, setContextoDepto] = useState(null)

  const listaTorres = estructura?.torres || []

  const siguienteLetraTorre = useMemo(() => {
    const usadas = listaTorres.map(t => {
      const match = (t.nombre || '').match(/[A-Za-z]+$/)
      return match ? match[0].toUpperCase() : null
    }).filter(Boolean)

    for (let i = 0; i < 26; i++) {
      const letra = String.fromCharCode(65 + i)
      if (!usadas.includes(letra)) return letra
    }
    return "?"
  }, [listaTorres])

  const nombreNuevaTorre = `Torre ${siguienteLetraTorre}`

  const calcularSiguientePiso = (torre) => {
    const numeros = (torre.pisos || []).map(p => Number(p.numero) || 0)
    return numeros.length ? Math.max(...numeros) + 1 : 1
  }

  const mostrarNotificacion = (tipo, titulo, mensaje) => {
    setModalNotificacion({ visible: true, tipo, titulo, mensaje })
  }

  const handleAbrirModalPiso = (torre) => {
    setTorreParaPiso(torre)
    setShowModalPiso(true)
  }

  const handleAbrirModalEliminar = (id, type, nombre) => {
    setNodoAEliminar({ id, type, nombre })
    setShowModalEliminar(true)
  }

  const handleAbrirModalDepto = (dpto, torre, piso) => {
    const propietario = usuarios.find(u => u.id === dpto.idPropietario) || null
    setDeptoDetalle({ ...dpto, propietario })
    setContextoDepto({ torreNombre: torre.nombre, pisoNumero: piso.numero })
    setShowModalDepto(true)
  }

  const handleConfirmarTorre = async () => {
    try {
      setProcesando(true)
      await insertarNodo({
        tipo: "TORRE",
        nombre: nombreNuevaTorre,
        nombreTorre: null,
        numeroPiso: null,
        numero: null
      })
      setShowModalTorre(false)
      mostrarNotificacion('exito', 'Torre creada', `${nombreNuevaTorre} fue registrada correctamente en la estructura.`)
    } catch (error) {
      console.error("Error al insertar la torre:", error)
      setShowModalTorre(false)
      mostrarNotificacion('error', 'No se pudo crear la torre', 'Hubo un problema al comunicarse con el servidor. Intenta nuevamente.')
    } finally {
      setProcesando(false)
    }
  }

  const handleConfirmarPiso = async () => {
    if (!torreParaPiso) return
    const siguienteNumero = calcularSiguientePiso(torreParaPiso)

    try {
      setProcesando(true)
      await insertarNodo({
        tipo: "PISO",
        nombre: `Piso ${siguienteNumero}`,
        nombreTorre: torreParaPiso.nombre,
        numeroPiso: siguienteNumero,
        numero: siguienteNumero
      })
      setShowModalPiso(false)
      mostrarNotificacion('exito', 'Piso creado', `El Piso ${siguienteNumero} fue añadido a ${torreParaPiso.nombre} correctamente.`)
      setTorreParaPiso(null)
    } catch (error) {
      console.error("Error al insertar el piso:", error)
      setShowModalPiso(false)
      mostrarNotificacion('error', 'No se pudo crear el piso', 'Hubo un problema al comunicarse con el servidor. Intenta nuevamente.')
    } finally {
      setProcesando(false)
    }
  }

  const handleConfirmarEliminar = async () => {
    if (!nodoAEliminar) return
    const etiqueta = nodoAEliminar.type === 'PISO' ? 'Nivel' : 'Torre'

    try {
      setProcesando(true)
      await eliminarNodo(nodoAEliminar.id, nodoAEliminar.type)
      setShowModalEliminar(false)
      mostrarNotificacion('exito', `${etiqueta} eliminado`, `${nodoAEliminar.nombre} fue eliminado de la estructura correctamente.`)
      setNodoAEliminar(null)
    } catch (error) {
      console.error("Error al eliminar el nodo:", error)
      setShowModalEliminar(false)
      mostrarNotificacion('error', 'No se pudo eliminar', 'Asegúrate de que no contenga subelementos activos antes de eliminarlo.')
    } finally {
      setProcesando(false)
    }
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return '—'
    try {
      return new Date(fecha).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch {
      return fecha
    }
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>

      <EncabezadoTabla
        titulo="Estructura del Condominio"
        subtitulo="Organigrama de nodos físicos para la segmentación de bloques, sectores y niveles residenciales"
        botonTexto="Agregar Torre"
        accentColor={colorAdmin}
        onBotonClick={() => setShowModalTorre(true)}
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#64748b", fontWeight: "600" }}>
          Sincronizando.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
          {listaTorres.map((torre) => (
            <div key={torre.id} style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "1rem", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiFolder size={20} style={{ color: colorAdmin }} />
                  <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>{torre.nombre}</span>
                  <span style={{ fontSize: "0.75rem", backgroundColor: "rgba(52,151,195,0.1)", color: colorAdmin, padding: "0.2rem 0.5rem", borderRadius: "0.375rem", fontWeight: "700" }}>
                    {torre.pisos?.length || 0} Niveles
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleAbrirModalPiso(torre)}
                    style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(52,151,195,0.08)", border: "none", color: colorAdmin, cursor: "pointer", padding: "0.4rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.78rem", fontWeight: "700" }}
                  >
                    <FiPlus size={14} /> Añadir Piso
                  </button>
                  <button
                    onClick={() => handleAbrirModalEliminar(torre.id, 'TORRE', torre.nombre)}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.25rem" }}
                    title="Eliminar Torre"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingLeft: "1.25rem", borderLeft: "2px dashed #cbd5e1" }}>
                {torre.pisos?.map((piso) => (
                  <div key={piso.id} style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: "700", color: "#334155", fontSize: "0.9rem" }}>
                        <FiGitCommit style={{ color: "#94a3b8" }} />
                        <span>Piso {piso.numero}</span>
                      </div>
                      <button
                        onClick={() => handleAbrirModalEliminar(piso.id, 'PISO', `Piso ${piso.numero}`)}
                        style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                        title="Eliminar Nivel"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", paddingLeft: "1rem" }}>
                      {piso.apartamentos && piso.apartamentos.length > 0 ? (
                        piso.apartamentos.map((dpto) => {
                          const tienePropietario = !!dpto.idPropietario
                          return (
                            <button
                              key={dpto.id}
                              onClick={() => handleAbrirModalDepto(dpto, torre, piso)}
                              style={{
                                fontSize: "0.75rem", backgroundColor: "#ffffff", border: `1px solid ${tienePropietario ? colorAdmin : '#e2e8f0'}`,
                                padding: "0.3rem 0.6rem", borderRadius: "0.375rem", color: tienePropietario ? colorAdmin : "#475569",
                                fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem"
                              }}
                            >
                              <FiHome size={11} /> Dpto. {dpto.numero}
                            </button>
                          )
                        })
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontStyle: "italic" }}>Sin unidades vinculadas</span>
                      )}
                    </div>
                  </div>
                ))}

                {(!torre.pisos || torre.pisos.length === 0) && (
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontStyle: "italic", paddingLeft: "1rem" }}>Esta torre aún no tiene niveles registrados.</span>
                )}
              </div>

            </div>
          ))}

          {listaTorres.length === 0 && (
            <div style={{ padding: "3rem", textAlign: "center", backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", color: "#94a3b8" }}>
              No hay torres ni nodos estructurales registrados en este condominio.
            </div>
          )}
        </div>
      )}

      {showModalTorre && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", width: "100%", maxWidth: "400px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div style={{ backgroundColor: "rgba(52,151,195,0.1)", padding: "0.9rem", borderRadius: "50%", marginBottom: "1rem" }}>
                <FiFolder size={28} color={colorAdmin} />
              </div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>Confirmar Nueva Torre</h3>
              <p style={{ marginTop: "0.6rem", fontSize: "0.9rem", color: "#64748b", lineHeight: "1.5" }}>
                Estás a punto de crear la <strong style={{ color: colorAdmin }}>{nombreNuevaTorre}</strong> siguiendo el orden alfabético de la estructura actual. ¿Deseas continuar?
              </p>
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "center", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
              <button onClick={() => setShowModalTorre(false)} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.55rem 1.1rem", borderRadius: "0.6rem", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer" }}>Cancelar</button>
              <button
                onClick={handleConfirmarTorre}
                disabled={procesando}
                style={{ backgroundColor: colorAdmin, border: "none", color: "#ffffff", padding: "0.55rem 1.4rem", borderRadius: "0.6rem", fontSize: "0.85rem", fontWeight: "700", cursor: procesando ? "not-allowed" : "pointer", opacity: procesando ? 0.6 : 1 }}
              >
                {procesando ? "Creando..." : `Sí, crear ${nombreNuevaTorre}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalPiso && torreParaPiso && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", width: "100%", maxWidth: "400px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div style={{ backgroundColor: "rgba(52,151,195,0.1)", padding: "0.9rem", borderRadius: "50%", marginBottom: "1rem" }}>
                <FiLayers size={28} color={colorAdmin} />
              </div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>Confirmar Nuevo Piso</h3>
              <p style={{ marginTop: "0.6rem", fontSize: "0.9rem", color: "#64748b", lineHeight: "1.5" }}>
                Estás a punto de crear el <strong style={{ color: colorAdmin }}>Piso {calcularSiguientePiso(torreParaPiso)}</strong> dentro de <strong>{torreParaPiso.nombre}</strong>. ¿Deseas continuar?
              </p>
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "center", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
              <button onClick={() => { setShowModalPiso(false); setTorreParaPiso(null) }} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.55rem 1.1rem", borderRadius: "0.6rem", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer" }}>Cancelar</button>
              <button
                onClick={handleConfirmarPiso}
                disabled={procesando}
                style={{ backgroundColor: colorAdmin, border: "none", color: "#ffffff", padding: "0.55rem 1.4rem", borderRadius: "0.6rem", fontSize: "0.85rem", fontWeight: "700", cursor: procesando ? "not-allowed" : "pointer", opacity: procesando ? 0.6 : 1 }}
              >
                {procesando ? "Creando..." : `Sí, crear Piso ${calcularSiguientePiso(torreParaPiso)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalEliminar && nodoAEliminar && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", width: "100%", maxWidth: "400px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div style={{ backgroundColor: "rgba(239,68,68,0.1)", padding: "0.9rem", borderRadius: "50%", marginBottom: "1rem" }}>
                <FiAlertTriangle size={28} color="#ef4444" />
              </div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>Confirmar Eliminación</h3>
              <p style={{ marginTop: "0.6rem", fontSize: "0.9rem", color: "#64748b", lineHeight: "1.5" }}>
                Estás a punto de eliminar <strong style={{ color: "#ef4444" }}>{nodoAEliminar.nombre}</strong> de la estructura arquitectónica. Esta acción no se puede deshacer.
              </p>
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "center", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
              <button onClick={() => { setShowModalEliminar(false); setNodoAEliminar(null) }} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.55rem 1.1rem", borderRadius: "0.6rem", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer" }}>Cancelar</button>
              <button
                onClick={handleConfirmarEliminar}
                disabled={procesando}
                style={{ backgroundColor: "#ef4444", border: "none", color: "#ffffff", padding: "0.55rem 1.4rem", borderRadius: "0.6rem", fontSize: "0.85rem", fontWeight: "700", cursor: procesando ? "not-allowed" : "pointer", opacity: procesando ? 0.6 : 1 }}
              >
                {procesando ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalNotificacion.visible && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", width: "100%", maxWidth: "400px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", border: "1px solid #e2e8f0", overflow: "hidden", position: "relative" }}>
            <button onClick={() => setModalNotificacion({ ...modalNotificacion, visible: false })} style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
              <FiX size={18} />
            </button>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div style={{
                backgroundColor: modalNotificacion.tipo === 'exito' ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                padding: "0.9rem", borderRadius: "50%", marginBottom: "1rem"
              }}>
                {modalNotificacion.tipo === 'exito' ? (
                  <FiCheckCircle size={28} color="#10b981" />
                ) : (
                  <FiAlertTriangle size={28} color="#ef4444" />
                )}
              </div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>{modalNotificacion.titulo}</h3>
              <p style={{ marginTop: "0.6rem", fontSize: "0.9rem", color: "#64748b", lineHeight: "1.5" }}>
                {modalNotificacion.mensaje}
              </p>
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "center", backgroundColor: "#f8fafc" }}>
              <button
                onClick={() => setModalNotificacion({ ...modalNotificacion, visible: false })}
                style={{
                  backgroundColor: modalNotificacion.tipo === 'exito' ? "#10b981" : "#ef4444",
                  border: "none", color: "#ffffff", padding: "0.55rem 1.4rem", borderRadius: "0.6rem",
                  fontSize: "0.85rem", fontWeight: "700", cursor: "pointer"
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalDepto && deptoDetalle && contextoDepto && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 150, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1.25rem", width: "100%", maxWidth: "440px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", border: "1px solid #e2e8f0", overflow: "hidden" }}>

            <div style={{ padding: "1.5rem", background: `linear-gradient(135deg, ${colorAdmin}, rgb(37,110,143))`, position: "relative" }}>
              <button onClick={() => setShowModalDepto(false)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", color: "#ffffff", borderRadius: "0.5rem", padding: "0.35rem", display: "flex" }}>
                <FiX size={18} />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.2)", padding: "0.65rem", borderRadius: "0.65rem", display: "flex" }}>
                  <FiHome size={22} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#ffffff" }}>Departamento {deptoDetalle.numero}</h3>
                  <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.85)", fontWeight: "600" }}>{contextoDepto.torreNombre} • Piso {contextoDepto.pisoNumero}</span>
                </div>
              </div>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <div style={{ backgroundColor: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "0.65rem", padding: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                    <FiMaximize2 size={13} color="#94a3b8" />
                    <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Metraje</span>
                  </div>
                  <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b" }}>{deptoDetalle.metraje} m²</span>
                </div>
                <div style={{ backgroundColor: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "0.65rem", padding: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                    <FiTruck size={13} color="#94a3b8" />
                    <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" }}>Estacionamiento</span>
                  </div>
                  <span style={{ fontSize: "0.85rem", fontWeight: "800", color: deptoDetalle.derechoEstacionamiento ? "#10b981" : "#ef4444" }}>
                    {deptoDetalle.derechoEstacionamiento ? "Incluido" : "No incluido"}
                  </span>
                </div>
              </div>

              <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", display: "block", marginBottom: "0.6rem" }}>Propietario Asignado</span>

              {deptoDetalle.propietario ? (
                <div style={{ backgroundColor: "rgba(52,151,195,0.06)", border: "1px solid rgba(52,151,195,0.2)", borderRadius: "0.75rem", padding: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.75rem" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: colorAdmin, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: "700", flexShrink: 0 }}>
                      {deptoDetalle.propietario.nombres?.charAt(0)}{deptoDetalle.propietario.apellidos?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b" }}>{deptoDetalle.propietario.nombres} {deptoDetalle.propietario.apellidos}</div>
                      <span style={{
                        fontSize: "0.65rem", fontWeight: "700", padding: "0.15rem 0.45rem", borderRadius: "0.3rem",
                        backgroundColor: deptoDetalle.propietario.activo ? "rgba(16,185,129,0.1)" : "rgba(148,163,184,0.15)",
                        color: deptoDetalle.propietario.activo ? "#10b981" : "#64748b"
                      }}>
                        {deptoDetalle.propietario.activo ? "Cuenta activa" : "Cuenta inactiva"}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <FiMail size={13} color="#94a3b8" />
                      <span style={{ fontSize: "0.8rem", color: "#475569", fontWeight: "600" }}>{deptoDetalle.propietario.correo}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <FiPhone size={13} color="#94a3b8" />
                      <span style={{ fontSize: "0.8rem", color: "#475569", fontWeight: "600" }}>{deptoDetalle.propietario.telefono}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <FiCalendar size={13} color="#94a3b8" />
                      <span style={{ fontSize: "0.8rem", color: "#475569", fontWeight: "600" }}>Registrado el {formatearFecha(deptoDetalle.propietario.fechaCreacion)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "0.75rem", padding: "1.25rem", textAlign: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic", fontWeight: "600" }}>Esta unidad no tiene propietario asignado</span>
                </div>
              )}
            </div>

            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", backgroundColor: "#f8fafc" }}>
              <button onClick={() => setShowModalDepto(false)} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.55rem 1.2rem", borderRadius: "0.6rem", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer" }}>Cerrar</button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}