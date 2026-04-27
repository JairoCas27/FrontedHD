import { useState } from "react";
import { FiPlus, FiUser, FiMail, FiPhone, FiHome, FiTrash2, FiEdit2, FiShield, FiSave, FiAlertTriangle } from "react-icons/fi";
import { Card, Button, Table, Modal, Form, Row, Col, Badge } from "react-bootstrap";

export default function UsuariosGlobales() {
  // --- ESTADOS ---
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Nuevo modal para borrar
  const [isEditing, setIsEditing] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // Guardar ID a eliminar
  
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: "Carlos Martínez",
      email: "carlos.admin@urbanpark.com",
      telefono: "987 654 321",
      condominio: "Urban Park - Puente Piedra",
      rol: "Administrador",
      estado: "Activo"
    },
    {
      id: 2,
      nombre: "Ana Lucia Rojas",
      email: "ana.rojas@gmail.com",
      telefono: "912 345 678",
      condominio: "Residencial Arboleda - Los Olivos",
      rol: "Administrador",
      estado: "Activo"
    }
  ]);

  const [currentUser, setCurrentUser] = useState({
    id: null,
    nombre: "",
    email: "",
    telefono: "",
    condominio: "Urban Park - Puente Piedra"
  });

  // --- FUNCIONES ---

  const handleOpenModal = (user = null) => {
    if (user) {
      setIsEditing(true);
      setCurrentUser(user);
    } else {
      setIsEditing(false);
      setCurrentUser({ id: null, nombre: "", email: "", telefono: "", condominio: "Urban Park - Puente Piedra" });
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

  // Función para abrir el modal de borrado
  const confirmDelete = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  // Función que ejecuta el borrado real
  const handleExecuteDelete = () => {
    setUsuarios(usuarios.filter(u => u.id !== userToDelete));
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1e1b4b" }}>Usuarios Globales</h1>
          <p className="text-muted small">Control central de accesos administrativos</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()}
          style={{ background: "#1e1b4b", border: "none", borderRadius: "10px" }}
          className="shadow-sm px-4 py-2"
        >
          <FiPlus className="me-2" /> Crear Administrador
        </Button>
      </div>

      {/* TABLA */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: "20px" }}>
        <Card.Body className="p-4">
          <Table responsive hover borderless className="align-middle m-0">
            <thead className="bg-light">
              <tr className="text-muted small text-uppercase fw-bold">
                <th className="py-3 px-4">Administrador</th>
                <th className="py-3">Contacto</th>
                <th className="py-3">Condominio</th>
                <th className="py-3 text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-bottom">
                  <td className="py-4 px-4">
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ background: "#eef2ff", padding: "10px", borderRadius: "12px", color: "#4f46e5" }}>
                        <FiUser size={20} />
                      </div>
                      <div className="fw-bold text-dark">{u.nombre}</div>
                    </div>
                  </td>
                  <td>
                    <div className="small text-dark"><FiMail className="me-1 text-primary"/> {u.email}</div>
                    <div className="small text-muted mt-1"><FiPhone className="me-1 text-success"/> {u.telefono}</div>
                  </td>
                  <td>
                    <Badge bg="light" text="dark" className="border px-3 py-2 fw-normal" style={{ borderRadius: "8px" }}>
                      <FiHome size={14} className="me-1" /> {u.condominio}
                    </Badge>
                  </td>
                  <td className="text-end px-4">
                    <Button variant="link" className="text-primary p-2" onClick={() => handleOpenModal(u)}>
                      <FiEdit2 size={18}/>
                    </Button>
                    <Button variant="link" className="text-danger p-2" onClick={() => confirmDelete(u.id)}>
                      <FiTrash2 size={18}/>
                    </Button>
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
          <div className="text-center mb-4">
            <h5 className="fw-bold m-0 text-primary">{isEditing ? "Editar Administrador" : "Nuevo Administrador"}</h5>
            <p className="text-muted small">Asignación de credenciales para el sistema</p>
          </div>

          <Form onSubmit={handleSaveUsuario}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">NOMBRE COMPLETO</Form.Label>
              <Form.Control 
                required 
                className="bg-light border-0 py-2" 
                value={currentUser.nombre}
                onChange={e => setCurrentUser({...currentUser, nombre: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">CORREO ELECTRÓNICO</Form.Label>
              <Form.Control 
                required 
                type="email" 
                className="bg-light border-0 py-2" 
                value={currentUser.email}
                onChange={e => setCurrentUser({...currentUser, email: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">TELÉFONO</Form.Label>
              <Form.Control 
                className="bg-light border-0 py-2" 
                value={currentUser.telefono}
                onChange={e => setCurrentUser({...currentUser, telefono: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-muted">CONDOMINIO (ZONA NORTE)</Form.Label>
              <Form.Select 
                className="bg-light border-0 py-2"
                value={currentUser.condominio}
                onChange={e => setCurrentUser({...currentUser, condominio: e.target.value})}
              >
                <option value="Urban Park - Puente Piedra">Urban Park - Puente Piedra</option>
                <option value="Residencial Arboleda - Los Olivos">Residencial Arboleda - Los Olivos</option>
                <option value="Villa Sol - Puente Piedra">Villa Sol - Puente Piedra</option>
                <option value="Las Palmeras - Los Olivos">Las Palmeras - Los Olivos</option>
                <option value="El Remanso - Puente Piedra">El Remanso - Puente Piedra</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" className="w-100 py-3 fw-bold shadow" style={{ background: "#3b82f6", border: "none", borderRadius: "12px" }}>
              {isEditing ? <><FiSave className="me-2"/> Guardar Cambios</> : <><FiShield className="me-2"/> Asignar Usuario</>}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* MODAL: CONFIRMACIÓN DE ELIMINACIÓN (Reemplaza a la alerta fea) */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
        <Modal.Body className="p-4 text-center">
          <div className="mb-3 text-danger">
            <FiAlertTriangle size={50} />
          </div>
          <h5 className="fw-bold">¿Eliminar Usuario?</h5>
          <p className="text-muted small">Esta acción no se puede deshacer. Se revocarán todos los accesos de este administrador.</p>
          <div className="d-flex gap-2 mt-4">
            <Button variant="light" className="w-100 fw-bold border" onClick={() => setShowDeleteModal(false)}>
              No, Cancelar
            </Button>
            <Button variant="danger" className="w-100 fw-bold" onClick={handleExecuteDelete}>
              Sí, Eliminar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}