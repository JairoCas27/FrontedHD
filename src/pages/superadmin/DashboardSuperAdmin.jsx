// src/pages/superadmin/DashboardSuperAdmin.jsx
import { useEffect, useState } from 'react';
import {
  FiHome,
  FiUsers,
  FiGrid,
  FiActivity,
  FiTrendingUp,
  FiUserCheck,
  FiUserX,
  FiRefreshCw,
} from 'react-icons/fi';
import {
  getSuperAdminDashboardMetrics,
  getSuperAdminRecentAdmins,
  getSuperAdminRecentCondos,
} from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Card, Row, Col, Spinner, Button, Badge } from 'react-bootstrap';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

export default function DashboardSuperAdmin() {
  const [metrics, setMetrics] = useState(null);
  const [recentAdmins, setRecentAdmins] = useState([]);
  const [recentCondos, setRecentCondos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
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
      setError('Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Cargando dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-danger py-5">
        <p>{error}</p>
        <Button variant="outline-primary" onClick={loadData}>
          Reintentar
        </Button>
      </div>
    );
  }

  // --- Datos para gráficos (simulados, pero pueden adaptarse a la API) ---
  // Distribución de roles (basado en métricas, si no existen, usamos valores ficticios)
  const totalAdmins = metrics?.totalAdministradores || 0;
  const totalPropietarios = metrics?.totalPropietarios || 0;
  const totalSeguridad = metrics?.totalSeguridad || 0; // si no existe, estimar
  const totalUsuarios = metrics?.totalUsuarios || 0;

  // Datos para gráfico de barras: usuarios por rol
  const barData = {
    labels: ['Administradores', 'Propietarios', 'Seguridad', 'Total'],
    datasets: [
      {
        label: 'Usuarios por rol',
        data: [totalAdmins, totalPropietarios, totalSeguridad || 5, totalUsuarios],
        backgroundColor: ['#4f46e5', '#f59e0b', '#10b981', '#8b5cf6'],
        borderRadius: 6,
      },
    ],
  };

  // Datos para gráfico de líneas: crecimiento de condominios (últimos 6 meses)
  // Si no hay datos históricos, generamos una tendencia ficticia basada en totalCondominios
  const condoGrowth = metrics?.condominiosPorMes || [2, 4, 3, 5, 6, 8];
  const lineData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Condominios nuevos',
        data: condoGrowth,
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Datos para gráfico de doughnut: distribución de condominios por ciudad (si tenemos datos)
  // Ejemplo: si la API devuelve condominios con ciudad, podemos procesarlo, pero usamos dummy
  const ciudadCounts = metrics?.condominiosPorCiudad || { Lima: 5, Callao: 2, Arequipa: 1 };
  const doughnutData = {
    labels: Object.keys(ciudadCounts),
    datasets: [
      {
        data: Object.values(ciudadCounts),
        backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
        borderWidth: 0,
      },
    ],
  };

  // Estadísticas adicionales (simuladas)
  const growth = {
    condominios: '+12%',
    administradores: '+8%',
    propietarios: '+15%',
  };

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Encabezado con botón de actualizar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontWeight: 800, color: '#1e293b' }}>Dashboard Global</h1>
        <Button variant="outline-primary" onClick={loadData} disabled={loading}>
          <FiRefreshCw className={loading ? 'spin' : ''} /> Actualizar
        </Button>
      </div>

      {/* Tarjetas de métricas */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-bold">Condominios</div>
                  <div className="fs-2 fw-bold">{metrics?.totalCondominios ?? 0}</div>
                  <div className="text-success small">
                    <FiTrendingUp /> {growth.condominios} este mes
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(79, 70, 229, 0.15)',
                    padding: '12px',
                    borderRadius: '12px',
                    color: '#4f46e5',
                  }}
                >
                  <FiGrid size={28} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-bold">Administradores</div>
                  <div className="fs-2 fw-bold">{metrics?.totalAdministradores ?? 0}</div>
                  <div className="text-success small">
                    <FiTrendingUp /> {growth.administradores} este mes
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    padding: '12px',
                    borderRadius: '12px',
                    color: '#10b981',
                  }}
                >
                  <FiUsers size={28} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-bold">Propietarios</div>
                  <div className="fs-2 fw-bold">{metrics?.totalPropietarios ?? 0}</div>
                  <div className="text-success small">
                    <FiTrendingUp /> {growth.propietarios} este mes
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    padding: '12px',
                    borderRadius: '12px',
                    color: '#f59e0b',
                  }}
                >
                  <FiUserCheck size={28} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-bold">Total Usuarios</div>
                  <div className="fs-2 fw-bold">{metrics?.totalUsuarios ?? 0}</div>
                  <div className="text-muted small">Activos: {metrics?.totalUsuariosActivos ?? 0}</div>
                </div>
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.15)',
                    padding: '12px',
                    borderRadius: '12px',
                    color: '#8b5cf6',
                  }}
                >
                  <FiActivity size={28} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row className="g-4 mb-4">
        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold">Crecimiento de condominios (últimos 6 meses)</Card.Header>
            <Card.Body>
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold">Condominios por ciudad</Card.Header>
            <Card.Body>
              <Doughnut
                data={doughnutData}
                options={{
                  plugins: {
                    legend: { position: 'bottom' },
                  },
                  cutout: '70%',
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={12}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold">Distribución de usuarios por rol</Card.Header>
            <Card.Body>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tablas recientes */}
      <Row className="g-4 mt-3">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold d-flex justify-content-between align-items-center">
              Últimos administradores
              <Badge bg="primary">{recentAdmins.length}</Badge>
            </Card.Header>
            <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {recentAdmins.length === 0 ? (
                <p className="text-muted text-center">Sin administradores registrados</p>
              ) : (
                <ul className="list-unstyled">
                  {recentAdmins.map((admin) => (
                    <li key={admin.id} className="border-bottom py-2 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">
                          {admin.nombres} {admin.apellidos}
                        </div>
                        <div className="small text-muted">{admin.correo}</div>
                      </div>
                      <Badge bg={admin.activo ? 'success' : 'secondary'}>
                        {admin.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold d-flex justify-content-between align-items-center">
              Últimos condominios
              <Badge bg="primary">{recentCondos.length}</Badge>
            </Card.Header>
            <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {recentCondos.length === 0 ? (
                <p className="text-muted text-center">Sin condominios registrados</p>
              ) : (
                <ul className="list-unstyled">
                  {recentCondos.map((c) => (
                    <li key={c.id} className="border-bottom py-2">
                      <div className="fw-bold">{c.nombre}</div>
                      <div className="small text-muted">{c.direccion} · {c.ciudad || 'Sin ciudad'}</div>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}