import { useState, useEffect } from 'react';
import { getAdminCondoConfig, updateAdminCondoConfig, getAdminMyInfo, updateAdminMyInfo } from '../../services/api';

export function useAdminSettings() {
  const [config, setConfig] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarDatosGlobales = async () => {
    try {
      setLoading(true);
      const [configData, perfilData] = await Promise.all([
        getAdminCondoConfig(),
        getAdminMyInfo()
      ]);
      setConfig(configData);
      setPerfil(perfilData);
    } catch (error) {
      console.error("Error cargando configuraciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const guardarConfig = async (nuevaConfig) => {
    try {
      await updateAdminCondoConfig(nuevaConfig);
      setConfig(nuevaConfig);
    } catch (error) {
      console.error("Error al guardar configuración:", error);
      throw error;
    }
  };

  const guardarPerfil = async (nuevoPerfil) => {
    try {
      await updateAdminMyInfo(nuevoPerfil);
      setPerfil(nuevoPerfil);
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      throw error;
    }
  };

  useEffect(() => {
    cargarDatosGlobales();
  }, []);

  return { config, perfil, loading, guardarConfig, guardarPerfil, refrescar: cargarDatosGlobales };
}