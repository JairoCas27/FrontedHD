import { FiHome, FiUsers, FiTruck, FiMapPin, FiActivity, FiBell } from "react-icons/fi"
import { Card, Row, Col, Table, Badge, ProgressBar } from "react-bootstrap"

// Datos de ejemplo para estacionamientos

//simulacion de espacios por bloques
const espaciosPorBloque = [
    { bloque: 'Bloque A', total: 60, ocupados: 48, disponibles: 8, mantención: 4 },
    { bloque: 'Bloque B', total: 60, ocupados: 47, disponibles: 9, mantención: 4 },
    { bloque: 'Bloque C', total: 60, ocupados: 46, disponibles: 8, mantención: 6 },
    { bloque: 'Bloque D', total: 60, ocupados: 45, disponibles: 9, mantención: 6 },
    { bloque: 'Bloque E', total: 60, ocupados: 48, disponibles: 6, mantención: 6 },
    { bloque: 'Visitas', total: 42, ocupados: 33, disponibles: 5, mantención: 4 },
]

//Simulación de accesos recientes
const accesosRecientes = [
    { id: 1, nombre: 'Carlos López', tipo: 'Residente', hora: '08:30', estado: 'Ingreso' },
    { id: 2, nombre: 'Ana Martínez', tipo: 'Visita', hora: '09:15', estado: 'Ingreso' },
    { id: 3, nombre: 'Juan Pérez', tipo: 'Residente', hora: '10:00', estado: 'Salida' },
    { id: 4, nombre: 'María García', tipo: 'Proveedor', hora: '11:20', estado: 'Ingreso' },
]

export default function DashboardAdmin() {
  return (
    <div style={{ padding: "0" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
          Dashboard Admin
        </h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
          Resumen operativo del condominio
        </p>
      </div>

        {/* Tarjetas de métricas */}
        <Row className="g-4 mb-4">
            <Col md={3}>
                <Card className="h-100 shadow-sm">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-muted mb-2">Total Usuarios</h6>
                                <h2 className="mb-0">1,234</h2>
                                <small className="text-success">+12% vs mes anterior</small>
                            </div>
                            <FiUsers size={40} className="text-primary opacity-50" />
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={3}>
                <Card className="h-100 shadow-sm">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-muted mb-2">Vehículos Registrados</h6>
                                <h2 className="mb-0">856</h2>
                                <small className="text-success">+5% vs mes anterior</small>
                            </div>
                            <FiTruck size={40} className="text-success opacity-50" />
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={3}>
                <Card className="h-100 shadow-sm">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-muted mb-2">Estacionamientos</h6>
                                <h2 className="mb-0">{totalPlazas}</h2>
                                <small className="text-warning">{porcentajeOcupacion}% ocupación</small>
                                <small className="d-block text-muted">
                                    {totalOcupados} de {totalPlazas} usados
                                </small>
                            </div>
                            <FiMapPin size={40} className="text-warning opacity-50" />
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={3}>
                <Card className="h-100 shadow-sm">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="text-muted mb-2">Visitas Hoy</h6>
                                <h2 className="mb-0">47</h2>
                                <small className="text-info">Promedio: 52</small>
                            </div>
                            <FiActivity size={40} className="text-info opacity-50" />
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </div>
  )
}