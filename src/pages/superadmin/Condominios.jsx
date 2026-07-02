import { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiSearch, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import {
  getCondominiums,
  createCondominium,
  updateCondominium,
  deleteCondominium,
  patchCondominiumStatus,
  getCountries,
  getCities,
} from '../../services/api';
import { Modal, Form, Button, Table, InputGroup, Row, Col, Spinner } from 'react-bootstrap';

export default function Condominios() {
  const [condominios, setCondominios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    idPais: '',
    idCiudad: '',
  });
  const [error, setError] = useState(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [ciudadFilter, setCiudadFilter] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortField, setSortField] = useState('nombre');

  // Catálogos
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCondominiums();
      let list = data?.items || data?.content || data?.data || [];
      if (!Array.isArray(list)) list = [];
      setCondominios(list);
    } catch (err) {
      console.error(err);
      setError(err.message);
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
        if (!form.idPais) {
          setForm(prev => ({ ...prev, idPais: firstCountry }));
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

  const uniqueCities = [...new Set(condominios.map(c => c.nombreCiudad).filter(Boolean))];

  const filteredAndSorted = useMemo(() => {
    let result = condominios.filter(c => {
      const matchNombre = c.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCiudad = ciudadFilter ? c.nombreCiudad === ciudadFilter : true;
      const matchEstado = estadoFilter !== '' ? (estadoFilter === 'activo' ? c.activo : !c.activo) : true;
      return matchNombre && matchCiudad && matchEstado;
    });

    result.sort((a, b) => {
      let valA, valB;
      if (sortField === 'nombre') {
        valA = a.nombre.toLowerCase();
        valB = b.nombre.toLowerCase();
      } else if (sortField === 'ciudad') {
        valA = (a.nombreCiudad || '').toLowerCase();
        valB = (b.nombreCiudad || '').toLowerCase();
      } else if (sortField === 'estado') {
        valA = a.activo ? 1 : 0;
        valB = b.activo ? 1 : 0;
      } else if (sortField === 'administrador') {
        valA = (a.nombreAdministrador || '').toLowerCase();
        valB = (b.nombreAdministrador || '').toLowerCase();
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
  }, [condominios, searchTerm, ciudadFilter, estadoFilter, sortField, sortOrder]);

  const handlePaisChange = async (paisId) => {
    setForm({ ...form, idPais: paisId, idCiudad: '' });
    if (paisId) {
      try {
        const cities = await getCities(paisId);
        setCiudades(cities);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: form.nombre,
        direccion: form.direccion,
        idPais: parseInt(form.idPais, 10),
        idCiudad: parseInt(form.idCiudad, 10),
      };
      if (editing) {
        await updateCondominium(editing.id, payload);
      } else {
        await createCondominium(payload);
      }
      setShowModal(false);
      load();
    } catch (err) {
      alert(err.message);
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

  // Componente inline para el estado con punto
  const BadgeEstadoPunto = ({ activo }) => {
    const isActive = activo === true;
    const config = isActive
      ? { bg: '#dcfce7', color: '#166534', dotColor: '#22c55e', label: 'Activo' }
      : { bg: '#fee2e2', color: '#991b1b', dotColor: '#ef4444', label: 'Inactivo' };

    return (
      <span
        style={{
          backgroundColor: config.bg,
          color: config.color,
          padding: '4px 12px 4px 8px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '600',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: config.dotColor,
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        {config.label}
      </span>
    );
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando condominios...</p>
      </div>
    );
  if (error)
    return (
      <div className="text-center text-danger py-5">
        <p>{error}</p>
        <Button variant="outline-primary" onClick={load}>Reintentar</Button>
      </div>
    );

  return (
    <div style={{ padding: '1.5rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontWeight: 700, color: '#1e293b' }}>Condominios</h1>
        <Button variant="primary" onClick={() => {
          setEditing(null);
          setForm({
            nombre: '',
            direccion: '',
            idPais: paises.length > 0 ? paises[0].id : '',
            idCiudad: '',
          });
          setShowModal(true);
        }}>
          <FiPlus className="me-2" /> Nuevo
        </Button>
      </div>

      <Row className="mb-4 g-2 align-items-end">
        <Col md={3}>
          <InputGroup>
            <InputGroup.Text><FiSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar condominio"
            />
          </InputGroup>
        </Col>
        <Col md={2}>
          <Form.Select
            value={ciudadFilter}
            onChange={(e) => setCiudadFilter(e.target.value)}
            aria-label="Filtrar por ciudad"
          >
            <option value="">Todas las ciudades</option>
            {uniqueCities.map(ciudad => (
              <option key={ciudad} value={ciudad}>{ciudad}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select
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
          <Form.Select
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
            <option value="ciudad-asc">Ciudad A-Z</option>
            <option value="ciudad-desc">Ciudad Z-A</option>
            <option value="estado-asc">Estado (Activo primero)</option>
            <option value="estado-desc">Estado (Inactivo primero)</option>
            <option value="administrador-asc">Administrador A-Z</option>
            <option value="administrador-desc">Administrador Z-A</option>
          </Form.Select>
        </Col>
        <Col md={3} className="text-end">
          <Button variant="outline-secondary" onClick={() => {
            setSearchTerm('');
            setCiudadFilter('');
            setEstadoFilter('');
          }}>
            Limpiar filtros
          </Button>
        </Col>
      </Row>

      {filteredAndSorted.length === 0 ? (
        <p className="text-center">No hay condominios que coincidan con los filtros.</p>
      ) : (
        <div className="table-responsive">
          <Table striped hover bordered={false} className="shadow-sm rounded overflow-hidden">
            <thead className="bg-light">
              <tr>
                <th>ID</th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('nombre')}>
                  Nombre {getSortIcon('nombre')}
                </th>
                <th>Dirección</th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('ciudad')}>
                  Ciudad {getSortIcon('ciudad')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('administrador')}>
                  Administrador {getSortIcon('administrador')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('estado')}>
                  Estado {getSortIcon('estado')}
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td><strong>{c.nombre}</strong></td>
                  <td>{c.direccion}</td>
                  <td>{c.nombreCiudad || '-'}</td>
                  <td>{c.nombreAdministrador || <span className="text-muted">Sin asignar</span>}</td>
                  <td>
                    <BadgeEstadoPunto activo={c.activo} />
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
                          idPais: c.idPais || (paises.length > 0 ? paises[0].id : ''),
                          idCiudad: c.idCiudad || '',
                        });
                        if (c.idPais) {
                          getCities(c.idPais).then(cities => setCiudades(cities)).catch(console.error);
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
        </div>
      )}

      {/* Modal igual que antes */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-light">
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
                value={form.idPais}
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
                value={form.idCiudad}
                onChange={(e) => setForm({ ...form, idCiudad: e.target.value })}
                required
                disabled={!form.idPais || loadingCatalogs}
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