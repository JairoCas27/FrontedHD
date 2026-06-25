const BASE_URL = import.meta.env.VITE_API_URL

export async function loginApi({ correo, password, recuerdame }) {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ correo, contrasena: password, recuerdame })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    return { success: false, message: error.message || "Correo o contraseña incorrectos" }
  }

  const data = await response.json()
  return { success: true, usuario: data.usuario }
}