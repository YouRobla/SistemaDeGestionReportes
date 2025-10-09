"use client";

import { useState, useCallback } from "react";
import { API_CONFIG, apiRequest, logApiCall, logApiResponse, logApiError } from "@/config/api";

interface Profesor {
  id?: number;
  nombre_completo: string;
  correo: string;
  cargo: string;
  area: string;
}

interface ProfesoresApiResponse {
  profesores: Profesor[];
  total: number;
  message: string;
}

export function useProfesores() {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🚀 Obtener todos los profesores
  const fetchProfesores = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      logApiCall('GET', API_CONFIG.ENDPOINTS.PROFESORES.BASE);
      const response = await apiRequest(API_CONFIG.ENDPOINTS.PROFESORES.BASE);
      
      if (!response.ok) {
        throw new Error(`Error al cargar profesores: ${response.status}`);
      }
      
      const data = await response.json();
      logApiResponse(response, data);
      const responseData = data as ProfesoresApiResponse;
      
      if (responseData?.profesores) {
        setProfesores(responseData.profesores);
        if (responseData.message) {
          console.log('API Response:', responseData.message);
        }
      } else if (Array.isArray(data)) {
        setProfesores(data);
      } else {
        console.warn('Formato inesperado:', data);
        setProfesores([]);
      }
    } catch (err) {
      logApiError(err as Error, 'fetchProfesores');
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  // 🚀 Obtener profesores activos
  const fetchProfesoresActivos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      logApiCall('GET', API_CONFIG.ENDPOINTS.PROFESORES.ACTIVOS);
      const response = await apiRequest(API_CONFIG.ENDPOINTS.PROFESORES.ACTIVOS);
      
      if (!response.ok) {
        throw new Error(`Error al cargar profesores activos: ${response.status}`);
      }
      
      const data = await response.json();
      logApiResponse(response, data);
      const responseData = data as ProfesoresApiResponse;
      
      if (responseData?.profesores) {
        setProfesores(responseData.profesores);
        if (responseData.message) {
          console.log('API Response:', responseData.message);
        }
      } else if (Array.isArray(data)) {
        setProfesores(data);
      } else {
        console.warn('Formato inesperado:', data);
        setProfesores([]);
      }
    } catch (err) {
      logApiError(err as Error, 'fetchProfesoresActivos');
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  // 🚀 Crear profesor
  const createProfesor = useCallback(async (profesorData: Omit<Profesor, 'id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      // 🚀 Los datos ya vienen en el formato correcto del backend
      const backendData = {
        nombre_completo: profesorData.nombre_completo,
        correo: profesorData.correo,
        cargo: profesorData.cargo,
        area: profesorData.area
      };
      
      logApiCall('POST', API_CONFIG.ENDPOINTS.PROFESORES.BASE, backendData);
      const response = await apiRequest(API_CONFIG.ENDPOINTS.PROFESORES.BASE, {
        method: 'POST',
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error al crear profesor: ${response.status} - ${errorText}`);
      }

      const newProfesor = await response.json() as Profesor;
      logApiResponse(response, newProfesor);
      setProfesores(prev => [...prev, newProfesor]);
      return newProfesor;
    } catch (err) {
      console.error('Error al crear profesor:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 🚀 Actualizar profesor
  const updateProfesor = useCallback(async (id: number, profesorData: Partial<Profesor>) => {
    setLoading(true);
    setError(null);
    
    try {
      // 🚀 Los datos ya vienen en el formato correcto del backend
      const backendData = { ...profesorData };
      
      logApiCall('PUT', API_CONFIG.ENDPOINTS.PROFESORES.BY_ID(id), backendData);
      const response = await apiRequest(API_CONFIG.ENDPOINTS.PROFESORES.BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error al actualizar profesor: ${response.status} - ${errorText}`);
      }

      const updatedProfesor = await response.json() as Profesor;
      logApiResponse(response, updatedProfesor);
      setProfesores(prev => prev.map(profesor => 
        profesor.id === id ? updatedProfesor : profesor
      ));
      return updatedProfesor;
    } catch (err) {
      console.error('Error al actualizar profesor:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 🚀 Eliminar profesor
  const deleteProfesor = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.PROFESORES.BY_ID(id), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error al eliminar profesor: ${response.status} - ${errorText}`);
      }

      setProfesores(prev => prev.filter(profesor => profesor.id !== id));
      return true;
    } catch (err) {
      console.error('Error al eliminar profesor:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profesores,
    loading,
    error,
    fetchProfesores,
    fetchProfesoresActivos,
    createProfesor,
    updateProfesor,
    deleteProfesor,
  };
}
