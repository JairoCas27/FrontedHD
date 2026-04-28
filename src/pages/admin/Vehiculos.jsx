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

  // Función para guardar los cambios al agregar o editar un vehículo
  const handleSave = () => {
    if (editando) {
      setVehiculos(vehiculos.map(v => v.id === editando.id ? { ...formData, id: v.id } : v))
    } else {
      const newId = Math.max(...vehiculos.map(v => v.id)) + 1
      setVehiculos([...vehiculos, { ...formData, id: newId }])
    }
    handleCloseModal()
  }

  // Función para eliminar un vehículo
  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar este vehículo?')) {
      setVehiculos(vehiculos.filter(v => v.id !== id))
    }
  }

  // Función para manejar cambios en el formulario
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
            Vehículos
          </h1>
          <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
            Registro y gestión de vehículos
          </p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <FiPlus className="me-2" /> Registrar Vehículo
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>Placa</th>
                <th>Propietario</th>
                <th>Tipo</th>
                <th>Modelo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map((vehiculo) => (
                <tr key={vehiculo.id}>
                  <td><strong>{vehiculo.placa}</strong></td>
                  <td>{vehiculo.propietario}</td>
                  <td>{vehiculo.tipo}</td>
                  <td>{vehiculo.modelo}</td>
                  <td>
                    <Badge bg={vehiculo.estado === 'Autorizado' ? 'success' : 'warning'}>
                      {vehiculo.estado}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(vehiculo)}>
                      <FiEdit2 />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(vehiculo.id)}>
                      <FiTrash2 />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>


}