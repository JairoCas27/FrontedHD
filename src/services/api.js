const BASE_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => ({
  'Content-Type': 'application/json',
});

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
  return data;
}

export async function logoutApi() {
  return safeFetch('/api/auth/logout', { method: 'POST' });
}

export async function getCurrentUser() {
  return safeFetch('/api/auth/me');
}

export async function changePassword(data) {
  return safeFetch('/api/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
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

// ===== CATÁLOGOS =====
export async function getCountries() {
  return safeFetch('/api/catalogs/countries');
}

export async function getCities(countryId) {
  return safeFetch(`/api/catalogs/countries/${countryId}/cities`);
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
  return safeFetch('/api/super-admin/condominiums?page=0&size=100');
}

export async function createCondominium(data) {
  // El backend espera idPais e idCiudad
  return safeFetch('/api/super-admin/condominiums', {
    method: 'POST',
    body: JSON.stringify({
      nombre: data.nombre,
      direccion: data.direccion,
      idPais: data.idPais,   // cambiar de paisId a idPais
      idCiudad: data.idCiudad, // cambiar de ciudadId a idCiudad
      activo: true,
    }),
  });
}

export async function updateCondominium(id, data) {
  return safeFetch(`/api/super-admin/condominiums/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      nombre: data.nombre,
      direccion: data.direccion,
      idPais: data.idPais,
      idCiudad: data.idCiudad,
      activo: data.activo !== undefined ? data.activo : true,
    }),
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
  return safeFetch('/api/super-admin/administrators?page=0&size=100');
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
    body: JSON.stringify({ idCondominio: condominioId }),
  });
}

export async function getAvailableAdministrators() {
  return safeFetch('/api/super-admin/administrators/available');
}

// Usuarios globales (CRUD usando endpoints de admin)
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
    body: JSON.stringify({ nuevaContrasena }),
  });
}

export async function invalidateUserSession(userId) {
  return safeFetch(`/api/super-admin/users/${userId}/invalidate-session`, {
    method: 'POST',
  });
}


// =========================
// PROPIETARIO
// =========================
 
export const getHomeownerDashboard = () =>
  safeFetch("/api/homeowner/dashboard/summary");
 
export const getHomeownerApartment = () =>
  safeFetch("/api/homeowner/apartment/details");
 
export const getHomeownerVehicles = () =>
  safeFetch("/api/homeowner/vehicles");
 
export const createHomeownerVehicle = (data) =>
  safeFetch("/api/homeowner/vehicles", {
    method: "POST",
    body: JSON.stringify(data),
  });
 
export const deleteHomeownerVehicle = (id) =>
  safeFetch(`/api/homeowner/vehicles/${id}`, { method: "DELETE" });
 
export const getHomeownerTenants = () =>
  safeFetch("/api/homeowner/tenants");
 
export const createHomeownerTenant = (data) =>
  safeFetch("/api/homeowner/tenants", {
    method: "POST",
    body: JSON.stringify(data),
  });
 
export const deleteHomeownerTenant = (id) =>
  safeFetch(`/api/homeowner/tenants/${id}`, { method: "DELETE" });
 
export const getHomeownerLogs = () =>
  safeFetch("/api/homeowner/logs");

export const verifyVehicle = (plate) =>
  safeFetch(`/api/security/vehicles/verify/${plate}`);

export const registerEntry = (data) =>
  safeFetch('/api/security/access-logs/entry', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const registerExit = (idRegistro) =>
  safeFetch('/api/security/access-logs/exit', {
    method: 'PUT',
    body: JSON.stringify({ idRegistro }),
  });

export const getDashboardStatus = () =>
  safeFetch('/api/security/dashboard/status');

export const getParkingSlots = () =>
  safeFetch('/api/security/parking-slots');

export const getActiveCarts = () =>
  safeFetch('/api/security/asset-loans/active-carts');

export const createAssetLoan = (data) =>
  safeFetch('/api/security/asset-loans', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const returnAsset = (id) =>
  safeFetch(`/api/security/asset-loans/${id}/return`, {
    method: 'PUT',
  });