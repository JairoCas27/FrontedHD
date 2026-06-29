import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { toast } from "react-toastify"

export function useLogout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.info("Sesión cerrada correctamente")
    navigate("/login", { replace: true })
  }

  return { handleLogout }
}