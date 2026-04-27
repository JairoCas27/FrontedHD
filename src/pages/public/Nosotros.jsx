import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Nosotros = () => {
  // Efecto para activar las animaciones de scroll (igual que en Inicio)
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

  // Datos de tu equipo de desarrollo
  const teamMembers = [
    { name: "Jairo Castillo", role: "Project Director & Fundador" },
    { name: "Diego Garcia", role: "CTO & Lead Architect" },
    { name: "Bruno Tupayachi", role: "Operations Manager" },
    { name: "Cristian Candela", role: "Product Designer" },
    { name: "Jeancarlo Mejia", role: "Operations Manager" },
    { name: "Nick Ayala", role: "Product Designer" }
  ];

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
                <Link className="fw-bold text-decoration-none text-up-primary border-bottom border-2 border-dark pb-1" style={{ transformOrigin: 'center' }} to="/nosotros">Nosotros</Link>
                <Link className="fw-medium text-decoration-none text-up-primary-light hover-lift" to="/servicios" style={{ transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--up-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--up-primary-light)'}>Servicios</Link>
                <Link className="fw-medium text-decoration-none text-up-primary-light hover-lift" to="/contacto" style={{ transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--up-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--up-primary-light)'}>Contacto</Link>
            </div>
            
            <button className="btn text-white rounded-pill px-4 fw-bold shadow-sm btn-glow bg-up-primary" style={{ paddingBlock: '10px' }}>
              Iniciar Sesión
            </button>
          </nav>
        </div>
      </header>

      <main className="overflow-hidden">
        {/* HERO SECTION - NOSOTROS */}
        <section className="position-relative py-5 text-white overflow-hidden d-flex align-items-center" style={{ minHeight: '60vh', backgroundColor: 'var(--up-primary)' }}>
          <div className="position-absolute w-100 h-100 top-0 start-0 z-0">
            <img 
              alt="Modern high-tech parking garage" 
              className="w-100 h-100" 
              style={{ objectFit: 'cover', mixBlendMode: 'overlay', opacity: '0.3' }} 
              src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=2070&auto=format&fit=crop"
            />
            <div className="position-absolute top-0 start-0 w-100 h-100 hero-gradient"></div>
          </div>
          
          <div className="container position-relative z-1 py-5">
            <div className="row align-items-center g-5">
              <div className="col-lg-6 pr-lg-5">
                <span className="badge rounded-pill fw-bold mb-4 animate-fade-in-up border border-light text-up-accent" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '8px 16px', letterSpacing: '2px' }}>
                  NUESTRA ESENCIA
                </span>
                <h1 className="display-4 fw-bold mb-4 animate-fade-in-up delay-100">
                  Liderando la Transformación del Estacionamiento Urbano
                </h1>
                <p className="fs-5 text-white-50 fw-light animate-fade-in-up delay-200">
                  En UrbanPark, fusionamos tecnología de desarrollo Full-Stack con eficiencia operativa para redefinir cómo las ciudades y empresas gestionan sus espacios de movilidad.
                </p>
              </div>
              <div className="col-lg-6">
                <div className="rounded-4 overflow-hidden shadow-lg border border-light border-opacity-25 animate-fade-in-up delay-300 hover-lift" style={{ aspectRatio: '16/9' }}>
                  <img className="w-100 h-100" style={{ objectFit: 'cover' }} alt="Cityscape and smart parking" src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop"/>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MISION & VISION SECTION */}
        <section className="py-5">
          <div className="container py-5">
            <div className="row g-4">
              {/* Misión */}
              <div className="col-md-7 reveal reveal-left delay-100">
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 p-lg-5 hover-lift overflow-hidden position-relative">
                  <div className="position-absolute bg-up-surface-variant rounded-circle" style={{ width: '150px', height: '150px', bottom: '-40px', right: '-40px', opacity: '0.5' }}></div>
                  <div className="position-relative z-1">
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <div className="bg-up-surface-variant rounded-3 d-flex align-items-center justify-content-center p-3">
                        <span className="material-symbols-outlined fs-2 text-up-secondary icon-rotate-hover">precision_manufacturing</span>
                      </div>
                      <h2 className="h2 fw-bold text-up-primary mb-0">Nuestra Misión</h2>
                    </div>
                    <p className="fs-5 text-up-primary-light mb-4">
                      Automatizar y asegurar la gestión de estacionamientos mediante soluciones tecnológicas inteligentes que eliminen la fricción operativa, garantizando rentabilidad máxima y una experiencia de usuario sin precedentes. Nos enfocamos en la arquitectura robusta y la seguridad absoluta del dato.
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="badge badge-outline-up rounded-pill py-2 px-3 text-uppercase text-secondary" style={{ letterSpacing: '1px' }}>Automatización</span>
                      <span className="badge badge-outline-up rounded-pill py-2 px-3 text-uppercase text-secondary" style={{ letterSpacing: '1px' }}>Desarrollo Ágil</span>
                      <span className="badge badge-outline-up rounded-pill py-2 px-3 text-uppercase text-secondary" style={{ letterSpacing: '1px' }}>Seguridad</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visión */}
              <div className="col-md-5 reveal reveal-right delay-200">
                <div className="card h-100 border-0 shadow rounded-4 p-4 p-lg-5 hover-lift text-white bg-up-primary overflow-hidden position-relative d-flex flex-column justify-content-between">
                  <div className="position-absolute bg-up-secondary rounded-circle animate-pulse-soft" style={{ width: '150px', height: '150px', top: '-40px', left: '-40px', opacity: '0.3' }}></div>
                  <div className="position-relative z-1">
                    <div className="rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-4 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)' }}>
                      <span className="material-symbols-outlined fs-2 text-up-accent icon-rotate-hover">trending_up</span>
                    </div>
                    <h2 className="h2 fw-bold mb-3">Nuestra Visión</h2>
                    <p className="text-white-50 fs-6">
                      Consolidarnos como la plataforma #1 de gestión urbana en la región, impulsando el concepto de "Smart Parking" hacia una red conectada que optimice el flujo vehicular de las metrópolis del futuro.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-top border-light border-opacity-25 position-relative z-1">
                    <p className="small fw-bold text-up-accent text-uppercase tracking-widest mb-1" style={{ letterSpacing: '2px' }}>Proyección 2026</p>
                    <p className="fs-3 fw-bold mb-0">+500 Ubicaciones Conectadas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPETITIVE ADVANTAGE */}
        <section className="py-5 bg-up-background">
          <div className="container py-4">
            <div className="text-center mb-5 reveal">
              <span className="text-up-secondary fw-bold text-uppercase" style={{ letterSpacing: '2px', fontSize: '0.875rem' }}>Ventaja Competitiva</span>
              <h2 className="display-6 fw-bold text-up-primary mt-2">¿Por qué elegir UrbanPark?</h2>
            </div>
            
            <div className="row g-4">
              <div className="col-md-4 reveal reveal-left delay-100">
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 p-lg-5 hover-lift text-center text-md-start">
                  <div className="bg-up-surface-variant rounded-3 d-inline-flex align-items-center justify-content-center mb-4 mx-auto mx-md-0" style={{ width: '70px', height: '70px' }}>
                    <span className="material-symbols-outlined fs-1 text-up-secondary icon-rotate-hover">shield</span>
                  </div>
                  <h3 className="h4 fw-bold text-up-primary mb-3">Seguridad Robusta</h3>
                  <p className="text-up-primary-light mb-0">Protocolos de encriptación y monitoreo en tiempo real para cada transacción, basados en las mejores prácticas de ciberseguridad.</p>
                </div>
              </div>
              <div className="col-md-4 reveal delay-200">
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 p-lg-5 hover-lift text-center text-md-start">
                  <div className="bg-up-surface-variant rounded-3 d-inline-flex align-items-center justify-content-center mb-4 mx-auto mx-md-0" style={{ width: '70px', height: '70px' }}>
                    <span className="material-symbols-outlined fs-1 text-up-secondary icon-rotate-hover">database</span>
                  </div>
                  <h3 className="h4 fw-bold text-up-primary mb-3">Bases de Datos Escalables</h3>
                  <p className="text-up-primary-light mb-0">Arquitectura estructurada para manejar altos volúmenes de datos sin interrupciones, asegurando el historial de sus usuarios.</p>
                </div>
              </div>
              <div className="col-md-4 reveal reveal-right delay-300">
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 p-lg-5 hover-lift text-center text-md-start">
                  <div className="bg-up-surface-variant rounded-3 d-inline-flex align-items-center justify-content-center mb-4 mx-auto mx-md-0" style={{ width: '70px', height: '70px' }}>
                    <span className="material-symbols-outlined fs-1 text-up-secondary icon-rotate-hover">bolt</span>
                  </div>
                  <h3 className="h4 fw-bold text-up-primary mb-3">Integración Full-Stack</h3>
                  <p className="text-up-primary-light mb-0">Desarrollos que se conectan ágilmente desde el backend hasta interfaces front-end intuitivas, en cuestión de horas.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section className="py-5" style={{ backgroundColor: 'rgba(243, 235, 245, 0.3)' }}>
          <div className="container py-5">
            <div className="mb-5 reveal">
              <span className="text-up-secondary fw-bold text-uppercase" style={{ letterSpacing: '2px', fontSize: '0.875rem' }}>El Talento</span>
              <h2 className="display-6 fw-bold text-up-primary mt-2">Nuestro Equipo</h2>
              <p className="fs-5 text-up-primary-light mt-3" style={{ maxWidth: '600px' }}>
                Desarrolladores y expertos apasionados por la arquitectura de software y la ingeniería detrás de la movilidad.
              </p>
            </div>
            
            <div className="row g-4">
              {teamMembers.map((member, index) => (
                <div key={index} className={`col-sm-6 col-lg-4 reveal delay-${(index % 3 + 1) * 100}`}>
                  <div className="card border-0 shadow-sm rounded-4 overflow-hidden hover-lift h-100">
                    <div className="overflow-hidden" style={{ height: '250px' }}>
                      <img 
                        className="w-100 h-100 team-img" 
                        style={{ objectFit: 'cover' }} 
                        alt={member.name} 
                        src="https://elcomercio.pe/resizer/v2/ZNBSQUZNJ5HSNEIWHVHMKHLLWU.jpg?auth=8ee2de99b531230e8e3b9e9ed43cd3705061545bbf1fca10660fceaebd81be17&width=2400&height=1620&quality=75&smart=true"
                      />
                    </div>
                    <div className="card-body text-center p-4 bg-white z-1 position-relative">
                      <h4 className="h5 fw-bold text-up-primary mb-1">{member.name}</h4>
                      <p className="small fw-bold text-up-secondary text-uppercase tracking-widest mb-0" style={{ letterSpacing: '1px' }}>{member.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-top py-5 mt-5 reveal">
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
                <li><a className="text-up-primary-light text-decoration-none small fw-medium" href="#">Características</a></li>
                <li><a className="text-up-primary-light text-decoration-none small fw-medium" href="#">Seguridad Biométrica</a></li>
                <li><a className="text-up-primary-light text-decoration-none small fw-medium" href="#">Precios y Planes</a></li>
              </ul>
            </div>
            
            <div className="col-lg-2 col-md-6">
              <h5 className="fw-bold text-up-primary mb-4">Compañía</h5>
              <ul className="list-unstyled d-flex flex-column gap-2">
                <li><a className="text-up-primary-light text-decoration-none small fw-medium" href="#">Centro de Soporte</a></li>
                <li><a className="text-up-primary-light text-decoration-none small fw-medium" href="#">Términos Legales</a></li>
                <li><a className="text-up-primary-light text-decoration-none small fw-medium" href="#">Política de Privacidad</a></li>
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
            <p className="text-up-primary-light small mb-2 mb-md-0 fw-medium">© 2026 UrbanPark Condominios. Todos los derechos reservados.</p>
            <p className="text-up-primary-light small mb-0 d-flex align-items-center gap-1 opacity-75">
              Hecho con <span className="material-symbols-outlined text-up-accent animate-pulse-soft" style={{ fontSize: '14px' }}>favorite</span> para la eficiencia urbana
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Nosotros;