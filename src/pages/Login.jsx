import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import "animate.css";

const Login = () => {
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
          <Col md={6} lg={4}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  {/* Icono de bienvenida */}
                  <div 
                    className="d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '60px', height: '60px', backgroundColor: '#10b981', borderRadius: '15px' }}
                  >
                    <LogIn size={30} color="white" />
                  </div>
                  <h2 className="fw-bold" style={{ color: '#1e1b4b' }}>Bienvenido</h2>
                  <p className="text-muted small">Ingrese sus credenciales para acceder a Urban Park</p>
                </div>

                <Form>
                  {/* Email */}
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">CORREO ELECTRÓNICO</Form.Label>
                    <InputGroup size="sm">
                      <InputGroup.Text className="bg-light border-0"><Mail size={18}/></InputGroup.Text>
                      <Form.Control 
                        type="email" 
                        placeholder="usuario@correo.com" 
                        className="bg-light border-0 py-2" 
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  {/* Contraseña */}
                  <Form.Group className="mb-2">
                    <Form.Label className="small fw-bold">CONTRASEÑA</Form.Label>
                    <InputGroup size="sm">
                      <InputGroup.Text className="bg-light border-0"><Lock size={18}/></InputGroup.Text>
                      <Form.Control 
                        type="password" 
                        placeholder="********" 
                        className="bg-light border-0 py-2" 
                        required
                      />
                    </InputGroup>
                  </Form.Group>

                  {/* Link a Recuperar Contraseña */}
                  <div className="text-end mb-4">
                    <Link 
                      to="/forgot-password" 
                      className="p-0 text-decoration-none small fw-bold" 
                      style={{ color: '#10b981', fontSize: '13px' }}
                    >
                      ¿Olvidó su contraseña?
                    </Link>
                  </div>

                  {/* Botón de Ingreso */}
                  <Button 
                    className="w-100 py-3 mb-4 border-0 fw-bold d-flex align-items-center justify-content-center shadow" 
                    style={{ backgroundColor: '#1e1b4b', borderRadius: '12px' }}
                  >
                    Iniciar Sesión <ArrowRight size={20} className="ms-2" />
                  </Button>

                  {/* Link a Registro */}
                  <div className="text-center">
                    <p className="text-muted small">
                      ¿Aún no eres residente? <br />
                      <Link to="/register" className="fw-bold text-decoration-none" style={{ color: '#1e1b4b' }}>
                        Regístrate aquí
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

export default Login;