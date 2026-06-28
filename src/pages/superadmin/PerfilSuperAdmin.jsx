// src/pages/superadmin/PerfilSuperAdmin.jsx
import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../../services/api';
import { Form, Button, Card, Modal } from 'react-bootstrap';

export default function PerfilSuperAdmin() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getProfile()
      .then(data => setProfile(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profile);
      setSuccess(true);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div style={{ padding: '1.5rem' }}>
      <h1 className="mb-4" style={{ fontWeight: 800, color: '#3b82f6' }}>Mi Perfil</h1>
      <Card className="border-0 shadow-sm">
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

      <Modal show={success} onHide={() => setSuccess(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizado</Modal.Title>
        </Modal.Header>
        <Modal.Body>Perfil actualizado correctamente</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSuccess(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}