import { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye, FiArrowUp, FiArrowDown, FiAlertTriangle } from 'react-icons/fi';
import {
    getAdministrators,
    createAdministrator,
    updateAdministrator,
    deleteAdministrator,
    patchAdministratorStatus,
    assignAdministratorCondo,
    getCondominiums,
} from '../../services/api';
import { Modal, Form, Button, Table, InputGroup, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import ConfirmModal from '../../components/common/ConfirmModal';


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
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortField, setSortField] = useState('nombre');


    // Detail modal
    const [detailItem, setDetailItem] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    // Confirm delete
    const [confirmDelete, setConfirmDelete] = useState(null);

    // Mapa de condominios ocupados
    const [occupiedCondos, setOccupiedCondos] = useState(new Set());


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


            // Construir set de condominios ocupados
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


    // Filtrar y ordenar
    const filteredAndSorted = useMemo(() => {
        let result = admins.filter(a => {
            const fullName = `${a.nombres || ''} ${a.apellidos || ''}`.toLowerCase();
            const email = (a.correo || '').toLowerCase();
            const search = searchTerm.toLowerCase();
            const matchSearch = fullName.includes(search) || email.includes(search);
            const matchCondo = condominioFilter ? a.idCondominio === parseInt(condominioFilter, 10) : true;
            const matchEstado = estadoFilter !== '' ? (estadoFilter === 'activo' ? a.activo : !a.activo) : true;
            return matchSearch && matchCondo && matchEstado;
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
            if (sortOrder === 'asc') {
                return valA > valB ? 1 : valA < valB ? -1 : 0;
            } else {
                return valA < valB ? 1 : valA > valB ? -1 : 0;
            }
        });
        return result;
    }, [admins, searchTerm, condominioFilter, estadoFilter, sortField, sortOrder]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editing) {
                const updatePayload = {
                    nombres: form.nombres.trim(),
                    apellidos: form.apellidos.trim(),
                    correo: form.correo.trim(),
                    telefono: form.telefono.trim(),
                };
                await updateAdministrator(editing.id, updatePayload);


                const newCondoId = form.idCondominio ? parseInt(form.idCondominio, 10) : null;
                const oldCondoId = editing.idCondominio ? parseInt(editing.idCondominio, 10) : null;


                if (newCondoId !== oldCondoId) {
                    if (newCondoId !== null) {
                        if (occupiedCondos.has(newCondoId)) {
                            toast.error('Este condominio ya tiene un administrador asignado. Solo puede tener uno.');
                            setSubmitting(false);
                            return;
                        }
                        const selectedCondo = condominios.find(c => c.id === newCondoId);
                        if (selectedCondo && !selectedCondo.activo) {
                            toast.error('No se puede asignar un condominio desactivado.');
                            setSubmitting(false);
                            return;
                        }
                        await assignAdministratorCondo(editing.id, newCondoId);
                        toast.success('Condominio asignado correctamente.');
                    } else {
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
                const createPayload = {
                    nombres: form.nombres.trim(),
                    apellidos: form.apellidos.trim(),
                    correo: form.correo.trim(),
                    telefono: form.telefono.trim(),
                    contrasena: form.contrasena.trim(),
                };
                await createAdministrator(createPayload);
                toast.success('Administrador creado correctamente.');
                if (form.idCondominio) {
                    toast.info('Condominio no asignado automáticamente. Edita el administrador para asignarlo.');
                }
            }
            setShowModal(false);
            setTimeout(() => loadAll(), 300);
        } catch (err) {
            console.error('Error en handleSubmit:', err);
            toast.error(`Error: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };


    const handleDelete = async (id) => {
        try {
            await deleteAdministrator(id);
            toast.success('Administrador eliminado.');
            setConfirmDelete(null);
            await loadAll();
        } catch (err) {
            toast.error(`Error al eliminar: ${err.message}`);
            setConfirmDelete(null);
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


    if (loading)
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Cargando administradores...</p>
            </div>
        );
    if (error)
        return (
            <div className="text-center text-danger py-5">
                <p><strong>Error:</strong> {error}</p>
                <Button variant="outline-primary" onClick={loadAll}>Reintentar</Button>
            </div>
        );


    const getCondoOptions = () => {
        const options = [];
        condominios.forEach(c => {
            const isOccupied = occupiedCondos.has(c.id);
            const isCurrentAdminCondo = editing && editing.idCondominio === c.id;
            if (!editing && isOccupied) return;
            const disabled = isOccupied && !isCurrentAdminCondo;
            options.push({
                id: c.id,
                nombre: c.nombre,
                activo: c.activo,
                disabled: disabled,
                label: disabled ? `${c.nombre} (ocupado)` : c.nombre,
            });
        });
        return options;
    };


    const condominioOptions = getCondoOptions();


    const getSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortOrder === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />;
    };


    const toggleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };


    return (
        <div style={{ padding: '1.5rem' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 style={{ fontWeight: 700, color: '#1e293b' }}>Administradores</h1>
                <Button variant="primary" onClick={() => {
                    setEditing(null);
                    setForm({ nombres: '', apellidos: '', correo: '', telefono: '', contrasena: '', idCondominio: '' });
                    setShowModal(true);
                }}>
                    <FiPlus className="me-2" /> Nuevo
                </Button>
            </div>


            {/* Filtros y orden */}
            <Row className="mb-4 g-2 align-items-end">
                <Col md={3}>
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
                <Col md={2}>
                    <Form.Label htmlFor="filterCondo" className="visually-hidden">Filtrar por condominio</Form.Label>
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
                <Col md={2}>
                    <Form.Label htmlFor="filterEstado" className="visually-hidden">Filtrar por estado</Form.Label>
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
                <Col md={2}>
                    <Form.Label htmlFor="sortOrder" className="visually-hidden">Ordenar por</Form.Label>
                    <Form.Select
                        id="sortOrder"
                        name="sortOrder"
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
                        <option value="estado-asc">Estado (Activo primero)</option>
                        <option value="estado-desc">Estado (Inactivo primero)</option>
                    </Form.Select>
                </Col>
                <Col md={3} className="text-end">
                    <Button variant="outline-secondary" onClick={() => {
                        setSearchTerm('');
                        setCondominioFilter('');
                        setEstadoFilter('');
                    }}>
                        Limpiar filtros
                    </Button>
                </Col>
            </Row>


            {filteredAndSorted.length === 0 ? (
                <div className="text-center py-4">
                    <p>No hay administradores que coincidan con los filtros.</p>
                    {admins.length === 0 && <p>No hay administradores registrados en el sistema.</p>}
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
                            {filteredAndSorted.map(a => (
                                <tr key={a.id}>
                                    <td><strong>{a.nombres} {a.apellidos}</strong></td>
                                    <td>{a.correo}</td>
                                    <td>{a.telefono}</td>
                                    <td>{a.nombreCondominio || <span className="text-muted">Sin asignar</span>}</td>
                                    <td>
                                        <ToggleSwitch
                                            checked={a.activo}
                                            onChange={() => handleToggleStatus(a.id, a.activo)}
                                        />
                                    </td>
                                    <td>
                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            className="me-1"
                                            onClick={() => { setDetailItem(a); setShowDetail(true); }}
                                            title="Ver detalle"
                                        >
                                            <FiEye />
                                        </Button>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="me-1"
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
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => setConfirmDelete(a)}
                                        >
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
                    <Modal.Title>Detalle del Administrador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {detailItem && (
                        <div>
                            <div className="mb-3">
                                <strong>ID:</strong> {detailItem.id}
                            </div>
                            <div className="mb-3">
                                <strong>Nombres:</strong> {detailItem.nombres} {detailItem.apellidos}
                            </div>
                            <div className="mb-3">
                                <strong>Correo:</strong> {detailItem.correo}
                            </div>
                            <div className="mb-3">
                                <strong>Teléfono:</strong> {detailItem.telefono || '-'}
                            </div>
                            <div className="mb-3">
                                <strong>Condominio:</strong> {detailItem.nombreCondominio || <span className="text-muted">Sin asignar</span>}
                            </div>
                            <div className="mb-3">
                                <strong>Estado:</strong>{' '}
                                <Badge bg={detailItem.activo ? 'success' : 'secondary'}>
                                    {detailItem.activo ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </div>
                            <div className="mb-3">
                                <strong>Fecha de creación:</strong>{' '}
                                {detailItem.fechaCreacion ? new Date(detailItem.fechaCreacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetail(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                open={!!confirmDelete}
                title="Eliminar administrador"
                description={`¿Estás seguro de eliminar a "${confirmDelete?.nombres} ${confirmDelete?.apellidos}"? Esta acción no se puede deshacer.`}
                onConfirm={() => handleDelete(confirmDelete.id)}
                onCancel={() => setConfirmDelete(null)}
                confirmLabel="Eliminar"
            />

            {/* Modal igual que antes */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="bg-light">
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
                            <small className="text-muted d-flex align-items-center gap-1">
                                {editing && form.idCondominio &&
                                    condominios.find(c => c.id === parseInt(form.idCondominio))?.activo === false && (
                                        <>
                                            <FiAlertTriangle className="text-warning" />
                                            Este condominio está inactivo
                                        </>
                                    )
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