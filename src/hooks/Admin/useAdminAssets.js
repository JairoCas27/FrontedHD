import { useState, useEffect } from 'react';
import { getAdminAssets, createAdminAsset, updateAdminAssetStatus } from '../../services/api';

export function useAdminAssets() {
  const [bienes, setBienes] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarBienes = async () => {
    try {
      setLoading(true);
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
      await cargarBienes();
    } catch (error) {
      console.error("Error al crear bien común:", error);
      throw error;
    }
  };

  // 🟢 RE-CORREGIDO: Recibe los datos necesarios para empaquetar el Request Body exacto de Diego
  const actualizarEstadoBien = async (id, nuevoEstado, tipoActivo, esParaDisponible) => {
    try {
      // 🎯 Estructura de payload requerida en el esquema del Swagger
      const payload = {
        tipo: tipoActivo ? tipoActivo.toUpperCase() : "ESTACIONAMIENTO",
        estado: nuevoEstado,          // "AVAILABLE" o "MAINTENANCE"
        disponible: esParaDisponible,  // true o false booleano
        tipoVehiculo: "string",
        capacidadMaxima: 1
      };

      // Invocamos pasándole el ID en la URL y el payload en el Body
      await updateAdminAssetStatus(id, payload);
      await cargarBienes(); // Refresca visualmente la tabla en tiempo real
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