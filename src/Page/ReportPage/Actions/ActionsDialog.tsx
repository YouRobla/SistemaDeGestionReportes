"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, Calendar, FileText, Loader2, AlertCircle, Download, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useActions } from "@/hooks/useActions";

interface ActionsDialogProps {
  reportId: number;
  report?: {
    fecha_inicio?: string;
    fecha_fin?: string;
    estado?: string;
  };
}

export function ActionsDialog({ reportId, report }: ActionsDialogProps) {
  const [open, setOpen] = useState(false);

  // 🚀 Hook para obtener las acciones reales
  const {
    actions: accionesReales,
    loading,
    error,
    fetchActions,
  } = useActions(reportId);

  // 🚀 Cargar acciones cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      fetchActions();
    }
  }, [open, fetchActions]);

  // 🚀 Estados para las fechas (solo para mostrar)
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  // 🚀 Establecer fechas cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      // 🚀 Fecha de inicio: usar fecha del backend o fecha actual
      if (report?.fecha_inicio) {
        setFechaInicio(new Date(report.fecha_inicio).toISOString().slice(0, 10));
      } else {
        setFechaInicio(new Date().toISOString().slice(0, 10));
      }
      
      // 🚀 Fecha de fin: usar fecha del backend o vacío
      if (report?.fecha_fin) {
        setFechaFin(new Date(report.fecha_fin).toISOString().slice(0, 10));
      } else {
        setFechaFin("");
      }
    }
  }, [open, report]);

  // 🚀 Función para descargar evidencias
  const handleDownloadEvidence = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Ver Acciones Tomadas
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white w-full sm:w-auto max-w-[90vw] md:max-w-[800px] max-h-[90vh] p-4 sm:p-6 overflow-auto rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-green-600" /> Acciones Tomadas
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* 🚀 Fechas de inicio y fin */}
          {accionesReales.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4" /> Fecha de inicio
                </label>
                <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {fechaInicio ? new Date(fechaInicio).toLocaleDateString('es-ES') : 'No especificada'}
                </div>
                <p className="text-xs text-gray-500">Fecha cuando se envió el primer reporte</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                  <Clock className="w-4 h-4" /> Fecha de fin
                </label>
                <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  {fechaFin ? new Date(fechaFin).toLocaleDateString('es-ES') : 'No especificada'}
                </div>
                <p className="text-xs text-gray-500">Fecha de finalización del reporte</p>
              </div>
            </div>
          )}

          {/* 🚀 Estado de carga */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-sm text-gray-600">Cargando acciones...</span>
            </div>
          )}

          {/* 🚀 Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-700">Error al cargar las acciones</span>
              </div>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
          )}

          {/* 🚀 Sin acciones */}
          {!loading && !error && accionesReales.length === 0 && (
            <div className="text-center py-8">
              <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No hay acciones registradas para este reporte</p>
            </div>
          )}

          {/* 🚀 Lista de acciones reales */}
          {!loading && !error && accionesReales.length > 0 && (
            <div className="space-y-4">
              {accionesReales.map((accion, index) => (
                <div key={accion.id} className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <ClipboardCheck className="w-4 h-4 text-green-600" />
                      Acción #{index + 1}
                    </h4>
                    <span className="text-xs text-gray-500">
                      ID: {accion.id}
                    </span>
          </div>

                  {/* Descripción de la acción */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {accion.descripcion}
                    </p>
          </div>

                  {/* Evidencias descargables */}
                  {accion.evidencias && accion.evidencias.length > 0 && (
                    <div className="mt-3">
                      <span className="font-semibold text-gray-600 flex items-center gap-1 text-sm">
                        <FileText className="w-4 h-4" /> Evidencias adjuntas:
                      </span>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {accion.evidencias.map((evidencia, evIndex) => {
                          const filename = evidencia.url.split('/').pop() || `Evidencia_${evIndex + 1}`;
                          return (
                            <div key={evIndex} className="flex items-center gap-2 p-3 bg-white rounded border hover:bg-gray-50 transition-colors">
                              <FileText className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-gray-700 truncate flex-1">
                                {filename}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadEvidence(evidencia.url, filename)}
                                className="flex items-center gap-1 text-xs px-2 py-1"
                              >
                                <Download className="w-3 h-3" />
                                Descargar
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Reporte ID: {accion.reporteId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
