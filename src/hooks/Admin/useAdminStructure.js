import { useState, useEffect } from 'react';
import { getAdminStructure, createAdminStructureNode, deleteAdminStructureNode, createApartment } from '../../services/api';

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

  // Nueva función para agregar departamentos
  const agregarDepartamento = async (apartmentData) => {
    try {
      // Buscar la torre y el piso para obtener los nombres
      const torreEncontrada = estructura.find(t =>
          t.pisos?.some(p => p.id === parseInt(apartmentData.idPiso))
      );

      const pisoEncontrado = torreEncontrada?.pisos?.find(p =>
          p.id === parseInt(apartmentData.idPiso)
      );

      const payload = {
        tipo: "APARTAMENTO",
        nombre: `Apartamento ${apartmentData.numero}`,
        nombreTorre: torreEncontrada?.nombre || apartmentData.nombreTorre,
        numero: parseInt(apartmentData.numero),
        numeroPiso: pisoEncontrado?.numero || parseInt(apartmentData.numeroPiso),
        numeroApartamento: parseInt(apartmentData.numero),
        metraje: parseFloat(apartmentData.metraje) || 0
      };

      await createApartment(payload);
      await cargarEstructura();
    } catch (error) {
      console.error("Error al agregar departamento:", error);
      throw error;
    }
  };

  useEffect(() => {
    cargarEstructura();
  }, []);

  return {
    estructura,
    loading,
    insertarNodo,
    eliminarNodo,
    agregarDepartamento, // Exportar nueva función
    refrescar: cargarEstructura
  };
}