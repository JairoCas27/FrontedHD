import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsappBoton from "../components/WhatsappBoton";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <WhatsappBoton />
      <Footer />
    </>
  );
}