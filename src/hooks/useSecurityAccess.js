import { useState } from "react";
import { toast } from "react-toastify";
import { verifyVehiclePlate, registerAccessEntry, registerAccessExit } from "../services/api";

export function useSecurityAccess() {
  const [vehiculoEncontrado, setVehiculoEncontrado] = useState(null);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingAcceso, setLoadingAcceso] = useState(false);
  const [ultimoLogId, setUltimoLogId] = useState(null);
  const [accesos, setAccesos] = useState([]);

  const verificarPlaca = async (placa) => {
    if (!placa.trim()) {
      toast.warning("Ingrese una placa para verificar");
      return;
    }
    setLoadingVerify(true);
    setVehiculoEncontrado(null);
    try {
      const data = await verifyVehiclePlate(placa.trim().toUpperCase());
      setVehiculoEncontrado(data);
      toast.success("Vehículo verificado correctamente");
    } catch (err) {
      toast.error(err.message || "Placa no registrada en el sistema");
    } finally {
      setLoadingVerify(false);
    }
  };

  const registrarEntrada = async ({ placa, metodo, ocupante, datosInquilino }) => {
    if (!placa.trim()) {
      toast.warning("Ingrese una placa antes de registrar");
      return;
    }
    setLoadingAcceso(true);
    try {
      const result = await registerAccessEntry({
        placa: placa.trim().toUpperCase(),
        metodo,
        ocupante,
        datosInquilino: datosInquilino?.trim() || "",
      });
      setUltimoLogId(result?.id ?? null);
      setAccesos((prev) => [result, ...prev]);
      toast.success("Entrada registrada correctamente");
      return true;
    } catch (err) {
      toast.error(err.message || "Error al registrar entrada");
      return false;
    } finally {
      setLoadingAcceso(false);
    }
  };

  const registrarSalida = async () => {
    if (!ultimoLogId) {
      toast.warning("No hay un log de entrada activo para registrar salida");
      return;
    }
    setLoadingAcceso(true);
    try {
      const result = await registerAccessExit(ultimoLogId);
      setAccesos((prev) => prev.map((a) => (a.id === result?.id ? result : a)));
      setUltimoLogId(null);
      toast.success("Salida registrada correctamente");
      return true;
    } catch (err) {
      toast.error(err.message || "Error al registrar salida");
      return false;
    } finally {
      setLoadingAcceso(false);
    }
  };

  const resetVehiculo = () => setVehiculoEncontrado(null);

  return {
    vehiculoEncontrado,
    loadingVerify,
    loadingAcceso,
    ultimoLogId,
    accesos,
    verificarPlaca,
    registrarEntrada,
    registrarSalida,
    resetVehiculo,
  };
}