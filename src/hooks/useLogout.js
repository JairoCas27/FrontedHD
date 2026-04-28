import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { toast } from "react-toastify"

export function useLogout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    const loginRoutes = {
      superadmin:  "/login",
      admin:       "/login",
      seguridad:   "/login-seguridad",
      propietario: "/login-propietario"
    }
    const route = loginRoutes[user?.rol] || "/login"
    logout()
    toast.info("Sesión cerrada correctamente")
    navigate(route, { replace: true })
  }

  return { handleLogout }
}