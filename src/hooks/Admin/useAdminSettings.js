import { useState, useEffect } from 'react';
import { getAdminCondoConfig, updateAdminCondoConfig, getAdminMyInfo, updateAdminMyInfo } from '../../services/api';

export function useAdminSettings() {
  const [config, setConfig] = useState(null);
  const [condoInfo, setCondoInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarParametrosSystem = async () => {
    try {
      setLoading(true);
      const [configData, infoData] = await Promise.all([
        getAdminCondoConfig(),
        getAdminMyInfo()
      ]);
      setConfig(configData);
      setCondoInfo(infoData);
    } catch (error) {
      console.error("Error al inicializar configuraciones del sistema:", error);
    } finally {
      setLoading(false);
    }
  };

  const guardarConfiguracion = async (nuevosDatos) => {
    try {
      const data = await updateAdminCondoConfig(nuevosDatos);
      setConfig(data);
    } catch (error) {
      console.error("Error actualizando reglas de negocio:", error);
      throw error;
    }
  };

  const guardarPerfilCondominio = async (datosPerfil) => {
    try {
      await updateAdminMyInfo(datosPerfil);
      // Recarga para refrescar los nombres y direcciones actualizados
      const infoData = await getAdminMyInfo();
      setCondoInfo(infoData);
    } catch (error) {
      console.error("Error actualizando perfil del condominio:", error);
      throw error;
    }
  };

  useEffect(() => {
    cargarParametrosSystem();
  }, []);

  return { config, condoInfo, loading, guardarConfiguracion, guardarPerfilCondominio, refrescar: cargarParametrosSystem };
}