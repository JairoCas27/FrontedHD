/**
 * Datos simulados para el estacionamiento
 * (Se implementará backend en un futuro)
 */

export const mockParkingData = {
    // Estadísticas básicas del estacionamiento
    totalSpaces: 450,
    occupiedSpaces: 312,
    availableSpaces: 138,
    alerts: 3,

    // Actividad reciente (simula un log de eventos)
    recentActivity: [
        { id: 1, vehicle: 'ABC-123', resident: 'Juan Pérez', action: 'Ingreso', time: '10:30 AM', space: 'A-12' },
        { id: 2, vehicle: 'XYZ-789', resident: 'María García', action: 'Salida', time: '10:15 AM', space: 'B-05' },
        { id: 3, vehicle: 'DEF-456', resident: 'Carlos López', action: 'Reserva', time: '09:45 AM', space: 'C-08' },
    ],

    // Lista de residentes registrados (ubicado en modulo residentes)
    residents: [
        { id: 1, name: 'Juan Pérez', apartment: '101', vehicle: 'ABC-123', space: 'A-12', status: 'active' },
        { id: 2, name: 'María García', apartment: '202', vehicle: 'XYZ-789', space: 'B-05', status: 'active' },
        { id: 3, name: 'Carlos López', apartment: '303', vehicle: 'DEF-456', space: 'C-08', status: 'inactive' },
    ],

};