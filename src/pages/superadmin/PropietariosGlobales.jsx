import { useState, useEffect, useMemo } from 'react'
import {
  FiSearch, FiEdit2, FiTrash2, FiEye, FiPlus, FiX,
  FiArrowUp, FiArrowDown, FiCheck,
} from 'react-icons/fi'
import {
  getAllUsers, deleteAdministrator, getCondominiums,
  createAdminUser, updateAdministrator,
  assignAdministratorCondo, extractItems,
} from '../../services/api'
import { Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import ConfirmModal from '../../components/common/ConfirmModal'
import EncabezadoTabla from '../../components/EncabezadoTabla'

const ROL = 'PROPIETARIO'
const ROL_LABEL = 'Propietario'
const colorSuper = "rgb(124,58,237)"

const globalResponsive = `
@media (max-width: 767px) {
  .global-card-padding { padding: 1rem !important; }
  .global-search-wrap { width: 100% !important; max-width: 260px !important; }
}
`

const estiloInput = {
  width: "100%", padding: "0.65rem 0.75rem", borderRadius: "0.5rem",
  border: "1px solid #cbd5e1", fontSize: "0.9rem", color: "#334155",
  backgroundColor: "#ffffff", boxSizing: "border-box", outline: "none"
}

const btnStyle = {
  padding: "0.45rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700",
  border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem",
  transition: "all 0.2s"
}

const modalOverlay = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
  display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
}

const modalContent = {
  backgroundColor: "#fff", borderRadius: "1rem", maxWidth: "600px", width: "100%",
  maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
}

export default function PropietariosGlobales() {
  const [users, setUsers] = useState([])
  const [condominios, setCondominios] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', condominio: '' })
  const [sortOrder, setSortOrder] = useState('asc')
  const [sortField, setSortField] = useState('nombre')
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [detailItem, setDetailItem] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [form, setForm] = useState({
    nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '',
  })
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({ nombres: '', apellidos: '', telefono: '', idCondominio: '' })

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [usersData, condosData] = await Promise.all([
        getAllUsers(),
        getCondominiums(),
      ])
      setUsers(extractItems(usersData))
      setCondominios(extractItems(condosData))
    } catch (err) {
      console.error(err)
      setError(err.message)
      toast.error(`Error al cargar datos: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const roleUsers = useMemo(
    () => users.filter(u => u.rol === ROL),
    [users]
  )

  const filteredAndSorted = useMemo(() => {
    let result = roleUsers.filter(u => {
      const fullName = `${u.nombres || ''} ${u.apellidos || ''}`.toLowerCase()
      const email = (u.correo || '').toLowerCase()
      const search = filters.search.toLowerCase()
      const matchSearch = fullName.includes(search) || email.includes(search)
      const matchCondo = filters.condominio ? u.idCondominio === parseInt(filters.condominio, 10) : true
      return matchSearch && matchCondo
    })
    result.sort((a, b) => {
      let valA, valB
      if (sortField === 'nombre') {
        valA = `${a.nombres || ''} ${a.apellidos || ''}`.toLowerCase()
        valB = `${b.nombres || ''} ${b.apellidos || ''}`.toLowerCase()
      } else if (sortField === 'correo') {
        valA = (a.correo || '').toLowerCase()
        valB = (b.correo || '').toLowerCase()
      } else {
        return 0
      }
      if (sortOrder === 'asc') return valA > valB ? 1 : valA < valB ? -1 : 0
      return valA < valB ? 1 : valA > valB ? -1 : 0
    })
    return result
  }, [roleUsers, filters, sortField, sortOrder])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (!form.contrasena || form.contrasena.trim().length < 6) {
        toast.warning('La contraseña debe tener al menos 6 caracteres.')
        setSubmitting(false)
        return
      }
      const selectedCondoId = form.idCondominio ? parseInt(form.idCondominio, 10) : null
      if (!selectedCondoId) {
        toast.error('Debes seleccionar un condominio.')
        setSubmitting(false)
        return
      }
      await createAdminUser({
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim(),
        contrasena: form.contrasena.trim(),
        rol: ROL,
      }, selectedCondoId)
      toast.success(`${ROL_LABEL} creado correctamente.`)
      setShowModal(false)
      setForm({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '' })
      setTimeout(() => loadData(), 300)
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const telefonoVal = editForm.telefono.trim()
      if (telefonoVal && (telefonoVal.length < 7 || telefonoVal.length > 16)) {
        toast.warning('El teléfono debe tener entre 7 y 16 caracteres.')
        setSubmitting(false)
        return
      }
      await updateAdministrator(editingUser.id, {
        nombres: editForm.nombres.trim(),
        apellidos: editForm.apellidos.trim(),
        telefono: telefonoVal || editingUser.telefono || '0000000',
      })
      const newCondoId = editForm.idCondominio ? parseInt(editForm.idCondominio, 10) : null
      if (newCondoId !== (editingUser.idCondominio || null)) {
        try {
          await assignAdministratorCondo(editingUser.id, newCondoId)
        } catch (assignErr) {
          if (newCondoId === null && assignErr.message.includes('no puede ser null')) {
            toast.warning('El backend no permite desasignar el condominio. Solo se puede cambiar a otro.')
          } else {
            toast.warning(`Datos guardados, pero no se pudo reasignar el condominio: ${assignErr.message}`)
          }
        }
      }
      toast.success('Propietario actualizado correctamente.')
      setShowEditModal(false)
      setEditingUser(null)
      await loadData()
    } catch (err) {
      toast.error(`Error al actualizar: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (user) => {
    try {
      await deleteAdministrator(user.id)
      toast.success('Propietario eliminado permanentemente.')
      setConfirmAction(null)
      await loadData()
    } catch (err) {
      toast.error(`Error al eliminar: ${err.message}`)
      setConfirmAction(null)
    }
  }

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return null
    return sortOrder === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />
  }

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando propietarios...</p>
      </div>
    )
  if (error)
    return (
      <div className="text-center text-danger py-5">
        <p><strong>Error:</strong> {error}</p>
        <button onClick={loadData}
          style={{ ...btnStyle, backgroundColor: colorSuper, color: "#fff", fontSize: "0.85rem" }}>
          Reintentar
        </button>
      </div>
    )

  return (
    <div className="global-card-padding" style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      <style>{globalResponsive}</style>
      <EncabezadoTabla titulo="Propietarios" subtitulo="Gestión de propietarios de unidades inmobiliarias" />

      <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "#1e293b" }}>
              {ROL_LABEL}s <span style={{ color: "#94a3b8", fontWeight: "600" }}>({filteredAndSorted.length})</span>
            </span>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={() => {
                setForm({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '' })
                setShowModal(true)
              }}
                style={{ backgroundColor: colorSuper, color: "#ffffff", border: "none", padding: "0.4rem 0.85rem", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <FiPlus size={14} /> Nuevo {ROL_LABEL}
              </button>
              <div className="global-search-wrap" style={{ width: "220px", maxWidth: "220px", position: "relative" }}>
                <FiSearch size={14} style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input type="text" placeholder="Buscar por nombre o correo..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  style={{ ...estiloInput, paddingLeft: "2rem", paddingTop: "0.45rem", paddingBottom: "0.45rem", fontSize: "0.8rem" }} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <select value={filters.condominio} onChange={(e) => setFilters({ ...filters, condominio: e.target.value })}
              style={{ ...estiloInput, width: "auto", minWidth: "180px", padding: "0.35rem 0.5rem", fontSize: "0.8rem" }}>
              <option value="">Todos los condominios</option>
              {condominios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <select value={`${sortField}-${sortOrder}`} onChange={(e) => {
              const [field, order] = e.target.value.split('-')
              setSortField(field)
              setSortOrder(order)
            }}
              style={{ ...estiloInput, width: "auto", minWidth: "160px", padding: "0.35rem 0.5rem", fontSize: "0.8rem" }}>
              <option value="nombre-asc">Nombre A-Z</option>
              <option value="nombre-desc">Nombre Z-A</option>
              <option value="correo-asc">Correo A-Z</option>
              <option value="correo-desc">Correo Z-A</option>
            </select>
            {(filters.search || filters.condominio) && (
              <button onClick={() => setFilters({ search: '', condominio: '' })}
                style={{ ...btnStyle, backgroundColor: "#f1f5f9", color: "#64748b", fontSize: "0.7rem" }}>
                <FiX size={12} /> Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {filteredAndSorted.length === 0 ? (
          <div style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8", fontStyle: "italic", fontWeight: "600" }}>
            No se encontraron coincidencias.
          </div>
        ) : (
          <div className="global-table-wrap" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "0.75rem 1rem", cursor: "pointer" }} onClick={() => toggleSort('nombre')}>
                    Nombre {getSortIcon('nombre')}
                  </th>
                  <th style={{ padding: "0.75rem 0.5rem", cursor: "pointer" }} onClick={() => toggleSort('correo')}>
                    Correo {getSortIcon('correo')}
                  </th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Teléfono</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Condominio</th>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                {filteredAndSorted.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: "700", color: "#0f172a" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: colorSuper, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: "700", flexShrink: 0 }}>
                          {((u.nombres || '??').charAt(0) + (u.apellidos || '').charAt(0)).toUpperCase()}
                        </div>
                        <span>{u.nombres} {u.apellidos}</span>
                      </div>
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", color: "#64748b", fontSize: "0.8rem" }}>{u.correo}</td>
                    <td style={{ padding: "0.75rem 0.5rem", color: "#64748b", fontSize: "0.8rem" }}>{u.telefono || '—'}</td>
                    <td style={{ padding: "0.75rem 0.5rem", color: "#64748b", fontSize: "0.8rem" }}>
                      {u.nombreCondominio || <span style={{ fontStyle: "italic", color: "#cbd5e1" }}>Sin asignar</span>}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", whiteSpace: "nowrap", textAlign: "right" }}>
                      <button style={{ ...btnStyle, backgroundColor: "rgba(124,58,237,0.1)", color: colorSuper, marginRight: "0.25rem" }}
                        onClick={() => { setDetailItem(u); setShowDetail(true) }} title="Ver detalle">
                        <FiEye size={14} />
                      </button>
                      <button style={{ ...btnStyle, backgroundColor: "rgba(245,158,11,0.15)", color: "#d97706", marginRight: "0.25rem" }}
                        onClick={() => { setEditingUser(u); setEditForm({ nombres: u.nombres, apellidos: u.apellidos, telefono: u.telefono || '', idCondominio: u.idCondominio?.toString() || '' }); setShowEditModal(true) }} title="Editar">
                        <FiEdit2 size={14} />
                      </button>
                      <button style={{ ...btnStyle, backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                        onClick={() => setConfirmAction({ type: 'delete', user: u })} title="Eliminar permanentemente">
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && detailItem && (
        <div style={modalOverlay} onClick={() => setShowDetail(false)}>
          <div style={{ ...modalContent, maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.05rem" }}>Detalle del Propietario</h3>
              <button onClick={() => setShowDetail(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}>
                <FiX size={20} />
              </button>
            </div>
            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>ID</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{detailItem.id}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Nombre</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{detailItem.nombres} {detailItem.apellidos}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Correo</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{detailItem.correo}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Teléfono</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{detailItem.telefono || '—'}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Condominio</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{detailItem.nombreCondominio || <span style={{ fontStyle: "italic", color: "#94a3b8" }}>Sin asignar</span>}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Estado</span>
                  <p style={{ margin: "0.2rem 0 0" }}>
                    <span style={{
                      fontSize: "0.65rem", fontWeight: "700", padding: "0.2rem 0.55rem", borderRadius: "0.375rem",
                      backgroundColor: detailItem.activo ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                      color: detailItem.activo ? "#10b981" : "#ef4444", whiteSpace: "nowrap"
                    }}>
                      {detailItem.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Verificado</span>
                  <p style={{ margin: "0.2rem 0 0" }}>
                    <span style={{
                      fontSize: "0.65rem", fontWeight: "700", padding: "0.2rem 0.55rem", borderRadius: "0.375rem",
                      backgroundColor: detailItem.correoVerificado ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.15)",
                      color: detailItem.correoVerificado ? "#10b981" : "#d97706", whiteSpace: "nowrap"
                    }}>
                      {detailItem.correoVerificado ? 'Sí' : 'No'}
                    </span>
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Creado</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>
                    {detailItem.fechaCreacion ? new Date(detailItem.fechaCreacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </p>
                </div>
              </div>
              <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
                <button onClick={() => setShowDetail(false)}
                  style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        open={!!confirmAction}
        title="Eliminar propietario"
        description={`¿Eliminar permanentemente a "${confirmAction?.user?.nombres} ${confirmAction?.user?.apellidos}"? Esta acción no se puede deshacer.`}
        onConfirm={() => handleDelete(confirmAction.user)}
        onCancel={() => setConfirmAction(null)}
        confirmLabel="Eliminar"
        variant="danger"
      />

      {/* Create Modal */}
      {showModal && (
        <div style={modalOverlay} onClick={() => setShowModal(false)}>
          <div style={{ ...modalContent, maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.05rem" }}>Nuevo {ROL_LABEL}</h3>
              <button onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}>
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ padding: "1.5rem" }}>
                <div style={{ marginBottom: "0.85rem" }}>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Nombres</label>
                  <input type="text" value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })} required
                    style={estiloInput} placeholder="Nombres del propietario" />
                </div>
                <div style={{ marginBottom: "0.85rem" }}>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Apellidos</label>
                  <input type="text" value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} required
                    style={estiloInput} placeholder="Apellidos del propietario" />
                </div>
                <div style={{ marginBottom: "0.85rem" }}>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Correo</label>
                  <input type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} required
                    style={estiloInput} placeholder="correo@ejemplo.com" />
                </div>
                <div style={{ marginBottom: "0.85rem" }}>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Teléfono</label>
                  <input type="text" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    style={estiloInput} placeholder="Teléfono (opcional)" />
                </div>
                <div style={{ marginBottom: "0.85rem" }}>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Contraseña</label>
                  <input type="password" value={form.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} required minLength={6} autoComplete="new-password"
                    style={estiloInput} placeholder="Mínimo 6 caracteres" />
                </div>
                <div style={{ marginBottom: "0.85rem" }}>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Condominio</label>
                  <select value={form.idCondominio} onChange={(e) => setForm({ ...form, idCondominio: e.target.value })} required
                    style={estiloInput}>
                    <option value="">Seleccione un condominio</option>
                    {condominios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>
                  Cancelar
                </button>
                <button type="submit" disabled={submitting}
                  style={{
                    padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none",
                    backgroundColor: submitting ? "#cbd5e1" : colorSuper, color: "#fff",
                    fontWeight: "600", cursor: submitting ? "not-allowed" : "pointer", fontSize: "0.85rem",
                    display: "flex", alignItems: "center", gap: "0.4rem"
                  }}>
                  {submitting ? 'Creando...' : <><FiCheck size={16} /> Crear {ROL_LABEL}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div style={modalOverlay} onClick={() => setShowEditModal(false)}>
          <div style={{ ...modalContent, maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.05rem" }}>Editar {ROL_LABEL}</h3>
              <button onClick={() => setShowEditModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}>
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleEdit}>
              <div style={{ padding: "1.5rem" }}>
                <div style={{ marginBottom: "0.85rem" }}>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Nombres</label>
                  <input type="text" value={editForm.nombres} onChange={(e) => setEditForm({ ...editForm, nombres: e.target.value })} required
                    style={estiloInput} />
                </div>
                <div style={{ marginBottom: "0.85rem" }}>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Apellidos</label>
                  <input type="text" value={editForm.apellidos} onChange={(e) => setEditForm({ ...editForm, apellidos: e.target.value })} required
                    style={estiloInput} />
                </div>
                <div style={{ marginBottom: "0.85rem" }}>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Teléfono</label>
                  <input type="text" value={editForm.telefono} onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                    style={estiloInput} />
                </div>
                <div style={{ marginBottom: "0.85rem" }}>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Condominio</label>
                  <select value={editForm.idCondominio} onChange={(e) => setEditForm({ ...editForm, idCondominio: e.target.value })}
                    style={estiloInput}>
                    <option value="">Sin condominio</option>
                    {condominios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowEditModal(false)}
                  style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>
                  Cancelar
                </button>
                <button type="submit" disabled={submitting}
                  style={{
                    padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none",
                    backgroundColor: submitting ? "#cbd5e1" : colorSuper, color: "#fff",
                    fontWeight: "600", cursor: submitting ? "not-allowed" : "pointer", fontSize: "0.85rem",
                    display: "flex", alignItems: "center", gap: "0.4rem"
                  }}>
                  {submitting ? 'Guardando...' : <><FiCheck size={16} /> Guardar cambios</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
