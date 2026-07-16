import { useState, useEffect, useCallback } from 'react';
import { getAdminApartments, assignApartmentOwner, updateApartmentOccupants } from '../../services/api';

// 1. Recibe el idCondominio como argumento del hook
export function useAdminApartments(idCondominio) {
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(0);
  const [meta, setMeta] = useState({ total: 0, pagina: 0, tamano: 9, totalPaginas: 0, hayMas: false });
  const tamanoPagina = 9;

  const cargarDepartamentos = useCallback(async () => {
    try {
      setLoading(true);
      // 2. Llama a la función pasando los valores separados (NO UN STRING)
      const data = await getAdminApartments(idCondominio, pagina, tamanoPagina);
      setDepartamentos(data?.items || []);
      setMeta({
        total: data?.total ?? 0,
        pagina: data?.pagina ?? 0,
        tamano: data?.tamano ?? tamanoPagina,
        totalPaginas: data?.totalPaginas ?? 0,
        hayMas: data?.hayMas ?? false
      });
    } catch (error) {
      console.error("Error cargando departamentos:", error);
    } finally {
      setLoading(false);
    }
  }, [pagina, idCondominio]); // Añade idCondominio a las dependencias

  useEffect(() => {
    cargarDepartamentos();
  }, [cargarDepartamentos]);

  const irAPagina = (nuevaPagina) => {
    if (nuevaPagina < 0) return;
    if (meta.totalPaginas && nuevaPagina >= meta.totalPaginas) return;
    setPagina(nuevaPagina);
  };

  const paginaSiguiente = () => irAPagina(pagina + 1);
  const paginaAnterior = () => irAPagina(pagina - 1);

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

  return {
    departamentos,
    loading,
    meta,
    pagina,
    tamanoPagina,
    asignarPropietario,
    actualizarOcupantes,
    irAPagina,
    paginaSiguiente,
    paginaAnterior,
    refrescar: cargarDepartamentos
  };
}