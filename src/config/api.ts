// 🚀 Configuración de la API
export const API_CONFIG = {
  // URL base del servidor (desde variables de entorno)
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://backend-reporte.onrender.com',
  
  // Configuración de ambiente
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  
  // Endpoints de la API
  ENDPOINTS: {
    // Profesores
    PROFESORES: {
      BASE: '/api/profesores',
      ACTIVOS: '/api/profesores/activos',
      BY_ID: (id: number) => `/api/profesores/${id}`,
    },
    
    // Reportes
    REPORTES: {
      BASE: '/api/reportes',
      BY_ID: (id: number) => `/api/reportes/${id}`,
      ESTADO: (id: number) => `/api/reportes/${id}/estado`,
    },
    
    // Acciones
    ACCIONES: {
      BASE: '/api/acciones',
      BY_REPORTE: (reporteId: number) => `/api/acciones/reporte/${reporteId}`,
      BY_ID: (id: number) => `/api/acciones/${id}`,
      EVIDENCIAS: (id: number) => `/api/acciones/${id}/evidencias`,
      COMPLETA: '/api/acciones/completa',
    },
  },
  
  // Configuración de headers
  HEADERS: {
    JSON: {
      'Content-Type': 'application/json',
    },
    FORM_DATA: {
      // No incluir Content-Type para FormData (se establece automáticamente)
    },
  },
  
  // Timeouts y configuración de requests
  REQUEST_CONFIG: {
    TIMEOUT: 10000, // 10 segundos
    RETRY_ATTEMPTS: 3,
  },
} as const;

// 🚀 Funciones helper para construir URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// 🚀 Función para hacer requests con configuración estándar
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const fullUrl = url.startsWith('http') ? url : buildApiUrl(url);
  
  const defaultOptions: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.HEADERS.JSON,
      ...options.headers,
    },
  };
  
  return fetch(fullUrl, defaultOptions);
};

// 🚀 Función para requests con FormData
export const apiFormRequest = async (
  url: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<Response> => {
  const fullUrl = url.startsWith('http') ? url : buildApiUrl(url);
  
  const defaultOptions: RequestInit = {
    ...options,
    method: 'POST',
    body: formData,
    // No incluir Content-Type para FormData
  };
  
  return fetch(fullUrl, defaultOptions);
};

// 🚀 Funciones de logging (solo en desarrollo)
export const logApiCall = (method: string, url: string, data?: any) => {
  if (API_CONFIG.IS_DEVELOPMENT) {
    console.log(`🚀 API Call: ${method} ${url}`, data ? { data } : '');
  }
};

export const logApiResponse = (response: Response, data?: any) => {
  if (API_CONFIG.IS_DEVELOPMENT) {
    console.log(`📡 API Response: ${response.status} ${response.statusText}`, data ? { data } : '');
  }
};

export const logApiError = (error: Error, context?: string) => {
  if (API_CONFIG.IS_DEVELOPMENT) {
    console.error(`❌ API Error${context ? ` (${context})` : ''}:`, error);
  }
};
