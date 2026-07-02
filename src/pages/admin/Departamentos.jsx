import React, { useState } from 'react'
import { FiHome, FiUserCheck, FiX, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { useAdminApartments } from '../../hooks/Admin/useAdminApartments' 
import { useAdminUsers } from '../../hooks/Admin/useAdminUsers' 

export default function Departamentos() {
  const colorAdmin = "rgb(52,151,195)"
  
  const { departamentos, loading, meta, asignarPropietario } = useAdminApartments()
  const { usuarios } = useAdminUsers() 
  
  const [filtroTorre, setFiltroTorre] = useState('todos')
  const [busqueda, setBusqueda] = useState('') 
  const [showModal, setShowModal] = useState(false)
  const [deptoSeleccionado, setDeptoSeleccionado] = useState(null)
  const [idPropietarioSeleccionado, setIdPropietarioSeleccionado] = useState('')

  const [paginaActual, setPaginaActual] = useState(1)
  const elementosPorPagina = 12 

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

  const totalElementos = deptosFiltrados.length
  const totalPaginas = Math.ceil(totalElementos / elementosPorPagina) || 1
  
  const paginaValida = Math.min(paginaActual, totalPaginas)
  const indiceInicio = (paginaValida - 1) * elementosPorPagina
  const indiceFin = indiceInicio + elementosPorPagina
  const deptosPaginados = deptosFiltrados.slice(indiceInicio, indiceFin)

  const handleOpenAssignModal = (depto) => {
    setDeptoSeleccionado(depto)
    setIdPropietarioSeleccionado(depto.idPropietario || '')
    setShowModal(true)
  }

  const handleSaveOwner = async () => {
    if (!deptoSeleccionado) return
    if (!idPropietarioSeleccionado) {
      alert("Por favor selecciona un usuario válido");
      return;
    }

    try {
      await asignarPropietario(deptoSeleccionado.id, Number(idPropietarioSeleccionado))
      setShowModal(false)
    } catch (error) {
      console.error("Error al asignar el dueño en el servidor:", error)
      alert("Hubo un error al guardar los cambios en la base de datos.")
    }
  }

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
              onChange={(e) => { setFiltroTorre(e.target.value); setPaginaActual(1); }}
            >
              <option value="todos">Todas las Torres / Bloques</option>
              <option value="A">Torre A</option>
              <option value="B">Torre B</option>
              <option value="C">Torre C</option>
            </select>
          </div>

          <div style={{ flex: 1, maxWidth: "340px", position: "relative" }}>
            <input 
              type="text" 
              style={estiloInput} 
              placeholder="Buscar por propietario o N° de dpto."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
            />
          </div>

          <small style={{ color: "#64748b", fontWeight: "600", marginLeft: "auto" }}>
            {loading ? "Cargando..." : `Viendo ${deptosPaginados.length} (Filtro: ${totalElementos} de ${meta.total || departamentos.length} totales)`}
          </small>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b", fontWeight: "600" }}>
          🔄 Conectando con el servidor de Spring Boot.
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {deptosPaginados.map((depto) => {
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
                    style={{ width: "100%", padding: "0.6rem", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "0.5rem", color: colorAdmin, fontWeight: "700", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", transition: "all 0.2s" }}
                  >
                    <FiUserCheck size={14} /> Asignar Dueño
                  </button>
                </div>
              )
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "2.5rem", borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem" }}>
            <button 
              disabled={paginaValida === 1}
              onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
              style={{ ...estiloBotonPagina, opacity: paginaValida === 1 ? 0.5 : 1, cursor: paginaValida === 1 ? "not-allowed" : "pointer" }}
            >
              <FiChevronLeft size={16} /> Anterior
            </button>
            <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: "700" }}>
              Página {paginaValida} de {totalPaginas}
            </span>
            <button 
              disabled={paginaValida === totalPaginas}
              onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
              style={{ ...estiloBotonPagina, opacity: paginaValida === totalPaginas ? 0.5 : 1, cursor: paginaValida === totalPaginas ? "not-allowed" : "pointer" }}
            >
              Siguiente <FiChevronRight size={16} />
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "420px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.08)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: "#1e293b" }}>Asignar Dueño — Dpto. {deptoSeleccionado?.numero}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <label style={estiloLabel}>Seleccionar Cuenta del Propietario</label>
              <select 
                style={estiloInput} 
                value={idPropietarioSeleccionado} 
                onChange={(e) => setIdPropietarioSeleccionado(e.target.value)}
              >
                <option value="">-- Elige un Residente --</option>
                {(usuarios || []).map(u => (
                  <option key={u.id} value={u.id}>{u.nombres} {u.apellidos} (ID: {u.id})</option>
                ))}
              </select>
              <small style={{ color: "#94a3b8", fontSize: "0.75rem", display: "block", marginTop: "0.5rem" }}>
                Spring Boot requiere vincular el ID único interno del propietario elegido.
              </small>
            </div>

            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
              <button onClick={() => setShowModal(false)} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Cancelar</button>
              <button onClick={handleSaveOwner} style={{ backgroundColor: colorAdmin, border: "none", color: "#ffffff", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Ejecutar Asignación</button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}