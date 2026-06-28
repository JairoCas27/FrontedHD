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
    condominioId: '',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, condosData] = await Promise.all([
        getAllUsers(),
        getCondominiums(),
      ]);
      let usersList = usersData;
      if (!Array.isArray(usersList)) usersList = usersData?.content || usersData?.data || [];
      let condosList = condosData;
      if (!Array.isArray(condosList)) condosList = condosData?.content || condosData?.data || [];
      setUsers(usersList);
      setCondominios(condosList);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setUsers([]);
      setCondominios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = users.filter(u => {
    const fullName = `${u.nombres} ${u.apellidos}`.toLowerCase();
    const matchSearch = fullName.includes(filters.search.toLowerCase()) ||
      u.correo.toLowerCase().includes(filters.search.toLowerCase());
    const matchRol = filters.rol ? u.rol === filters.rol : true;
    const matchEstado = filters.estado !== '' ? (filters.estado === 'activo' ? u.activo : !u.activo) : true;
    const matchCondo = filters.condominio ? u.condominio?.id === parseInt(filters.condominio) : true;
    return matchSearch && matchRol && matchEstado && matchCondo;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombres: form.nombres,
        apellidos: form.apellidos,
        correo: form.correo,
        telefono: form.telefono,
        rol: form.rol,
        condominioId: form.condominioId || null,
      };
      if (editingUser) {
        await updateUser(editingUser.id, payload);
      } else {
        await createUser({ ...payload, contrasena: form.contrasena });
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (userId, activo) => {
    if (!window.confirm(`¿${activo ? 'Desactivar' : 'Activar'} usuario?`)) return;
    try {
      await patchUserStatus(userId, !activo);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleForcePassword = async (userId) => {
    if (!newPassword) return alert('Ingresa una contraseña');
    try {
      await forceUserPassword(userId, newPassword);
      alert('Contraseña actualizada');
      setShowPasswordModal(false);
      setNewPassword('');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleInvalidate = async (userId) => {
    if (!window.confirm('¿Invalidar sesión de este usuario?')) return;
    try {
      await invalidateUserSession(userId);
      alert('Sesión invalidada');
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center py-5">Cargando usuarios...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

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
              condominioId: '',
            });
            setShowModal(true);
          }}
        >
          <FiPlus className="me-2" /> Nuevo Usuario
        </Button>
      </div>

      {/* Filtros */}
      <Row className="mb-4 g-2">
        <Col md={3}>
          <InputGroup>
            <InputGroup.Text><FiSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Buscar por nombre o correo..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </InputGroup>
        </Col>
        <Col md={2}>
          <Form.Select
            value={filters.rol}
            onChange={(e) => setFilters({ ...filters, rol: e.target.value })}
          >
            <option value="">Todos los roles</option>
            <option value="ADMINISTRADOR_CONDOMINIO">Administrador</option>
            <option value="AGENTE_SEGURIDAD">Seguridad</option>
            <option value="PROPIETARIO">Propietario</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select
            value={filters.estado}
            onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filters.condominio}
            onChange={(e) => setFilters({ ...filters, condominio: e.target.value })}
          >
            <option value="">Todos los condominios</option>
            {condominios.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {filtered.length === 0 ? (
        <p>No hay usuarios que coincidan con los filtros.</p>
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
                <td>{u.condominio?.nombre || '-'}</td>
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
                        condominioId: u.condominio?.id?.toString() || '',
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
                <option value="PROPIETARIO">Propietario</option>
                <option value="ADMINISTRADOR_CONDOMINIO">Administrador de condominio</option>
                <option value="AGENTE_SEGURIDAD">Agente de seguridad</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="userCondo">Condominio</Form.Label>
              <Form.Select
                id="userCondo"
                name="userCondo"
                value={form.condominioId}
                onChange={(e) => setForm({ ...form, condominioId: e.target.value })}
              >
                <option value="">Sin asignar</option>
                {condominios.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
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