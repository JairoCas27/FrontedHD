import React, { useState } from 'react'
import { FiPackage, FiRefreshCw, FiX } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import BadgeEstado from '../../components/BadgeEstado'
import { useAdminAssets } from '../../hooks/Admin/useAdminAssets' 

export default function Bienes() {
  const colorAdmin = "rgb(52,151,195)"
  
  
  const { bienes, loading, guardarActivo, actualizarEstadoActivo } = useAdminAssets()
  
  const [busqueda, setBusqueda] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ nombre: '', categoria: 'Seguridad', ubicacion: '', estado: 'Disponible' })

  
  const bienesFiltrados = bienes.filter(b => 
    b.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    b.ubicacion?.toLowerCase().includes(busqueda.toLowerCase())
  )

  
  const handleSaveAsset = async (e) => {
    e.preventDefault()
    if (!formData.nombre.trim() || !formData.ubicacion.trim()) {
      alert('Por favor, completa todos los campos requeridos')
      return
    }

    try {
      await guardarActivo({
        nombre: formData.nombre.trim(),
        categoria: formData.categoria,
        ubicacion: formData.ubicacion.trim(),
        estado: formData.estado
      })
      
      setShowModal(false)
      setFormData({ nombre: '', categoria: 'Seguridad', ubicacion: '', estado: 'Disponible' })
    } catch (error) {
      console.error("Error al crear el activo:", error)
      alert("Hubo un error al inventariar el nuevo activo.")
    }
  }

  // 🔄 Alternar estado técnico por medio del Hook
  const toggleStatus = async (id, estadoActual) => {
    try {
      await actualizarEstadoActivo(id, estadoActual)
    } catch (error) {
      console.error("Error al cambiar el estado del activo:", error)
      alert("No se pudo actualizar el estado técnico en el servidor.")
    }
  }

  // Estilos estándar unificados
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
      
      {/* 1. Encabezado Reutilizable */}
      <EncabezadoTabla 
        titulo="Bienes y Activos" 
        subtitulo="Inventariado, ubicación y control de estado técnico de los bienes comunes del condominio"
        botonTexto="Registrar Activo"
        accentColor={colorAdmin}
        onBotonClick={() => setShowModal(true)}
      />

      {/* 2. Filtro / Buscador */}
      <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ flex: 1, maxWidth: "360px", position: "relative" }}>
            <input 
              type="text" 
              style={estiloInput} 
              placeholder="🔍 Buscar por nombre o ubicación..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <small style={{ color: "#64748b", fontWeight: "600" }}>
            {loading ? "Calculando..." : `${bienesFiltrados.length} activos listados`}
          </small>
        </div>
      </div>

      {/* 3. Tabla Premium o Estado de Carga */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#64748b", fontWeight: "600" }}>
          🔄 Sincronizando inventario con el servidor central...
        </div>
      ) : (
        <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", width: "100%", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
          <div style={{ overflowX: "auto", width: "100%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "1rem 1.5rem", width: "10%" }}>ID</th>
                  <th style={{ padding: "1rem", width: "30%" }}>Descripción del Bien</th>
                  <th style={{ padding: "1rem", width: "20%" }}>Categoría</th>
                  <th style={{ padding: "1rem", width: "25%" }}>Ubicación Física</th>
                  <th style={{ padding: "1rem", width: "10%" }}>Estado</th>
                  <th style={{ padding: "1rem 1.5rem", width: "5%", textAlign: "center" }}>Acción</th>
                </tr>
              </thead>
              <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                {bienesFiltrados.map((bien) => (
                  <tr key={bien.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem 1.5rem", fontFamily: "monospace", fontWeight: "700", color: "#94a3b8" }}>#{bien.id}</td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "30px", height: "30px", borderRadius: "0.5rem", backgroundColor: "rgba(52,151,195,0.08)", color: colorAdmin, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <FiPackage size={16} />
                        </div>
                        <span style={{ fontWeight: "700", color: "#0f172a" }}>{bien.nombre}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem", color: "#64748b", fontWeight: "600" }}>{bien.categoria}</td>
                    <td style={{ padding: "1rem", color: "#334155", fontWeight: "500" }}>{bien.ubicacion}</td>
                    <td style={{ padding: "1rem" }}>
                      <BadgeEstado estado={bien.estado} />
                    </td>
                    <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                      <button 
                        title="Cambiar estado técnico"
                        onClick={() => toggleStatus(bien.id, bien.estado)}
                        style={{ background: "none", border: "1px solid #e2e8f0", padding: "0.4rem", borderRadius: "0.5rem", cursor: "pointer", color: colorAdmin, display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <FiRefreshCw size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Modal de Registro */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "440px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.08)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: "#1e293b" }}>Alta de Nuevo Activo</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>

            <form onSubmit={handleSaveAsset}>
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={estiloLabel}>Descripción / Nombre del Bien</label>
                  <input type="text" style={estiloInput} placeholder="Ej: Extintor PQS 6kg" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
                </div>

                <div>
                  <label style={estiloLabel}>Categoría Logística</label>
                  <select style={estiloInput} value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}>
                    <option value="Seguridad">Seguridad</option>
                    <option value="Infraestructura">Infraestructura</option>
                    <option value="Iluminación">Iluminación</option>
                    <option value="Mobiliario">Mobiliario</option>
                  </select>
                </div>

                <div>
                  <label style={estiloLabel}>Ubicación Exacta</label>
                  <input type="text" style={estiloInput} placeholder="Ej: Pasillo Piso 2 - Torre A" value={formData.ubicacion} onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })} required />
                </div>
              </div>

              <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Cancelar</button>
                <button type="submit" style={{ backgroundColor: colorAdmin, border: "none", color: "#ffffff", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Guardar e Inventariar</button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}