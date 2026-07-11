import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiLock, FiTrash2, FiEye, FiPlus, FiX, FiArrowUp, FiArrowDown, FiEdit2, FiCheck, FiAlertTriangle } from 'react-icons/fi'
import {
  getAllUsers,
  patchUserStatus,
  forceUserPassword,
  deleteUser,
  getCondominiums,
  getAdministrators,
  createAdministrator,
  updateAdministrator,
  assignAdministratorCondo,
  createAdminUser,
  deleteAdministrator,
  extractItems,
} from '../../services/api'
import { Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import ToggleSwitch from '../../components/common/ToggleSwitch'
import ConfirmModal from '../../components/common/ConfirmModal'
import EncabezadoTabla from '../../components/EncabezadoTabla'

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

const ROL_LABELS = {
  ADMINISTRADOR_CONDOMINIO: 'Administrador',
  AGENTE_SEGURIDAD: 'Agente Seguridad',
  PROPIETARIO: 'Propietario',
}

const tabStyle = (active) => ({
  padding: "0.55rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: "700",
  border: "none", cursor: "pointer", transition: "all 0.2s",
  backgroundColor: active ? colorSuper : "#f1f5f9",
  color: active ? "#fff" : "#64748b",
})

const ITEMS_PER_PAGE = 10

export default function UsuariosGlobales() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab') || 'todos'
  const validTabs = ['todos', 'administradores', 'agentes', 'propietarios']
  const [tab, setTab] = useState(validTabs.includes(tabFromUrl) ? tabFromUrl : 'todos')

  // ==================== SHARED ====================
  const [users, setUsers] = useState([])
  const [condominios, setCondominios] = useState([])
  const [occupiedCondos, setOccupiedCondos] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ==================== TODOS TAB ====================
  const [filters, setFilters] = useState({ search: '', rol: '', estado: '', condominio: '' })
  const [sortOrder, setSortOrder] = useState('asc')
  const [sortField, setSortField] = useState('nombre')
  const [showModal, setShowModal] = useState(false)
  const [detailItem, setDetailItem] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [form, setForm] = useState({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '' })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ==================== ADMINISTRADORES TAB ====================
  const [admins, setAdmins] = useState([])
  const [adminSearch, setAdminSearch] = useState('')
  const [adminCondoFilter, setAdminCondoFilter] = useState('')
  const [adminSortField, setAdminSortField] = useState('nombre')
  const [adminSortOrder, setAdminSortOrder] = useState('asc')
  const [adminShowModal, setAdminShowModal] = useState(false)
  const [adminEditing, setAdminEditing] = useState(null)
  const [adminForm, setAdminForm] = useState({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '' })
  const [adminSubmitting, setAdminSubmitting] = useState(false)
  const [adminDetailItem, setAdminDetailItem] = useState(null)
  const [adminShowDetail, setAdminShowDetail] = useState(false)
  const [adminConfirmDelete, setAdminConfirmDelete] = useState(null)

  // ==================== AGENTES TAB ====================
  const [agentSearch, setAgentSearch] = useState('')
  const [agentCondoFilter, setAgentCondoFilter] = useState('')
  const [agentSortField, setAgentSortField] = useState('nombre')
  const [agentSortOrder, setAgentSortOrder] = useState('asc')
  const [agentShowCreate, setAgentShowCreate] = useState(false)
  const [agentShowEdit, setAgentShowEdit] = useState(false)
  const [agentEditing, setAgentEditing] = useState(null)
  const [agentCreateForm, setAgentCreateForm] = useState({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '' })
  const [agentEditForm, setAgentEditForm] = useState({ nombres: '', apellidos: '', telefono: '', idCondominio: '' })
  const [agentSubmitting, setAgentSubmitting] = useState(false)
  const [agentDetailItem, setAgentDetailItem] = useState(null)
  const [agentShowDetail, setAgentShowDetail] = useState(false)
  const [agentConfirmDelete, setAgentConfirmDelete] = useState(null)

  // ==================== PROPIETARIOS TAB ====================
  const [ownerSearch, setOwnerSearch] = useState('')
  const [ownerCondoFilter, setOwnerCondoFilter] = useState('')
  const [ownerSortField, setOwnerSortField] = useState('nombre')
  const [ownerSortOrder, setOwnerSortOrder] = useState('asc')
  const [ownerShowCreate, setOwnerShowCreate] = useState(false)
  const [ownerShowEdit, setOwnerShowEdit] = useState(false)
  const [ownerEditing, setOwnerEditing] = useState(null)
  const [ownerCreateForm, setOwnerCreateForm] = useState({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '' })
  const [ownerEditForm, setOwnerEditForm] = useState({ nombres: '', apellidos: '', telefono: '', idCondominio: '' })
  const [ownerSubmitting, setOwnerSubmitting] = useState(false)
  const [ownerDetailItem, setOwnerDetailItem] = useState(null)
  const [ownerShowDetail, setOwnerShowDetail] = useState(false)
  const [ownerConfirmDelete, setOwnerConfirmDelete] = useState(null)

  // ==================== PAGINATION ====================
  const [todosPage, setTodosPage] = useState(1)
  const [adminPage, setAdminPage] = useState(1)
  const [agentPage, setAgentPage] = useState(1)
  const [ownerPage, setOwnerPage] = useState(1)

  // ==================== SHARED LOAD ====================
  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [usersData, condosData, adminsData] = await Promise.all([
        getAllUsers(),
        getCondominiums(),
        getAdministrators(),
      ])
      const usersList = extractItems(usersData)
      const condosList = extractItems(condosData)
      const adminsList = extractItems(adminsData)
      setUsers(usersList)
      setCondominios(condosList)
      setAdmins(adminsList)
      const occupied = new Set()
      adminsList.forEach(admin => {
        if (admin.activo && admin.idCondominio !== null && admin.idCondominio !== undefined) {
          occupied.add(admin.idCondominio)
        }
      })
      setOccupiedCondos(occupied)
    } catch (err) {
      console.error(err)
      setError(err.message)
      setUsers([]); setCondominios([]); setAdmins([])
      toast.error(`Error al cargar datos: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    const current = searchParams.get('tab') || 'todos'
    if (current !== tab) {
      const newParams = new URLSearchParams(searchParams)
      if (tab === 'todos') { newParams.delete('tab') } else { newParams.set('tab', tab) }
      setSearchParams(newParams, { replace: true })
    }
  }, [tab])

  // ==================== PAGINATION RESETS ====================
  useEffect(() => { setTodosPage(1) }, [filters, sortField, sortOrder])
  useEffect(() => { setAdminPage(1) }, [adminSearch, adminCondoFilter, adminSortField, adminSortOrder])
  useEffect(() => { setAgentPage(1) }, [agentSearch, agentCondoFilter, agentSortField, agentSortOrder])
  useEffect(() => { setOwnerPage(1) }, [ownerSearch, ownerCondoFilter, ownerSortField, ownerSortOrder])

  // ==================== TODOS: FILTER/SORT ====================
  const filteredAndSorted = useMemo(() => {
    let result = users.filter(u => {
      const fullName = `${u.nombres || ''} ${u.apellidos || ''}`.toLowerCase()
      const email = (u.correo || '').toLowerCase()
      const search = filters.search.toLowerCase()
      const matchSearch = fullName.includes(search) || email.includes(search)
      const matchRol = filters.rol ? u.rol === filters.rol : true
      const matchEstado = filters.estado !== '' ? (filters.estado === 'activo' ? u.activo : !u.activo) : true
      const matchCondo = filters.condominio ? u.idCondominio === parseInt(filters.condominio, 10) : true
      return matchSearch && matchRol && matchEstado && matchCondo
    })
    result.sort((a, b) => {
      let valA, valB
      if (sortField === 'nombre') {
        valA = `${a.nombres || ''} ${a.apellidos || ''}`.toLowerCase()
        valB = `${b.nombres || ''} ${b.apellidos || ''}`.toLowerCase()
      } else if (sortField === 'correo') {
        valA = (a.correo || '').toLowerCase(); valB = (b.correo || '').toLowerCase()
      } else if (sortField === 'rol') {
        valA = a.rol || ''; valB = b.rol || ''
      } else if (sortField === 'estado') {
        valA = a.activo ? 1 : 0; valB = b.activo ? 1 : 0
      } else { return 0 }
      return sortOrder === 'asc' ? (valA > valB ? 1 : valA < valB ? -1 : 0) : (valA < valB ? 1 : valA > valB ? -1 : 0)
    })
    return result
  }, [users, filters, sortField, sortOrder])

  const todosTotalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE) || 1
  const paginatedTodos = useMemo(
    () => filteredAndSorted.slice((todosPage - 1) * ITEMS_PER_PAGE, todosPage * ITEMS_PER_PAGE),
    [filteredAndSorted, todosPage]
  )

  // ==================== TODOS: HANDLERS ====================
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (!form.contrasena || form.contrasena.trim().length < 6) {
        toast.warning('La contraseña debe tener al menos 6 caracteres.')
        setSubmitting(false); return
      }
      const selectedCondoId = form.idCondominio ? parseInt(form.idCondominio, 10) : null
      if (selectedCondoId && occupiedCondos.has(selectedCondoId)) {
        toast.error('Este condominio ya tiene un administrador asignado.')
        setSubmitting(false); return
      }
      const created = await createAdministrator({
        nombres: form.nombres.trim(), apellidos: form.apellidos.trim(),
        correo: form.correo.trim(), telefono: form.telefono.trim(),
        contrasena: form.contrasena.trim(),
      })
      if (selectedCondoId && created.id) {
        await assignAdministratorCondo(created.id, selectedCondoId)
      }
      toast.success('Administrador de condominio creado correctamente.')
      setShowModal(false)
      setForm({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '' })
      setTimeout(() => loadData(), 300)
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally { setSubmitting(false) }
  }

  const handleToggleStatus = async (userId, activo) => {
    try {
      await patchUserStatus(userId, !activo)
      toast.success(`Usuario ${!activo ? 'activado' : 'desactivado'}.`)
      setConfirmAction(null)
      await loadData()
    } catch (err) {
      toast.error(`Error: ${err.message}`)
      setConfirmAction(null)
    }
  }

  const handleForcePassword = async (userId) => {
    if (!newPassword || newPassword.trim() === '') { toast.warning('La contraseña no puede estar vacía'); return }
    if (newPassword.length < 6) { toast.error('La contraseña debe tener al menos 6 caracteres.'); return }
    try {
      await forceUserPassword(userId, newPassword.trim())
      toast.success('Contraseña actualizada correctamente.')
      setShowPasswordModal(false); setNewPassword(''); setPasswordError('')
      await loadData()
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    }
  }

  const handleDeleteUser = async (user) => {
    try {
      const isAdmin = user.rol === 'ADMINISTRADOR_CONDOMINIO'
      await deleteUser(user.id, user.rol)
      toast.success(isAdmin ? 'Administrador eliminado correctamente.' : 'Usuario desactivado (eliminación lógica).')
      setConfirmAction(null)
      await loadData()
    } catch (err) {
      toast.error(`Error: ${err.message}`)
      setConfirmAction(null)
    }
  }

  // ==================== ADMINISTRADORES: HANDLERS ====================
  const adminFiltered = useMemo(() => {
    let result = admins.filter(a => {
      const fullName = `${a.nombres || ''} ${a.apellidos || ''}`.toLowerCase()
      const email = (a.correo || '').toLowerCase()
      const search = adminSearch.toLowerCase()
      const matchSearch = fullName.includes(search) || email.includes(search)
      const matchCondo = adminCondoFilter ? a.idCondominio === parseInt(adminCondoFilter, 10) : true
      return matchSearch && matchCondo
    })
    result.sort((a, b) => {
      let valA, valB
      if (adminSortField === 'nombre') {
        valA = `${a.nombres || ''} ${a.apellidos || ''}`.toLowerCase()
        valB = `${b.nombres || ''} ${b.apellidos || ''}`.toLowerCase()
      } else if (adminSortField === 'correo') {
        valA = (a.correo || '').toLowerCase(); valB = (b.correo || '').toLowerCase()
      } else { return 0 }
      return adminSortOrder === 'asc' ? (valA > valB ? 1 : valA < valB ? -1 : 0) : (valA < valB ? 1 : valA > valB ? -1 : 0)
    })
    return result
  }, [admins, adminSearch, adminCondoFilter, adminSortField, adminSortOrder])

  const adminTotalPages = Math.ceil(adminFiltered.length / ITEMS_PER_PAGE) || 1
  const paginatedAdmins = useMemo(
    () => adminFiltered.slice((adminPage - 1) * ITEMS_PER_PAGE, adminPage * ITEMS_PER_PAGE),
    [adminFiltered, adminPage]
  )

  const adminGetCondoOptions = () => {
    const options = []
    condominios.forEach(c => {
      const isOccupied = occupiedCondos.has(c.id)
      const isCurrentAdminCondo = adminEditing && adminEditing.idCondominio === c.id
      if (!adminEditing && isOccupied) return
      const disabled = isOccupied && !isCurrentAdminCondo
      options.push({ id: c.id, nombre: c.nombre, activo: c.activo, disabled, label: disabled ? `${c.nombre} (ocupado)` : c.nombre })
    })
    return options
  }

  const handleAdminSubmit = async (e) => {
    e.preventDefault()
    setAdminSubmitting(true)
    try {
      if (adminEditing) {
        await updateAdministrator(adminEditing.id, {
          nombres: adminForm.nombres.trim(), apellidos: adminForm.apellidos.trim(),
          correo: adminForm.correo.trim(), telefono: adminForm.telefono.trim(),
        })
        const newCondoId = adminForm.idCondominio ? parseInt(adminForm.idCondominio, 10) : null
        const oldCondoId = adminEditing.idCondominio ? parseInt(adminEditing.idCondominio, 10) : null
        if (newCondoId !== oldCondoId) {
          if (newCondoId !== null) {
            if (occupiedCondos.has(newCondoId)) { toast.error('Este condominio ya tiene un administrador asignado.'); setAdminSubmitting(false); return }
            const sc = condominios.find(c => c.id === newCondoId)
            if (sc && !sc.activo) { toast.error('No se puede asignar un condominio desactivado.'); setAdminSubmitting(false); return }
            await assignAdministratorCondo(adminEditing.id, newCondoId)
          } else {
            try { await assignAdministratorCondo(adminEditing.id, null) } catch { toast.warning('El backend no permite desasignar. Solo se puede cambiar a otro.'); setAdminSubmitting(false); return }
          }
        }
      } else {
        await createAdministrator({
          nombres: adminForm.nombres.trim(), apellidos: adminForm.apellidos.trim(),
          correo: adminForm.correo.trim(), telefono: adminForm.telefono.trim(),
          contrasena: adminForm.contrasena.trim(),
        })
      }
      setAdminShowModal(false)
      setTimeout(() => loadData(), 300)
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally { setAdminSubmitting(false) }
  }

  const handleAdminDelete = async (id) => {
    try {
      await deleteAdministrator(id)
      toast.success('Administrador eliminado.')
      setAdminConfirmDelete(null)
      await loadData()
    } catch (err) {
      toast.error(`Error al eliminar: ${err.message}`)
      setAdminConfirmDelete(null)
    }
  }

  // ==================== AGENTES: HANDLERS ====================
  const agentUsers = useMemo(() => users.filter(u => u.rol === 'AGENTE_SEGURIDAD'), [users])

  const agentFiltered = useMemo(() => {
    let result = agentUsers.filter(u => {
      const fullName = `${u.nombres || ''} ${u.apellidos || ''}`.toLowerCase()
      const email = (u.correo || '').toLowerCase()
      const search = agentSearch.toLowerCase()
      const matchSearch = fullName.includes(search) || email.includes(search)
      const matchCondo = agentCondoFilter ? u.idCondominio === parseInt(agentCondoFilter, 10) : true
      return matchSearch && matchCondo
    })
    result.sort((a, b) => {
      let valA, valB
      if (agentSortField === 'nombre') {
        valA = `${a.nombres || ''} ${a.apellidos || ''}`.toLowerCase()
        valB = `${b.nombres || ''} ${b.apellidos || ''}`.toLowerCase()
      } else if (agentSortField === 'correo') {
        valA = (a.correo || '').toLowerCase(); valB = (b.correo || '').toLowerCase()
      } else { return 0 }
      return agentSortOrder === 'asc' ? (valA > valB ? 1 : valA < valB ? -1 : 0) : (valA < valB ? 1 : valA > valB ? -1 : 0)
    })
    return result
  }, [agentUsers, agentSearch, agentCondoFilter, agentSortField, agentSortOrder])

  const agentTotalPages = Math.ceil(agentFiltered.length / ITEMS_PER_PAGE) || 1
  const paginatedAgents = useMemo(
    () => agentFiltered.slice((agentPage - 1) * ITEMS_PER_PAGE, agentPage * ITEMS_PER_PAGE),
    [agentFiltered, agentPage]
  )

  const handleAgentCreate = async (e) => {
    e.preventDefault()
    setAgentSubmitting(true)
    try {
      if (!agentCreateForm.contrasena || agentCreateForm.contrasena.trim().length < 6) {
        toast.warning('La contraseña debe tener al menos 6 caracteres.')
        setAgentSubmitting(false); return
      }
      const scId = agentCreateForm.idCondominio ? parseInt(agentCreateForm.idCondominio, 10) : null
      if (!scId) { toast.error('Debes seleccionar un condominio.'); setAgentSubmitting(false); return }
      await createAdminUser({
        nombres: agentCreateForm.nombres.trim(), apellidos: agentCreateForm.apellidos.trim(),
        correo: agentCreateForm.correo.trim(), telefono: agentCreateForm.telefono.trim(),
        contrasena: agentCreateForm.contrasena.trim(), rol: 'AGENTE_SEGURIDAD',
      }, scId)
      toast.success('Agente de Seguridad creado correctamente.')
      setAgentShowCreate(false)
      setAgentCreateForm({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '' })
      setTimeout(() => loadData(), 300)
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally { setAgentSubmitting(false) }
  }

  const handleAgentEdit = async (e) => {
    e.preventDefault()
    setAgentSubmitting(true)
    try {
      const tel = agentEditForm.telefono.trim()
      if (tel && (tel.length < 7 || tel.length > 16)) { toast.warning('El teléfono debe tener entre 7 y 16 caracteres.'); setAgentSubmitting(false); return }
      await updateAdministrator(agentEditing.id, {
        nombres: agentEditForm.nombres.trim(), apellidos: agentEditForm.apellidos.trim(),
        telefono: tel || agentEditing.telefono || '0000000',
      })
      const ncId = agentEditForm.idCondominio ? parseInt(agentEditForm.idCondominio, 10) : null
      if (ncId !== (agentEditing.idCondominio || null)) {
        try { await assignAdministratorCondo(agentEditing.id, ncId) } catch (assignErr) {
          if (ncId === null && assignErr.message.includes('no puede ser null')) { toast.warning('El backend no permite desasignar el condominio.') }
          else { toast.warning(`Datos guardados, pero no se pudo reasignar: ${assignErr.message}`) }
        }
      }
      toast.success('Agente actualizado correctamente.')
      setAgentShowEdit(false); setAgentEditing(null)
      await loadData()
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally { setAgentSubmitting(false) }
  }

  const handleAgentDelete = async (user) => {
    try {
      await deleteAdministrator(user.id)
      toast.success('Agente eliminado permanentemente.')
      setAgentConfirmDelete(null)
      await loadData()
    } catch (err) {
      toast.error(`Error: ${err.message}`)
      setAgentConfirmDelete(null)
    }
  }

  // ==================== PROPIETARIOS: HANDLERS ====================
  const ownerUsers = useMemo(() => users.filter(u => u.rol === 'PROPIETARIO'), [users])

  const ownerFiltered = useMemo(() => {
    let result = ownerUsers.filter(u => {
      const fullName = `${u.nombres || ''} ${u.apellidos || ''}`.toLowerCase()
      const email = (u.correo || '').toLowerCase()
      const search = ownerSearch.toLowerCase()
      const matchSearch = fullName.includes(search) || email.includes(search)
      const matchCondo = ownerCondoFilter ? u.idCondominio === parseInt(ownerCondoFilter, 10) : true
      return matchSearch && matchCondo
    })
    result.sort((a, b) => {
      let valA, valB
      if (ownerSortField === 'nombre') {
        valA = `${a.nombres || ''} ${a.apellidos || ''}`.toLowerCase()
        valB = `${b.nombres || ''} ${b.apellidos || ''}`.toLowerCase()
      } else if (ownerSortField === 'correo') {
        valA = (a.correo || '').toLowerCase(); valB = (b.correo || '').toLowerCase()
      } else { return 0 }
      return ownerSortOrder === 'asc' ? (valA > valB ? 1 : valA < valB ? -1 : 0) : (valA < valB ? 1 : valA > valB ? -1 : 0)
    })
    return result
  }, [ownerUsers, ownerSearch, ownerCondoFilter, ownerSortField, ownerSortOrder])

  const ownerTotalPages = Math.ceil(ownerFiltered.length / ITEMS_PER_PAGE) || 1
  const paginatedOwners = useMemo(
    () => ownerFiltered.slice((ownerPage - 1) * ITEMS_PER_PAGE, ownerPage * ITEMS_PER_PAGE),
    [ownerFiltered, ownerPage]
  )

  const handleOwnerCreate = async (e) => {
    e.preventDefault()
    setOwnerSubmitting(true)
    try {
      if (!ownerCreateForm.contrasena || ownerCreateForm.contrasena.trim().length < 6) {
        toast.warning('La contraseña debe tener al menos 6 caracteres.')
        setOwnerSubmitting(false); return
      }
      const scId = ownerCreateForm.idCondominio ? parseInt(ownerCreateForm.idCondominio, 10) : null
      if (!scId) { toast.error('Debes seleccionar un condominio.'); setOwnerSubmitting(false); return }
      await createAdminUser({
        nombres: ownerCreateForm.nombres.trim(), apellidos: ownerCreateForm.apellidos.trim(),
        correo: ownerCreateForm.correo.trim(), telefono: ownerCreateForm.telefono.trim(),
        contrasena: ownerCreateForm.contrasena.trim(), rol: 'PROPIETARIO',
      }, scId)
      toast.success('Propietario creado correctamente.')
      setOwnerShowCreate(false)
      setOwnerCreateForm({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '' })
      setTimeout(() => loadData(), 300)
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally { setOwnerSubmitting(false) }
  }

  const handleOwnerEdit = async (e) => {
    e.preventDefault()
    setOwnerSubmitting(true)
    try {
      const tel = ownerEditForm.telefono.trim()
      if (tel && (tel.length < 7 || tel.length > 16)) { toast.warning('El teléfono debe tener entre 7 y 16 caracteres.'); setOwnerSubmitting(false); return }
      await updateAdministrator(ownerEditing.id, {
        nombres: ownerEditForm.nombres.trim(), apellidos: ownerEditForm.apellidos.trim(),
        telefono: tel || ownerEditing.telefono || '0000000',
      })
      const ncId = ownerEditForm.idCondominio ? parseInt(ownerEditForm.idCondominio, 10) : null
      if (ncId !== (ownerEditing.idCondominio || null)) {
        try { await assignAdministratorCondo(ownerEditing.id, ncId) } catch (assignErr) {
          if (ncId === null && assignErr.message.includes('no puede ser null')) { toast.warning('El backend no permite desasignar el condominio.') }
          else { toast.warning(`Datos guardados, pero no se pudo reasignar: ${assignErr.message}`) }
        }
      }
      toast.success('Propietario actualizado correctamente.')
      setOwnerShowEdit(false); setOwnerEditing(null)
      await loadData()
    } catch (err) {
      toast.error(`Error: ${err.message}`)
    } finally { setOwnerSubmitting(false) }
  }

  const handleOwnerDelete = async (user) => {
    try {
      await deleteAdministrator(user.id)
      toast.success('Propietario eliminado permanentemente.')
      setOwnerConfirmDelete(null)
      await loadData()
    } catch (err) {
      toast.error(`Error: ${err.message}`)
      setOwnerConfirmDelete(null)
    }
  }

  // ==================== HELPERS ====================
  const toggleSort = (field, setField, setOrder, order, fieldVal) => {
    if (field === fieldVal) { setOrder(order === 'asc' ? 'desc' : 'asc') }
    else { setField(fieldVal); setOrder('asc') }
  }

  const getSortIcon = (field, sortFieldVal, sortOrderVal) => {
    if (sortFieldVal !== field) return null
    return sortOrderVal === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />
  }

  const getRolBadge = (rol) => {
    const map = {
      ADMINISTRADOR_CONDOMINIO: { bg: "rgba(59,130,246,0.1)", color: "#3b82f6" },
      AGENTE_SEGURIDAD: { bg: "rgba(245,158,11,0.15)", color: "#d97706" },
      PROPIETARIO: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
    }
    const s = map[rol] || { bg: "#f1f5f9", color: "#64748b" }
    return { ...s, label: ROL_LABELS[rol] || rol }
  }

  // ==================== LOADING / ERROR ====================
  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando usuarios...</p>
      </div>
    )
  if (error)
    return (
      <div className="text-center text-danger py-5">
        <p><strong>Error:</strong> {error}</p>
        <button onClick={loadData} style={{ ...btnStyle, backgroundColor: colorSuper, color: "#fff", fontSize: "0.85rem" }}>Reintentar</button>
      </div>
    )

  const getCondoOptions = () => condominios.map(c => {
    const isOccupied = occupiedCondos.has(c.id)
    const disabled = isOccupied || !c.activo
    let label = c.nombre
    if (isOccupied) label += ' (ocupado)'
    else if (!c.activo) label += ' (inactivo)'
    return { id: c.id, nombre: c.nombre, label, disabled }
  })

  const condominioOptions = getCondoOptions()

  // ==================== RENDER: TAB BUTTONS ====================
  const renderTabs = () => (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
      {[
        { key: 'todos', label: 'Globales' },
        { key: 'administradores', label: 'Administradores' },
        { key: 'agentes', label: 'Agentes de Seguridad' },
        { key: 'propietarios', label: 'Propietarios' },
      ].map(t => (
        <button key={t.key} onClick={() => setTab(t.key)} style={tabStyle(tab === t.key)}>
          {t.label}
        </button>
      ))}
    </div>
  )

  // ==================== RENDER: TABLE HELPERS ====================
  const renderInitials = (nombres, apellidos) => (
    <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: colorSuper, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: "700", flexShrink: 0 }}>
      {((nombres || '??').charAt(0) + (apellidos || '').charAt(0)).toUpperCase()}
    </div>
  )

  // ==================== RENDER: DETALLE MODAL ====================
  const renderDetailModal = (item, onClose, titulo) => {
    if (!item) return null
    return (
      <div style={modalOverlay} onClick={onClose}>
        <div style={{ ...modalContent, maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.05rem" }}>{titulo || 'Detalle'}</h3>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}>
              <FiX size={20} />
            </button>
          </div>
          <div style={{ padding: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>ID</span>
                <p style={{ margin: "0.2rem 0 0", fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{item.id}</p>
              </div>
              <div>
                <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Nombre</span>
                <p style={{ margin: "0.2rem 0 0", fontWeight: "700", color: "#0f172a", fontSize: "0.9rem" }}>{item.nombres} {item.apellidos}</p>
              </div>
              <div>
                <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Correo</span>
                <p style={{ margin: "0.2rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{item.correo}</p>
              </div>
              <div>
                <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Teléfono</span>
                <p style={{ margin: "0.2rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{item.telefono || '—'}</p>
              </div>
              {item.rol && (
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Rol</span>
                  <p style={{ margin: "0.2rem 0 0" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: "700", padding: "0.2rem 0.55rem", borderRadius: "0.375rem", backgroundColor: getRolBadge(item.rol).bg, color: getRolBadge(item.rol).color, whiteSpace: "nowrap" }}>
                      {getRolBadge(item.rol).label}
                    </span>
                  </p>
                </div>
              )}
              <div>
                <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Condominio</span>
                <p style={{ margin: "0.2rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>{item.nombreCondominio || <span style={{ fontStyle: "italic", color: "#94a3b8" }}>Sin asignar</span>}</p>
              </div>
              <div>
                <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Estado</span>
                <p style={{ margin: "0.2rem 0 0" }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: "700", padding: "0.2rem 0.55rem", borderRadius: "0.375rem", backgroundColor: item.activo ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: item.activo ? "#10b981" : "#ef4444", whiteSpace: "nowrap" }}>
                    {item.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </p>
              </div>
              {item.correoVerificado !== undefined && (
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Verificado</span>
                  <p style={{ margin: "0.2rem 0 0" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: "700", padding: "0.2rem 0.55rem", borderRadius: "0.375rem", backgroundColor: item.correoVerificado ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.15)", color: item.correoVerificado ? "#10b981" : "#d97706", whiteSpace: "nowrap" }}>
                      {item.correoVerificado ? 'Sí' : 'No'}
                    </span>
                  </p>
                </div>
              )}
              <div>
                <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>Creado</span>
                <p style={{ margin: "0.2rem 0 0", fontWeight: "600", color: "#0f172a", fontSize: "0.85rem" }}>
                  {item.fechaCreacion ? new Date(item.fechaCreacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                </p>
              </div>
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={onClose} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderPagination = (currentPage, totalPages, setPage) => {
    if (totalPages <= 1) return null
    const pages = []
    const delta = 1
    const left = Math.max(2, currentPage - delta)
    const right = Math.min(totalPages - 1, currentPage + delta)

    pages.push(1)
    if (left > 2) pages.push('...')
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < totalPages - 1) pages.push('...')
    if (totalPages > 1) pages.push(totalPages)

    const pageBtn = (active) => ({
      minWidth: "2rem", height: "2rem", padding: "0 0.5rem",
      borderRadius: "0.375rem", fontSize: "0.75rem", fontWeight: "700",
      border: active ? "none" : "1px solid #e2e8f0",
      backgroundColor: active ? colorSuper : "#ffffff",
      color: active ? "#fff" : "#64748b",
      cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.15s",
    })

    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", padding: "0.85rem 0 0.5rem", flexWrap: "wrap" }}>
        <button disabled={currentPage <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}
          style={{ ...pageBtn(false), opacity: currentPage <= 1 ? 0.4 : 1, cursor: currentPage <= 1 ? "not-allowed" : "pointer" }}>
          Atrás
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: "600", padding: "0 0.2rem" }}>...</span>
          ) : (
            <button key={p} onClick={() => setPage(p)} style={pageBtn(p === currentPage)}>
              {p}
            </button>
          )
        )}
        <button disabled={currentPage >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          style={{ ...pageBtn(false), opacity: currentPage >= totalPages ? 0.4 : 1, cursor: currentPage >= totalPages ? "not-allowed" : "pointer" }}>
          Siguiente
        </button>
      </div>
    )
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="global-card-padding" style={{ padding: "2rem", backgroundColor: "#f8fafc", minHeight: "100vh", width: "100%", boxSizing: "border-box", textAlign: "left" }}>
      <style>{globalResponsive}</style>
      <EncabezadoTabla titulo="Usuarios del Sistema" subtitulo="Gestión de usuarios, administradores, agentes de seguridad y propietarios" />
      {renderTabs()}

      {/* ==================== TAB: TODOS ==================== */}
      {tab === 'todos' && (
        <>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "#1e293b" }}>
                  Usuarios <span style={{ color: "#94a3b8", fontWeight: "600" }}>({filteredAndSorted.length})</span>
                </span>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  <button onClick={() => { setForm({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '' }); setShowModal(true) }}
                    style={{ backgroundColor: colorSuper, color: "#ffffff", border: "none", padding: "0.4rem 0.85rem", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <FiPlus size={14} /> Nuevo Admin
                  </button>
                  <div className="global-search-wrap" style={{ width: "220px", maxWidth: "220px", position: "relative" }}>
                    <FiSearch size={14} style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input type="text" placeholder="Buscar por nombre o correo..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      style={{ ...estiloInput, paddingLeft: "2rem", paddingTop: "0.45rem", paddingBottom: "0.45rem", fontSize: "0.8rem" }} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                <select value={filters.rol} onChange={(e) => setFilters({ ...filters, rol: e.target.value })}
                  style={{ ...estiloInput, width: "auto", minWidth: "150px", padding: "0.35rem 0.5rem", fontSize: "0.8rem" }}>
                  <option value="">Todos los roles</option>
                  <option value="ADMINISTRADOR_CONDOMINIO">Administrador</option>
                  <option value="AGENTE_SEGURIDAD">Agente Seguridad</option>
                  <option value="PROPIETARIO">Propietario</option>
                </select>
                <select value={filters.estado} onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                  style={{ ...estiloInput, width: "auto", minWidth: "120px", padding: "0.35rem 0.5rem", fontSize: "0.8rem" }}>
                  <option value="">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
                <select value={filters.condominio} onChange={(e) => setFilters({ ...filters, condominio: e.target.value })}
                  style={{ ...estiloInput, width: "auto", minWidth: "180px", padding: "0.35rem 0.5rem", fontSize: "0.8rem" }}>
                  <option value="">Todos los condominios</option>
                  {condominios.map(c => (<option key={c.id} value={c.id}>{c.nombre}{occupiedCondos.has(c.id) ? ' (ocupado)' : ''}</option>))}
                </select>
                <select value={`${sortField}-${sortOrder}`} onChange={(e) => { const [field, order] = e.target.value.split('-'); setSortField(field); setSortOrder(order) }}
                  style={{ ...estiloInput, width: "auto", minWidth: "170px", padding: "0.35rem 0.5rem", fontSize: "0.8rem" }}>
                  <option value="nombre-asc">Nombre A-Z</option>
                  <option value="nombre-desc">Nombre Z-A</option>
                  <option value="correo-asc">Correo A-Z</option>
                  <option value="correo-desc">Correo Z-A</option>
                  <option value="rol-asc">Rol A-Z</option>
                  <option value="rol-desc">Rol Z-A</option>
                  <option value="estado-asc">Estado (Activo primero)</option>
                  <option value="estado-desc">Estado (Inactivo primero)</option>
                </select>
                {(filters.search || filters.rol || filters.estado || filters.condominio) && (
                  <button onClick={() => setFilters({ search: '', rol: '', estado: '', condominio: '' })}
                    style={{ ...btnStyle, backgroundColor: "#f1f5f9", color: "#64748b", fontSize: "0.7rem" }}>
                    <FiX size={12} /> Limpiar filtros
                  </button>
                )}
              </div>
            </div>
            {filteredAndSorted.length === 0 ? (
              <div style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8", fontStyle: "italic", fontWeight: "600", minHeight: "320px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                No se encontraron coincidencias.
                {users.length === 0 && <p>No hay usuarios registrados en el sistema.</p>}
              </div>
            ) : (
              <>
              <div className="global-table-wrap" style={{ overflowX: "auto", minHeight: "320px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ padding: "0.75rem 1rem", cursor: "pointer" }} onClick={() => toggleSort(sortField, setSortField, setSortOrder, sortOrder, 'nombre')}>
                        Nombre {getSortIcon('nombre', sortField, sortOrder)}
                      </th>
                      <th style={{ padding: "0.75rem 0.5rem", cursor: "pointer" }} onClick={() => toggleSort(sortField, setSortField, setSortOrder, sortOrder, 'correo')}>
                        Correo {getSortIcon('correo', sortField, sortOrder)}
                      </th>
                      <th style={{ padding: "0.75rem 0.5rem" }}>Teléfono</th>
                      <th style={{ padding: "0.75rem 0.5rem", cursor: "pointer" }} onClick={() => toggleSort(sortField, setSortField, setSortOrder, sortOrder, 'rol')}>
                        Rol {getSortIcon('rol', sortField, sortOrder)}
                      </th>
                      <th style={{ padding: "0.75rem 0.5rem" }}>Condominio</th>
                      <th style={{ padding: "0.75rem 0.5rem", cursor: "pointer", textAlign: "center" }} onClick={() => toggleSort(sortField, setSortField, setSortOrder, sortOrder, 'estado')}>
                        Estado {getSortIcon('estado', sortField, sortOrder)}
                      </th>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                    {paginatedTodos.map((u, i) => {
                      const rolBadge = getRolBadge(u.rol)
                      return (
                        <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                          <td style={{ padding: "0.75rem 1rem", fontWeight: "700", color: "#0f172a" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              {renderInitials(u.nombres, u.apellidos)}
                              <span>{u.nombres} {u.apellidos}</span>
                            </div>
                          </td>
                          <td style={{ padding: "0.75rem 0.5rem", color: "#64748b", fontSize: "0.8rem" }}>{u.correo}</td>
                          <td style={{ padding: "0.75rem 0.5rem", color: "#64748b", fontSize: "0.8rem" }}>{u.telefono || '—'}</td>
                          <td style={{ padding: "0.75rem 0.5rem" }}>
                            <span style={{ fontSize: "0.65rem", fontWeight: "700", padding: "0.2rem 0.55rem", borderRadius: "0.375rem", backgroundColor: rolBadge.bg, color: rolBadge.color, whiteSpace: "nowrap" }}>
                              {rolBadge.label}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem 0.5rem", color: "#64748b", fontSize: "0.8rem" }}>
                            {u.nombreCondominio || <span style={{ fontStyle: "italic", color: "#cbd5e1" }}>Sin asignar</span>}
                          </td>
                          <td style={{ padding: "0.75rem 0.5rem", textAlign: "center" }}>
                            <ToggleSwitch checked={u.activo} onChange={() => setConfirmAction({ type: 'status', user: u })} />
                          </td>
                          <td style={{ padding: "0.75rem 1rem", whiteSpace: "nowrap", textAlign: "right" }}>
                            <button style={{ ...btnStyle, backgroundColor: "rgba(124,58,237,0.1)", color: colorSuper, marginRight: "0.25rem" }}
                              onClick={() => { setDetailItem(u); setShowDetail(true) }} title="Ver detalle">
                              <FiEye size={14} />
                            </button>
                            <button style={{ ...btnStyle, backgroundColor: "rgba(245,158,11,0.15)", color: "#d97706", marginRight: "0.25rem" }}
                              onClick={() => { setSelectedUser(u); setShowPasswordModal(true) }} title="Forzar cambio de contraseña">
                              <FiLock size={14} />
                            </button>
                            <button style={{ ...btnStyle, backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                              onClick={() => setConfirmAction({ type: 'delete', user: u })} title="Eliminar usuario">
                              <FiTrash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {renderPagination(todosPage, todosTotalPages, setTodosPage)}
              </>
            )}
          </div>

          {showDetail && detailItem && renderDetailModal(detailItem, () => setShowDetail(false), 'Detalle del Usuario')}

          <ConfirmModal
            open={!!confirmAction}
            title={confirmAction?.type === 'status' ? `${confirmAction?.user?.activo ? 'Desactivar' : 'Activar'} usuario` : 'Eliminar usuario'}
            description={confirmAction?.type === 'status'
              ? `¿Estás seguro de ${confirmAction?.user?.activo ? 'desactivar' : 'activar'} a "${confirmAction?.user?.nombres} ${confirmAction?.user?.apellidos}"?`
              : `¿Estás seguro de eliminar a "${confirmAction?.user?.nombres} ${confirmAction?.user?.apellidos}"?`}
            onConfirm={() => {
              if (confirmAction?.type === 'status') handleToggleStatus(confirmAction.user.id, confirmAction.user.activo)
              else if (confirmAction?.type === 'delete') handleDeleteUser(confirmAction.user)
            }}
            onCancel={() => setConfirmAction(null)}
            confirmLabel={confirmAction?.type === 'status' ? `${confirmAction?.user?.activo ? 'Desactivar' : 'Activar'}` : 'Eliminar'}
            variant="danger"
          />

          {showModal && (
            <div style={modalOverlay} onClick={() => setShowModal(false)}>
              <div style={{ ...modalContent, maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.05rem" }}>Nuevo Administrador de Condominio</h3>
                  <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}><FiX size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div style={{ padding: "1.5rem" }}>
                    <div style={{ padding: "0.6rem 0.85rem", backgroundColor: "rgba(59,130,246,0.08)", borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "0.78rem", color: "#475569", borderLeft: `3px solid ${colorSuper}`, fontWeight: "500" }}>
                      Solo puedes crear <strong>Administradores de Condominio</strong>. Los roles Propietario y Agente de Seguridad se crean desde las pestañas correspondientes.
                    </div>
                    <input type="hidden" name="rol" value="ADMINISTRADOR_CONDOMINIO" />
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Nombres</label>
                      <input type="text" value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })} required style={estiloInput} placeholder="Nombres del administrador" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Apellidos</label>
                      <input type="text" value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} required style={estiloInput} placeholder="Apellidos del administrador" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Correo</label>
                      <input type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} required style={estiloInput} placeholder="correo@ejemplo.com" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Teléfono</label>
                      <input type="text" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} style={estiloInput} placeholder="Teléfono (opcional)" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Contraseña</label>
                      <input type="password" value={form.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} required minLength={6} autoComplete="new-password" style={estiloInput} placeholder="Mínimo 6 caracteres" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Asignar condominio</label>
                      <select value={form.idCondominio} onChange={(e) => setForm({ ...form, idCondominio: e.target.value })} style={estiloInput}>
                        <option value="">Sin asignar</option>
                        {condominioOptions.map(c => (<option key={c.id} value={c.id} disabled={c.disabled}>{c.label}</option>))}
                      </select>
                    </div>
                  </div>
                  <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                    <button type="button" onClick={() => setShowModal(false)} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>Cancelar</button>
                    <button type="submit" disabled={submitting} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: submitting ? "#cbd5e1" : colorSuper, color: "#fff", fontWeight: "600", cursor: submitting ? "not-allowed" : "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      {submitting ? 'Creando...' : 'Crear Administrador'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showPasswordModal && (
            <div style={modalOverlay} onClick={() => { setShowPasswordModal(false); setNewPassword(''); setPasswordError('') }}>
              <div style={{ ...modalContent, maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.05rem" }}>Forzar cambio de contraseña</h3>
                  <button onClick={() => { setShowPasswordModal(false); setNewPassword(''); setPasswordError('') }} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}><FiX size={20} /></button>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <p style={{ margin: "0 0 1rem", fontSize: "0.85rem", color: "#475569" }}>Usuario: <strong>{selectedUser?.nombres} {selectedUser?.apellidos}</strong></p>
                  <div>
                    <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Nueva contraseña</label>
                    <input type="text" value={newPassword} onChange={(e) => { const v = e.target.value; setNewPassword(v); setPasswordError(v && v.length < 6 ? 'La contraseña debe tener al menos 6 caracteres.' : '') }}
                      style={{ ...estiloInput, borderColor: passwordError ? "#ef4444" : "#cbd5e1" }} placeholder="Ingresa nueva contraseña" />
                    {passwordError && <small style={{ color: "#ef4444", fontWeight: "600", fontSize: "0.7rem", marginTop: "0.25rem", display: "block" }}>{passwordError}</small>}
                    <small style={{ color: "#94a3b8", fontSize: "0.7rem", marginTop: "0.25rem", display: "block" }}>La contraseña debe tener al menos 6 caracteres.</small>
                  </div>
                </div>
                <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                  <button onClick={() => { setShowPasswordModal(false); setNewPassword(''); setPasswordError('') }} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>Cancelar</button>
                  <button onClick={() => handleForcePassword(selectedUser?.id)} disabled={!!passwordError || !newPassword || newPassword.length < 6}
                    style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: (!!passwordError || !newPassword || newPassword.length < 6) ? "#cbd5e1" : colorSuper, color: "#fff", fontWeight: "600", cursor: (!!passwordError || !newPassword || newPassword.length < 6) ? "not-allowed" : "pointer", fontSize: "0.85rem" }}>
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ==================== TAB: ADMINISTRADORES ==================== */}
      {tab === 'administradores' && (
        <>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "#1e293b" }}>
                  Administradores <span style={{ color: "#94a3b8", fontWeight: "600" }}>({adminFiltered.length})</span>
                </span>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  <button onClick={() => { setAdminEditing(null); setAdminForm({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '' }); setAdminShowModal(true) }}
                    style={{ backgroundColor: colorSuper, color: "#ffffff", border: "none", padding: "0.4rem 0.85rem", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <FiPlus size={14} /> Nuevo
                  </button>
                  <div className="global-search-wrap" style={{ width: "220px", maxWidth: "220px", position: "relative" }}>
                    <FiSearch size={14} style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input type="text" placeholder="Buscar por nombre o correo..." value={adminSearch} onChange={(e) => setAdminSearch(e.target.value)}
                      style={{ ...estiloInput, paddingLeft: "2rem", paddingTop: "0.45rem", paddingBottom: "0.45rem", fontSize: "0.8rem" }} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                <select value={adminCondoFilter} onChange={(e) => setAdminCondoFilter(e.target.value)}
                  style={{ ...estiloInput, width: "auto", minWidth: "180px", padding: "0.35rem 0.5rem", fontSize: "0.8rem" }}>
                  <option value="">Todos los condominios</option>
                  {condominios.map(c => (<option key={c.id} value={c.id}>{c.nombre}{!c.activo ? ' (inactivo)' : ''}</option>))}
                </select>
                <select value={`${adminSortField}-${adminSortOrder}`} onChange={(e) => { const [f, o] = e.target.value.split('-'); setAdminSortField(f); setAdminSortOrder(o) }}
                  style={{ ...estiloInput, width: "auto", minWidth: "160px", padding: "0.35rem 0.5rem", fontSize: "0.8rem" }}>
                  <option value="nombre-asc">Nombre A-Z</option>
                  <option value="nombre-desc">Nombre Z-A</option>
                  <option value="correo-asc">Correo A-Z</option>
                  <option value="correo-desc">Correo Z-A</option>
                </select>
                {(adminSearch || adminCondoFilter) && (
                  <button onClick={() => { setAdminSearch(''); setAdminCondoFilter('') }}
                    style={{ ...btnStyle, backgroundColor: "#f1f5f9", color: "#64748b", fontSize: "0.7rem" }}>
                    <FiX size={12} /> Limpiar filtros
                  </button>
                )}
              </div>
            </div>
            {adminFiltered.length === 0 ? (
              <div style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8", fontStyle: "italic", fontWeight: "600", minHeight: "320px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                No se encontraron coincidencias.
                {admins.length === 0 && <p>No hay administradores registrados.</p>}
              </div>
            ) : (
              <>
              <div className="global-table-wrap" style={{ overflowX: "auto", minHeight: "320px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ padding: "0.75rem 1rem", cursor: "pointer" }} onClick={() => toggleSort(adminSortField, setAdminSortField, setAdminSortOrder, adminSortOrder, 'nombre')}>
                        Nombre {getSortIcon('nombre', adminSortField, adminSortOrder)}
                      </th>
                      <th style={{ padding: "0.75rem 0.5rem", cursor: "pointer" }} onClick={() => toggleSort(adminSortField, setAdminSortField, setAdminSortOrder, adminSortOrder, 'correo')}>
                        Correo {getSortIcon('correo', adminSortField, adminSortOrder)}
                      </th>
                      <th style={{ padding: "0.75rem 0.5rem" }}>Teléfono</th>
                      <th style={{ padding: "0.75rem 0.5rem" }}>Condominio</th>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                    {paginatedAdmins.map((a, i) => (
                      <tr key={a.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                        <td style={{ padding: "0.75rem 1rem", fontWeight: "700", color: "#0f172a" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            {renderInitials(a.nombres, a.apellidos)}
                            <span>{a.nombres} {a.apellidos}</span>
                          </div>
                        </td>
                        <td style={{ padding: "0.75rem 0.5rem", color: "#64748b", fontSize: "0.8rem" }}>{a.correo}</td>
                        <td style={{ padding: "0.75rem 0.5rem", color: "#64748b", fontSize: "0.8rem" }}>{a.telefono || '—'}</td>
                        <td style={{ padding: "0.75rem 0.5rem", color: "#64748b", fontSize: "0.8rem" }}>
                          {a.nombreCondominio || <span style={{ fontStyle: "italic", color: "#cbd5e1" }}>Sin asignar</span>}
                        </td>
                        <td style={{ padding: "0.75rem 1rem", whiteSpace: "nowrap", textAlign: "right" }}>
                          <button style={{ ...btnStyle, backgroundColor: "rgba(124,58,237,0.1)", color: colorSuper, marginRight: "0.25rem" }}
                            onClick={() => { setAdminDetailItem(a); setAdminShowDetail(true) }} title="Ver detalle">
                            <FiEye size={14} />
                          </button>
                          <button style={{ ...btnStyle, backgroundColor: "rgba(245,158,11,0.15)", color: "#d97706", marginRight: "0.25rem" }}
                            onClick={() => { setAdminEditing(a); setAdminForm({ nombres: a.nombres, apellidos: a.apellidos, correo: a.correo, telefono: a.telefono || '', contrasena: '', idCondominio: a.idCondominio?.toString() || '' }); setAdminShowModal(true) }} title="Editar">
                            <FiEdit2 size={14} />
                          </button>
                          <button style={{ ...btnStyle, backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                            onClick={() => setAdminConfirmDelete(a)} title="Eliminar">
                            <FiTrash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination(adminPage, adminTotalPages, setAdminPage)}
              </>
            )}
          </div>

          {adminShowDetail && adminDetailItem && renderDetailModal(adminDetailItem, () => setAdminShowDetail(false), 'Detalle del Administrador')}

          <ConfirmModal
            open={!!adminConfirmDelete}
            title="Eliminar administrador"
            description={`¿Estás seguro de eliminar a "${adminConfirmDelete?.nombres} ${adminConfirmDelete?.apellidos}"? Esta acción no se puede deshacer.`}
            onConfirm={() => handleAdminDelete(adminConfirmDelete.id)}
            onCancel={() => setAdminConfirmDelete(null)}
            confirmLabel="Eliminar"
          />

          {adminShowModal && (
            <div style={modalOverlay} onClick={() => setAdminShowModal(false)}>
              <div style={{ ...modalContent, maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.05rem" }}>{adminEditing ? 'Editar' : 'Nuevo'} administrador</h3>
                  <button onClick={() => setAdminShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}><FiX size={20} /></button>
                </div>
                <form onSubmit={handleAdminSubmit}>
                  <div style={{ padding: "1.5rem" }}>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Nombres</label>
                      <input type="text" value={adminForm.nombres} onChange={(e) => setAdminForm({ ...adminForm, nombres: e.target.value })} required style={estiloInput} placeholder="Nombres del administrador" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Apellidos</label>
                      <input type="text" value={adminForm.apellidos} onChange={(e) => setAdminForm({ ...adminForm, apellidos: e.target.value })} required style={estiloInput} placeholder="Apellidos del administrador" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Correo</label>
                      <input type="email" value={adminForm.correo} onChange={(e) => setAdminForm({ ...adminForm, correo: e.target.value })} required readOnly={!!adminEditing}
                        style={{ ...estiloInput, backgroundColor: adminEditing ? "#f8f9fa" : "#fff", cursor: adminEditing ? "not-allowed" : "auto" }} placeholder="correo@ejemplo.com" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Teléfono</label>
                      <input type="text" value={adminForm.telefono} onChange={(e) => setAdminForm({ ...adminForm, telefono: e.target.value })} style={estiloInput} placeholder="Teléfono (opcional)" />
                    </div>
                    {!adminEditing && (
                      <div style={{ marginBottom: "0.85rem" }}>
                        <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Contraseña</label>
                        <input type="password" value={adminForm.contrasena} onChange={(e) => setAdminForm({ ...adminForm, contrasena: e.target.value })} required minLength={6} autoComplete="new-password" style={estiloInput} placeholder="Mínimo 6 caracteres" />
                      </div>
                    )}
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Asignar condominio</label>
                      <select value={adminForm.idCondominio} onChange={(e) => setAdminForm({ ...adminForm, idCondominio: e.target.value })} style={estiloInput}>
                        <option value="">Sin asignar</option>
                        {adminGetCondoOptions().map(c => (<option key={c.id} value={c.id} disabled={c.disabled}>{c.label}</option>))}
                      </select>
                      {adminEditing && adminForm.idCondominio && condominios.find(c => c.id === parseInt(adminForm.idCondominio, 10))?.activo === false && (
                        <small style={{ color: "#d97706", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.3rem", fontWeight: "600", fontSize: "0.7rem" }}>
                          <FiAlertTriangle size={12} /> Este condominio está inactivo
                        </small>
                      )}
                    </div>
                  </div>
                  <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                    <button type="button" onClick={() => setAdminShowModal(false)} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>Cancelar</button>
                    <button type="submit" disabled={adminSubmitting} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: adminSubmitting ? "#cbd5e1" : colorSuper, color: "#fff", fontWeight: "600", cursor: adminSubmitting ? "not-allowed" : "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      {adminSubmitting ? 'Guardando...' : <><FiCheck size={16} /> Guardar</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* ==================== TAB: AGENTES DE SEGURIDAD ==================== */}
      {tab === 'agentes' && (
        <>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "#1e293b" }}>
                  Agentes de Seguridad <span style={{ color: "#94a3b8", fontWeight: "600" }}>({agentFiltered.length})</span>
                </span>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  <button onClick={() => { setAgentCreateForm({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '' }); setAgentShowCreate(true) }}
                    style={{ backgroundColor: colorSuper, color: "#ffffff", border: "none", padding: "0.4rem 0.85rem", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <FiPlus size={14} /> Nuevo Agente
                  </button>
                  <div className="global-search-wrap" style={{ width: "220px", maxWidth: "220px", position: "relative" }}>
                    <FiSearch size={14} style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input type="text" placeholder="Buscar por nombre o correo..." value={agentSearch} onChange={(e) => setAgentSearch(e.target.value)}
                      style={{ ...estiloInput, paddingLeft: "2rem", paddingTop: "0.45rem", paddingBottom: "0.45rem", fontSize: "0.8rem" }} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                <select value={agentCondoFilter} onChange={(e) => setAgentCondoFilter(e.target.value)}
                  style={{ ...estiloInput, width: "auto", minWidth: "180px", padding: "0.35rem 0.5rem", fontSize: "0.8rem" }}>
                  <option value="">Todos los condominios</option>
                  {condominios.map(c => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
                </select>
                <select value={`${agentSortField}-${agentSortOrder}`} onChange={(e) => { const [f, o] = e.target.value.split('-'); setAgentSortField(f); setAgentSortOrder(o) }}
                  style={{ ...estiloInput, width: "auto", minWidth: "160px", padding: "0.35rem 0.5rem", fontSize: "0.8rem" }}>
                  <option value="nombre-asc">Nombre A-Z</option>
                  <option value="nombre-desc">Nombre Z-A</option>
                  <option value="correo-asc">Correo A-Z</option>
                  <option value="correo-desc">Correo Z-A</option>
                </select>
                {(agentSearch || agentCondoFilter) && (
                  <button onClick={() => { setAgentSearch(''); setAgentCondoFilter('') }}
                    style={{ ...btnStyle, backgroundColor: "#f1f5f9", color: "#64748b", fontSize: "0.7rem" }}>
                    <FiX size={12} /> Limpiar filtros
                  </button>
                )}
              </div>
            </div>
            {agentFiltered.length === 0 ? (
              <div style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8", fontStyle: "italic", fontWeight: "600", minHeight: "320px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                No se encontraron coincidencias.
                {agentUsers.length === 0 && <p>No hay agentes de seguridad registrados.</p>}
              </div>
            ) : (
              <>
              <div className="global-table-wrap" style={{ overflowX: "auto", minHeight: "320px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ padding: "0.75rem 1rem", cursor: "pointer" }} onClick={() => toggleSort(agentSortField, setAgentSortField, setAgentSortOrder, agentSortOrder, 'nombre')}>
                        Nombre {getSortIcon('nombre', agentSortField, agentSortOrder)}
                      </th>
                      <th style={{ padding: "0.75rem 0.5rem", cursor: "pointer" }} onClick={() => toggleSort(agentSortField, setAgentSortField, setAgentSortOrder, agentSortOrder, 'correo')}>
                        Correo {getSortIcon('correo', agentSortField, agentSortOrder)}
                      </th>
                      <th style={{ padding: "0.75rem 0.5rem" }}>Teléfono</th>
                      <th style={{ padding: "0.75rem 0.5rem" }}>Condominio</th>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                    {paginatedAgents.map((u, i) => (
                      <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                        <td style={{ padding: "0.75rem 1rem", fontWeight: "700", color: "#0f172a" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            {renderInitials(u.nombres, u.apellidos)}
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
                            onClick={() => { setAgentDetailItem(u); setAgentShowDetail(true) }} title="Ver detalle">
                            <FiEye size={14} />
                          </button>
                          <button style={{ ...btnStyle, backgroundColor: "rgba(245,158,11,0.15)", color: "#d97706", marginRight: "0.25rem" }}
                            onClick={() => { setAgentEditing(u); setAgentEditForm({ nombres: u.nombres, apellidos: u.apellidos, telefono: u.telefono || '', idCondominio: u.idCondominio?.toString() || '' }); setAgentShowEdit(true) }} title="Editar">
                            <FiEdit2 size={14} />
                          </button>
                          <button style={{ ...btnStyle, backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                            onClick={() => setAgentConfirmDelete(u)} title="Eliminar">
                            <FiTrash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination(agentPage, agentTotalPages, setAgentPage)}
              </>
            )}
          </div>

          {agentShowDetail && agentDetailItem && renderDetailModal(agentDetailItem, () => setAgentShowDetail(false), 'Detalle del Agente de Seguridad')}

          <ConfirmModal
            open={!!agentConfirmDelete}
            title="Eliminar agente"
            description={`¿Eliminar permanentemente a "${agentConfirmDelete?.nombres} ${agentConfirmDelete?.apellidos}"? Esta acción no se puede deshacer.`}
            onConfirm={() => handleAgentDelete(agentConfirmDelete)}
            onCancel={() => setAgentConfirmDelete(null)}
            confirmLabel="Eliminar"
            variant="danger"
          />

          {agentShowCreate && (
            <div style={modalOverlay} onClick={() => setAgentShowCreate(false)}>
              <div style={{ ...modalContent, maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.05rem" }}>Nuevo Agente de Seguridad</h3>
                  <button onClick={() => setAgentShowCreate(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}><FiX size={20} /></button>
                </div>
                <form onSubmit={handleAgentCreate}>
                  <div style={{ padding: "1.5rem" }}>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Nombres</label>
                      <input type="text" value={agentCreateForm.nombres} onChange={(e) => setAgentCreateForm({ ...agentCreateForm, nombres: e.target.value })} required style={estiloInput} placeholder="Nombres del agente" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Apellidos</label>
                      <input type="text" value={agentCreateForm.apellidos} onChange={(e) => setAgentCreateForm({ ...agentCreateForm, apellidos: e.target.value })} required style={estiloInput} placeholder="Apellidos del agente" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Correo</label>
                      <input type="email" value={agentCreateForm.correo} onChange={(e) => setAgentCreateForm({ ...agentCreateForm, correo: e.target.value })} required style={estiloInput} placeholder="correo@ejemplo.com" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Teléfono</label>
                      <input type="text" value={agentCreateForm.telefono} onChange={(e) => setAgentCreateForm({ ...agentCreateForm, telefono: e.target.value })} style={estiloInput} placeholder="Teléfono (opcional)" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Contraseña</label>
                      <input type="password" value={agentCreateForm.contrasena} onChange={(e) => setAgentCreateForm({ ...agentCreateForm, contrasena: e.target.value })} required minLength={6} autoComplete="new-password" style={estiloInput} placeholder="Mínimo 6 caracteres" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Condominio</label>
                      <select value={agentCreateForm.idCondominio} onChange={(e) => setAgentCreateForm({ ...agentCreateForm, idCondominio: e.target.value })} required style={estiloInput}>
                        <option value="">Seleccione un condominio</option>
                        {condominios.map(c => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
                      </select>
                    </div>
                  </div>
                  <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                    <button type="button" onClick={() => setAgentShowCreate(false)} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>Cancelar</button>
                    <button type="submit" disabled={agentSubmitting} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: agentSubmitting ? "#cbd5e1" : colorSuper, color: "#fff", fontWeight: "600", cursor: agentSubmitting ? "not-allowed" : "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      {agentSubmitting ? 'Creando...' : <><FiCheck size={16} /> Crear Agente</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {agentShowEdit && (
            <div style={modalOverlay} onClick={() => setAgentShowEdit(false)}>
              <div style={{ ...modalContent, maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.05rem" }}>Editar Agente de Seguridad</h3>
                  <button onClick={() => setAgentShowEdit(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}><FiX size={20} /></button>
                </div>
                <form onSubmit={handleAgentEdit}>
                  <div style={{ padding: "1.5rem" }}>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Nombres</label>
                      <input type="text" value={agentEditForm.nombres} onChange={(e) => setAgentEditForm({ ...agentEditForm, nombres: e.target.value })} required style={estiloInput} />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Apellidos</label>
                      <input type="text" value={agentEditForm.apellidos} onChange={(e) => setAgentEditForm({ ...agentEditForm, apellidos: e.target.value })} required style={estiloInput} />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Teléfono</label>
                      <input type="text" value={agentEditForm.telefono} onChange={(e) => setAgentEditForm({ ...agentEditForm, telefono: e.target.value })} style={estiloInput} />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Condominio</label>
                      <select value={agentEditForm.idCondominio} onChange={(e) => setAgentEditForm({ ...agentEditForm, idCondominio: e.target.value })} style={estiloInput}>
                        <option value="">Sin condominio</option>
                        {condominios.map(c => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
                      </select>
                    </div>
                  </div>
                  <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                    <button type="button" onClick={() => setAgentShowEdit(false)} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>Cancelar</button>
                    <button type="submit" disabled={agentSubmitting} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: agentSubmitting ? "#cbd5e1" : colorSuper, color: "#fff", fontWeight: "600", cursor: agentSubmitting ? "not-allowed" : "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      {agentSubmitting ? 'Guardando...' : <><FiCheck size={16} /> Guardar cambios</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}

      {/* ==================== TAB: PROPIETARIOS ==================== */}
      {tab === 'propietarios' && (
        <>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "#1e293b" }}>
                  Propietarios <span style={{ color: "#94a3b8", fontWeight: "600" }}>({ownerFiltered.length})</span>
                </span>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  <button onClick={() => { setOwnerCreateForm({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '' }); setOwnerShowCreate(true) }}
                    style={{ backgroundColor: colorSuper, color: "#ffffff", border: "none", padding: "0.4rem 0.85rem", borderRadius: "0.5rem", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <FiPlus size={14} /> Nuevo Propietario
                  </button>
                  <div className="global-search-wrap" style={{ width: "220px", maxWidth: "220px", position: "relative" }}>
                    <FiSearch size={14} style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                    <input type="text" placeholder="Buscar por nombre o correo..." value={ownerSearch} onChange={(e) => setOwnerSearch(e.target.value)}
                      style={{ ...estiloInput, paddingLeft: "2rem", paddingTop: "0.45rem", paddingBottom: "0.45rem", fontSize: "0.8rem" }} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                <select value={ownerCondoFilter} onChange={(e) => setOwnerCondoFilter(e.target.value)}
                  style={{ ...estiloInput, width: "auto", minWidth: "180px", padding: "0.35rem 0.5rem", fontSize: "0.8rem" }}>
                  <option value="">Todos los condominios</option>
                  {condominios.map(c => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
                </select>
                <select value={`${ownerSortField}-${ownerSortOrder}`} onChange={(e) => { const [f, o] = e.target.value.split('-'); setOwnerSortField(f); setOwnerSortOrder(o) }}
                  style={{ ...estiloInput, width: "auto", minWidth: "160px", padding: "0.35rem 0.5rem", fontSize: "0.8rem" }}>
                  <option value="nombre-asc">Nombre A-Z</option>
                  <option value="nombre-desc">Nombre Z-A</option>
                  <option value="correo-asc">Correo A-Z</option>
                  <option value="correo-desc">Correo Z-A</option>
                </select>
                {(ownerSearch || ownerCondoFilter) && (
                  <button onClick={() => { setOwnerSearch(''); setOwnerCondoFilter('') }}
                    style={{ ...btnStyle, backgroundColor: "#f1f5f9", color: "#64748b", fontSize: "0.7rem" }}>
                    <FiX size={12} /> Limpiar filtros
                  </button>
                )}
              </div>
            </div>
            {ownerFiltered.length === 0 ? (
              <div style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8", fontStyle: "italic", fontWeight: "600", minHeight: "320px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                No se encontraron coincidencias.
                {ownerUsers.length === 0 && <p>No hay propietarios registrados.</p>}
              </div>
            ) : (
              <>
              <div className="global-table-wrap" style={{ overflowX: "auto", minHeight: "320px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc", color: "#64748b", fontWeight: "700", fontSize: "11px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ padding: "0.75rem 1rem", cursor: "pointer" }} onClick={() => toggleSort(ownerSortField, setOwnerSortField, setOwnerSortOrder, ownerSortOrder, 'nombre')}>
                        Nombre {getSortIcon('nombre', ownerSortField, ownerSortOrder)}
                      </th>
                      <th style={{ padding: "0.75rem 0.5rem", cursor: "pointer" }} onClick={() => toggleSort(ownerSortField, setOwnerSortField, setOwnerSortOrder, ownerSortOrder, 'correo')}>
                        Correo {getSortIcon('correo', ownerSortField, ownerSortOrder)}
                      </th>
                      <th style={{ padding: "0.75rem 0.5rem" }}>Teléfono</th>
                      <th style={{ padding: "0.75rem 0.5rem" }}>Condominio</th>
                      <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "#334155", fontSize: "0.875rem" }}>
                    {paginatedOwners.map((u, i) => (
                      <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9", backgroundColor: i % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                        <td style={{ padding: "0.75rem 1rem", fontWeight: "700", color: "#0f172a" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            {renderInitials(u.nombres, u.apellidos)}
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
                            onClick={() => { setOwnerDetailItem(u); setOwnerShowDetail(true) }} title="Ver detalle">
                            <FiEye size={14} />
                          </button>
                          <button style={{ ...btnStyle, backgroundColor: "rgba(245,158,11,0.15)", color: "#d97706", marginRight: "0.25rem" }}
                            onClick={() => { setOwnerEditing(u); setOwnerEditForm({ nombres: u.nombres, apellidos: u.apellidos, telefono: u.telefono || '', idCondominio: u.idCondominio?.toString() || '' }); setOwnerShowEdit(true) }} title="Editar">
                            <FiEdit2 size={14} />
                          </button>
                          <button style={{ ...btnStyle, backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                            onClick={() => setOwnerConfirmDelete(u)} title="Eliminar">
                            <FiTrash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination(ownerPage, ownerTotalPages, setOwnerPage)}
              </>
            )}
          </div>

          {ownerShowDetail && ownerDetailItem && renderDetailModal(ownerDetailItem, () => setOwnerShowDetail(false), 'Detalle del Propietario')}

          <ConfirmModal
            open={!!ownerConfirmDelete}
            title="Eliminar propietario"
            description={`¿Eliminar permanentemente a "${ownerConfirmDelete?.nombres} ${ownerConfirmDelete?.apellidos}"? Esta acción no se puede deshacer.`}
            onConfirm={() => handleOwnerDelete(ownerConfirmDelete)}
            onCancel={() => setOwnerConfirmDelete(null)}
            confirmLabel="Eliminar"
            variant="danger"
          />

          {ownerShowCreate && (
            <div style={modalOverlay} onClick={() => setOwnerShowCreate(false)}>
              <div style={{ ...modalContent, maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.05rem" }}>Nuevo Propietario</h3>
                  <button onClick={() => setOwnerShowCreate(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}><FiX size={20} /></button>
                </div>
                <form onSubmit={handleOwnerCreate}>
                  <div style={{ padding: "1.5rem" }}>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Nombres</label>
                      <input type="text" value={ownerCreateForm.nombres} onChange={(e) => setOwnerCreateForm({ ...ownerCreateForm, nombres: e.target.value })} required style={estiloInput} placeholder="Nombres del propietario" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Apellidos</label>
                      <input type="text" value={ownerCreateForm.apellidos} onChange={(e) => setOwnerCreateForm({ ...ownerCreateForm, apellidos: e.target.value })} required style={estiloInput} placeholder="Apellidos del propietario" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Correo</label>
                      <input type="email" value={ownerCreateForm.correo} onChange={(e) => setOwnerCreateForm({ ...ownerCreateForm, correo: e.target.value })} required style={estiloInput} placeholder="correo@ejemplo.com" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Teléfono</label>
                      <input type="text" value={ownerCreateForm.telefono} onChange={(e) => setOwnerCreateForm({ ...ownerCreateForm, telefono: e.target.value })} style={estiloInput} placeholder="Teléfono (opcional)" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Contraseña</label>
                      <input type="password" value={ownerCreateForm.contrasena} onChange={(e) => setOwnerCreateForm({ ...ownerCreateForm, contrasena: e.target.value })} required minLength={6} autoComplete="new-password" style={estiloInput} placeholder="Mínimo 6 caracteres" />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Condominio</label>
                      <select value={ownerCreateForm.idCondominio} onChange={(e) => setOwnerCreateForm({ ...ownerCreateForm, idCondominio: e.target.value })} required style={estiloInput}>
                        <option value="">Seleccione un condominio</option>
                        {condominios.map(c => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
                      </select>
                    </div>
                  </div>
                  <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                    <button type="button" onClick={() => setOwnerShowCreate(false)} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>Cancelar</button>
                    <button type="submit" disabled={ownerSubmitting} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: ownerSubmitting ? "#cbd5e1" : colorSuper, color: "#fff", fontWeight: "600", cursor: ownerSubmitting ? "not-allowed" : "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      {ownerSubmitting ? 'Creando...' : <><FiCheck size={16} /> Crear Propietario</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {ownerShowEdit && (
            <div style={modalOverlay} onClick={() => setOwnerShowEdit(false)}>
              <div style={{ ...modalContent, maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ margin: 0, fontWeight: "800", color: "#0f172a", fontSize: "1.05rem" }}>Editar Propietario</h3>
                  <button onClick={() => setOwnerShowEdit(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "0.375rem", color: "#94a3b8", display: "flex" }}><FiX size={20} /></button>
                </div>
                <form onSubmit={handleOwnerEdit}>
                  <div style={{ padding: "1.5rem" }}>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Nombres</label>
                      <input type="text" value={ownerEditForm.nombres} onChange={(e) => setOwnerEditForm({ ...ownerEditForm, nombres: e.target.value })} required style={estiloInput} />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Apellidos</label>
                      <input type="text" value={ownerEditForm.apellidos} onChange={(e) => setOwnerEditForm({ ...ownerEditForm, apellidos: e.target.value })} required style={estiloInput} />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Teléfono</label>
                      <input type="text" value={ownerEditForm.telefono} onChange={(e) => setOwnerEditForm({ ...ownerEditForm, telefono: e.target.value })} style={estiloInput} />
                    </div>
                    <div style={{ marginBottom: "0.85rem" }}>
                      <label style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1e293b", marginBottom: "0.25rem", display: "block" }}>Condominio</label>
                      <select value={ownerEditForm.idCondominio} onChange={(e) => setOwnerEditForm({ ...ownerEditForm, idCondominio: e.target.value })} style={estiloInput}>
                        <option value="">Sin condominio</option>
                        {condominios.map(c => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
                      </select>
                    </div>
                  </div>
                  <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #f1f5f9", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                    <button type="button" onClick={() => setOwnerShowEdit(false)} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}>Cancelar</button>
                    <button type="submit" disabled={ownerSubmitting} style={{ padding: "0.5rem 1.25rem", borderRadius: "0.5rem", border: "none", backgroundColor: ownerSubmitting ? "#cbd5e1" : colorSuper, color: "#fff", fontWeight: "600", cursor: ownerSubmitting ? "not-allowed" : "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      {ownerSubmitting ? 'Guardando...' : <><FiCheck size={16} /> Guardar cambios</>}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
