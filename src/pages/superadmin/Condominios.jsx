import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiSearch } from 'react-icons/fi';
import {
  getCondominiums,
  createCondominium,
  updateCondominium,
  deleteCondominium,
  patchCondominiumStatus,
  getCountries,
  getCities,
} from '../../services/api';
import { Modal, Form, Button, Table, Badge, InputGroup, Row, Col } from 'react-bootstrap';

export default function Condominios() {
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    paisId: '',
    ciudadId: '',
  });
  const [error, setError] = useState(null);
  const [errorDetail, setErrorDetail] = useState('');

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [ciudadFilter, setCiudadFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');

  // Catálogos
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);

  // Cargar condominios y catálogos
  const load = async () => {
    setLoading(true);
    setError(null);
    setErrorDetail('');
    try {
      const data = await getCondominiums();
      let list = data;
      if (!Array.isArray(list)) list = data?.content || data?.data || data?.items || [];
      setCondominios(list);
    } catch (err) {
      console.error('Error al cargar condominios:', err);
      setError(err.message || 'Error al cargar condominios');
      // Mostrar más detalle si existe
      if (err.response) {
        setErrorDetail(JSON.stringify(err.response));
      }
      setCondominios([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCatalogs = async () => {
    setLoadingCatalogs(true);
    try {
      const paisesData = await getCountries();
      setPaises(paisesData);
      if (paisesData.length > 0) {
        const firstCountry = paisesData[0].id;
        const citiesData = await getCities(firstCountry);
        setCiudades(citiesData);
        if (!form.paisId) {
          setForm(prev => ({ ...prev, paisId: firstCountry }));
        }
      }
    } catch (err) {
      console.error('Error cargando catálogos:', err);
    } finally {
      setLoadingCatalogs(false);
    }
  };

  useEffect(() => {
    load();
    loadCatalogs();
  }, []);

  // Obtener lista de ciudades únicas para el filtro
  const uniqueCities = [...new Set(condominios.map(c => c.ciudad?.nombre).filter(Boolean))];

  // Filtrar condominios
  const filtered = condominios.filter(c => {
    const matchNombre = c.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCiudad = ciudadFilter ? c.ciudad?.nombre === ciudadFilter : true;
    const matchEstado = estadoFilter !== '' ? (estadoFilter === 'activo' ? c.activo : !c.activo) : true;
    return matchNombre && matchCiudad && matchEstado;
  });

  // Manejar cambio de país para cargar ciudades
  const handlePaisChange = async (paisId) => {
    setForm({ ...form, paisId, ciudadId: '' });
    if (paisId) {
      try {
        const cities = await getCities(paisId);
        setCiudades(cities);
      } catch (err) {
        console.error('Error cargando ciudades:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: form.nombre,
        direccion: form.direccion,
        paisId: parseInt(form.paisId, 10),
        ciudadId: parseInt(form.ciudadId, 10),
      };
      if (editing) {
        await updateCondominium(editing.id, payload);
      } else {
        await createCondominium(payload);
      }
      setShowModal(false);
      load();
    } catch (err) {
      alert(err.message || 'Error al guardar');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar condominio?')) return;
    try {
      await deleteCondominium(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (id, activo) => {
    try {
      await patchCondominiumStatus(id, !activo);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center py-5">Cargando condominios...</div>;
  if (error) return (
    <div className="text-center text-danger py-5">
      <p><strong>Error:</strong> {error}</p>
      {errorDetail && <pre className="small bg-light p-2 rounded">{errorDetail}</pre>}
      <Button variant="outline-primary" onClick={load}>Reintentar</Button>
    </div>
  );

  return (
    <div style={{ padding: '1.5rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontWeight: 800, color: '#3b82f6' }}>Condominios</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setForm({
              nombre: '',
              direccion: '',
              paisId: paises.length > 0 ? paises[0].id : '',
              ciudadId: '',
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
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={ciudadFilter}
            onChange={(e) => setCiudadFilter(e.target.value)}
          >
            <option value="">Todas las ciudades</option>
            {uniqueCities.map(ciudad => (
              <option key={ciudad} value={ciudad}>{ciudad}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
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
        <p>No hay condominios que coincidan con los filtros.</p>
      ) : (
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
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nombre}</td>
                <td>{c.direccion}</td>
                <td>{c.ciudad?.nombre || '-'}</td>
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
                      setForm({
                        nombre: c.nombre,
                        direccion: c.direccion || '',
                        paisId: c.paisId || (paises.length > 0 ? paises[0].id : ''),
                        ciudadId: c.ciudadId || '',
                      });
                      if (c.paisId) {
                        getCities(c.paisId).then(cities => setCiudades(cities)).catch(console.error);
                      }
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
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Editar' : 'Nuevo'} condominio</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="condNombre">Nombre</Form.Label>
              <Form.Control
                id="condNombre"
                name="condNombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="condDireccion">Dirección</Form.Label>
              <Form.Control
                id="condDireccion"
                name="condDireccion"
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="condPais">País</Form.Label>
              <Form.Select
                id="condPais"
                name="condPais"
                value={form.paisId}
                onChange={(e) => handlePaisChange(e.target.value)}
                disabled={loadingCatalogs}
              >
                {paises.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="condCiudad">Ciudad</Form.Label>
              <Form.Select
                id="condCiudad"
                name="condCiudad"
                value={form.ciudadId}
                onChange={(e) => setForm({ ...form, ciudadId: e.target.value })}
                required
                disabled={!form.paisId || loadingCatalogs}
              >
                <option value="">Seleccione ciudad</option>
                {ciudades.map(c => (
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