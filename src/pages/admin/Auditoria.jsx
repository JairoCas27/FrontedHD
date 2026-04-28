import { useState } from 'react'
import { FiShield, FiSearch, FiFilter, FiUser, FiActivity, FiSettings } from "react-icons/fi"
import { Card, Table, Form, Row, Col, Badge, Button } from 'react-bootstrap'

const logsIniciales = [
  { id: 1, usuario: 'admin@urbanpark.cl', accion: 'Inicio de sesión', modulo: 'Auth', ip: '192.168.1.100', fecha: '2025-04-27 08:30:15', estado: 'Éxito' },
  { id: 2, usuario: 'carlos.lopez', accion: 'Registro de vehículo', modulo: 'Vehículos', ip: '192.168.1.45', fecha: '2025-04-27 09:15:22', estado: 'Éxito' },
  { id: 3, usuario: 'ana.martinez', accion: 'Eliminación de usuario', modulo: 'Usuarios', ip: '192.168.1.78', fecha: '2025-04-27 10:00:05', estado: 'Éxito' },
  { id: 4, usuario: 'desconocido', accion: 'Intento de acceso fallido', modulo: 'Auth', ip: '10.0.0.55', fecha: '2025-04-27 10:30:42', estado: 'Fallo' },
  { id: 5, usuario: 'juan.perez', accion: 'Actualización de configuración', modulo: 'Configuración', ip: '192.168.1.22', fecha: '2025-04-27 11:20:10', estado: 'Éxito' },
]

export default function Auditoria() {
  const [logs, setLogs] = useState(logsIniciales)
  const [filtroModulo, setFiltroModulo] = useState('')
  const [filtroUsuario, setFiltroUsuario] = useState('')

  const logsFiltrados = logs.filter(log => {
    if (filtroModulo && log.modulo !== filtroModulo) return false
    if (filtroUsuario && !log.usuario.toLowerCase().includes(filtroUsuario.toLowerCase())) return false
    return true
  })

  const modulos = [...new Set(logs.map(log => log.modulo))]

  return (
    <div>
      <div className="mb-4">
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
          Auditoría
        </h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
          Logs y control de permisos
        </p>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  <FiSearch className="me-1" /> Buscar por Usuario
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Email o nombre de usuario..."
                  value={filtroUsuario}
                  onChange={(e) => setFiltroUsuario(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  <FiFilter className="me-1" /> Filtrar por Módulo
                </Form.Label>
                <Form.Select
                  value={filtroModulo}
                  onChange={(e) => setFiltroModulo(e.target.value)}
                >
                  <option value="">Todos</option>
                  {modulos.map(modulo => (
                    <option key={modulo} value={modulo}>{modulo}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={() => { setFiltroModulo(''); setFiltroUsuario('') }}>
                Limpiar Filtros
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>Fecha/Hora</th>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Módulo</th>
                <th>IP</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {logsFiltrados.map((log) => (
                <tr key={log.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{log.fecha}</td>
                  <td>{log.usuario}</td>
                  <td>{log.accion}</td>
                  <td>
                    <Badge bg="secondary">{log.modulo}</Badge>
                  </td>
                  <td><code>{log.ip}</code></td>
                  <td>
                    <Badge bg={log.estado === 'Éxito' ? 'success' : 'danger'}>
                      {log.estado}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {logsFiltrados.length === 0 && (
            <div className="text-center py-5 text-muted">
              <FiShield size={48} className="mb-3 opacity-50" />
              <p>No se encontraron registros</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}