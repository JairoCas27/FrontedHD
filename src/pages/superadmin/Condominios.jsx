import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye, FiArrowUp, FiArrowDown, FiX } from 'react-icons/fi'
import {
  getCondominiums,
  createCondominium,
  updateCondominium,
  deleteCondominium,
  patchCondominiumStatus,
  getCountries,
  getCities,
} from '../../services/api'
import { Form, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import ToggleSwitch from '../../components/common/ToggleSwitch'
import ConfirmModal from '../../components/common/ConfirmModal'
import EncabezadoTabla from '../../components/EncabezadoTabla'
import DataList from '../../components/common/DataList'

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

export default function Condominios() {
  const navigate = useNavigate()
  const [condominios, setCondominios] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    idPais: '',
    idCiudad: '',
  })
  const [error, setError] = useState(null)

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [sortField, setSortField] = useState('nombre')

  // Detail modal
  const [detailItem, setDetailItem] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState(null)

  // Catálogos
  const [paises, setPaises] = useState([])
  const [ciudades, setCiudades] = useState([])
  const [loadingCatalogs, setLoadingCatalogs] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCondominiums()
      let list = data?.items || data?.content || data?.data || []
      if (!Array.isArray(list)) list = []
      setCondominios(list)
    } catch (err) {
      console.error(err)
      setError(err.message)
      setCondominios([])
    } finally {
      setLoading(false)
    }
  }

  const loadCatalogs = async () => {
    setLoadingCatalogs(true)
    try {
      const paisesData = await getCountries()
      setPaises(paisesData)
      if (paisesData.length > 0) {
        const firstCountry = paisesData[0].id
        const citiesData = await getCities(firstCountry)
        setCiudades(citiesData)
        if (!form.idPais) {
          setForm(prev => ({ ...prev, idPais: firstCountry }))
        }
      }
    } catch (err) {
      console.error('Error cargando catálogos:', err)
    } finally {
      setLoadingCatalogs(false)
    }
  }

  useEffect(() => {
    load()
    loadCatalogs()
  }, [])

  const filteredAndSorted = useMemo(() => {
    let result = condominios.filter(c => {
      return c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    })

    result.sort((a, b) => {
      let valA, valB
      if (sortField === 'nombre') {
        valA = a.nombre.toLowerCase()
        valB = b.nombre.toLowerCase()
      } else if (sortField === 'ciudad') {
        valA = (a.nombreCiudad || '').toLowerCase()
        valB = (b.nombreCiudad || '').toLowerCase()
      } else if (sortField === 'estado') {
        valA = a.activo ? 1 : 0
        valB = b.activo ? 1 : 0
      } else if (sortField === 'administrador') {
        valA = (a.nombreAdministrador || '').toLowerCase()
        valB = (b.nombreAdministrador || '').toLowerCase()
      } else {
        return 0
      }
      if (sortOrder === 'asc') {
        return valA > valB ? 1 : valA < valB ? -1 : 0
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0
      }
    })
    return result
  }, [condominios, searchTerm, sortField, sortOrder])

  const handlePaisChange = async (paisId) => {
    setForm({ ...form, idPais: paisId, idCiudad: '' })
    if (paisId) {
      try {
        const cities = await getCities(paisId)
        setCiudades(cities)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        nombre: form.nombre,
        direccion: form.direccion,
        idPais: parseInt(form.idPais, 10),
        idCiudad: parseInt(form.idCiudad, 10),
      }
      if (editing) {
        await updateCondominium(editing.id, payload)
      } else {
        await createCondominium(payload)
      }
      setShowModal(false)
      load()
    } catch (err) {
      toast.error(err.message)
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCondominium(id)
      toast.success('Condominio eliminado')
      setConfirmDelete(null)
      load()
    } catch (err) {
      toast.error(err.message)
      setConfirmDelete(null)
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await patchCondominiumStatus(id, !currentStatus)
      toast.success(`Estado actualizado a ${!currentStatus ? 'Activo' : 'Inactivo'}`)
      load()
    } catch (err) {
      toast.error(err.message)
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
        <p className="mt-2">Cargando condominios...</p>
      </div>
    )
  if (error)
    return (
      <div className="text-center text-danger py-5">
        <p>{error}</p>
        <Button variant="outline-primary" onClick={load}>Reintentar</Button>
      </div>
    )

  return (
    <div className="global-card-padding" style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      <style>{globalResponsive}</style>
      <EncabezadoTabla titulo="Condominios" subtitulo="Gestión de propiedades inmobiliarias" />

      <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
        <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "#1e293b" }}>
              Condominios <span style={{ color: "#94a3b8", fontWeight: "600" }}>({filteredAndSorted.length})</span>
            </span>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={() => {
                setEditing(null)
                setForm({
                  nombre: '',
                  direccion: '',
                  idPais: paises.length > 0 ? paises[0].id : '',
                  idCiudad: '',
                })
                setShowModal(true)
              }}
                style={{ backgroundColor: colorSuper, color: "#ffffff", border: "none", padding: "0.4rem 0.85rem", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <FiPlus size={14} /> Nuevo
              </button>
              <button onClick={() => navigate('/superadmin/usuarios?tab=administradores')}
                style={{ backgroundColor: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "none", padding: "0.4rem 0.85rem", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <FiEdit2 size={14} /> Asignar administrador
              </button>
              <div className="global-search-wrap" style={{ width: "220px", maxWidth: "220px", position: "relative" }}>
                <FiSearch size={14} style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input type="text" placeholder="Buscar condominio..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ ...estiloInput, paddingLeft: "2rem", paddingTop: "0.45rem", paddingBottom: "0.45rem", fontSize: "0.8rem" }} />
              </div>
            </div>
          </div>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')}
              style={{ ...btnStyle, backgroundColor: "#f1f5f9", color: "#64748b", fontSize: "0.7rem" }}>
              <FiX size={12} /> Limpiar filtros
            </button>
          )}
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
                  <th style={{ padding: "0.75rem 1rem" }}>ID</th>
                  <th style={{ padding: "0.75rem 0.5rem", cursor: "pointer" }} onClick={() => toggleSort('nombre')}>
                    Nombre {getSortIcon('nombre')}
                  </th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Dirección</th>
                  <th style={{ padding: "0.75rem 0.5rem", cursor: "pointer" }} onClick={() => toggleSort('ciudad')}>
                    Ciudad {getSortIcon('ciudad')}
                  </th>
                  <th style={{ padding: "0.75rem 0.5rem", cursor: "pointer" }} onClick={() => toggleSort('administrador')}>
                    Administrador {getSortIcon('administrador')}
                  </th>
                  <th style={{ padding: "0.75rem 0.5rem", cursor: "pointer", textAlign: "center" }} onClick={() => toggleSort('estado')}>
                    Estado {getSortIcon('estado')}
                  </th>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                {filteredAndSorted.map((c, i) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: "600", color: "#64748b", fontSize: "0.8rem" }}>{c.id}</td>
                    <td style={{ padding: "0.75rem 0.5rem", fontWeight: "700", color: "#0f172a" }}>{c.nombre}</td>
                    <td style={{ padding: "0.75rem 0.5rem", color: "#64748b" }}>{c.direccion || '—'}</td>
                    <td style={{ padding: "0.75rem 0.5rem", color: "#64748b" }}>{c.nombreCiudad || '—'}</td>
                    <td style={{ padding: "0.75rem 0.5rem", color: "#64748b", fontSize: "0.8rem" }}>
                      {c.nombreAdministrador || <span style={{ fontStyle: "italic", color: "#cbd5e1" }}>Sin asignar</span>}
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", textAlign: "center" }}>
                      <ToggleSwitch
                        checked={c.activo}
                        onChange={() => handleToggleStatus(c.id, c.activo)}
                      />
                    </td>
                    <td style={{ padding: "0.75rem 1rem", whiteSpace: "nowrap", textAlign: "right" }}>
                      <button style={{ ...btnStyle, backgroundColor: "rgba(124,58,237,0.1)", color: colorSuper, marginRight: "0.25rem" }}
                        onClick={() => { setDetailItem(c); setShowDetail(true) }} title="Ver detalle">
                        <FiEye size={14} />
                      </button>
                      <button style={{ ...btnStyle, backgroundColor: "rgba(124,58,237,0.1)", color: colorSuper, marginRight: "0.25rem" }}
                        onClick={() => {
                          setEditing(c)
                          setForm({
                            nombre: c.nombre,
                            direccion: c.direccion || '',
                            idPais: c.idPais || (paises.length > 0 ? paises[0].id : ''),
                            idCiudad: c.idCiudad || '',
                          })
                          if (c.idPais) {
                            getCities(c.idPais).then(cities => setCiudades(cities)).catch(console.error)
                          }
                          setShowModal(true)
                        }} title="Editar">
                        <FiEdit2 size={14} />
                      </button>
                      <button style={{ ...btnStyle, backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                        onClick={() => setConfirmDelete(c)} title="Eliminar">
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
              <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.05rem" }}>Detalle del Condominio</h3>
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
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{detailItem.nombre}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Dirección</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{detailItem.direccion || '—'}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>País</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{detailItem.nombrePais || '—'}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Ciudad</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{detailItem.nombreCiudad || '—'}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Administrador</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{detailItem.nombreAdministrador || <span style={{ fontStyle: "italic", color: "#94a3b8" }}>Sin asignar</span>}</p>
                </div>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Estado</span>
                  <p style={{ margin: "0.2rem 0 0", fontWeight: "600", fontSize: "0.85rem" }}>
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
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Fecha de creación</span>
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

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={!!confirmDelete}
        title="Eliminar condominio"
        description={`¿Estás seguro de eliminar "${confirmDelete?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={() => handleDelete(confirmDelete.id)}
        onCancel={() => setConfirmDelete(null)}
        confirmLabel="Eliminar"
      />

      {/* Create/Edit Modal */}
      {showModal && (
        <div style={modalOverlay} onClick={() => { if (!editing) setShowModal(false) }}>
          <div style={{ ...modalContent, maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.05rem" }}>{editing ? 'Editar' : 'Nuevo'} condominio</h3>
              <button onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}>
                <FiX size={20} />
              </button>
            </div>
            <Form onSubmit={handleSubmit}>
              <div style={{ padding: "1.5rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Nombre</label>
                  <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required
                    style={estiloInput} placeholder="Nombre del condominio" />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Dirección</label>
                  <textarea value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                    style={{ ...estiloInput, minHeight: "80px", resize: "vertical" }} placeholder="Dirección del condominio" />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>País</label>
                  <DataList value={paises.find(p => String(p.id) === String(form.idPais))?.nombre || ''} onChange={(e) => { const s = paises.find(p => p.nombre === e.target.value); if (s) handlePaisChange(s.id) }} disabled={loadingCatalogs}
                    style={estiloInput}>
                    {paises.map(p => <option key={p.id} value={p.nombre} />)}
                  </DataList>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Ciudad</label>
                  <DataList value={ciudades.find(c => String(c.id) === String(form.idCiudad))?.nombre || ''} onChange={(e) => { const s = ciudades.find(c => c.nombre === e.target.value); if (s) setForm({ ...form, idCiudad: s.id }) }} required disabled={!form.idPais || loadingCatalogs}
                    style={estiloInput}>
                    <option value="">Seleccione ciudad</option>
                    {ciudades.map(c => <option key={c.id} value={c.nombre} />)}
                  </DataList>
                </div>
              </div>
              <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button type="submit"
                  style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: colorSuper, color: "#fff", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  Guardar
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>
                  Cancelar
                </button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  )
}
