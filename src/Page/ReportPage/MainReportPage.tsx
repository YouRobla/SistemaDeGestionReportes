import { useEffect } from "react";
import { useSearchParams } from "react-router";
import ReportTable from "./ReportTable";

export default function MainReportPage() {
  const [searchParams] = useSearchParams();
  
  // 🚀 Obtener parámetros de URL
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  
  // 🚀 Mapeo de estados de URL a estados de la aplicación
  const mapStatusToAppState = (urlStatus: string): string => {
    const statusMap: Record<string, string> = {
      'pending': 'SinRevisar',
      'in-progress': 'EnProceso', 
      'reviewed': 'Revisado',
      'sinrevisar': 'SinRevisar',
      'enproceso': 'EnProceso',
      'revisado': 'Revisado'
    };
    return statusMap[urlStatus.toLowerCase()] || urlStatus;
  };
  
  useEffect(() => {
    // 🚀 Log para debug
    if (status || search) {
      console.log('🔍 Parámetros de URL detectados:', { status, search });
      console.log('🔍 Estado mapeado:', status ? mapStatusToAppState(status) : 'N/A');
    }
  }, [status, search]);

  return (
    <ReportTable 
      initialStatus={status ? mapStatusToAppState(status) : undefined}
      initialSearch={search || undefined}
    />
  );
}
