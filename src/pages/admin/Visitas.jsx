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
  
}