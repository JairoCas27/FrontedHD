import { useState, useEffect } from 'react';
import { FiClock, FiRefreshCw, FiAlertCircle, FiCheckCircle, FiTruck, FiHome } from 'react-icons/fi';
import {
  getCondominiums,
  getAdminLogs,
  extractItems,
} from '../../services/api';

const COLORS = {
  primary: '#4f46e5', success: '#10b981', warning: '#f59e0b',
  danger: '#ef4444', info: '#3b82f6', purple: '#8b5cf6',
};

export default function AuditoriaGlobal() {
  const [condominios, setCondominios] = useState([]);
  const [condoSeleccionado, setCondoSeleccionado] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState('VEHICULAR');
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  useEffect(() => {
    getCondominiums().then(d => setCondominios(extractItems(d))).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cargarLogs = async (showLoading = true) => {
    if (!condoSeleccionado) return;
    if (showLoading) setLogsLoading(true);
    setError(null);
    try {
      const res = await getAdminLogs(condoSeleccionado, {
        type: tipoFiltro,
        page: pagina,
        size: 20,
      });
      setLogs(extractItems(res));
      setTotalPaginas(res?.totalPages || 0);
    } catch (err) {
      setError(err.message);
      setLogs([]);
    } finally {
      if (showLoading) setLogsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setPagina(0);
    if (condoSeleccionado) cargarLogs();
    else setLogs([]);
  }, [condoSeleccionado, tipoFiltro]);

  useEffect(() => {
    if (condoSeleccionado) cargarLogs(false);
  }, [pagina]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 text-muted">Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 style={{ fontWeight: 800, color: '#0f172a', margin: 0 }}>Auditoría Global</h1>
          <p className="text-muted mt-1 mb-0">Registro de actividad del sistema por condominio</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', maxWidth: '280px' }}>
            <select className="form-select" value={condoSeleccionado}
              onChange={(e) => setCondoSeleccionado(e.target.value)}>
              <option value="">Seleccionar condominio</option>
              {condominios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div style={{ minWidth: '160px' }}>
            <select className="form-select" value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}>
              <option value="VEHICULAR">Acceso vehicular</option>
              <option value="CARRITO">Préstamo carritos</option>
            </select>
          </div>
          <button
            onClick={() => { setRefreshing(true); cargarLogs(false); }}
            disabled={!condoSeleccionado || refreshing}
            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
          >
            <FiRefreshCw size={14} className={refreshing ? 'spinner-border spinner-border-sm' : ''} />
            Actualizar
          </button>
        </div>
      </div>

      {!condoSeleccionado ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8', fontWeight: 600 }}>
          <FiClock size={48} style={{ opacity: 0.4, marginBottom: '1rem' }} />
          <p>Selecciona un condominio para ver sus registros de actividad</p>
        </div>
      ) : logsLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : error ? (
        <div className="text-center py-5 text-danger">
          <FiAlertCircle size={24} />
          <p className="mt-2"><strong>Error:</strong> {error}</p>
        </div>
      ) : logs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <FiClock size={36} style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
          <p>No hay registros de {tipoFiltro === 'VEHICULAR' ? 'acceso vehicular' : 'préstamo de carritos'} en este condominio</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0" style={{ fontSize: '0.875rem' }}>
              <thead style={{ backgroundColor: '#f8fafc', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <tr>
                  {tipoFiltro === 'VEHICULAR' ? (
                    <>
                      <th style={{ padding: '0.75rem 1rem' }}>Placa</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Ocupante</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Método</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Entrada</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Salida</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Estado</th>
                    </>
                  ) : (
                    <>
                      <th style={{ padding: '0.75rem 1rem' }}>Solicitante</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Nombre</th>
                      <th style={{ padding: '0.75rem 1rem' }}>DNI</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Préstamo</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Devolución</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Penalización</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {tipoFiltro === 'VEHICULAR' ? (
                      <>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, fontFamily: 'monospace' }}>{log.placa || '—'}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{log.ocupante || '—'}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '0.35rem', backgroundColor: 'rgba(79,70,229,0.08)', color: COLORS.primary }}>
                            {log.metodo || '—'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>{formatDate(log.fechaEntrada)}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>{formatDate(log.fechaSalida)}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          {log.fechaSalida ? (
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '0.35rem', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                              <FiCheckCircle size={12} style={{ marginRight: '3px' }} /> Completado
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '0.35rem', backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                              <FiClock size={12} style={{ marginRight: '3px' }} /> En curso
                            </span>
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '0.75rem 1rem' }}>{log.solicitante || '—'}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{log.nombreSolicitante || '—'}</td>
                        <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace' }}>{log.dniSolicitante || '—'}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>{formatDate(log.fechaPrestamo)}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>{formatDate(log.fechaDevolucion)}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          {log.penalizacion > 0 ? (
                            <span style={{ fontWeight: 700, color: '#ef4444' }}>${Number(log.penalizacion).toFixed(2)}</span>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>—</span>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPaginas > 1 && (
            <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              <button className="btn btn-outline-secondary btn-sm" disabled={pagina === 0}
                onClick={() => setPagina(p => p - 1)}>Anterior</button>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Página {pagina + 1} de {totalPaginas}</span>
              <button className="btn btn-outline-secondary btn-sm" disabled={pagina >= totalPaginas - 1}
                onClick={() => setPagina(p => p + 1)}>Siguiente</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}