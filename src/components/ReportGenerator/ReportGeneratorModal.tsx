import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Eye,
  Download
} from 'lucide-react';
import { useReportPDF } from '@/hooks/useReportPDF';
import { useActions } from '@/hooks/useActions';
import type { Report } from '@/types';

interface ReportGeneratorModalProps {
  report: Report;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportGeneratorModal({ 
  report, 
  open, 
  onOpenChange 
}: ReportGeneratorModalProps) {
  const [actions, setActions] = useState<any[]>([]);
  const [loadingActions, setLoadingActions] = useState(false);
  
  // 🚀 Hook para manejar acciones
  const { actions: existingActions, fetchActions } = useActions(report.id);
  
  // 🚀 Hook para generar PDF
  const { 
    generatePDF, 
    previewPDF, 
    loading: pdfLoading, 
    error: pdfError, 
    canGenerateReport 
  } = useReportPDF({ report, actions });

  // 🚀 Cargar acciones cuando se abre el modal
  useEffect(() => {
    if (open) {
      loadActions();
    }
  }, [open]);

  // 🚀 Sincronizar acciones del hook
  useEffect(() => {
    if (existingActions) {
      console.log('🔍 Acciones cargadas:', existingActions);
      setActions(existingActions);
    }
  }, [existingActions]);

  const loadActions = async () => {
    try {
      setLoadingActions(true);
      await fetchActions();
    } catch (error) {
      console.error('Error al cargar acciones:', error);
    } finally {
      setLoadingActions(false);
    }
  };

  // 🎯 Función para manejar la generación de PDF
  const handleGeneratePDF = async () => {
    if (!canGenerateReport) {
      return;
    }
    await generatePDF();
  };

  // 🎯 Función para manejar la vista previa
  const handlePreviewPDF = async () => {
    if (!canGenerateReport) {
      return;
    }
    await previewPDF();
  };

  // 🎯 Renderizar estado del reporte
  const renderStatusAlert = () => {
    if (report.estado === 'Revisado') {
      return (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Este reporte está completo y listo para generar el PDF detallado.
          </AlertDescription>
        </Alert>
      );
    }

    if (report.estado === 'EnProceso') {
      return (
        <Alert className="border-blue-200 bg-blue-50">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Este reporte está en proceso. Debe estar marcado como "Revisado" para generar el PDF.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          Este reporte aún no ha sido revisado. Debe estar marcado como "Revisado" para generar el PDF.
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Análisis y Generación de Reporte
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              Reporte #{report.numero_registro} - {report.tipo_reporte}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              className={`${
                report.estado === 'Revisado' 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : report.estado === 'EnProceso'
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-yellow-100 text-yellow-800 border-yellow-200'
              } border`}
            >
              {report.estado}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 🚨 Alerta de estado */}
          {renderStatusAlert()}

          {/* 🚨 Error del PDF */}
          {pdfError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {pdfError}
              </AlertDescription>
            </Alert>
          )}

          {/* 🚫 Bloqueo si no está revisado */}
          {!canGenerateReport && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Reporte No Disponible
              </h3>
              <p className="text-sm text-gray-600">
                Este reporte debe estar marcado como "Revisado" para poder generar el PDF detallado.
              </p>
            </div>
          )}

          {/* 📊 Vista simplificada */}
          {canGenerateReport && (
            <div className="space-y-4">
              {/* 🎯 Resumen rápido */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Resumen del Reporte
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Reportante:</span>
                    <p className="text-gray-800">{report.nombre_completo}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Tipo:</span>
                    <p className="text-gray-800">{report.tipo_reporte}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Evidencias:</span>
                    <p className="text-gray-800">{report.evidencias?.length || 0}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Acciones:</span>
                    <p className="text-gray-800">{actions?.length || 0}</p>
                  </div>
                </div>
              </div>

              {/* 🎯 Acciones de generación */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">
                      Generar Reporte PDF
                    </h3>
                    <p className="text-sm text-green-600 mt-1">
                      Crea un PDF completo con toda la información del reporte
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handlePreviewPDF}
                      disabled={pdfLoading || loadingActions}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Vista Previa
                    </Button>
                    <Button
                      onClick={handleGeneratePDF}
                      disabled={pdfLoading || loadingActions}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Download className="w-4 h-4" />
                      {pdfLoading || loadingActions ? 'Generando...' : 'Descargar PDF'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
