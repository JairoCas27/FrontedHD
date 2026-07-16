import { useState, useEffect } from 'react';
import { getAdminLogs } from '../../services/api';

export function useAdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarLogs = async () => {
    try {
      setLoading(true);

      // 🟢 CORREGIDO: Pasamos null en el primer parámetro y los filtros en el segundo
      const data = await getAdminLogs(null, {
        page: 0,
        size: 100,
        type: 'Vehicular'
      });

      setLogs(data?.items || data || []);
    } catch (error) {
      console.error("Error cargando auditoría:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarLogs();
  }, []);

  return { logs, loading, refrescar: cargarLogs };
}