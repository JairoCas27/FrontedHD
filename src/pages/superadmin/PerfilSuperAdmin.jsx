import { useState, useEffect } from 'react';
import { getProfile, updateProfile, changePassword } from '../../services/SuperAdminApi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff,
  FiShield, FiCalendar, FiMonitor, FiGlobe, FiCheckCircle,
  FiSave, FiTrendingUp,
} from 'react-icons/fi';
import { colors, radius, shadow, transition } from '../../theme/colors';
import Loading from '../../components/common/Loading';

const SUPER = {
  primary: '#7c3aed',
  primaryDark: '#6d28d9',
  primaryBg: 'rgba(124,58,237,0.08)',
};

const cardBase = {
  background: colors.white,
  borderRadius: radius.lg,
  border: `1px solid ${colors.border}`,
  boxShadow: shadow.sm,
  transition: 'all 0.25s ease',
  overflow: 'hidden',
};

const cardHeaderStyle = {
  padding: '16px 22px',
  borderBottom: `1px solid ${colors.border}`,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontWeight: 700,
  fontSize: '14px',
  color: colors.slate,
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: radius.sm,
  border: '1px solid #cbd5e1',
  fontSize: '14px',
  color: colors.slate,
  backgroundColor: colors.white,
  boxSizing: 'border-box',
  outline: 'none',
  transition,
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 700,
  color: colors.slateLight,
  marginBottom: '6px',
  letterSpacing: '0.02em',
};

export default function PerfilSuperAdmin() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    getProfile()
      .then(data => setProfile(data))
      .catch(err => toast.error(`Error al cargar perfil: ${err.message}`))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const updated = await updateProfile(profile);
      setProfile(updated);
      login(updated);
      toast.success('Perfil actualizado correctamente.');
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordData.currentPassword || passwordData.currentPassword.length < 6) {
      setPasswordError('La contraseña actual debe tener al menos 6 caracteres.');
      return;
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 8) {
      setPasswordError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError('La nueva contraseña debe ser diferente a la actual.');
      return;
    }

    setPasswordSubmitting(true);
    try {
      await changePassword({
        contrasenaActual: passwordData.currentPassword,
        nuevaContrasena: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Contraseña cambiada correctamente.');
    } catch (err) {
      setPasswordError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.background }}>
        <Loading text="Cargando perfil..." />
      </div>
    );
  }

  const initials = ((profile.nombres?.[0] || '') + (profile.apellidos?.[0] || '')).toUpperCase() || '?';

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
        .ps-card {
          animation: fadeSlideUp 0.45s ease both;
        }
        .ps-card:nth-child(1) { animation-delay: 0.05s; }
        .ps-card:nth-child(2) { animation-delay: 0.1s; }
        .ps-card:nth-child(3) { animation-delay: 0.15s; }
        .ps-input:focus {
          border-color: ${SUPER.primary} !important;
          box-shadow: 0 0 0 3px ${SUPER.primaryBg} !important;
        }
        .ps-input:hover {
          border-color: #94a3b8;
        }
        .ps-btn { transition: ${transition}; }
        .ps-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(124,58,237,0.25);
        }
        .ps-btn-warning:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(245,158,11,0.25);
        }
      `}</style>

      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* ─── Profile Header ────────────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #e0e7ff 100%)',
          borderRadius: radius.lg,
          padding: isMobile ? '20px' : '28px 32px',
          marginBottom: '22px',
          border: '1px solid rgba(124,58,237,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(124,58,237,0.3), 0 0 0 4px rgba(124,58,237,0.1)',
            flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '24px', letterSpacing: '-0.02em' }}>
              {initials}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <h1 style={{
              margin: 0, fontWeight: 800, fontSize: isMobile ? '20px' : '24px',
              color: colors.slate, letterSpacing: '-0.03em',
            }}>
              {profile.nombres || 'Usuario'} {profile.apellidos || ''}
            </h1>
            <p style={{
              margin: '3px 0 0', fontSize: '14px', color: '#6d28d9', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <FiShield size={14} /> Super Administrador
            </p>
            <p style={{
              margin: '2px 0 0', fontSize: '13px', color: colors.slateLighter, fontWeight: 500,
            }}>
              {profile.correo || 'Sin correo'}
            </p>
          </div>
        </div>

        {/* ─── Two-column layout ──────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
          gap: '18px',
          marginBottom: '18px',
        }}>

          {/* ─── LEFT: Profile Data ──────────────────────────────────────── */}
          <div className="ps-card" style={cardBase}>
            <div style={cardHeaderStyle}>
              <div style={{
                width: 32, height: 32, borderRadius: '8px',
                background: SUPER.primaryBg, display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: SUPER.primary,
              }}>
                <FiUser size={16} />
              </div>
              Datos personales
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle} htmlFor="nombres">Nombres</label>
                  <input
                    id="nombres"
                    className="ps-input"
                    type="text"
                    value={profile.nombres || ''}
                    onChange={(e) => setProfile({ ...profile, nombres: e.target.value })}
                    style={inputStyle}
                    placeholder="Tus nombres"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="apellidos">Apellidos</label>
                  <input
                    id="apellidos"
                    className="ps-input"
                    type="text"
                    value={profile.apellidos || ''}
                    onChange={(e) => setProfile({ ...profile, apellidos: e.target.value })}
                    style={inputStyle}
                    placeholder="Tus apellidos"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="correo">
                    <FiMail size={12} style={{ marginRight: 4 }} /> Correo electrónico
                  </label>
                  <input
                    id="correo"
                    className="ps-input"
                    type="email"
                    value={profile.correo || ''}
                    onChange={(e) => setProfile({ ...profile, correo: e.target.value })}
                    style={inputStyle}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="telefono">
                    <FiPhone size={12} style={{ marginRight: 4 }} /> Teléfono
                  </label>
                  <input
                    id="telefono"
                    className="ps-input"
                    type="text"
                    value={profile.telefono || ''}
                    onChange={(e) => setProfile({ ...profile, telefono: e.target.value })}
                    style={inputStyle}
                    placeholder="Teléfono (opcional)"
                  />
                </div>
              </div>

              <div style={{
                marginTop: '20px', paddingTop: '16px',
                borderTop: `1px solid ${colors.border}`,
                display: 'flex', justifyContent: 'flex-end',
              }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="ps-btn"
                  onMouseEnter={(e) => { if (!submitting) { e.currentTarget.style.background = SUPER.primaryDark; } }}
                  onMouseLeave={(e) => { if (!submitting) { e.currentTarget.style.background = SUPER.primary; } }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 22px', borderRadius: '10px',
                    border: 'none',
                    background: submitting ? '#a78bfa' : SUPER.primary,
                    color: '#fff', fontWeight: 700, fontSize: '14px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    transition,
                    boxShadow: '0 4px 14px rgba(124,58,237,0.2)',
                  }}
                >
                  <FiSave size={16} />
                  {submitting ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>

          {/* ─── RIGHT COLUMN ────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Password change */}
            <div className="ps-card" style={cardBase}>
              <div style={cardHeaderStyle}>
                <div style={{
                  width: 32, height: 32, borderRadius: '8px',
                  background: 'rgba(245,158,11,0.12)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#d97706',
                }}>
                  <FiLock size={16} />
                </div>
                Cambiar contraseña
              </div>
              <form onSubmit={handlePasswordChange} style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={labelStyle} htmlFor="currentPassword">Contraseña actual</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="currentPassword"
                        className="ps-input"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        style={{ ...inputStyle, paddingRight: '40px' }}
                        placeholder="••••••••"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        style={{
                          position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: colors.slateLighter, padding: '4px', display: 'flex',
                        }}
                      >
                        {showPasswords.current ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="newPassword">Nueva contraseña</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="newPassword"
                        className="ps-input"
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        style={{ ...inputStyle, paddingRight: '40px' }}
                        placeholder="Mínimo 8 caracteres"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        style={{
                          position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: colors.slateLighter, padding: '4px', display: 'flex',
                        }}
                      >
                        {showPasswords.new ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                    <small style={{ color: '#94a3b8', fontSize: '11px', display: 'block', marginTop: '4px' }}>
                      Mínimo 8 caracteres
                    </small>
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="confirmPassword">Confirmar nueva contraseña</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="confirmPassword"
                        className="ps-input"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        style={{ ...inputStyle, paddingRight: '40px' }}
                        placeholder="Repite la nueva contraseña"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        style={{
                          position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: colors.slateLighter, padding: '4px', display: 'flex',
                        }}
                      >
                        {showPasswords.confirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {passwordError && (
                  <div style={{
                    marginTop: '12px', padding: '10px 14px',
                    borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                    background: '#fef2f2', color: '#dc2626',
                    border: '1px solid rgba(239,68,68,0.2)',
                  }}>
                    {passwordError}
                  </div>
                )}

                <div style={{
                  marginTop: '16px', paddingTop: '14px',
                  borderTop: `1px solid ${colors.border}`,
                  display: 'flex', justifyContent: 'flex-end',
                }}>
                  <button
                    type="submit"
                    disabled={passwordSubmitting}
                    className="ps-btn-warning"
                    onMouseEnter={(e) => { if (!passwordSubmitting) { e.currentTarget.style.background = '#d97706'; } }}
                    onMouseLeave={(e) => { if (!passwordSubmitting) { e.currentTarget.style.background = '#f59e0b'; } }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 20px', borderRadius: '10px',
                      border: 'none',
                      background: passwordSubmitting ? '#fcd34d' : '#f59e0b',
                      color: '#fff', fontWeight: 700, fontSize: '13px',
                      cursor: passwordSubmitting ? 'not-allowed' : 'pointer',
                      transition,
                      boxShadow: '0 4px 14px rgba(245,158,11,0.2)',
                    }}
                  >
                    <FiLock size={15} />
                    {passwordSubmitting ? 'Cambiando...' : 'Actualizar contraseña'}
                  </button>
                </div>
              </form>
            </div>

            {/* Session info */}
            <div className="ps-card" style={cardBase}>
              <div style={cardHeaderStyle}>
                <div style={{
                  width: 32, height: 32, borderRadius: '8px',
                  background: 'rgba(16,185,129,0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#10b981',
                }}>
                  <FiMonitor size={16} />
                </div>
                Información de sesión
              </div>
              <div style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', background: '#f8fafc', borderRadius: '8px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.slateLight, fontSize: '13px' }}>
                      <FiCalendar size={14} />
                      <span>Último acceso</span>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '13px', color: colors.slate }}>
                      Hoy · Sesión activa
                    </span>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', background: '#f8fafc', borderRadius: '8px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.slateLight, fontSize: '13px' }}>
                      <FiGlobe size={14} />
                      <span>Rol</span>
                    </div>
                    <span style={{
                      fontWeight: 700, fontSize: '12px', padding: '2px 10px',
                      borderRadius: '999px',
                      background: SUPER.primaryBg, color: SUPER.primary,
                    }}>
                      Super Administrador
                    </span>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', background: '#f8fafc', borderRadius: '8px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.slateLight, fontSize: '13px' }}>
                      <FiTrendingUp size={14} />
                      <span>Estado</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#10b981', display: 'inline-block',
                        animation: 'pulseDot 2s ease infinite',
                      }} />
                      <span style={{ fontWeight: 600, fontSize: '13px', color: '#10b981' }}>Activo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ─── Footer ────────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, padding: '6px 0',
          color: colors.slateLighter, fontSize: '12px', fontWeight: 500,
        }}>
          <FiCheckCircle size={12} color="#10b981" />
          Perfil sincronizado · Datos personales protegidos
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: colors.slateLighter, display: 'inline-block' }} />
          <FiShield size={12} /> Conexión segura
        </div>

      </div>
    </div>
  );
}
