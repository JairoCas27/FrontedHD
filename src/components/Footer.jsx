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
          padding: 70px 0 40px 0;
          border-top: 1px solid #1E293B;
        }

        .footer-inner {
          text-align: center;
        }

        .footer-logo {
          height: 60px;
          margin-bottom: 15px;
        }

        .footer-desc {
          max-width: 420px;
          margin: 0 auto 20px auto;
          color: #94A3B8;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .socials {
          display: flex;
          justify-content: center;
          gap: 14px;
          margin-top: 10px;
        }

        .social-icon {
          width: 44px;
          height: 44px;
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
          transform: translateY(-3px) scale(1.08);
        }

        .social-icon svg {
          width: 20px;
          height: 20px;
        }

        .footer-title {
          color: #fff;
          font-weight: 600;
          margin-bottom: 15px;
        }

        .footer a {
          color: #94A3B8;
          text-decoration: none;
          display: block;
          margin-bottom: 8px;
          transition: 0.2s;
        }

        .footer a:hover {
          color: #3B82F6;
          transform: translateX(3px);
        }

        .footer-bottom {
          background-color: #020617;
          padding: 18px 0;
          color: #94A3B8;
          text-align: center;
          border-top: 1px solid #1E293B;
          font-size: 0.85rem;
        }

        .footer-grid {
          text-align: center;
        }

        .footer-col {
          margin-bottom: 25px;
        }
      `}</style>

      <div className="footer">
        <Container>

          <div className="footer-inner mb-5">
            <img src={logo} alt="Urban Park" className="footer-logo" />

            <p className="footer-desc">
              Sistema digital para la administración eficiente de estacionamientos en condominios y edificios, facilitando el control total de espacios por parte del administrador.
            </p>

            <div className="socials">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <div className="social-icon"><Facebook /></div>
              </a>

              <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                <div className="social-icon"><X /></div>
              </a>

              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <div className="social-icon"><Instagram /></div>
              </a>

              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                <div className="social-icon"><Linkedin /></div>
              </a>
            </div>
          </div>

          <Row className="footer-grid">

            <Col md={4} className="footer-col">
              <div className="footer-title">Producto</div>
              <Link to="/servicios">Funcionalidades</Link>
              <Link to="/precios">Planes</Link>
              <Link to="/login">Login</Link>
            </Col>

            <Col md={4} className="footer-col">
              <div className="footer-title">Soporte</div>
              <Link to="/contacto">Contactanos</Link>
              <Link to="/terminos">Términos</Link>
              <Link to="/privacidad">Privacidad</Link>
            </Col>

            <Col md={4} className="footer-col">
              <div className="footer-title">Contacto</div>
              <div>+51 900 123 456</div>
              <div>soporte@urbanpark.com</div>
              <div>Lima, Perú</div>
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