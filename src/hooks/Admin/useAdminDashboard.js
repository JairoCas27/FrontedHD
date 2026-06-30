import { useState, useEffect } from 'react';
import { getAdminDashboardMetrics } from '../../services/api';

export function useAdminDashboard() {
  const [metricas, setMetricas] = useState({
    totalTorres: 0,
    totalPisos: 0,
    totalApartamentos: 0,
    totalPropietarios: 0,
    totalAgentes: 0,
    totalVehiculos: 0,
    totalCarritos: 0
  });
  const [loading, setLoading] = useState(true);

  const cargarMetricas = async () => {
    try {
      setLoading(true);
      const data = await getAdminDashboardMetrics();
      if (data) {
        setMetricas({
          totalTorres: data.totalTorres || 0,
          totalPisos: data.totalPisos || 0,
          totalApartamentos: data.totalApartamentos || 0,
          totalPropietarios: data.totalPropietarios || 0,
          totalAgentes: data.totalAgentes || 0,
          totalVehiculos: data.totalVehiculos || 0,
          totalCarritos: data.totalCarritos || 0
        });
      }
    } catch (error) {
      console.error("Error cargando métricas del dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMetricas();
  }, []);

  return { metricas, loading, refrescar: cargarMetricas };
}