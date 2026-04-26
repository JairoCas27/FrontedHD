import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' // 1. Importaciones del enrutador
import './index.css'
import App from './App.jsx'
import Nosotros from './Nosotros.jsx' // 2. Importación de tu nueva vista
import 'bootstrap/dist/css/bootstrap.min.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 3. Configuración de las rutas */}
        <Route path="/" element={<App />} />
        <Route path="/nosotros" element={<Nosotros />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)