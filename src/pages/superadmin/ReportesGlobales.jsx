import { useState, useEffect } from 'react';
import {
  FiGrid, FiUsers, FiUserCheck, FiActivity,
  FiRefreshCw, FiBarChart2, FiPieChart, FiHome, FiTruck,
} from 'react-icons/fi';
import {
  getSuperAdminDashboardMetrics,
  getCondominiums,
  getAdministrators,
  getAllUsers,
  getAdminDashboardMetrics,
} from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LabelList,
} from 'recharts';
import { Card, Row, Col, Spinner, Button, Badge } from 'react-bootstrap';

const CHART_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

const COLORS = {
  primary: '#4f46e5', success: '#10b981', warning: '#f59e0b',
  danger: '#ef4444', info: '#3b82f6', purple: '#8b5cf6',
};

const ROLE_LABELS = {
  SUPER_ADMINISTRADOR: 'Super Admin',
  ADMINISTRADOR_CONDOMINIO: 'Administrador',
  PROPIETARIO: 'Propietario',
  AGENTE_SEGURIDAD: 'Agente Seguridad',
};

export default function ReportesGlobales() {
  const [metrics, setMetrics] = useState(null);
  const [condominios, setCondominios] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminMetrics, setAdminMetrics] = useState(null);
  const [condoSeleccionado, setCondoSeleccionado] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const extractItems = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.items && Array.isArray(data.items)) return data.items;
    if (data?.content && Array.isArray(data.content)) return data.content;
    if (data?.data && Array.isArray(data.data)) return data.data;
    return [];
  };

  const loadData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const [m, c, a, u] = await Promise.all([
        getSuperAdminDashboardMetrics(),
        getCondominiums(),
        getAdministrators(),
        getAllUsers(),
      ]);
      setMetrics(m);
      setCondominios(extractItems(c));
      setAdmins(extractItems(a));
      setUsers(extractItems(u));
    } catch (err) {
      setError(err.message);
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(true); }, []);

  useEffect(() => {
    if (!condoSeleccionado) { setAdminMetrics(null); return; }
    getAdminDashboardMetrics(condoSeleccionado)
      .then(setAdminMetrics)
      .catch(() => setAdminMetrics(null));
  }, [condoSeleccionado]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Cargando reportes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5 text-danger">
        <p><strong>Error:</strong> {error}</p>
        <Button variant="primary" onClick={() => { setRefreshing(true); loadData(false); }}>
          Reintentar
        </Button>
      </div>
    );
  }

  const roleCounts = {};
  users.forEach(u => {
    const label = ROLE_LABELS[u.rol] || u.rol;
    roleCounts[label] = (roleCounts[label] || 0) + 1;
  });
  const roleData = Object.entries(roleCounts).map(([name, value]) => ({ name, value }));

  const withAdmin = condominios.filter(c => c.idAdministrador).length;
  const withoutAdmin = condominios.filter(c => !c.idAdministrador).length;
  const activeCondos = condominios.filter(c => c.activo).length;
  const inactiveCondos = condominios.filter(c => !c.activo).length;
  const activeUsers = users.filter(u => u.activo).length;
  const inactiveUsers = users.filter(u => !u.activo).length;
  const activeAdmins = admins.filter(a => a.activo).length;
  const inactiveAdmins = admins.filter(a => !a.activo).length;

  const handleRefresh = () => { setRefreshing(true); loadData(false); };

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 style={{ fontWeight: 800, color: '#0f172a', margin: 0 }}>Reportes Globales</h1>
          <p className="text-muted mt-1 mb-0">Estadísticas y métricas del sistema</p>
        </div>
        <Button variant="outline-primary" size="sm" onClick={handleRefresh} disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {refreshing ? <><Spinner as="span" animation="border" size="sm" /> Actualizando...</>
            : <><FiRefreshCw size={16} /> Actualizar</>}
        </Button>
      </div>

      <Row className="g-3 mb-4">
        <Col xs={6} md={3}>
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body className="py-3">
              <FiGrid size={20} color={COLORS.primary} />
              <div className="fs-4 fw-bold mt-1">{condominios.length}</div>
              <div className="small text-muted">Condominios</div>
              <div className="small">
                <Badge bg="success" pill className="me-1">{activeCondos}</Badge> activos
                <Badge bg="secondary" pill className="ms-1">{inactiveCondos}</Badge> inactivos
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body className="py-3">
              <FiUsers size={20} color={COLORS.success} />
              <div className="fs-4 fw-bold mt-1">{admins.length}</div>
              <div className="small text-muted">Administradores</div>
              <div className="small">
                <Badge bg="success" pill className="me-1">{activeAdmins}</Badge> activos
                <Badge bg="secondary" pill className="ms-1">{inactiveAdmins}</Badge> inactivos
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body className="py-3">
              <FiUserCheck size={20} color={COLORS.warning} />
              <div className="fs-4 fw-bold mt-1">{metrics?.totalPropietarios || 0}</div>
              <div className="small text-muted">Propietarios</div>
              <div className="small">Usuarios residenciales</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body className="py-3">
              <FiActivity size={20} color={COLORS.purple} />
              <div className="fs-4 fw-bold mt-1">{metrics?.totalUsuarios || 0}</div>
              <div className="small text-muted">Usuarios totales</div>
              <div className="small">
                <Badge bg="success" pill className="me-1">{activeUsers}</Badge> activos
                <Badge bg="secondary" pill className="ms-1">{inactiveUsers}</Badge> inactivos
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xs={12} lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white fw-bold d-flex align-items-center gap-2">
              <FiBarChart2 size={16} /> Distribución de usuarios por rol
            </Card.Header>
            <Card.Body>
              {roleData.length === 0 ? (
                <p className="text-muted text-center">Sin datos</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={roleData} margin={{ top: 25, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'rgba(79, 70, 229, 0.06)' }} />
                    <Bar dataKey="value" name="Usuarios" radius={[8, 8, 0, 0]} barSize={50}>
                      {roleData.map((entry, index) => (
                        <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                      <LabelList dataKey="value" position="top" style={{ fontWeight: 700, fill: '#334155' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white fw-bold d-flex align-items-center gap-2">
              <FiPieChart size={16} /> Asignación de condominios
            </Card.Header>
            <Card.Body>
              {condominios.length === 0 ? (
                <p className="text-muted text-center">Sin datos</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Con administrador', value: withAdmin },
                          { name: 'Sin administrador', value: withoutAdmin },
                        ].filter(d => d.value > 0)}
                        cx="50%" cy="50%"
                        innerRadius={60} outerRadius={100}
                        paddingAngle={2} dataKey="value"
                      >
                        {[withAdmin, withoutAdmin].filter(v => v > 0).map((_, i) => (
                          <Cell key={i} fill={i === 0 ? COLORS.success : COLORS.warning} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="d-flex justify-content-center gap-3 mt-2">
                    <div><Badge bg="success" className="me-1" /> Con admin: <strong>{withAdmin}</strong></div>
                    <div><Badge bg="warning" className="me-1" /> Sin admin: <strong>{withoutAdmin}</strong></div>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white fw-bold d-flex align-items-center gap-2">
              <FiUsers size={16} /> Estado de administradores
            </Card.Header>
            <Card.Body>
              {admins.length === 0 ? (
                <p className="text-muted text-center">Sin datos</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Activos', value: activeAdmins },
                          { name: 'Inactivos', value: inactiveAdmins },
                        ].filter(d => d.value > 0)}
                        cx="50%" cy="50%"
                        innerRadius={50} outerRadius={80}
                        paddingAngle={2} dataKey="value"
                      >
                        {activeAdmins > 0 && <Cell fill={COLORS.success} />}
                        {inactiveAdmins > 0 && <Cell fill={COLORS.danger} />}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="d-flex justify-content-center gap-3 mt-2">
                    <div><Badge bg="success" className="me-1" /> Activos: <strong>{activeAdmins}</strong></div>
                    <div><Badge bg="danger" className="me-1" /> Inactivos: <strong>{inactiveAdmins}</strong></div>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white fw-bold d-flex align-items-center gap-2">
              <FiActivity size={16} /> Estado de usuarios
            </Card.Header>
            <Card.Body>
              {users.length === 0 ? (
                <p className="text-muted text-center">Sin datos</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Activos', value: activeUsers },
                          { name: 'Inactivos', value: inactiveUsers },
                        ].filter(d => d.value > 0)}
                        cx="50%" cy="50%"
                        innerRadius={50} outerRadius={80}
                        paddingAngle={2} dataKey="value"
                      >
                        {activeUsers > 0 && <Cell fill={COLORS.success} />}
                        {inactiveUsers > 0 && <Cell fill={COLORS.danger} />}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="d-flex justify-content-center gap-3 mt-2">
                    <div><Badge bg="success" className="me-1" /> Activos: <strong>{activeUsers}</strong></div>
                    <div><Badge bg="danger" className="me-1" /> Inactivos: <strong>{inactiveUsers}</strong></div>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs={12}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold d-flex align-items-center gap-2">
              <FiHome size={16} /> Métricas por condominio
            </Card.Header>
            <Card.Body>
              <div style={{ maxWidth: '280px', marginBottom: '1rem' }}>
                <select
                  className="form-select"
                  value={condoSeleccionado}
                  onChange={(e) => setCondoSeleccionado(e.target.value)}
                >
                  <option value="">Seleccionar condominio</option>
                  {condominios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              {!condoSeleccionado ? (
                <p className="text-muted text-center">Selecciona un condominio para ver sus métricas</p>
              ) : !adminMetrics ? (
                <p className="text-muted text-center">Cargando...</p>
              ) : (
                <Row className="g-3">
                  <Col xs={6} md={2}>
                    <div className="text-center p-3 bg-light rounded">
                      <div className="fw-bold fs-5">{adminMetrics.totalTorres || 0}</div>
                      <small className="text-muted">Torres</small>
                    </div>
                  </Col>
                  <Col xs={6} md={2}>
                    <div className="text-center p-3 bg-light rounded">
                      <div className="fw-bold fs-5">{adminMetrics.totalPisos || 0}</div>
                      <small className="text-muted">Pisos</small>
                    </div>
                  </Col>
                  <Col xs={6} md={2}>
                    <div className="text-center p-3 bg-light rounded">
                      <div className="fw-bold fs-5">{adminMetrics.totalApartamentos || 0}</div>
                      <small className="text-muted">Apartamentos</small>
                    </div>
                  </Col>
                  <Col xs={6} md={2}>
                    <div className="text-center p-3 bg-light rounded">
                      <div className="fw-bold fs-5">{adminMetrics.totalPropietarios || 0}</div>
                      <small className="text-muted">Propietarios</small>
                    </div>
                  </Col>
                  <Col xs={6} md={2}>
                    <div className="text-center p-3 bg-light rounded">
                      <div className="fw-bold fs-5">{adminMetrics.totalVehiculos || 0}</div>
                      <small className="text-muted">Vehículos</small>
                    </div>
                  </Col>
                  <Col xs={6} md={2}>
                    <div className="text-center p-3 bg-light rounded">
                      <div className="fw-bold fs-5">{adminMetrics.totalCarritos || 0}</div>
                      <small className="text-muted">Carritos</small>
                    </div>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}