import { useState, useEffect } from 'react'
import { FiActivity, FiLogIn, FiLogOut, FiSearch } from "react-icons/fi"
import { Table, Button, Form, Card, Row, Col, Badge } from 'react-bootstrap'


const accesosIniciales = [
  { id: 1, nombre: 'Carlos López', tipo: 'Residente', placa: 'ABC-123', hora: '08:30', fecha: '2025-04-27', direccion: 'Ingreso' },
  { id: 2, nombre: 'Ana Martínez', tipo: 'Visita', placa: 'DEF-456', hora: '09:15', fecha: '2025-04-27', direccion: 'Ingreso' },
  { id: 3, nombre: 'Juan Pérez', tipo: 'Residente', placa: 'GHI-789', hora: '10:00', fecha: '2025-04-27', direccion: 'Salida' },
  { id: 4, nombre: 'María García', tipo: 'Proveedor', placa: 'JKL-012', hora: '11:20', fecha: '2025-04-27', direccion: 'Ingreso' },
]

const STORAGE_KEY = 'accesos_condominio_admin'

export default function Accesos() {
  const [accesos, setAccesos] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : accesosIniciales
    } catch {
      return accesosIniciales
    }
  })
  const [filtro, setFiltro] = useState('')
  const [nuevoAcceso, setNuevoAcceso] = useState({ nombre: '', tipo: 'Residente', placa: '', direccion: 'Ingreso' })

  // Sincroniza con localStorage cada vez que accesos cambie
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accesos))
    } catch {
      console.error('Error al guardar en localStorage')
    }
  }, [accesos])


  const handleRegistrarAcceso = () => {
    if (!nuevoAcceso.nombre) return
    
    const nuevo = {
      id: Math.max(...accesos.map(a => a.id)) + 1,
      ...nuevoAcceso,
      hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      fecha: new Date().toISOString().split('T')[0]
    }
    setAccesos([nuevo, ...accesos])
    setNuevoAcceso({ nombre: '', tipo: 'Residente', placa: '', direccion: 'Ingreso' })
  }


  const accesosFiltrados = accesos.filter(a => 
    a.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    a.placa.toLowerCase().includes(filtro.toLowerCase())
  )


  return (
    <div>
      <div className="mb-4">
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
          Accesos
        </h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
          Control de ingresos y salidas
        </p>
      </div>


      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h6 className="mb-0">Registro Rápido de Acceso</h6>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre/Visitante</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre completo"
                    value={nuevoAcceso.nombre}
                    onChange={(e) => setNuevoAcceso({ ...nuevoAcceso, nombre: e.target.value })}
                  />
                </Form.Group>
                <Row className="g-2 mb-3">
                  <Col>
                    <Form.Label>Tipo</Form.Label>
                    <Form.Select
                      value={nuevoAcceso.tipo}
                      onChange={(e) => setNuevoAcceso({ ...nuevoAcceso, tipo: e.target.value })}
                    >
                      <option>Residente</option>
                      <option>Visita</option>
                      <option>Proveedor</option>
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Label>Placa</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Opcional"
                      value={nuevoAcceso.placa}
                      onChange={(e) => setNuevoAcceso({ ...nuevoAcceso, placa: e.target.value.toUpperCase() })}
                    />
                  </Col>
                </Row>
                <Row className="g-2">
                  <Col>
                    <Button 
                      variant="success" 
                      className="w-100"
                      onClick={handleRegistrarAcceso}
                    >
                      <FiLogIn className="me-2" /> Registrar Ingreso
                    </Button>
                  </Col>
                  <Col>
                    <Button 
                      variant="danger" 
                      className="w-100"
                      onClick={() => setNuevoAcceso({ ...nuevoAcceso, direccion: 'Salida' })}
                    >
                      <FiLogOut className="me-2" /> Registrar Salida
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <h2 className="display-4 text-primary">24</h2>
              <p className="text-muted mb-0">Accesos hoy</p>
              <hr />
              <div className="d-flex justify-content-around">
                <div>
                  <h5 className="text-success">18</h5>
                  <small>Ingresos</small>
                </div>
                <div>
                  <h5 className="text-secondary">6</h5>
                  <small>Salidas</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>


      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Historial de Accesos</h6>
            <div className="d-flex gap-2">
              <FiSearch className="text-muted mt-2" />
              <Form.Control
                type="text"
                placeholder="Buscar..."
                size="sm"
                style={{ width: '200px' }}
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Placa</th>
                <th>Dirección</th>
              </tr>
            </thead>
            <tbody>
              {accesosFiltrados.map((acceso) => (
                <tr key={acceso.id}>
                  <td>{acceso.fecha}</td>
                  <td>{acceso.hora}</td>
                  <td>{acceso.nombre}</td>
                  <td>
                    <Badge bg={acceso.tipo === 'Residente' ? 'primary' : acceso.tipo === 'Visita' ? 'info' : 'secondary'}>
                      {acceso.tipo}
                    </Badge>
                  </td>
                  <td>{acceso.placa || '—'}</td>
                  <td>
                    <Badge bg={acceso.direccion === 'Ingreso' ? 'success' : 'danger'}>
                      {acceso.direccion}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  )
}