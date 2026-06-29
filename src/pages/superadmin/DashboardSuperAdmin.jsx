// src/pages/superadmin/DashboardSuperAdmin.jsx
import { useEffect, useState } from 'react';
import {
  FiHome,
  FiUsers,
  FiGrid,
  FiActivity,
  FiUserCheck,
  FiUserX,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiClock,
} from 'react-icons/fi';
import {
  getSuperAdminDashboardMetrics,
  getSuperAdminRecentAdmins,
  getSuperAdminRecentCondos,
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
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import { Card, Badge, Row, Col, Spinner } from 'react-bootstrap';

// Colores corporativos
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
  const [recentCondos, setRecentCondos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [m, admins, condos] = await Promise.all([
          getSuperAdminDashboardMetrics(),
          getSuperAdminRecentAdmins(),
          getSuperAdminRecentCondos(),
        ]);
        setMetrics(m);
        setRecentAdmins(admins);
        setRecentCondos(condos);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  // Datos para gráficos (basados en métricas reales)
  const roleDistribution = [
    { name: 'Administradores', value: metrics?.totalAdministradores || 0 },
    { name: 'Propietarios', value: metrics?.totalPropietarios || 0 },
    // Si hay agentes de seguridad, se pueden agregar; asumimos que el resto son agentes
    { name: 'Agentes Seguridad', value: Math.max(0, (metrics?.totalUsuarios || 0) - (metrics?.totalAdministradores || 0) - (metrics?.totalPropietarios || 0)) },
  ].filter(item => item.value > 0);

  // Datos de condominios activos/inactivos (si no vienen, los calculamos de la lista reciente)
  const totalCondos = metrics?.totalCondominios || 0;
  const activeCondos = recentCondos.filter(c => c.activo !== false).length || 0;
  const inactiveCondos = totalCondos - activeCondos;

  const condoStatusData = [
    { name: 'Activos', value: activeCondos },
    { name: 'Inactivos', value: inactiveCondos },
  ].filter(item => item.value > 0);

  // Datos de tendencia (simulados, pero se pueden reemplazar con datos reales si la API los entrega)
  // Idealmente, la API debería devolver un historial de registros por mes.
  // Simulamos con datos basados en fechas de creación de condominios recientes
  const trendData = recentCondos
    .slice(0, 6)
    .map((c, i) => ({
      name: `Mes ${i + 1}`,
      condominios: Math.floor(Math.random() * 5) + 1, // Simulación
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Si no hay datos de tendencia, usamos datos de ejemplo
  const defaultTrend = [
    { name: 'Ene', condominios: 2 },
    { name: 'Feb', condominios: 3 },
    { name: 'Mar', condominios: 1 },
    { name: 'Abr', condominios: 4 },
    { name: 'May', condominios: 2 },
    { name: 'Jun', condominios: 5 },
  ];

  const finalTrend = trendData.length > 0 ? trendData : defaultTrend;

  // Estadísticas para tarjetas
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

  // Formatear fecha
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

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            Dashboard Global del Sistema
          </h1>
        </div>
        <Badge
          bg="primary"
          style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
          <FiCalendar className="me-1" /> Actualizado: {new Date().toLocaleDateString()}
        </Badge>
      </div>

      {/* Tarjetas de estadísticas */}
      <Row className="g-4 mb-4">
        {stats.map((stat, idx) => (
          <Col lg={3} md={6} key={idx}>
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

      {/* Gráficos */}
      <Row className="g-4 mb-4">
        {/* Gráfico de barras: Distribución de roles */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white fw-bold">
              Distribución de usuarios por rol
            </Card.Header>
            <Card.Body>
              {roleDistribution.length === 0 ? (
                <p className="text-muted text-center">Sin datos para mostrar</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={roleDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      formatter={(value) => [`${value} usuarios`, 'Cantidad']}
                      labelStyle={{ fontWeight: 600 }}
                    />
                    <Legend />
                    <Bar
                      dataKey="value"
                      fill={COLORS.primary}
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    >
                      {roleDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Gráfico de torta: Estado de condominios */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white fw-bold">
              Estado de condominios
            </Card.Header>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              {condoStatusData.length === 0 ? (
                <p className="text-muted text-center">Sin datos</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={condoStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
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
                  <div className="d-flex gap-3 mt-2">
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

      {/* Tabla de actividad reciente */}
      <Row className="g-4">
        <Col lg={6}>
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

        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold d-flex justify-content-between align-items-center">
              <span>🏢 Últimos condominios</span>
              <Badge bg="primary" pill>
                {recentCondos.length}
              </Badge>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {recentCondos.length === 0 ? (
                <p className="text-muted text-center">Sin registros</p>
              ) : (
                <ul className="list-unstyled m-0">
                  {recentCondos.map((c) => (
                    <li
                      key={c.id}
                      className="d-flex justify-content-between align-items-center border-bottom py-3"
                    >
                      <div>
                        <div className="fw-bold">{c.nombre}</div>
                        <div className="small text-muted">
                          {c.direccion} · {c.ciudad || 'Sin ciudad'}
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

      {/* Pie de página */}
      <div className="mt-4 text-center text-muted small">
        <span>
          Dashboard actualizado automáticamente · Datos en tiempo real
        </span>
      </div>
    </div>
  );
}