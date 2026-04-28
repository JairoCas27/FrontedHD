import { useState } from 'react'
import { FiBell, FiCheck, FiTrash2, FiAlertCircle, FiInfo, FiCheckCircle } from "react-icons/fi"
import { Card, Button, Badge, ListGroup, Alert } from 'react-bootstrap'

const notificacionesIniciales = [
  { id: 1, titulo: 'Nueva visita registrada', mensaje: 'Pedro González ha ingresado al condominio', fecha: '2025-04-27 10:30', leida: false, tipo: 'info' },
  { id: 2, titulo: 'Acceso no autorizado', mensaje: 'Intento de acceso con placa no registrada ABC-999', fecha: '2025-04-27 09:15', leida: false, tipo: 'warning' },
  { id: 3, titulo: 'Pago de mantenciones', mensaje: 'Recordatorio: vencimiento de cuotas el 30/04', fecha: '2025-04-26 08:00', leida: true, tipo: 'success' },
  { id: 4, titulo: 'Mantenimiento programado', mensaje: 'Corte de agua el día 28/04 de 14:00 a 16:00', fecha: '2025-04-25 12:00', leida: true, tipo: 'info' },
]

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState(notificacionesIniciales)

  const marcarComoLeida = (id) => {
    setNotificaciones(notificaciones.map(n =>
      n.id === id ? { ...n, leida: true } : n
    ))
  }

  const eliminarNotificacion = (id) => {
    setNotificaciones(notificaciones.filter(n => n.id !== id))
  }

  const marcarTodasLeidas = () => {
    setNotificaciones(notificaciones.map(n => ({ ...n, leida: true })))
  }

  const eliminarTodas = () => {
    if (window.confirm('¿Eliminar todas las notificaciones?')) {
      setNotificaciones([])
    }
  }

  const getIcono = (tipo) => {
    switch (tipo) {
      case 'warning': return <FiAlertCircle className="text-warning" />
      case 'success': return <FiCheckCircle className="text-success" />
      default: return <FiInfo className="text-info" />
    }
  }

  const noLeidas = notificaciones.filter(n => !n.leida).length

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
            Notificaciones
          </h1>
          <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
            Alertas y eventos del sistema
          </p>
        </div>
        <div>
          {noLeidas > 0 && (
            <Badge bg="danger" className="me-2">
              {noLeidas} nuevas
            </Badge>
          )}
          <Button variant="outline-primary" size="sm" className="me-2" onClick={marcarTodasLeidas}>
            <FiCheck className="me-1" /> Marcar todas
          </Button>
          <Button variant="outline-danger" size="sm" onClick={eliminarTodas}>
            <FiTrash2 className="me-1" /> Eliminar todas
          </Button>
        </div>
      </div>

      {notificaciones.length === 0 ? (
        <Card className="shadow-sm text-center py-5">
          <Card.Body>
            <FiBell size={48} className="text-muted mb-3 opacity-50" />
            <h5>No hay notificaciones</h5>
            <p className="text-muted">Las notificaciones aparecerán aquí</p>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <ListGroup variant="flush">
            {notificaciones.map((notificacion) => (
              <ListGroup.Item 
                key={notificacion.id} 
                className={`d-flex justify-content-between align-items-center ${!notificacion.leida ? 'bg-light' : ''}`}
              >
                <div className="d-flex align-items-start">
                  <div className="me-3 mt-1">
                    {getIcono(notificacion.tipo)}
                  </div>
                  <div>
                    <h6 className="mb-1">
                      {notificacion.titulo}
                      {!notificacion.leida && (
                        <Badge bg="primary" className="ms-2">Nueva</Badge>
                      )}
                    </h6>
                    <p className="mb-1 text-muted small">{notificacion.mensaje}</p>
                    <small className="text-muted">{notificacion.fecha}</small>
                  </div>
                </div>
                <div>
                  {!notificacion.leida && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-success me-2"
                      onClick={() => marcarComoLeida(notificacion.id)}
                    >
                      <FiCheck />
                    </Button>
                  )}
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-danger"
                    onClick={() => eliminarNotificacion(notificacion.id)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
    </div>
  )
}