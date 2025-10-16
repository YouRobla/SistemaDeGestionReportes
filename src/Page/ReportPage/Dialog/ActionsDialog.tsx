"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewActions } from "./NewActions";
import { ExistingActions } from "./ExistingActions";
import { useActions } from "@/hooks/useActions";
import type { NewAction } from "@/types";

interface ActionsDialogProps {
  reportId: number;
  report?: {
    fecha_inicio?: string;
    fecha_fin?: string;
    estado: string;
  };
  onActionSaved?: () => void;
}

export function ActionsDialog({ reportId, report, onActionSaved }: ActionsDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [fechaInicio, setFechaInicio] = React.useState<string>("");
  const [fechaFin, setFechaFin] = React.useState<string>("");
  const [newActions, setNewActions] = React.useState<NewAction[]>([]);

  // 🚀 Hook para manejar acciones con la API
  const {
    actions: existingActions,
    loading,
    error,
    fetchActions,
    createAction,
    updateActionDescription,
    deleteAction,
  } = useActions(reportId);

  React.useEffect(() => {
    if (open) {
      // 🚀 Usar fechas del backend si están disponibles
      if (report?.fecha_inicio) {
        setFechaInicio(new Date(report.fecha_inicio).toISOString().slice(0, 10));
      } else {
        setFechaInicio(new Date().toISOString().slice(0, 10));
      }
      
      if (report?.fecha_fin) {
        setFechaFin(new Date(report.fecha_fin).toISOString().slice(0, 10));
      } else {
        setFechaFin("");
      }
      
      fetchActions();
    }
  }, [open, fetchActions, report]);

  // 🚀 Efecto separado para manejar el cierre del diálogo
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current && !open && onActionSaved) {
      onActionSaved();
    }
    prevOpen.current = open;
  }, [open, onActionSaved]);

  const handleAddAction = (action: NewAction) => {
    setNewActions(prev => {
      const existingIndex = prev.findIndex(a => a.id === action.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = action;
        return updated;
      }
      return [...prev, action];
    });
  };

  const removeAction = (id: string) => {
    setNewActions(prev => prev.filter(action => action.id !== id));
  };

  const handleGuardarParcial = async () => {
    try {
      if (newActions.length === 0) {
        return;
      }
      
      for (const newAction of newActions) {
        await createAction(newAction);
      }
      
      setNewActions([]);
      await fetchActions();
    } catch (error) {
      console.error("Error al guardar acciones:", error);
    }
  };

  const handleEditExistingAction = async (actionId: number, descripcion: string) => {
    try {
      await updateActionDescription(actionId, descripcion);
      // 🚀 Solo recargar acciones existentes, no toda la tabla
      await fetchActions();
    } catch (error) {
      console.error("Error al editar acción:", error);
    }
  };

  const handleDeleteExistingAction = async (actionId: number) => {
    try {
      await deleteAction(actionId);
      // 🚀 Solo recargar acciones existentes, no toda la tabla
      await fetchActions();
    } catch (error) {
      console.error("Error al eliminar acción:", error);
    }
  };

  // 🚀 Finalizar reporte (cambiar estado a "Revisado")
  const handleFinalizarReporte = async () => {
    try {
      console.log('🚀 FUNCIÓN EJECUTÁNDOSE - Iniciando finalización del reporte...');
      console.log('📊 Report ID:', reportId);
      console.log('📅 Fecha fin del estado:', fechaFin);

      // ✅ Usar fechaFin del estado o fecha actual como fallback
      const fechaParaEnviar = fechaFin || new Date().toISOString().slice(0, 10);
      console.log('📅 Fecha que se usará:', fechaParaEnviar);

      // ✅ CORRECTO: Crear fecha completa con hora actual
      const fechaCompleta = new Date(fechaParaEnviar + 'T23:59:59.999Z');
      const fechaFinISO = fechaCompleta.toISOString();
      
      console.log('🔍 Fecha fin original:', fechaParaEnviar);
      console.log('🔍 Fecha fin ISO (completa):', fechaFinISO);
      
      const requestData = {
        estado: "Revisado",
        fecha_fin: fechaFinISO
      };
      
      console.log('📤 Enviando datos al backend:', requestData);
      console.log('📤 JSON stringify:', JSON.stringify(requestData));

      const response = await fetch(`https://backend-reporte.onrender.com/api/reportes/${reportId}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response body:', errorText);
        throw new Error(`Error al finalizar reporte: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Success response:', result);

      if (onActionSaved) onActionSaved();
      setOpen(false);
    } catch (error) {
      console.error("Error al finalizar reporte:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Acciones
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Acciones Tomadas</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Fecha de inicio
              </label>
              <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                {fechaInicio ? new Date(fechaInicio).toLocaleDateString('es-ES') : 'No especificada'}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Fecha de finalización *
              </label>
              {report?.estado === "Revisado" ? (
                <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {fechaFin ? new Date(fechaFin).toLocaleDateString('es-ES') : 'No especificada'}
                </div>
              ) : (
                <Input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  required
                  className={cn(
                    "w-full",
                    !fechaFin && "border-red-300 focus:border-red-500 focus:ring-red-500"
                  )}
                />
              )}
              {!fechaFin && report?.estado !== "Revisado" && (
                <p className="text-xs text-red-500">Este campo es obligatorio para finalizar</p>
              )}
            </div>
          </div>

          {/* ACCIONES EXISTENTES */}
          <ExistingActions 
            actions={existingActions}
            onEdit={handleEditExistingAction}
            onDelete={handleDeleteExistingAction}
            loading={loading}
          />
        
          {/* NUEVAS ACCIONES */}
          <NewActions 
            actions={newActions}
            onSave={handleAddAction}
            onRemove={removeAction}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleGuardarParcial}
            disabled={loading || newActions.length === 0}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Guardar Parcial
          </Button>
          <Button
            variant="destructive"
            onClick={handleFinalizarReporte}
            disabled={!fechaFin}
          >
            Finalizar / Validar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
