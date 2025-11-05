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
  // 🚀 Estado para rastrear si hubo cambios que requieran refrescar la tabla
  const [shouldRefreshTable, setShouldRefreshTable] = React.useState(false);

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

  // 🚀 Función para formatear fecha en formato YYYY-MM-DD sin problemas de zona horaria
  const formatDateToLocal = (dateString: string) => {
    // Extraer solo la parte de la fecha (YYYY-MM-DD) sin procesar la hora
    // Esto evita problemas de conversión de zona horaria
    const fechaSolo = dateString.split('T')[0];
    return fechaSolo;
  };

  // 🚀 Función para obtener la fecha actual en formato local
  const getTodayLocal = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 🚀 Función para formatear fecha para visualización (dd/mm/yyyy)
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return 'No especificada';
    // Extraer año, mes y día directamente del string YYYY-MM-DD
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  React.useEffect(() => {
    if (open) {
      // 🚀 Resetear el estado de refresco cuando se abre el diálogo
      setShouldRefreshTable(false);
      
      // 🚀 Lógica para fecha de inicio
      // Si el reporte está en "SinRevisar" y no tiene fecha_inicio, usar fecha de hoy
      // Si ya tiene fecha_inicio del backend, usar esa fecha
      if (report?.estado === "SinRevisar" && !report?.fecha_inicio) {
        setFechaInicio(getTodayLocal());
      } else if (report?.fecha_inicio) {
        setFechaInicio(formatDateToLocal(report.fecha_inicio));
      } else {
        setFechaInicio(getTodayLocal());
      }
      
      if (report?.fecha_fin) {
        setFechaFin(formatDateToLocal(report.fecha_fin));
      } else {
        setFechaFin("");
      }
      
      fetchActions();
    }
  }, [open, fetchActions, report]);

  // 🚀 Efecto separado para manejar el cierre del diálogo
  // Solo refrescar la tabla si hubo cambios significativos (cambio de estado)
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current && !open) {
      // 🚀 Solo refrescar si hubo cambios que requieran actualizar la tabla
      if (shouldRefreshTable && onActionSaved) {
        onActionSaved();
      }
      // Resetear el estado para la próxima vez
      setShouldRefreshTable(false);
    }
    prevOpen.current = open;
  }, [open, shouldRefreshTable, onActionSaved]);

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
      
      // 🚀 Si es la primera acción y el reporte está en "SinRevisar", actualizar el estado a "EnProceso"
      const esLaPrimeraAccion = !existingActions || existingActions.length === 0;
      const cambioEstado = esLaPrimeraAccion && report?.estado === "SinRevisar";
      
      if (cambioEstado) {
        console.log('🚀 Primera acción detectada, actualizando estado a EnProceso');
        
        // ✅ Crear fecha de inicio como inicio del día en hora local
        const hoy = getTodayLocal();
        const [year, month, day] = hoy.split('-').map(Number);
        // Crear fecha local a medianoche y convertir a ISO
        const fechaLocal = new Date(year, month - 1, day, 0, 0, 0, 0);
        const fechaInicioISO = fechaLocal.toISOString();
        
        console.log('📅 Fecha de inicio que se enviará:', fechaInicioISO);
        
        const response = await fetch(`https://backend-reporte.onrender.com/api/reportes/${reportId}/estado`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            estado: "EnProceso",
            fecha_inicio: fechaInicioISO
          }),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar estado del reporte');
        }
        
        console.log('✅ Estado actualizado a EnProceso con fecha_inicio');
        
        // 🚀 Marcar que se debe refrescar la tabla cuando se cierre el modal
        // porque el estado del reporte cambió
        setShouldRefreshTable(true);
      }
      
      // 🚀 Guardar todas las nuevas acciones
      for (const newAction of newActions) {
        await createAction(newAction);
      }
      
      setNewActions([]);
      await fetchActions(); // Solo refrescar las acciones dentro del modal, no la tabla principal
      
      // 🚀 NO llamar onActionSaved aquí - solo se llamará cuando se cierre el modal si shouldRefreshTable es true
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
      const fechaParaEnviar = fechaFin || getTodayLocal();
      console.log('📅 Fecha que se usará:', fechaParaEnviar);

      // ✅ CORRECTO: Crear fecha en hora local y convertir a UTC para el backend
      // Formato: YYYY-MM-DD -> Date local a las 23:59:59.999
      const [year, month, day] = fechaParaEnviar.split('-').map(Number);
      const fechaLocal = new Date(year, month - 1, day, 23, 59, 59, 999);
      const fechaFinISO = fechaLocal.toISOString();
      
      console.log('🔍 Fecha fin original:', fechaParaEnviar);
      console.log('🔍 Fecha local creada:', fechaLocal);
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

      // 🚀 Marcar que se debe refrescar la tabla porque el estado cambió a "Revisado"
      setShouldRefreshTable(true);
      
      // 🚀 Cerrar el modal - el useEffect se encargará de refrescar la tabla
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
                {formatDateForDisplay(fechaInicio)}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Fecha de finalización *
              </label>
              {report?.estado === "Revisado" ? (
                <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {formatDateForDisplay(fechaFin)}
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
