import { createContext, useContext, useState } from "react"
import { ROLE_ROUTES } from "../utils/roleRoutes"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (userData) => setUser(userData)
  const logout = () => setUser(null)
  const getHomeRoute = (rol) => ROLE_ROUTES[rol] || "/login"

  return (
    <AuthContext.Provider value={{ user, login, logout, getHomeRoute }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}