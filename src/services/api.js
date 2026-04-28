const USERS = [
    { correo: "superadmin@parking.com", password: "super123", rol: "superadmin" },
    { correo: "admin@parking.com",      password: "admin123",  rol: "admin" },
    { correo: "seguridad@parking.com",  password: "seg123",    rol: "seguridad" },
    { correo: "propietario@parking.com",password: "prop123",   rol: "propietario" }
  ]
  
  const ROLE_ROUTES = {
    superadmin:  "/superadmin/dashboard",
    admin:       "/admin/dashboard",
    seguridad:   "/seguridad/accesos",
    propietario: "/propietario/dashboard"
  }
  
  export function loginDemo({ correo, password }) {
    const user = USERS.find(u => u.correo === correo && u.password === password)
    if (!user) return { success: false, message: "Correo o contraseña incorrectos" }
    return { success: true, user, redirect: ROLE_ROUTES[user.rol] }
  }