import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ScrollToTop from "./components/ScrollTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PublicLayout from "./layouts/PublicLayout";

import Inicio from "./pages/public/Inicio";
import Nosotros from "./pages/public/Nosotros";
import Servicios from "./pages/public/Servicios";
import Precios from "./pages/public/Precios";
import Contacto from "./pages/public/Contactanos";
import Register from "./pages/public/Register";
import Login from "./pages/public/Login";
import Privacidad from "./pages/public/Privacidad";
import Terminos from "./pages/public/Terminos";

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
          <Route path="/login" element={<Login />} />

          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/terminos" element={<Terminos />} />
        </Route>

      </Routes>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </Router>
  );
}

export default App;