import parkingLogin from "../../images/parking-login.png"
import AuthLayout from "../../components/AuthLayout"
import { useLogin } from "../../hooks/useLogin"

const cards = [
  { icon: "bi-building", label: "Gestión de estacionamientos" },
  { icon: "bi-cash-coin", label: "Control de ingresos y pagos" },
  { icon: "bi-bar-chart-line", label: "Reportes financieros detallados" },
  { icon: "bi-gear", label: "Configuración personalizada" }
]

const extraButtons = [
  { label: "Iniciar sesión como Seguridad", route: "/login-seguridad", color: "rgb(34,197,94)" },
  { label: "Iniciar sesión como Administrador", route: "/login", color: "rgb(52,151,195)" }
]

const demoCredentials = [
  { rol: "Propietario", correo: "propietario@parking.com", password: "prop123" }
]

function LoginPropietario() {
  const { handleLogin } = useLogin()

  return (
    <AuthLayout
      title="Acceso Propietario"
      description="Gestiona tus espacios, reportes y configuración general"
      heroImage={parkingLogin}
      accentColor="rgb(249,115,22)"
      accentColorDark="rgb(234,88,12)"
      submitLabel="Ingresar como Propietario"
      onSubmit={handleLogin}
      leftCards={cards}
      extraButtons={extraButtons}
      demoCredentials={demoCredentials}
    />
  )
}

export default LoginPropietario