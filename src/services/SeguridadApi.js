const BASE_URL = import.meta.env.VITE_API_URL;

async function seguridadFetch(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message || data?.error || response.statusText || 'Error de red';
    throw new Error(message);
  }
  return data;
}

// ============================================================
// DASHBOARD
// ============================================================

/**
 * Obtiene el status general del condominio para el panel de seguridad.
 * GET /api/security/dashboard/status?condominioId=
 *
 * @param {number} [condominioId] - Opcional. ID del condominio.
 * @returns {Promise<{totalEstacionamientos: number, estacionamientosOcupados: number, prestamosActivos: number, movimientosRecientes: Array}>}
 */
export async function getDashboardStatus(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return seguridadFetch(`/api/security/dashboard/status${qs}`);
}

// ============================================================
// ESTACIONAMIENTOS (PARKING SLOTS)
// ============================================================

/**
 * Lista todos los espacios de estacionamiento del condominio.
 * GET /api/security/parking-slots?condominioId=
 *
 * @param {number} [condominioId] - Opcional. ID del condominio.
 * @returns {Promise<Array<{id: number, numero: number, tipoVehiculo: string|null, capacidadMaxima: number|null, cantidadActual: number, disponible: boolean}>>}
 */
export async function listParkingSlots(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return seguridadFetch(`/api/security/parking-slots${qs}`);
}

// ============================================================
// VEHÍCULOS — VERIFICACIÓN POR PLACA
// ============================================================

/**
 * Verifica un vehículo por su placa.
 * GET /api/security/vehicles/verify/{plate}
 *
 * @param {string} plate - Placa del vehículo.
 * @returns {Promise<{idVehiculo: number, placa: string, marca: string, color: string, modelo: string, tipo: string, idPropietario: number|null, nombrePropietario: string|null, idEstacionamiento: number|null}>}
 */
export async function verifyVehicleByPlate(plate) {
  return seguridadFetch(`/api/security/vehicles/verify/${encodeURIComponent(plate)}`);
}

// ============================================================
// PRÉSTAMOS DE CARRITOS
// ============================================================

/**
 * Lista todos los préstamos de carritos (historial completo).
 * GET /api/security/asset-loans/all?condominioId=
 *
 * @param {number} [condominioId] - Opcional. ID del condominio.
 * @returns {Promise<Array>}
 */
export async function getAllCartLoans(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return seguridadFetch(`/api/security/asset-loans/all${qs}`);
}

/**
 * Lista solo los préstamos activos de carritos.
 * GET /api/security/asset-loans/active-carts?condominioId=
 *
 * @param {number} [condominioId] - Opcional. ID del condominio.
 * @returns {Promise<Array>}
 */
export async function getActiveCartLoans(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return seguridadFetch(`/api/security/asset-loans/active-carts${qs}`);
}

/**
 * Registra un nuevo préstamo de carrito.
 * POST /api/security/asset-loans?condominioId=
 *
 * @param {Object} data - Datos del préstamo.
 * @param {string} data.codigoCarrito - Código o ID del carrito.
 * @param {number} data.numeroApartamento - Número de apartamento.
 * @param {string} data.nombreSolicitante - Nombre del solicitante.
 * @param {string} data.dniSolicitante - DNI del solicitante.
 * @param {string} [data.solicitante] - "PROPIETARIO" o "INQUILINO".
 * @param {number} [data.idPropietario] - ID del propietario.
 * @param {number} [data.idInquilino] - ID del inquilino.
 * @param {number} [condominioId] - Opcional. ID del condominio.
 * @returns {Promise<Object>}
 */
export async function createCartLoan(data, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return seguridadFetch(`/api/security/asset-loans${qs}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Registra la devolución de un préstamo de carrito.
 * PUT /api/security/asset-loans/{id}/return
 *
 * @param {number} id - ID del préstamo.
 * @returns {Promise<void>}
 */
export async function returnCartLoan(id) {
  return seguridadFetch(`/api/security/asset-loans/${id}/return`, {
    method: 'PUT',
  });
}

// ============================================================
// ACTIVOS (CARRITOS)
// ============================================================

/**
 * Lista todos los carritos del condominio (activos del tipo CARRITO).
 * GET /api/security/carts?condominioId=
 *
 * @param {number} [condominioId] - Opcional. ID del condominio.
 * @returns {Promise<Array<{id: number, codigo: string, estado: string}>>}
 */
export async function listCartAssets(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return seguridadFetch(`/api/security/carts${qs}`);
}

/**
 * Actualiza el estado de un carrito.
 * PUT /api/security/carts/{id}/state
 *
 * @param {number} id - ID del carrito.
 * @param {string} estado - "DISPONIBLE", "EN_USO" o "MANTENIMIENTO".
 * @param {number} [condominioId] - Opcional.
 */
export async function updateCartState(id, estado) {
  return seguridadFetch(`/api/security/carts/${id}/state`, {
    method: 'PUT',
    body: JSON.stringify({ estado }),
  });
}

// ============================================================
// APARTAMENTOS
// ============================================================

/**
 * Lista todos los apartamentos del condominio con sus ocupantes.
 * GET /api/security/apartments?condominioId=
 *
 * @param {number} [condominioId] - Opcional. ID del condominio.
 * @returns {Promise<Array<{id: number, numero: number, torreNombre: string|null, pisoNumero: number|null, idPropietario: number|null, nombrePropietario: string|null, inquilinos: Array<{id: number, nombres: string, apellidos: string, numeroDocumento: string}>}>>}
 */
export async function listSecurityApartments(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return seguridadFetch(`/api/security/apartments${qs}`);
}

// ============================================================
// VEHÍCULOS SIN ESTACIONAMIENTO
// ============================================================

/**
 * Lista vehículos registrados que no tienen un estacionamiento asignado.
 * GET /api/security/vehicles/unassigned?condominioId=
 *
 * @param {number} [condominioId] - Opcional. ID del condominio.
 * @returns {Promise<Array<{idVehiculo: number, placa: string, marca: string, modelo: string, color: string, tipo: string, nombrePropietario: string|null}>>}
 */
export async function listVehiclesWithoutSpot(condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  return seguridadFetch(`/api/security/vehicles/unassigned${qs}`);
}

// ============================================================
// REGISTRO DE ACCESO VEHICULAR
// ============================================================

/**
 * Registra la entrada de un vehículo al estacionamiento.
 * POST /api/security/access-logs/entry?condominioId=
 *
 * @param {Object} data - Datos de entrada.
 * @param {string} data.placa - Placa del vehículo.
 * @param {string} data.metodo - "OCR" o "MANUAL".
 * @param {string} [data.ocupante] - "PROPIETARIO" o "INQUILINO".
 * @param {string} [data.datosInquilino] - Datos del inquilino si aplica.
 * @param {number} [data.idEstacionamiento] - Slot específico (auto-asignación si se omite).
 * @param {number} [condominioId] - Opcional. ID del condominio.
 * @returns {Promise<Object>}
 */
export async function registerVehicleEntry(data, condominioId) {
  const qs = condominioId ? `?condominioId=${condominioId}` : '';
  const cleaned = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined && v !== null)
  );
  return seguridadFetch(`/api/security/access-logs/entry${qs}`, {
    method: 'POST',
    body: JSON.stringify(cleaned),
  });
}

/**
 * Registra la salida de un vehículo del estacionamiento.
 * PUT /api/security/access-logs/exit
 *
 * @param {number} idLogAcceso - ID del registro de entrada.
 * @returns {Promise<Object>}
 */
export async function registerVehicleExit(idLogAcceso) {
  return seguridadFetch('/api/security/access-logs/exit', {
    method: 'PUT',
    body: JSON.stringify({ idLogAcceso }),
  });
}

/**
 * Lista todos los registros de acceso vehicular.
 * GET /api/security/access-logs?condominioId=&page=&size=
 *
 * @param {Object} params - Parámetros de consulta.
 * @param {number} [params.condominioId] - ID del condominio.
 * @param {number} [params.page] - Número de página (default 0).
 * @param {number} [params.size] - Tamaño de página (default 50).
 * @returns {Promise<{items: Array, total: number, pagina: number, tamano: number, totalPaginas: number, hayMas: boolean}>}
 */
export async function getAccessLogs(params = {}) {
  const qs = new URLSearchParams();
  if (params.condominioId) qs.append('condominioId', params.condominioId);
  if (params.page !== undefined) qs.append('page', params.page);
  if (params.size) qs.append('size', params.size);
  const query = qs.toString();
  return seguridadFetch(`/api/security/access-logs${query ? `?${query}` : ''}`);
}
