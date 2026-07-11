import { useState, useEffect } from 'react';
import { FiClock, FiRefreshCw, FiAlertCircle, FiCheckCircle, FiTruck, FiHome, FiGrid, FiCheck, FiMapPin } from 'react-icons/fi';
import {
  getCondominiums,
  getAdminLogs,
  extractItems,
} from '../../services/api';

const COLORS = {
  primary: '#4f46e5', success: '#10b981', warning: '#f59e0b',
  danger: '#ef4444', info: '#3b82f6', purple: '#8b5cf6',
};

const colorSuper = "rgb(124,58,237)"

const coloresGradiente = [
  ['#7c3aed', '#6d28d9'],
  ['#ec4899', '#be185d'],
  ['#3b82f6', '#1d4ed8'],
  ['#10b981', '#047857'],
  ['#f59e0b', '#b45309'],
  ['#ef4444', '#b91c1c'],
  ['#06b6d4', '#0891b2'],
  ['#8b5cf6', '#6d28d9'],
]

export default function AuditoriaGlobal() {
  const [condominios, setCondominios] = useState([]);
  const [condoSeleccionado, setCondoSeleccionado] = useState('');
  const [showCardSelector, setShowCardSelector] = useState(false);
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

            <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes cardSelectedPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* --- VISTA COMPACTA --- */}
      {condoSeleccionado && !showCardSelector && (
        <div style={{
          background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
          borderRadius: '1rem',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          border: '1px solid rgba(124,58,237,0.15)',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              backgroundColor: 'rgba(124,58,237,0.12)',
              padding: '0.6rem',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiGrid size={20} color={colorSuper} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>
                {(condominios.find(x => String(x.id) === String(condoSeleccionado)))?.nombre || 'Condominio'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6d28d9', fontWeight: '600' }}>
                {(condominios.find(x => String(x.id) === String(condoSeleccionado)))?.direccion || ''} &mdash; {condominios.length} condominios
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowCardSelector(true)}
            style={{
              backgroundColor: 'rgba(124,58,237,0.1)',
              color: colorSuper,
              border: '1px solid rgba(124,58,237,0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '0.65rem',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.2)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <FiGrid size={14} />
            Seleccionar otro condominio
          </button>
        </div>
      )}

      {/* --- SELECTOR DE CONDOMINIOS (TARJETAS) --- */}
      {(!condoSeleccionado || showCardSelector) && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{
              backgroundColor: 'rgba(124,58,237,0.1)',
              padding: '0.6rem',
              borderRadius: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiGrid size={20} color={colorSuper} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                {condoSeleccionado ? 'Seleccionar otro condominio' : 'Selecciona un condominio'}
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                {condominios.length} {condominios.length === 1 ? 'condominio disponible' : 'condominios disponibles'}
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1rem'
          }}>
            {condominios.map((c, idx) => {
              const isSelected = String(c.id) === String(condoSeleccionado)
              const [color1, color2] = coloresGradiente[idx % coloresGradiente.length]

              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => { setCondoSeleccionado(String(c.id)); setShowCardSelector(false) }}
                  style={{
                    background: isSelected
                      ? `linear-gradient(145deg, #ffffff, ${color1}04)`
                      : '#ffffff',
                    border: isSelected
                      ? `2px solid ${color1}`
                      : '1.5px solid #e8ecf1',
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
                    transform: isSelected ? 'scale(1.03) translateY(-2px)' : 'scale(1) translateY(0)',
                    width: '100%',
                    opacity: condoSeleccionado && !isSelected ? 0.55 : 1,
                    filter: condoSeleccionado && !isSelected ? 'grayscale(0.3) saturate(0.7)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && !condoSeleccionado) {
                      e.currentTarget.style.transform = 'scale(1.03) translateY(-3px)'
                      e.currentTarget.style.boxShadow = `0 12px 40px ${color1}15, 0 4px 12px rgba(0,0,0,0.06)`
                      e.currentTarget.style.borderColor = color1
                    } else if (!isSelected) {
                      e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)'
                      e.currentTarget.style.boxShadow = `0 8px 25px ${color1}10, 0 4px 10px rgba(0,0,0,0.04)`
                      e.currentTarget.style.borderColor = '#cbd5e1'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'scale(1) translateY(0)'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)'
                      e.currentTarget.style.borderColor = '#e8ecf1'
                    }
                  }}
                >
                  {/* Barra decorativa superior con gradiente */}
                  <div style={{
                    height: '6px',
                    background: `linear-gradient(90deg, ${color1}, ${color2}, ${color1})`,
                    backgroundSize: '200% 100%',
                    borderRadius: '1.25rem 1.25rem 0 0',
                  }} />

                  <div style={{ padding: '1.25rem 1.25rem 1.15rem' }}>
                    {/* Icono */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '1rem',
                      background: `linear-gradient(135deg, ${color1}18, ${color2}08)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.85rem',
                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      border: `1px solid ${color1}22`,
                    }}>
                      <FiHome size={24} color={color1} />
                    </div>

                    {/* Nombre */}
                    <h3 style={{
                      margin: 0,
                      fontSize: '1rem',
                      fontWeight: '800',
                      color: '#0f172a',
                      lineHeight: 1.35,
                      marginBottom: '0.3rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      letterSpacing: '-0.01em',
                    }}>
                      {c.nombre}
                    </h3>

                    {/* Dirección */}
                    {c.direccion && (
                      <p style={{
                        margin: 0,
                        fontSize: '0.72rem',
                        color: '#94a3b8',
                        fontWeight: '500',
                        marginBottom: '0.85rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {c.direccion}
                      </p>
                    )}

                    {/* Separador sutil */}
                    <div style={{
                      height: '1px',
                      background: `linear-gradient(90deg, ${color1}22, transparent)`,
                      marginBottom: '0.75rem',
                    }} />

                    {/* Footer badges */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      flexWrap: 'wrap',
                    }}>
                      {c.nombreCiudad && (
                        <span style={{
                          fontSize: '0.6rem',
                          fontWeight: '700',
                          color: '#475569',
                          backgroundColor: '#f1f4f9',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          border: '1px solid #e8ecf1',
                        }}>
                          <FiMapPin size={8} color="#94a3b8" /> {c.nombreCiudad}
                        </span>
                      )}
                      <span style={{
                        fontSize: '0.6rem',
                        fontWeight: '700',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                        backgroundColor: c.activo !== false ? '#ecfdf5' : '#fef2f2',
                        color: c.activo !== false ? '#059669' : '#dc2626',
                        border: `1px solid ${c.activo !== false ? '#a7f3d0' : '#fecaca'}`,
                      }}>
                        {c.activo !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    {/* Indicador de seleccionado */}
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${color1}, ${color2})`,
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        boxShadow: `0 3px 10px ${color1}40, 0 0 0 4px ${color1}15`,
                      }}>
                        <FiCheck size={15} />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
      {/* --- FILTROS DE LOGS --- */}
      {condoSeleccionado && (
        <div style={{ backgroundColor: '#ffffff', padding: '0.85rem 1.25rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
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
      )}

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