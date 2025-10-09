export type Report = {
  id: number;
  numero_registro: string;
  tipo_documento: string;
  numero_documento: string;
  nombre_completo: string;
  correo_institucional: string;
  nombre_reportante: string;
  area_texto: string;
  tipo_reporte: string;
  relacionado_con: string;
  lugar_incidente: string;
  descripcion_observacion: string;
  estado: "SinRevisar" | "EnProceso" | "Revisado";
  fecha_registro: string;
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
