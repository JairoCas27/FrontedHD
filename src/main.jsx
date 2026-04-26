import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import './index.css'
import App from './App.jsx'
import Nosotros from './Nosotros.jsx' 
import Servicios from './Servicios.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
  
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 3. Configuración de las rutas */}
        <Route path="/" element={<App />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/servicios" element={<Servicios />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)