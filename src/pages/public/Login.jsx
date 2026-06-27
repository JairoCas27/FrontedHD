import heroImage from "../../images/parking-login-admin.png"
import AuthLayout from "../../components/AuthLayout"
import { useLogin } from "../../hooks/useLogin"

function Login() {
  const { handleLogin } = useLogin()

  return (
    <AuthLayout
      heroImage={heroImage}
      accentColor="rgb(52,151,195)"
      accentColorDark="rgb(37,117,152)"
      onSubmit={handleLogin}
    />
  )
}

export default Login