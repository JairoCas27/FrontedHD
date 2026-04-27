import parkingLogin from "../../images/parking-login.png"
import AuthLayout from "../../components/AuthLayout"
import { useLogin } from "../../hooks/useLogin"

const cards = [
  { icon: "bi-diagram-3", label: "Administración centralizada" },
  { icon: "bi-people-fill", label: "Gestión de usuarios y roles" },
  { icon: "bi-journal-text", label: "Historial completo de eventos" },
  { icon: "bi-graph-up-arrow", label: "Analítica avanzada del sistema" }
]

const extraButtons = [
  { label: "Iniciar sesión como Seguridad", route: "/login-seguridad", color: "rgb(34,197,94)" },
  { label: "Iniciar sesión como Propietario", route: "/login-propietario", color: "rgb(249,115,22)" }
]

const demoCredentials = [
  { rol: "Super Administrador", correo: "superadmin@parking.com", password: "super123" },
  { rol: "Administrador",       correo: "admin@parking.com",      password: "admin123" }
]

function Login() {
  const { handleLogin } = useLogin()

  return (
    <AuthLayout
      title="Acceso Administrador"
      description="Accede al panel de administración de estacionamientos"
      heroImage={parkingLogin}
      accentColor="rgb(52,151,195)"
      accentColorDark="rgb(37,117,152)"
      submitLabel="Ingresar como Administrador"
      onSubmit={handleLogin}
      leftCards={cards}
      extraButtons={extraButtons}
      demoCredentials={demoCredentials}
    />
  )
}

export default Login