import React, { useState, useEffect, useMemo } from 'react'
import { FiGitCommit, FiTrash2, FiFolder, FiX, FiInfo, FiPlus, FiLoader, FiAlertCircle } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { useAdminStructure } from '../../hooks/Admin/useAdminStructure'

export default function Estructura() {
  const colorAdmin = "rgb(52,151,195)"
  const { estructura, loading, insertarNodo, eliminarNodo, agregarDepartamento, } = useAdminStructure()

  const [showModal, setShowModal] = useState(false)
  const [showApartmentModal, setShowApartmentModal] = useState(false)
  const [nuevoNodo, setNuevoNodo] = useState({ nombre: '', padreId: '' })
  const [nuevoDepartamento, setNuevoDepartamento] = useState({
    numero: '',
    metraje: '',
    idPiso: '',
    tieneEstacionamiento: false
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [departamentosExistentes, setDepartamentosExistentes] = useState([])

  const listaTorres = Array.isArray(estructura)
    ? estructura
    : (estructura?.torres || [])

  // Obtener todos los pisos disponibles
  const todosLosPisos = useMemo(() => {
    return listaTorres.flatMap(torre =>
      (torre.pisos || []).map(piso => ({
        ...piso,
        torreNombre: torre.nombre,
        torreId: torre.id,
        apartamentos: piso.apartamentos || []
      }))
    );
  }, [listaTorres]);

  // Actualizar departamentos existentes cuando cambia el piso seleccionado
  useEffect(() => {
    if (nuevoDepartamento.idPiso) {
      const pisoSeleccionado = todosLosPisos.find(p => p.id === parseInt(nuevoDepartamento.idPiso));
      if (pisoSeleccionado) {
        setDepartamentosExistentes(pisoSeleccionado.apartamentos || []);
      }
    } else {
      setDepartamentosExistentes([]);
    }
  }, [nuevoDepartamento.idPiso, todosLosPisos]);

  const handleAddNode = async (e) => {
    e.preventDefault()
    if (!nuevoNodo.nombre.trim()) return

    setIsSubmitting(true)
    setErrorMessage('')

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
      setSuccessMessage(`${payload.tipo} creada correctamente`);

      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error("Error al insertar el nodo estructural:", error)
      setErrorMessage(`${error.message || 'Hubo un problema al crear la sección.'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddApartment = async (e) => {
    e.preventDefault()
    if (isSubmitting) return;

    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    if (!nuevoDepartamento.numero || !nuevoDepartamento.idPiso) {
      setErrorMessage('Por favor completa todos los campos obligatorios')
      setIsSubmitting(false)
      return
    }

    // Validación local de duplicados
    const numeroExistente = departamentosExistentes.some(
      d => d.numero === parseInt(nuevoDepartamento.numero)
    );

    if (numeroExistente) {
      setErrorMessage(`El departamento ${nuevoDepartamento.numero} ya existe en este piso.`);
      setIsSubmitting(false);
      return;
    }

    try {
      // Encontrar el piso seleccionado
      const pisoSeleccionado = todosLosPisos.find(p => p.id === parseInt(nuevoDepartamento.idPiso));

      if (!pisoSeleccionado) {
        throw new Error('Piso no encontrado');
      }

      // Llamada SIMPLIFICADA al hook - pasamos los datos y el piso encontrado
      await agregarDepartamento(nuevoDepartamento, pisoSeleccionado);

      setSuccessMessage(`Departamento ${nuevoDepartamento.numero} creado exitosamente`)
      setShowApartmentModal(false)
      setNuevoDepartamento({
        numero: '',
        metraje: '',
        idPiso: '',
        tieneEstacionamiento: false
      })

      setTimeout(() => setSuccessMessage(''), 3000)

    } catch (error) {
      console.error("Error al agregar departamento:", error)
      setErrorMessage(error.message || 'Error al crear el departamento. Verifica los datos.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteNode = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este nodo de la estructura arquitectónica?")) return

    setIsSubmitting(true)
    try {
      await eliminarNodo(id)
      setSuccessMessage('Nodo eliminado correctamente')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error("Error al eliminar el nodo:", error)
      setErrorMessage(`${error.message || 'No se pudo eliminar el nodo.'}`)
    } finally {
      setIsSubmitting(false)
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
      <div className="estructura-container" style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>

      {/* Mensajes de éxito/error */}
      {successMessage && (
        <div style={{
          backgroundColor: "#dcfce7",
          border: "1px solid #86efac",
          color: "#16a34a",
          padding: "0.75rem 1rem",
          borderRadius: "0.5rem",
          marginBottom: "1rem",
          fontWeight: "600"
        }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{
          backgroundColor: "#fee2e2",
          border: "1px solid #fecaca",
          color: "#dc2626",
          padding: "0.75rem 1rem",
          borderRadius: "0.5rem",
          marginBottom: "1rem",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <FiAlertCircle />
          {errorMessage}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", gap: '1rem' }}>
        <EncabezadoTabla
          titulo="Estructura del Condominio"
          subtitulo="Organigrama de nodos físicos para la segmentación de bloques, sectores y niveles residenciales"
          botonTexto="Agregar Torre / Piso"
          accentColor={colorAdmin}
          onBotonClick={() => setShowModal(true)}
        />

      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#64748b", fontWeight: "600" }}>
          Dibujando organigrama arquitectónico desde el servidor.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
          {listaTorres.map((torre) => (
              <div key={torre.id} className="torre-card" style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "1rem", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>

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
                  disabled={isSubmitting}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingLeft: "1.25rem", borderLeft: "2px dashed #cbd5e1" }}>
                {torre.pisos?.map((piso) => (
                    <div key={piso.id} className="piso-card" style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: "700", color: "#334155", fontSize: "0.9rem" }}>
                        <FiGitCommit style={{ color: "#94a3b8" }} />
                        <span>{piso.nombre || `Piso ${piso.numero}`}</span>
                        <span style={{ fontSize: "0.7rem", backgroundColor: "#e2e8f0", padding: "0.1rem 0.4rem", borderRadius: "0.25rem", color: "#475569" }}>
                          {piso.apartamentos?.length || 0} dptos
                        </span>
                      </div>


                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button
                            onClick={() => {
                              setNuevoDepartamento({ ...nuevoDepartamento, idPiso: piso.id });
                              setShowApartmentModal(true);
                            }}
                            className="btn-agregar-dpto"
                            style={{
                              backgroundColor: colorAdmin,
                              color: "white",
                              border: "none",
                              padding: "0.4rem 0.8rem",
                              borderRadius: "0.4rem",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              fontSize: "0.75rem",
                              whiteSpace: "nowrap"
                            }}
                        >
                          <FiPlus size={14} />
                          Agregar Dpto
                        </button>

                        <button
                          onClick={() => handleDeleteNode(piso.id)}
                          style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                          title="Eliminar Nivel"
                          disabled={isSubmitting}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", paddingLeft: "0.5rem" }}>
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
                            {dpto.derechoEstacionamiento && (
                              <span style={{ color: "#22c55e", fontSize: "0.6rem" }}>
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
            <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)", padding: "1rem" }}>
              <div className="modal-content" style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "420px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.08)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: "#1e293b" }}>Agregar Nuevo Nodo Estructural</h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
                disabled={isSubmitting}
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNode}>
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={estiloLabel}>Ubicación Jerárquica (Padre)</label>
                  <select
                    style={estiloInput}
                    value={nuevoNodo.padreId}
                    onChange={(e) => setNuevoNodo({ ...nuevoNodo, padreId: e.target.value })}
                    disabled={isSubmitting}
                  >
                    <option value="">[Raíz] Crear Nueva Torre Principal</option>
                    {listaTorres.map(t => (
                      <option key={t.id} value={t.id}>Subnivel dentro de: {t.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={estiloLabel}>Nombre del Nodo</label>
                  <input
                    type="text"
                    style={estiloInput}
                    placeholder="Ej: Torre C o Piso 3"
                    value={nuevoNodo.nombre}
                    onChange={(e) => setNuevoNodo({ ...nuevoNodo, nombre: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />

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
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    color: "#475569",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    opacity: isSubmitting ? 0.5 : 1
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: colorAdmin,
                    border: "none",
                    color: "#ffffff",
                    padding: "0.5rem 1.25rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.6 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting && <FiLoader size={16} style={{ animation: "spin 1s linear infinite" }} />}
                  Insertar Nodo
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal para Departamentos */}
        {showApartmentModal && (
            <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)", padding: "1rem" }}>
              <div className="modal-content" style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.08)", border: "1px solid #e2e8f0", overflow: "hidden" }}>

            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: "#1e293b" }}>
                Agregar Nuevo Departamento
                {isSubmitting && <FiLoader size={16} style={{ marginLeft: "0.5rem", animation: "spin 1s linear infinite" }} />}
              </h3>
              <button
                onClick={() => setShowApartmentModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
                disabled={isSubmitting}
              >
                <FiX size={18} />
              </button>
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label style={estiloLabel}>Ubicación (Piso) *</label>
                  <select
                    style={estiloInput}
                    value={nuevoDepartamento.idPiso}
                    onChange={(e) => setNuevoDepartamento({ ...nuevoDepartamento, idPiso: e.target.value })}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Seleccionar Piso</option>
                    {todosLosPisos.map(piso => (
                      <option key={piso.id} value={piso.id}>
                        {piso.torreNombre} - {piso.nombre || `Piso ${piso.numero}`}
                        {piso.apartamentos && piso.apartamentos.length > 0 &&
                          ` (${piso.apartamentos.length} departamentos)`
                        }
                      </option>
                    ))}
                  </select>
                  {todosLosPisos.length === 0 && (
                    <div style={{ fontSize: "0.75rem", color: "#f59e0b", marginTop: "0.3rem" }}>
                      No hay pisos disponibles. Crea una torre y un piso primero.
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <input
                    type="checkbox"
                    id="tieneEstacionamiento"
                    checked={nuevoDepartamento.tieneEstacionamiento}
                    onChange={(e) => setNuevoDepartamento({ ...nuevoDepartamento, tieneEstacionamiento: e.target.checked })}
                    style={{ width: "1rem", height: "1rem", cursor: "pointer" }}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="tieneEstacionamiento" style={{ fontSize: "0.9rem", fontWeight: "500", color: "#334155", cursor: "pointer" }}>
                    Tiene derecho de estacionamiento
                  </label>
                </div>

                {/* Mostrar departamentos existentes en el piso */}
                {nuevoDepartamento.idPiso && departamentosExistentes.length > 0 && (
                  <div style={{
                    backgroundColor: "#f1f5f9",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.75rem",
                    color: "#64748b"
                  }}>
                    Departamentos en este piso: {departamentosExistentes.map(d => d.numero).join(', ')}
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
                <button
                  type="button"
                  onClick={() => setShowApartmentModal(false)}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    color: "#475569",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    opacity: isSubmitting ? 0.5 : 1
                  }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: colorAdmin,
                    border: "none",
                    color: "#ffffff",
                    padding: "0.5rem 1.25rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.6 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting && <FiLoader size={16} style={{ animation: "spin 1s linear infinite" }} />}
                  Crear Departamento
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Estilos para la animación */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        @media (max-width: 768px) {
    .estructura-container {
      padding: 1rem !important;
    }
    .torre-card {
      padding: 1rem !important;
    }
    .piso-card {
      padding: 0.75rem !important;
    }
  }
  
  @media (max-width: 480px) {
    .estructura-container {
      padding: 0.75rem !important;
    }
    .modal-content {
      max-width: 95% !important;
      margin: 0 0.5rem !important;
    }
    .torre-card {
      padding: 0.75rem !important;
    }
    .piso-card {
      padding: 0.5rem !important;
    }
    .btn-agregar-dpto {
      font-size: 0.7rem !important;
      padding: 0.3rem 0.6rem !important;
    }
  }
`}</style>
    </div>
  )
}