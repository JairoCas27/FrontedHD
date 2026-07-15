import { useState, useEffect, useCallback } from 'react';
import * as securityService from '../services/securityService';

// Hook genérico para fetching
const useFetch = (fetchFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchFn()
      .then(result => { if (!cancelled) setData(result); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    
    return () => { cancelled = true; };
  }, deps);

  return { data, loading, error, refetch: () => window.location.reload() };
};

// ========== HOOKS ESPECÍFICOS ==========

export const useParkingSlots = () => 
  useFetch(() => securityService.getParkingSlots(), []);

export const useDashboardStatus = () => 
  useFetch(() => securityService.getDashboardStatus(), []);

export const useActiveCarts = () => 
  useFetch(() => securityService.getActiveCarts(), []);

export const useVerifyVehicle = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verify = useCallback(async (plate) => {
    setLoading(true);
    setError(null);
    try {
      const result = await securityService.verifyVehicle(plate);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, verify };
};

export const useRegisterEntry = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = useCallback(async (entryData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await securityService.registerEntry(entryData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error };
};

export const useRegisterExit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = useCallback(async (exitData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await securityService.registerExit(exitData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading, error };
};