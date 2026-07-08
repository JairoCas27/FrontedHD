import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { FiGitCommit, FiTrash2, FiFolder, FiX, FiPlus, FiAlertTriangle, FiHome } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { getCondominiums, getAdminStructure, createAdminStructureNode, deleteAdminStructureNode } from '../../services/api'

const colorSuper = "rgb(124,58,237)"

export default function GlobalEstructura() {
  const [condominios, setCondominios] = useState([])
  const [condoSeleccionado, setCondoSeleccionado] = useState('')
  const [estructura, setEstructura] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorCondo, setErrorCondo] = useState('')

  const [showModalTorre, setShowModalTorre] = useState(false)
  const [showModalPiso, setShowModalPiso] = useState(false)
  const [torreParaPiso, setTorreParaPiso] = useState(null)
  const [procesando, setProcesando] = useState(false)
  const [showModalEliminar, setShowModalEliminar] = useState(false)
  const [nodoAEliminar, setNodoAEliminar] = useState(null)
  const [modalNotificacion, setModalNotificacion] = useState({ visible: false, tipo: 'exito', titulo: '', mensaje: '' })

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
      const data = await getAdminStructure()
      setEstructura(data || [])
    } catch (err) {
      setErrorCondo(err.message || 'Error. El backend puede no soportar superadmin para estructura.')
      setEstructura([])
    } finally {
      setLoading(false)
    }
  }, [condoSeleccionado])

  useEffect(() => { cargarDatos() }, [cargarDatos])

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

  const handleConfirmarTorre = async () => {
    try {
      setProcesando(true)
      await createAdminStructureNode({ tipo: "TORRE", nombre: nombreNuevaTorre, nombreTorre: null, numeroPiso: null, numero: null })
      setShowModalTorre(false)
      await cargarDatos()
      mostrarNotificacion('exito', 'Torre creada', `${nombreNuevaTorre} registrada correctamente.`)
    } catch (error) {
      setShowModalTorre(false)
      mostrarNotificacion('error', 'No se pudo crear la torre', error.message)
    } finally {
      setProcesando(false)
    }
  }

  const handleConfirmarPiso = async () => {
    if (!torreParaPiso) return
    const siguienteNumero = calcularSiguientePiso(torreParaPiso)
    try {
      setProcesando(true)
      await createAdminStructureNode({ tipo: "PISO", nombre: `Piso ${siguienteNumero}`, nombreTorre: torreParaPiso.nombre, numeroPiso: siguienteNumero, numero: siguienteNumero })
      setShowModalPiso(false)
      await cargarDatos()
      mostrarNotificacion('exito', 'Piso creado', `Piso ${siguienteNumero} añadido a ${torreParaPiso.nombre}.`)
      setTorreParaPiso(null)
    } catch (error) {
      setShowModalPiso(false)
      mostrarNotificacion('error', 'No se pudo crear el piso', error.message)
    } finally {
      setProcesando(false)
    }
  }

  const handleConfirmarEliminar = async () => {
    if (!nodoAEliminar) return
    const etiqueta = nodoAEliminar.type === 'PISO' ? 'Nivel' : 'Torre'
    try {
      setProcesando(true)
      await deleteAdminStructureNode(nodoAEliminar.id, nodoAEliminar.type)
      setShowModalEliminar(false)
      await cargarDatos()
      mostrarNotificacion('exito', `${etiqueta} eliminado`, `${nodoAEliminar.nombre} eliminado correctamente.`)
      setNodoAEliminar(null)
    } catch (error) {
      setShowModalEliminar(false)
      mostrarNotificacion('error', 'No se pudo eliminar', error.message)
    } finally {
      setProcesando(false)
    }
  }

  const estiloInput = {
    width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem",
    border: "1px solid #cbd5e1", fontSize: "0.9rem", color: "#334155",
    backgroundColor: "#ffffff", boxSizing: "border-box", outline: "none"
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      <EncabezadoTabla titulo="Estructura Global" subtitulo="Organigrama de nodos físicos de todos los condominios"
        botonTexto={condoSeleccionado ? "Agregar Torre" : undefined}
        accentColor={colorSuper} onBotonClick={() => setShowModalTorre(true)} />

      <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "2rem" }}>
        <div style={{ width: "280px" }}>
          <select style={estiloInput} value={condoSeleccionado} onChange={(e) => setCondoSeleccionado(e.target.value)}>
            <option value="">Seleccionar condominio</option>
            {condominios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      </div>

      {errorCondo && (
        <div style={{ padding: "1.5rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "0.75rem", color: "#dc2626", marginBottom: "1.5rem", fontWeight: "600", textAlign: "center" }}>
          {errorCondo}
        </div>
      )}

      {!condoSeleccionado ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontWeight: "600" }}>
          <FiFolder size={48} style={{ marginBottom: "1rem", opacity: 0.4 }} />
          <p>Selecciona un condominio para gestionar su estructura</p>
        </div>
      ) : loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#64748b", fontWeight: "600" }}>Sincronizando.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
          {listaTorres.map((torre) => (
            <div key={torre.id} style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "1rem", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiFolder size={20} style={{ color: colorSuper }} />
                  <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>{torre.nombre}</span>
                  <span style={{ fontSize: "0.75rem", backgroundColor: "rgba(124,58,237,0.1)", color: colorSuper, padding: "0.2rem 0.5rem", borderRadius: "0.375rem", fontWeight: "700" }}>
                    {torre.pisos?.length || 0} Niveles
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button onClick={() => { setTorreParaPiso(torre); setShowModalPiso(true) }}
                    style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(124,58,237,0.08)", border: "none", color: colorSuper, cursor: "pointer", padding: "0.4rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.78rem", fontWeight: "700" }}>
                    <FiPlus size={14} /> Añadir Piso
                  </button>
                  <button onClick={() => { setNodoAEliminar({ id: torre.id, type: 'TORRE', nombre: torre.nombre }); setShowModalEliminar(true) }}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.25rem" }} title="Eliminar Torre">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingLeft: "1.25rem", borderLeft: "2px dashed #cbd5e1" }}>
                {torre.pisos?.map((piso) => (
                  <div key={piso.id} style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: "700", color: "#334155", fontSize: "0.9rem" }}>
                        <FiGitCommit style={{ color: "#94a3b8" }} />
                        <span>Piso {piso.numero}</span>
                      </div>
                      <button onClick={() => { setNodoAEliminar({ id: piso.id, type: 'PISO', nombre: `Piso ${piso.numero}` }); setShowModalEliminar(true) }}
                        style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }} title="Eliminar Nivel">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                {(!torre.pisos || torre.pisos.length === 0) && (
                  <div style={{ padding: "0.5rem 0.75rem", color: "#94a3b8", fontSize: "0.85rem", fontStyle: "italic" }}>Sin niveles registrados</div>
                )}
              </div>
            </div>
          ))}
          {listaTorres.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8", fontStyle: "italic" }}>No hay torres registradas en este condominio.</div>
          )}
        </div>
      )}

      {showModalTorre && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "420px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #f1f5f9" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>Agregar Nueva Torre</h3>
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: "#64748b" }}>Se creará automáticamente: <strong>{nombreNuevaTorre}</strong></p>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button onClick={() => setShowModalTorre(false)} style={{ padding: "0.5rem 1rem", border: "1px solid #cbd5e1", background: "#fff", borderRadius: "0.5rem", cursor: "pointer", color: "#475569", fontWeight: "700", fontSize: "0.85rem" }}>Cancelar</button>
              <button onClick={handleConfirmarTorre} disabled={procesando} style={{ padding: "0.5rem 1.25rem", background: colorSuper, color: "#fff", border: "none", borderRadius: "0.5rem", fontWeight: "700", fontSize: "0.85rem", cursor: "pointer", opacity: procesando ? 0.6 : 1 }}>
                {procesando ? "Creando..." : "Crear Torre"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalPiso && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "420px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #f1f5f9" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>Añadir Piso</h3>
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: "#64748b" }}>Torre: <strong>{torreParaPiso?.nombre}</strong> — Se creará <strong>Piso {torreParaPiso ? calcularSiguientePiso(torreParaPiso) : '?'}</strong></p>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button onClick={() => { setShowModalPiso(false); setTorreParaPiso(null) }} style={{ padding: "0.5rem 1rem", border: "1px solid #cbd5e1", background: "#fff", borderRadius: "0.5rem", cursor: "pointer", color: "#475569", fontWeight: "700", fontSize: "0.85rem" }}>Cancelar</button>
              <button onClick={handleConfirmarPiso} disabled={procesando} style={{ padding: "0.5rem 1.25rem", background: colorSuper, color: "#fff", border: "none", borderRadius: "0.5rem", fontWeight: "700", fontSize: "0.85rem", cursor: "pointer", opacity: procesando ? 0.6 : 1 }}>
                {procesando ? "Creando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalEliminar && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "400px", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <div style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "0.5rem", borderRadius: "0.5rem", display: "flex" }}>
                <FiAlertTriangle size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 0.5rem 0", fontWeight: "800", color: "#1e293b", fontSize: "1rem" }}>Confirmar Eliminación</h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>¿Eliminar <strong>{nodoAEliminar?.nombre}</strong> de la estructura?</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1.5rem" }}>
              <button onClick={() => setShowModalEliminar(false)} style={{ padding: "0.45rem 1rem", border: "1px solid #cbd5e1", background: "#fff", borderRadius: "0.5rem", cursor: "pointer", color: "#475569", fontWeight: "700", fontSize: "0.8rem" }}>Cancelar</button>
              <button onClick={handleConfirmarEliminar} disabled={procesando} style={{ padding: "0.45rem 1.25rem", background: "#ef4444", color: "#fff", border: "none", borderRadius: "0.5rem", fontWeight: "700", fontSize: "0.8rem", cursor: "pointer", opacity: procesando ? 0.6 : 1 }}>
                {procesando ? "Eliminando..." : "Sí, Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalNotificacion.visible && (
        <div style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 200, backgroundColor: modalNotificacion.tipo === 'exito' ? "#10b981" : "#ef4444", color: "#ffffff", padding: "1rem 1.5rem", borderRadius: "0.75rem", fontWeight: "700", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
          <FiHome size={18} />
          <div><strong>{modalNotificacion.titulo}</strong><br /><span style={{ fontWeight: 500, fontSize: "0.8rem" }}>{modalNotificacion.mensaje}</span></div>
          <button onClick={() => setModalNotificacion({ visible: false })} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", marginLeft: "0.5rem" }}><FiX size={16} /></button>
        </div>
      )}
    </div>
  )
}
