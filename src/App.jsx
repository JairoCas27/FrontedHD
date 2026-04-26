import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css'; // Para las transiciones que agregamos

// Importación de las páginas que hemos creado
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>

        {/* 1. Al entrar a la raíz (/), redirigimos automáticamente al Home */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* 2. Página principal (antes estaba todo aquí) */}
        <Route path="/home" element={<Home />} />

        {/* 3. Ruta de Inicio de Sesión */}
        <Route path="/login" element={<Login />} />

        {/* 4. Ruta de Registro de Residentes */}
        <Route path="/register" element={<Register />} />

        {/* 5. Ruta de Recuperación de Contraseña */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 6. Manejo de Error 404 */}
        <Route
          path="*"
          element={
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
              <div className="text-center">

                <h1 className="display-1 fw-bold text-muted">404</h1>
                <p className="fs-3">
                  <span className="text-danger">Opps!</span> Página no encontrada.
                </p>
                <p className="lead">La página que buscas no existe.</p>

                <a
                  href="/home"
                  className="btn btn-primary mb-4"
                  style={{ backgroundColor: '#1e1b4b', border: 'none' }}
                >
                  Volver al Inicio
                </a>

                {/* Enlaces rápidos */}
                <div className="d-none d-md-flex justify-content-center gap-4 mt-3">
                  <Link
                    className="fw-bold text-decoration-none"
                    to="/"
                  >
                    Inicio
                  </Link>

                  <Link
                    className="text-decoration-none"
                    to="/nosotros"
                  >
                    Nosotros
                  </Link>

                  <Link
                    className="text-decoration-none"
                    to="/servicios"
                  >
                    Servicios
                  </Link>

                  <Link
                    className="text-decoration-none"
                    to="/contacto"
                  >
                    Contacto
                  </Link>
                </div>

                {/* Botón de inicio de sesión */}
                <div className="mt-4">
                  <Link
                    to="/login"
                    className="btn text-white rounded-pill px-4 fw-bold shadow-sm"
                    style={{ backgroundColor: '#1e1b4b' }}
                  >
                    Iniciar Sesión
                  </Link>
                </div>

              </div>
            </div>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;