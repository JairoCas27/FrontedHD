import React, { useState, useMemo } from 'react'
import { FiMapPin, FiFilter, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import BadgeEstado from '../../components/BadgeEstado'

const TOTAL_PLAZAS = 342
const OCUPADAS = 267
const DISPONIBLES = 45
const MANTENCION = 30

const generarEspacios = () => {
  const espacios = []
  const bloques = ['A', 'B', 'C', 'D', 'E', 'F']
  const plazasPorBloque = Math.floor(TOTAL_PLAZAS / bloques.length)
  const residuo = TOTAL_PLAZAS % bloques.length

  let contadorOcupados = 0
  let contadorDisponibles = 0
  let contadorMantención = 0

  for (let i = 0; i < bloques.length; i++) {
    const letra = bloques[i]
    let plazasEnBloque = plazasPorBloque
    if (i < residuo) plazasEnBloque++

    for (let j = 1; j <= plazasEnBloque; j++) {
      let estado
      let residente = null
      let vehiculo = null

      if (contadorOcupados < OCUPADAS) {
        estado = 'Ocupado'
        residente = `Residente ${Math.floor(Math.random() * 100) + 1}`
        vehiculo = `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 900) + 100}`
        contadorOcupados++
      } else if (contadorMantención < MANTENCION) {
        estado = 'Mantención'
        contadorMantención++
      } else {
        estado = 'Disponible'
        contadorDisponibles++
      }

      espacios.push({
        id: espacios.length + 1,
        numero: `${letra}${j.toString().padStart(2, '0')}`,
        bloque: letra,
        estado: estado,
        residente: residente,
        vehiculo: vehiculo,
      })
    }
  }
  return espacios
}

export default function Estacionamientos() {
  const colorAdmin = "rgb(52,151,195)"
  
  const [espacios] = useState(generarEspacios())
  const [showModal, setShowModal] = useState(false)
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null)
  const [formData, setFormData] = useState({ residente: '', vehiculo: '', estado: 'Ocupado' })
  const [paginaActual, setPaginaActual] = useState(1)
  const [filtroBloque, setFiltroBloque] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const plazasPorPagina = 24

  const totalPlazas = espacios.length
  const plazasOcupadas = espacios.filter(e => e.estado === 'Ocupado').length
  const plazasDisponibles = espacios.filter(e => e.estado === 'Disponible').length
  const plazasMantención = espacios.filter(e => e.estado === 'Mantención').length
  const porcentajeOcupacion = Math.round((plazasOcupadas / totalPlazas) * 100)

  const espaciosFiltrados = useMemo(() => {
    let resultado = espacios
    if (filtroBloque !== 'todos') resultado = resultado.filter(e => e.bloque === filtroBloque)
    if (filtroEstado !== 'todos') resultado = resultado.filter(e => e.estado === filtroEstado)
    return resultado
  }, [espacios, filtroBloque, filtroEstado])

  const indexUltimo = paginaActual * plazasPorPagina
  const indexPrimero = indexUltimo - plazasPorPagina
  const espaciosPaginados = espaciosFiltrados.slice(indexPrimero, indexUltimo)
  const totalPaginas = Math.ceil(espaciosFiltrados.length / plazasPorPagina)

  const handleFilterChange = (tipo, valor) => {
    setPaginaActual(1)
    if (tipo === 'bloque') setFiltroBloque(valor)
    else setFiltroEstado(valor)
  }

  const limpiarFiltros = () => {
    setFiltroBloque('todos')
    setFiltroEstado('todos')
    setPaginaActual(1)
  }

  const handleEspacioClick = (espacio) => {
    setEspacioSeleccionado(espacio)
    setFormData({ residente: espacio.residente || '', vehiculo: espacio.vehiculo || '', estado: espacio.estado })
    setShowModal(true)
  }

  const handleUpdateEspacio = () => {
    const index = espacios.findIndex(e => e.id === espacioSeleccionado.id)
    if (index !== -1) {
      espacios[index] = { ...espacios[index], ...formData }
    }
    setShowModal(false)
  }

  const handlePageChange = (pageNumber) => {
    setPaginaActual(pageNumber)
  }

  // Estilos fijos para mantener la coherencia SaaS
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

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      
      {/* 1. Encabezado */}
      <EncabezadoTabla 
        titulo="Estacionamientos" 
        subtitulo="Gestión, asignación y estado operativo de plazas de parqueo" 
        accentColor={colorAdmin}
      />

      {/* 2. Tarjetas de Métricas Rediseñadas */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2rem", width: "100%" }}>
        <div style={{ flex: 1, minWidth: "200px", bg: "#fff", backgroundColor: "#fff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.01)" }}>
          <h3 style={{ margin: 0, color: "#ef4444", fontSize: "1.5rem", fontWeight: "800" }}>{plazasOcupadas}</h3>
          <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Plazas Ocupadas</span>
          <div style={{ width: "100%", height: "4px", backgroundColor: "#f1f5f9", borderRadius: "2px", marginTop: "0.5rem", overflow: "hidden" }}>
            <div style={{ width: `${(plazasOcupadas / totalPlazas) * 100}%`, backgroundColor: "#ef4444", hfull: "100%", height: "100%" }} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: "200px", backgroundColor: "#fff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.01)" }}>
          <h3 style={{ margin: 0, color: "#10b981", fontSize: "1.5rem", fontWeight: "800" }}>{plazasDisponibles}</h3>
          <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Plazas Disponibles</span>
          <div style={{ width: "100%", height: "4px", backgroundColor: "#f1f5f9", borderRadius: "2px", marginTop: "0.5rem", overflow: "hidden" }}>
            <div style={{ width: `${(plazasDisponibles / totalPlazas) * 100}%`, backgroundColor: "#10b981", height: "100%" }} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: "200px", backgroundColor: "#fff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.01)" }}>
          <h3 style={{ margin: 0, color: "#f59e0b", fontSize: "1.5rem", fontWeight: "800" }}>{plazasMantención}</h3>
          <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>En Mantención</span>
          <div style={{ width: "100%", height: "4px", backgroundColor: "#f1f5f9", borderRadius: "2px", marginTop: "0.5rem", overflow: "hidden" }}>
            <div style={{ width: `${(plazasMantención / totalPlazas) * 100}%`, backgroundColor: "#f59e0b", height: "100%" }} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: "200px", backgroundColor: colorAdmin, padding: "1.25rem", borderRadius: "1rem", color: "#fff", boxShadow: "0 4px 6px rgba(52,151,195,0.15)" }}>
          <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "800" }}>{totalPlazas}</h3>
          <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "rgba(255,255,255,0.8)", textTransform: "uppercase" }}>Total de Plazas</span>
          <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", fontWeight: "600" }}>Ocupación Global: {porcentajeOcupacion}%</p>
        </div>
      </div>

      {/* 3. Filtros Estilizados */}
      <div style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "end" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={estiloLabel}><FiFilter style={{ marginRight: "4px" }} /> Filtrar por Zona</label>
            <select style={estiloInput} value={filtroBloque} onChange={(e) => handleFilterChange('bloque', e.target.value)}>
              <option value="todos">Todas las zonas</option>
              <option value="A">Zona A (Norte)</option>
              <option value="B">Zona B (Este)</option>
              <option value="C">Zona C (Sur)</option>
              <option value="D">Zona D (Oeste)</option>
              <option value="E">Zona E (Central)</option>
              <option value="F">Zona F (Visitas)</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label style={estiloLabel}><FiFilter style={{ marginRight: "4px" }} /> Filtrar por Estado</label>
            <select style={estiloInput} value={filtroEstado} onChange={(e) => handleFilterChange('estado', e.target.value)}>
              <option value="todos">Todos los estados</option>
              <option value="Ocupado">Ocupados</option>
              <option value="Disponible">Disponibles</option>
              <option value="Mantención">En Mantención</option>
            </select>
          </div>
          <div style={{ minWidth: "150px" }}>
            <button 
              onClick={limpiarFiltros}
              style={{ width: "100%", padding: "0.65rem 1rem", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", color: "#64748b", borderRadius: "0.5rem", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer" }}
            >
              <FiX style={{ marginRight: "4px" }} /> Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* 4. Malla o Grid de Plazas Premium */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {espaciosPaginados.map((espacio) => {
          let colorBorde = "#ef4444"
          if (espacio.estado === 'Disponible') colorBorde = "#10b981"
          if (espacio.estado === 'Mantención') colorBorde = "#f59e0b"

          return (
            <div 
              key={espacio.id}
              onClick={() => handleEspacioClick(espacio)}
              style={{ backgroundColor: "#ffffff", border: `1px solid ${colorBorde}`, padding: "1.25rem 0.75rem", borderRadius: "0.75rem", textAlign: "center", cursor: "pointer", transition: "transform 0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.01)" }}
            >
              <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>{espacio.numero}</h5>
              <BadgeEstado estado={espacio.estado} />
              {espacio.residente && (
                <small style={{ display: "block", color: "#64748b", fontSize: "0.7rem", fontWeight: "600", marginTop: "0.5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {espacio.residente.split(' ')[0]}
                </small>
              )}
              <small style={{ display: "block", color: "#94a3b8", fontSize: "0.65rem", marginTop: "0.25rem", fontStyle: "italic" }}>Zona {espacio.bloque}</small>
            </div>
          )
        })}
      </div>

      {/* 5. Paginación Pro sin dependencias de Bootstrap */}
      {totalPaginas > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginTop: "2.5rem" }}>
          <button 
            disabled={paginaActual === 1} 
            onClick={() => handlePageChange(paginaActual - 1)}
            style={{ padding: "0.5rem", border: "1px solid #cbd5e1", backgroundColor: "#fff", borderRadius: "0.375rem", cursor: paginaActual === 1 ? "not-allowed" : "pointer" }}
          >
            <FiChevronLeft size={16} />
          </button>
          
          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              style={{
                padding: "0.4rem 0.8rem",
                borderRadius: "0.375rem",
                border: "1px solid #cbd5e1",
                fontWeight: "700",
                fontSize: "0.85rem",
                cursor: "pointer",
                backgroundColor: paginaActual === i + 1 ? colorAdmin : "#ffffff",
                color: paginaActual === i + 1 ? "#ffffff" : "#334155"
              }}
            >
              {i + 1}
            </button>
          ))}

          <button 
            disabled={paginaActual === totalPaginas} 
            onClick={() => handlePageChange(paginaActual + 1)}
            style={{ padding: "0.5rem", border: "1px solid #cbd5e1", backgroundColor: "#fff", borderRadius: "0.375rem", cursor: paginaActual === totalPaginas ? "not-allowed" : "pointer" }}
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}

      {/* 6. Modal de Edición Estructurado con Labels */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "460px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.08)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: "#1e293b" }}>Plaza {espacioSeleccionado?.numero} — Zona {espacioSeleccionado?.bloque}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>

            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={estiloLabel}>Estado de la Plaza</label>
                <select style={estiloInput} value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })}>
                  <option value="Disponible">🟢 Disponible</option>
                  <option value="Ocupado">🔴 Ocupado</option>
                  <option value="Mantención">🟡 En Mantención</option>
                </select>
              </div>

              <div>
                <label style={estiloLabel}>Residente / Titular</label>
                <input 
                  type="text" 
                  style={estiloInput} 
                  placeholder="Nombre completo" 
                  value={formData.residente} 
                  onChange={(e) => setFormData({ ...formData, residente: e.target.value })}
                  disabled={formData.estado !== 'Ocupado'} 
                />
              </div>

              <div>
                <label style={estiloLabel}>Vehículo Asignado (Placa)</label>
                <input 
                  type="text" 
                  style={estiloInput} 
                  placeholder="Ej: ABC-123" 
                  value={formData.vehiculo} 
                  onChange={(e) => setFormData({ ...formData, vehiculo: e.target.value.toUpperCase() })}
                  disabled={formData.estado !== 'Ocupado'} 
                />
              </div>
            </div>

            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
              <button onClick={() => setShowModal(false)} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Cancelar</button>
              <button onClick={handleUpdateEspacio} style={{ backgroundColor: colorAdmin, border: "none", color: "#ffffff", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Guardar Cambios</button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}