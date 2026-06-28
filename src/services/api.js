const BASE_URL = import.meta.env.VITE_API_URL

async function safeFetch(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const message = data?.message || data?.error || response.statusText || "Error de red"
    throw new Error(message)
  }

  return data
}

export async function loginApi({ correo, password, recuerdame }) {
  const data = await safeFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ correo, contrasena: password, recuerdame }),
  })

  return { success: true, usuario: data.usuario }
}

export async function getSuperAdminDashboardMetrics() {
  return safeFetch("/api/super-admin/dashboard/metrics")
}

export async function getSuperAdminRecentCondos() {
  return safeFetch("/api/super-admin/dashboard/recent-condos")
}

export async function getSuperAdminRecentAdmins() {
  return safeFetch("/api/super-admin/dashboard/recent-admins")
}
