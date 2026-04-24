export const Navbar = () => (
  <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-outline-variant shadow-sm">
    <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
      <a href="/" className="flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
      </a>
      <div className="hidden md:flex items-center space-x-8">
        <a className="font-semibold text-sm text-primary border-b-2 border-primary pb-1" href="#">Inicio</a>
        <a className="font-medium text-sm text-primary-light hover:text-secondary transition-colors" href="#">Nosotros</a>
        <a className="font-medium text-sm text-primary-light hover:text-secondary transition-colors" href="#">Servicios</a>
        <a className="font-medium text-sm text-primary-light hover:text-secondary transition-colors" href="#">Contacto</a>
      </div>
      <button className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:bg-primary-light transition-all">
        Iniciar Sesión
      </button>
    </nav>
  </header>
);