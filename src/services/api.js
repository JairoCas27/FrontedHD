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

export async function loginApi({ correo, password, recuerdame }) {
  return safeFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ correo, contrasena: password, recuerdame }),
  });
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

export async function getProfile() {
  return safeFetch('/api/profile');
}

export async function updateProfile(data) {
  return safeFetch('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getCountries() {
  return safeFetch('/api/catalogs/countries');
}

export async function getCities(countryId) {
  return safeFetch(`/api/catalogs/countries/${countryId}/cities`);
}

// APIS SUPERADMIN

export async function getSuperAdminDashboardMetrics() {
  return safeFetch('/api/super-admin/dashboard/metrics');
}

export async function getSuperAdminRecentAdmins() {
  return safeFetch('/api/super-admin/dashboard/recent-admins');
}

export async function getSuperAdminRecentCondos() {
  return safeFetch('/api/super-admin/dashboard/recent-condos');
}

export async function getCondominiums() {
  return safeFetch('/api/super-admin/condominiums?page=0&size=100');
}

export async function createCondominium(data) {
  return safeFetch('/api/super-admin/condominiums', {
    method: 'POST',
    body: JSON.stringify({
      nombre: data.nombre,
      direccion: data.direccion,
      idPais: data.idPais,
      idCiudad: data.idCiudad,
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

export const getHomeownerDashboard = () =>
  safeFetch('/api/homeowner/dashboard/summary');

export const getHomeownerApartment = () =>
  safeFetch('/api/homeowner/apartment/details');

export const getHomeownerVehicles = () =>
  safeFetch('/api/homeowner/vehicles');

export const createHomeownerVehicle = (data) =>
  safeFetch('/api/homeowner/vehicles', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const deleteHomeownerVehicle = (id) =>
  safeFetch(`/api/homeowner/vehicles/${id}`, { method: 'DELETE' });

export const getHomeownerTenants = () =>
  safeFetch('/api/homeowner/tenants');

export const createHomeownerTenant = (data) =>
  safeFetch('/api/homeowner/tenants', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const deleteHomeownerTenant = (id) =>
  safeFetch(`/api/homeowner/tenants/${id}`, { method: 'DELETE' });

export const getHomeownerLogs = () =>
  safeFetch('/api/homeowner/logs');

// APIS ADMIN

export async function getAdminDashboardMetrics() {
  return safeFetch('/api/admin/dashboard/metrics');
}

export async function getAdminApartments(params = "") {
  return safeFetch(`/api/admin/apartments${params}`);
}

export async function assignApartmentOwner(id, idPropietario) {
  return safeFetch(`/api/admin/apartments/${id}/assign-owner`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Number(idPropietario)), 
  });
}

export async function updateApartmentOccupants(id, occupantsData) {
  return safeFetch(`/api/admin/apartments/${id}/occupants`, {
    method: 'PUT',
    body: JSON.stringify(occupantsData),
  });
}

export async function getAdminAssets(params = "") {
  return safeFetch(`/api/admin/assets${params}`);
}

export async function createAdminAsset(data) {
  return safeFetch('/api/admin/assets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminAssetStatus(id, estado) {
  return safeFetch(`/api/admin/assets/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ estado }),
  });
}

export async function getAdminUsers() {
  return safeFetch('/api/admin/users');
}

export async function createAdminUser(data) {
  return safeFetch('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminUser(id, data) {
  return safeFetch(`/api/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function patchAdminUserStatus(id, activo) {
  return safeFetch(`/api/admin/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ activo }),
  });
}

export async function getAdminStructure() {
  return safeFetch('/api/admin/structure');
}

export async function createAdminStructureNode(data) {
  return safeFetch('/api/admin/structure/nodes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminStructureNode(id) {
  return safeFetch(`/api/admin/structure/nodes/${id}`, {
    method: 'DELETE',
  });
}

export async function getAdminLogs(params = "") {
  return safeFetch(`/api/admin/logs${params}`);
}

export async function getAdminCondoConfig() {
  return safeFetch('/api/admin/condominium/configuracion');
}

export async function updateAdminCondoConfig(data) {
  return safeFetch('/api/admin/condominium/configuracion', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getAdminMyInfo() {
  return safeFetch('/api/admin/condominium/my-info');
}

export async function updateAdminMyInfo(data) {
  return safeFetch('/api/admin/condominium/my-info', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}