import { useState, useEffect } from 'react';
import { getAdminStructure, createAdminStructureNode, deleteAdminStructureNode } from '../../services/api';

export function useAdminStructure() {
  const [estructura, setEstructura] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarEstructura = async () => {
    try {
      setLoading(true);
      const data = await getAdminStructure();
      setEstructura(data || []);
    } catch (error) {
      console.error("Error cargando estructura:", error);
    } finally {
      setLoading(false);
    }
  };

  const insertarNodo = async (nodeData) => {
    try {
      await createAdminStructureNode(nodeData);
      await cargarEstructura();
    } catch (error) {
      console.error("Error al insertar nodo:", error);
      throw error;
    }
  };

  const eliminarNodo = async (id) => {
    try {
      await deleteAdminStructureNode(id);
      await cargarEstructura();
    } catch (error) {
      console.error("Error al eliminar nodo:", error);
      throw error;
    }
  };

  useEffect(() => {
    cargarEstructura();
  }, []);

  return { estructura, loading, insertarNodo, eliminarNodo, refrescar: cargarEstructura };
}