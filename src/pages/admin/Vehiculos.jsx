import { useState } from 'react'
import { FiTruck, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi"
import { Table, Button, Modal, Form, Badge, Card } from 'react-bootstrap'

const vehiculosIniciales = [
  { id: 1, placa: 'ABC-123', propietario: 'Carlos López', tipo: 'Auto', modelo: 'Toyota Corolla', estado: 'Autorizado' },
  { id: 2, placa: 'DEF-456', propietario: 'Ana Martínez', tipo: 'SUV', modelo: 'Hyundai Tucson', estado: 'Autorizado' },
  { id: 3, placa: 'GHI-789', propietario: 'Juan Pérez', tipo: 'Moto', modelo: 'Yamaha XTZ', estado: 'Pendiente' },
]

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState(vehiculosIniciales)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [formData, setFormData] = useState({ placa: '', propietario: '', tipo: 'Auto', modelo: '', estado: 'Autorizado' })

  // Función para abrir el modal de agregar o editar vehículo
  const handleOpenModal = (vehiculo = null) => {
    if (vehiculo) {
      setEditando(vehiculo)
      setFormData(vehiculo)
    } else {
      setEditando(null)
      setFormData({ placa: '', propietario: '', tipo: 'Auto', modelo: '', estado: 'Autorizado' })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditando(null)
  }

  
}