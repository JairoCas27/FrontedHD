import { useState } from 'react'
import { FiActivity, FiLogIn, FiLogOut, FiSearch } from "react-icons/fi"
import { Table, Button, Form, Card, Row, Col, Badge } from 'react-bootstrap'

const accesosIniciales = [
  { id: 1, nombre: 'Carlos López', tipo: 'Residente', placa: 'ABC-123', hora: '08:30', fecha: '2025-04-27', direccion: 'Ingreso' },
  { id: 2, nombre: 'Ana Martínez', tipo: 'Visita', placa: 'DEF-456', hora: '09:15', fecha: '2025-04-27', direccion: 'Ingreso' },
  { id: 3, nombre: 'Juan Pérez', tipo: 'Residente', placa: 'GHI-789', hora: '10:00', fecha: '2025-04-27', direccion: 'Salida' },
  { id: 4, nombre: 'María García', tipo: 'Proveedor', placa: 'JKL-012', hora: '11:20', fecha: '2025-04-27', direccion: 'Ingreso' },
]

export default function Accesos() {
  const [accesos, setAccesos] = useState(accesosIniciales)
  const [filtro, setFiltro] = useState('')
  const [nuevoAcceso, setNuevoAcceso] = useState({ nombre: '', tipo: 'Residente', placa: '', direccion: 'Ingreso' })

  
}