import { useState, useEffect } from 'react';
import { getAdminAssets, createAdminAsset, updateAdminAssetStatus } from '../../services/api';

export function useAdminAssets() {
  const [bienes, setBienes] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarBienes = async () => {
    try {
      setLoading(true);
      const data = await getAdminAssets();
      setBienes(data || []);
    } catch (error) {
      console.error("Error cargando bienes:", error);
    } finally {
      setLoading(false);
    }
  };

  const guardarActivo = async (assetData) => {
    try {
      await createAdminAsset(assetData);
      await cargarBienes();
    } catch (error) {
      console.error("Error al guardar activo:", error);
      throw error;
    }
  };

  const actualizarEstadoActivo = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'Disponible' ? 'Mantención' : 'Disponible';
    try {
      await updateAdminAssetStatus(id, nuevoEstado);
      await cargarBienes();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      throw error;
    }
  };

  useEffect(() => {
    cargarBienes();
  }, []);

  return { bienes, loading, guardarActivo, actualizarEstadoActivo, refrescar: cargarBienes };
}