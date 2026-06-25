import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { loginApi } from "../services/api"
import { toast } from "react-toastify"
import { ROLE_ROUTES } from "../utils/roleRoutes"

export function useLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async ({ correo, password, recuerdame }) => {
    const result = await loginApi({ correo, password, recuerdame })
    if (!result.success) {
      toast.error(result.message)
      return
    }
    login(result.usuario)
    toast.success(`Bienvenido, ${result.usuario.nombres}`)
    navigate(ROLE_ROUTES[result.usuario.rol] || "/login")
  }

  return { handleLogin }
}