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
    credentials: 'include',
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
  return data; // { token, usuario }
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
// ===== CONTROLADOR: admin-condominio-controller =====

// --- Departamentos (Departamentos.jsx) ---
// GET /api/admin/apartments
export async function getAdminApartments() {
  return safeFetch('/api/admin/apartments');
}

// PUT /api/admin/apartments/{id}/assign-owner
export async function assignApartmentOwner(id, nombrePropietario) {
  return safeFetch(`/api/admin/apartments/${id}/assign-owner`, {
    method: 'PUT',
    body: JSON.stringify({ propietario: nombrePropietario }),
  });
}

// PUT /api/admin/apartments/{id}/occupants
export async function updateApartmentOccupants(id, ocupantes) {
  return safeFetch(`/api/admin/apartments/${id}/occupants`, {
    method: 'PUT',
    body: JSON.stringify({ ocupantes }),
  });
}

// --- Bienes Comunes (Bienes.jsx) ---
// GET /api/admin/assets
export async function getAdminAssets() {
  return safeFetch('/api/admin/assets');
}

// POST /api/admin/assets
export async function createAdminAsset(assetData) {
  return safeFetch('/api/admin/assets', {
    method: 'POST',
    body: JSON.stringify(assetData),
  });
}

// PUT /api/admin/assets/{id}/status
export async function updateAdminAssetStatus(id, estado) {
  return safeFetch(`/api/admin/assets/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ estado }),
  });
}

// --- Configuración (Configuracion.jsx) ---
// GET /api/admin/condominium/configuracion
export async function getAdminCondoConfig() {
  return safeFetch('/api/admin/condominium/configuracion');
}

// PUT /api/admin/condominium/configuracion
export async function updateAdminCondoConfig(configData) {
  return safeFetch('/api/admin/condominium/configuracion', {
    method: 'PUT',
    body: JSON.stringify(configData),
  });
}

// --- Perfil e Info (Perfil.jsx) ---
// GET /api/admin/condominium/my-info
export async function getAdminMyInfo() {
  return safeFetch('/api/admin/condominium/my-info');
}

// PUT /api/admin/condominium/my-info
export async function updateAdminMyInfo(infoData) {
  return safeFetch('/api/admin/condominium/my-info', {
    method: 'PUT',
    body: JSON.stringify(infoData),
  });
}

// --- Dashboard / Analítica (DashboardAdmin.jsx y Reportes.jsx) ---
// GET /api/admin/dashboard/metrics
export async function getAdminDashboardMetrics() {
  return safeFetch('/api/admin/dashboard/metrics');
}

// --- Auditoría y Logs (Auditoria.jsx) ---
// GET /api/admin/logs
export async function getAdminLogs() {
  return safeFetch('/api/admin/logs');
}

// --- Estructura Arquitectónica (Estructura.jsx) ---
// GET /api/admin/structure
export async function getAdminStructure() {
  return safeFetch('/api/admin/structure');
}

// POST /api/admin/structure/nodes
export async function createAdminStructureNode(nodeData) {
  return safeFetch('/api/admin/structure/nodes', {
    method: 'POST',
    body: JSON.stringify(nodeData),
  });
}

// DELETE /api/admin/structure/nodes/{id}
export async function deleteAdminStructureNode(id) {
  return safeFetch(`/api/admin/structure/nodes/${id}`, {
    method: 'DELETE',
  });
}

// --- Usuarios y Residentes (Usuarios.jsx) ---
// GET /api/admin/users
export async function getAdminUsers() {
  return safeFetch('/api/admin/users');
}

// POST /api/admin/users
export async function createAdminUser(userData) {
  return safeFetch('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

// PUT /api/admin/users/{id}
export async function updateAdminUser(id, userData) {
  return safeFetch(`/api/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
}

// PATCH /api/admin/users/{id}/status
export async function patchAdminUserStatus(id, activo) {
  return safeFetch(`/api/admin/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ activo }),
  });
}