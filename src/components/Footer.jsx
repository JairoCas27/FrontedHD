import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Facebook, X, Instagram, Linkedin } from "lucide-react";
import logo from "../images/Logo1.png";

function Footer() {
  return (
    <footer>
      <style>{`
        .footer {
          background-color: #0F172A;
          color: #CBD5E1;
          padding: 70px 0 40px;
          border-top: 1px solid #1E293B;
        }

        .logo-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .footer-logo {
          height: 60px;
          margin-bottom: 20px;
          margin-left: 90px;
        }

        .footer-desc {
          color: #94A3B8;
          line-height: 1.7;
          font-size: 0.95rem;
          max-width: 320px;
          text-align: left;
          margin: 0;
        }

        .footer-title {
          color: #FFFFFF;
          font-weight: 600;
          margin-bottom: 18px;
          font-size: 1rem;
        }

        .footer a {
          color: #94A3B8;
          text-decoration: none;
          display: block;
          margin-bottom: 10px;
          transition: all 0.25s ease;
        }

        .footer a:hover {
          color: #3B82F6;
          transform: translateX(4px);
        }

        .footer-contact div {
          color: #94A3B8;
          margin-bottom: 10px;
        }

        .socials {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }

        .social-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: rgba(148, 163, 184, 0.08);
          color: #94A3B8;
          transition: all 0.25s ease;
        }

        .social-icon:hover {
          background: #3B82F6;
          color: #fff;
          transform: translateY(-3px);
        }

        .social-icon svg {
          width: 18px;
          height: 18px;
        }

        .footer-bottom {
          background-color: #020617;
          padding: 18px 0;
          color: #94A3B8;
          text-align: center;
          border-top: 1px solid #1E293B;
          font-size: 0.85rem;
        }

        .footer-col {
          margin-bottom: 30px;
        }

        @media (max-width: 768px) {
          .footer {
            text-align: center;
          }

          .logo-column {
            align-items: center;
          }

          .footer-logo {
            margin-left: 10px;
          }

          .footer-desc {
            text-align: center;
            margin-bottom: 20px;
          }

          .socials {
            justify-content: center;
          }

          .footer-col {
            text-align: center;
          }
        }
      `}</style>

      <div className="footer">
        <Container fluid="lg">
          <Row className="align-items-start">
            <Col lg={4} md={12} className="footer-col logo-column">
              <img src={logo} alt="Urban Park" className="footer-logo" />

              <p className="footer-desc">
                Sistema digital para la administración eficiente de
                estacionamientos en condominios y edificios, facilitando el
                control total de espacios por parte del administrador.
              </p>
            </Col>

            <Col lg={2} md={6} className="footer-col">
              <h5 className="footer-title">Producto</h5>
              <Link to="/servicios">Funcionalidades</Link>
              <Link to="/precios">Planes</Link>
              <Link to="/login">Login</Link>
            </Col>

            <Col lg={2} md={6} className="footer-col">
              <h5 className="footer-title">Soporte</h5>
              <Link to="/contacto">Contáctanos</Link>
              <Link to="/terminos">Términos</Link>
              <Link to="/privacidad">Privacidad</Link>
            </Col>

            <Col lg={2} md={6} className="footer-col footer-contact">
              <h5 className="footer-title">Contacto</h5>
              <div>+51 900 123 456</div>
              <div>soporte@urbanpark.com</div>
              <div>Lima, Perú</div>
            </Col>

            <Col lg={2} md={6} className="footer-col">
              <h5 className="footer-title">Síguenos</h5>

              <div className="socials">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="social-icon">
                    <Facebook />
                  </div>
                </a>

                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="social-icon">
                    <X />
                  </div>
                </a>

                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="social-icon">
                    <Instagram />
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="social-icon">
                    <Linkedin />
                  </div>
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="footer-bottom">
        <Container>
          © 2026 Urban Park. Todos los derechos reservados.
        </Container>
      </div>
    </footer>
  );
}

export default Footer;