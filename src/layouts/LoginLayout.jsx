import { Outlet } from "react-router-dom"
import WhatsappBoton from "../components/WhatsappBoton"
import Navbar2 from "../components/Navbar2"
import GuestRoute from "../components/GuestRoute"

export default function LoginLayout() {
  return (
    <GuestRoute>
      <Navbar2 />
      <main>
        <Outlet />
      </main>
      <WhatsappBoton />
    </GuestRoute>
  )
}