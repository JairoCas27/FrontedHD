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
  FiClipboard,
  FiAlertCircle,
  FiMapPin,
  FiMail,
  FiBox,
  FiShield,
  FiTrendingUp,
} from 'react-icons/fi';
import {
  getSuperAdminDashboardMetrics,
  getSuperAdminRecentAdmins,
  getSuperAdminRecentCondos,
  getCondominiums,
  getAdministrators,
  getAllUsers,
} from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { colors, radius, shadow, transition } from '../../theme/colors';
import SectionHeader from '../../components/common/SectionHeader';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';

// ─── Color palette ───────────────────────────────────────────────────────────
const SUPER = {
  primary: '#7c3aed',
  primaryDark: '#6d28d9',
  primaryLight: '#ede9fe',
  primaryBg: 'rgba(124,58,237,0.08)',
};

const CHART_COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];

const STAT_COLORS = [
  { accent: SUPER.primary, bg: '#ede9fe', gradient: ['#7c3aed', '#6d28d9'] },
  { accent: '#10b981', bg: '#ecfdf5', gradient: ['#10b981', '#047857'] },
  { accent: '#f59e0b', bg: '#fffbeb', gradient: ['#f59e0b', '#b45309'] },
  { accent: '#3b82f6', bg: '#eff6ff', gradient: ['#3b82f6', '#1d4ed8'] },
];

// ─── Styles ──────────────────────────────────────────────────────────────────
const cardBase = {
  background: colors.white,
  borderRadius: radius.lg,
  border: `1px solid ${colors.border}`,
  boxShadow: shadow.sm,
  transition: 'all 0.25s ease',
  overflow: 'hidden',
};

const cardHeader = {
  padding: '18px 22px',
  borderBottom: `1px solid ${colors.border}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '8px',
};

const iconBox = (accent, bg) => ({
  width: 36,
  height: 36,
  borderRadius: radius.sm,
  background: bg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: accent,
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
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
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ─── Tooltip components ──────────────────────────────────────────────────────
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

// ─── Component ───────────────────────────────────────────────────────────────
export default function DashboardSuperAdmin() {
  const [metrics, setMetrics] = useState(null);
  const [recentAdmins, setRecentAdmins] = useState([]);
  const [allCondos, setAllCondos] = useState([]);
  const [recentCondos, setRecentCondos] = useState([]);
  const [allAdmins, setAllAdmins] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
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
      const [m, adminsData, recentCondosData, allCondosData, allAdminsData, allUsersData] = await Promise.all([
        getSuperAdminDashboardMetrics(),
        getSuperAdminRecentAdmins(),
        getSuperAdminRecentCondos(),
        getCondominiums(),
        getAdministrators(),
        getAllUsers(),
      ]);
      setMetrics(m);
      setRecentAdmins(extractItems(adminsData));
      setRecentCondos(extractItems(recentCondosData));
      setAllCondos(extractItems(allCondosData));
      setAllAdmins(extractItems(allAdminsData));
      setAllUsers(extractItems(allUsersData));
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(true); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData(false);
  };

  // ─── Derived data ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.background }}>
        <Loading text="Cargando dashboard global..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: colors.background }}>
        <div style={{ width: 56, height: 56, borderRadius: radius.md, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiAlertCircle size={28} color="#ef4444" />
        </div>
        <p style={{ color: '#dc2626', fontWeight: 600, fontSize: 15 }}><strong>Error:</strong> {error}</p>
        <button
          onClick={handleRefresh}
          onMouseEnter={(e) => { e.currentTarget.style.background = SUPER.primaryDark; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = SUPER.primary; e.currentTarget.style.transform = 'translateY(0)'; }}
          style={{ background: SUPER.primary, color: colors.white, border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  const totalCondos = allCondos.length;
  const activeCondos = allCondos.filter((c) => c.activo !== false).length;
  const inactiveCondos = totalCondos - activeCondos;
  const condoStatusData = [
    { name: 'Activos', value: activeCondos },
    { name: 'Inactivos', value: inactiveCondos },
  ].filter((item) => item.value > 0);

  const lastCondos = [...recentCondos]
    .sort((a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0))
    .slice(0, 4);
  const lastAdmins = recentAdmins.slice(0, 4);

  const adminTotal = allAdmins.length || metrics?.totalAdministradores || 0;
  const adminsActive = allAdmins.filter((a) => a.activo).length;
  const adminsInactive = adminTotal - adminsActive;
  const propietariosTotal = allUsers.filter((u) => u.rol === 'PROPIETARIO').length || metrics?.totalPropietarios || 0;
  const agentesTotal = allUsers.filter((u) => u.rol === 'AGENTE_SEGURIDAD').length || 0;
  const usuariosTotal = allUsers.length || metrics?.totalUsuarios || 0;

  const stats = [
    {
      label: 'Condominios', value: totalCondos,
      icon: <FiGrid size={22} />, ...STAT_COLORS[0],
      detail: `${activeCondos} activos · ${inactiveCondos} inactivos`,
      maxRef: totalCondos || 1,
    },
    {
      label: 'Administradores', value: adminTotal,
      icon: <FiUsers size={22} />, ...STAT_COLORS[1],
      detail: `${adminsActive} activos · ${adminsInactive} inactivos`,
      maxRef: adminTotal || 1,
    },
    {
      label: 'Propietarios', value: propietariosTotal,
      icon: <FiUserCheck size={22} />, ...STAT_COLORS[2],
      detail: 'Residentes registrados',
      maxRef: propietariosTotal || 1,
    },
    {
      label: 'Usuarios totales', value: usuariosTotal,
      icon: <FiActivity size={22} />, ...STAT_COLORS[3],
      detail: 'Todos los roles',
      maxRef: usuariosTotal || 1,
    },
  ];

  const roleData = [
    { name: 'Administradores', value: adminTotal, color: CHART_COLORS[0] },
    { name: 'Propietarios', value: propietariosTotal, color: CHART_COLORS[1] },
    { name: 'Agentes', value: agentesTotal, color: CHART_COLORS[2] },
  ].filter((d) => d.value > 0);

  const chartHeight = isMobile ? 220 : 300;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      padding: isMobile ? '16px' : '24px',
      background: colors.background,
      minHeight: '100vh',
    }}>
      {/* ─── Animated styles ──────────────────────────────────────────────── */}
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
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .sa-card      { animation: fadeSlideUp 0.45s ease both; }
        .sa-card:nth-child(1) { animation-delay: 0.03s; }
        .sa-card:nth-child(2) { animation-delay: 0.07s; }
        .sa-card:nth-child(3) { animation-delay: 0.11s; }
        .sa-card:nth-child(4) { animation-delay: 0.15s; }

        .sa-chart     { animation: fadeSlideUp 0.5s ease both; animation-delay: 0.2s; }
        .sa-chart2    { animation: fadeSlideUp 0.5s ease both; animation-delay: 0.25s; }
        .sa-list      { animation: fadeSlideUp 0.5s ease both; animation-delay: 0.3s; }
        .sa-list2     { animation: fadeSlideUp 0.5s ease both; animation-delay: 0.35s; }

        .sa-list-item {
          transition: all 0.2s ease;
        }
        .sa-list-item:hover {
          background: ${colors.background};
          padding-left: 8px;
        }
        .sa-list-item:last-child {
          border-bottom: none;
        }
      `}</style>

      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0e7ff 100%)',
        borderRadius: radius.lg,
        padding: isMobile ? '18px 20px' : '22px 28px',
        marginBottom: '22px',
        border: '1px solid rgba(124,58,237,0.12)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: radius.md,
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(124,58,237,0.25)',
          }}>
            <FiTrendingUp size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{
              margin: 0, fontWeight: 800, fontSize: isMobile ? '18px' : '22px',
              color: '#1e293b', letterSpacing: '-0.03em',
            }}>
              Dashboard Global
            </h1>
            <p style={{
              margin: '2px 0 0', fontSize: '13px', color: SUPER.primary, fontWeight: 600,
            }}>
              {metrics?.totalCondominios !== undefined
                ? `${totalCondos} condominios · ${adminTotal} administradores`
                : 'Panorama general del sistema'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)',
            padding: '8px 14px', borderRadius: '10px',
            border: '1px solid rgba(124,58,237,0.1)',
            fontSize: '12px', fontWeight: 600, color: colors.slateLight,
          }}>
            <FiCalendar size={13} color={SUPER.primary} />
            {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            onMouseEnter={(e) => {
              if (!refreshing) {
                e.currentTarget.style.background = SUPER.primaryDark;
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!refreshing) {
                e.currentTarget.style.background = SUPER.primary;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(124,58,237,0.2)';
              }
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: refreshing ? '#a78bfa' : SUPER.primary,
              color: colors.white, border: 'none',
              padding: '8px 18px', borderRadius: '10px',
              fontSize: '13px', fontWeight: 700,
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition, boxShadow: '0 4px 14px rgba(124,58,237,0.2)',
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

      {/* ─── Stat cards ───────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '22px',
      }}>
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="sa-card"
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
            {/* Gradient accent bar */}
            <div style={{
              height: 3,
              background: `linear-gradient(90deg, ${stat.gradient[0]}, ${stat.gradient[1]})`,
            }} />
            <div style={{ padding: '16px 18px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '11px', fontWeight: 700, color: colors.slateLighter,
                    textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4,
                  }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontSize: isMobile ? '26px' : '30px', fontWeight: 800,
                    color: colors.slate, lineHeight: 1.1, marginBottom: 2,
                    letterSpacing: '-0.02em',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '12px', color: colors.slateLighter, fontWeight: 500 }}>
                    {stat.detail}
                  </div>
                </div>
                <div style={{
                  ...iconBox(stat.accent, stat.bg),
                  width: 42, height: 42,
                  transition,
                }}>
                  {stat.icon}
                </div>
              </div>
              {/* Mini progress bar */}
              <div style={{
                marginTop: '12px',
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

      {/* ─── Charts row ───────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '2.2fr 1fr',
        gap: '16px',
        marginBottom: '22px',
      }}>
        {/* Bar chart – Distribución de usuarios */}
        <div className="sa-chart" style={cardBase}>
          <div style={cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={iconBox(SUPER.primary, SUPER.primaryBg)}>
                <FiUsers size={16} />
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
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
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
                  <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(124,58,237,0.04)' }} />
                  <Bar dataKey="value" name="Usuarios" radius={[6, 6, 0, 0]} barSize={isMobile ? 32 : 52}>
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pie chart – Estado de condominios */}
        <div className="sa-chart2" style={cardBase}>
          <div style={cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ ...iconBox('#10b981', '#ecfdf5') }}>
                <FiGrid size={16} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '14px', color: colors.slate }}>Estado de condominios</span>
            </div>
            <span style={{ fontSize: '12px', color: colors.slateLighter, fontWeight: 600 }}>
              {totalCondos} total
            </span>
          </div>
          <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {condoStatusData.length === 0 ? (
              <EmptyState icon={FiGrid} title="Sin datos" description="No hay condominios registrados" />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 240}>
                  <PieChart>
                    <Pie
                      data={condoStatusData}
                      cx="50%" cy="50%"
                      innerRadius={isMobile ? 42 : 60}
                      outerRadius={isMobile ? 72 : 92}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {condoStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.name === 'Activos' ? '#10b981' : '#ef4444'}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  display: 'flex', gap: 20, marginTop: 8,
                  flexWrap: 'wrap', justifyContent: 'center',
                }}>
                  {condoStatusData.map((entry) => (
                    <div key={entry.name} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '4px 12px', borderRadius: '999px',
                      background: '#f8fafc', border: `1px solid ${colors.border}`,
                    }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        backgroundColor: entry.name === 'Activos' ? '#10b981' : '#ef4444',
                        display: 'inline-block',
                      }} />
                      <span style={{ fontSize: '12px', color: colors.slateLight, fontWeight: 600 }}>
                        {entry.name}: <strong style={{ color: colors.slate }}>{entry.value}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── Lists row ────────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '16px',
        marginBottom: '22px',
      }}>
        {/* Últimos administradores */}
        <div className="sa-list" style={cardBase}>
          <div style={cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={iconBox(SUPER.primary, SUPER.primaryBg)}>
                <FiClipboard size={16} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '14px', color: colors.slate }}>Últimos administradores</span>
            </div>
            <span style={{
              background: SUPER.primaryBg,
              color: SUPER.primary, fontSize: '11px', fontWeight: 700,
              padding: '3px 10px', borderRadius: '999px',
            }}>
              {lastAdmins.length}
            </span>
          </div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {lastAdmins.length === 0 ? (
              <EmptyState icon={FiUsers} title="Sin registros" description="No hay administradores registrados" />
            ) : (
              lastAdmins.map((admin, i) => (
                <div key={admin.id || i} className="sa-list-item" style={{
                  padding: '10px 18px',
                  borderBottom: `1px solid ${colors.border}`,
                  cursor: 'default', transition, textAlign: 'left',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '10px',
                      background: 'linear-gradient(135deg, #ede9fe, #e0e7ff)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      color: SUPER.primary, fontWeight: 800, fontSize: '14px',
                    }}>
                      {(admin.nombres?.[0] || '?')}{(admin.apellidos?.[0] || '')}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: colors.slate, marginBottom: 1 }}>
                        {admin.nombres} {admin.apellidos}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: colors.slateLighter, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <FiMail size={10} /> {admin.correo}
                        </span>
                        {admin.nombreCondominio && (
                          <>
                            <span style={{ fontSize: '10px', color: colors.slateLighter }}>·</span>
                            <span style={{ fontSize: '12px', color: colors.slateLighter }}>
                              <FiBox size={10} style={{ marginRight: 2 }} />
                              {admin.nombreCondominio}
                            </span>
                          </>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <span style={{
                          fontSize: '11px', fontWeight: 700, padding: '1px 8px',
                          borderRadius: '999px',
                          background: admin.activo ? '#ecfdf5' : '#f1f4f9',
                          color: admin.activo ? '#059669' : '#64748b',
                        }}>
                          {admin.activo ? 'Activo' : 'Inactivo'}
                        </span>
                        <span style={{ fontSize: '11px', color: colors.slateLighter, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <FiClock size={10} /> {formatDate(admin.fechaCreacion)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimos condominios */}
        <div className="sa-list2" style={cardBase}>
          <div style={cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ ...iconBox('#10b981', '#ecfdf5') }}>
                <FiHome size={16} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '14px', color: colors.slate }}>Últimos condominios</span>
            </div>
            <span style={{
              background: SUPER.primaryBg,
              color: SUPER.primary, fontSize: '11px', fontWeight: 700,
              padding: '3px 10px', borderRadius: '999px',
            }}>
              {lastCondos.length}
            </span>
          </div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {lastCondos.length === 0 ? (
              <EmptyState icon={FiHome} title="Sin registros" description="No hay condominios registrados" />
            ) : (
              lastCondos.map((c, i) => (
                <div key={c.id || i} className="sa-list-item" style={{
                  padding: '10px 18px',
                  borderBottom: `1px solid ${colors.border}`,
                  cursor: 'default', transition, textAlign: 'left',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '10px',
                      background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      color: '#059669', fontWeight: 800, fontSize: '16px',
                    }}>
                      <FiBox size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: colors.slate, marginBottom: 1 }}>
                        {c.nombre}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: colors.slateLighter, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <FiMapPin size={10} /> {c.direccion || 'Sin dirección'}
                        </span>
                        {c.nombreCiudad && (
                          <>
                            <span style={{ fontSize: '10px', color: colors.slateLighter }}>·</span>
                            <span style={{ fontSize: '12px', color: colors.slateLighter }}>{c.nombreCiudad}</span>
                          </>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <span style={{
                          fontSize: '11px', fontWeight: 700, padding: '1px 8px',
                          borderRadius: '999px',
                          background: c.activo !== false ? '#ecfdf5' : '#fef2f2',
                          color: c.activo !== false ? '#059669' : '#dc2626',
                        }}>
                          {c.activo !== false ? 'Activo' : 'Inactivo'}
                        </span>
                        <span style={{ fontSize: '11px', color: colors.slateLighter, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <FiClock size={10} /> {formatDate(c.fechaCreacion)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─── Status footer ────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 8, padding: '6px 0',
        color: colors.slateLighter, fontSize: '12px', fontWeight: 500,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#10b981', display: 'inline-block',
          animation: 'pulseDot 2s ease infinite',
        }} />
        Dashboard actualizado · Datos en tiempo real
        <span style={{ width: 3, height: 3, borderRadius: '50%', background: colors.slateLighter, display: 'inline-block' }} />
        <FiShield size={12} /> Sistema seguro
      </div>
    </div>
  );
}
