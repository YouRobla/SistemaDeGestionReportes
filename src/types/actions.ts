export interface Action {
  id: number;
  descripcion: string;
  reporteId: number;
  evidencias: Evidence[];
  createdAt?: string; // Fecha de creación de la acción
}

export interface Evidence {
  id: number;
  url: string;
  reporteId: number | null;
  accionId: number;
}

export interface NewAction {
  id: string;
  descripcion: string;
  evidencias: File[];
}

export interface ApiResponse {
  message: string;
  accion: Action;
  evidencias?: Evidence[];
  totalEvidencias?: number;
}

export interface CreateActionResponse {
  message: string;
  accion: Action;
}

export interface ActionsApiResponse {
  acciones: Action[];
  total: number;
  message: string;
}

export type ReportStatus = "SinRevisar" | "EnProceso" | "Revisado";
