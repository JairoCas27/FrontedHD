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
import { toast } from 'react-toastify';

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
    const [submitting, setSubmitting] = useState(false);

    // Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [condominioFilter, setCondominioFilter] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');

    // Mapa de condominios ocupados (con administrador activo)
    const [occupiedCondos, setOccupiedCondos] = useState(new Set());

    const loadAll = async () => {
        setLoading(true);
        setError(null);
        try {
            const [adminsData, condosData] = await Promise.all([
                getAdministrators(),
                getCondominiums(),
            ]);

            // Extraer administradores
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
            }

            // Construir set de condominios ocupados (solo administradores activos)
            const occupied = new Set();
            adminsList.forEach(admin => {
                if (admin.activo && admin.idCondominio !== null && admin.idCondominio !== undefined) {
                    occupied.add(admin.idCondominio);
                }
            });
            setOccupiedCondos(occupied);

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
                await updateAdministrator(editing.id, updatePayload);

                // 2. Gestionar asignación de condominio
                const newCondoId = form.idCondominio ? parseInt(form.idCondominio, 10) : null;
                const oldCondoId = editing.idCondominio ? parseInt(editing.idCondominio, 10) : null;

                if (newCondoId !== oldCondoId) {
                    if (newCondoId !== null) {
                        // Verificar si el condominio ya está ocupado por otro administrador
                        if (occupiedCondos.has(newCondoId)) {
                            toast.error('Este condominio ya tiene un administrador asignado. Solo puede tener uno.');
                            setSubmitting(false);
                            return;
                        }
                        // Verificar si el condominio está activo (opcional, el backend lo valida)
                        const selectedCondo = condominios.find(c => c.id === newCondoId);
                        if (selectedCondo && !selectedCondo.activo) {
                            toast.error('No se puede asignar un condominio desactivado.');
                            setSubmitting(false);
                            return;
                        }
                        // Asignar
                        await assignAdministratorCondo(editing.id, newCondoId);
                        toast.success('Condominio asignado correctamente.');
                    } else {
                        // Desasignar (si el backend lo permite)
                        try {
                            await assignAdministratorCondo(editing.id, null);
                            toast.info('Administrador desasignado del condominio.');
                        } catch (err) {
                            if (err.message.includes('no puede ser null')) {
                                toast.warning('El backend no permite desasignar. Solo se puede cambiar a otro condominio.');
                            } else {
                                toast.error(`Error al desasignar: ${err.message}`);
                            }
                            setSubmitting(false);
                            return;
                        }
                    }
                }
            } else {
                // Creación
                const createPayload = {
                    nombres: form.nombres.trim(),
                    apellidos: form.apellidos.trim(),
                    correo: form.correo.trim(),
                    telefono: form.telefono.trim(),
                    contrasena: form.contrasena.trim(),
                };
                await createAdministrator(createPayload);
                toast.success('Administrador creado correctamente.');
                // Si se seleccionó un condominio, asignarlo después de crear
                if (form.idCondominio) {
                    // No tenemos el ID del nuevo admin, se puede hacer manualmente o
                    // recargar la lista y el usuario asigna después.
                    toast.info('Condominio no asignado automáticamente. Edita el administrador para asignarlo.');
                }
            }
            setShowModal(false);
            // Recargar con retraso para dar tiempo al backend
            setTimeout(() => loadAll(), 300);
        } catch (err) {
            console.error('Error en handleSubmit:', err);
            toast.error(`Error: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar administrador?')) return;
        try {
            await deleteAdministrator(id);
            toast.success('Administrador eliminado.');
            await loadAll();
        } catch (err) {
            toast.error(`Error al eliminar: ${err.message}`);
        }
    };

    const handleToggleStatus = async (id, activo) => {
        try {
            await patchAdministratorStatus(id, !activo);
            toast.success(`Administrador ${!activo ? 'activado' : 'desactivado'}.`);
            await loadAll();
        } catch (err) {
            toast.error(`Error al cambiar estado: ${err.message}`);
        }
    };

    if (loading) return <div className="text-center py-5">Cargando administradores...</div>;
    if (error) return (
        <div className="text-center text-danger py-5">
            <p><strong>Error:</strong> {error}</p>
            <Button variant="outline-primary" onClick={loadAll}>Reintentar</Button>
        </div>
    );

    // Construir opciones de condominios para el dropdown
    const getCondoOptions = () => {
        const options = [];
        condominios.forEach(c => {
            // Si el condominio está ocupado y NO estamos editando al administrador que lo tiene,
            // no lo mostramos.
            const isOccupied = occupiedCondos.has(c.id);
            const isCurrentAdminCondo = editing && editing.idCondominio === c.id;
            // Para creación, mostramos solo los no ocupados
            if (!editing && isOccupied) return;
            // Para edición, mostramos todos, pero marcamos los ocupados como deshabilitados
            const disabled = isOccupied && !isCurrentAdminCondo;
            options.push({
                id: c.id,
                nombre: c.nombre,
                activo: c.activo,
                disabled: disabled,
                // Mostrar etiqueta si está ocupado y no es el actual
                label: disabled ? `${c.nombre} (ocupado)` : c.nombre,
            });
        });
        return options;
    };

    const condominioOptions = getCondoOptions();

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
                            aria-label="Buscar administrador"
                        />
                    </InputGroup>
                </Col>
                <Col md={3}>
                    <Form.Label htmlFor="filterCondo" srOnly>Filtrar por condominio</Form.Label>
                    <Form.Select
                        id="filterCondo"
                        name="filterCondo"
                        value={condominioFilter}
                        onChange={(e) => setCondominioFilter(e.target.value)}
                        aria-label="Filtrar por condominio"
                    >
                        <option value="">Todos los condominios</option>
                        {condominios.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.nombre} {!c.activo ? '(inactivo)' : ''}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Label htmlFor="filterEstado" srOnly>Filtrar por estado</Form.Label>
                    <Form.Select
                        id="filterEstado"
                        name="filterEstado"
                        value={estadoFilter}
                        onChange={(e) => setEstadoFilter(e.target.value)}
                        aria-label="Filtrar por estado"
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
                                    <option key={c.id} value={c.id} disabled={c.disabled}>
                                        {c.label}
                                    </option>
                                ))}
                            </Form.Select>
                            <small className="text-muted">
                                {editing && form.idCondominio &&
                                    condominios.find(c => c.id === parseInt(form.idCondominio))?.activo === false &&
                                    ' ⚠️ Este condominio está inactivo'
                                }
                            </small>
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