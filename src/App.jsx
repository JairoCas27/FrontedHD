import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import ScrollToTop from "./components/ScrollTop"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import PublicLayout from "./layouts/PublicLayout"
import LoginLayout from "./layouts/LoginLayout"
import AppLayout from "./layouts/AppLayout"

import SidebarAdmin from "./components/SidebarAdmin"
import SidebarPropietario from "./components/SidebarPropietario"
import SidebarSeguridad from "./components/SidebarSeguridad"
import SidebarSuperAdmin from "./components/SidebarSuperAdmin"

import Inicio from "./pages/public/Inicio"
import Nosotros from "./pages/public/Nosotros"
import Servicios from "./pages/public/Servicios"
import Precios from "./pages/public/Precios"
import Contacto from "./pages/public/Contacto"
import Register from "./pages/public/Register"
import Login from "./pages/public/Login"
import Privacidad from "./pages/public/Privacidad"
import Terminos from "./pages/public/Terminos"

import DashboardAdmin from "./pages/admin/DashboardAdmin"
import Usuarios from "./pages/admin/Usuarios"
import Estacionamientos from "./pages/admin/Estacionamientos"
import Departamentos from "./pages/admin/Departamentos"
import Bienes from "./pages/admin/Bienes"
import Estructura from "./pages/admin/Estructura"
import Reportes from "./pages/admin/Reportes"
import Configuracion from "./pages/admin/Configuracion"
import Auditoria from "./pages/admin/Auditoria"
import Perfil from "./pages/admin/Perfil"

import DashboardSuperAdmin from "./pages/superadmin/DashboardSuperAdmin"
import Condominios from "./pages/superadmin/Condominios"
import Administradores from "./pages/superadmin/Administradores"
import UsuariosGlobales from "./pages/superadmin/UsuariosGlobales"
import PerfilSuperAdmin from "./pages/superadmin/PerfilSuperAdmin"

import AccesosSeguridad from "./pages/seguridad/AccesosSeguridad"
import VisitasSeguridad from "./pages/seguridad/VisitasSeguridad"
import VehiculosSeguridad from "./pages/seguridad/VehiculosSeguridad"
import Movimientos from "./pages/seguridad/Movimientos"
import Alertas from "./pages/seguridad/Alertas"
import PerfilSeguridad from "./pages/seguridad/PerfilSeguridad"

import DashboardPropietario from "./pages/propietario/DashboardPropietario"
import MiApartamento from "./pages/propietario/MiApartamento"
import MisVehiculos from "./pages/propietario/MisVehiculos"
import MisInquilinos from "./pages/propietario/MisInquilinos"
import Historial from "./pages/propietario/Historial"
import PerfilPropietario from "./pages/propietario/PerfilPropietario"

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>

        {/* 🌐 Rutas Públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/precios" element={<Precios />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/terminos" element={<Terminos />} />
        </Route>

        {/* 🔑 Autenticación */}
        <Route element={<LoginLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* 👔 Rutas Oficiales Protegidas del Administrador */}
        <Route element={<AppLayout Sidebar={SidebarAdmin} allowedRole="admin" />}>
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/usuarios" element={<Usuarios />} />
          <Route path="/admin/departamentos" element={<Departamentos />} />
          <Route path="/admin/estacionamientos" element={<Estacionamientos />} />
          <Route path="/admin/bienes" element={<Bienes />} />
          <Route path="/admin/estructura" element={<Estructura />} />
          <Route path="/admin/reportes" element={<Reportes />} />
          <Route path="/admin/configuracion" element={<Configuracion />} />
          <Route path="/admin/auditoria" element={<Auditoria />} />
          <Route path="/admin/perfil" element={<Perfil />} />
        </Route>

        {/* 👑 Rutas del SuperAdministrador */}
        <Route element={<AppLayout Sidebar={SidebarSuperAdmin} allowedRole="superadmin" />}>
          <Route path="/superadmin/dashboard" element={<DashboardSuperAdmin />} />
          <Route path="/superadmin/condominios" element={<Condominios />} />
          <Route path="/superadmin/administradores" element={<Administradores />} />
          <Route path="/superadmin/usuarios" element={<UsuariosGlobales />} />
          <Route path="/superadmin/perfil" element={<PerfilSuperAdmin />} />
        </Route>

        {/* 🛡️ Rutas de Seguridad (Vigilantes) */}
        <Route element={<AppLayout Sidebar={SidebarSeguridad} allowedRole="seguridad" />}>
          <Route path="/seguridad/accesos" element={<AccesosSeguridad />} />
          <Route path="/seguridad/visitas" element={<VisitasSeguridad />} />
          <Route path="/seguridad/vehiculos" element={<VehiculosSeguridad />} />
          <Route path="/seguridad/movimientos" element={<Movimientos />} />
          <Route path="/seguridad/alertas" element={<Alertas />} />
          <Route path="/seguridad/perfil" element={<PerfilSeguridad />} />
        </Route>

        {/* 🏠 Rutas del Propietario / Residente */}
        <Route element={<AppLayout Sidebar={SidebarPropietario} allowedRole="propietario" />}>
          <Route path="/propietario/dashboard" element={<DashboardPropietario />} />
          <Route path="/propietario/apartamento" element={<MiApartamento />} />
          <Route path="/propietario/vehiculos" element={<MisVehiculos />} />
          <Route path="/propietario/inquilinos" element={<MisInquilinos />} />
          <Route path="/propietario/historial" element={<Historial />} />
          <Route path="/propietario/perfil" element={<PerfilPropietario />} />
        </Route>
        
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3500}
        theme="colored"
        closeOnClick
        pauseOnHover
        draggable
      />
    </Router>
  )
}

export default App