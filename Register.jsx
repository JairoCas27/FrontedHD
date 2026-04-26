import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { Fingerprint, Phone, ChevronRight, Mail, Lock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [hasVehicle, setHasVehicle] = useState(false);
  
  // ✅ NUEVO: Estado para todos los campos del formulario
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    celular: '',
    email: '',
    password: '',
    confirmPassword: '',
    placa: '',
    modelo: '',
    color: ''
  });

  // ✅ NUEVO: Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ NUEVO: Guardar en localStorage al enviar
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const userData = {
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      dni: formData.dni,
      celular: formData.celular,
      email: formData.email,
      password: formData.password,
      hasVehicle: hasVehicle,
      vehicle: hasVehicle ? {
        placa: formData.placa,
        modelo: formData.modelo,
        color: formData.color
      } : null
    };

    localStorage.setItem('urbanParkUser', JSON.stringify(userData));
    alert('Registro guardado exitosamente en localStorage');
  };

  return (
    <div 
      style={{ 
        backgroundImage: 'linear-gradient(rgba(30, 27, 75, 0.8), rgba(30, 27, 75, 0.8)), url("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600")', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh' 
      }} 
      className="d-flex align-items-center py-5"
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: '#1e1b4b' }}>Registro de Residente</h2>
                  <p className="text-muted">Cree su cuenta para el sistema Urban Park</p>
                </div>

                <Form onSubmit={handleSubmit}>    {/* ✅ onSubmit agregado */}

                  {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
                  <h6 className="text-uppercase small fw-bold mb-3" style={{ color: '#10b981', letterSpacing: '1px' }}>Información Personal</h6>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Label className="small fw-bold">NOMBRES</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleChange}
                        placeholder="Juan Pablo" 
                        className="bg-light border-0 py-2" 
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="small fw-bold">APELLIDOS</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        placeholder="Pérez García" 
                        className="bg-light border-0 py-2" 
                      />
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Label className="small fw-bold">DNI</Form.Label>
                      <InputGroup size="sm">
                        <InputGroup.Text className="bg-light border-0"><Fingerprint size={18}/></InputGroup.Text>
                        <Form.Control 
                          type="text" 
                          name="dni"
                          value={formData.dni}
                          onChange={handleChange}
                          placeholder="8 dígitos" 
                          className="bg-light border-0 py-2" 
                        />
                      </InputGroup>
                    </Col>
                    <Col md={6}>
                      <Form.Label className="small fw-bold">NÚMERO CELULAR</Form.Label>
                      <InputGroup size="sm">
                        <InputGroup.Text className="bg-light border-0"><Phone size={18}/></InputGroup.Text>
                        <Form.Control 
                          type="text" 
                          name="celular"
                          value={formData.celular}
                          onChange={handleChange}
                          placeholder="999 999 999" 
                          className="bg-light border-0 py-2" 
                        />
                      </InputGroup>
                    </Col>
                  </Row>

                  {/* SECCIÓN 2: CREDENCIALES DE ACCESO */}
                  <h6 className="text-uppercase small fw-bold mb-3 mt-4" style={{ color: '#10b981', letterSpacing: '1px' }}>Credenciales de Acceso</h6>
                  
                  <Row className="mb-3">
                    <Col md={12}>
                      <Form.Label className="small fw-bold">CORREO ELECTRÓNICO</Form.Label>
                      <InputGroup size="sm">
                        <InputGroup.Text className="bg-light border-0"><Mail size={18}/></InputGroup.Text>
                        <Form.Control 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="usuario@correo.com" 
                          className="bg-light border-0 py-2" 
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                  
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Label className="small fw-bold">CONTRASEÑA</Form.Label>
                      <InputGroup size="sm">
                        <InputGroup.Text className="bg-light border-0"><Lock size={18}/></InputGroup.Text>
                        <Form.Control 
                          type="password" 
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="********" 
                          className="bg-light border-0 py-2" 
                        />
                      </InputGroup>
                    </Col>
                    <Col md={6}>
                      <Form.Label className="small fw-bold">CONFIRMAR CONTRASEÑA</Form.Label>
                      <InputGroup size="sm">
                        <InputGroup.Text className="bg-light border-0"><CheckCircle size={18}/></InputGroup.Text>
                        <Form.Control 
                          type="password" 
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="********" 
                          className="bg-light border-0 py-2" 
                        />
                      </InputGroup>
                    </Col>
                  </Row>

                  <hr className="my-4 opacity-25" />

                  {/* SECCIÓN 3: VEHÍCULO */}
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="text-uppercase small fw-bold m-0" style={{ color: '#10b981', letterSpacing: '1px' }}>¿Cuenta con vehículo?</h6>
                    <Form.Check 
                      type="switch"
                      id="vehicle-switch"
                      checked={hasVehicle}
                      onChange={(e) => setHasVehicle(e.target.checked)}
                      label={hasVehicle ? "SÍ" : "NO"}
                      className="fw-bold"
                    />
                  </div>

                  {hasVehicle && (
                    <div className="p-4 rounded-4 mb-4 shadow-sm" style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                      <Row>
                        <Col md={4}>
                          <Form.Label className="extra-small fw-bold small">PLACA</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="placa"
                            value={formData.placa}
                            onChange={handleChange}
                            placeholder="ABC-123" 
                            className="border-0 py-2 mb-2" 
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Label className="extra-small fw-bold small">MODELO</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="modelo"
                            value={formData.modelo}
                            onChange={handleChange}
                            placeholder="Toyota Corolla" 
                            className="border-0 py-2 mb-2" 
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Label className="extra-small fw-bold small">COLOR</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            placeholder="Gris Plata" 
                            className="border-0 py-2 mb-2" 
                          />
                        </Col>
                      </Row>
                    </div>
                  )}

                  <Button 
                    type="submit"
                    className="w-100 py-3 mt-3 border-0 fw-bold d-flex align-items-center justify-content-center shadow" 
                    style={{ backgroundColor: '#1e1b4b', borderRadius: '12px' }}
                  >
                    Finalizar Registro <ChevronRight size={20} className="ms-2" />
                  </Button>

                  <div className="text-center mt-4">
                    <p className="text-muted small">
                      ¿Ya tienes una cuenta? <br />
                      <Link to="/login" className="fw-bold text-decoration-none" style={{ color: '#1e1b4b' }}>
                        Inicia sesión aquí
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;