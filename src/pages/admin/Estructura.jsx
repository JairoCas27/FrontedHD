import React, { useState } from 'react'
import { FiGitCommit, FiPlus, FiTrash2, FiFolder, FiFolderPlus, FiX } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'

// Simulación de datos de la estructura arbórea jerárquica
const estructuraInicial = [
  {
    id: 1,
    nombre: "Torre A",
    tipo: "Torre",
    pisos: [
      { id: 11, nombre: "Piso 1", departamentos: ["Dpto 101", "Dpto 102", "Dpto 103"] },
      { id: 12, nombre: "Piso 2", departamentos: ["Dpto 201", "Dpto 202"] }
    ]
  },
  {
    id: 2,
    nombre: "Torre B",
    tipo: "Torre",
    pisos: [
      { id: 21, nombre: "Piso 1", departamentos: ["Dpto 101", "Dpto 102"] }
    ]
  }
]

export default function Estructura() {
  const colorAdmin = "rgb(52,151,195)"
  
  const [estructura, setEstructura] = useState(estructuraInicial)
  const [showModal, setShowModal] = useState(false)
  const [nuevoNodo, setNuevoNodo] = useState({ nombre: '', padreId: '' })

  // Simulación de POST /api/admin/structure/nodes
  const handleAddNode = (e) => {
    e.preventDefault()
    if (!nuevoNodo.nombre.trim()) return

    if (!nuevoNodo.padreId) {
      // Agregar nueva Torre raíz
      const newId = Date.now()
      setEstructura([...estructura, { id: newId, nombre: nuevoNodo.nombre, tipo: "Torre", pisos: [] }])
    } else {
      // Agregar Piso a una Torre existente
      setEstructura(estructura.map(torre => {
        if (torre.id === parseInt(nuevoNodo.padreId)) {
          return {
            ...torre,
            pisos: [...torre.pisos, { id: Date.now(), nombre: nuevoNodo.nombre, departamentos: [] }]
          }
        }
        return torre
      }))
    }
    
    setShowModal(false)
    setNuevoNodo({ nombre: '', padreId: '' })
  }

  // Simulación de DELETE /api/admin/structure/nodes/{id}
  const handleDeleteNode = (torreId, pisoId = null) => {
    if (!window.confirm("¿Seguro que deseas eliminar este nodo de la estructura arquitectónica?")) return

    if (pisoId === null) {
      // Eliminar Torre completa
      setEstructura(estructura.filter(t => t.id !== torreId))
    } else {
      // Eliminar Piso dentro de una torre
      setEstructura(estructura.map(t => {
        if (t.id === torreId) {
          return { ...t, pisos: t.pisos.filter(p => p.id !== pisoId) }
        }
        return t
      }))
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
      
      {/* 1. Encabezado Reutilizable */}
      <EncabezadoTabla 
        titulo="Estructura del Condominio" 
        subtitulo="Organigrama de nodos físicos para la segmentación de bloques, sectores y niveles residenciales"
        botonTexto="Agregar Nodo / Sección"
        accentColor={colorAdmin}
        onBotonClick={() => setShowModal(true)}
      />

      {/* 2. Árbol de Estructura Jerárquica */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
        {estructura.map((torre) => (
          <div key={torre.id} style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "1rem", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
            
            {/* Nivel 1: Torre */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FiFolder size={20} style={{ color: colorAdmin }} />
                <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>{torre.nombre}</span>
                <span style={{ fontSize: "0.75rem", backgroundColor: "rgba(52,151,195,0.1)", color: colorAdmin, padding: "0.2rem 0.5rem", borderRadius: "0.375rem", fontWeight: "700" }}>
                  {torre.pisos.length} Niveles
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

            {/* Nivel 2: Pisos / Subnodos */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingLeft: "1.25rem", borderLeft: "2px dashed #cbd5e1" }}>
              {torre.pisos.map((piso) => (
                <div key={piso.id} style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: "700", color: "#334155", fontSize: "0.9rem" }}>
                      <FiGitCommit style={{ color: "#94a3b8" }} />
                      <span>{piso.nombre}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteNode(torre.id, piso.id)}
                      style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>

                  {/* Nivel 3: Unidades / Hojas del árbol */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", paddingLeft: "1rem" }}>
                    {piso.departamentos.length > 0 ? (
                      piso.departamentos.map((dpto, idx) => (
                        <span key={idx} style={{ fontSize: "0.75rem", backgroundColor: "#ffffff", border: "1px solid #e2e8f0", padding: "0.2rem 0.5rem", borderRadius: "0.375rem", color: "#475569", fontWeight: "600" }}>
                          {dpto}
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
      </div>

      {/* 3. Modal de Creación (POST /api/admin/structure/nodes) */}
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
                    {estructura.map(t => (
                      <option key={t.id} value={t.id}>Subnivel dentro de: {t.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={estiloLabel}>Nombre del Nodo</label>
                  <input type="text" style={estiloInput} placeholder="Ej: Torre C o Piso 3" value={nuevoNodo.nombre} onChange={(e) => setNuevoNodo({ ...nuevoNodo, nombre: e.target.value })} required />
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

    </div>
  )
}