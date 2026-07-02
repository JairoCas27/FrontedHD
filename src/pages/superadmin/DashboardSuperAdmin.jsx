// pages/superadmin/DashboardSuperAdmin.jsx
import { useEffect, useState } from 'react';
import {
  FiHome,
  FiUsers,
  FiGrid,
  FiActivity,
  FiUserCheck,
  FiCalendar,
  FiClock,
  FiRefreshCw,
} from 'react-icons/fi';
import {
  getSuperAdminDashboardMetrics,
  getSuperAdminRecentAdmins,
  getSuperAdminRecentCondos,
  getCondominiums,
} from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, Badge, Row, Col, Spinner, Button } from 'react-bootstrap';

const COLORS = {
  primary: '#4f46e5',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  gray: '#6b7280',
};

const CHART_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DashboardSuperAdmin() {
  const [metrics, setMetrics] = useState(null);
  const [recentAdmins, setRecentAdmins] = useState([]);
  const [allCondos, setAllCondos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery('(max-width: 576px)');

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
      const [m, admins, allCondosData] = await Promise.all([
        getSuperAdminDashboardMetrics(),
        getSuperAdminRecentAdmins(),
        getCondominiums(),
      ]);

      setMetrics(m);
      setRecentAdmins(extractItems(admins));
      setAllCondos(extractItems(allCondosData));
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData(false);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Cargando datos del dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5 text-danger">
        <p><strong>Error:</strong> {error}</p>
        <Button variant="primary" onClick={handleRefresh}>
          Reintentar
        </Button>
      </div>
    );
  }

  const totalCondos = allCondos.length;
  const activeCondos = allCondos.filter(c => c.activo === true).length;
  const inactiveCondos = totalCondos - activeCondos;

  const condoStatusData = [
    { name: 'Activos', value: activeCondos },
    { name: 'Inactivos', value: inactiveCondos },
  ].filter(item => item.value > 0);

  const roleDistribution = [
    { name: 'Administradores', value: metrics?.totalAdministradores || 0 },
    { name: 'Propietarios', value: metrics?.totalPropietarios || 0 },
    {
      name: 'Agentes Seguridad',
      value: Math.max(
        0,
        (metrics?.totalUsuarios || 0) -
        (metrics?.totalAdministradores || 0) -
        (metrics?.totalPropietarios || 0)
      ),
    },
  ].filter(item => item.value > 0);

  const lastCondos = [...allCondos]
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
    .slice(0, 5);

  const stats = [
    {
      title: 'Condominios',
      value: totalCondos,
      icon: <FiGrid size={24} />,
      color: COLORS.primary,
      subtitle: `${activeCondos} activos, ${inactiveCondos} inactivos`,
    },
    {
      title: 'Administradores',
      value: metrics?.totalAdministradores || 0,
      icon: <FiUsers size={24} />,
      color: COLORS.success,
      subtitle: 'Gestores de condominios',
    },
    {
      title: 'Propietarios',
      value: metrics?.totalPropietarios || 0,
      icon: <FiUserCheck size={24} />,
      color: COLORS.warning,
      subtitle: 'Residentes registrados',
    },
    {
      title: 'Usuarios Totales',
      value: metrics?.totalUsuarios || 0,
      icon: <FiActivity size={24} />,
      color: COLORS.purple,
      subtitle: 'Todos los roles',
    },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const chartHeight = isMobile ? 220 : 300;

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Dashboard Global del Sistema
          </h1>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Badge bg="primary" className="text-nowrap" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
            <FiCalendar className="me-1" /> {new Date().toLocaleDateString()}
          </Badge>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {refreshing ? (
              <>
                <Spinner as="span" animation="border" size="sm" />
                Actualizando...
              </>
            ) : (
              <>
                <FiRefreshCw size={16} />
                Actualizar
              </>
            )}
          </Button>
        </div>
      </div>

      <Row className="g-4 mb-4">
        {stats.map((stat, idx) => (
          <Col xs={12} sm={6} lg={3} key={idx}>
            <Card className="border-0 shadow-sm h-100" style={{ transition: 'transform 0.2s' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="text-muted small fw-bold text-uppercase tracking-wide">
                      {stat.title}
                    </div>
                    <div className="fs-2 fw-bold mt-1" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="small text-muted mt-1">{stat.subtitle}</div>
                  </div>
                  <div
                    style={{
                      background: `${stat.color}15`,
                      color: stat.color,
                      padding: '12px',
                      borderRadius: '12px',
                    }}
                  >
                    {stat.icon}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4 mb-4">
        <Col xs={12} lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white fw-bold">
              Distribución de usuarios por rol
            </Card.Header>
            <Card.Body>
              {roleDistribution.length === 0 ? (
                <p className="text-muted text-center">Sin datos para mostrar</p>
              ) : (
                <ResponsiveContainer width="100%" height={chartHeight}>
                  <BarChart data={roleDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      formatter={(value) => [`${value} usuarios`, 'Cantidad']}
                      labelStyle={{ fontWeight: 600 }}
                    />
                    <Legend />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={isMobile ? 20 : 40}>
                      {roleDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white fw-bold">
              Estado de condominios
            </Card.Header>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              {condoStatusData.length === 0 ? (
                <p className="text-muted text-center">Sin datos</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={isMobile ? 200 : 240}>
                    <PieChart>
                      <Pie
                        data={condoStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={isMobile ? 40 : 60}
                        outerRadius={isMobile ? 70 : 90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {condoStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.name === 'Activos' ? COLORS.success : COLORS.danger}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="d-flex gap-3 mt-2 flex-wrap justify-content-center">
                    <div>
                      <span className="badge bg-success me-1">●</span> Activos:{' '}
                      <strong>{activeCondos}</strong>
                    </div>
                    <div>
                      <span className="badge bg-danger me-1">●</span> Inactivos:{' '}
                      <strong>{inactiveCondos}</strong>
                    </div>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xs={12} lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold d-flex justify-content-between align-items-center">
              <span>📋 Últimos administradores</span>
              <Badge bg="primary" pill>
                {recentAdmins.length}
              </Badge>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {recentAdmins.length === 0 ? (
                <p className="text-muted text-center">Sin registros</p>
              ) : (
                <ul className="list-unstyled m-0">
                  {recentAdmins.map((admin) => (
                    <li
                      key={admin.id}
                      className="d-flex justify-content-between align-items-center border-bottom py-3"
                    >
                      <div>
                        <div className="fw-bold">
                          {admin.nombres} {admin.apellidos}
                        </div>
                        <div className="small text-muted">
                          {admin.correo} · {admin.nombreCondominio || 'Sin condominio'}
                        </div>
                      </div>
                      <div className="text-end">
                        <Badge bg={admin.activo ? 'success' : 'secondary'}>
                          {admin.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <div className="small text-muted mt-1">
                          <FiClock size={12} className="me-1" />
                          {formatDate(admin.fechaCreacion)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold d-flex justify-content-between align-items-center">
              <span>🏢 Últimos condominios</span>
              <Badge bg="primary" pill>
                {lastCondos.length}
              </Badge>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {lastCondos.length === 0 ? (
                <p className="text-muted text-center">Sin registros</p>
              ) : (
                <ul className="list-unstyled m-0">
                  {lastCondos.map((c) => (
                    <li
                      key={c.id}
                      className="d-flex justify-content-between align-items-center border-bottom py-3"
                    >
                      <div>
                        <div className="fw-bold">{c.nombre}</div>
                        <div className="small text-muted">
                          {c.direccion} · {c.nombreCiudad || 'Sin ciudad'}
                        </div>
                      </div>
                      <div className="text-end">
                        <Badge bg={c.activo ? 'success' : 'secondary'}>
                          {c.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <div className="small text-muted mt-1">
                          <FiClock size={12} className="me-1" />
                          {formatDate(c.fechaCreacion)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mt-4 text-center text-muted small">
        <span>
          Dashboard actualizado automáticamente · Datos en tiempo real
        </span>
      </div>
    </div>
  );
}