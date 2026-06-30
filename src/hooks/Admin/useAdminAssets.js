import { useState, useEffect } from 'react';
import { getAdminAssets, createAdminAsset, updateAdminAssetStatus } from '../../services/api';

export function useAdminAssets() {
  const [bienes, setBienes] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarBienes = async () => {
    try {
      setLoading(true);
      // 🟢 Pasamos la paginación con los nombres exactos del Swagger: 'pagina' y 'tamano'
      const queryParams = "?pagina=0&tamano=100";
      const data = await getAdminAssets(queryParams);
      
      setBienes(data?.items || []);
    } catch (error) {
      console.error("Error cargando bienes comunes:", error);
    } finally {
      setLoading(false);
    }
  };

  const registrarBien = async (assetData) => {
    try {
      await createAdminAsset(assetData);
      await cargarBienes();
    } catch (error) {
      console.error("Error al crear bien común:", error);
      throw error;
    }
  };

  const actualizarEstadoBien = async (id, estado) => {
    try {
      await updateAdminAssetStatus(id, estado);
      await cargarBienes();
    } catch (error) {
      console.error("Error al cambiar estado de activo:", error);
      throw error;
    }
  };

  useEffect(() => {
    cargarBienes();
  }, []);

  return { bienes, loading, registrarBien, actualizarEstadoBien, refrescar: cargarBienes };
}