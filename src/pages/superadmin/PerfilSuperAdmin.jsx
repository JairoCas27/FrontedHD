import { useState, useEffect } from 'react';
import { getProfile, updateProfile, changePassword } from '../../services/api';
import { Form, Button, Card, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function PerfilSuperAdmin() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProfile()
      .then(data => setProfile(data))
      .catch(err => {
        toast.error(`Error al cargar perfil: ${err.message}`);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateProfile(profile);
      setProfile(updated);
      login(updated);
      setSuccess(true);
      toast.success('Perfil actualizado correctamente.');
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!passwordData.currentPassword || passwordData.currentPassword.length < 6) {
      setError('La contraseña actual debe tener al menos 6 caracteres.');
      return;
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      setError('La nueva contraseña debe ser diferente a la actual.');
      return;
    }

    setSubmitting(true);
    try {
      // El backend espera "contrasenaActual" y "nuevaContrasena"
      await changePassword({
        contrasenaActual: passwordData.currentPassword,
        nuevaContrasena: passwordData.newPassword,
      });
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Contraseña cambiada correctamente.');
    } catch (err) {
      setError(err.message);
      toast.error(`Error al cambiar contraseña: ${err.message}`);
      console.error('Error detallado:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-5">Cargando...</div>;

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1 className="mb-4" style={{ fontWeight: 800, color: '#3b82f6' }}>Mi Perfil</h1>

      {/* Datos del perfil */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="profileNombres">Nombres</Form.Label>
              <Form.Control
                id="profileNombres"
                name="profileNombres"
                value={profile.nombres || ''}
                onChange={(e) => setProfile({ ...profile, nombres: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="profileApellidos">Apellidos</Form.Label>
              <Form.Control
                id="profileApellidos"
                name="profileApellidos"
                value={profile.apellidos || ''}
                onChange={(e) => setProfile({ ...profile, apellidos: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="profileCorreo">Correo</Form.Label>
              <Form.Control
                id="profileCorreo"
                name="profileCorreo"
                type="email"
                value={profile.correo || ''}
                onChange={(e) => setProfile({ ...profile, correo: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="profileTelefono">Teléfono</Form.Label>
              <Form.Control
                id="profileTelefono"
                name="profileTelefono"
                value={profile.telefono || ''}
                onChange={(e) => setProfile({ ...profile, telefono: e.target.value })}
              />
            </Form.Group>
            <Button type="submit">Actualizar perfil</Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Cambiar contraseña */}
      <Card className="border-0 shadow-sm">
        <Card.Header>Cambiar contraseña</Card.Header>
        <Card.Body>
          <Form onSubmit={handlePasswordChange}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="currentPassword">Contraseña actual</Form.Label>
              <Form.Control
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                isInvalid={!!error && error.includes('actual')}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="newPassword">Nueva contraseña</Form.Label>
              <Form.Control
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                isInvalid={!!error && error.includes('nueva')}
              />
              <Form.Text className="text-muted">
                Mínimo 6 caracteres.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="confirmPassword">Confirmar nueva contraseña</Form.Label>
              <Form.Control
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                isInvalid={!!error && error.includes('coinciden')}
              />
            </Form.Group>
            {error && <div className="text-danger mb-2">{error}</div>}
            <Button variant="warning" type="submit" disabled={submitting}>
              {submitting ? 'Cambiando...' : 'Cambiar contraseña'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Modales de éxito */}
      <Modal show={success} onHide={() => setSuccess(false)}>
        <Modal.Header closeButton><Modal.Title>Actualizado</Modal.Title></Modal.Header>
        <Modal.Body>Perfil actualizado correctamente.</Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={() => setSuccess(false)}>Cerrar</Button></Modal.Footer>
      </Modal>

      <Modal show={passwordSuccess} onHide={() => setPasswordSuccess(false)}>
        <Modal.Header closeButton><Modal.Title>Contraseña cambiada</Modal.Title></Modal.Header>
        <Modal.Body>Contraseña actualizada exitosamente.</Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={() => setPasswordSuccess(false)}>Cerrar</Button></Modal.Footer>
      </Modal>
    </div>
  );
}