import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import {
    getAdministrators,
    createAdministrator,
    updateAdministrator,
    deleteAdministrator,
    patchAdministratorStatus,
    assignAdministratorCondo,
    getAvailableAdministrators,
    getUnassignedCondominiums,
} from '../../services/api';
import { Modal, Form, Button, Table, Badge } from 'react-bootstrap';

export default function Administradores() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [availableAdmins, setAvailableAdmins] = useState([]);
    const [unassignedCondos, setUnassignedCondos] = useState([]);
    const [form, setForm] = useState({
        nombres: '',
        apellidos: '',
        correo: '',
        telefono: '',
        contrasena: '',
        condominioId: '',
    });

    const loadAll = async () => {
        setLoading(true);
        setError(null);
        try {
            const [adminsData, avail, unassigned] = await Promise.all([
                getAdministrators(),
                getAvailableAdministrators().catch(() => []),
                getUnassignedCondominiums().catch(() => []),
            ]);
            setAdmins(Array.isArray(adminsData) ? adminsData : []);
            setAvailableAdmins(Array.isArray(avail) ? avail : []);
            setUnassignedCondos(Array.isArray(unassigned) ? unassigned : []);
        } catch (err) {
            setError(err.message || 'Error al cargar administradores');
            setAdmins([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await updateAdministrator(editing.id, form);
                if (form.condominioId) {
                    await assignAdministratorCondo(editing.id, form.condominioId);
                }
            } else {
                await createAdministrator(form);
            }
            setShowModal(false);
            loadAll();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar administrador?')) return;
        try {
            await deleteAdministrator(id);
            loadAll();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleToggleStatus = async (id, activo) => {
        try {
            await patchAdministratorStatus(id, !activo);
            loadAll();
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) return <div className="text-center py-5">Cargando administradores...</div>;
    if (error) return <div className="text-center py-5 text-danger">Error: {error}</div>;

    return (
        <div style={{ padding: '1.5rem' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 style={{ fontWeight: 800, color: '#3b82f6' }}>Administradores</h1>
                <Button
                    variant="primary"
                    onClick={() => {
                        setEditing(null);
                        setForm({
                            nombres: '',
                            apellidos: '',
                            correo: '',
                            telefono: '',
                            contrasena: '',
                            condominioId: '',
                        });
                        setShowModal(true);
                    }}
                >
                    <FiPlus className="me-2" /> Nuevo
                </Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Condominio</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center text-muted">
                                No hay administradores registrados
                            </td>
                        </tr>
                    ) : (
                        admins.map((a) => (
                            <tr key={a.id}>
                                <td>
                                    {a.nombres} {a.apellidos}
                                </td>
                                <td>{a.correo}</td>
                                <td>{a.telefono}</td>
                                <td>{a.condominio?.nombre || 'Sin asignar'}</td>
                                <td>
                                    <Badge bg={a.activo ? 'success' : 'secondary'}>
                                        {a.activo ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </td>
                                <td>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => {
                                            setEditing(a);
                                            setForm({ ...a, contrasena: '' });
                                            setShowModal(true);
                                        }}
                                    >
                                        <FiEdit2 />
                                    </Button>
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleToggleStatus(a.id, a.activo)}
                                    >
                                        {a.activo ? <FiXCircle /> : <FiCheckCircle />}
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDelete(a.id)}
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
                    <Modal.Title>{editing ? 'Editar' : 'Nuevo'} administrador</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombres</Form.Label>
                            <Form.Control
                                value={form.nombres}
                                onChange={(e) => setForm({ ...form, nombres: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Apellidos</Form.Label>
                            <Form.Control
                                value={form.apellidos}
                                onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control
                                type="email"
                                value={form.correo}
                                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                value={form.telefono}
                                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                            />
                        </Form.Group>
                        {!editing && (
                            <Form.Group className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={form.contrasena}
                                    onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                                    required={!editing}
                                />
                            </Form.Group>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Asignar condominio</Form.Label>
                            <Form.Select
                                value={form.condominioId || ''}
                                onChange={(e) => setForm({ ...form, condominioId: e.target.value })}
                            >
                                <option value="">Sin asignar</option>
                                {unassignedCondos.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </Form.Select>
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