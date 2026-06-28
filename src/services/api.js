const BASE_URL = import.meta.env.VITE_API_URL;

// --- Helper con autenticación ---
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

async function safeFetch(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include', // importante para cookies HttpOnly
    headers: { ...getHeaders(), ...options.headers },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message || data?.error || response.statusText || 'Error de red';
    throw new Error(message);
  }
  return data;
}

// ===== AUTENTICACIÓN =====
export async function loginApi({ correo, password, recuerdame }) {
  const data = await safeFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ correo, contrasena: password, recuerdame }),
  });
  // El backend debe devolver { token, usuario }
  return data;
}

export async function logoutApi() {
  return safeFetch('/api/auth/logout', { method: 'POST' });
}

export async function getCurrentUser() {
  return safeFetch('/api/auth/me');
}

// ===== PERFIL =====
export async function getProfile() {
  return safeFetch('/api/profile');
}

export async function updateProfile(data) {
  return safeFetch('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ===== SUPER ADMIN =====
// Dashboard
export async function getSuperAdminDashboardMetrics() {
  return safeFetch('/api/super-admin/dashboard/metrics');
}

export async function getSuperAdminRecentAdmins() {
  return safeFetch('/api/super-admin/dashboard/recent-admins');
}

export async function getSuperAdminRecentCondos() {
  return safeFetch('/api/super-admin/dashboard/recent-condos');
}

// Condominios
export async function getCondominiums() {
  return safeFetch('/api/super-admin/condominiums');
}

export async function createCondominium(data) {
  return safeFetch('/api/super-admin/condominiums', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCondominium(id, data) {
  return safeFetch(`/api/super-admin/condominiums/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCondominium(id) {
  return safeFetch(`/api/super-admin/condominiums/${id}`, {
    method: 'DELETE',
  });
}

export async function patchCondominiumStatus(id, activo) {
  return safeFetch(`/api/super-admin/condominiums/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ activo }),
  });
}

export async function getUnassignedCondominiums() {
  return safeFetch('/api/super-admin/condominiums/unassigned');
}

// Administradores
export async function getAdministrators() {
  return safeFetch('/api/super-admin/administrators');
}

export async function createAdministrator(data) {
  return safeFetch('/api/super-admin/administrators', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdministrator(id, data) {
  return safeFetch(`/api/super-admin/administrators/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAdministrator(id) {
  return safeFetch(`/api/super-admin/administrators/${id}`, {
    method: 'DELETE',
  });
}

export async function patchAdministratorStatus(id, activo) {
  return safeFetch(`/api/super-admin/administrators/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ activo }),
  });
}

export async function assignAdministratorCondo(adminId, condominioId) {
  return safeFetch(`/api/super-admin/administrators/${adminId}/assign-condo`, {
    method: 'PUT',
    body: JSON.stringify({ condominioId }),
  });
}

export async function getAvailableAdministrators() {
  return safeFetch('/api/super-admin/administrators/available');
}

// Usuarios globales
export async function getAllUsers() {
  return safeFetch('/api/super-admin/users');
}

export async function patchUserStatus(userId, activo) {
  return safeFetch(`/api/super-admin/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ activo }),
  });
}

export async function forceUserPassword(userId, nuevaContrasena) {
  return safeFetch(`/api/super-admin/users/${userId}/force-password`, {
    method: 'PUT',
    body: JSON.stringify({ contrasena: nuevaContrasena }),
  });
}

export async function invalidateUserSession(userId) {
  return safeFetch(`/api/super-admin/users/${userId}/invalidate-session`, {
    method: 'POST',
  });
}