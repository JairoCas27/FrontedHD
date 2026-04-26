import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Servicios = () => {
  // Efecto para activar las animaciones de scroll
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, { threshold: 0.15 });
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-up-background text-up-primary antialiased">
      {/* HEADER */}
      <header className="sticky-top glass-nav border-bottom border-light shadow-sm">
        <div className="container">
          <nav className="d-flex justify-content-between align-items-center" style={{ height: '80px' }}>
            <a href="#" className="d-flex align-items-center text-decoration-none hover-lift">
              <img src="src/images/logo.png" alt="Urban Park Logo" style={{ height: '64px', width: 'auto', objectFit: 'contain' }} />
            </a>
            
            <div className="d-none d-md-flex align-items-center gap-4">
                <Link className="fw-medium text-decoration-none text-up-primary-light hover-lift" to="/" style={{ transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--up-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--up-primary-light)'}>Inicio</Link>
                <Link className="fw-medium text-decoration-none text-up-primary-light hover-lift" to="/nosotros" style={{ transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--up-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--up-primary-light)'}>Nosotros</Link>
                <Link className="fw-bold text-decoration-none text-up-primary border-bottom border-2 border-dark pb-1" style={{ transformOrigin: 'center' }} to="/servicios">Servicios</Link>
                <Link className="fw-medium text-decoration-none text-up-primary-light hover-lift" to="/contacto" style={{ transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--up-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--up-primary-light)'}>Contacto</Link>
            </div>
            
            <button className="btn text-white rounded-pill px-4 fw-bold shadow-sm btn-glow bg-up-primary" style={{ paddingBlock: '10px' }}>
              Iniciar Sesión
            </button>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO SECTION - SERVICIOS */}
        <section className="position-relative py-5 text-white overflow-hidden d-flex align-items-center justify-content-center text-center" style={{ minHeight: '60vh', backgroundColor: 'var(--up-primary)' }}>
          <div className="position-absolute w-100 h-100 top-0 start-0 z-0">
            <img 
              alt="background tech city" 
              className="w-100 h-100" 
              style={{ objectFit: 'cover', mixBlendMode: 'overlay', opacity: '0.3' }} 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            />
            <div className="position-absolute top-0 start-0 w-100 h-100 hero-gradient"></div>
          </div>
          
          <div className="container position-relative z-1 py-5" style={{ maxWidth: '900px' }}>
            <span className="badge rounded-pill fw-bold mb-4 animate-fade-in-up border border-light text-up-accent" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '8px 16px', letterSpacing: '2px' }}>
              NUESTRAS CAPACIDADES
            </span>
            <h1 className="display-4 fw-bold mb-4 animate-fade-in-up delay-100">
              Eficiencia Urbana en cada Movimiento
            </h1>
            <p className="fs-5 text-white-50 fw-light animate-fade-in-up delay-200 px-md-5">
              Nuestra plataforma integra tecnología de vanguardia para la gestión inteligente de estacionamientos y flujos vehiculares en entornos corporativos y residenciales.
            </p>
          </div>
        </section>

        {/* SOLUCIONES FUNCIONALES GRID */}
        <section className="py-5 bg-white">
          <div className="container py-5">
            <div className="text-center mb-5 reveal">
              <h2 className="display-6 fw-bold text-up-primary mt-2">Soluciones Funcionales</h2>
            </div>

            <div className="row g-4">
              {/* Card 1: Control de Acceso (8 columnas) */}
              <div className="col-lg-8 reveal reveal-left delay-100">
                <div className="card h-100 border border-light shadow-sm rounded-4 p-4 p-lg-5 hover-lift overflow-hidden position-relative">
                  <div className="position-absolute bg-up-surface-variant rounded-circle" style={{ width: '150px', height: '150px', bottom: '-40px', left: '-40px', opacity: '0.5' }}></div>
                  <div className="row g-4 align-items-center position-relative z-1 h-100">
                    <div className="col-md-6 order-2 order-md-1">
                      <div className="bg-up-primary text-white rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-4 shadow-sm">
                        <span className="material-symbols-outlined fs-2 icon-rotate-hover">gate</span>
                      </div>
                      <h3 className="h4 fw-bold text-up-primary mb-3">Control de Acceso Vehicular</h3>
                      <p className="text-up-primary-light mb-4">Implementamos sistemas de reconocimiento de matrículas (LPR) y barreras inteligentes integradas para un flujo sin interrupciones y máxima seguridad.</p>
                      <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                        <li className="d-flex align-items-center gap-2 small fw-medium text-up-primary">
                          <span className="material-symbols-outlined text-up-secondary fs-5">check_circle</span> Lectura automática de patentes
                        </li>
                        <li className="d-flex align-items-center gap-2 small fw-medium text-up-primary">
                          <span className="material-symbols-outlined text-up-secondary fs-5">check_circle</span> Integración con sistemas RFID
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-6 order-1 order-md-2 h-100">
                      <img alt="Access Control" className="w-100 h-100 rounded-3 shadow-sm" style={{ objectFit: 'cover', minHeight: '200px' }} src="https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=2000&auto=format&fit=crop" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Gestión de Residentes (4 columnas) */}
              <div className="col-lg-4 reveal reveal-right delay-200">
                <div className="card h-100 border border-light shadow-sm rounded-4 p-4 p-lg-5 hover-lift bg-up-surface-variant overflow-hidden position-relative d-flex flex-column">
                  <div className="position-absolute bg-white rounded-circle" style={{ width: '120px', height: '120px', top: '-30px', right: '-30px', opacity: '0.4' }}></div>
                  <div className="position-relative z-1 flex-grow-1">
                    <div className="bg-white text-up-secondary rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-4 shadow-sm">
                      <span className="material-symbols-outlined fs-2 icon-rotate-hover">group</span>
                    </div>
                    <h3 className="h4 fw-bold text-up-primary mb-3">Gestión de Residentes</h3>
                    <p className="text-up-primary-light mb-0">Base de datos centralizada para el registro detallado de propietarios y sus vehículos autorizados.</p>
                  </div>
                  <div className="mt-4 pt-3 border-top border-secondary border-opacity-10 position-relative z-1">
                    <span className="text-up-secondary fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Panel de Administración</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Monitoreo en Tiempo Real (4 columnas) */}
              <div className="col-lg-4 reveal reveal-left delay-300">
                <div className="card h-100 border-0 shadow rounded-4 p-4 p-lg-5 hover-lift text-white bg-up-primary overflow-hidden position-relative d-flex flex-column">
                  <div className="position-absolute bg-up-secondary rounded-circle animate-pulse-soft" style={{ width: '150px', height: '150px', top: '-40px', right: '-40px', opacity: '0.3' }}></div>
                  <div className="position-relative z-1 flex-grow-1">
                    <div className="rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-4 shadow-sm text-up-accent" style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)' }}>
                      <span className="material-symbols-outlined fs-2 icon-rotate-hover">dashboard</span>
                    </div>
                    <h3 className="h4 fw-bold mb-3">Monitoreo en Tiempo Real</h3>
                    <p className="text-white-50 mb-4">Visualización instantánea de la ocupación de espacios. Mapa interactivo de disponibilidad por niveles y zonas.</p>
                  </div>
                  <div className="d-flex flex-wrap gap-2 position-relative z-1 mt-auto">
                    <span className="badge d-flex align-items-center gap-1 text-success" style={{ backgroundColor: 'rgba(25, 135, 84, 0.15)', border: '1px solid rgba(25, 135, 84, 0.3)' }}>
                      <span className="rounded-circle bg-success" style={{width: '8px', height: '8px'}}></span> DISPONIBLE
                    </span>
                    <span className="badge d-flex align-items-center gap-1 text-danger" style={{ backgroundColor: 'rgba(220, 53, 69, 0.15)', border: '1px solid rgba(220, 53, 69, 0.3)' }}>
                      <span className="rounded-circle bg-danger" style={{width: '8px', height: '8px'}}></span> OCUPADO
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 4: Automatización de Reservas (8 columnas) */}
              <div className="col-lg-8 reveal reveal-right delay-400">
                <div className="card h-100 border border-light shadow-sm rounded-4 p-4 p-lg-5 hover-lift overflow-hidden position-relative">
                  <div className="row g-4 align-items-center h-100">
                    <div className="col-md-6 h-100">
                      <img alt="Visitor Automation" className="w-100 h-100 rounded-3 shadow-sm" style={{ objectFit: 'cover', minHeight: '200px' }} src="src/images/autos.png" />
                    </div>
                    <div className="col-md-6">
                      <div className="bg-up-secondary text-white rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-4 shadow-sm shadow-secondary">
                        <span className="material-symbols-outlined fs-2 icon-rotate-hover">qr_code_2</span>
                      </div>
                      <h3 className="h4 fw-bold text-up-primary mb-3">Automatización de Reservas</h3>
                      <p className="text-up-primary-light mb-4">Generación de códigos QR temporales para usuarios. El residente gestiona el acceso directamente desde su smartphone de forma segura.</p>
                      <button className="btn btn-link text-up-secondary p-0 fw-bold text-decoration-none d-flex align-items-center gap-2 hover-lift">
                        Saber más <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ESCALABILIDAD TOTAL SECTION */}
        <section className="position-relative py-5 text-white overflow-hidden" style={{ backgroundColor: 'var(--up-primary)' }}>
          <div className="position-absolute w-100 h-100 top-0 start-0 z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2000&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'luminosity', opacity: '0.05' }}></div>
          
          <div className="container py-5 position-relative z-1">
            <div className="row align-items-center g-5">
              <div className="col-lg-6 reveal reveal-left delay-100">
                <span className="text-up-accent fw-bold text-uppercase mb-2 d-block" style={{ letterSpacing: '2px', fontSize: '0.875rem' }}>Escalabilidad Total</span>
                <h2 className="display-5 fw-bold mb-4">Soporte Multi-Tenant para Condominios</h2>
                <p className="fs-5 text-white-50 fw-light mb-5">
                  UrbanPark permite gestionar múltiples complejos residenciales o corporativos desde una única consola central. Ideal para empresas de administración de propiedades.
                </p>
                
                <div className="row g-4">
                  <div className="col-sm-6 hover-lift">
                    <div className="p-4 rounded-4 border border-light border-opacity-25 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                      <span className="material-symbols-outlined text-up-accent fs-1 mb-3 icon-rotate-hover">domain</span>
                      <h4 className="h5 fw-bold text-white mb-2">Configuración Aislada</h4>
                      <p className="small text-white-50 mb-0">Datos y reglas de negocio independientes por cada edificio o sucursal.</p>
                    </div>
                  </div>
                  <div className="col-sm-6 hover-lift">
                    <div className="p-4 rounded-4 border border-light border-opacity-25 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                      <span className="material-symbols-outlined text-up-accent fs-1 mb-3 icon-rotate-hover">manage_accounts</span>
                      <h4 className="h5 fw-bold text-white mb-2">Roles Dinámicos</h4>
                      <p className="small text-white-50 mb-0">Permisos granulares para guardias, administradores y dueños.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-6 position-relative reveal reveal-right delay-300">
                <div className="position-absolute bg-up-secondary rounded-circle blur-3xl opacity-25" style={{ width: '80%', height: '80%', top: '10%', left: '10%', filter: 'blur(80px)' }}></div>
                <div className="position-relative bg-white bg-opacity-10 p-3 rounded-4 shadow-lg border border-light border-opacity-25" style={{ backdropFilter: 'blur(15px)', transform: 'rotate(2deg)', transition: 'transform 0.5s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'rotate(0deg)'} onMouseOut={(e) => e.currentTarget.style.transform = 'rotate(2deg)'}>
                  <img alt="City Management Dashboard" className="w-100 rounded-3 shadow-sm" src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-top py-5 reveal">
        <div className="container py-4">
          <div className="row g-5">
            <div className="col-lg-4 col-md-6">
              <div className="mb-4">
                <img src="src/images/logo.png" alt="Urban Park Logo" className="hover-lift" style={{ height: '40px', objectFit: 'contain' }} />
              </div>
              <p className="text-up-primary-light mb-4 small">Líderes en tecnología de gestión urbana y optimización de espacios inteligentes para el futuro.</p>
              <div className="d-flex gap-3">
                <a href="#" className="text-up-secondary text-decoration-none icon-rotate-hover d-inline-block"><span className="material-symbols-outlined">language</span></a>
                <a href="#" className="text-up-secondary text-decoration-none icon-rotate-hover d-inline-block"><span className="material-symbols-outlined">share</span></a>
              </div>
            </div>
            
            <div className="col-lg-2 col-md-6">
              <h5 className="fw-bold text-up-primary mb-4">Producto</h5>
              <ul className="list-unstyled d-flex flex-column gap-2">
                <li><a className="text-up-primary-light text-decoration-none small fw-medium" style={{ transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--up-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--up-primary-light)'} href="#">Características</a></li>
                <li><a className="text-up-primary-light text-decoration-none small fw-medium" style={{ transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--up-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--up-primary-light)'} href="#">Seguridad</a></li>
                <li><a className="text-up-primary-light text-decoration-none small fw-medium" style={{ transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--up-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--up-primary-light)'} href="#">Planes</a></li>
              </ul>
            </div>
            
            <div className="col-lg-2 col-md-6">
              <h5 className="fw-bold text-up-primary mb-4">Compañía</h5>
              <ul className="list-unstyled d-flex flex-column gap-2">
                <li><a className="text-up-primary-light text-decoration-none small fw-medium" style={{ transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--up-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--up-primary-light)'} href="#">Soporte</a></li>
                <li><a className="text-up-primary-light text-decoration-none small fw-medium" style={{ transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--up-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--up-primary-light)'} href="#">Términos</a></li>
                <li><a className="text-up-primary-light text-decoration-none small fw-medium" style={{ transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--up-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--up-primary-light)'} href="#">Privacidad</a></li>
              </ul>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <h5 className="fw-bold text-up-primary mb-4">Boletín Informativo</h5>
              <p className="text-up-primary-light small mb-3">Recibe las últimas novedades.</p>
              <div className="input-group hover-lift shadow-sm rounded">
                <input type="email" className="form-control bg-up-surface-variant border-0 p-3 shadow-none" placeholder="Tu correo electrónico" />
                <button className="btn bg-up-primary text-white px-3 d-flex align-items-center" type="button">
                  <span className="material-symbols-outlined fs-5">send</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center border-top pt-4 mt-5">
            <p className="text-up-primary-light small mb-2 mb-md-0 fw-medium">© 2026 UrbanPark. Todos los derechos reservados.</p>
            <p className="text-up-primary-light small mb-0 d-flex align-items-center gap-1 opacity-75">
              Hecho con <span className="material-symbols-outlined text-up-accent animate-pulse-soft" style={{ fontSize: '14px' }}>favorite</span> para la eficiencia urbana
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Servicios;