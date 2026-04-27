import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function GuestRoute({ children }) {
  const { user, loading, getHomeRoute } = useAuth()

  if (loading) return null

  if (user) {
    return <Navigate to={getHomeRoute(user.rol)} replace />
  }

  return children
}