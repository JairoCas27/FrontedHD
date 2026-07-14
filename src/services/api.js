const BASE_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => ({
  'Content-Type': 'application/json',
});

export async function safeFetch(path, options = {}) {
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


// PROPIETARIO
export const getHomeownerDashboard = () =>
  safeFetch('/api/homeowner/dashboard/summary');
 
export const getHomeownerApartment = () =>
  safeFetch('/api/homeowner/apartment/details');
 
export const getHomeownerVehicles = () =>
  safeFetch('/api/homeowner/vehicles');
 
// inquilinoId es opcional — si se omite el vehículo se asigna al propietario
export const createHomeownerVehicle = (data) =>
  safeFetch('/api/homeowner/vehicles', {
    method: 'POST',
    body: JSON.stringify(data),
  });
 
// idEstacionamiento: number para asignar, null para desasignar
export const assignHomeownerVehicleParking = (vehicleId, idEstacionamiento) =>
  safeFetch(`/api/homeowner/vehicles/${vehicleId}/parking`, {
    method: 'PUT',
    body: JSON.stringify({ idEstacionamiento }),
  });
 
export const deleteHomeownerVehicle = (id) =>
  safeFetch(`/api/homeowner/vehicles/${id}`, { method: 'DELETE' });
 
export const getHomeownerParkingSpots = () =>
  safeFetch('/api/homeowner/parking-spots');
 
export const getHomeownerTenants = () =>
  safeFetch('/api/homeowner/tenants');
 
export const createHomeownerTenant = (data) =>
  safeFetch('/api/homeowner/tenants', {
    method: 'POST',
    body: JSON.stringify(data),
  });
 
export const deleteHomeownerTenant = (id) =>
  safeFetch(`/api/homeowner/tenants/${id}`, { method: 'DELETE' });
 
export const getHomeownerLogs = ({ type, fechaInicio, fechaFin, page = 0, size = 10 } = {}) => {
  const params = new URLSearchParams({ type, page, size });
  if (fechaInicio) params.append('fechaInicio', fechaInicio);
  if (fechaFin)    params.append('fechaFin',    fechaFin);
  return safeFetch(`/api/homeowner/logs?${params.toString()}`);
};
 
// PUT /api/homeowner/vehicles/{id}

export const updateHomeownerVehicle = (id, data) =>
  safeFetch(`/api/homeowner/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      marca:   data.marca,
      color:   data.color,
      modelo:  data.modelo,
      placa:   data.placa,
    }),
  });

  // fin propietario //

export async function getAdminDashboardMetrics(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/dashboard/metrics${qs}`);
}

export async function getAdminApartments(page = 0, size = 100) {
  const params = new URLSearchParams({ page, size });
  return safeFetch(`/api/admin/apartments?${params.toString()}`);
}

export async function assignApartmentOwner(id, idPropietario) {
  return safeFetch(`/api/admin/apartments/${id}/assign-owner`, {
    method: 'PUT',
    body: JSON.stringify({ idPropietario: Number(idPropietario) }),
  });
}

export async function updateApartmentOccupants(id, occupantsData) {
  return safeFetch(`/api/admin/apartments/${id}/occupants`, {
    method: 'PUT',
    body: JSON.stringify(occupantsData),
  });
}

export async function getAdminAssets(type, page = 0, size = 100) {
  const params = new URLSearchParams({ type, page, size });
  return safeFetch(`/api/admin/assets?${params.toString()}`);
}

export async function createAdminAsset(data) {
  return safeFetch(`/api/admin/assets`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminAssetStatus(id, payload) {
  return safeFetch(`/api/admin/assets/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}


export async function unassignVehicleFromSpot(vehiculoId, condominioId) {
  const qs = `vehiculoId=${vehiculoId}` + (condominioId ? `&condominioId=${condominioId}` : '');
  return safeFetch(`/api/admin/assets/unassign-vehicle?${qs}`, {
    method: 'PUT',
  });
}

export async function updateAdminAsset(id, data, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/assets/${id}${qs}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function assignAssetApartment(assetId, idApartamento) {
  return safeFetch(`/api/admin/assets/${assetId}/assign-apartment`, {
    method: 'PUT',
    body: JSON.stringify({ idApartamento }),
  });
}

export async function deleteAdminAsset(id, condominioId, type) {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (condominioId) params.append('condominioId', condominioId);
  return safeFetch(`/api/admin/assets/${id}?${params.toString()}`, { method: 'DELETE' });
}

export function extractItems(data) {
  if (Array.isArray(data)) return data;
  if (data?.items && Array.isArray(data.items)) return data.items;
  if (data?.content && Array.isArray(data.content)) return data.content;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

export async function getAdminUsers(params = {}) {
  const qs = new URLSearchParams();
  if (params.search) qs.append('search', params.search);
  if (params.rol) qs.append('rol', params.rol);
  if (params.activo !== undefined) qs.append('activo', params.activo);
  if (params.page !== undefined) qs.append('page', params.page);
  if (params.size) qs.append('size', params.size);
  const query = qs.toString();
  return safeFetch(`/api/admin/users${query ? `?${query}` : ''}`);
}

export async function createAdminUser(data) {
  return safeFetch(`/api/admin/users`, {
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
  return safeFetch(`/api/admin/structure`);
}

export async function createAdminStructureNode(data) {
  return safeFetch(`/api/admin/structure/nodes`, {
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

export async function getAdminLogs(params = {}) {
  const qs = new URLSearchParams();
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

export async function getSecurityParkingSlots(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/security/parking-slots${qs}`);
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

// Agregar esta función después de createAdminStructureNode
export async function createApartment(data) {
  return safeFetch('/api/admin/structure/nodes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// === PARKING MANAGEMENT (Super Admin) ===

export async function getParkingSlots(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/security/parking-slots${qs}`);
}

export async function getAccessLogs(condominioId, params = {}) {
  const qs = new URLSearchParams();
  if (condominioId) qs.append('condominioId', condominioId);
  if (params.type) qs.append('type', params.type);
  if (params.page !== undefined) qs.append('page', params.page);
  if (params.size) qs.append('size', params.size);
  const query = qs.toString();
  return safeFetch(`/api/admin/logs${query ? `?${query}` : ''}`);
}

export async function registerVehicleEntry(data, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  const body = { ...data };
  const cleaned = Object.fromEntries(Object.entries(body).filter(([_, v]) => v !== undefined));
  return safeFetch(`/api/security/access-logs/entry${qs}`, {
    method: 'POST',
    body: JSON.stringify(cleaned),
  });
}

export async function registerVehicleExit(data) {
  return safeFetch('/api/security/access-logs/exit', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getHomeownerParkingSpots(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/homeowner/parking-spots${qs}`);
}

export async function getHomeownerAllVehicles() {
  return safeFetch('/api/homeowner/vehicles');
}

export async function getAdminAccessLogs(condominioId, params = {}) {
  const qs = new URLSearchParams();
  if (condominioId) qs.append('condominioId', condominioId);
  qs.append('type', params.type || 'ACCESO');
  if (params.page !== undefined) qs.append('page', params.page);
  if (params.size) qs.append('size', params.size);
  return safeFetch(`/api/admin/logs?${qs.toString()}`);
}

export async function getAdminVehicles(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/admin/vehicles${qs}`);
}

export async function getSecurityDashboard(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/security/dashboard/status${qs}`);
}

export async function getActiveCartLoans(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/security/asset-loans/active-carts${qs}`);
}

export async function registerCartLoan(data, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/security/asset-loans${qs}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAllCartLoans(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/security/asset-loans/all${qs}`);
}

export async function returnCartLoan(id) {
  return safeFetch(`/api/security/asset-loans/${id}/return`, { method: 'PUT' });
}

// === ADMIN VEHICLE MANAGEMENT (uses homeowner endpoints with SUPER_ADMIN role) ===

export async function getAdminTenants(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/homeowner/tenants${qs}`);
}

export async function createAdminVehicle(data, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/homeowner/vehicles${qs}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAdminVehicle(id, data, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/homeowner/vehicles/${id}${qs}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAdminVehicle(id, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return safeFetch(`/api/homeowner/vehicles/${id}${qs}`, { method: 'DELETE' });
}