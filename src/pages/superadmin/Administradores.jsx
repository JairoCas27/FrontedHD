import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiSearch } from 'react-icons/fi';
import {
    getAdministrators,
    createAdministrator,
    updateAdministrator,
    deleteAdministrator,
    patchAdministratorStatus,
    assignAdministratorCondo,
    getCondominiums,
} from '../../services/api';
import { Modal, Form, Button, Table, Badge, InputGroup, Row, Col } from 'react-bootstrap';

export default function Administradores() {
    const [admins, setAdmins] = useState([]);
    const [condominios, setCondominios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        nombres: '',
        apellidos: '',
        correo: '',
        telefono: '',
        contrasena: '',
        idCondominio: '', // string vacío para "Sin asignar"
    });
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [condominioFilter, setCondominioFilter] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');

    const loadAll = async () => {
        setLoading(true);
        setError(null);
        try {
            const [adminsData, condosData] = await Promise.all([
                getAdministrators(),
                getCondominiums(),
            ]);

            let adminsList = [];
            if (Array.isArray(adminsData)) {
                adminsList = adminsData;
            } else if (adminsData?.items && Array.isArray(adminsData.items)) {
                adminsList = adminsData.items;
            } else if (adminsData?.content && Array.isArray(adminsData.content)) {
                adminsList = adminsData.content;
            } else if (adminsData?.data && Array.isArray(adminsData.data)) {
                adminsList = adminsData.data;
            } else {
                console.warn('Formato inesperado de administradores:', adminsData);
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
            } else {
                console.warn('Formato inesperado de condominios:', condosData);
            }

            setAdmins(adminsList);
            setCondominios(condosList);
        } catch (err) {
            console.error('Error en loadAll:', err);
            setError(err.message);
            setAdmins([]);
            setCondominios([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, []);

    const filtered = admins.filter(a => {
        const fullName = `${a.nombres || ''} ${a.apellidos || ''}`.toLowerCase();
        const email = (a.correo || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        const matchSearch = fullName.includes(search) || email.includes(search);
        const matchCondo = condominioFilter ? a.idCondominio === parseInt(condominioFilter, 10) : true;
        const matchEstado = estadoFilter !== '' ? (estadoFilter === 'activo' ? a.activo : !a.activo) : true;
        return matchSearch && matchCondo && matchEstado;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editing) {
                // 1. Actualizar datos básicos
                const updatePayload = {
                    nombres: form.nombres.trim(),
                    apellidos: form.apellidos.trim(),
                    correo: form.correo.trim(),
                    telefono: form.telefono.trim(),
                };
                console.log('Actualizando administrador:', editing.id, updatePayload);
                await updateAdministrator(editing.id, updatePayload);

                // 2. Gestionar asignación de condominio
                // Convertir idCondominio: string vacío -> null, else número
                const newCondoId = form.idCondominio === '' ? null : parseInt(form.idCondominio, 10);
                const oldCondoId = editing.idCondominio !== undefined && editing.idCondominio !== null
                    ? parseInt(editing.idCondominio, 10)
                    : null;
                console.log(`Condo: nuevo=${newCondoId}, anterior=${oldCondoId}`);

                // Si el condominio cambió
                if (newCondoId !== oldCondoId) {
                    if (newCondoId !== null) {
                        // Asignar condominio
                        console.log(`Asignando condominio ID ${newCondoId} al admin ${editing.id}`);
                        try {
                            await assignAdministratorCondo(editing.id, newCondoId);
                            console.log('Asignación exitosa.');
                        } catch (assignErr) {
                            console.error('Error en asignación:', assignErr);
                            // Si falla, intentar con el nombre de campo alternativo usando fetch directo
                            const token = localStorage.getItem('token');
                            const response = await fetch(
                                `https://sgc-backend-vfvl.onrender.com/api/super-admin/administrators/${editing.id}/assign-condo`,
                                {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({ idCondominio: newCondoId }),
                                }
                            );
                            if (!response.ok) {
                                const errorData = await response.json().catch(() => ({}));
                                throw new Error(`Falló asignación: ${response.status} - ${JSON.stringify(errorData)}`);
                            }
                            console.log('Asignación exitosa con idCondominio.');
                        }
                    } else {
                        // Desasignar (seleccionó "Sin asignar")
                        console.warn('Intento desasignar condominio (asignando null)');
                        try {
                            // Intentar asignar null (puede que el backend no lo permita)
                            await assignAdministratorCondo(editing.id, null);
                        } catch (err) {
                            console.warn('No se puede desasignar, el backend probablemente no lo permite.', err);
                            alert('No se puede desasignar el condominio. Solo se puede cambiar a otro.');
                        }
                    }
                } else {
                    console.log('No hay cambio en el condominio.');
                }
            } else {
                // Creación: no se asigna condominio en la creación, se puede editar después
                const createPayload = {
                    nombres: form.nombres.trim(),
                    apellidos: form.apellidos.trim(),
                    correo: form.correo.trim(),
                    telefono: form.telefono.trim(),
                    contrasena: form.contrasena.trim(),
                };
                console.log('Creando administrador:', createPayload);
                await createAdministrator(createPayload);
                // Si se seleccionó un condominio, no podemos asignarlo porque no tenemos el ID del nuevo admin
                // Mejor hacemos una recarga para que el usuario lo asigne manualmente
            }

            setShowModal(false);
            // Recargar lista después de un breve retraso
            setTimeout(() => {
                loadAll();
            }, 500);
        } catch (err) {
            console.error('Error en handleSubmit:', err);
            alert(`Error: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar administrador?')) return;
        try {
            await deleteAdministrator(id);
            await loadAll();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleToggleStatus = async (id, activo) => {
        try {
            await patchAdministratorStatus(id, !activo);
            await loadAll();
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="text-center py-5">Cargando administradores...</div>;
    if (error) return (
        <div className="text-center text-danger py-5">
            <p><strong>Error:</strong> {error}</p>
            <Button variant="outline-primary" onClick={loadAll}>Reintentar</Button>
        </div>
    );

    const condominioOptions = condominios.map(c => ({
        id: c.id,
        nombre: c.nombre,
    }));

    return (
        <div style={{ padding: '1.5rem' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 style={{ fontWeight: 800, color: '#3b82f6' }}>Administradores</h1>
                <Button
                    onClick={() => {
                        setEditing(null);
                        setForm({
                            nombres: '',
                            apellidos: '',
                            correo: '',
                            telefono: '',
                            contrasena: '',
                            idCondominio: '',
                        });
                        setShowModal(true);
                    }}
                >
                    <FiPlus className="me-2" /> Nuevo
                </Button>
            </div>

            {/* Filtros */}
            <Row className="mb-4 g-2">
                <Col md={4}>
                    <InputGroup>
                        <InputGroup.Text><FiSearch /></InputGroup.Text>
                        <Form.Control
                            id="searchAdmin"
                            name="searchAdmin"
                            placeholder="Buscar por nombre o correo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={3}>
                    <Form.Select
                        id="filterCondo"
                        name="filterCondo"
                        value={condominioFilter}
                        onChange={(e) => setCondominioFilter(e.target.value)}
                    >
                        <option value="">Todos los condominios</option>
                        {condominioOptions.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Select
                        id="filterEstado"
                        name="filterEstado"
                        value={estadoFilter}
                        onChange={(e) => setEstadoFilter(e.target.value)}
                    >
                        <option value="">Todos los estados</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </Form.Select>
                </Col>
            </Row>

            {filtered.length === 0 ? (
                <div className="text-center py-4">
                    <p>No hay administradores que coincidan con los filtros.</p>
                    {admins.length === 0 && <p>No hay administradores registrados en el sistema.</p>}
                    {admins.length > 0 && (
                        <Button variant="outline-secondary" onClick={() => {
                            setSearchTerm('');
                            setCondominioFilter('');
                            setEstadoFilter('');
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
                            <th>Condominio</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(a => (
                            <tr key={a.id}>
                                <td>{a.nombres} {a.apellidos}</td>
                                <td>{a.correo}</td>
                                <td>{a.telefono}</td>
                                <td>{a.nombreCondominio || 'Sin asignar'}</td>
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
                                            setForm({
                                                nombres: a.nombres,
                                                apellidos: a.apellidos,
                                                correo: a.correo,
                                                telefono: a.telefono || '',
                                                contrasena: '',
                                                idCondominio: a.idCondominio?.toString() || '',
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
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Editar' : 'Nuevo'} administrador</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="adminNombres">Nombres</Form.Label>
                            <Form.Control
                                id="adminNombres"
                                name="adminNombres"
                                value={form.nombres}
                                onChange={(e) => setForm({ ...form, nombres: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="adminApellidos">Apellidos</Form.Label>
                            <Form.Control
                                id="adminApellidos"
                                name="adminApellidos"
                                value={form.apellidos}
                                onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="adminCorreo">Correo</Form.Label>
                            <Form.Control
                                id="adminCorreo"
                                name="adminCorreo"
                                type="email"
                                value={form.correo}
                                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="adminTelefono">Teléfono</Form.Label>
                            <Form.Control
                                id="adminTelefono"
                                name="adminTelefono"
                                value={form.telefono}
                                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                            />
                        </Form.Group>
                        {!editing && (
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="adminPassword">Contraseña</Form.Label>
                                <Form.Control
                                    id="adminPassword"
                                    name="adminPassword"
                                    type="password"
                                    value={form.contrasena}
                                    onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                                    required={!editing}
                                />
                            </Form.Group>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="adminCondo">Asignar condominio</Form.Label>
                            <Form.Select
                                id="adminCondo"
                                name="adminCondo"
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
        </div>
    );
}