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

export async function forgotPasswordApi(correo) {
  return safeFetch('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ correo }),
  });
}

export async function resetPasswordApi({ token, nuevaContrasena }) {
  return safeFetch('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, nuevaContrasena }),
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
  return safeFetch(`/api/super-admin/condominiums/${id}`, { method: 'DELETE' });
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
  return safeFetch(`/api/super-admin/administrators/${id}`, { method: 'DELETE' });
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
  return safeFetch(`/api/super-admin/users/${userId}/invalidate-session`, { method: 'POST' });
}

export async function deleteUser(userId, rol) {
  if (rol === 'ADMINISTRADOR_CONDOMINIO') {
    return safeFetch(`/api/super-admin/administrators/${userId}`, { method: 'DELETE' });
  }
  return safeFetch(`/api/super-admin/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ activo: false }),
  });
}

export async function createUserWithRole(data) {
  const { rol, idCondominio, ...userData } = data;
  let created;
  try {
    created = await createAdministrator(userData);
  } catch (err) {
    throw new Error(`Error al crear usuario: ${err.message}`);
  }
  if (!created?.id) throw new Error('No se pudo crear el usuario');

  let condoAssigned = false;
  if (created?.id && idCondominio) {
    try {
      await assignAdministratorCondo(created.id, idCondominio);
      condoAssigned = true;
    } catch (err) {
      console.warn('No se pudo asignar condominio al usuario:', err.message);
    }
  }
  if (created?.id && rol !== 'ADMINISTRADOR_CONDOMINIO') {
    await updateAdministrator(created.id, { nombres: userData.nombres, apellidos: userData.apellidos, telefono: userData.telefono, rol });
  }
  return { ...created, _condoAssigned: condoAssigned };
}

export async function getAdminLogsByCondo(condominiumId, params = "") {
  return safeFetch(`/api/admin/logs?${params}`);
}

export const getHomeownerDashboard = () => safeFetch('/api/homeowner/dashboard/summary');
export const getHomeownerApartment = () => safeFetch('/api/homeowner/apartment/details');
export const getHomeownerVehicles = () => safeFetch('/api/homeowner/vehicles');
export const createHomeownerVehicle = (data) => safeFetch('/api/homeowner/vehicles', { method: 'POST', body: JSON.stringify(data) });
export const deleteHomeownerVehicle = (id) => safeFetch(`/api/homeowner/vehicles/${id}`, { method: 'DELETE' });
export const getHomeownerTenants = () => safeFetch('/api/homeowner/tenants');
export const createHomeownerTenant = (data) => safeFetch('/api/homeowner/tenants', { method: 'POST', body: JSON.stringify(data) });
export const deleteHomeownerTenant = (id) => safeFetch(`/api/homeowner/tenants/${id}`, { method: 'DELETE' });
export const getHomeownerLogs = ({ type, fechaInicio, fechaFin, page = 0, size = 10 } = {}) => {
  const params = new URLSearchParams({ type, page, size });
  if (fechaInicio) params.append("fechaInicio", fechaInicio);
  if (fechaFin)    params.append("fechaFin",    fechaFin);
  return safeFetch(`/api/homeowner/logs?${params.toString()}`);
};

export async function getAdminDashboardMetrics(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/dashboard/metrics${qs}`);
}

export async function getAdminApartments(condominioId, page = 0, size = 100) {
  const params = new URLSearchParams({ page, size });
  if (condominioId) params.append('condominioId', condominioId);
  return safeFetch(`/api/admin/apartments?${params.toString()}`);
}

export async function assignApartmentOwner(id, idPropietario, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/apartments/${id}/assign-owner${qs}`, {
    method: 'PUT',
    body: JSON.stringify({ idPropietario: Number(idPropietario) }),
  });
}

export async function updateApartmentOccupants(id, occupantsData, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/apartments/${id}/occupants${qs}`, {
    method: 'PUT',
    body: JSON.stringify(occupantsData),
  });
}

export async function getAdminAssets(condominioId, type, page = 0, size = 100) {
  const params = new URLSearchParams({ type, page, size });
  if (condominioId) params.append('condominioId', condominioId);
  return safeFetch(`/api/admin/assets?${params.toString()}`);
}

export async function createAdminAsset(data, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/assets${qs}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminAssetStatus(id, payload, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/assets/${id}/status${qs}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function updateAdminAsset(id, data, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/assets/${id}${qs}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function assignAssetApartment(assetId, idApartamento, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/assets/${assetId}/assign-apartment${qs}`, {
    method: 'PUT',
    body: JSON.stringify({ idApartamento }),
  });
}

export async function getAdminUsers(condominioId, params = {}) {
  const qs = new URLSearchParams();
  if (condominioId) qs.append('condominioId', condominioId);
  if (params.search) qs.append('search', params.search);
  if (params.rol) qs.append('rol', params.rol);
  if (params.activo !== undefined) qs.append('activo', params.activo);
  if (params.page !== undefined) qs.append('page', params.page);
  if (params.size) qs.append('size', params.size);
  const query = qs.toString();
  return safeFetch(`/api/admin/users${query ? `?${query}` : ''}`);
}

export async function createAdminUser(data, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/users${qs}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminUser(id, data, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/users/${id}${qs}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function patchAdminUserStatus(id, activo, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/users/${id}/status${qs}`, {
    method: 'PATCH',
    body: JSON.stringify({ activo }),
  });
}

export async function getAdminStructure(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/structure${qs}`);
}

export async function createAdminStructureNode(data, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/structure/nodes${qs}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminStructureNode(id, data, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/structure/nodes/${id}${qs}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminStructureNode(id, type = 'TORRE', condominioId) {
  const params = new URLSearchParams({ type });
  if (condominioId) params.append('condominioId', condominioId);
  return safeFetch(`/api/admin/structure/nodes/${id}?${params.toString()}`, { method: 'DELETE' });
}

export async function getAdminLogs(condominioId, params = {}) {
  const qs = new URLSearchParams();
  if (condominioId) qs.append('condominioId', condominioId);
  if (params.type) qs.append('type', params.type);
  if (params.userId) qs.append('userId', params.userId);
  if (params.fechaInicio) qs.append('fechaInicio', params.fechaInicio);
  if (params.fechaFin) qs.append('fechaFin', params.fechaFin);
  if (params.page !== undefined) qs.append('page', params.page);
  if (params.size) qs.append('size', params.size);
  const query = qs.toString();
  return safeFetch(`/api/admin/logs${query ? `?${query}` : ''}`);
}

export async function getAdminCondoConfig(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/condominium/configuracion${qs}`);
}

export async function updateAdminCondoConfig(data, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/condominium/configuracion${qs}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getAdminMyInfo(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/condominium/my-info${qs}`);
}

export async function updateAdminMyInfo(data, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/condominium/my-info${qs}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getSecurityDashboardStatus() {
  return safeFetch('/api/security/dashboard/status');
}

export async function getSecurityActiveLoans() {
  return safeFetch('/api/security/asset-loans/active-carts');
}

export async function getSecurityParkingSlots() {
  return safeFetch('/api/security/parking-slots');
}

export async function verifyVehiclePlate(plate) {
  return safeFetch(`/api/security/vehicles/verify/${plate}`);
}

export async function registerAccessEntry(data) {
  return safeFetch('/api/security/access-logs/entry', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function registerAccessExit(idLogAcceso) {
  return safeFetch('/api/security/access-logs/exit', {
    method: 'PUT',
    body: JSON.stringify({ idLogAcceso }),
  });
}

export async function createAssetLoan(data) {
  return safeFetch('/api/security/asset-loans', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function returnAssetLoan(id) {
  return safeFetch(`/api/security/asset-loans/${id}/return`, {
    method: 'PUT',
  });
}