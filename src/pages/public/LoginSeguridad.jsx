import parkingLoginSeguridad from "../../images/parking-login-seguridad.png"
import AuthLayout from "../../components/AuthLayout"
import { useLogin } from "../../hooks/useLogin"

const cards = [
  { icon: "bi-eye", label: "Monitoreo en tiempo real" },
  { icon: "bi-person-badge", label: "Control de accesos vehiculares" },
  { icon: "bi-exclamation-triangle", label: "Alertas de incidentes" },
  { icon: "bi-camera-video", label: "Integración con cámaras LPR" }
]

const extraButtons = [
  { label: "Iniciar sesión como Propietario", route: "/login-propietario", color: "rgb(249,115,22)" },
  { label: "Iniciar sesión como Administrador", route: "/login", color: "rgb(52,151,195)" }
]

const demoCredentials = [
  { rol: "Seguridad", correo: "seguridad@parking.com", password: "seg123" }
]

function LoginSeguridad() {
  const { handleLogin } = useLogin()

  return (
    <AuthLayout
      title="Acceso Seguridad"
      description="Panel de control para agentes y personal de seguridad"
      heroImage={parkingLoginSeguridad}
      accentColor="rgb(34,197,94)"
      accentColorDark="rgb(22,163,74)"
      submitLabel="Ingresar como Seguridad"
      onSubmit={handleLogin}
      leftCards={cards}
      extraButtons={extraButtons}
      demoCredentials={demoCredentials}
    />
  )
}

export default LoginSeguridad