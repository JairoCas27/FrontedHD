import { useState, useEffect } from 'react';
import { FiSearch, FiLock, FiRefreshCw, FiX, FiCheck, FiPlus, FiEdit2 } from 'react-icons/fi';
import {
  getAllUsers,
  patchUserStatus,
  forceUserPassword,
  invalidateUserSession,
  getCondominiums,
  createUser,
  updateUser,
} from '../../services/api';
import { Modal, Form, Button, Table, Badge, InputGroup, Row, Col } from 'react-bootstrap';
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
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    contrasena: '',
    rol: 'PROPIETARIO',
    idCondominio: '',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Lista de roles permitidos
  const ROLES = [
    { value: 'SUPER_ADMINISTRADOR', label: 'Super Administrador' },
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

      console.log('Respuesta de usuarios (raw):', usersData);
      console.log('Respuesta de condominios (raw):', condosData);

      // Extraer lista de usuarios
      let usersList = [];
      if (Array.isArray(usersData)) {
        usersList = usersData;
      } else if (usersData?.items && Array.isArray(usersData.items)) {
        usersList = usersData.items;
      } else if (usersData?.content && Array.isArray(usersData.content)) {
        usersList = usersData.content;
      } else if (usersData?.data && Array.isArray(usersData.data)) {
        usersList = usersData.data;
      } else {
        console.warn('Formato inesperado de usuarios:', usersData);
      }

      // Extraer condominios
      let condosList = [];
      if (Array.isArray(condosData)) {
        condosList = condosData;
      } else if (condosData?.items && Array.isArray(condosData.items)) {
        condosList = condosData.items;
      } else if (condosData?.content && Array.isArray(condosData.content)) {
        condosList = condosData.content;
      } else if (condosData?.data && Array.isArray(condosData.data)) {
        condosList = condosData.data;
      } else {
        console.warn('Formato inesperado de condominios:', condosData);
      }

      console.log('Usuarios procesados:', usersList);
      console.log('Condominios procesados:', condosList);

      setUsers(usersList);
      setCondominios(condosList);
    } catch (err) {
      console.error('Error en loadData:', err);
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

  // Filtrar usuarios
  const filtered = users.filter(u => {
    const fullName = `${u.nombres || ''} ${u.apellidos || ''}`.toLowerCase();
    const email = (u.correo || '').toLowerCase();
    const search = filters.search.toLowerCase();
    const matchSearch = fullName.includes(search) || email.includes(search);
    const matchRol = filters.rol ? u.rol === filters.rol : true;
    const matchEstado = filters.estado !== '' ? (filters.estado === 'activo' ? u.activo : !u.activo) : true;
    const matchCondo = filters.condominio ? u.idCondominio === parseInt(filters.condominio, 10) : true;
    return matchSearch && matchRol && matchEstado && matchCondo;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingUser) {
        // Actualizar usuario
        const updatePayload = {
          nombres: form.nombres.trim(),
          apellidos: form.apellidos.trim(),
          correo: form.correo.trim(),
          telefono: form.telefono.trim(),
          rol: form.rol,
          condominioId: form.idCondominio ? parseInt(form.idCondominio, 10) : null,
        };
        console.log('Payload update:', updatePayload);
        await updateUser(editingUser.id, updatePayload);
        toast.success('Usuario actualizado correctamente.');
      } else {
        // Crear usuario
        const createPayload = {
          nombres: form.nombres.trim(),
          apellidos: form.apellidos.trim(),
          correo: form.correo.trim(),
          telefono: form.telefono.trim(),
          contrasena: form.contrasena.trim(),
          rol: form.rol,
          condominioId: form.idCondominio ? parseInt(form.idCondominio, 10) : null,
        };
        console.log('Payload create:', createPayload);
        await createUser(createPayload);
        toast.success('Usuario creado correctamente.');
      }
      setShowModal(false);
      setTimeout(() => loadData(), 300);
    } catch (err) {
      console.error('Error en handleSubmit:', err);
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
    if (!newPassword) {
      toast.warning('Ingresa una contraseña');
      return;
    }
    try {
      await forceUserPassword(userId, newPassword);
      toast.success('Contraseña actualizada');
      setShowPasswordModal(false);
      setNewPassword('');
      await loadData();
    } catch (err) {
      toast.error(`Error: ${err.message}`);
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

  if (loading) return <div className="text-center py-5">Cargando usuarios...</div>;
  if (error) return (
    <div className="text-center text-danger py-5">
      <p><strong>Error:</strong> {error}</p>
      <Button variant="outline-primary" onClick={loadData}>Reintentar</Button>
    </div>
  );

  // Opciones para condominios
  const condominioOptions = condominios.map(c => ({
    id: c.id,
    nombre: c.nombre,
  }));

  return (
    <div style={{ padding: '1.5rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontWeight: 800, color: '#3b82f6' }}>Usuarios del Sistema</h1>
        <Button
          onClick={() => {
            setEditingUser(null);
            setForm({
              nombres: '',
              apellidos: '',
              correo: '',
              telefono: '',
              contrasena: '',
              rol: 'PROPIETARIO',
              idCondominio: '',
            });
            setShowModal(true);
          }}
        >
          <FiPlus className="me-2" /> Nuevo Usuario
        </Button>
      </div>

      {/* Filtros con accesibilidad */}
      <Row className="mb-4 g-2">
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
        <Col md={3}>
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
        <Col md={2} className="text-end">
          <Button variant="outline-secondary" onClick={() => {
            setFilters({ search: '', rol: '', estado: '', condominio: '' });
          }}>
            Limpiar filtros
          </Button>
        </Col>
      </Row>

      {filtered.length === 0 ? (
        <div className="text-center py-4">
          <p>No hay usuarios que coincidan con los filtros.</p>
          {users.length === 0 && <p>No hay usuarios registrados en el sistema.</p>}
          {users.length > 0 && (
            <Button variant="outline-secondary" onClick={() => {
              setFilters({ search: '', rol: '', estado: '', condominio: '' });
            }}>
              Limpiar filtros
            </Button>
          )}
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Condominio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>{u.nombres} {u.apellidos}</td>
                <td>{u.correo}</td>
                <td>{u.telefono}</td>
                <td><Badge bg="info">{u.rol}</Badge></td>
                <td>{u.nombreCondominio || 'Sin asignar'}</td>
                <td>
                  <Badge bg={u.activo ? 'success' : 'secondary'}>
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
      )}

      {/* Modal de creación/edición */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
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
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label htmlFor="userRol">Rol</Form.Label>
              <Form.Select
                id="userRol"
                name="userRol"
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
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
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
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
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ingresa nueva contraseña"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={() => handleForcePassword(selectedUser?.id)}>Guardar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}