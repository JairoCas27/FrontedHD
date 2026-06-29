import React, { useState } from 'react'
import { FiHome, FiUserCheck, FiX } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'

const departamentosIniciales = [
  { id: 101, torre: 'Torre A', piso: 1, numero: '101', propietario: 'Carlos López', ocupantes: 3, estado: 'Habitado' },
  { id: 102, torre: 'Torre A', piso: 1, numero: '102', propietario: 'Ana Martínez', ocupantes: 2, estado: 'Habitado' },
  { id: 103, torre: 'Torre A', piso: 1, numero: '103', propietario: null, ocupantes: 0, estado: 'Desocupado' },
  { id: 201, torre: 'Torre B', piso: 2, numero: '201', propietario: 'María García', ocupantes: 4, estado: 'Habitado' },
  { id: 202, torre: 'Torre B', piso: 2, numero: '202', propietario: null, ocupantes: 0, estado: 'En Alquiler' },
]

export default function Departamentos() {
  const colorAdmin = "rgb(52,151,195)"
  
  const [departamentos, setDepartamentos] = useState(departamentosIniciales)
  const [filtroTorre, setFiltroTorre] = useState('todos')
  const [showModal, setShowModal] = useState(false)
  const [deptoSeleccionado, setDeptoSeleccionado] = useState(null)
  const [nuevoPropietario, setNuevoPropietario] = useState('')

  const deptosFiltrados = departamentos.filter(d => {
    if (filtroTorre !== 'todos' && d.torre !== filtroTorre) return false
    return true
  })

  const handleOpenAssignModal = (depto) => {
    setDeptoSeleccionado(depto)
    setNuevoPropietario(depto.propietario || '')
    setShowModal(true)
  }

  const handleSaveOwner = () => {
    if (deptoSeleccionado) {
      setDepartamentos(departamentos.map(d => 
        d.id === deptoSeleccionado.id 
          ? { ...d, propietario: nuevoPropietario.trim() || null, estado: nuevoPropietario.trim() ? 'Habitado' : 'Desocupado' } 
          : d
      ))
      setShowModal(false)
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

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      
      <EncabezadoTabla 
        titulo="Departamentos" 
        subtitulo="Control de unidades inmobiliarias, ocupantes y asignación legal de propietarios"
      />

      <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ width: "240px" }}>
            <select style={estiloInput} value={filtroTorre} onChange={(e) => setFiltroTorre(e.target.value)}>
              <option value="todos">🛕 Todas las Torres / Bloques</option>
              <option value="Torre A">Torre A</option>
              <option value="Torre B">Torre B</option>
            </select>
          </div>
          <small style={{ color: "#64748b", fontWeight: "500" }}>
            Mostrando {deptosFiltrados.length} departamentos registrados
          </small>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {deptosFiltrados.map((depto) => (
          <div 
            key={depto.id}
            style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "1rem", padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", backgroundColor: "#f1f5f9", padding: "0.25rem 0.5rem", borderRadius: "0.375rem" }}>
                  {depto.torre} • Piso {depto.piso}
                </span>
                <span style={{
                  fontSize: "0.7rem", fontWeight: "700", padding: "0.25rem 0.5rem", borderRadius: "0.375rem",
                  backgroundColor: depto.propietario ? "rgba(16, 185, 129, 0.1)" : "rgba(148, 163, 184, 0.1)",
                  color: depto.propietario ? "#10b981" : "#64748b"
                }}>
                  {depto.estado}
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
                {depto.propietario ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: colorAdmin, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: "700" }}>
                      {depto.propietario.charAt(0)}
                    </div>
                    <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "#334155" }}>{depto.propietario}</span>
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
        ))}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "420px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.08)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: "#1e293b" }}>Asignar Dueño — Dpto. {deptoSeleccionado?.numero}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <label style={estiloLabel}>Nombre Completo del Propietario</label>
              <input 
                type="text" 
                style={estiloInput} 
                placeholder="Ej: Carlos López" 
                value={nuevoPropietario} 
                onChange={(e) => setNuevoPropietario(e.target.value)} 
              />
              <small style={{ color: "#94a3b8", fontSize: "0.75rem", display: "block", marginTop: "0.5rem" }}>
                Dejar vacío desvinculará al dueño actual y marcará la unidad como Desocupada.
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