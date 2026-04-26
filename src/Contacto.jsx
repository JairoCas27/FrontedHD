import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Contacto = () => {
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
                <Link className="fw-medium text-decoration-none text-up-primary-light hover-lift" to="/servicios" style={{ transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--up-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--up-primary-light)'}>Servicios</Link>
                <Link className="fw-bold text-decoration-none text-up-primary border-bottom border-2 border-dark pb-1" style={{ transformOrigin: 'center' }} to="/contacto">Contacto</Link>
                </div>
                
                <button className="btn text-white rounded-pill px-4 fw-bold shadow-sm btn-glow bg-up-primary" style={{ paddingBlock: '10px' }}>
                Iniciar Sesión
                </button>
            </nav>
            </div>
        </header>

        <main className="overflow-hidden">
            {/* HERO SECTION - CONTACTO */}
            <section className="position-relative py-5 text-white overflow-hidden d-flex align-items-center justify-content-center text-center" style={{ minHeight: '50vh', backgroundColor: 'var(--up-primary)' }}>
            <div className="position-absolute w-100 h-100 top-0 start-0 z-0">
                <img 
                alt="Modern tech office space" 
                className="w-100 h-100" 
                style={{ objectFit: 'cover', mixBlendMode: 'overlay', opacity: '0.2' }} 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop"
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 hero-gradient"></div>
            </div>
            
            <div className="container position-relative z-1 py-5" style={{ maxWidth: '800px' }}>
                <span className="badge rounded-pill fw-bold mb-4 animate-fade-in-up border border-light text-up-accent" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '8px 16px', letterSpacing: '2px' }}>
                CONECTEMOS
                </span>
                <h1 className="display-4 fw-bold mb-4 animate-fade-in-up delay-100">
                Estamos aquí para ayudarle
                </h1>
                <p className="fs-5 text-white-50 fw-light animate-fade-in-up delay-200">
                Optimice su gestión de estacionamiento hoy mismo. Nuestro equipo técnico y comercial está disponible para resolver sus dudas y crear una solución a su medida.
                </p>
            </div>
            </section>

            {/* SECCIÓN PRINCIPAL DE CONTACTO */}
            <section className="py-5 bg-white">
            <div className="container py-5">
                <div className="row g-5">
                
                {/* Formulario (7 columnas) */}
                <div className="col-lg-7 reveal reveal-left delay-100">
                    <div className="card h-100 border border-light shadow-sm rounded-4 p-4 p-lg-5 hover-lift overflow-hidden position-relative">
                    <div className="position-absolute bg-up-surface-variant rounded-circle" style={{ width: '150px', height: '150px', top: '-40px', right: '-40px', opacity: '0.5' }}></div>
                    
                    <div className="position-relative z-1">
                        <div className="d-flex align-items-center gap-3 border-bottom border-light pb-4 mb-4">
                        <div className="bg-up-primary text-white rounded-3 d-inline-flex align-items-center justify-content-center p-3 shadow-sm">
                            <span className="material-symbols-outlined fs-3 icon-rotate-hover">mail</span>
                        </div>
                        <h2 className="h3 fw-bold text-up-primary mb-0">Enviar un mensaje</h2>
                        </div>
                        
                        <form>
                        <div className="row g-4 mb-4">
                            <div className="col-md-6">
                            <label className="form-label text-up-secondary fw-bold text-uppercase small tracking-widest" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Nombre Completo</label>
                            <input type="text" className="form-control bg-up-background border-0 p-3 shadow-sm rounded-3" placeholder="Ej. Juan Pérez" />
                            </div>
                            <div className="col-md-6">
                            <label className="form-label text-up-secondary fw-bold text-uppercase small tracking-widest" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Correo Electrónico</label>
                            <input type="email" className="form-control bg-up-background border-0 p-3 shadow-sm rounded-3" placeholder="juan@empresa.com" />
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="form-label text-up-secondary fw-bold text-uppercase small tracking-widest" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Asunto</label>
                            <select className="form-select bg-up-background border-0 p-3 shadow-sm rounded-3 text-up-primary cursor-pointer">
                            <option>Soporte Técnico</option>
                            <option>Ventas y Cotizaciones</option>
                            <option>Alianzas Estratégicas</option>
                            <option>Otros</option>
                            </select>
                        </div>
                        
                        <div className="mb-4">
                            <label className="form-label text-up-secondary fw-bold text-uppercase small tracking-widest" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Mensaje</label>
                            <textarea className="form-control bg-up-background border-0 p-3 shadow-sm rounded-3" rows="5" placeholder="Describa su requerimiento detalladamente..." style={{ resize: 'none' }}></textarea>
                        </div>
                        
                        <div className="text-end pt-2">
                            <button type="submit" className="btn bg-up-secondary text-white rounded-3 px-5 py-3 fw-bold shadow btn-glow d-inline-flex align-items-center gap-2">
                            Enviar Mensaje
                            <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                        </form>
                    </div>
                    </div>
                </div>

                {/* Información y Mapa (5 columnas) */}
                <div className="col-lg-5 d-flex flex-column gap-4 reveal reveal-right delay-200">
                    
                    {/* Tarjeta Dirección */}
                    <div className="card border-light shadow-sm rounded-4 p-4 hover-lift bg-up-surface-variant">
                    <div className="d-flex align-items-start gap-3">
                        <div className="bg-white text-up-secondary rounded-3 d-flex align-items-center justify-content-center p-3 shadow-sm icon-rotate-hover">
                        <span className="material-symbols-outlined fs-3">location_on</span>
                        </div>
                        <div>
                        <p className="text-up-secondary fw-bold text-uppercase mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Dirección Principal</p>
                        <h4 className="h5 fw-bold text-up-primary mb-1">Av. Alfredo Mendiola 6377, Los Olivos</h4>
                        <p className="small text-up-primary-light mb-0">cerca de Plaza Norte - UTP</p>
                        </div>
                    </div>
                    </div>

                    {/* Tarjeta Canales */}
                    <div className="card border-0 shadow rounded-4 p-4 hover-lift bg-up-primary text-white overflow-hidden position-relative">
                    <div className="position-absolute bg-up-secondary rounded-circle animate-pulse-soft" style={{ width: '100px', height: '100px', bottom: '-20px', right: '-20px', opacity: '0.4' }}></div>
                    <div className="d-flex align-items-start gap-3 position-relative z-1">
                        <div className="rounded-3 d-flex align-items-center justify-content-center p-3 shadow-sm text-up-accent icon-rotate-hover" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <span className="material-symbols-outlined fs-3">contact_support</span>
                        </div>
                        <div>
                        <p className="text-up-accent fw-bold text-uppercase mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Canales Directos</p>
                        <h4 className="h5 fw-bold text-white mb-1">+51 987654321</h4>
                        <p className="small text-white-50 mb-3">contacto@urbanpark.com</p>
                        <span className="badge rounded-pill fw-normal" style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '6px 12px' }}>Lun - Vie: 09:00 - 18:00</span>
                        </div>
                    </div>
                    </div>

                    {/* Mapa */}
                    <div className="card border-light shadow-sm rounded-4 overflow-hidden hover-lift flex-grow-1 position-relative" style={{ minHeight: '250px' }}>
                    <img 
                        alt="Map view" 
                        className="position-absolute w-100 h-100 team-img" 
                        style={{ objectFit: 'cover' }} 
                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
                    />
                    <div className="position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(45, 22, 61, 0.2)', transition: 'background-color 0.5s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'transparent'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(45, 22, 61, 0.2)'}></div>
                    
                    <div className="position-absolute bottom-0 start-0 m-4 bg-white bg-opacity-90 p-3 rounded-3 shadow-sm" style={{ backdropFilter: 'blur(5px)' }}>
                        <p className="text-up-secondary fw-bold text-uppercase mb-1 d-flex align-items-center gap-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                        <span className="material-symbols-outlined fs-6">map</span> MAPA INTERACTIVO
                        </p>
                        <p className="small fw-medium text-up-primary mb-0">Haz clic para ampliar ruta</p>
                    </div>
                    </div>

                </div>
                </div>
            </div>
            </section>

            {/* SECCIÓN DE PARTNERS (Marcas) */}
            <section className="py-5 bg-white border-top border-light">
            <div className="container py-4 reveal">
                <p className="text-center text-up-primary-light fw-bold text-uppercase mb-5" style={{ fontSize: '0.75rem', letterSpacing: '2px' }}>
                RESPALDADO POR LÍDERES URBANOS E INNOVADORES
                </p>
                
                <div 
                className="d-flex flex-wrap justify-content-center align-items-center gap-4 gap-lg-5"
                style={{ filter: 'grayscale(100%) opacity(0.5)', transition: 'all 0.5s ease' }}
                onMouseOver={(e) => { e.currentTarget.style.filter = 'grayscale(0%) opacity(1)'; }}
                onMouseOut={(e) => { e.currentTarget.style.filter = 'grayscale(100%) opacity(0.5)'; }}
                >
                <div className="d-flex align-items-center gap-2 text-up-primary fw-bold fs-5 hover-lift"><span className="material-symbols-outlined fs-2">corporate_fare</span> MUNICIPALI</div>
                <div className="d-flex align-items-center gap-2 text-up-primary fw-bold fs-5 hover-lift"><span className="material-symbols-outlined fs-2">water_drop</span> TECHFLOW</div>
                <div className="d-flex align-items-center gap-2 text-up-primary fw-bold fs-5 hover-lift"><span className="material-symbols-outlined fs-2">account_tree</span> URBAN_X</div>
                <div className="d-flex align-items-center gap-2 text-up-primary fw-bold fs-5 hover-lift"><span className="material-symbols-outlined fs-2">smart_city</span> SMARTCITY</div>
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

export default Contacto;