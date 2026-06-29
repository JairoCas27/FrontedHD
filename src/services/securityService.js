const API_URL = 'https://sgc-backend-vfvl.onrender.com/api/security';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
});

// ========== ACCESOS (Entradas/Salidas) ==========
export const registerEntry = async (entryData) => {
  const res = await fetch(`${API_URL}/access-logs/entry`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(entryData)
  });
  if (!res.ok) throw new Error('Error al registrar entrada');
  return res.json();
};

export const registerExit = async (exitData) => {
  const res = await fetch(`${API_URL}/access-logs/exit`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(exitData)
  });
  if (!res.ok) throw new Error('Error al registrar salida');
  return res.json();
};

// ========== VEHÍCULOS ==========
export const verifyVehicle = async (plate) => {
  const res = await fetch(`${API_URL}/vehicles/verify/${plate}`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Error al verificar vehículo');
  return res.json();
};

// ========== PARQUEADEROS ==========
export const getParkingSlots = async () => {
  const res = await fetch(`${API_URL}/parking-slots`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Error al obtener parqueaderos');
  return res.json();
};

// ========== DASHBOARD / ESTADOS ==========
export const getDashboardStatus = async () => {
  const res = await fetch(`${API_URL}/dashboard/status`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Error al obtener estado');
  return res.json();
};

// ========== PRÉSTAMO DE ACTIVOS ==========
export const createAssetLoan = async (loanData) => {
  const res = await fetch(`${API_URL}/asset-loans`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(loanData)
  });
  if (!res.ok) throw new Error('Error al crear préstamo');
  return res.json();
};

export const returnAsset = async (id) => {
  const res = await fetch(`${API_URL}/asset-loans/${id}/return`, {
    method: 'PUT',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Error al registrar devolución');
  return res.json();
};

export const getActiveCarts = async () => {
  const res = await fetch(`${API_URL}/asset-loans/active-carts`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Error al obtener activos prestados');
  return res.json();
};