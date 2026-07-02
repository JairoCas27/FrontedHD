import { useState, useEffect } from 'react';
import { getAdminAssets, createAdminAsset, updateAdminAssetStatus } from '../../services/api';

export function useAdminAssets() {
  const [bienes, setBienes] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarBienes = async () => {
    try {
      setLoading(true);
      // Mantenemos la paginación y filtros que ya tenías configurados
      const queryParams = "?pagina=0&tamano=100&type=Estacionamiento";
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
      await cargarBienes(); // Refresca la lista inmediatamente tras registrar
    } catch (error) {
      console.error("Error al crear bien común:", error);
      throw error;
    }
  };

  // 🟢 CORREGIDO: Ahora recibe y pasa solo el 'id' y el 'estado' ('AVAILABLE' o 'MAINTENANCE')
  // para que calce con el Query Parameter (?status=) de api.js
  const actualizarEstadoBien = async (id, estado) => {
    try {
      await updateAdminAssetStatus(id, estado);
      await cargarBienes(); // 🔄 Hace el re-fetch automático para pintar la tabla en tiempo real
    } catch (error) {
      console.error("Error al cambiar estado de activo:", error);
      throw error;
    }
  };

  useEffect(() => {
    cargarBienes();
  }, []);

  return { 
    bienes, 
    loading, 
    registrarBien, 
    actualizarEstadoBien, 
    refrescar: cargarBienes 
  };
}