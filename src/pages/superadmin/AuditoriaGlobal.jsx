import { useState, useEffect } from 'react';
import { FiClock, FiUserCheck, FiHome, FiActivity, FiRefreshCw, FiCalendar } from 'react-icons/fi';
import {
  getSuperAdminRecentAdmins,
  getSuperAdminRecentCondos,
  getSuperAdminDashboardMetrics,
} from '../../services/api';
import { Card, Row, Col, Spinner, Button, Badge } from 'react-bootstrap';

const COLORS = {
  primary: '#4f46e5',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
};

export default function AuditoriaGlobal() {
  const [recentAdmins, setRecentAdmins] = useState([]);
  const [recentCondos, setRecentCondos] = useState([]);
  const [metrics, setMetrics] = useState(null);
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
      const [admins, condos, m] = await Promise.all([
        getSuperAdminRecentAdmins(),
        getSuperAdminRecentCondos(),
        getSuperAdminDashboardMetrics(),
      ]);
      setRecentAdmins(extractItems(admins));
      setRecentCondos(extractItems(condos));
      setMetrics(m);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(true); }, []);

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

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'hace unos segundos';
    if (mins < 60) return `hace ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `hace ${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `hace ${days}d`;
  };

  const allActivity = [
    ...recentAdmins.map(a => ({
      id: `admin-${a.id}`,
      type: 'admin',
      title: `${a.nombres} ${a.apellidos}`,
      subtitle: a.correo,
      meta: a.nombreCondominio || 'Sin condominio',
      date: a.fechaCreacion,
      active: a.activo,
    })),
    ...recentCondos.map(c => ({
      id: `condo-${c.id}`,
      type: 'condo',
      title: c.nombre,
      subtitle: c.direccion || '',
      meta: c.nombreCiudad || '',
      date: c.fechaCreacion,
      active: c.activo,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const getIcon = (type) => {
    if (type === 'admin') return <FiUserCheck size={18} color={COLORS.success} />;
    return <FiHome size={18} color={COLORS.primary} />;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Cargando actividad del sistema...</p>
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

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 style={{ fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Auditoría Global
          </h1>
          <p className="text-muted mt-1 mb-0">
            Actividad reciente del sistema
          </p>
        </div>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => { setRefreshing(true); loadData(false); }}
          disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {refreshing ? (
            <><Spinner as="span" animation="border" size="sm" /> Actualizando...</>
          ) : (
            <><FiRefreshCw size={16} /> Actualizar</>
          )}
        </Button>
      </div>

      <Row className="g-4 mb-4">
        <Col xs={12} md={3}>
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body>
              <div className="text-muted small fw-bold text-uppercase">Total Administradores</div>
              <div className="fs-2 fw-bold mt-1" style={{ color: COLORS.success }}>
                {metrics?.totalAdministradores || 0}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body>
              <div className="text-muted small fw-bold text-uppercase">Total Condominios</div>
              <div className="fs-2 fw-bold mt-1" style={{ color: COLORS.primary }}>
                {recentCondos.length > 0 ? recentCondos.length : (metrics?.totalCondominios || 0)}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body>
              <div className="text-muted small fw-bold text-uppercase">Total Propietarios</div>
              <div className="fs-2 fw-bold mt-1" style={{ color: COLORS.warning }}>
                {metrics?.totalPropietarios || 0}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body>
              <div className="text-muted small fw-bold text-uppercase">Total Usuarios</div>
              <div className="fs-2 fw-bold mt-1" style={{ color: COLORS.purple }}>
                {metrics?.totalUsuarios || 0}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white fw-bold d-flex align-items-center gap-2">
          <FiActivity size={16} />
          Línea de tiempo - Actividad reciente
        </Card.Header>
        <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {allActivity.length === 0 ? (
            <p className="text-muted text-center my-4">No hay actividad registrada</p>
          ) : (
            <div style={{ position: 'relative' }}>
              {allActivity.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    paddingBottom: idx < allActivity.length - 1 ? '24px' : '8px',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: '40px',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: item.type === 'admin' ? '#f0fdf4' : '#eff6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                      }}
                    >
                      {getIcon(item.type)}
                    </div>
                    {idx < allActivity.length - 1 && (
                      <div
                        style={{
                          width: '2px',
                          flex: 1,
                          backgroundColor: '#e2e8f0',
                          marginTop: '4px',
                        }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1, paddingTop: '4px' }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <strong style={{ color: '#0f172a' }}>{item.title}</strong>
                        {item.subtitle && (
                          <div className="text-muted small">{item.subtitle}</div>
                        )}
                        {item.meta && (
                          <div className="text-muted small">{item.meta}</div>
                        )}
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Badge bg={item.active ? 'success' : 'secondary'} pill>
                          {item.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <small className="text-muted text-nowrap">
                          <FiClock size={12} className="me-1" />
                          {getTimeAgo(item.date)}
                        </small>
                      </div>
                    </div>
                    <div className="mt-1">
                      <small className="text-muted">
                        <FiCalendar size={11} className="me-1" />
                        {formatDate(item.date)}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
