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
import LoginPropietario from "./pages/public/LoginPropietario"
import LoginSeguridad from "./pages/public/LoginSeguridad"

import DashboardAdmin from "./pages/admin/DashboardAdmin"
import Usuarios from "./pages/admin/Usuarios"
import Vehiculos from "./pages/admin/Vehiculos"
import Estacionamientos from "./pages/admin/Estacionamientos"
import Accesos from "./pages/admin/Accesos"
import Visitas from "./pages/admin/Visitas"
import Reportes from "./pages/admin/Reportes"
import Notificaciones from "./pages/admin/Notificaciones"
import Configuracion from "./pages/admin/Configuracion"
import Auditoria from "./pages/admin/Auditoria"
import Perfil from "./pages/admin/Perfil"

import DashboardSuperAdmin from "./pages/superadmin/DashboardSuperAdmin"
import Condominios from "./pages/superadmin/Condominios"
import UsuariosGlobales from "./pages/superadmin/UsuariosGlobales"
import Suscripciones from "./pages/superadmin/Suscripciones"
import AuditoriaGlobal from "./pages/superadmin/AuditoriaGlobal"
import ConfiguracionSaaS from "./pages/superadmin/ConfiguracionSaaS"
import PerfilSuperAdmin from "./pages/superadmin/PerfilSuperAdmin"

import AccesosSeguridad from "./pages/seguridad/AccesosSeguridad"
import VisitasSeguridad from "./pages/seguridad/VisitasSeguridad"
import VehiculosSeguridad from "./pages/seguridad/VehiculosSeguridad"
import Movimientos from "./pages/seguridad/Movimientos"
import Alertas from "./pages/seguridad/Alertas"
import PerfilSeguridad from "./pages/seguridad/PerfilSeguridad"

import DashboardPropietario from "./pages/propietario/DashboardPropietario"
import MisVehiculos from "./pages/propietario/MisVehiculos"
import MisEstacionamientos from "./pages/propietario/MisEstacionamientos"
import MisVisitas from "./pages/propietario/MisVisitas"
import MisNotificaciones from "./pages/propietario/MisNotificaciones"
import PerfilPropietario from "./pages/propietario/PerfilPropietario"

function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>

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

        <Route element={<LoginLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/login-propietario" element={<LoginPropietario />} />
          <Route path="/login-seguridad" element={<LoginSeguridad />} />
        </Route>

        <Route element={<AppLayout Sidebar={SidebarAdmin} allowedRole="admin" />}>
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/usuarios" element={<Usuarios />} />
          <Route path="/admin/vehiculos" element={<Vehiculos />} />
          <Route path="/admin/estacionamientos" element={<Estacionamientos />} />
          <Route path="/admin/accesos" element={<Accesos />} />
          <Route path="/admin/visitas" element={<Visitas />} />
          <Route path="/admin/reportes" element={<Reportes />} />
          <Route path="/admin/notificaciones" element={<Notificaciones />} />
          <Route path="/admin/configuracion" element={<Configuracion />} />
          <Route path="/admin/auditoria" element={<Auditoria />} />
          <Route path="/admin/perfil" element={<Perfil />} />
        </Route>

        <Route element={<AppLayout Sidebar={SidebarSuperAdmin} allowedRole="superadmin" />}>
          <Route path="/superadmin/dashboard" element={<DashboardSuperAdmin />} />
          <Route path="/superadmin/condominios" element={<Condominios />} />
          <Route path="/superadmin/usuarios" element={<UsuariosGlobales />} />
          <Route path="/superadmin/suscripciones" element={<Suscripciones />} />
          <Route path="/superadmin/auditoria" element={<AuditoriaGlobal />} />
          <Route path="/superadmin/configuracion" element={<ConfiguracionSaaS />} />
          <Route path="/superadmin/perfil" element={<PerfilSuperAdmin />} />
        </Route>

        <Route element={<AppLayout Sidebar={SidebarSeguridad} allowedRole="seguridad" />}>
          <Route path="/seguridad/accesos" element={<AccesosSeguridad />} />
          <Route path="/seguridad/visitas" element={<VisitasSeguridad />} />
          <Route path="/seguridad/vehiculos" element={<VehiculosSeguridad />} />
          <Route path="/seguridad/movimientos" element={<Movimientos />} />
          <Route path="/seguridad/alertas" element={<Alertas />} />
          <Route path="/seguridad/perfil" element={<PerfilSeguridad />} />
        </Route>

        <Route element={<AppLayout Sidebar={SidebarPropietario} allowedRole="propietario" />}>
          <Route path="/propietario/dashboard" element={<DashboardPropietario />} />
          <Route path="/propietario/vehiculos" element={<MisVehiculos />} />
          <Route path="/propietario/estacionamientos" element={<MisEstacionamientos />} />
          <Route path="/propietario/visitas" element={<MisVisitas />} />
          <Route path="/propietario/notificaciones" element={<MisNotificaciones />} />
          <Route path="/propietario/perfil" element={<PerfilPropietario />} />
        </Route>

      </Routes>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </Router>
  )
}

export default App