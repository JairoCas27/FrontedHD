import React, { useState } from 'react'
import { FiEdit2, FiTrash2, FiX, FiCheckCircle, FiUserX, FiRefreshCw, FiAlertTriangle, FiInfo } from "react-icons/fi"
import EncabezadoTabla from '../../components/EncabezadoTabla'
import { useAdminUsers } from '../../hooks/Admin/useAdminUsers'

export default function Usuarios() {
  const colorAdmin = "rgb(52,151,195)"
  
  const { usuarios, loading, registrarUsuario, modificarUsuario, cambiarEstadoUsuario } = useAdminUsers()

  const [busqueda, setBusqueda] = useState('')
  const [filtroRol, setFiltroRol] = useState('todos')
  const [verInactivos, setVerInactivos] = useState(false) 
  const [showModal, setShowModal] = useState(false)
  const [errorServidor, setErrorServidor] = useState('')
  
  // 🟢 ESTADOS NUEVOS: Notificaciones Toast y Modal de Confirmación Custom
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' })
  const [confirmModal, setConfirmModal] = useState({ visible: false, usuarioId: null, proximoEstado: null, nombreUsuario: '', esReactivacion: false })

  const [editandoId, setEditandoId] = useState(null)
  const [formUsuario, setFormUsuario] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    contrasena: '',
    rol: 'PROPIETARIO' 
  })

  const usuariosFiltrados = (usuarios || []).filter(u => {
    const coincideEstado = verInactivos ? u.activo === false : (u.activo !== false)
    if (!coincideEstado) return false

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

  // 🟢 FUNCIÓN AUXILIAR: Disparar notificaciones Toast temporales
  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ visible: true, mensaje, tipo })
    setTimeout(() => {
      setToast({ visible: false, mensaje: '', tipo: 'success' })
    }, 3000)
  }

  const handleOpenModal = (usuario = null) => {
    setErrorServidor('')
    if (usuario) {
      setEditandoId(usuario.id)
      setFormUsuario({
        nombres: usuario.nombres || '',
        apellidos: usuario.apellidos || '',
        correo: usuario.correo || '',
        telefono: usuario.telefono || '',
        contrasena: '', 
        rol: usuario.rol || 'PROPIETARIO'
      })
    } else {
      setEditandoId(null)
      setFormUsuario({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', rol: 'PROPIETARIO' })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorServidor('')
    try {
      if (editandoId) {
        const putPayload = {
          nombres: formUsuario.nombres.trim(),
          apellidos: formUsuario.apellidos.trim(),
          telefono: formUsuario.telefono.trim()
        }
        await modificarUsuario(editandoId, putPayload)
        mostrarToast("¡Perfil residencial actualizado con éxito!")
      } else {
        const postPayload = {
          nombres: formUsuario.nombres.trim(),
          apellidos: formUsuario.apellidos.trim(),
          correo: formUsuario.correo.trim(),
          telefono: formUsuario.telefono.trim(),
          contrasena: formUsuario.contrasena,
          rol: formUsuario.rol
        }
        await registrarUsuario(postPayload)
        mostrarToast("¡Nuevo residente registrado correctamente!")
      }
      setShowModal(false)
    } catch (error) {
      setErrorServidor(error.message || 'Hubo un problema al procesar la solicitud en el servidor.')
    }
  }

  // 🟢 PROCESAR CAMBIO DE ESTADO DESDE EL MODAL CUSTOM
  const ejecutarCambioEstado = async () => {
    try {
      const { usuarioId, proximoEstado, esReactivacion } = confirmModal
      await cambiarEstadoUsuario(usuarioId, proximoEstado)
      setConfirmModal({ visible: false, usuarioId: null, proximoEstado: null, nombreUsuario: '', esReactivacion: false })
      mostrarToast(esReactivacion ? "Cuenta reactivada y restaurada con éxito" : "Cuenta suspendida del sistema correctamente", "info")
    } catch (error) {
      mostrarToast("No se pudo procesar el cambio de estado técnico", "error")
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

  const estiloPestana = (activo) => ({
    padding: "0.5rem 1rem",
    border: "none",
    backgroundColor: activo ? "#ffffff" : "transparent",
    color: activo ? colorAdmin : "#64748b",
    fontWeight: "700",
    fontSize: "0.85rem",
    borderRadius: "0.375rem",
    cursor: "pointer",
    boxShadow: activo ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    transition: "all 0.2s"
  })

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left", position: "relative" }}>

      {/* 🟢 TOAST NOTIFICATION COMPONENT */}
      {toast.visible && (
        <div style={{
          position: "fixed", top: "2rem", right: "2rem", zIndex: 200,
          backgroundColor: toast.tipo === 'success' ? "#10b981" : toast.tipo === 'info' ? "#3b82f6" : "#ef4444",
          color: "#ffffff", padding: "1rem 1.5rem", borderRadius: "0.75rem", fontWeight: "700", fontSize: "0.9rem",
          display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          animation: "slideIn 0.3s ease"
        }}>
          <FiInfo size={18} /> {toast.mensaje}
        </div>
      )}

      <EncabezadoTabla
        titulo="Control de Usuarios"
        subtitulo="Gestión de cuentas residenciales, asignación de credenciales y privilegios del sistema"
        botonTexto="Registrar Usuario"
        accentColor={colorAdmin}
        onBotonClick={() => handleOpenModal()}
      />

      <div style={{ display: "flex", backgroundColor: "#e2e8f0", padding: "0.25rem", borderRadius: "0.5rem", width: "fit-content", marginBottom: "1rem" }}>
        <button style={estiloPestana(!verInactivos)} onClick={() => setVerInactivos(false)}>
          <FiCheckCircle size={14} /> Cuentas Activas
        </button>
        <button style={estiloPestana(verInactivos)} onClick={() => setVerInactivos(true)}>
          <FiUserX size={14} /> Cuentas Suspendidas
        </button>
      </div>

      <div style={{ backgroundColor: "#ffffff", padding: "1.25rem", borderRadius: "1rem", border: "1px solid #e2e8f0", marginBottom: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, maxWidth: "320px" }}>
            <input
              type="text"
              style={estiloInput}
              placeholder="Buscar por nombre, correo o teléfono."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div style={{ width: "240px" }}>
            <select style={estiloInput} value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
              <option value="todos">Todos los Roles</option>
              <option value="PROPIETARIO">Propietarios</option>
              <option value="AGENTE_SEGURIDAD">Agentes de Seguridad</option>
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
                <th style={{ padding: "1rem" }}>Estado</th>
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
                    <span style={{
                      fontSize: "11px", fontWeight: "700", padding: "0.3rem 0.6rem", borderRadius: "0.375rem",
                      backgroundColor: u.activo !== false ? "#dcfce7" : "#fee2e2",
                      color: u.activo !== false ? "#15803d" : "#b91c1c"
                    }}>
                      {u.activo !== false ? '● Activo' : '● Suspendido'}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ 
                      fontSize: "0.75rem", fontWeight: "700", padding: "0.25rem 0.5rem", borderRadius: "0.375rem",
                      backgroundColor: u.rol === 'ADMINISTRADOR_CONDOMINIO' ? "rgba(52,151,195,0.1)" : "rgba(71, 85, 105, 0.1)",
                      color: u.rol === 'ADMINISTRADOR_CONDOMINIO' ? colorAdmin : "#475569"
                    }}>
                      {u.rol === 'ADMINISTRADOR_CONDOMINIO' ? 'ADMINISTRADOR' : 
                       u.rol === 'AGENTE_SEGURIDAD' ? 'SEGURIDAD' : 'PROPIETARIO'}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem", alignItems: "center" }}>
                    <button
                      onClick={() => handleOpenModal(u)}
                      disabled={u.activo === false}
                      style={{ background: "none", border: "none", color: u.activo === false ? "#cbd5e1" : colorAdmin, cursor: u.activo === false ? "not-allowed" : "pointer", display: "flex", alignItems: "center" }}
                      title="Editar cuenta"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    
                    {/* 🟢 MODIFICADO: Ahora abre el Modal custom de confirmación */}
                    <button
                      onClick={() => setConfirmModal({
                        visible: true,
                        usuarioId: u.id,
                        proximoEstado: u.activo === false,
                        nombreUsuario: `${u.nombres} ${u.apellidos}`,
                        esReactivacion: u.activo === false
                      })}
                      style={{ 
                        padding: "0.35rem 0.65rem", 
                        border: "1px solid",
                        borderColor: u.activo === false ? "#10b981" : "#ef4444",
                        backgroundColor: u.activo === false ? "rgba(16, 185, 129, 0.05)" : "rgba(239, 68, 68, 0.05)",
                        color: u.activo === false ? "#10b981" : "#ef4444", 
                        borderRadius: "0.375rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        cursor: "pointer", 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "0.25rem" 
                      }}
                    >
                      {u.activo === false ? (
                        <>
                          <FiRefreshCw size={12} /> Volver a Activar
                        </>
                      ) : (
                        <>
                          <FiTrash2 size={12} /> Suspender
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {usuariosFiltrados.length === 0 && (
            <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8", fontSize: "0.9rem" }}>
              No hay cuentas residenciales en esta lista de selección.
            </div>
          )}
        </div>
      )}

      {/* 🟢 CUSTOM DIALOG MODAL: Reemplazo elegante de window.confirm */}
      {confirmModal.visible && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 110, backdropFilter: "blur(4px)" }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", width: "100%", maxWidth: "400px", border: "1px solid #e2e8f0", overflow: "hidden", padding: "1.5rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <div style={{
                backgroundColor: confirmModal.esReactivacion ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                color: confirmModal.esReactivacion ? "#10b981" : "#ef4444",
                padding: "0.5rem", borderRadius: "0.5rem", display: "flex"
              }}>
                <FiAlertTriangle size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 0.5rem 0", fontWeight: "800", color: "#1e293b", fontSize: "1rem" }}>
                  {confirmModal.esReactivacion ? "Confirmar Reactivación" : "Confirmar Suspensión"}
                </h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", lineHeight: "1.4" }}>
                  {confirmModal.esReactivacion 
                    ? `¿Estás seguro de que deseas volver a activar la cuenta de ${confirmModal.nombreUsuario}? Volverá a tener privilegios de acceso.`
                    : `¿Estás seguro de que deseas desactivar la cuenta de ${confirmModal.nombreUsuario}? Se le denegará el ingreso temporalmente.`}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1.5rem" }}>
              <button 
                onClick={() => setConfirmModal({ visible: false, usuarioId: null, proximoEstado: null, nombreUsuario: '', esReactivacion: false })}
                style={{ padding: "0.45rem 1rem", border: "1px solid #cbd5e1", background: "#fff", borderRadius: "0.5rem", cursor: "pointer", color: "#475569", fontWeight: "700", fontSize: "0.8rem" }}
              >
                Cancelar
              </button>
              <button 
                onClick={ejecutarCambioEstado}
                style={{ 
                  padding: "0.45rem 1.25rem", 
                  background: confirmModal.esReactivacion ? "#10b981" : "#ef4444", 
                  color: "#fff", border: "none", borderRadius: "0.5rem", fontWeight: "700", fontSize: "0.8rem", cursor: "pointer" 
                }}
              >
                {confirmModal.esReactivacion ? "Sí, Activar" : "Sí, Suspender"}
              </button>
            </div>
          </div>
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
              
              {errorServidor && (
                <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", padding: "0.75rem", borderRadius: "0.5rem", fontSize: "0.85rem", fontWeight: "600" }}>
                  ⚠️ {errorServidor}
                </div>
              )}

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
                <select 
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
                  <option value="PROPIETARIO">Propietario</option>
                  <option value="AGENTE_SEGURIDAD">Agente de Seguridad</option>
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