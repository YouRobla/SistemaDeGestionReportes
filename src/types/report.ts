export type Report = {
  id: number;
  numero_registro: string;
  tipo_documento: string;
  numero_documento: string;
  sede: string; // ✅ NUEVO - Reemplaza area_texto
  tipo_reporte: string;
  lugar_incidente: string;
  descripcion_observacion: string;
  acciones_tomadas?: string; // ✅ NUEVO - Campo opcional
  estado: "SinRevisar" | "EnProceso" | "Revisado";
  fecha_registro: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  evidencias: {
    id: number;
    url: string;
    reporteId: number;
    accionId: number | null;
  }[];
  acciones: any[];
};

export type ApiResponse = {
  reportes: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export type ReportFilters = {
  page?: number;
  limit?: number;
  estado?: string;
  search?: string;
};
