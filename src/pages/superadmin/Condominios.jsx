import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import {
  getCondominiums,
  createCondominium,
  updateCondominium,
  deleteCondominium,
  patchCondominiumStatus,
} from '../../services/api';
import { Modal, Form, Button, Table, Badge } from 'react-bootstrap';

export default function Condominios() {
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: '', direccion: '', ciudad: '', paisId: 1 });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCondominiums();
      // Asegurar que data sea un array
      setCondominios(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar condominios');
      setCondominios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateCondominium(editing.id, form);
      } else {
        await createCondominium(form);
      }
      setShowModal(false);
      load();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar condominio?')) return;
    try {
      await deleteCondominium(id);
      load();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleToggleStatus = async (id, activo) => {
    try {
      await patchCondominiumStatus(id, !activo);
      load();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div className="text-center py-5">Cargando condominios...</div>;
  if (error) return <div className="text-center py-5 text-danger">Error: {error}</div>;

  return (
    <div style={{ padding: '1.5rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontWeight: 800, color: '#3b82f6' }}>Condominios</h1>
        <Button
          variant="primary"
          onClick={() => {
            setEditing(null);
            setForm({ nombre: '', direccion: '', ciudad: '', paisId: 1 });
            setShowModal(true);
          }}
        >
          <FiPlus className="me-2" /> Nuevo
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Ciudad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {condominios.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No hay condominios registrados
              </td>
            </tr>
          ) : (
            condominios.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nombre}</td>
                <td>{c.direccion}</td>
                <td>{c.ciudad}</td>
                <td>
                  <Badge bg={c.activo ? 'success' : 'secondary'}>
                    {c.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => {
                      setEditing(c);
                      setForm(c);
                      setShowModal(true);
                    }}
                  >
                    <FiEdit2 />
                  </Button>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleToggleStatus(c.id, c.activo)}
                  >
                    {c.activo ? <FiXCircle /> : <FiCheckCircle />}
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(c.id)}
                  >
                    <FiTrash2 />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Editar' : 'Nuevo'} condominio</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ciudad</Form.Label>
              <Form.Control
                value={form.ciudad}
                onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}