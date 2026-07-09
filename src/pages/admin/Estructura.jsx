import React, { useState, useEffect } from 'react'
import { FiGitCommit, FiTrash2, FiFolder, FiX, FiInfo, FiPlus } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { useAdminStructure } from '../../hooks/Admin/useAdminStructure'

export default function Estructura() {
  const colorAdmin = "rgb(52,151,195)"
  const { estructura, loading, insertarNodo, eliminarNodo, agregarDepartamento, refrescar } = useAdminStructure()

  const [showModal, setShowModal] = useState(false)
  const [showApartmentModal, setShowApartmentModal] = useState(false)
  const [nuevoNodo, setNuevoNodo] = useState({ nombre: '', padreId: '' })
  const [nuevoDepartamento, setNuevoDepartamento] = useState({
    numero: '',
    metraje: '',
    idPiso: '',
    tieneEstacionamiento: false
  })
  const [errorMessage, setErrorMessage] = useState('') // 🆕 Para mostrar errores

  const listaTorres = Array.isArray(estructura)
      ? estructura
      : (estructura?.torres || [])

  // Obtener todos los pisos disponibles (se actualiza cuando cambia la estructura)
  const todosLosPisos = listaTorres.flatMap(torre =>
      (torre.pisos || []).map(piso => ({
        ...piso,
        torreNombre: torre.nombre
      }))
  )

  // Forzar recarga cuando se abre el modal de departamento
  useEffect(() => {
    if (showApartmentModal) {
      refrescar(); // Recargar estructura para tener los datos más recientes
    }
  }, [showApartmentModal, refrescar])

  const handleAddNode = async (e) => {
    e.preventDefault()
    if (!nuevoNodo.nombre.trim()) return

    try {
      let nombreTorreSeleccionada = null;
      let numeroPisoDetectado = null;

      if (nuevoNodo.padreId) {
        const torreEncontrada = listaTorres.find(t => String(t.id) === String(nuevoNodo.padreId));
        if (torreEncontrada) {
          nombreTorreSeleccionada = torreEncontrada.nombre;
        }

        const digitos = nuevoNodo.nombre.match(/\d+/);
        if (digitos) {
          numeroPisoDetectado = parseInt(digitos[0], 10);
        } else {
          numeroPisoDetectado = 1;
        }
      }

      const payload = {
        tipo: nuevoNodo.padreId ? "PISO" : "TORRE",
        nombre: nuevoNodo.nombre.trim(),
        nombreTorre: nombreTorreSeleccionada,
        numeroPiso: numeroPisoDetectado,
        numero: numeroPisoDetectado
      };

      await insertarNodo(payload);
      setShowModal(false);
      setNuevoNodo({ nombre: '', padreId: '' });

      // Recargar después de crear torre/piso
      await refrescar();

    } catch (error) {
      console.error("Error al insertar el nodo estructural:", error)
      alert("Hubo un problema al crear la sección en el servidor.")
    }
  }

  const handleAddApartment = async (e) => {
    e.preventDefault()
    setErrorMessage('') // Limpiar error anterior

    if (!nuevoDepartamento.numero || !nuevoDepartamento.idPiso) {
      setErrorMessage('Por favor completa todos los campos obligatorios')
      return
    }

    try {
      await agregarDepartamento(nuevoDepartamento)
      setShowApartmentModal(false)
      setNuevoDepartamento({
        numero: '',
        metraje: '',
        idPiso: '',
        tieneEstacionamiento: false
      })
      await refrescar(); // Recargar para ver el nuevo departamento
    } catch (error) {
      console.error("Error al agregar departamento:", error)

      // Mostrar mensaje de error más específico
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        setErrorMessage('El número de departamento ya existe en este piso. Por favor elige otro número.')
      } else if (error.message.includes('Piso no encontrado')) {
        setErrorMessage('El piso seleccionado no existe. Por favor recarga la página e intenta de nuevo.')
      } else {
        setErrorMessage(`Error al crear el departamento: ${error.message || 'Verifica los datos e intenta de nuevo.'}`)
      }
    }
  }

  const handleDeleteNode = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este nodo de la estructura arquitectónica?")) return

    try {
      await eliminarNodo(id)
      await refrescar(); // Recargar después de eliminar
    } catch (error) {
      console.error("Error al eliminar el nodo:", error)
      alert("No se pudo eliminar el nodo. Asegúrate de que no contenga subelementos activos.")
    }
  }

  const estiloInput = {
    width: "100%",
    padding: "0.65rem 0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid #cbd5e1",
    fontSize: "0.9rem",
    color: "#334155",
    boxSizing: "border-box",
    outline: "none"
  }

  const estiloLabel = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "0.4rem",
    textTransform: "uppercase"
  }

  return (
      <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <EncabezadoTabla
              titulo="Estructura del Condominio"
              subtitulo="Organigrama de nodos físicos para la segmentación de bloques, sectores y niveles residenciales"
              botonTexto="Agregar Torre / Piso"
              accentColor={colorAdmin}
              onBotonClick={() => setShowModal(true)}
          />

          <button
              onClick={() => setShowApartmentModal(true)}
              style={{
                backgroundColor: colorAdmin,
                color: "white",
                border: "none",
                padding: "0.65rem 1.5rem",
                borderRadius: "0.5rem",
                fontWeight: "600",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(52,151,195,0.2)",
                whiteSpace: "nowrap"
              }}
          >
            <FiPlus size={18} />
            Agregar Departamento
          </button>
        </div>

        {loading ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#64748b", fontWeight: "600" }}>
              Dibujando organigrama arquitectónico desde el servidor.
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
                      <button
                          onClick={() => handleDeleteNode(torre.id)}
                          style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.25rem" }}
                          title="Eliminar Torre"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingLeft: "1.25rem", borderLeft: "2px dashed #cbd5e1" }}>
                      {torre.pisos?.map((piso) => (
                          <div key={piso.id} style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: "700", color: "#334155", fontSize: "0.9rem" }}>
                                <FiGitCommit style={{ color: "#94a3b8" }} />
                                <span>{piso.nombre || `Piso ${piso.numero}`}</span>
                              </div>
                              <button
                                  onClick={() => handleDeleteNode(piso.id)}
                                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                                  title="Eliminar Nivel"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>

                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", paddingLeft: "1rem" }}>
                              {piso.apartamentos && piso.apartamentos.length > 0 ? (
                                  piso.apartamentos.map((dpto, idx) => (
                                      <span key={dpto.id || idx} style={{
                                        fontSize: "0.75rem",
                                        backgroundColor: "#ffffff",
                                        border: "1px solid #e2e8f0",
                                        padding: "0.2rem 0.5rem",
                                        borderRadius: "0.375rem",
                                        color: "#475569",
                                        fontWeight: "600",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.3rem"
                                      }}>
                            Dpto. {dpto.numero || dpto}
                                        {dpto.metraje && (
                                            <span style={{ fontWeight: "400", color: "#94a3b8" }}>
                                ({dpto.metraje}m²)
                              </span>
                                        )}
                          </span>
                                  ))
                              ) : (
                                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontStyle: "italic" }}>Sin unidades vinculadas</span>
                              )}
                            </div>
                          </div>
                      ))}
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

        {/* Modal para Torres/Pisos */}
        {showModal && (
            <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
              <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "420px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.08)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: "#1e293b" }}>Agregar Nuevo Nodo Estructural</h3>
                  <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
                </div>

                <form onSubmit={handleAddNode}>
                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                      <label style={estiloLabel}>Ubicación Jerárquica (Padre)</label>
                      <select style={estiloInput} value={nuevoNodo.padreId} onChange={(e) => setNuevoNodo({ ...nuevoNodo, padreId: e.target.value })}>
                        <option value="">[Raíz] Crear Nueva Torre Principal</option>
                        {listaTorres.map(t => (
                            <option key={t.id} value={t.id}>Subnivel dentro de: {t.nombre}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={estiloLabel}>Nombre del Nodo</label>
                      <input type="text" style={estiloInput} placeholder="Ej: Torre C o Piso 3" value={nuevoNodo.nombre} onChange={(e) => setNuevoNodo({ ...nuevoNodo, nombre: e.target.value })} required />

                      <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", padding: "0.6rem 0.75rem", borderRadius: "0.375rem", marginTop: "0.6rem" }}>
                        <FiInfo size={14} style={{ color: "#16a34a", flexShrink: 0 }} />
                        <span style={{ fontSize: "0.75rem", color: "#166534", fontWeight: "600", lineHeight: "1.3" }}>
                      {nuevoNodo.padreId
                          ? "Importante: Incluye el número positivo del nivel en el nombre (Ej: 'Piso 1' o 'Nivel 2') para indexarlo correctamente."
                          : "Formato: Escribe el nombre de la estructura principal (Ej: 'Torre A', 'Bloque B')."}
                    </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
                    <button type="button" onClick={() => setShowModal(false)} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Cancelar</button>
                    <button type="submit" style={{ backgroundColor: colorAdmin, border: "none", color: "#ffffff", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Insertar Nodo</button>
                  </div>
                </form>

              </div>
            </div>
        )}

        {/* Modal para Departamentos */}
        {showApartmentModal && (
            <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
              <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "480px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.08)", border: "1px solid #e2e8f0", overflow: "hidden" }}>

                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: "#1e293b" }}>Agregar Nuevo Departamento</h3>
                  <button onClick={() => setShowApartmentModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
                </div>

                <form onSubmit={handleAddApartment}>
                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                    <div>
                      <label style={estiloLabel}>Número de Departamento *</label>
                      <input
                          type="number"
                          style={estiloInput}
                          placeholder="Ej: 101"
                          value={nuevoDepartamento.numero}
                          onChange={(e) => setNuevoDepartamento({ ...nuevoDepartamento, numero: e.target.value })}
                          required
                          min="1"
                      />
                    </div>

                    <div>
                      <label style={estiloLabel}>Metraje (m²)</label>
                      <input
                          type="number"
                          style={estiloInput}
                          placeholder="Ej: 85.5"
                          value={nuevoDepartamento.metraje}
                          onChange={(e) => setNuevoDepartamento({ ...nuevoDepartamento, metraje: e.target.value })}
                          step="0.1"
                          min="0"
                      />
                    </div>

                    <div>
                      <label style={estiloLabel}>Ubicación (Piso) *</label>
                      <select
                          style={estiloInput}
                          value={nuevoDepartamento.idPiso}
                          onChange={(e) => setNuevoDepartamento({ ...nuevoDepartamento, idPiso: e.target.value })}
                          required
                      >
                        <option value="">Seleccionar Piso</option>
                        {todosLosPisos.map(piso => (
                            <option key={piso.id} value={piso.id}>
                              {piso.torreNombre} - {piso.nombre || `Piso ${piso.numero}`}
                            </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <input
                          type="checkbox"
                          id="tieneEstacionamiento"
                          checked={nuevoDepartamento.tieneEstacionamiento}
                          onChange={(e) => setNuevoDepartamento({ ...nuevoDepartamento, tieneEstacionamiento: e.target.checked })}
                          style={{ width: "1rem", height: "1rem", cursor: "pointer" }}
                      />
                      <label htmlFor="tieneEstacionamiento" style={{ fontSize: "0.9rem", fontWeight: "500", color: "#334155", cursor: "pointer" }}>
                        Tiene derecho de estacionamiento
                      </label>
                    </div>

                    {/* Mostrar mensaje de error */}
                    {errorMessage && (
                        <div style={{
                          backgroundColor: "#fee2e2",
                          border: "1px solid #fecaca",
                          padding: "0.6rem 0.75rem",
                          borderRadius: "0.375rem",
                          color: "#dc2626",
                          fontSize: "0.85rem"
                        }}>
                          {errorMessage}
                        </div>
                    )}

                    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", padding: "0.6rem 0.75rem", borderRadius: "0.375rem" }}>
                      <FiInfo size={14} style={{ color: "#16a34a", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.75rem", color: "#166534", fontWeight: "600", lineHeight: "1.3" }}>
                    El número de departamento debe ser único dentro del piso seleccionado.
                  </span>
                    </div>
                  </div>

                  <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
                    <button type="button" onClick={() => setShowApartmentModal(false)} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Cancelar</button>
                    <button type="submit" style={{ backgroundColor: colorAdmin, border: "none", color: "#ffffff", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>
                      Crear Departamento
                    </button>
                  </div>
                </form>

              </div>
            </div>
        )}

      </div>
  )
}