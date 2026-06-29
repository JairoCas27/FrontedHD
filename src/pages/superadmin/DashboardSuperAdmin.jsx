import { useEffect, useState } from 'react';
import {
  FiHome, FiUsers, FiGrid, FiActivity, FiUserCheck, FiUserX, FiTrendingUp,
  FiBarChart2, FiPieChart, FiCalendar,
} from 'react-icons/fi';
import {
  getSuperAdminDashboardMetrics,
  getSuperAdminRecentAdmins,
  getSuperAdminRecentCondos,
  getAllUsers,
  getCondominiums,
} from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { Card, Row, Col, Badge, Table } from 'react-bootstrap';

export default function DashboardSuperAdmin() {
  const [metrics, setMetrics] = useState(null);
  const [recentAdmins, setRecentAdmins] = useState([]);
  const [recentCondos, setRecentCondos] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allCondos, setAllCondos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [m, admins, condos, users, condosAll] = await Promise.all([
          getSuperAdminDashboardMetrics(),
          getSuperAdminRecentAdmins(),
          getSuperAdminRecentCondos(),
          getAllUsers(),
          getCondominiums(),
        ]);
        setMetrics(m);
        setRecentAdmins(admins);
        setRecentCondos(condos);
        setAllUsers(users);
        setAllCondos(condosAll);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="text-center py-5">Cargando...</div>;

  // Procesar datos para gráficos
  const totalUsuarios = allUsers.length || metrics?.totalUsuarios || 0;
  const totalAdmins = allUsers.filter(u => u.rol === 'ADMINISTRADOR_CONDOMINIO').length || metrics?.totalAdministradores || 0;
  const totalPropietarios = allUsers.filter(u => u.rol === 'PROPIETARIO').length || metrics?.totalPropietarios || 0;
  const totalSeguridad = allUsers.filter(u => u.rol === 'AGENTE_SEGURIDAD').length || 0;
  const totalSuperAdmins = allUsers.filter(u => u.rol === 'SUPER_ADMINISTRADOR').length || 0;

  // Distribución de roles para gráfico de pastel
  const roleDistribution = [
    { name: 'Propietarios', value: totalPropietarios, color: '#f59e0b' },
    { name: 'Administradores', value: totalAdmins, color: '#10b981' },
    { name: 'Agentes Seguridad', value: totalSeguridad, color: '#3b82f6' },
    { name: 'Super Admins', value: totalSuperAdmins, color: '#8b5cf6' },
  ].filter(item => item.value > 0);

  // Datos de condominios: activos vs inactivos
  const totalCondos = allCondos.length || metrics?.totalCondominios || 0;
  const activeCondos = allCondos.filter(c => c.activo).length;
  const inactiveCondos = totalCondos - activeCondos;

  // Datos de barras: cantidad de usuarios por mes (usando fechaCreacion)
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const currentYear = new Date().getFullYear();
  const usersByMonth = months.map((month, index) => {
    const monthIndex = index;
    const count = allUsers.filter(u => {
      const date = new Date(u.fechaCreacion);
      return date.getFullYear() === currentYear && date.getMonth() === monthIndex;
    }).length;
    return { month, usuarios: count };
  });

  // Datos de condominios creados por mes
  const condosByMonth = months.map((month, index) => {
    const monthIndex = index;
    const count = allCondos.filter(c => {
      const date = new Date(c.fechaCreacion);
      return date.getFullYear() === currentYear && date.getMonth() === monthIndex;
    }).length;
    return { month, condominios: count };
  });

  // Combinar ambos en un solo gráfico de área (pueden ser dos líneas)
  const combinedData = months.map((month, index) => ({
    month,
    usuarios: usersByMonth[index].usuarios,
    condominios: condosByMonth[index].condominios,
  }));

  const stats = [
    { title: 'Condominios', value: totalCondos, icon: <FiHome size={24} />, color: '#4f46e5', subtitle: `${activeCondos} activos` },
    { title: 'Administradores', value: totalAdmins, icon: <FiUsers size={24} />, color: '#10b981', subtitle: `${totalAdmins} registrados` },
    { title: 'Propietarios', value: totalPropietarios, icon: <FiUserCheck size={24} />, color: '#f59e0b', subtitle: `${totalPropietarios} activos` },
    { title: 'Usuarios Totales', value: totalUsuarios, icon: <FiActivity size={24} />, color: '#8b5cf6', subtitle: `${totalUsuarios} en sistema` },
  ];

  // Últimos 5 usuarios registrados
  const recentUsers = allUsers
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
    .slice(0, 5);

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <h1 className="mb-4" style={{ fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FiBarChart2 size={28} /> Dashboard Global
        <Badge bg="info" className="ms-2">Super Admin</Badge>
      </h1>

      {/* Tarjetas de métricas */}
      <Row className="g-4 mb-4">
        {stats.map((stat, idx) => (
          <Col md={3} key={idx}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-bold">{stat.title}</div>
                  <div className="fs-2 fw-bold">{stat.value}</div>
                  <div className="text-muted small">{stat.subtitle}</div>
                </div>
                <div style={{ color: stat.color, background: `${stat.color}15`, padding: '12px', borderRadius: '12px' }}>
                  {stat.icon}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Gráficos */}
      <Row className="g-4 mb-4">
        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold">
              <FiTrendingUp className="me-2" /> Evolución de registros ({currentYear})
            </Card.Header>
            <Card.Body style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="usuarios" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="Usuarios" />
                  <Area yAxisId="right" type="monotone" dataKey="condominios" stackId="2" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} name="Condominios" />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold">
              <FiPieChart className="me-2" /> Distribución de roles
            </Card.Header>
            <Card.Body style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tablas de actividad reciente y condominios */}
      <Row className="g-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold">
              <FiUsers className="me-2" /> Últimos administradores
            </Card.Header>
            <Card.Body>
              {recentAdmins.length === 0 ? (
                <p className="text-muted">Sin datos</p>
              ) : (
                <ul className="list-unstyled">
                  {recentAdmins.map((admin) => (
                    <li key={admin.id} className="border-bottom py-2 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{admin.nombres} {admin.apellidos}</div>
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
            <Card.Header className="bg-white fw-bold">
              <FiHome className="me-2" /> Últimos condominios
            </Card.Header>
            <Card.Body>
              {recentCondos.length === 0 ? (
                <p className="text-muted">Sin datos</p>
              ) : (
                <ul className="list-unstyled">
                  {recentCondos.map((c) => (
                    <li key={c.id} className="border-bottom py-2 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{c.nombre}</div>
                        <div className="small text-muted">{c.direccion} · {c.ciudad || 'Sin ciudad'}</div>
                      </div>
                      <Badge bg={c.activo ? 'success' : 'secondary'}>
                        {c.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla de usuarios recientes (opcional) */}
      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white fw-bold">
              <FiActivity className="me-2" /> Últimos usuarios registrados
            </Card.Header>
            <Card.Body>
              <Table responsive striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Condominio</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.length === 0 ? (
                    <tr><td colSpan="5" className="text-center">Sin datos</td></tr>
                  ) : (
                    recentUsers.map(u => (
                      <tr key={u.id}>
                        <td>{u.nombres} {u.apellidos}</td>
                        <td>{u.correo}</td>
                        <td><Badge bg="info">{u.rol}</Badge></td>
                        <td>{u.nombreCondominio || 'Sin asignar'}</td>
                        <td>{new Date(u.fechaCreacion).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}