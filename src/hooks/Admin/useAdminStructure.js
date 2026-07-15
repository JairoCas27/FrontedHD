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

  // Función mejorada con más validaciones y logs
  const agregarDepartamento = async (apartmentData) => {
    try {
      setError(null);
      console.log('Datos recibidos:', apartmentData);

      // Validar datos
      if (!apartmentData.numero || !apartmentData.idPiso) {
        throw new Error('Faltan datos obligatorios: número y piso');
      }

      // Obtener la estructura actualizada
      const estructuraActual = await cargarEstructura();
      const listaTorres = Array.isArray(estructuraActual)
          ? estructuraActual
          : (estructuraActual?.torres || []);

      console.log('Estructura actual:', listaTorres);

      // Buscar el piso por ID
      const pisoEncontrado = listaTorres
          .flatMap(t => (t.pisos || []).map(p => ({ ...p, torre: t })))
          .find(p => p.id === parseInt(apartmentData.idPiso));

      if (!pisoEncontrado) {
        console.error('Piso no encontrado con ID:', apartmentData.idPiso);
        console.log('Pisos disponibles:', listaTorres.flatMap(t => t.pisos || []).map(p => ({ id: p.id, nombre: p.nombre })));
        throw new Error('El piso seleccionado ya no existe. Por favor recarga la página.');
      }

      console.log('Piso encontrado:', pisoEncontrado);

      // Verificar si el número ya existe en este piso
      const apartamentosExistentes = pisoEncontrado.apartamentos || [];
      const numeroDuplicado = apartamentosExistentes.some(
          a => a.numero === parseInt(apartmentData.numero)
      );

      if (numeroDuplicado) {
        throw new Error(`El departamento ${apartmentData.numero} ya existe en ${pisoEncontrado.torre.nombre} - ${pisoEncontrado.nombre || `Piso ${pisoEncontrado.numero}`}`);
      }

      // CORRECCIÓN: Enviar el payload correcto
      const payload = {
        tipo: "APARTAMENTO",
        nombre: `Apartamento ${apartmentData.numero}`,
        nombreTorre: pisoEncontrado.torre.nombre,
        numero: parseInt(apartmentData.numero),
        numeroPiso: pisoEncontrado.numero,
        numeroApartamento: parseInt(apartmentData.numero),
        metraje: parseFloat(apartmentData.metraje) || 0,
        // Algunos backends esperan campo adicional
        pisoId: parseInt(apartmentData.idPiso) // Por si acaso
      };

      console.log('Enviando payload:', payload);

      const response = await createApartment(payload);
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