import { useState, useEffect } from 'react';
import { getAdminApartments, assignApartmentOwner, updateApartmentOccupants } from '../../services/api';

export function useAdminApartments() {
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({});

  const cargarDepartamentos = async () => {
    try {
      setLoading(true);
      const data = await getAdminApartments();
      //  Mapeo de la propiedad 'items' según el Swagger
      setDepartamentos(data?.items || []);
      setMeta({
        total: data?.total,
        pagina: data?.pagina,
        totalPaginas: data?.totalPaginas
      });
    } catch (error) {
      console.error("Error cargando departamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const asignarPropietario = async (id, ownerName) => {
    try {
      await assignApartmentOwner(id, ownerName);
      await cargarDepartamentos();
    } catch (error) {
      console.error("Error al asignar propietario:", error);
      throw error;
    }
  };

  const actualizarOcupantes = async (id, listaInquilinos) => {
    try {
      // El Swagger espera un objeto con la propiedad { inquilinos: [...] }
      await updateApartmentOccupants(id, { inquilinos: listaInquilinos });
      await cargarDepartamentos();
    } catch (error) {
      console.error("Error al actualizar ocupantes:", error);
      throw error;
    }
  };

  useEffect(() => {
    cargarDepartamentos();
  }, []);

  return { departamentos, loading, meta, asignarPropietario, actualizarOcupantes, refrescar: cargarDepartamentos };
}