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
  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Usuarios</h1>
        <p style={{ color: "#64748b", marginTop: "0.25rem", fontSize: "0.95rem" }}>Gestión de usuarios del condominio</p>
      </div>
    </div>
    )

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
}