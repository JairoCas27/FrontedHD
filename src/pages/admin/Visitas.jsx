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

}