// src/pages/superadmin/DashboardSuperAdmin.jsx
import { useEffect, useState } from 'react';
import { FiHome, FiUsers, FiGrid, FiActivity } from 'react-icons/fi';
import {
  getSuperAdminDashboardMetrics,
  getSuperAdminRecentAdmins,
  getSuperAdminRecentCondos,
} from '../../services/api';

export default function DashboardSuperAdmin() {
  const [metrics, setMetrics] = useState(null);
  const [recentAdmins, setRecentAdmins] = useState([]);
  const [recentCondos, setRecentCondos] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="text-center py-5">Cargando...</div>;

  const stats = [
    { title: 'Condominios', value: metrics?.totalCondominios ?? 0, icon: <FiHome size={24} />, color: '#4f46e5' },
    { title: 'Administradores', value: metrics?.totalAdministradores ?? 0, icon: <FiUsers size={24} />, color: '#10b981' },
    { title: 'Propietarios', value: metrics?.totalPropietarios ?? 0, icon: <FiUsers size={24} />, color: '#f59e0b' },
    { title: 'Usuarios Totales', value: metrics?.totalUsuarios ?? 0, icon: <FiActivity size={24} />, color: '#8b5cf6' },
  ];

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1 className="mb-4" style={{ fontWeight: 800, color: '#1e293b' }}>Dashboard Global</h1>

      <div className="row g-4 mb-4">
        {stats.map((stat, idx) => (
          <div className="col-md-3" key={idx}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-bold">{stat.title}</div>
                  <div className="fs-2 fw-bold">{stat.value}</div>
                </div>
                <div style={{ color: stat.color, background: `${stat.color}15`, padding: '12px', borderRadius: '12px' }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">Últimos administradores</div>
            <div className="card-body">
              {recentAdmins.length === 0 ? (
                <p className="text-muted">Sin datos</p>
              ) : (
                <ul className="list-unstyled">
                  {recentAdmins.map((admin) => (
                    <li key={admin.id} className="border-bottom py-2">
                      <div className="fw-bold">{admin.nombres} {admin.apellidos}</div>
                      <div className="small text-muted">{admin.correo} · {admin.nombreCondominio || 'Sin condominio'}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-bold">Últimos condominios</div>
            <div className="card-body">
              {recentCondos.length === 0 ? (
                <p className="text-muted">Sin datos</p>
              ) : (
                <ul className="list-unstyled">
                  {recentCondos.map((c) => (
                    <li key={c.id} className="border-bottom py-2">
                      <div className="fw-bold">{c.nombre}</div>
                      <div className="small text-muted">{c.direccion} · {c.ciudad}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}