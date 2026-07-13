import { useState, useEffect, useMemo } from 'react';
import {
  FiGrid, FiUsers, FiUserCheck, FiActivity,
  FiRefreshCw, FiBarChart2, FiHome, FiTruck,
  FiCalendar, FiTrendingUp, FiMapPin, FiCheck, FiBox, FiLayers, FiSearch,
} from 'react-icons/fi';
import {
  getSuperAdminDashboardMetrics,
  getCondominiums,
  getAdministrators,
  getAllUsers,
  getAdminDashboardMetrics,
} from '../../services/SuperAdminApi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { colors, radius, shadow, transition } from '../../theme/colors';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';

const SUPER = {
  primary: '#7c3aed',
  primaryDark: '#6d28d9',
  primaryLight: '#ede9fe',
  primaryBg: 'rgba(124,58,237,0.08)',
};

const CHART_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

const ROLE_LABELS = {
  SUPER_ADMINISTRADOR: 'Super Admin',
  ADMINISTRADOR_CONDOMINIO: 'Administrador',
  PROPIETARIO: 'Propietario',
  AGENTE_SEGURIDAD: 'Agente Seguridad',
};

const coloresGradiente = [
  ['#7c3aed', '#a78bfa'],
  ['#0ea5e9', '#38bdf8'],
  ['#f59e0b', '#fbbf24'],
  ['#10b981', '#34d399'],
  ['#ef4444', '#f87171'],
  ['#ec4899', '#f472b6'],
  ['#14b8a6', '#2dd4bf'],
  ['#f97316', '#fb923c'],
];

const cardBase = {
  background: colors.white,
  borderRadius: radius.lg,
  border: `1px solid ${colors.border}`,
  boxShadow: shadow.sm,
  transition: 'all 0.25s ease',
  overflow: 'hidden',
};

const cardHeader = {
  padding: '16px 20px',
  borderBottom: `1px solid ${colors.border}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '8px',
};

const iconBox = (accent, bg) => ({
  width: 34,
  height: 34,
  borderRadius: radius.sm,
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: accent,
});

const extractItems = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.items && Array.isArray(data.items)) return data.items;
  if (data?.content && Array.isArray(data.content)) return data.content;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: colors.white, border: `1px solid ${colors.border}`,
      borderRadius: '10px', padding: '10px 14px',
      boxShadow: shadow.lg, fontSize: '13px',
    }}>
      <div style={{ fontWeight: 700, color: colors.slate, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: colors.slateLight }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.color, display: 'inline-block' }} />
          <span>{p.name}: <strong style={{ color: colors.slate }}>{p.value}</strong></span>
        </div>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background: colors.white, border: `1px solid ${colors.border}`,
      borderRadius: '10px', padding: '10px 14px',
      boxShadow: shadow.lg, fontSize: '13px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: d.color, display: 'inline-block' }} />
        <span style={{ fontWeight: 700, color: colors.slate }}>{d.name}: <strong>{d.value}</strong></span>
      </div>
    </div>
  );
};

const STAT_COLORS = [
  { accent: SUPER.primary, bg: '#ede9fe', gradient: ['#7c3aed', '#6d28d9'] },
  { accent: '#10b981', bg: '#ecfdf5', gradient: ['#10b981', '#047857'] },
  { accent: '#f59e0b', bg: '#fffbeb', gradient: ['#f59e0b', '#b45309'] },
  { accent: '#3b82f6', bg: '#eff6ff', gradient: ['#3b82f6', '#1d4ed8'] },
];

export default function ReportesGlobales() {
  const [metrics, setMetrics] = useState(null);
  const [condominios, setCondominios] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [adminMetrics, setAdminMetrics] = useState(null);
  const [condoSeleccionado, setCondoSeleccionado] = useState('');
  const [showCardSelector, setShowCardSelector] = useState(true);
  const [condoSearch, setCondoSearch] = useState('');

  const filteredCondominios = useMemo(() => {
    if (!condoSearch) return condominios
    const q = condoSearch.toLowerCase()
    return condominios.filter(c =>
      (c.nombre?.toLowerCase() || '').includes(q) ||
      (c.direccion?.toLowerCase() || '').includes(q) ||
      (c.ciudad?.toLowerCase() || '').includes(q)
    )
  }, [condominios, condoSearch])
  const [loading, setLoading] = useState(true);
  const [loadingAdminMetrics, setLoadingAdminMetrics] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    setLoadingAdminMetrics(true);
    getAdminDashboardMetrics(condoSeleccionado)
      .then(setAdminMetrics)
      .catch(() => setAdminMetrics(null))
      .finally(() => setLoadingAdminMetrics(false));
  }, [condoSeleccionado]);

  const handleRefresh = () => { setRefreshing(true); loadData(false); };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.background }}>
        <Loading text="Cargando reportes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: colors.background }}>
        <div style={{ width: 56, height: 56, borderRadius: radius.md, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiActivity size={28} color="#ef4444" />
        </div>
        <p style={{ color: '#dc2626', fontWeight: 600, fontSize: 15 }}><strong>Error:</strong> {error}</p>
        <button
          onClick={() => { setRefreshing(true); loadData(false); }}
          onMouseEnter={(e) => { e.currentTarget.style.background = SUPER.primaryDark; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = SUPER.primary; e.currentTarget.style.transform = 'translateY(0)'; }}
          style={{ background: SUPER.primary, color: colors.white, border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition }}
        >
          Reintentar
        </button>
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
  const totalPropietarios = metrics?.totalPropietarios || users.filter(u => u.rol === 'PROPIETARIO').length;
  const totalUsuarios = metrics?.totalUsuarios || users.length;

  const stats = [
    {
      label: 'Condominios', value: condominios.length,
      icon: <FiGrid size={20} />, ...STAT_COLORS[0],
      detail: `${activeCondos} activos · ${inactiveCondos} inactivos`,
      maxRef: condominios.length || 1,
    },
    {
      label: 'Administradores', value: admins.length,
      icon: <FiUsers size={20} />, ...STAT_COLORS[1],
      detail: `${activeAdmins} activos · ${inactiveAdmins} inactivos`,
      maxRef: admins.length || 1,
    },
    {
      label: 'Propietarios', value: totalPropietarios,
      icon: <FiUserCheck size={20} />, ...STAT_COLORS[2],
      detail: 'Usuarios residenciales',
      maxRef: totalUsuarios || 1,
    },
    {
      label: 'Usuarios totales', value: totalUsuarios,
      icon: <FiActivity size={20} />, ...STAT_COLORS[3],
      detail: `${activeUsers} activos · ${inactiveUsers} inactivos`,
      maxRef: totalUsuarios || 1,
    },
  ];

  const condoActual = condominios.find(c => String(c.id) === String(condoSeleccionado));
  const chartHeight = isMobile ? 220 : 260;

  return (
    <div style={{
      padding: isMobile ? '16px' : '24px',
      background: colors.background,
      minHeight: '100vh',
    }}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulseDot {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.3); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes cardSelectedPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        .rg-card      { animation: fadeSlideUp 0.45s ease both; }
        .rg-card:nth-child(1) { animation-delay: 0.03s; }
        .rg-card:nth-child(2) { animation-delay: 0.07s; }
        .rg-card:nth-child(3) { animation-delay: 0.11s; }
        .rg-card:nth-child(4) { animation-delay: 0.15s; }
        .rg-chart     { animation: fadeSlideUp 0.5s ease both; animation-delay: 0.2s; }
        .rg-chart2    { animation: fadeSlideUp 0.5s ease both; animation-delay: 0.25s; }
        .rg-chart3    { animation: fadeSlideUp 0.5s ease both; animation-delay: 0.3s; }
        .rg-chart4    { animation: fadeSlideUp 0.5s ease both; animation-delay: 0.35s; }
        .rg-metrics   { animation: fadeSlideUp 0.5s ease both; animation-delay: 0.4s; }
      `}</style>

      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%)',
        borderRadius: radius.lg,
        padding: isMobile ? '18px 20px' : '22px 28px',
        marginBottom: '22px',
        border: '1px solid rgba(16,185,129,0.12)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: radius.md,
            background: 'linear-gradient(135deg, #10b981, #047857)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16,185,129,0.25)',
          }}>
            <FiBarChart2 size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{
              margin: 0, fontWeight: 800, fontSize: isMobile ? '18px' : '22px',
              color: colors.slate, letterSpacing: '-0.03em',
            }}>
              Reportes Globales
            </h1>
            <p style={{
              margin: '2px 0 0', fontSize: '13px', color: '#059669', fontWeight: 600,
            }}>
              {condominios.length} condominios · {admins.length} administradores · {totalUsuarios} usuarios
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)',
            padding: '8px 14px', borderRadius: '10px',
            border: '1px solid rgba(16,185,129,0.1)',
            fontSize: '12px', fontWeight: 600, color: colors.slateLight,
          }}>
            <FiCalendar size={13} color="#10b981" />
            {formatDate(new Date().toISOString())}
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            onMouseEnter={(e) => {
              if (!refreshing) {
                e.currentTarget.style.background = '#047857';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(16,185,129,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!refreshing) {
                e.currentTarget.style.background = '#10b981';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(16,185,129,0.2)';
              }
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: refreshing ? '#6ee7b7' : '#10b981',
              color: colors.white, border: 'none',
              padding: '8px 18px', borderRadius: '10px',
              fontSize: '13px', fontWeight: 700,
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition, boxShadow: '0 4px 14px rgba(16,185,129,0.2)',
            }}
          >
            <FiRefreshCw
              size={13}
              style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '22px',
      }}>
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="rg-card"
            style={cardBase}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = shadow.hover;
              e.currentTarget.style.borderColor = stat.accent;
              e.currentTarget.style.borderLeft = `3px solid ${stat.accent}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = shadow.sm;
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.borderLeft = `1px solid ${colors.border}`;
            }}
          >
            <div style={{
              height: 3,
              background: `linear-gradient(90deg, ${stat.gradient[0]}, ${stat.gradient[1]})`,
            }} />
            <div style={{ padding: '14px 16px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '11px', fontWeight: 700, color: colors.slateLighter,
                    textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3,
                  }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontSize: isMobile ? '24px' : '28px', fontWeight: 800,
                    color: colors.slate, lineHeight: 1.1, marginBottom: 2,
                    letterSpacing: '-0.02em',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '11px', color: colors.slateLighter, fontWeight: 500 }}>
                    {stat.detail}
                  </div>
                </div>
                <div style={{
                  ...iconBox(stat.accent, stat.bg),
                  width: 40, height: 40,
                  transition,
                }}>
                  {stat.icon}
                </div>
              </div>
              <div style={{
                marginTop: '10px',
                height: 3,
                borderRadius: 2,
                background: '#f1f4f9',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${Math.min(100, Math.max(5, (stat.value / Math.max(stat.maxRef, 1)) * 100))}%`,
                  height: '100%',
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${stat.gradient[0]}, ${stat.gradient[1]})`,
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '16px',
        marginBottom: '22px',
      }}>
        <div className="rg-chart" style={cardBase}>
          <div style={cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={iconBox('#4f46e5', 'rgba(79,70,229,0.08)')}>
                <FiBarChart2 size={16} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '14px', color: colors.slate }}>Distribución por rol</span>
            </div>
            <span style={{ fontSize: '12px', color: colors.slateLighter, fontWeight: 600 }}>
              {roleData.reduce((s, r) => s + r.value, 0)} usuarios
            </span>
          </div>
          <div style={{ padding: '8px 4px 4px' }}>
            {roleData.length === 0 ? (
              <EmptyState icon={FiUsers} title="Sin datos" description="No hay usuarios registrados" />
            ) : (
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart data={roleData} margin={{ top: 20, right: 16, left: -8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e8ecf1' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(79,70,229,0.04)' }} />
                  <Bar dataKey="value" name="Usuarios" radius={[6, 6, 0, 0]} barSize={isMobile ? 28 : 44}>
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rg-chart2" style={cardBase}>
          <div style={cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ ...iconBox('#10b981', '#ecfdf5') }}>
                <FiGrid size={16} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '14px', color: colors.slate }}>Asignación de condominios</span>
            </div>
            <span style={{ fontSize: '12px', color: colors.slateLighter, fontWeight: 600 }}>
              {condominios.length} total
            </span>
          </div>
          <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {condominios.length === 0 ? (
              <EmptyState icon={FiGrid} title="Sin datos" description="No hay condominios registrados" />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={isMobile ? 200 : chartHeight}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Con administrador', value: withAdmin },
                        { name: 'Sin administrador', value: withoutAdmin },
                      ].filter(d => d.value > 0)}
                      cx="50%" cy="50%"
                      innerRadius={isMobile ? 42 : 55}
                      outerRadius={isMobile ? 72 : 85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {[withAdmin, withoutAdmin].filter(v => v > 0).map((_, i) => (
                        <Cell key={i} fill={i === 0 ? '#10b981' : '#f59e0b'} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  display: 'flex', gap: 16, marginTop: 8,
                  flexWrap: 'wrap', justifyContent: 'center',
                }}>
                  {withAdmin > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: '999px', background: '#f8fafc', border: `1px solid ${colors.border}` }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                      <span style={{ fontSize: '12px', color: colors.slateLight, fontWeight: 600 }}>Con admin: <strong style={{ color: colors.slate }}>{withAdmin}</strong></span>
                    </div>
                  )}
                  {withoutAdmin > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: '999px', background: '#f8fafc', border: `1px solid ${colors.border}` }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
                      <span style={{ fontSize: '12px', color: colors.slateLight, fontWeight: 600 }}>Sin admin: <strong style={{ color: colors.slate }}>{withoutAdmin}</strong></span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="rg-chart3" style={cardBase}>
          <div style={cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ ...iconBox('#10b981', '#ecfdf5') }}>
                <FiUsers size={16} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '14px', color: colors.slate }}>Estado de administradores</span>
            </div>
            <span style={{ fontSize: '12px', color: colors.slateLighter, fontWeight: 600 }}>
              {admins.length} total
            </span>
          </div>
          <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {admins.length === 0 ? (
              <EmptyState icon={FiUsers} title="Sin datos" description="No hay administradores registrados" />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Activos', value: activeAdmins },
                        { name: 'Inactivos', value: inactiveAdmins },
                      ].filter(d => d.value > 0)}
                      cx="50%" cy="50%"
                      innerRadius={isMobile ? 38 : 48}
                      outerRadius={isMobile ? 65 : 78}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {activeAdmins > 0 && <Cell fill="#10b981" />}
                      {inactiveAdmins > 0 && <Cell fill="#ef4444" />}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  display: 'flex', gap: 16, marginTop: 6,
                  flexWrap: 'wrap', justifyContent: 'center',
                }}>
                  {activeAdmins > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: '999px', background: '#f8fafc', border: `1px solid ${colors.border}` }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                      <span style={{ fontSize: '12px', color: colors.slateLight, fontWeight: 600 }}>Activos: <strong style={{ color: colors.slate }}>{activeAdmins}</strong></span>
                    </div>
                  )}
                  {inactiveAdmins > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: '999px', background: '#f8fafc', border: `1px solid ${colors.border}` }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
                      <span style={{ fontSize: '12px', color: colors.slateLight, fontWeight: 600 }}>Inactivos: <strong style={{ color: colors.slate }}>{inactiveAdmins}</strong></span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="rg-chart4" style={cardBase}>
          <div style={cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ ...iconBox('#3b82f6', '#eff6ff') }}>
                <FiActivity size={16} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '14px', color: colors.slate }}>Estado de usuarios</span>
            </div>
            <span style={{ fontSize: '12px', color: colors.slateLighter, fontWeight: 600 }}>
              {users.length} total
            </span>
          </div>
          <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {users.length === 0 ? (
              <EmptyState icon={FiActivity} title="Sin datos" description="No hay usuarios registrados" />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Activos', value: activeUsers },
                        { name: 'Inactivos', value: inactiveUsers },
                      ].filter(d => d.value > 0)}
                      cx="50%" cy="50%"
                      innerRadius={isMobile ? 38 : 48}
                      outerRadius={isMobile ? 65 : 78}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {activeUsers > 0 && <Cell fill="#10b981" />}
                      {inactiveUsers > 0 && <Cell fill="#ef4444" />}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  display: 'flex', gap: 16, marginTop: 6,
                  flexWrap: 'wrap', justifyContent: 'center',
                }}>
                  {activeUsers > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: '999px', background: '#f8fafc', border: `1px solid ${colors.border}` }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                      <span style={{ fontSize: '12px', color: colors.slateLight, fontWeight: 600 }}>Activos: <strong style={{ color: colors.slate }}>{activeUsers}</strong></span>
                    </div>
                  )}
                  {inactiveUsers > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: '999px', background: '#f8fafc', border: `1px solid ${colors.border}` }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
                      <span style={{ fontSize: '12px', color: colors.slateLight, fontWeight: 600 }}>Inactivos: <strong style={{ color: colors.slate }}>{inactiveUsers}</strong></span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="rg-metrics" style={cardBase}>
        <div style={cardHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={iconBox(SUPER.primary, SUPER.primaryBg)}>
              <FiHome size={16} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '14px', color: colors.slate }}>
              {condoSeleccionado && !showCardSelector
                ? `Métricas: ${condoActual?.nombre || ''}`
                : 'Métricas por condominio'
              }
            </span>
          </div>
          {condoSeleccionado && !showCardSelector && (
            <button
              onClick={() => setShowCardSelector(true)}
              onMouseEnter={(e) => { e.currentTarget.style.background = SUPER.primaryBg; e.currentTarget.style.borderColor = SUPER.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = SUPER.primary; }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: '8px',
                border: `1px solid ${SUPER.primary}`,
                background: 'transparent', color: SUPER.primary,
                fontWeight: 700, fontSize: '12px',
                cursor: 'pointer', transition,
              }}
            >
              <FiGrid size={13} /> Cambiar condominio
            </button>
          )}
        </div>

        {(!condoSeleccionado || showCardSelector) && (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  backgroundColor: 'rgba(124,58,237,0.1)',
                  padding: '0.6rem',
                  borderRadius: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FiGrid size={20} color={SUPER.primary} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                    {condoSeleccionado ? 'Seleccionar otro condominio' : 'Selecciona un condominio'}
                  </h2>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                    {condoSearch
                      ? `${filteredCondominios.length} de ${condominios.length} condominios`
                      : `${condominios.length} ${condominios.length === 1 ? 'condominio disponible' : 'condominios disponibles'}`
                    }
                  </span>
                </div>
              </div>

              <div style={{ width: '260px', maxWidth: '100%', position: 'relative' }}>
                <FiSearch size={14} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Buscar condominio..."
                  value={condoSearch}
                  onChange={e => setCondoSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.5rem 0.5rem 2.2rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${colors.border}`,
                    fontSize: '0.85rem',
                    color: '#334155',
                    backgroundColor: '#ffffff',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
              gap: '14px',
            }}>
              {filteredCondominios.map((c, idx) => {
                const isSelected = String(c.id) === String(condoSeleccionado);
                const [color1, color2] = coloresGradiente[idx % coloresGradiente.length];

                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => { setCondoSeleccionado(String(c.id)); setShowCardSelector(false); }}
                    style={{
                      background: isSelected ? `linear-gradient(145deg, #ffffff, ${color1}04)` : '#ffffff',
                      border: isSelected ? `2px solid ${color1}` : '1.5px solid #e8ecf1',
                      borderRadius: '1.25rem',
                      boxShadow: isSelected
                        ? `0 0 0 4px ${color1}15, 0 8px 32px ${color1}20, 0 2px 8px rgba(0,0,0,0.04)`
                        : '0 2px 8px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)',
                      cursor: 'pointer',
                      display: 'block',
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      lineHeight: 'inherit',
                      overflow: 'hidden',
                      padding: 0,
                      position: 'relative',
                      textAlign: 'left',
                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      width: '100%',
                      opacity: (condoSeleccionado && !isSelected) ? 0.55 : 1,
                      filter: (condoSeleccionado && !isSelected) ? 'grayscale(0.3) saturate(0.7)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected && !condoSeleccionado) {
                        e.currentTarget.style.transform = 'scale(1.03) translateY(-3px)';
                        e.currentTarget.style.boxShadow = `0 12px 40px ${color1}15, 0 4px 12px rgba(0,0,0,0.06)`;
                        e.currentTarget.style.borderColor = color1;
                      } else if (!isSelected) {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = `0 8px 25px ${color1}10, 0 4px 10px rgba(0,0,0,0.04)`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)';
                        e.currentTarget.style.borderColor = '#e8ecf1';
                      }
                    }}
                  >
                    <div style={{
                      height: '5px',
                      background: `linear-gradient(90deg, ${color1}, ${color2}, ${color1})`,
                      backgroundSize: '200% 100%',
                      borderRadius: '1.25rem 1.25rem 0 0',
                    }} />
                    <div style={{ padding: '14px 16px 12px' }}>
                      <div style={{
                        width: '40px', height: '40px',
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${color1}18, ${color2}08)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '10px',
                        border: `1px solid ${color1}22`,
                      }}>
                        <FiHome size={20} color={color1} />
                      </div>
                      <h3 style={{
                        margin: 0, fontSize: '14px', fontWeight: 800,
                        color: colors.slate, lineHeight: 1.35, marginBottom: '3px',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {c.nombre}
                      </h3>
                      {c.direccion && (
                        <p style={{
                          margin: 0, fontSize: '11px', color: colors.slateLighter,
                          fontWeight: 500, marginBottom: '8px',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {c.direccion}
                        </p>
                      )}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap',
                      }}>
                        {c.nombreCiudad && (
                          <span style={{
                            fontSize: '10px', fontWeight: 700, color: '#475569',
                            background: '#f1f4f9', padding: '2px 8px',
                            borderRadius: '999px', border: '1px solid #e8ecf1',
                          }}>
                            <FiMapPin size={7} style={{ marginRight: 2 }} />{c.nombreCiudad}
                          </span>
                        )}
                        <span style={{
                          fontSize: '10px', fontWeight: 700,
                          padding: '2px 8px', borderRadius: '999px',
                          background: c.activo !== false ? '#ecfdf5' : '#fef2f2',
                          color: c.activo !== false ? '#059669' : '#dc2626',
                          border: `1px solid ${c.activo !== false ? '#a7f3d0' : '#fecaca'}`,
                        }}>
                          {c.activo !== false ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      {isSelected && (
                        <div style={{
                          position: 'absolute', top: '8px', right: '8px',
                          width: '24px', height: '24px', borderRadius: '50%',
                          background: `linear-gradient(135deg, ${color1}, ${color2})`,
                          color: '#fff', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '11px', fontWeight: 700,
                          boxShadow: `0 3px 10px ${color1}40, 0 0 0 4px ${color1}15`,
                          animation: 'cardSelectedPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}>
                          <FiCheck size={13} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
              {filteredCondominios.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  <p style={{ fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>Ningún condominio coincide con tu búsqueda</p>
                </div>
              )}
            </div>
          </div>
        )}

        {condoSeleccionado && !showCardSelector && (
          <div style={{ padding: '20px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
              border: '1px solid rgba(124,58,237,0.12)',
              marginBottom: '16px',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '10px',
                background: `linear-gradient(135deg, ${SUPER.primary}, ${SUPER.primaryDark})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FiHome size={18} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '15px', color: colors.slate }}>
                  {condoActual?.nombre || 'Condominio'}
                </div>
                <div style={{ fontSize: '12px', color: '#6d28d9', fontWeight: 600 }}>
                  {condoActual?.direccion || condoActual?.nombreCiudad || 'Sin dirección'}
                </div>
              </div>
            </div>

            {loadingAdminMetrics ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  border: `3px solid ${colors.border}`,
                  borderTopColor: SUPER.primary,
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto 12px',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <span style={{ color: colors.slateLight, fontSize: '13px', fontWeight: 600 }}>
                  Cargando métricas...
                </span>
              </div>
            ) : !adminMetrics ? (
              <EmptyState
                icon={FiBarChart2}
                title="Sin métricas disponibles"
                description="No se pudieron cargar las métricas para este condominio."
              />
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '12px',
              }}>
                {[
                  { label: 'Torres', value: adminMetrics.totalTorres || 0, icon: <FiLayers size={18} />, color: SUPER.primary, bg: SUPER.primaryBg },
                  { label: 'Pisos', value: adminMetrics.totalPisos || 0, icon: <FiBox size={18} />, color: '#3b82f6', bg: '#eff6ff' },
                  { label: 'Apartamentos', value: adminMetrics.totalApartamentos || 0, icon: <FiHome size={18} />, color: '#10b981', bg: '#ecfdf5' },
                  { label: 'Propietarios', value: adminMetrics.totalPropietarios || 0, icon: <FiUserCheck size={18} />, color: '#f59e0b', bg: '#fffbeb' },
                  { label: 'Vehículos', value: adminMetrics.totalVehiculos || 0, icon: <FiTruck size={18} />, color: '#ef4444', bg: '#fef2f2' },
                  { label: 'Carritos', value: adminMetrics.totalCarritos || 0, icon: <FiBox size={18} />, color: '#8b5cf6', bg: '#f5f3ff' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: colors.white,
                      borderRadius: '14px',
                      border: `1px solid ${colors.border}`,
                      padding: '14px 12px 12px',
                      textAlign: 'center',
                      transition,
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = shadow.md;
                      e.currentTarget.style.borderColor = item.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = colors.border;
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: '10px',
                      background: item.bg, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 8px', color: item.color,
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: colors.slate, lineHeight: 1.1, marginBottom: 2 }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: '11px', color: colors.slateLighter, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 8, padding: '6px 0', marginTop: '8px',
        color: colors.slateLighter, fontSize: '12px', fontWeight: 500,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#10b981', display: 'inline-block',
          animation: 'pulseDot 2s ease infinite',
        }} />
        Reportes actualizados · Datos agregados del sistema
        <span style={{ width: 3, height: 3, borderRadius: '50%', background: colors.slateLighter, display: 'inline-block' }} />
        <FiTrendingUp size={12} /> {condominios.length} condominios monitoreados
      </div>
    </div>
  );
}
