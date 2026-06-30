import React, { useState } from 'react'
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { useAdminUsers } from '../../hooks/Admin/useAdminUsers'

export default function Usuarios() {
  const colorAdmin = "rgb(52,151,195)"
  
  const { usuarios, loading, registrarUsuario, modificarUsuario, cambiarEstadoUsuario } = useAdminUsers()

  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState('todos')
  const [showModal, setShowModal] = useState(false)
  
  const [editandoId, setEditandoId] = useState(null)
  const [formUsuario, setFormUsuario] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    contrasena: '',
    rol: 'RESIDENTE' 
  })

  const usuariosFiltrados = (usuarios || []).filter(u => {
    if (filtroRol !== 'todos' && u.rol !== filtroRol) return false
    const termino = busqueda.toLowerCase().trim()
    if (termino) {
      return (
        u.nombres?.toLowerCase().includes(termino) ||
        u.apellidos?.toLowerCase().includes(termino) ||
        u.correo?.toLowerCase().includes(termino) ||
        u.telefono?.toString().includes(termino)
      )
    }
    return true
  })

  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditandoId(usuario.id)
      setFormUsuario({
        nombres: usuario.nombres || '',
        apellidos: usuario.apellidos || '',
        correo: usuario.correo || '',
        telefono: usuario.telefono || '',
        contrasena: '', 
        rol: usuario.rol || 'RESIDENTE'
      })
    } else {
      setEditandoId(null)
      setFormUsuario({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', rol: 'RESIDENTE' })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editandoId) {
        const putPayload = {
          nombres: formUsuario.nombres.trim(),
          apellidos: formUsuario.apellidos.trim(),
          telefono: formUsuario.telefono.trim()
        }
      } else {
        const postPayload = {
          nombres: formUsuario.nombres.trim(),
          apellidos: formUsuario.apellidos.trim(),
          correo: formUsuario.correo.trim(),
          telefono: formUsuario.telefono.trim(),
          contrasena: formUsuario.contrasena,
          rol: formUsuario.rol
        }
      }
      setShowModal(false)
    } catch (error) {
      alert('Hubo un problema al intentar guardar los datos en el servidor.')
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
    fontSize: "11px",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "0.25rem",
    textTransform: "uppercase"
  }

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>

      <EncabezadoTabla
        titulo="Control de Usuarios"
        subtitulo="Gestión de cuentas residenciales, asignación de credenciales y privilegios del sistema"
        botonTexto="Registrar Usuario"
        accentColor={colorAdmin}
        onBotonClick={() => handleOpenModal()}
      />

      <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, maxWidth: "320px" }}>
            <input
              type="text"
              style={estiloInput}
              placeholder="Buscar por nombre, correo o teléfono..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div style={{ width: "240px" }}>
            {/* 🟢 Selector de filtrado mapeado con los Enums reales de la DB */}
            <select style={estiloInput} value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
              <option value="todos">Todos los Roles</option>
              <option value="ADMINISTRADOR_CONDOMINIO">Administradores del Condominio</option>
              <option value="PROPIETARIO">Propietarios</option>
              <option value="AGENTE_SEGURIDAD">Agentes de Seguridad</option>
              <option value="RESIDENTE">Residentes / Inquilinos</option>
            </select>
          </div>
          <small style={{ color: "#64748b", fontWeight: "600", marginLeft: "auto" }}>
            Total filtrados: {usuariosFiltrados.length}
          </small>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b", fontWeight: "600" }}>
          🔄 Sincronizando cuentas con el servidor central...
        </div>
      ) : (
        <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b", fontSize: "11px", textTransform: "uppercase", fontWeight: "700", textAlign: "left" }}>
                <th style={{ padding: "1rem 1.5rem" }}>Usuario / Residente</th>
                <th style={{ padding: "1rem" }}>Teléfono</th>
                <th style={{ padding: "1rem" }}>Correo Electrónico</th>
                <th style={{ padding: "1rem" }}>Rol del Sistema</th>
                <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: "0.875rem", color: "#334155" }}>
              {usuariosFiltrados.map(u => (
                <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1rem 1.5rem", fontWeight: "700", color: "#0f172a" }}>
                    {u.nombres} {u.apellidos}
                  </td>
                  <td style={{ padding: "1rem", fontFamily: "monospace" }}>{u.telefono || '---'}</td>
                  <td style={{ padding: "1rem" }}>{u.correo}</td>
                  <td style={{ padding: "1rem" }}>
                    {/* 🟢 Mapeo de badges actualizado con la nomenclatura exacta */}
                    <span style={{ 
                      fontSize: "0.75rem", fontWeight: "700", padding: "0.25rem 0.5rem", borderRadius: "0.375rem",
                      backgroundColor: u.rol === 'ADMINISTRADOR_CONDOMINIO' ? "rgba(52,151,195,0.1)" : "rgba(71, 85, 105, 0.1)",
                      color: u.rol === 'ADMINISTRADOR_CONDOMINIO' ? colorAdmin : "#475569"
                    }}>
                      {u.rol === 'ADMINISTRADOR_CONDOMINIO' ? 'ADMINISTRADOR' : 
                       u.rol === 'AGENTE_SEGURIDAD' ? 'SEGURIDAD' : 
                       u.rol === 'PROPIETARIO' ? 'PROPIETARIO' : 'RESIDENTE'}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                    <button
                      onClick={() => handleOpenModal(u)}
                      style={{ background: "none", border: "none", color: colorAdmin, marginRight: "0.75rem", cursor: "pointer" }}
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => { if (window.confirm("¿Seguro que deseas cambiar el estado de este usuario?")) cambiarEstadoUsuario(u.id, !u.activo) }}
                      style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "450px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontWeight: "800", color: "#1e293b" }}>{editandoId ? "Modificar Perfil" : "Nuevo Usuario"}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><FiX size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={estiloLabel}>Nombres</label>
                  <input type="text" style={estiloInput} value={formUsuario.nombres} onChange={e => setFormUsuario({ ...formUsuario, nombres: e.target.value })} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={estiloLabel}>Apellidos</label>
                  <input type="text" style={estiloInput} value={formUsuario.apellidos} onChange={e => setFormUsuario({ ...formUsuario, apellidos: e.target.value })} required />
                </div>
              </div>

              <div>
                <label style={estiloLabel}>Teléfono</label>
                <input type="text" style={estiloInput} value={formUsuario.telefono} onChange={e => setFormUsuario({ ...formUsuario, telefono: e.target.value })} required />
              </div>

              <div>
                <label style={estiloLabel}>Correo Electrónico</label>
                <input
                  type="email"
                  value={formUsuario.correo}
                  onChange={e => setFormUsuario({ ...formUsuario, correo: e.target.value })}
                  required
                  disabled={!!editandoId}
                  style={{
                    ...estiloInput,
                    backgroundColor: editandoId ? "#f8fafc" : "#ffffff",
                    color: editandoId ? "#94a3b8" : "#334155",
                    cursor: editandoId ? "not-allowed" : "text"
                  }}
                />
              </div>

              {!editandoId && (
                <div>
                  <label style={estiloLabel}>Contraseña Inicial</label>
                  <input type="password" style={estiloInput} placeholder="Mínimo 6 caracteres" value={formUsuario.contrasena} onChange={e => setFormUsuario({ ...formUsuario, contrasena: e.target.value })} required />
                </div>
              )}

              <div>
                <label style={estiloLabel}>Rol asignado (Database Enum)</label>
                {/* 🟢 Opciones corregidas vinculando los strings exactos aceptados por el backend en Java */}
                <select 
                  style={estiloInput} 
                  value={formUsuario.rol} 
                  onChange={e => setFormUsuario({...formUsuario, rol: e.target.value})}
                  disabled={!!editandoId}
                  style={{
                    ...estiloInput,
                    backgroundColor: editandoId ? "#f8fafc" : "#ffffff",
                    color: editandoId ? "#94a3b8" : "#334155",
                    cursor: editandoId ? "not-allowed" : "pointer"
                  }}
                >
                  <option value="RESIDENTE">Residente / Inquilino</option>
                  <option value="ADMINISTRADOR_CONDOMINIO">Administrador del Condominio</option>
                  <option value="AGENTE_SEGURIDAD">Agente de Seguridad</option>
                  <option value="PROPIETARIO">Propietario</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "0.5rem 1rem", border: "1px solid #cbd5e1", background: "#fff", borderRadius: "0.5rem", cursor: "pointer", color: "#475569", fontWeight: "600" }}>Cancelar</button>
                <button type="submit" style={{ padding: "0.5rem 1.25rem", background: colorAdmin, color: "#fff", border: "none", borderRadius: "0.5rem", fontWeight: "600", cursor: "pointer" }}>Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}