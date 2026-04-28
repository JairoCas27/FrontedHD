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

  
}