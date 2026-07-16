import { useState, useEffect } from 'react';
import { getAdminStructure, createAdminStructureNode, deleteAdminStructureNode, createApartment } from '../../services/api';

export function useAdminStructure() {
  const [estructura, setEstructura] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarEstructura = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminStructure();
      setEstructura(data || []);
      return data;
    } catch (error) {
      console.error("Error cargando estructura:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const insertarNodo = async (nodeData) => {
    try {
      setError(null);
      const response = await createAdminStructureNode(nodeData);

      // Esperar un momento para que el backend procese
      await new Promise(resolve => setTimeout(resolve, 500));

      const dataActualizada = await cargarEstructura();
      return dataActualizada;
    } catch (error) {
      console.error("Error al insertar nodo:", error);
      setError(error.message);
      throw error;
    }
  };

  const eliminarNodo = async (id) => {
    try {
      setError(null);
      await deleteAdminStructureNode(id);

      // Esperar un momento para que el backend procese
      await new Promise(resolve => setTimeout(resolve, 500));

      await cargarEstructura();
    } catch (error) {
      console.error("Error al eliminar nodo:", error);
      setError(error.message);
      throw error;
    }
  };

  const agregarDepartamento = async (apartmentData, pisoEncontrado) => {
    try {
      setError(null);
      console.log('Datos recibidos:', apartmentData);
      console.log('Piso encontrado:', pisoEncontrado);

      // Validar que tenemos los datos necesarios
      if (!apartmentData.numero || !pisoEncontrado) {
        throw new Error('Faltan datos obligatorios: número de departamento o piso');
      }

      // Verificar si el número ya existe en este piso
      const apartamentosExistentes = pisoEncontrado.apartamentos || [];
      const numeroDuplicado = apartamentosExistentes.some(
          a => a.numero === parseInt(apartmentData.numero)
      );

      if (numeroDuplicado) {
        throw new Error(`El departamento ${apartmentData.numero} ya existe en ${pisoEncontrado.torre.nombre} - ${pisoEncontrado.nombre || `Piso ${pisoEncontrado.numero}`}`);
      }

      // Definir el payload exacto que pide Swagger para /api/admin/structure/nodes
      const payload = {
        tipo: "APARTAMENTO",
        nombre: `Dpto ${apartmentData.numero}`,
        nombreTorre: pisoEncontrado.torreNombre || "Torre Desconocida",
        numero: parseInt(apartmentData.numero),
        numeroPiso: pisoEncontrado.numero,
        numeroApartamento: parseInt(apartmentData.numero),
        metraje: parseFloat(apartmentData.metraje) || 0
      };

      console.log('Enviando payload a /api/admin/structure/nodes:', payload);

      // Usar createAdminStructureNode
      const response = await createAdminStructureNode(payload);
      console.log('Respuesta del servidor:', response);

      // Esperar un momento para que el backend procese
      await new Promise(resolve => setTimeout(resolve, 500));

      // Recargar estructura
      await cargarEstructura();

      return response;
    } catch (error) {
      console.error('Error al agregar departamento:', error);
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    cargarEstructura();
  }, []);

  return {
    estructura,
    loading,
    error,
    insertarNodo,
    eliminarNodo,
    agregarDepartamento,
    refrescar: cargarEstructura
  };
}