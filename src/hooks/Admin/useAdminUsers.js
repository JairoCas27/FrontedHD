import { useState, useEffect } from 'react';
import { getAdminUsers, createAdminUser, updateAdminUser, patchAdminUserStatus } from '../../services/api';

export function useAdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      
      // 🟢 CORREGIDO: Mapeo seguro si el backend devuelve .items o un array directo
      const listaExtraida = Array.isArray(data) ? data : (data?.items || []);
      setUsuarios(listaExtraida);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const registrarUsuario = async (userData) => {
    try {
      await createAdminUser(userData);
      await cargarUsuarios();
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      throw error;
    }
  };

  const modificarUsuario = async (id, userData) => {
    try {
      await updateAdminUser(id, userData);
      await cargarUsuarios();
    } catch (error) {
      console.error("Error al modificar usuario:", error);
      throw error;
    }
  };

  const cambiarEstadoUsuario = async (id, activo) => {
    try {
      await patchAdminUserStatus(id, activo);
      // 🟢 CORREGIDO: Forzar recarga completa para sincronizar deshabilitaciones con la DB
      await cargarUsuarios();
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error);
      throw error;
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return { usuarios, loading, registrarUsuario, modificarUsuario, cambiarEstadoUsuario, refrescar: cargarUsuarios };
}