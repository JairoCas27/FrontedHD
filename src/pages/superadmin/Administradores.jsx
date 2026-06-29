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
        idCondominio: '',
    });
    const [error, setError] = useState(null);

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

            console.log('Datos de administradores (raw):', adminsData);
            console.log('Datos de condominios (raw):', condosData);

            // Extraer lista de administradores
            let adminsList = adminsData?.items;
            if (!Array.isArray(adminsList)) {
                adminsList = adminsData?.content || adminsData?.data || [];
            }
            // Si aún no es array, intentar convertir
            if (!Array.isArray(adminsList)) {
                console.warn('La respuesta de administradores no es un array:', adminsData);
                adminsList = [];
            }

            // Extraer lista de condominios
            let condosList = condosData?.items;
            if (!Array.isArray(condosList)) {
                condosList = condosData?.content || condosData?.data || [];
            }
            if (!Array.isArray(condosList)) {
                condosList = [];
            }

            console.log('Administradores procesados:', adminsList);
            console.log('Condominios procesados:', condosList);

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

    // Filtrar administradores
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
        try {
            if (editing) {
                // Actualizar datos básicos
                await updateAdministrator(editing.id, {
                    nombres: form.nombres,
                    apellidos: form.apellidos,
                    correo: form.correo,
                    telefono: form.telefono,
                });
                // Asignar condominio si cambió
                if (form.idCondominio && form.idCondominio !== editing.idCondominio?.toString()) {
                    await assignAdministratorCondo(editing.id, form.idCondominio);
                }
            } else {
                // Crear nuevo
                await createAdministrator({
                    nombres: form.nombres,
                    apellidos: form.apellidos,
                    correo: form.correo,
                    telefono: form.telefono,
                    contrasena: form.contrasena,
                });
            }
            setShowModal(false);
            loadAll();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar administrador?')) return;
        try {
            await deleteAdministrator(id);
            loadAll();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleToggleStatus = async (id, activo) => {
        try {
            await patchAdministratorStatus(id, !activo);
            loadAll();
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

    // Preparar opciones de condominios para el select
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
                        <Button type="submit">Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}