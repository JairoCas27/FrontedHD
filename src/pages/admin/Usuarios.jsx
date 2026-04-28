import { useState } from 'react'
import { FiUsers, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi"
import { Table, Button, Modal, Form, Badge, Card, Row, Col } from 'react-bootstrap'

// Datos de ejemplo para usuarios
const usuariosIniciales = [
  { id: 1, nombre: 'Carlos López', email: 'carlos@example.com', rol: 'Residente', estado: 'Activo' },
  { id: 2, nombre: 'Ana Martínez', email: 'ana@example.com', rol: 'Administrador', estado: 'Activo' },
  { id: 3, nombre: 'Juan Pérez', email: 'juan@example.com', rol: 'Seguridad', estado: 'Inactivo' },
  { id: 4, nombre: 'María García', email: 'maria@example.com', rol: 'Residente', estado: 'Activo' },
]

export default function Usuarios() {

  const [usuarios, setUsuarios] = useState(usuariosIniciales)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [formData, setFormData] = useState({ nombre: '', email: '', rol: 'Residente', estado: 'Activo' })

  // Función para abrir el modal de creación/edición
  const handleOpenModal = (usuario = null) => {
    if (usuario) {
      setEditando(usuario)
      setFormData(usuario)
    } else {
      setEditando(null)
      setFormData({ nombre: '', email: '', rol: 'Residente', estado: 'Activo' })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditando(null)
  }

  // Función para guardar los cambios (crear o editar)
  const handleSave = () => {
    if (editando) {
      setUsuarios(usuarios.map(u => u.id === editando.id ? { ...formData, id: u.id } : u))
    } else {
      const newId = Math.max(...usuarios.map(u => u.id)) + 1
      setUsuarios([...usuarios, { ...formData, id: newId }])
    }
    handleCloseModal()
  }

  // Función para eliminar un usuario
  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar este usuario?')) {
      setUsuarios(usuarios.filter(u => u.id !== id))
    }
  }
  
  // Función para manejar cambios en el formulario
    return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
            Usuarios
          </h1>
          <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>
            Gestión de usuarios del condominio
          </p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <FiPlus className="me-2" /> Nuevo Usuario
        </Button>
      </div>

      {/* Tabla de usuarios */}
      <Card className="shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <Badge bg={usuario.rol === 'Administrador' ? 'danger' : usuario.rol === 'Seguridad' ? 'warning' : 'info'}>
                      {usuario.rol}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={usuario.estado === 'Activo' ? 'success' : 'secondary'}>
                      {usuario.estado}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(usuario)}>
                      <FiEdit2 />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(usuario.id)}>
                      <FiTrash2 />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal para crear/editar usuario */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editando ? 'Editar Usuario' : 'Nuevo Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
              >
                <option>Residente</option>
                <option>Administrador</option>
                <option>Seguridad</option>
                <option>Proveedor</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}