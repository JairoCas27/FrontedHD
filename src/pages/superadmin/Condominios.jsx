import { useState, useEffect } from "react";
import { FiPlus, FiHome, FiLayers, FiGrid, FiCheckCircle, FiXCircle, FiHash, FiMaximize, FiMapPin } from "react-icons/fi";
import { Accordion, Badge, Card, Button, Table, Modal, Form, Row, Col } from "react-bootstrap";

const condominiosIniciales = [
  {
    id: 1,
    nombre: "Jerarquía Residencial I",
    ubicacion: "Puente Piedra",
    plan: "Premium",
    torres: [
      { 
        id: "T1", 
        nombre: "Torre A", 
        pisos: [
          { nivel: 1, apartamentos: [{ id: "A1", numero: "101", metraje: 85, derecho_estacionamiento: true }] },
          { nivel: 2, apartamentos: [{ id: "A2", numero: "201", metraje: 70, derecho_estacionamiento: false }] }
        ] 
      }
    ]
  },
  {
    id: 2,
    nombre: "Urban Park Sur",
    ubicacion: "Santiago de Surco",
    plan: "Básico",
    torres: [
      { id: "T3", nombre: "Edificio Central", pisos: [{ nivel: 1, apartamentos: [{ id: "A4", numero: "101", metraje: 110, derecho_estacionamiento: true }] }] }
    ]
  },
  {
    id: 3,
    nombre: "Residencial Las Palmas",
    ubicacion: "Los Olivos",
    plan: "Premium",
    torres: [
      { id: "T4", nombre: "Torre Norte", pisos: [{ nivel: 1, apartamentos: [{ id: "A5", numero: "101", metraje: 75, derecho_estacionamiento: true }] }] }
    ]
  },
  {
    id: 4,
    nombre: "Condominio El Olivar",
    ubicacion: "San Isidro",
    plan: "Premium",
    torres: [
      { id: "T5", nombre: "Torre Gold", pisos: [{ nivel: 10, apartamentos: [{ id: "A6", numero: "1001", metraje: 150, derecho_estacionamiento: true }] }] }
    ]
  },
  {
    id: 5,
    nombre: "Altos de Comas",
    ubicacion: "Comas",
    plan: "Básico",
    torres: [
      { id: "T6", nombre: "Block A", pisos: [{ nivel: 1, apartamentos: [{ id: "A7", numero: "101", metraje: 65, derecho_estacionamiento: false }] }] }
    ]
  },
  {
    id: 6,
    nombre: "Villa Marina",
    ubicacion: "Chorrillos",
    plan: "Premium",
    torres: [
      { id: "T7", nombre: "Torre Mar", pisos: [{ nivel: 1, apartamentos: [{ id: "A8", numero: "101", metraje: 95, derecho_estacionamiento: true }] }] }
    ]
  },
  {
    id: 7,
    nombre: "Parque San Miguel",
    ubicacion: "San Miguel",
    plan: "Básico",
    torres: [
      { id: "T8", nombre: "Edificio A", pisos: [{ nivel: 1, apartamentos: [{ id: "A9", numero: "101", metraje: 80, derecho_estacionamiento: true }] }] }
    ]
  },
  {
    id: 8,
    nombre: "Residencial San Felipe",
    ubicacion: "Jesús María",
    plan: "Premium",
    torres: [
      { id: "T9", nombre: "Torre 1", pisos: [{ nivel: 5, apartamentos: [{ id: "A10", numero: "502", metraje: 115, derecho_estacionamiento: true }] }] }
    ]
  },
  {
    id: 9,
    nombre: "Praderas del Norte",
    ubicacion: "Carabayllo",
    plan: "Básico",
    torres: [
      { id: "T10", nombre: "Sector 1", pisos: [{ nivel: 1, apartamentos: [{ id: "A11", numero: "101", metraje: 60, derecho_estacionamiento: false }] }] }
    ]
  },
  {
    id: 10,
    nombre: "Mirador de la Costa",
    ubicacion: "Magdalena del Mar",
    plan: "Premium",
    torres: [
      { id: "T11", nombre: "Torre Pacific", pisos: [{ nivel: 1, apartamentos: [{ id: "A12", numero: "101", metraje: 130, derecho_estacionamiento: true }] }] }
    ]
  }
];

const STORAGE_KEY = 'condominios_superadmin'

export default function Condominios() {
  // --- ESTADOS DE CONTROL ---
  const [showCondoModal, setShowCondoModal] = useState(false);
  const [showTorreModal, setShowTorreModal] = useState(false);
  const [showPisoModal, setShowPisoModal] = useState(false);
  const [showAptoModal, setShowAptoModal] = useState(false);
  
  const [selectedCondoId, setSelectedCondoId] = useState(null);
  const [selectedTorreId, setSelectedTorreId] = useState(null);
  const [selectedPisoNivel, setSelectedPisoNivel] = useState(null);


  // --- DATOS INICIALES EXPANDIDOS (10 CONDOMINIOS) ---
  const [condominios, setCondominios] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : condominiosIniciales
    } catch {
      return condominiosIniciales
    }
  });

  // Sincroniza con localStorage cada vez que condominios cambie
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(condominios))
    } catch {
      console.error('Error al guardar en localStorage')
    }
  }, [condominios]);


  // Estados de formularios
  const [newCondo, setNewCondo] = useState({ nombre: "", ubicacion: "", plan: "Básico" });
  const [newTorreName, setNewTorreName] = useState("");
  const [newPisoNum, setNewPisoNum] = useState("");
  const [newApto, setNewApto] = useState({ numero: "", metraje: "", derecho_estacionamiento: true });


  // --- LÓGICA DE ACTUALIZACIÓN ---


  const handleAddCondominio = (e) => {
    e.preventDefault();
    const nuevo = { ...newCondo, id: Date.now(), torres: [] };
    setCondominios([...condominios, nuevo]);
    setShowCondoModal(false);
  };


  const handleAddTorre = (e) => {
    e.preventDefault();
    setCondominios(condominios.map(c => c.id === selectedCondoId 
      ? { ...c, torres: [...c.torres, { id: `T-${Date.now()}`, nombre: newTorreName, pisos: [] }] } 
      : c));
    setShowTorreModal(false);
    setNewTorreName("");
  };


  const handleAddPiso = (e) => {
    e.preventDefault();
    setCondominios(condominios.map(c => c.id === selectedCondoId ? {
      ...c, torres: c.torres.map(t => t.id === selectedTorreId 
        ? { ...t, pisos: [...t.pisos, { nivel: parseInt(newPisoNum), apartamentos: [] }].sort((a,b) => a.nivel - b.nivel) } 
        : t)
    } : c));
    setShowPisoModal(false);
    setNewPisoNum("");
  };


  const handleAddApto = (e) => {
    e.preventDefault();
    setCondominios(condominios.map(c => c.id === selectedCondoId ? {
      ...c, torres: c.torres.map(t => t.id === selectedTorreId ? {
        ...t, pisos: t.pisos.map(p => p.nivel === selectedPisoNivel 
          ? { ...p, apartamentos: [...p.apartamentos, { ...newApto, id: `A-${Date.now()}` }] } 
          : p)
      } : t)
    } : c));
    setShowAptoModal(false);
    setNewApto({ numero: "", metraje: "", derecho_estacionamiento: true });
  };


  return (
    <div style={{ padding: "1.5rem" }}>
      {/* HEADER PRINCIPAL */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#3b82f6", margin: 0 }}>Estructura Física</h1>
          <p style={{ color: "#0ea5e9", fontWeight: 600, fontSize: "0.9rem" }}>Gestión de unidades residenciales Urban Park</p>
        </div>
        <Button onClick={() => setShowCondoModal(true)} style={{ background: "#3b82f6", border: "none", borderRadius: "10px" }} className="shadow-sm px-4 py-2">
          <FiPlus className="me-2" /> Registrar Condominio
        </Button>
      </div>


      {/* RENDERIZADO DE CONDOMINIOS */}
      {condominios.map((condo) => (
        <Card key={condo.id} className="border-0 shadow-sm mb-5" style={{ borderRadius: "20px", overflow: "hidden" }}>
          <Card.Header className="bg-white p-4 border-0">
            <div className="d-flex align-items-center gap-3">
              <div style={{ background: "#eff6ff", padding: "12px", borderRadius: "14px", color: "#3b82f6" }}>
                <FiHome size={24} />
              </div>
              <div>
                <h4 className="m-0 fw-bold" style={{ color: "#1e293b" }}>{condo.nombre}</h4>
                <div className="d-flex gap-2 align-items-center mt-1">
                  <Badge bg="light" text="dark" className="border fw-normal"><FiMapPin size={12}/> {condo.ubicacion}</Badge>
                  <Badge bg={condo.plan === "Premium" ? "success" : "primary"} className="bg-opacity-10 text-success border border-success border-opacity-25">{condo.plan}</Badge>
                </div>
              </div>
            </div>
          </Card.Header>


          <Card.Body className="px-4 pb-4 pt-0">
            <Accordion>
              {condo.torres.map((torre, tIdx) => (
                <Accordion.Item eventKey={tIdx.toString()} key={torre.id} className="border-0 mb-3 shadow-sm rounded-4 overflow-hidden">
                  <Accordion.Header>
                    <FiLayers className="me-2 text-primary" /> <span className="fw-bold" style={{ color: "#475569" }}>{torre.nombre}</span>
                    <Badge bg="primary" className="ms-auto me-3 bg-opacity-10 text-primary">{torre.pisos.length} Niveles</Badge>
                  </Accordion.Header>
                  <Accordion.Body className="bg-light bg-opacity-25">
                    {torre.pisos.map((piso) => (
                      <div key={piso.nivel} className="bg-white p-3 rounded-4 mb-3 shadow-sm border border-light">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <FiGrid className="text-info" /> <span className="fw-bold text-dark">Piso {piso.nivel}</span>
                          </div>
                          <Button variant="link" size="sm" className="text-decoration-none fw-bold text-info" onClick={() => { setSelectedCondoId(condo.id); setSelectedTorreId(torre.id); setSelectedPisoNivel(piso.nivel); setShowAptoModal(true); }}>
                            + Apartamento
                          </Button>
                        </div>


                        <Table responsive borderless hover className="m-0">
                          <thead className="small text-muted text-uppercase fw-bold" style={{ fontSize: "0.7rem" }}>
                            <tr>
                              <th>Número</th>
                              <th>Metraje</th>
                              <th>Cochera</th>
                            </tr>
                          </thead>
                          <tbody>
                            {piso.apartamentos.map((apto) => (
                              <tr key={apto.id} className="align-middle">
                                <td className="fw-bold text-primary">{apto.numero}</td>
                                <td className="text-muted small">{apto.metraje} m²</td>
                                <td>
                                  {apto.derecho_estacionamiento 
                                    ? <Badge bg="success" className="bg-opacity-10 text-success rounded-pill fw-normal">SÍ</Badge>
                                    : <Badge bg="secondary" className="bg-opacity-10 text-muted rounded-pill fw-normal">NO</Badge>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    ))}
                    <Button variant="outline-primary" size="sm" className="w-100 py-2 border-dashed" style={{ borderStyle: "dashed" }} onClick={() => { setSelectedCondoId(condo.id); setSelectedTorreId(torre.id); setShowPisoModal(true); }}>
                      <FiPlus /> Añadir Piso a {torre.nombre}
                    </Button>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
            <Button variant="light" className="w-100 mt-2 py-2 border rounded-3 fw-bold text-muted" onClick={() => { setSelectedCondoId(condo.id); setShowTorreModal(true); }}>
              <FiPlus className="me-1" /> Nueva Torre
            </Button>
          </Card.Body>
        </Card>
      ))}


      {/* --- MODALES --- */}


      {/* MODAL: CONDOMINIO */}
      <Modal show={showCondoModal} onHide={() => setShowCondoModal(false)} centered>
        <Modal.Body className="p-4">
          <h5 className="fw-bold mb-4 text-primary">Registrar Condominio</h5>
          <Form onSubmit={handleAddCondominio}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">NOMBRE COMERCIAL</Form.Label>
              <Form.Control required className="bg-light border-0" onChange={e => setNewCondo({...newCondo, nombre: e.target.value})} />
            </Form.Group>
            <Row>
              <Col><Form.Group className="mb-3"><Form.Label className="small fw-bold text-muted">DISTRITO</Form.Label><Form.Control required className="bg-light border-0" onChange={e => setNewCondo({...newCondo, ubicacion: e.target.value})} /></Form.Group></Col>
              <Col><Form.Group className="mb-4"><Form.Label className="small fw-bold text-muted">PLAN</Form.Label><Form.Select className="bg-light border-0" onChange={e => setNewCondo({...newCondo, plan: e.target.value})}><option value="Básico">Básico</option><option value="Premium">Premium</option></Form.Select></Form.Group></Col>
            </Row>
            <Button type="submit" className="w-100 py-2 fw-bold" style={{ background: "#3b82f6", border: "none", borderRadius: "10px" }}>Guardar Entidad</Button>
          </Form>
        </Modal.Body>
      </Modal>


      {/* MODAL: TORRE */}
      <Modal show={showTorreModal} onHide={() => setShowTorreModal(false)} centered>
        <Modal.Body className="p-4 text-center">
          <FiLayers size={40} className="text-primary mb-3" />
          <h5 className="fw-bold">Vincular Torre</h5>
          <Form onSubmit={handleAddTorre} className="text-start mt-3">
            <Form.Control required className="bg-light border-0 mb-4" placeholder="Nombre de torre (Ej. Torre C)" value={newTorreName} onChange={e => setNewTorreName(e.target.value)} />
            <Button type="submit" className="w-100 py-2 fw-bold" style={{ background: "#3b82f6", border: "none" }}>Confirmar Torre</Button>
          </Form>
        </Modal.Body>
      </Modal>


      {/* MODAL: PISO */}
      <Modal show={showPisoModal} onHide={() => setShowPisoModal(false)} centered size="sm">
        <Modal.Body className="p-4 text-center">
          <h6 className="fw-bold mb-3">Definir Piso</h6>
          <Form onSubmit={handleAddPiso}>
            <Form.Control required type="number" className="bg-light border-0 text-center mb-3" placeholder="Nivel" value={newPisoNum} onChange={e => setNewPisoNum(e.target.value)} />
            <Button type="submit" className="w-100 fw-bold" style={{ background: "#3b82f6", border: "none" }}>Crear</Button>
          </Form>
        </Modal.Body>
      </Modal>


      {/* MODAL: APARTAMENTO */}
      <Modal show={showAptoModal} onHide={() => setShowAptoModal(false)} centered>
        <Modal.Body className="p-4">
          <h5 className="fw-bold mb-4 text-success"><FiPlus /> Nueva Unidad</h5>
          <Form onSubmit={handleAddApto}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">NÚMERO</Form.Label>
                  <Form.Control required className="bg-light border-0" placeholder="101" onChange={e => setNewApto({...newApto, numero: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">METRAJE</Form.Label>
                  <Form.Control required type="number" className="bg-light border-0" placeholder="75" onChange={e => setNewApto({...newApto, metraje: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Check type="switch" label="Derecho a estacionamiento" className="mb-4 small fw-bold" checked={newApto.derecho_estacionamiento} onChange={e => setNewApto({...newApto, derecho_estacionamiento: e.target.checked})} />
            <Button type="submit" className="w-100 py-2 fw-bold" style={{ background: "#10b981", border: "none", borderRadius: "10px" }}>Finalizar</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}