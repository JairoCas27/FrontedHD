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
      return data; // Retornar los datos para usarlos en otros lugares
    } catch (error) {
      console.error("Error cargando estructura:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const insertarNodo = async (nodeData) => {
    try {
      await createAdminStructureNode(nodeData);
      const dataActualizada = await cargarEstructura(); // Recargar y obtener datos
      return dataActualizada; // Retornar los datos actualizados
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

  const agregarDepartamento = async (apartmentData) => {
    try {
      // Obtener la estructura actualizada
      const estructuraActual = await cargarEstructura();
      const listaTorres = Array.isArray(estructuraActual)
          ? estructuraActual
          : (estructuraActual?.torres || []);

      // Buscar el piso por ID
      const pisoEncontrado = listaTorres
          .flatMap(t => t.pisos || [])
          .find(p => p.id === parseInt(apartmentData.idPiso));

      if (!pisoEncontrado) {
        throw new Error('Piso no encontrado');
      }

      // Buscar la torre que contiene este piso
      const torreEncontrada = listaTorres.find(t =>
          (t.pisos || []).some(p => p.id === parseInt(apartmentData.idPiso))
      );

      // El payload debe enviar el NÚMERO del piso, no el ID
      const payload = {
        tipo: "APARTAMENTO",
        nombre: `Apartamento ${apartmentData.numero}`,
        nombreTorre: torreEncontrada?.nombre || apartmentData.nombreTorre || '',
        numero: parseInt(apartmentData.numero),
        numeroPiso: pisoEncontrado.numero,
        numeroApartamento: parseInt(apartmentData.numero),
        metraje: parseFloat(apartmentData.metraje) || 0
      };

      console.log('Enviando payload:', payload); // Debug

      await createApartment(payload);
      await cargarEstructura(); // Recargar después de crear
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
    agregarDepartamento,
    refrescar: cargarEstructura
  };
}