import { useState, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import type { Report } from '@/types';
import type { Action } from '@/types/actions';
import { PDFGenerator } from '@/components/ReportGenerator/PDFGenerator';

interface UseReportPDFProps {
  report: Report;
  actions: Action[];
}

export function useReportPDF({ report, actions }: UseReportPDFProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🎯 Generar PDF y descargar
  const generatePDF = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Crear el documento PDF
      const doc = PDFGenerator({ report, actions });
      
      // Generar el PDF como blob
      const blob = await pdf(doc).toBlob();
      
      // Crear URL del blob
      const url = URL.createObjectURL(blob);
      
      // Crear elemento de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `Reporte_${report.numero_registro}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Descargar el archivo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL
      URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Error al generar PDF:', err);
      setError('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [report, actions]);

  // 🎯 Vista previa del PDF
  const previewPDF = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Crear el documento PDF
      const doc = PDFGenerator({ report, actions });
      
      // Generar el PDF como blob
      const blob = await pdf(doc).toBlob();
      
      // Crear URL del blob
      const url = URL.createObjectURL(blob);
      
      // Abrir en nueva ventana
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        throw new Error('No se pudo abrir la ventana de vista previa');
      }
      
      // Limpiar URL después de un tiempo
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 10000);
      
    } catch (err) {
      console.error('Error al generar vista previa:', err);
      setError('Error al generar la vista previa. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [report, actions]);

  // 🎯 Validar si se puede generar el reporte
  const canGenerateReport = report.estado === 'Revisado';

  return {
    generatePDF,
    previewPDF,
    loading,
    error,
    canGenerateReport
  };
}
