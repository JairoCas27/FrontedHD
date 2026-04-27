import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { loginDemo } from "../services/api"
import { toast } from "react-toastify"

export function useLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = ({ correo, password }) => {
    const result = loginDemo({ correo, password })
    if (!result.success) {
      toast.error(result.message)
      return
    }
    login(result.user)
    toast.success(`Bienvenido, ${result.user.rol.toUpperCase()}`)
    navigate(result.redirect)
  }

  return { handleLogin }
}