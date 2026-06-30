import { useState, useEffect } from 'react';
import { getAdminApartments, assignApartmentOwner, updateApartmentOccupants } from '../../services/api';

export function useAdminApartments() {
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, pagina: 0, totalPaginas: 0 });

  const cargarDepartamentos = async () => {
    try {
      setLoading(true);
       
      
      const data = await getAdminApartments("?pagina=0&tamano=100"); 
      setDepartamentos(data?.items || []);
      setMeta({
        total: data?.total || 0,
        pagina: data?.pagina || 0,
        totalPaginas: data?.totalPaginas || 0
      });
    } catch (error) {
      console.error("Error cargando departamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const asignarPropietario = async (idDepartamento, idUsuarioPropietario) => {
    try {
      await assignApartmentOwner(idDepartamento, idUsuarioPropietario);
      await cargarDepartamentos();
    } catch (error) {
      console.error("Error al asignar propietario:", error);
      throw error;
    }
  };

  const actualizarOcupantes = async (id, listaInquilinos) => {
    try {
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