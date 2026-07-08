import { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiLock, FiTrash2, FiEye, FiPlus, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import {
  getAllUsers,
  patchUserStatus,
  forceUserPassword,
  deleteUser,
  getCondominiums,
  getAdministrators,
  createAdministrator,
  assignAdministratorCondo,
} from '../../services/api';
import { Modal, Form, Button, Table, InputGroup, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function UsuariosGlobales() {
  const [users, setUsers] = useState([]);
  const [condominios, setCondominios] = useState([]);
  const [occupiedCondos, setOccupiedCondos] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    rol: '',
    estado: '',
    condominio: '',
  });
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortField, setSortField] = useState('nombre');
  const [showModal, setShowModal] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'status'|'delete', user }
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    contrasena: '',
    idCondominio: '',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, condosData, adminsData] = await Promise.all([
        getAllUsers(),
        getCondominiums(),
        getAdministrators(),
      ]);

      let usersList = [];
      if (Array.isArray(usersData)) {
        usersList = usersData;
      } else if (usersData?.items && Array.isArray(usersData.items)) {
        usersList = usersData.items;
      } else if (usersData?.content && Array.isArray(usersData.content)) {
        usersList = usersData.content;
      } else if (usersData?.data && Array.isArray(usersData.data)) {
        usersList = usersData.data;
      }

      let condosList = [];
      if (Array.isArray(condosData)) {
        condosList = condosData;
      } else if (condosData?.items && Array.isArray(condosData.items)) {
        condosList = condosData.items;
      } else if (condosData?.content && Array.isArray(condosData.content)) {
        condosList = condosData.content;
      } else if (condosData?.data && Array.isArray(condosData.data)) {
        condosList = condosData.data;
      }

      let adminsList = [];
      if (Array.isArray(adminsData)) {
        adminsList = adminsData;
      } else if (adminsData?.items && Array.isArray(adminsData.items)) {
        adminsList = adminsData.items;
      } else if (adminsData?.content && Array.isArray(adminsData.content)) {
        adminsList = adminsData.content;
      } else if (adminsData?.data && Array.isArray(adminsData.data)) {
        adminsList = adminsData.data;
      }

      setUsers(usersList);
      setCondominios(condosList);

      const occupied = new Set();
      adminsList.forEach(admin => {
        if (admin.activo && admin.idCondominio !== null && admin.idCondominio !== undefined) {
          occupied.add(admin.idCondominio);
        }
      });
      setOccupiedCondos(occupied);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setUsers([]);
      setCondominios([]);
      toast.error(`Error al cargar datos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = users.filter(u => {
      const fullName = `${u.nombres || ''} ${u.apellidos || ''}`.toLowerCase();
      const email = (u.correo || '').toLowerCase();
      const search = filters.search.toLowerCase();
      const matchSearch = fullName.includes(search) || email.includes(search);
      const matchRol = filters.rol ? u.rol === filters.rol : true;
      const matchEstado = filters.estado !== '' ? (filters.estado === 'activo' ? u.activo : !u.activo) : true;
      const matchCondo = filters.condominio ? u.idCondominio === parseInt(filters.condominio, 10) : true;
      return matchSearch && matchRol && matchEstado && matchCondo;
    });

    result.sort((a, b) => {
      let valA, valB;
      if (sortField === 'nombre') {
        valA = `${a.nombres || ''} ${a.apellidos || ''}`.toLowerCase();
        valB = `${b.nombres || ''} ${b.apellidos || ''}`.toLowerCase();
      } else if (sortField === 'correo') {
        valA = (a.correo || '').toLowerCase();
        valB = (b.correo || '').toLowerCase();
      } else if (sortField === 'rol') {
        valA = a.rol || '';
        valB = b.rol || '';
      } else if (sortField === 'estado') {
        valA = a.activo ? 1 : 0;
        valB = b.activo ? 1 : 0;
      } else {
        return 0;
      }
      if (sortOrder === 'asc') {
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0;
      }
    });
    return result;
  }, [users, filters, sortField, sortOrder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!form.contrasena || form.contrasena.trim().length < 6) {
        toast.warning('La contraseña debe tener al menos 6 caracteres.');
        setSubmitting(false);
        return;
      }

      const selectedCondoId = form.idCondominio ? parseInt(form.idCondominio, 10) : null;

      if (selectedCondoId && occupiedCondos.has(selectedCondoId)) {
        toast.error('Este condominio ya tiene un administrador asignado.');
        setSubmitting(false);
        return;
      }

      const created = await createAdministrator({
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim(),
        contrasena: form.contrasena.trim(),
      });

      if (selectedCondoId && created.id) {
        await assignAdministratorCondo(created.id, selectedCondoId);
      }

      toast.success('Administrador de condominio creado correctamente.');
      setShowModal(false);
      setForm({
        nombres: '', apellidos: '', correo: '', telefono: '',
        contrasena: '', idCondominio: '',
      });
      setTimeout(() => loadData(), 300);
    } catch (err) {
      console.error(err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (userId, activo) => {
    try {
      await patchUserStatus(userId, !activo);
      toast.success(`Usuario ${!activo ? 'activado' : 'desactivado'}.`);
      setConfirmAction(null);
      await loadData();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
      setConfirmAction(null);
    }
  };

  const handleForcePassword = async (userId) => {
    if (!newPassword || newPassword.trim() === '') {
      toast.warning('La contraseña no puede estar vacía');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    try {
      await forceUserPassword(userId, newPassword.trim());
      toast.success('Contraseña actualizada correctamente.');
      setShowPasswordModal(false);
      setNewPassword('');
      setPasswordError('');
      await loadData();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
      console.error('Error detallado:', err);
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      const isAdmin = user.rol === 'ADMINISTRADOR_CONDOMINIO';
      await deleteUser(user.id, user.rol);
      if (isAdmin) {
        toast.success('Administrador eliminado correctamente.');
      } else {
        toast.success('Usuario desactivado (eliminación lógica).');
      }
      setConfirmAction(null);
      await loadData();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
      setConfirmAction(null);
    }
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />;
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando usuarios...</p>
      </div>
    );
  if (error)
    return (
      <div className="text-center text-danger py-5">
        <p><strong>Error:</strong> {error}</p>
        <Button variant="outline-primary" onClick={loadData}>Reintentar</Button>
      </div>
    );

  const getCondoOptions = () => {
    return condominios.map(c => {
      const isOccupied = occupiedCondos.has(c.id);
      const disabled = isOccupied || !c.activo;
      let label = c.nombre;
      if (isOccupied) label += ' (ocupado)';
      else if (!c.activo) label += ' (inactivo)';
      return { id: c.id, nombre: c.nombre, label, disabled };
    });
  };

  const condominioOptions = getCondoOptions();

  return (
    <div style={{ padding: '1.5rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontWeight: 700, color: '#1e293b' }}>Usuarios del Sistema</h1>
        <Button variant="primary" onClick={() => {
          setForm({
            nombres: '',
            apellidos: '',
            correo: '',
            telefono: '',
            contrasena: '',
            idCondominio: '',
          });
          setShowModal(true);
        }}>
          <FiPlus className="me-2" /> Nuevo Administrador
        </Button>
      </div>

      <Row className="mb-4 g-2 align-items-end">
        <Col md={3}>
          <InputGroup>
            <InputGroup.Text><FiSearch /></InputGroup.Text>
            <Form.Control
              id="searchUser"
              name="searchUser"
              placeholder="Buscar por nombre o correo..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              aria-label="Buscar usuario"
            />
          </InputGroup>
        </Col>
        <Col md={2}>
          <Form.Label htmlFor="filterRol" className="visually-hidden">Filtrar por rol</Form.Label>
          <Form.Select
            id="filterRol"
            name="filterRol"
            value={filters.rol}
            onChange={(e) => setFilters({ ...filters, rol: e.target.value })}
            aria-label="Filtrar por rol"
          >
            <option value="">Todos los roles</option>
            <option value="ADMINISTRADOR_CONDOMINIO">Administrador</option>
            <option value="AGENTE_SEGURIDAD">Agente Seguridad</option>
            <option value="PROPIETARIO">Propietario</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Label htmlFor="filterEstado" className="visually-hidden">Filtrar por estado</Form.Label>
          <Form.Select
            id="filterEstado"
            name="filterEstado"
            value={filters.estado}
            onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
            aria-label="Filtrar por estado"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Label htmlFor="filterCondo" className="visually-hidden">Filtrar por condominio</Form.Label>
          <Form.Select
            id="filterCondo"
            name="filterCondo"
            value={filters.condominio}
            onChange={(e) => setFilters({ ...filters, condominio: e.target.value })}
            aria-label="Filtrar por condominio"
          >
            <option value="">Todos los condominios</option>
            {condominios.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre} {occupiedCondos.has(c.id) ? '(ocupado)' : ''}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3} className="text-end">
          <Button variant="outline-secondary" onClick={() => {
            setFilters({ search: '', rol: '', estado: '', condominio: '' });
          }}>
            Limpiar filtros
          </Button>
          <Form.Select
            className="mt-1"
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortField(field);
              setSortOrder(order);
            }}
            aria-label="Ordenar por"
          >
            <option value="nombre-asc">Nombre A-Z</option>
            <option value="nombre-desc">Nombre Z-A</option>
            <option value="correo-asc">Correo A-Z</option>
            <option value="correo-desc">Correo Z-A</option>
            <option value="rol-asc">Rol A-Z</option>
            <option value="rol-desc">Rol Z-A</option>
            <option value="estado-asc">Estado (Activo primero)</option>
            <option value="estado-desc">Estado (Inactivo primero)</option>
          </Form.Select>
        </Col>
      </Row>

      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-4">
          <p>No hay usuarios que coincidan con los filtros.</p>
          {users.length === 0 && <p>No hay usuarios registrados en el sistema.</p>}
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped hover bordered={false} className="shadow-sm rounded overflow-hidden">
            <thead className="bg-light">
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('nombre')}>
                  Nombre {getSortIcon('nombre')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('correo')}>
                  Correo {getSortIcon('correo')}
                </th>
                <th>Teléfono</th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('rol')}>
                  Rol {getSortIcon('rol')}
                </th>
                <th>Condominio</th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('estado')}>
                  Estado {getSortIcon('estado')}
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.nombres} {u.apellidos}</strong></td>
                  <td>{u.correo}</td>
                  <td>{u.telefono}</td>
                  <td><Badge bg="info">{u.rol}</Badge></td>
                  <td>{u.nombreCondominio || <span className="text-muted">Sin asignar</span>}</td>
                  <td>
                    <ToggleSwitch
                      checked={u.activo}
                      onChange={() => setConfirmAction({ type: 'status', user: u })}
                    />
                  </td>
                  <td>
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="me-1"
                      onClick={() => { setDetailItem(u); setShowDetail(true); }}
                      title="Ver detalle"
                    >
                      <FiEye />
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClick={() => {
                        setSelectedUser(u);
                        setShowPasswordModal(true);
                      }}
                      title="Forzar cambio de contraseña"
                    >
                      <FiLock />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => setConfirmAction({ type: 'delete', user: u })}
                      title="Eliminar usuario"
                    >
                      <FiTrash2 />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Detail Modal */}
      <Modal show={showDetail} onHide={() => setShowDetail(false)} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Detalle del Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailItem && (
            <div>
              <div className="mb-3">
                <strong>ID:</strong> {detailItem.id}
              </div>
              <div className="mb-3">
                <strong>Nombres:</strong> {detailItem.nombres} {detailItem.apellidos}
              </div>
              <div className="mb-3">
                <strong>Correo:</strong> {detailItem.correo}
              </div>
              <div className="mb-3">
                <strong>Teléfono:</strong> {detailItem.telefono || '-'}
              </div>
              <div className="mb-3">
                <strong>Rol:</strong>{' '}
                <Badge bg="info">{detailItem.rol}</Badge>
              </div>
              <div className="mb-3">
                <strong>Condominio:</strong> {detailItem.nombreCondominio || <span className="text-muted">Sin asignar</span>}
              </div>
              <div className="mb-3">
                <strong>Correo verificado:</strong>{' '}
                {detailItem.correoVerificado ? <Badge bg="success">Sí</Badge> : <Badge bg="warning">No</Badge>}
              </div>
              <div className="mb-3">
                <strong>Estado:</strong>{' '}
                <Badge bg={detailItem.activo ? 'success' : 'secondary'}>
                  {detailItem.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <div className="mb-3">
                <strong>Fecha de creación:</strong>{' '}
                {detailItem.fechaCreacion ? new Date(detailItem.fechaCreacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetail(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Action Modal */}
      <ConfirmModal
        open={!!confirmAction}
        title={confirmAction?.type === 'status'
          ? `${confirmAction?.user?.activo ? 'Desactivar' : 'Activar'} usuario`
          : 'Eliminar usuario'}
        description={confirmAction?.type === 'status'
          ? `¿Estás seguro de ${confirmAction?.user?.activo ? 'desactivar' : 'activar'} a "${confirmAction?.user?.nombres} ${confirmAction?.user?.apellidos}"?`
          : `¿Estás seguro de eliminar a "${confirmAction?.user?.nombres} ${confirmAction?.user?.apellidos}"?`}
        onConfirm={() => {
          if (confirmAction?.type === 'status') {
            handleToggleStatus(confirmAction.user.id, confirmAction.user.activo);
          } else if (confirmAction?.type === 'delete') {
            handleDeleteUser(confirmAction.user);
          }
        }}
        onCancel={() => setConfirmAction(null)}
        confirmLabel={confirmAction?.type === 'status'
          ? `${confirmAction?.user?.activo ? 'Desactivar' : 'Activar'}`
          : 'Eliminar'}
        variant="danger"
      />

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Nuevo Administrador de Condominio</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="alert alert-info py-2 px-3 mb-3 small">
              Solo puedes crear <strong>Administradores de Condominio</strong>. Los roles Propietario y Agente de Seguridad se crean desde el panel de cada condominio.
            </div>
            <input type="hidden" name="rol" value="ADMINISTRADOR_CONDOMINIO" />
            <Form.Group className="mb-3">
              <Form.Label htmlFor="userNombres">Nombres</Form.Label>
              <Form.Control
                id="userNombres"
                name="userNombres"
                value={form.nombres}
                onChange={(e) => setForm({ ...form, nombres: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="userApellidos">Apellidos</Form.Label>
              <Form.Control
                id="userApellidos"
                name="userApellidos"
                value={form.apellidos}
                onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="userCorreo">Correo</Form.Label>
              <Form.Control
                id="userCorreo"
                name="userCorreo"
                type="email"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="userTelefono">Teléfono</Form.Label>
              <Form.Control
                id="userTelefono"
                name="userTelefono"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="userPassword">Contraseña</Form.Label>
              <Form.Control
                id="userPassword"
                name="userPassword"
                type="password"
                value={form.contrasena}
                onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                required
                minLength="6"
              />
              <Form.Text className="text-muted">Mínimo 6 caracteres.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="userCondo">Asignar condominio</Form.Label>
              <Form.Select
                id="userCondo"
                name="userCondo"
                value={form.idCondominio}
                onChange={(e) => setForm({ ...form, idCondominio: e.target.value })}
              >
                <option value="">Sin asignar</option>
                {condominioOptions.map(c => (
                  <option key={c.id} value={c.id} disabled={c.disabled}>
                    {c.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creando...' : 'Crear Administrador'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Forzar cambio de contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Usuario: <strong>{selectedUser?.nombres} {selectedUser?.apellidos}</strong></p>
          <Form.Group>
            <Form.Label htmlFor="newPassword">Nueva contraseña</Form.Label>
            <Form.Control
              id="newPassword"
              name="newPassword"
              type="text"
              value={newPassword}
              onChange={(e) => {
                const value = e.target.value;
                setNewPassword(value);
                if (value && value.length < 6) {
                  setPasswordError('La contraseña debe tener al menos 6 caracteres.');
                } else {
                  setPasswordError('');
                }
              }}
              placeholder="Ingresa nueva contraseña"
              isInvalid={!!passwordError}
              minLength="6"
            />
            <Form.Control.Feedback type="invalid">
              {passwordError}
            </Form.Control.Feedback>
            <small className="text-muted">
              La contraseña debe tener al menos 6 caracteres.
            </small>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>Cancelar</Button>
          <Button
            variant="primary"
            onClick={() => handleForcePassword(selectedUser?.id)}
            disabled={!!passwordError || !newPassword || newPassword.length < 6}
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}