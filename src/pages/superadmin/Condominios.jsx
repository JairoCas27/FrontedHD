import { useState } from "react";
import { FiPlus, FiHome, FiLayers, FiGrid, FiCheckCircle, FiXCircle, FiHash, FiMaximize, FiInfo } from "react-icons/fi";
import { Accordion, Badge, Card, Button, Table, Modal, Form, Row, Col } from "react-bootstrap";

export default function Condominios() {
  // ESTADOS DE CONTROL
  const [showCondoModal, setShowCondoModal] = useState(false);
  const [showTorreModal, setShowTorreModal] = useState(false);
  const [showPisoModal, setShowPisoModal] = useState(false);
  const [showAptoModal, setShowAptoModal] = useState(false);
  
  const [selectedCondoId, setSelectedCondoId] = useState(null);
  const [selectedTorreId, setSelectedTorreId] = useState(null);
  const [selectedPisoNivel, setSelectedPisoNivel] = useState(null);

  const [condominios, setCondominios] = useState([
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
            { nivel: 1, apartamentos: [{ id: "A1", numero: "101", metraje: 85, derecho_estacionamiento: true }] }
          ] 
        }
      ]
    }
  ]);

  // Estados de formularios
  const [newCondo, setNewCondo] = useState({ nombre: "", ubicacion: "", plan: "Básico" });
  const [newTorreName, setNewTorreName] = useState("");
  const [newPisoNum, setNewPisoNum] = useState("");
  const [newApto, setNewApto] = useState({ numero: "", metraje: "", derecho_estacionamiento: true });

  // LÓGICA DE ACTUALIZACIÓN 

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
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1e1b4b", letterSpacing: "-0.5px" }}>Estructura Física</h1>
          <p className="text-muted">Despliegue masivo de unidades residenciales</p>
        </div>
        <Button onClick={() => setShowCondoModal(true)} style={{ background: "#1e1b4b", border: "none", borderRadius: "10px" }} className="shadow-sm px-4 py-2">
          <FiPlus className="me-2" /> Registrar Condominio
        </Button>
      </div>

      {/* RENDERIZADO DE CONDOMINIOS */}
      {condominios.map((condo) => (
        <Card key={condo.id} className="border-0 shadow-sm mb-5" style={{ borderRadius: "20px", overflow: "hidden" }}>
          <Card.Header className="bg-white p-4 border-0">
            <div className="d-flex align-items-center gap-3">
              <div style={{ background: "#4f46e5", padding: "12px", borderRadius: "14px", color: "#fff" }}>
                <FiHome size={24} />
              </div>
              <div>
                <h4 className="m-0 fw-bold" style={{ color: "#1e293b" }}>{condo.nombre}</h4>
                <div className="d-flex gap-2 align-items-center mt-1">
                  <Badge bg="light" text="dark" className="border">{condo.ubicacion}</Badge>
                  <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25">{condo.plan}</Badge>
                </div>
              </div>
            </div>
          </Card.Header>

          <Card.Body className="px-4 pb-4 pt-0">
            <Accordion>
              {condo.torres.map((torre, tIdx) => (
                <Accordion.Item eventKey={tIdx.toString()} key={torre.id} className="border-0 mb-3 shadow-sm rounded-4 overflow-hidden">
                  <Accordion.Header className="custom-acc-header">
                    <FiLayers className="me-2 text-primary" /> <span className="fw-bold">{torre.nombre}</span>
                    <Badge bg="primary" className="ms-auto me-3 bg-opacity-10 text-primary">{torre.pisos.length} Niveles</Badge>
                  </Accordion.Header>
                  <Accordion.Body className="bg-light bg-opacity-50">
                    {torre.pisos.map((piso) => (
                      <div key={piso.nivel} className="bg-white p-3 rounded-4 mb-3 shadow-sm border border-light">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <FiGrid className="text-muted" /> <span className="fw-bold">Piso {piso.nivel}</span>
                          </div>
                          <Button variant="link" size="sm" className="text-decoration-none fw-bold" onClick={() => { setSelectedCondoId(condo.id); setSelectedTorreId(torre.id); setSelectedPisoNivel(piso.nivel); setShowAptoModal(true); }}>
                            + Agregar Apartamento
                          </Button>
                        </div>

                        <Table responsive borderless hover className="m-0">
                          <thead className="small text-muted text-uppercase" style={{ letterSpacing: "0.5px" }}>
                            <tr>
                              <th>Número</th>
                              <th>Metraje</th>
                              <th>Estacionamiento</th>
                            </tr>
                          </thead>
                          <tbody>
                            {piso.apartamentos.map((apto) => (
                              <tr key={apto.id} className="align-middle">
                                <td className="fw-bold text-dark">{apto.numero}</td>
                                <td className="text-muted">{apto.metraje} m²</td>
                                <td>
                                  {apto.derecho_estacionamiento 
                                    ? <Badge bg="success" className="bg-opacity-10 text-success"><FiCheckCircle className="me-1"/> Con derecho</Badge>
                                    : <Badge bg="secondary" className="bg-opacity-10 text-muted"><FiXCircle className="me-1"/> Sin derecho</Badge>}
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
            <Button variant="dark" className="w-100 mt-2 py-3 rounded-4 shadow-sm fw-bold" onClick={() => { setSelectedCondoId(condo.id); setShowTorreModal(true); }}>
              <FiPlus className="me-2" /> Vincular Nueva Torre
            </Button>
          </Card.Body>
        </Card>
      ))}

      {/* --- MODALES FUNCIONALES --- */}

      {/* MODAL: CONDOMINIO */}
      <Modal show={showCondoModal} onHide={() => setShowCondoModal(false)} centered>
        <Modal.Body className="p-4">
          <h5 className="fw-bold mb-4">Registrar Nuevo Condominio</h5>
          <Form onSubmit={handleAddCondominio}>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">NOMBRE COMERCIAL</Form.Label>
              <Form.Control required className="bg-light border-0 py-2" placeholder="Ej. Jerarquía Residencial II" onChange={e => setNewCondo({...newCondo, nombre: e.target.value})} />
            </Form.Group>
            <Row>
              <Col><Form.Group className="mb-3"><Form.Label className="small fw-bold">DISTRITO</Form.Label><Form.Control required className="bg-light border-0" placeholder="Ej. Comas" onChange={e => setNewCondo({...newCondo, ubicacion: e.target.value})} /></Form.Group></Col>
              <Col><Form.Group className="mb-4"><Form.Label className="small fw-bold">PLAN</Form.Label><Form.Select className="bg-light border-0" onChange={e => setNewCondo({...newCondo, plan: e.target.value})}><option value="Básico">Básico</option><option value="Premium">Premium</option></Form.Select></Form.Group></Col>
            </Row>
            <Button type="submit" className="w-100 py-2 fw-bold" style={{ background: "#1e1b4b", border: "none" }}>Guardar Entidad Raíz</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* MODAL: TORRE */}
      <Modal show={showTorreModal} onHide={() => setShowTorreModal(false)} centered>
        <Modal.Body className="p-4 text-center">
          <FiLayers size={40} className="text-primary mb-3" />
          <h5 className="fw-bold">Agregar Torre</h5>
          <Form onSubmit={handleAddTorre} className="text-start mt-3">
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold">IDENTIFICADOR DE TORRE</Form.Label>
              <Form.Control required className="bg-light border-0 py-2" placeholder="Ej. Torre C / Edificio Central" value={newTorreName} onChange={e => setNewTorreName(e.target.value)} />
            </Form.Group>
            <Button type="submit" className="w-100 py-2 fw-bold" style={{ background: "#1e1b4b", border: "none" }}>Vincular Torre</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* MODAL: PISO */}
      <Modal show={showPisoModal} onHide={() => setShowPisoModal(false)} centered size="sm">
        <Modal.Body className="p-4">
          <h6 className="fw-bold mb-3 text-center">Definir Nivel</h6>
          <Form onSubmit={handleAddPiso}>
            <Form.Control required type="number" className="bg-light border-0 text-center fs-4 mb-3" placeholder="0" value={newPisoNum} onChange={e => setNewPisoNum(e.target.value)} />
            <Button type="submit" className="w-100" style={{ background: "#1e1b4b", border: "none" }}>Crear Piso</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* MODAL: APARTAMENTO (LA UNIDAD FINAL) */}
      <Modal show={showAptoModal} onHide={() => setShowAptoModal(false)} centered>
        <Modal.Body className="p-4">
          <div className="d-flex align-items-center gap-2 mb-4">
            <div style={{ background: "#10b981", padding: "8px", borderRadius: "8px", color: "#fff" }}><FiPlus /></div>
            <h5 className="m-0 fw-bold">Nueva Unidad Final</h5>
          </div>
          <Form onSubmit={handleAddApto}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold"><FiHash className="me-1"/> NÚMERO</Form.Label>
                  <Form.Control required className="bg-light border-0" placeholder="Ej. 101" onChange={e => setNewApto({...newApto, numero: e.target.value})} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold"><FiMaximize className="me-1"/> METRAJE (m²)</Form.Label>
                  <Form.Control required type="number" className="bg-light border-0" placeholder="Ej. 75" onChange={e => setNewApto({...newApto, metraje: e.target.value})} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-4 bg-light p-3 rounded-3 d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-bold small">Derecho a Estacionamiento</div>
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>¿Esta unidad cuenta con cochera propia?</div>
              </div>
              <Form.Check type="switch" id="est-switch" checked={newApto.derecho_estacionamiento} onChange={e => setNewApto({...newApto, derecho_estacionamiento: e.target.checked})} />
            </Form.Group>
            <Button type="submit" className="w-100 py-2 fw-bold shadow-sm" style={{ background: "#10b981", border: "none" }}>Finalizar Unidad</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}