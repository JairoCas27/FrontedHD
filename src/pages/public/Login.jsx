import bgImageLeft from "../../images/FondoCondominio.png"
import bgImageRight from "../../images/FondoParking.png"
import AuthLayout from "../../components/AuthLayout"
import { useLogin } from "../../hooks/useLogin"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

function Login() {
  const { handleLogin } = useLogin()
  const [searchParams] = useSearchParams()
  const [resetToken, setResetToken] = useState(null)

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) setResetToken(token)
  }, [searchParams])

  return (
    <AuthLayout
      bgImageLeft={bgImageLeft}
      bgImageRight={bgImageRight}
      bgLeftOpacity={1}
      bgRightOpacity={1}
      accentColor="#7c3aed"
      accentColorDark="#5b21b6"
      heroTitle="Un solo lugar,"
      heroTitleAccent="todo bajo control."
      heroDescription="La plataforma integral que simplifica la gestión de condominios, residentes, accesos, estacionamientos y más. Todo en tiempo real, todo en un solo lugar."
      onSubmit={handleLogin}
      resetToken={resetToken}
      onResetTokenConsumed={() => setResetToken(null)}
    />
  )
}

export default Login