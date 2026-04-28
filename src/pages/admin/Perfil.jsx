import { useState } from 'react'
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiLock } from "react-icons/fi"
import { Card, Row, Col, Form, Button, Alert } from 'react-bootstrap'

export default function Perfil() {
  const [perfil, setPerfil] = useState({
    nombre: 'Usuario Demo',
    email: 'usuario@demo.com',
    telefono: '+51 914 646 333',
    direccion: 'Calle las Cucardas 399, Lima',
    rol: 'Administrador'
  })

  const [passwordData, setPasswordData] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  })

  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('success')

  const handlePerfilSubmit = (e) => {
    e.preventDefault()
    setMensaje('Perfil actualizado correctamente')
    setTipoMensaje('success')
    setTimeout(() => setMensaje(''), 3000)
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (passwordData.nueva !== passwordData.confirmar) {
      setMensaje('Las contraseñas no coinciden')
      setTipoMensaje('danger')
    } else if (passwordData.nueva.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres')
      setTipoMensaje('danger')
    } else {
      setMensaje('Contraseña actualizada correctamente')
      setTipoMensaje('success')
      setPasswordData({ actual: '', nueva: '', confirmar: '' })
    }
    setTimeout(() => setMensaje(''), 3000)
  }

  return (
    <div>
      <div className="mb-4">
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
          Mi Perfil
        </h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
          Datos personales y seguridad de cuenta
        </p>
      </div>

      {mensaje && (
        <Alert variant={tipoMensaje} className="mb-4">
          {mensaje}
        </Alert>
      )}

      <Row className="g-4">
        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h6 className="mb-0">
                <FiUser className="me-2" /> Información Personal
              </h6>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePerfilSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre Completo</Form.Label>
                  <Form.Control
                    type="text"
                    value={perfil.nombre}
                    onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FiMail className="me-1" /> Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={perfil.email}
                    onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FiPhone className="me-1" /> Teléfono
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    value={perfil.telefono}
                    onChange={(e) => setPerfil({ ...perfil, telefono: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FiMapPin className="me-1" /> Dirección
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={perfil.direccion}
                    onChange={(e) => setPerfil({ ...perfil, direccion: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Rol</Form.Label>
                  <Form.Control
                    type="text"
                    value={perfil.rol}
                    disabled
                    readOnly
                  />
                  <Form.Text className="text-muted">
                    El rol no puede ser modificado
                  </Form.Text>
                </Form.Group>
                <Button type="submit" variant="primary">
                  <FiSave className="me-2" /> Guardar Cambios
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h6 className="mb-0">
                <FiLock className="me-2" /> Cambiar Contraseña
              </h6>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña Actual</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordData.actual}
                    onChange={(e) => setPasswordData({ ...passwordData, actual: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nueva Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordData.nueva}
                    onChange={(e) => setPasswordData({ ...passwordData, nueva: e.target.value })}
                    required
                  />
                  <Form.Text className="text-muted">
                    Mínimo 6 caracteres
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordData.confirmar}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmar: e.target.value })}
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="warning">
                  <FiLock className="me-2" /> Actualizar Contraseña
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mt-4">
            <Card.Header className="bg-white">
              <h6 className="mb-0">Información de Sesión</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <small className="text-muted">Último acceso</small>
                  <p className="mb-0">27 de abril de 2026, 08:30 PM</p>
                </div>
                <div>
                  <small className="text-muted">IP</small>
                  <p className="mb-0">192.168.1.100</p>
                </div>
                <div>
                  <small className="text-muted">Navegador</small>
                  <p className="mb-0">Edge</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}