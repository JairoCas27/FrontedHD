import { useState, useEffect } from 'react'
import { FiSettings, FiSave, FiGlobe, FiShield, FiBell, FiMail } from "react-icons/fi"
import { Card, Row, Col, Form, Button, Alert, Tabs, Tab } from 'react-bootstrap'

const configInicial = {
  nombreCondominio: 'Urban Park',
  direccion: 'Av. Los Condores 1234',
  telefono: '+56 2 2123 4567',
  email: 'contacto@urbanpark.cl',
  horarioInicio: '08:00',
  horarioFin: '22:00',
  notificacionesEmail: true,
  notificacionesPush: true,
  accesoAutomatico: false,
  registroVisitantes: true,
  maxVisitasDiarias: 10
}

const STORAGE_KEY = 'configuracion_condominio_admin'

export default function Configuracion() {
  const [config, setConfig] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : configInicial
    } catch {
      return configInicial
    }
  })

  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('success')

  // Sincroniza con localStorage cada vez que config cambie
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    } catch {
      console.error('Error al guardar en localStorage')
    }
  }, [config])


  const handleSubmit = (e) => {
    e.preventDefault()
    setMensaje('Configuración guardada correctamente')
    setTipoMensaje('success')
    setTimeout(() => setMensaje(''), 3000)
  }


  return (
    <div>
      <div className="mb-4">
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
          Configuración
        </h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
          Parámetros del condominio
        </p>
      </div>


      {mensaje && (
        <Alert variant={tipoMensaje} className="mb-4">
          {mensaje}
        </Alert>
      )}


      <Form onSubmit={handleSubmit}>
        <Tabs defaultActiveKey="general" className="mb-4" fill>
          <Tab eventKey="general" title={<><FiGlobe className="me-1" /> General</>}>
            <Card className="shadow-sm mt-3">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre del Condominio</Form.Label>
                      <Form.Control
                        type="text"
                        value={config.nombreCondominio}
                        onChange={(e) => setConfig({ ...config, nombreCondominio: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dirección</Form.Label>
                      <Form.Control
                        type="text"
                        value={config.direccion}
                        onChange={(e) => setConfig({ ...config, direccion: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="text"
                        value={config.telefono}
                        onChange={(e) => setConfig({ ...config, telefono: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email de Contacto</Form.Label>
                      <Form.Control
                        type="email"
                        value={config.email}
                        onChange={(e) => setConfig({ ...config, email: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab>


          <Tab eventKey="horarios" title={<><FiBell className="me-1" /> Horarios</>}>
            <Card className="shadow-sm mt-3">
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Horario de Inicio (Acceso)</Form.Label>
                      <Form.Control
                        type="time"
                        value={config.horarioInicio}
                        onChange={(e) => setConfig({ ...config, horarioInicio: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Horario de Cierre (Acceso)</Form.Label>
                      <Form.Control
                        type="time"
                        value={config.horarioFin}
                        onChange={(e) => setConfig({ ...config, horarioFin: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Máximo de Visitas Diarias por Residente</Form.Label>
                  <Form.Control
                    type="number"
                    value={config.maxVisitasDiarias}
                    onChange={(e) => setConfig({ ...config, maxVisitasDiarias: parseInt(e.target.value) })}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Tab>


          <Tab eventKey="seguridad" title={<><FiShield className="me-1" /> Seguridad</>}>
            <Card className="shadow-sm mt-3">
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="acceso-automatico"
                    label="Acceso automático con placa reconocida"
                    checked={config.accesoAutomatico}
                    onChange={(e) => setConfig({ ...config, accesoAutomatico: e.target.checked })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="registro-visitantes"
                    label="Registro obligatorio de visitantes"
                    checked={config.registroVisitantes}
                    onChange={(e) => setConfig({ ...config, registroVisitantes: e.target.checked })}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Tab>


          <Tab eventKey="notificaciones" title={<><FiMail className="me-1" /> Notificaciones</>}>
            <Card className="shadow-sm mt-3">
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="notif-email"
                    label="Notificaciones por Email"
                    checked={config.notificacionesEmail}
                    onChange={(e) => setConfig({ ...config, notificacionesEmail: e.target.checked })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="notif-push"
                    label="Notificaciones Push"
                    checked={config.notificacionesPush}
                    onChange={(e) => setConfig({ ...config, notificacionesPush: e.target.checked })}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>


        <div className="text-end mt-4">
          <Button type="submit" variant="primary" size="lg">
            <FiSave className="me-2" /> Guardar Configuración
          </Button>
        </div>
      </Form>
    </div>
  )
}