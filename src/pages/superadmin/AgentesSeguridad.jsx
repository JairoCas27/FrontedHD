import { useState, useEffect, useMemo } from 'react';
import {
  FiSearch, FiLock, FiTrash2, FiEye, FiPlus,
  FiArrowUp, FiArrowDown,
} from 'react-icons/fi';
import {
  getAllUsers, patchUserStatus, forceUserPassword,
  getCondominiums, createUserWithRole,
} from '../../services/api';
import { Modal, Form, Button, Table, InputGroup, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import ConfirmModal from '../../components/common/ConfirmModal';

const ROL = 'AGENTE_SEGURIDAD';
const ROL_LABEL = 'Agente de Seguridad';

export default function AgentesSeguridad() {
  const [users, setUsers] = useState([]);
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', estado: '', condominio: '' });
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortField, setSortField] = useState('nombre');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [form, setForm] = useState({
    nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '',
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const extractItems = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.items && Array.isArray(data.items)) return data.items;
    if (data?.content && Array.isArray(data.content)) return data.content;
    if (data?.data && Array.isArray(data.data)) return data.data;
    return [];
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, condosData] = await Promise.all([
        getAllUsers(),
        getCondominiums(),
      ]);
      setUsers(extractItems(usersData));
      setCondominios(extractItems(condosData));
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error(`Error al cargar datos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const roleUsers = useMemo(
    () => users.filter(u => u.rol === ROL),
    [users]
  );

  const filteredAndSorted = useMemo(() => {
    let result = roleUsers.filter(u => {
      const fullName = `${u.nombres || ''} ${u.apellidos || ''}`.toLowerCase();
      const email = (u.correo || '').toLowerCase();
      const search = filters.search.toLowerCase();
      const matchSearch = fullName.includes(search) || email.includes(search);
      const matchEstado = filters.estado !== '' ? (filters.estado === 'activo' ? u.activo : !u.activo) : true;
      const matchCondo = filters.condominio ? u.idCondominio === parseInt(filters.condominio, 10) : true;
      return matchSearch && matchEstado && matchCondo;
    });
    result.sort((a, b) => {
      let valA, valB;
      if (sortField === 'nombre') {
        valA = `${a.nombres || ''} ${a.apellidos || ''}`.toLowerCase();
        valB = `${b.nombres || ''} ${b.apellidos || ''}`.toLowerCase();
      } else if (sortField === 'correo') {
        valA = (a.correo || '').toLowerCase();
        valB = (b.correo || '').toLowerCase();
      } else if (sortField === 'estado') {
        valA = a.activo ? 1 : 0;
        valB = b.activo ? 1 : 0;
      } else {
        return 0;
      }
      if (sortOrder === 'asc') return valA > valB ? 1 : valA < valB ? -1 : 0;
      return valA < valB ? 1 : valA > valB ? -1 : 0;
    });
    return result;
  }, [roleUsers, filters, sortField, sortOrder]);

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
      if (!selectedCondoId) {
        toast.error('Debes seleccionar un condominio.');
        setSubmitting(false);
        return;
      }
      const result = await createUserWithRole({
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim(),
        contrasena: form.contrasena.trim(),
        rol: ROL,
        idCondominio: selectedCondoId,
      });
      if (!result._condoAssigned) {
        toast.warning('No se pudo asignar condominio. El administrador del condominio debe asignarlo manualmente.');
      }
      toast.success(`${ROL_LABEL} creado correctamente.`);
      setShowModal(false);
      setForm({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '' });
      setTimeout(() => loadData(), 300);
    } catch (err) {
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

  const handleDelete = async (user) => {
    try {
      await patchUserStatus(user.id, false);
      toast.success('Agente desactivado.');
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
        <p className="mt-2">Cargando agentes de seguridad...</p>
      </div>
    );
  if (error)
    return (
      <div className="text-center text-danger py-5">
        <p><strong>Error:</strong> {error}</p>
        <Button variant="outline-primary" onClick={loadData}>Reintentar</Button>
      </div>
    );

  return (
    <div style={{ padding: '1.5rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontWeight: 700, color: '#1e293b' }}>Agentes de Seguridad</h1>
        <Button variant="primary" onClick={() => {
          setForm({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '' });
          setShowModal(true);
        }}>
          <FiPlus className="me-2" /> Nuevo Agente
        </Button>
      </div>

      <Row className="mb-4 g-2 align-items-end">
        <Col md={4}>
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
            value={filters.estado}
            onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </Form.Select>
        </Col>
        <Col md={2}>
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
        <Col md={2}>
          <Form.Select
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortField(field);
              setSortOrder(order);
            }}
          >
            <option value="nombre-asc">Nombre A-Z</option>
            <option value="nombre-desc">Nombre Z-A</option>
            <option value="correo-asc">Correo A-Z</option>
            <option value="correo-desc">Correo Z-A</option>
            <option value="estado-asc">Activos primero</option>
            <option value="estado-desc">Inactivos primero</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button variant="outline-secondary" onClick={() => setFilters({ search: '', estado: '', condominio: '' })}>
            Limpiar
          </Button>
        </Col>
      </Row>

      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-4">
          <p>No hay agentes que coincidan con los filtros.</p>
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
                  <td>{u.nombreCondominio || <span className="text-muted">Sin asignar</span>}</td>
                  <td>
                    <ToggleSwitch
                      checked={u.activo}
                      onChange={() => setConfirmAction({ type: 'status', user: u })}
                    />
                  </td>
                  <td>
                    <Button variant="outline-info" size="sm" className="me-1"
                      onClick={() => { setDetailItem(u); setShowDetail(true); }} title="Ver detalle">
                      <FiEye />
                    </Button>
                    <Button variant="outline-primary" size="sm" className="me-1"
                      onClick={() => { setSelectedUser(u); setShowPasswordModal(true); }} title="Forzar contraseña">
                      <FiLock />
                    </Button>
                    <Button variant="outline-danger" size="sm"
                      onClick={() => setConfirmAction({ type: 'delete', user: u })} title="Desactivar">
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
          <Modal.Title>Detalle del Agente de Seguridad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailItem && (
            <div>
              <div className="mb-3"><strong>ID:</strong> {detailItem.id}</div>
              <div className="mb-3"><strong>Nombres:</strong> {detailItem.nombres} {detailItem.apellidos}</div>
              <div className="mb-3"><strong>Correo:</strong> {detailItem.correo}</div>
              <div className="mb-3"><strong>Teléfono:</strong> {detailItem.telefono || '-'}</div>
              <div className="mb-3"><strong>Condominio:</strong> {detailItem.nombreCondominio || <span className="text-muted">Sin asignar</span>}</div>
              <div className="mb-3">
                <strong>Estado:</strong>{' '}
                <Badge bg={detailItem.activo ? 'success' : 'secondary'}>{detailItem.activo ? 'Activo' : 'Inactivo'}</Badge>
              </div>
              <div className="mb-3">
                <strong>Verificado:</strong>{' '}
                {detailItem.correoVerificado ? <Badge bg="success">Sí</Badge> : <Badge bg="warning">No</Badge>}
              </div>
              <div className="mb-3">
                <strong>Creado:</strong>{' '}
                {detailItem.fechaCreacion ? new Date(detailItem.fechaCreacion).toLocaleDateString('es-ES', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                }) : '-'}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetail(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        open={!!confirmAction}
        title={confirmAction?.type === 'status'
          ? `${confirmAction?.user?.activo ? 'Desactivar' : 'Activar'} agente`
          : 'Desactivar agente'}
        description={confirmAction?.type === 'status'
          ? `¿${confirmAction?.user?.activo ? 'Desactivar' : 'Activar'} a "${confirmAction?.user?.nombres} ${confirmAction?.user?.apellidos}"?`
          : `¿Desactivar a "${confirmAction?.user?.nombres} ${confirmAction?.user?.apellidos}"?`}
        onConfirm={() => {
          if (confirmAction?.type === 'status') {
            handleToggleStatus(confirmAction.user.id, confirmAction.user.activo);
          } else {
            handleDelete(confirmAction.user);
          }
        }}
        onCancel={() => setConfirmAction(null)}
        confirmLabel={confirmAction?.type === 'status'
          ? `${confirmAction?.user?.activo ? 'Desactivar' : 'Activar'}`
          : 'Desactivar'}
        variant="danger"
      />

      {/* Create Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Nuevo Agente de Seguridad</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombres</Form.Label>
              <Form.Control value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" value={form.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} required minLength={6} autoComplete="new-password" />
              <Form.Text className="text-muted">Mínimo 6 caracteres.</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Condominio <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={form.idCondominio}
                onChange={(e) => setForm({ ...form, idCondominio: e.target.value })}
                required
              >
                <option value="">Seleccione un condominio</option>
                {condominios.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creando...' : 'Crear Agente'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Forzar cambio de contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Usuario: <strong>{selectedUser?.nombres} {selectedUser?.apellidos}</strong></p>
          <Form.Group>
            <Form.Label>Nueva contraseña</Form.Label>
            <Form.Control
              type="text" value={newPassword}
              onChange={(e) => {
                const value = e.target.value;
                setNewPassword(value);
                setPasswordError(value && value.length < 6 ? 'Mínimo 6 caracteres.' : '');
              }}
              placeholder="Ingresa nueva contraseña"
              isInvalid={!!passwordError}
              minLength={6}
            />
            <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={() => handleForcePassword(selectedUser?.id)}
            disabled={!!passwordError || !newPassword || newPassword.length < 6}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
