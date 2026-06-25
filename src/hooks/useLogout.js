import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { toast } from "react-toastify"
import { LOGIN_ROUTES } from "../utils/roleRoutes"

export function useLogout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    const route = LOGIN_ROUTES[user?.rol] || "/login"
    logout()
    toast.info("Sesión cerrada correctamente")
    navigate(route, { replace: true })
  }

  return { handleLogout }
}