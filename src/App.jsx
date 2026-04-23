import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css'; // Para las transiciones que agregamos

// Importación de las páginas que hemos creado
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Al entrar a la raíz (/), redirigimos automáticamente al Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 2. Ruta de Inicio de Sesión */}
        <Route path="/login" element={<Login />} />

        {/* 3. Ruta de Registro de Residentes */}
        <Route path="/register" element={<Register />} />

        {/* 4. Ruta de Recuperación de Contraseña */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 5. Manejo de Error 404 (Rutas que no existen) */}
        <Route 
          path="*" 
          element={
            <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
              <div className="text-center">
                <h1 className="display-1 fw-bold text-muted">404</h1>
                <p className="fs-3"> <span className="text-danger">Opps!</span> Página no encontrada.</p>
                <p className="lead">La página que buscas no existe.</p>
                <a href="/login" className="btn btn-primary" style={{ backgroundColor: '#1e1b4b', border: 'none' }}>Volver al Inicio</a>
              </div>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;