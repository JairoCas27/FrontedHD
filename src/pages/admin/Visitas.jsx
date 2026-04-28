import { useState } from 'react'
import { FiUserCheck, FiCheckCircle, FiXCircle, FiSearch, FiClock } from "react-icons/fi"
import { Table, Button, Form, Card, Row, Col, Badge, Modal } from 'react-bootstrap'

const visitasIniciales = [
  { id: 1, nombre: 'Pedro González', residente: 'Carlos López', fecha: '2025-04-27', horaEntrada: '10:00', horaSalida: null, estado: 'Activa', motivo: 'Visita familiar' },
  { id: 2, nombre: 'Laura Fernández', residente: 'Ana Martínez', fecha: '2025-04-27', horaEntrada: '11:30', horaSalida: null, estado: 'Activa', motivo: 'Reunión de trabajo' },
  { id: 3, nombre: 'Roberto Díaz', residente: 'Juan Pérez', fecha: '2025-04-26', horaEntrada: '15:00', horaSalida: '17:30', estado: 'Finalizada', motivo: 'Servicio técnico' },
]

export default function Visitas() {
  const [visitas, setVisitas] = useState(visitasIniciales)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ nombre: '', residente: '', motivo: '' })

  // Función para registrar una nueva visita
  const handleRegistrarVisita = () => {
    const nuevaVisita = {
      id: Math.max(...visitas.map(v => v.id)) + 1,
      ...formData,
      fecha: new Date().toISOString().split('T')[0],
      horaEntrada: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      horaSalida: null,
      estado: 'Activa'
    }
    setVisitas([nuevaVisita, ...visitas])
    setShowModal(false)
    setFormData({ nombre: '', residente: '', motivo: '' })
  }

  // Función para registrar la salida de una visita
  const handleRegistrarSalida = (id) => {
    setVisitas(visitas.map(v =>
      v.id === id
        ? { ...v, horaSalida: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }), estado: 'Finalizada' }
        : v
    ))
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
            Visitas
          </h1>
          <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
            Registro y control de visitantes
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FiUserCheck className="me-2" /> Nueva Visita
        </Button>
      </div>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h2 className="text-primary">{visitas.filter(v => v.estado === 'Activa').length}</h2>
              <p className="text-muted mb-0">Visitas Activas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h2 className="text-success">{visitas.filter(v => v.estado === 'Finalizada').length}</h2>
              <p className="text-muted mb-0">Finalizadas Hoy</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <FiClock size={30} className="text-info me-3" />
                <div>
                  <h6 className="mb-0">Visita más larga hoy</h6>
                  <small className="text-muted">Pedro González - 2h 30min</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla de visitas */}
      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>Visitante</th>
                <th>Residente</th>
                <th>Fecha</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visitas.map((visita) => (
                <tr key={visita.id}>
                  <td>{visita.nombre}</td>
                  <td>{visita.residente}</td>
                  <td>{visita.fecha}</td>
                  <td>{visita.horaEntrada}</td>
                  <td>{visita.horaSalida || '—'}</td>
                  <td>{visita.motivo}</td>
                  <td>
                    <Badge bg={visita.estado === 'Activa' ? 'success' : 'secondary'}>
                      {visita.estado}
                    </Badge>
                  </td>
                  <td>
                    {visita.estado === 'Activa' && (
                      <Button variant="outline-secondary" size="sm" onClick={() => handleRegistrarSalida(visita.id)}>
                        <FiXCircle className="me-1" /> Salida
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Nueva Visita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Visitante</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Residente a Visitar</Form.Label>
              <Form.Control
                type="text"
                value={formData.residente}
                onChange={(e) => setFormData({ ...formData, residente: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Motivo de la Visita</Form.Label>
              <Form.Control
                type="text"
                value={formData.motivo}
                onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleRegistrarVisita}>
            Registrar Ingreso
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}