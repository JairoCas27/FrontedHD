import { useState, useEffect } from 'react';
import { getAdminDashboardMetrics } from '../services/api';

export function useAdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarMetrics = async () => {
    try {
      setLoading(true);
      const data = await getAdminDashboardMetrics();
      setMetrics(data);
    } catch (error) {
      console.error("Error cargando métricas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMetrics();
  }, []);

  return { metrics, loading, refrescar: cargarMetrics };
}