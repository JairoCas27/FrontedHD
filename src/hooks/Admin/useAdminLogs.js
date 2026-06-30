import { useState, useEffect } from 'react';
import { getAdminLogs } from '../../services/api';

export function useAdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarLogs = async () => {
    try {
      setLoading(true);
      const queryParams = "?pagina=0&tamano=100";
      const data = await getAdminLogs(queryParams);
      
      setLogs(data?.items || []);
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