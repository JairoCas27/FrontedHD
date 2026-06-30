import { useState, useEffect } from 'react';
import { getAdminApartments, assignApartmentOwner } from '../services/api';

export function useAdminApartments() {
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarDepartamentos = async () => {
    try {
      setLoading(true);
      const data = await getAdminApartments();
      setDepartamentos(data || []);
    } catch (error) {
      console.error("Error cargando departamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const asignarPropietario = async (id, nombre) => {
    try {
      await assignApartmentOwner(id, nombre);
      await cargarDepartamentos();
    } catch (error) {
      console.error("Error al asignar propietario:", error);
      throw error;
    }
  };

  useEffect(() => {
    cargarDepartamentos();
  }, []);

  return { departamentos, loading, asignarPropietario, refrescar: cargarDepartamentos };
}