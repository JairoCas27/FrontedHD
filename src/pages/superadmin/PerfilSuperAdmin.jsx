import { useState, useEffect } from 'react';
import { getProfile, updateProfile, changePassword } from '../../services/api';
import { Form, Button, Card, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

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

  useEffect(() => {
    getProfile()
      .then(data => setProfile(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateProfile(profile);
      setProfile(updated);
      // Actualizar contexto y localStorage
      login(updated);
      setSuccess(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      await changePassword({
        contrasenaActual: passwordData.currentPassword,
        contrasenaNueva: passwordData.newPassword,
      });
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-5">Cargando...</div>;

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1 className="mb-4" style={{ fontWeight: 800, color: '#3b82f6' }}>Mi Perfil</h1>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombres</Form.Label>
              <Form.Control
                value={profile.nombres || ''}
                onChange={(e) => setProfile({ ...profile, nombres: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                value={profile.apellidos || ''}
                onChange={(e) => setProfile({ ...profile, apellidos: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                value={profile.correo || ''}
                onChange={(e) => setProfile({ ...profile, correo: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                value={profile.telefono || ''}
                onChange={(e) => setProfile({ ...profile, telefono: e.target.value })}
              />
            </Form.Group>
            <Button type="submit">Actualizar perfil</Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm">
        <Card.Header>Cambiar contraseña</Card.Header>
        <Card.Body>
          <Form onSubmit={handlePasswordChange}>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña actual</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nueva contraseña</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirmar nueva contraseña</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </Form.Group>
            {error && <div className="text-danger mb-2">{error}</div>}
            <Button variant="warning" type="submit">Cambiar contraseña</Button>
          </Form>
        </Card.Body>
      </Card>

      <Modal show={success} onHide={() => setSuccess(false)}>
        <Modal.Header closeButton><Modal.Title>Actualizado</Modal.Title></Modal.Header>
        <Modal.Body>Perfil actualizado correctamente</Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={() => setSuccess(false)}>Cerrar</Button></Modal.Footer>
      </Modal>

      <Modal show={passwordSuccess} onHide={() => setPasswordSuccess(false)}>
        <Modal.Header closeButton><Modal.Title>Contraseña cambiada</Modal.Title></Modal.Header>
        <Modal.Body>Contraseña actualizada exitosamente</Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={() => setPasswordSuccess(false)}>Cerrar</Button></Modal.Footer>
      </Modal>
    </div>
  );
}