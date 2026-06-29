import React, { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import BadgeEstado from '../../components/BadgeEstado'

const usuariosIniciales = [
  { id: 1, nombre: 'Carlos López', email: 'carlos@example.com', rol: 'Residente', estado: 'Activo' },
  { id: 2, nombre: 'Ana Martínez', email: 'ana@example.com', rol: 'Administrador', estado: 'Activo' },
  { id: 3, nombre: 'Juan Pérez', email: 'juan@example.com', rol: 'Seguridad', estado: 'Inactivo' },
  { id: 4, nombre: 'María García', email: 'maria@example.com', rol: 'Residente', estado: 'Activo' },
]

const STORAGE_KEY = 'usuarios_condominio_admin'

export default function Usuarios() {
  const colorAdmin = "rgb(52,151,195)"

  const [usuarios, setUsuarios] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : usuariosIniciales
    } catch {
      return usuariosIniciales
    }
  })
  
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [formData, setFormData] = useState({ nombre: '', email: '', rol: 'Residente', estado: 'Activo' })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios))
    } catch {
      console.error('Error al guardar en localStorage')
    }
  }, [usuarios])

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditando(usuario)
      setFormData(usuario)
    } else {
      setEditando(null)
      setFormData({ nombre: '', email: '', rol: 'Residente', estado: 'Activo' })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditando(null)
  }

  const handleSave = () => {
    if (formData.nombre.trim() === '' || formData.email.trim() === '') {
      alert('Por favor, completa los campos requeridos');
      return;
    }

    if (editando) {
      setUsuarios(usuarios.map(u => u.id === editando.id ? { ...formData, id: u.id } : u))
    } else {
      const newId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1
      setUsuarios([...usuarios, { ...formData, id: newId }])
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este usuario del sistema?')) {
      setUsuarios(usuarios.filter(u => u.id !== id))
    }
  }

  // Estilos fijos para mantener el estándar visual premium
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

  const obtenerEstiloRol = (rol) => {
    switch (rol) {
      case 'Administrador': return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }
      case 'Seguridad': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }
      default: return { bg: 'rgba(52, 151, 195, 0.1)', color: colorAdmin }
    }
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      
      {/* 1. Encabezado Reutilizable */}
      <EncabezadoTabla 
        titulo="Usuarios" 
        subtitulo="Gestión de residentes, personal de seguridad y administración del condominio" 
        botonTexto="Nuevo Usuario"
        accentColor={colorAdmin}
        onBotonClick={() => handleOpenModal()}
      />

      {/* 2. Tabla de Datos Premium Estilizada */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", width: "100%", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "1rem 1.5rem", width: "10%" }}>ID</th>
                <th style={{ padding: "1rem", width: "35%" }}>Nombre Completo</th>
                <th style={{ padding: "1rem", width: "25%" }}>Correo Electrónico</th>
                <th style={{ padding: "1rem", width: "15%" }}>Rol asignado</th>
                <th style={{ padding: "1rem", width: "15%" }}>Estado</th>
                <th style={{ padding: "1rem 1.5rem", width: "10%", textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
              {usuarios.map((usuario) => {
                const configRol = obtenerEstiloRol(usuario.rol);
                return (
                  <tr key={usuario.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "1rem 1.5rem", fontFamily: "monospace", fontWeight: "700", color: "#94a3b8" }}>#{usuario.id}</td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ 
                          width: "32px", 
                          height: "32px", 
                          borderRadius: "50%", 
                          backgroundColor: "rgba(52,151,195,0.08)", 
                          color: colorAdmin, 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center", 
                          fontWeight: "700", 
                          fontSize: "0.75rem",
                          border: "1px solid rgba(52,151,195,0.15)"
                        }}>
                          {usuario.nombre.charAt(0)}
                        </div>
                        <span style={{ fontWeight: "700", color: "#0f172a" }}>{usuario.nombre}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem", color: "#64748b", fontWeight: "500" }}>{usuario.email}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{
                        backgroundColor: configRol.bg,
                        color: configRol.color,
                        padding: '0.25rem 0.6rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.7rem',
                        fontWeight: '700'
                      }}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <BadgeEstado estado={usuario.estado} />
                    </td>
                    <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                        <button 
                          onClick={() => handleOpenModal(usuario)}
                          style={{ background: "none", border: "1px solid #e2e8f0", padding: "0.4rem", borderRadius: "0.5rem", cursor: "pointer", color: colorAdmin }}
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(usuario.id)}
                          style={{ background: "none", border: "1px solid #e2e8f0", padding: "0.4rem", borderRadius: "0.5rem", cursor: "pointer", color: "#ef4444" }}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Modal de Creación / Edición Con Labels Orgánicos */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "460px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.08)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: "#1e293b" }}>{editando ? 'Modificar Usuario' : 'Registrar Nuevo Usuario'}</h3>
              <button onClick={handleCloseModal} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>

            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={estiloLabel}>Nombre Completo</label>
                <input type="text" style={estiloInput} placeholder="Ej: Juan Pérez" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
              </div>

              <div>
                <label style={estiloLabel}>Correo Electrónico</label>
                <input type="email" style={estiloInput} placeholder="juan@ejemplo.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>

              <div>
                <label style={estiloLabel}>Rol del Usuario</label>
                <select style={estiloInput} value={formData.rol} onChange={(e) => setFormData({ ...formData, rol: e.target.value })}>
                  <option value="Residente">Residente</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Seguridad">Seguridad</option>
                  <option value="Proveedor">Proveedor</option>
                </select>
              </div>

              <div>
                <label style={estiloLabel}>Estado Inicial</label>
                <select style={estiloInput} value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })}>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: "0.75rem", backgroundColor: "#f8fafc" }}>
              <button onClick={handleCloseModal} style={{ backgroundColor: "#ffffff", border: "1px solid #cbd5e1", color: "#475569", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Cancelar</button>
              <button onClick={handleSave} style={{ backgroundColor: colorAdmin, border: "none", color: "#ffffff", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Guardar Cambios</button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}