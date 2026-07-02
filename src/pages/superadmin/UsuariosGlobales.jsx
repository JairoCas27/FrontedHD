import { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiLock, FiRefreshCw, FiX, FiCheck, FiPlus, FiEdit2, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import {
  getAllUsers,
  patchUserStatus,
  forceUserPassword,
  invalidateUserSession,
  getCondominiums,
  createAdminUser,   // <-- Cambio: usar createAdminUser
  updateAdminUser,   // <-- Cambio: usar updateAdminUser
} from '../../services/api';
import { Modal, Form, Button, Table, Badge, InputGroup, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function UsuariosGlobales() {
  const [users, setUsers] = useState([]);
  const [condominios, setCondominios] = useState([]);
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
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    contrasena: '',
    rol: 'ADMINISTRADOR_CONDOMINIO',
    idCondominio: '',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const ROLES = [
    { value: 'ADMINISTRADOR_CONDOMINIO', label: 'Administrador de Condominio' },
    { value: 'AGENTE_SEGURIDAD', label: 'Agente de Seguridad' },
    { value: 'PROPIETARIO', label: 'Propietario' },
  ];

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, condosData] = await Promise.all([
        getAllUsers(),
        getCondominiums(),
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

      setUsers(usersList);
      setCondominios(condosList);
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
      const payload = {
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim(),
        rol: form.rol,
        condominioId: form.idCondominio ? parseInt(form.idCondominio, 10) : null,
      };

      if (editingUser) {
        // Editar usuario existente
        await updateAdminUser(editingUser.id, payload); // <-- Cambio
        toast.success('Usuario actualizado correctamente.');
      } else {
        // Crear nuevo usuario (requiere contraseña)
        if (!form.contrasena || form.contrasena.trim().length < 6) {
          toast.warning('La contraseña debe tener al menos 6 caracteres.');
          setSubmitting(false);
          return;
        }
        payload.contrasena = form.contrasena.trim();
        await createAdminUser(payload); // <-- Cambio
        toast.success('Usuario creado correctamente.');
      }
      setShowModal(false);
      setTimeout(() => loadData(), 300);
    } catch (err) {
      console.error(err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (userId, activo) => {
    if (!window.confirm(`¿${activo ? 'Desactivar' : 'Activar'} usuario?`)) return;
    try {
      await patchUserStatus(userId, !activo);
      toast.success(`Usuario ${!activo ? 'activado' : 'desactivado'}.`);
      await loadData();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
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

  const handleInvalidate = async (userId) => {
    if (!window.confirm('¿Invalidar sesión de este usuario?')) return;
    try {
      await invalidateUserSession(userId);
      toast.success('Sesión invalidada');
      await loadData();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
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

  const condominioOptions = condominios.map(c => ({
    id: c.id,
    nombre: c.nombre,
  }));

  return (
    <div style={{ padding: '1.5rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontWeight: 700, color: '#1e293b' }}>Usuarios del Sistema</h1>
        <Button variant="primary" onClick={() => {
          setEditingUser(null);
          setForm({
            nombres: '',
            apellidos: '',
            correo: '',
            telefono: '',
            contrasena: '',
            rol: 'ADMINISTRADOR_CONDOMINIO',
            idCondominio: '',
          });
          setShowModal(true);
        }}>
          <FiPlus className="me-2" /> Nuevo Usuario
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
          <Form.Label htmlFor="filterRol" srOnly>Filtrar por rol</Form.Label>
          <Form.Select
            id="filterRol"
            name="filterRol"
            value={filters.rol}
            onChange={(e) => setFilters({ ...filters, rol: e.target.value })}
            aria-label="Filtrar por rol"
          >
            <option value="">Todos los roles</option>
            {ROLES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Label htmlFor="filterEstado" srOnly>Filtrar por estado</Form.Label>
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
          <Form.Label htmlFor="filterCondo" srOnly>Filtrar por condominio</Form.Label>
          <Form.Select
            id="filterCondo"
            name="filterCondo"
            value={filters.condominio}
            onChange={(e) => setFilters({ ...filters, condominio: e.target.value })}
            aria-label="Filtrar por condominio"
          >
            <option value="">Todos los condominios</option>
            {condominioOptions.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
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
                    <Badge bg={u.activo ? 'success' : 'secondary'} pill>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setEditingUser(u);
                        setForm({
                          nombres: u.nombres,
                          apellidos: u.apellidos,
                          correo: u.correo,
                          telefono: u.telefono || '',
                          contrasena: '',
                          rol: u.rol,
                          idCondominio: u.idCondominio?.toString() || '',
                        });
                        setShowModal(true);
                      }}
                    >
                      <FiEdit2 />
                    </Button>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleToggleStatus(u.id, u.activo)}
                    >
                      {u.activo ? <FiX /> : <FiCheck />}
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setSelectedUser(u);
                        setShowPasswordModal(true);
                      }}
                    >
                      <FiLock />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleInvalidate(u.id)}
                    >
                      <FiRefreshCw />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal de creación/edición */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>{editingUser ? 'Editar' : 'Nuevo'} usuario</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
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
            {!editingUser && (
              <Form.Group className="mb-3">
                <Form.Label htmlFor="userPassword">Contraseña</Form.Label>
                <Form.Control
                  id="userPassword"
                  name="userPassword"
                  type="password"
                  value={form.contrasena}
                  onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                  required={!editingUser}
                  minLength="6"
                />
                <Form.Text className="text-muted">Mínimo 6 caracteres.</Form.Text>
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label htmlFor="userRol">Rol</Form.Label>
              <Form.Select
                id="userRol"
                name="userRol"
                value={form.rol}
                onChange={(e) => {
                  const newRol = e.target.value;
                  setForm({ ...form, rol: newRol });
                }}
              >
                {ROLES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="userCondo">Condominio</Form.Label>
              <Form.Select
                id="userCondo"
                name="userCondo"
                value={form.idCondominio}
                onChange={(e) => setForm({ ...form, idCondominio: e.target.value })}
              >
                <option value="">Sin asignar</option>
                {condominioOptions.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal para forzar contraseña */}
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