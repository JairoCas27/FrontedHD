import { useState, useEffect, useCallback } from 'react';
import { getAdminAssets, createAdminAsset, updateAdminAssetStatus } from '../../services/api';

export function useAdminAssets() {
  const [estacionamientos, setEstacionamientos] = useState([]);
  const [carritos, setCarritos] = useState([]);

  const [loadingEstacionamientos, setLoadingEstacionamientos] = useState(true);
  const [loadingCarritos, setLoadingCarritos] = useState(true);

  const [paginaEstacionamientos, setPaginaEstacionamientos] = useState(0);
  const [paginaCarritos, setPaginaCarritos] = useState(0);

  const [totalPaginasEstacionamientos, setTotalPaginasEstacionamientos] = useState(0);
  const [totalPaginasCarritos, setTotalPaginasCarritos] = useState(0);

  const [totalEstacionamientos, setTotalEstacionamientos] = useState(0);
  const [totalCarritos, setTotalCarritos] = useState(0);

  const cargarEstacionamientos = useCallback(async (pagina = 0) => {
    try {
      setLoadingEstacionamientos(true);
      const data = await getAdminAssets(`?type=ESTACIONAMIENTO&page=${pagina}&size=10`);
      setEstacionamientos(data?.items || []);
      setTotalPaginasEstacionamientos(data?.totalPaginas || 0);
      setTotalEstacionamientos(data?.total || 0);
      setPaginaEstacionamientos(data?.pagina || 0);
    } catch (error) {
      console.error("Error cargando estacionamientos:", error);
    } finally {
      setLoadingEstacionamientos(false);
    }
  }, []);

  const cargarCarritos = useCallback(async (pagina = 0) => {
    try {
      setLoadingCarritos(true);
      const data = await getAdminAssets(`?type=CARRITO&page=${pagina}&size=10`);
      setCarritos(data?.items || []);
      setTotalPaginasCarritos(data?.totalPaginas || 0);
      setTotalCarritos(data?.total || 0);
      setPaginaCarritos(data?.pagina || 0);
    } catch (error) {
      console.error("Error cargando carritos:", error);
    } finally {
      setLoadingCarritos(false);
    }
  }, []);

  const registrarEstacionamiento = async (numero) => {
    try {
      await createAdminAsset({ tipo: "ESTACIONAMIENTO", numero: Number(numero) });
      await cargarEstacionamientos(paginaEstacionamientos);
    } catch (error) {
      console.error("Error al crear estacionamiento:", error);
      throw error;
    }
  };

  const registrarCarrito = async (codigo) => {
    try {
      await createAdminAsset({ tipo: "CARRITO", codigo: codigo.trim() });
      await cargarCarritos(paginaCarritos);
    } catch (error) {
      console.error("Error al crear carrito:", error);
      throw error;
    }
  };

  const actualizarEstadoCarrito = async (id, estado) => {
    try {
      await updateAdminAssetStatus(id, { tipo: "CARRITO", estado });
      await cargarCarritos(paginaCarritos);
    } catch (error) {
      console.error("Error al actualizar carrito:", error);
      throw error;
    }
  };

  const configurarEstacionamiento = async (id, tipoVehiculo, capacidadMaxima) => {
    try {
      await updateAdminAssetStatus(id, {
        tipo: "ESTACIONAMIENTO",
        tipoVehiculo: tipoVehiculo || null,
        capacidadMaxima: capacidadMaxima ? Number(capacidadMaxima) : null
      });
      await cargarEstacionamientos(paginaEstacionamientos);
    } catch (error) {
      console.error("Error al configurar estacionamiento:", error);
      throw error;
    }
  };

  useEffect(() => {
    cargarEstacionamientos(0);
    cargarCarritos(0);
  }, [cargarEstacionamientos, cargarCarritos]);

  return {
    estacionamientos,
    carritos,
    loadingEstacionamientos,
    loadingCarritos,
    paginaEstacionamientos,
    paginaCarritos,
    totalPaginasEstacionamientos,
    totalPaginasCarritos,
    totalEstacionamientos,
    totalCarritos,
    cargarEstacionamientos,
    cargarCarritos,
    registrarEstacionamiento,
    registrarCarrito,
    actualizarEstadoCarrito,
    configurarEstacionamiento
  };
}