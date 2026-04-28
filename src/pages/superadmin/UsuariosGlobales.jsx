import { useState, useEffect } from "react";
import { FiPlus, FiUser, FiMail, FiPhone, FiHome, FiTrash2, FiEdit2, FiShield, FiSave, FiAlertTriangle } from "react-icons/fi";
import { Card, Button, Table, Modal, Form, Row, Col, Badge } from "react-bootstrap";

const usuariosIniciales = [
  { id: 1, nombre: "Carlos Martínez", email: "carlos.admin@urbanpark.com", telefono: "987 654 321", condominio: "Jerarquía Residencial I", rol: "Administrador", estado: "Activo" },
  { id: 2, nombre: "Ana Lucia Rojas", email: "ana.rojas@gmail.com", telefono: "912 345 678", condominio: "Residencial Arboleda", rol: "Administrador", estado: "Activo" },
  { id: 3, nombre: "Roberto Gómez", email: "roberto.g@outlook.com", telefono: "933 445 566", condominio: "Urban Park Sur", rol: "Administrador", estado: "Activo" },
  { id: 4, nombre: "Elena Vizcarra", email: "elena.v@urbanpark.pe", telefono: "955 667 788", condominio: "Condominio El Olivar", rol: "Administrador", estado: "Activo" },
  { id: 5, nombre: "Marcos Peña", email: "m.pena@gmail.com", telefono: "911 223 344", condominio: "Altos de Comas", rol: "Administrador", estado: "Activo" },
  { id: 6, nombre: "Sofía Luján", email: "sofia.l@urbanpark.com", telefono: "977 889 900", condominio: "Villa Marina", rol: "Administrador", estado: "Activo" },
  { id: 7, nombre: "Javier Izquierdo", email: "jizquierdo@gmail.com", telefono: "944 556 677", condominio: "Parque San Miguel", rol: "Administrador", estado: "Activo" },
  { id: 8, nombre: "Patricia Salas", email: "p.salas@outlook.com", telefono: "922 334 455", condominio: "Residencial San Felipe", rol: "Administrador", estado: "Activo" },
  { id: 9, nombre: "Diego Torres", email: "dtorres@urbanpark.pe", telefono: "966 778 899", condominio: "Praderas del Norte", rol: "Administrador", estado: "Activo" },
  { id: 10, nombre: "Lucía Méndez", email: "lucia.m@gmail.com", telefono: "988 990 011", condominio: "Mirador de la Costa", rol: "Administrador", estado: "Activo" },
  { id: 11, nombre: "Ricardo Palma", email: "r.palma@urbanpark.com", telefono: "955 112 233", condominio: "Jerarquía Residencial I", rol: "Administrador", estado: "Activo" },
  { id: 12, nombre: "Gabriela Mistral", email: "gmistral@gmail.com", telefono: "944 223 344", condominio: "Residencial Las Palmas", rol: "Administrador", estado: "Activo" },
  { id: 13, nombre: "Andrés Bello", email: "abello@outlook.com", telefono: "933 334 445", condominio: "Urban Park Sur", rol: "Administrador", estado: "Activo" },
  { id: 14, nombre: "César Vallejo", email: "cvallejo@urbanpark.pe", telefono: "922 445 566", condominio: "Altos de Comas", rol: "Administrador", estado: "Activo" },
  { id: 15, nombre: "Isabel Allende", email: "iallende@gmail.com", telefono: "911 556 677", condominio: "Villa Marina", rol: "Administrador", estado: "Activo" }
];

const STORAGE_KEY = 'usuarios_globales_superadmin'

export default function UsuariosGlobales() {
  // --- ESTADOS ---
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // --- DATA EXPANDIDA (15 MIEMBROS) ---
  const [usuarios, setUsuarios] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : usuariosIniciales
    } catch {
      return usuariosIniciales
    }
  });

  // Sincroniza con localStorage cada vez que usuarios cambie
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios))
    } catch {
      console.error('Error al guardar en localStorage')
    }
  }, [usuarios]);


  const [currentUser, setCurrentUser] = useState({ id: null, nombre: "", email: "", telefono: "", condominio: "Jerarquía Residencial I" });


  // --- FUNCIONES ---
  const handleOpenModal = (user = null) => {
    if (user) {
      setIsEditing(true);
      setCurrentUser(user);
    } else {
      setIsEditing(false);
      setCurrentUser({ id: null, nombre: "", email: "", telefono: "", condominio: "Jerarquía Residencial I" });
    }
    setShowModal(true);
  };


  const handleSaveUsuario = (e) => {
    e.preventDefault();
    if (isEditing) {
      setUsuarios(usuarios.map(u => u.id === currentUser.id ? { ...currentUser } : u));
    } else {
      const nuevo = { ...currentUser, id: Date.now(), rol: "Administrador", estado: "Activo" };
      setUsuarios([...usuarios, nuevo]);
    }
    setShowModal(false);
  };


  const confirmDelete = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };


  const handleExecuteDelete = () => {
    setUsuarios(usuarios.filter(u => u.id !== userToDelete));
    setShowDeleteModal(false);
  };


  return (
    <div style={{ padding: "1.5rem" }}>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#3b82f6", margin: 0 }}>Usuarios Globales</h1>
          <p style={{ color: "#0ea5e9", fontWeight: 600, fontSize: "0.9rem" }}>Control de accesos para {usuarios.length} administradores</p>
        </div>
        <Button onClick={() => handleOpenModal()} style={{ background: "#3b82f6", border: "none", borderRadius: "10px" }} className="shadow-sm px-4 py-2 fw-bold">
          <FiPlus className="me-2" /> Crear Administrador
        </Button>
      </div>


      {/* TABLA */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: "18px" }}>
        <Card.Body className="p-0">
          <Table responsive hover className="align-middle m-0">
            <thead style={{ background: "#eff6ff" }}>
              <tr className="text-muted small text-uppercase fw-bold">
                <th className="py-3 px-4">Administrador</th>
                <th className="py-3">Contacto</th>
                <th className="py-3">Condominio Asignado</th>
                <th className="py-3 text-end px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td className="py-3 px-4">
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ background: "#eff6ff", padding: "10px", borderRadius: "12px", color: "#3b82f6" }}>
                        <FiUser size={18} />
                      </div>
                      <div className="fw-bold text-dark" style={{ fontSize: "0.9rem" }}>{u.nombre}</div>
                    </div>
                  </td>
                  <td>
                    <div className="small fw-medium text-primary"><FiMail className="me-1"/> {u.email}</div>
                    <div className="extra-small text-muted mt-1"><FiPhone className="me-1"/> {u.telefono}</div>
                  </td>
                  <td>
                    <Badge bg="light" text="dark" className="border px-3 py-2 fw-normal" style={{ borderRadius: "8px", fontSize: "0.75rem" }}>
                      <FiHome size={12} className="me-1 text-info" /> {u.condominio}
                    </Badge>
                  </td>
                  <td className="text-end px-4">
                    <Button variant="link" className="text-info p-2" onClick={() => handleOpenModal(u)}><FiEdit2 size={16}/></Button>
                    <Button variant="link" className="text-danger p-2" onClick={() => confirmDelete(u.id)}><FiTrash2 size={16}/></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>


      {/* MODAL: CREAR / EDITAR */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body className="p-4">
          <h5 className="fw-bold mb-4 text-primary text-center">{isEditing ? "Editar Acceso" : "Nuevo Administrador"}</h5>
          <Form onSubmit={handleSaveUsuario}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">NOMBRE COMPLETO</Form.Label>
              <Form.Control required className="bg-light border-0 py-2" value={currentUser.nombre} onChange={e => setCurrentUser({...currentUser, nombre: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">CORREO ELECTRÓNICO</Form.Label>
              <Form.Control required type="email" className="bg-light border-0 py-2" value={currentUser.email} onChange={e => setCurrentUser({...currentUser, email: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">TELÉFONO</Form.Label>
              <Form.Control className="bg-light border-0 py-2" value={currentUser.telefono} onChange={e => setCurrentUser({...currentUser, telefono: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-muted">ASIGNAR CONDOMINIO</Form.Label>
              <Form.Select className="bg-light border-0 py-2" value={currentUser.condominio} onChange={e => setCurrentUser({...currentUser, condominio: e.target.value})}>
                <option>Jerarquía Residencial I</option>
                <option>Urban Park Sur</option>
                <option>Residencial Las Palmas</option>
                <option>Condominio El Olivar</option>
                <option>Altos de Comas</option>
                <option>Villa Marina</option>
                <option>Parque San Miguel</option>
                <option>Residencial San Felipe</option>
                <option>Praderas del Norte</option>
                <option>Mirador de la Costa</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" className="w-100 py-3 fw-bold shadow-sm" style={{ background: "#3b82f6", border: "none", borderRadius: "12px" }}>
              {isEditing ? "Guardar Cambios" : "Vincular Administrador"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>


      {/* MODAL: ELIMINAR */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
        <Modal.Body className="p-4 text-center">
          <FiAlertTriangle size={50} className="text-danger mb-3" />
          <h6 className="fw-bold">¿Revocar Acceso?</h6>
          <p className="text-muted small">Este usuario perderá el control sobre su condominio asignado de forma inmediata.</p>
          <div className="d-flex gap-2 mt-4">
            <Button variant="light" className="w-100 fw-bold border" onClick={() => setShowDeleteModal(false)}>No</Button>
            <Button variant="danger" className="w-100 fw-bold" onClick={handleExecuteDelete}>Sí, Eliminar</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}