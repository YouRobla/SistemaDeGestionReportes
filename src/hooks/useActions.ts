"use client";

import { useState, useCallback } from "react";
import type { Action, NewAction, CreateActionResponse, ActionsApiResponse } from "@/types";

export function useActions(reporteId: number) {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3000/api/acciones/reporte/${reporteId}`);
      
      if (!response.ok) {
        throw new Error(`Error al cargar acciones: ${response.status}`);
      }
      
      const data = await response.json();
      const responseData = data as ActionsApiResponse;
      
      if (responseData?.acciones) {
        setActions(responseData.acciones);
      } else if (Array.isArray(data)) {
        setActions(data);
      } else {
        setActions([]);
      }
    } catch (err) {
      console.error('Error al cargar acciones:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [reporteId]);


  const createAction = useCallback(async (newAction: NewAction) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('descripcion', newAction.descripcion);
      formData.append('reporteId', reporteId.toString());
      newAction.evidencias.forEach(file => formData.append('evidencias', file));

      const response = await fetch('http://localhost:3000/api/acciones/completa', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al crear acción: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as CreateActionResponse;
      setActions(prev => [...(Array.isArray(prev) ? prev : []), data.accion]);
      return data.accion;
    } catch (err) {
      console.error('Error al crear acción:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [reporteId]);

  const updateActionDescription = useCallback(async (actionId: number, descripcion: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3000/api/acciones/${actionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion }),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar acción: ${response.status}`);
      }

      const updatedAction = await response.json() as Action;
      setActions(prev => {
        const currentActions = Array.isArray(prev) ? prev : [];
        return currentActions.map(action => action.id === actionId ? updatedAction : action);
      });
      
      return updatedAction;
    } catch (err) {
      console.error('Error al actualizar acción:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvidencesToAction = useCallback(async (actionId: number, evidencias: File[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      evidencias.forEach(file => formData.append('evidencias', file));

      const response = await fetch(`http://localhost:3000/api/acciones/${actionId}/evidencias`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error al agregar evidencias: ${response.status}`);
      }

      const data = await response.json() as CreateActionResponse;
      setActions(prev => {
        const currentActions = Array.isArray(prev) ? prev : [];
        return currentActions.map(action => action.id === actionId ? data.accion : action);
      });
      
      return data.accion;
    } catch (err) {
      console.error('Error al agregar evidencias:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAction = useCallback(async (actionId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3000/api/acciones/${actionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar acción: ${response.status}`);
      }

      setActions(prev => {
        const currentActions = Array.isArray(prev) ? prev : [];
        return currentActions.filter(action => action.id !== actionId);
      });
      
      return true;
    } catch (err) {
      console.error('Error al eliminar acción:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    actions,
    loading,
    error,
    fetchActions,
    createAction,
    updateActionDescription,
    addEvidencesToAction,
    deleteAction,
  };
}
