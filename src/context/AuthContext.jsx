import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

const ROLE_ROUTES = {
  superadmin:  "/superadmin/dashboard",
  admin:       "/admin/dashboard",
  seguridad:   "/seguridad/accesos",
  propietario: "/propietario/dashboard"
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("parking_user")
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    localStorage.setItem("parking_user", JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("parking_user")
    setUser(null)
  }

  const getHomeRoute = (rol) => ROLE_ROUTES[rol] || "/login"

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, getHomeRoute }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}