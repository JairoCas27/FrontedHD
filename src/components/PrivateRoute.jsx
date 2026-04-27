import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ROLE_LOGIN = {
  admin:       "/login",
  superadmin:  "/login",
  seguridad:   "/login-seguridad",
  propietario: "/login-propietario"
}

const ALLOWED_ROLES = {
  admin:       ["admin"],
  superadmin:  ["superadmin"],
  seguridad:   ["seguridad"],
  propietario: ["propietario"]
}

export default function PrivateRoute({ allowedRole }) {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) {
    return <Navigate to={ROLE_LOGIN[allowedRole] || "/login"} replace />
  }

  if (!ALLOWED_ROLES[allowedRole].includes(user.rol)) {
    return <Navigate to={ROLE_LOGIN[user.rol] || "/login"} replace />
  }

  return null
}