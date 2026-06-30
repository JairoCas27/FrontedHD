import { useState, useEffect } from 'react';
import { getAdminUsers, createAdminUser, updateAdminUser, patchAdminUserStatus } from '../../services/api';

export function useAdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      setUsuarios(data || []);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const persistirUsuario = async (id, userData) => {
    try {
      if (id) {
        await updateAdminUser(id, userData);
      } else {
        await createAdminUser(userData);
      }
      await cargarUsuarios();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      throw error;
    }
  };

  const alternarAccesoUsuario = async (usuario) => {
    const nuevoEstado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await patchAdminUserStatus(usuario.id, nuevoEstado === 'Activo');
      await cargarUsuarios();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      throw error;
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return { usuarios, loading, persistirUsuario, alternarAccesoUsuario, refrescar: cargarUsuarios };
}