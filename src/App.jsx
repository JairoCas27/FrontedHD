import React, { useEffect } from 'react';

const App = () => {
    // Efecto para activar las animaciones cuando el usuario hace scroll
    useEffect(() => {
        const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Opcional: Descomenta la siguiente línea si solo quieres que se animen una vez
            // observer.unobserve(entry.target);
            } else {
            // Si quieres que la animación se repita al subir y bajar, déjalo así
            entry.target.classList.remove('active');
            }
        });
        };

        const observerOptions = {
        threshold: 0.15 // El elemento se animará cuando el 15% sea visible
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const elements = document.querySelectorAll('.reveal');
        
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect(); // Limpieza del hook
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
                <a className="fw-bold text-decoration-none text-up-primary border-bottom border-2 border-dark pb-1 hover-lift" style={{ transformOrigin: 'center' }} href="App.jsx">Inicio</a>
                <a className="fw-medium text-decoration-none text-up-primary-light" href="Nosotros.jsx" style={{ transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--up-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--up-primary-light)'}>Nosotros</a>
                <a className="fw-medium text-decoration-none text-up-primary-light" href="#" style={{ transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--up-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--up-primary-light)'}>Servicios</a>
                <a className="fw-medium text-decoration-none text-up-primary-light" href="#" style={{ transition: 'color 0.3s' }} onMouseOver={(e) => e.target.style.color = 'var(--up-secondary)'} onMouseOut={(e) => e.target.style.color = 'var(--up-primary-light)'}>Contacto</a>
                </div>
                
                <button className="btn text-white rounded-pill px-4 fw-bold shadow-sm btn-glow bg-up-primary" style={{ paddingBlock: '10px' }}>
                Iniciar Sesión
                </button>
            </nav>
            </div>
        </header>

        <main>
            {/* HERO SECTION (Usa animaciones de carga directa, no de scroll) */}
            <section className="position-relative d-flex align-items-center overflow-hidden" style={{ height: '80vh', minHeight: '600px' }}>
            <div className="position-absolute w-100 h-100 bg-up-primary">
                <img 
                alt="Modern Parking Lot" 
                className="w-100 h-100" 
                style={{ objectFit: 'cover', mixBlendMode: 'overlay', transform: 'scale(1.05)', animation: 'float 20s linear infinite alternate' }}
                src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=2070&auto=format&fit=crop" 
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 hero-gradient"></div>
            </div>
            
            <div className="container position-relative z-1">
                <div className="col-12 col-lg-8">
                <span className="badge rounded-pill fw-bold mb-4 animate-fade-in-up border border-light text-up-accent" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '8px 16px', letterSpacing: '2px' }}>
                    INNOVACIÓN URBANA
                </span>
                <h1 className="display-4 fw-bold text-white mb-4 animate-fade-in-up delay-100">
                    Gestión Inteligente de Parkings para Condominios
                </h1>
                <p className="fs-5 text-white-50 mb-5 animate-fade-in-up delay-200">
                    Optimice el flujo de vehículos, garantice la seguridad de sus residentes y tome el control total de sus espacios con tecnología de vanguardia.
                </p>
                <div className="d-flex flex-wrap gap-3 animate-fade-in-up delay-300">
                    <button className="btn bg-up-secondary text-white rounded-3 px-4 py-3 fw-bold btn-glow d-flex align-items-center gap-2">
                    Conocer más <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                    <button className="btn btn-outline-light rounded-3 px-4 py-3 fw-bold hover-lift" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    Ver Demo
                    </button>
                </div>
                </div>
            </div>
            
            <div className="position-absolute bottom-0 end-0 mb-5 me-5 animate-float d-none d-lg-block" style={{ opacity: '0.9' }}>
                <img src="src/images/inicio.png" alt="Icono Decorativo" className="rounded-circle bg-white shadow-lg p-3" style={{ width: '250px', height: '250px', objectFit: 'contain' }} />
            </div>
            </section>

            {/* BENEFITS SECTION (Usa animaciones de Scroll: "reveal") */}
            <section className="py-5 overflow-hidden">
            <div className="container py-5">
                <div className="text-center mb-5 reveal">
                <span className="text-up-secondary fw-bold text-uppercase" style={{ letterSpacing: '2px', fontSize: '0.875rem' }}>Beneficios Clave</span>
                <h2 className="display-6 fw-bold text-up-primary mt-2">Excelencia en cada plaza</h2>
                </div>
                
                <div className="row g-4">
                {/* Card 1 */}
                <div className="col-md-8 reveal reveal-left delay-100">
                    <div className="card h-100 border-0 shadow-sm rounded-4 p-4 hover-lift overflow-hidden position-relative">
                    <div className="row g-4 align-items-center">
                        <div className="col-sm-6 position-relative z-1">
                        <div className="bg-up-surface-variant text-up-secondary rounded-3 d-flex align-items-center justify-content-center mb-4" style={{ width: '60px', height: '60px' }}>
                            <span className="material-symbols-outlined fs-2 icon-rotate-hover">shield_lock</span>
                        </div>
                        <h3 className="h4 fw-bold text-up-primary mb-3">Seguridad Empresarial</h3>
                        <p className="text-up-primary-light mb-0">Monitoreo en tiempo real y registros biométricos para asegurar que solo personas autorizadas accedan a sus instalaciones.</p>
                        </div>
                        <div className="col-sm-6">
                        <img className="w-100 rounded-3 shadow-sm hover-lift" style={{ height: '200px', objectFit: 'cover' }} src="src/images/seguridad.png" alt="Seguridad" />
                        </div>
                    </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="col-md-4 reveal reveal-right delay-200">
                    <div className="card h-100 border-0 shadow rounded-4 p-4 hover-lift text-white bg-up-primary overflow-hidden position-relative">
                    <div className="position-absolute top-0 end-0 bg-up-secondary rounded-circle animate-pulse-soft" style={{ width: '150px', height: '150px' }}></div>
                    <div className="rounded-3 d-flex align-items-center justify-content-center mb-4 text-up-accent position-relative z-1" style={{ width: '60px', height: '60px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <span className="material-symbols-outlined fs-2 icon-rotate-hover">speed</span>
                    </div>
                    <h3 className="h4 fw-bold mb-3 position-relative z-1">Eficiencia Operativa</h3>
                    <p className="text-white-50 mb-0 position-relative z-1">Reduzca tiempos de espera y optimice la rotación de espacios mediante algoritmos de asignación inteligente.</p>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="col-md-4 reveal reveal-left delay-300">
                    <div className="card h-100 border-0 shadow-sm rounded-4 p-4 hover-lift bg-up-surface-variant">
                    <div className="bg-white text-up-secondary rounded-3 d-flex align-items-center justify-content-center mb-4 shadow-sm" style={{ width: '60px', height: '60px' }}>
                        <span className="material-symbols-outlined fs-2 icon-rotate-hover">dashboard_customize</span>
                    </div>
                    <h3 className="h4 fw-bold text-up-primary mb-3">Control Total</h3>
                    <p className="text-up-primary-light mb-0">Dashboards analíticos que le permiten visualizar la ocupación, ingresos y tráfico histórico en un solo clic.</p>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="col-md-8 reveal reveal-right delay-400">
                    <div className="card h-100 border-0 shadow-sm rounded-4 p-4 hover-lift">
                    <div className="d-flex align-items-center h-100">
                        <div className="flex-grow-1">
                        <span className="text-up-accent fw-bold text-uppercase mb-2 d-block" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>Tecnología</span>
                        <h3 className="h4 fw-bold text-up-primary mb-3">SaaS e Integración IoT</h3>
                        <p className="text-up-primary-light mb-0">Nuestra plataforma en la nube se integra perfectamente con sensores, cámaras LPR y barreras inteligentes para automatización total.</p>
                        </div>
                        <div className="d-none d-sm-block ms-4 icon-rotate-hover">
                        <span className="material-symbols-outlined" style={{ fontSize: '100px', color: 'rgba(180, 140, 196, 0.15)' }}>memory</span>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-5 overflow-hidden">
            <div className="container py-4">
                <div className="cta-gradient rounded-5 p-5 p-md-5 text-center text-white position-relative shadow-lg reveal">
                {/* Círculos decorativos flotantes */}
                <div className="position-absolute rounded-circle bg-white opacity-10 animate-float" style={{ width: '300px', height: '300px', top: '-100px', right: '-50px' }}></div>
                <div className="position-absolute rounded-circle bg-up-secondary opacity-50 animate-pulse-soft" style={{ width: '200px', height: '200px', bottom: '-50px', left: '-50px' }}></div>
                
                <div className="position-relative z-1 py-4">
                    <img src="src/images/logo02.png" alt="Icono Decorativo" className="rounded-circle bg-white shadow mb-4 p-2 animate-float" style={{ width: '90px', height: '90px', objectFit: 'contain' }} />
                    <h2 className="display-5 fw-bold mb-4">¿Listo para transformar su estacionamiento?</h2>
                    <p className="fs-5 text-white-50 mb-5 mx-auto" style={{ maxWidth: '700px' }}>
                    Agende una consultoría gratuita y descubra cómo UrbanPark puede elevar el estándar de su propiedad.
                    </p>
                    <button className="btn bg-white text-up-primary rounded-3 px-5 py-3 fs-5 fw-bold btn-glow">
                    Comenzar Ahora Mismo
                    </button>
                </div>
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
                    <img src="/logo.png" alt="Urban Park Logo" className="hover-lift" style={{ height: '40px', objectFit: 'contain' }} />
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

export default App;