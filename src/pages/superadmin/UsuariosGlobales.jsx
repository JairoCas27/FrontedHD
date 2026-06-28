import { useState, useEffect } from 'react';
import { FiSearch, FiLock, FiRefreshCw, FiX, FiCheck } from 'react-icons/fi';
import {
  getAllUsers,
  patchUserStatus,
  forceUserPassword,
  invalidateUserSession,
} from '../../services/api';
import { Table, Badge, Button, Modal, Form, InputGroup } from 'react-bootstrap';

export default function UsuariosGlobales() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const data = await getAllUsers();
      const list = Array.isArray(data) ? data : data?.content || data?.data || [];
      setUsers(list);
      setError(null);
    } catch (error) {
      console.error(error);
      setError('Error al cargar usuarios');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleToggleStatus = async (userId, activo) => {
    if (!window.confirm(`¿${activo ? 'Desactivar' : 'Activar'} usuario?`)) return;
    try {
      await patchUserStatus(userId, !activo);
      load();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleForcePassword = async (userId) => {
    if (!newPassword) return alert('Ingresa una contraseña');
    try {
      await forceUserPassword(userId, newPassword);
      alert('Contraseña actualizada');
      setShowPasswordModal(false);
      setNewPassword('');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleInvalidate = async (userId) => {
    if (!window.confirm('¿Invalidar sesión de este usuario?')) return;
    try {
      await invalidateUserSession(userId);
      alert('Sesión invalidada');
      load();
    } catch (error) {
      alert(error.message);
    }
  };

  const filtered = users.filter(u =>
    u.nombres?.toLowerCase().includes(filter.toLowerCase()) ||
    u.correo?.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div className="text-center py-5">Cargando usuarios...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1 className="mb-4" style={{ fontWeight: 800, color: '#3b82f6' }}>Usuarios del Sistema</h1>

      <InputGroup className="mb-4">
        <InputGroup.Text><FiSearch /></InputGroup.Text>
        <Form.Control
          placeholder="Filtrar por nombre o correo..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </InputGroup>

      {filtered.length === 0 ? (
        <p>No hay usuarios que coincidan con el filtro.</p>
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
            {filtered.map((u) => (
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
                  <Button variant="outline-warning" size="sm" className="me-2"
                    onClick={() => handleToggleStatus(u.id, u.activo)}>
                    {u.activo ? <FiX /> : <FiCheck />}
                  </Button>
                  <Button variant="outline-primary" size="sm" className="me-2"
                    onClick={() => { setSelectedUser(u); setShowPasswordModal(true); }}>
                    <FiLock />
                  </Button>
                  <Button variant="outline-danger" size="sm"
                    onClick={() => handleInvalidate(u.id)}>
                    <FiRefreshCw />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Forzar cambio de contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Usuario: <strong>{selectedUser?.nombres} {selectedUser?.apellidos}</strong></p>
          <Form.Group>
            <Form.Label>Nueva contraseña</Form.Label>
            <Form.Control
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