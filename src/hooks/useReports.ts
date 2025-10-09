import { useState, useCallback, useEffect } from 'react';
import type { Report, ApiResponse, ReportFilters } from '@/types';

// Función para construir URL con parámetros
const buildApiUrl = (filters: ReportFilters): string => {
  const params = new URLSearchParams();
  
  // Asegurar que los valores sean strings
  if (filters.page !== undefined) {
    params.append('page', String(filters.page));
  }
  if (filters.limit !== undefined) {
    params.append('limit', String(filters.limit));
  }
  if (filters.estado && filters.estado !== 'all') {
    params.append('estado', String(filters.estado));
  }
  if (filters.search && filters.search.trim()) {
    params.append('nombre', filters.search.trim());
  }
  
  return `https://sistema-de-gestion-reportes-kcgl.vercel.app/api/reportes?${params.toString()}`;
};


// Función para obtener datos del backend
const fetchReports = async (filters: ReportFilters): Promise<ApiResponse> => {
  const url = buildApiUrl(filters);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error al cargar los reportes: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error de conexión:', error);
    throw error;
  }
};


// Hook optimizado para debounce
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export const useReports = (initialFilters: ReportFilters = {}) => {
  // Estados principales
  const [data, setData] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [filters, setFilters] = useState<ReportFilters>({
    page: 1,
    limit: 5,
    ...initialFilters
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Debounce para la búsqueda
  const debouncedSearch = useDebounce(searchValue, 500);

  // Función para cargar datos
  const loadData = useCallback(async (currentFilters: ReportFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchReports(currentFilters);
      setData(response.reportes);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto para debounce de búsqueda
  useEffect(() => {
    if (debouncedSearch !== undefined) {
      setFilters(prev => ({ 
        ...prev, 
        search: debouncedSearch || undefined, 
        page: 1 
      }));
    }
  }, [debouncedSearch]);

  // Efecto para cargar datos
  useEffect(() => {
    loadData(filters);
  }, [filters, loadData]);

  // Funciones optimizadas
  const setPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  const setEstadoFilter = useCallback((estado: string | undefined) => {
    setFilters(prev => ({ 
      ...prev, 
      estado: estado === 'all' ? undefined : estado,
      page: 1 
    }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setSearchValue(search);
  }, []);

  const refetch = useCallback(() => {
    loadData(filters);
  }, [filters, loadData]);

  return {
    data,
    loading,
    error,
    pagination,
    searchValue,
    filters,
    setPage,
    setPageSize,
    setEstadoFilter,
    setSearch,
    refetch
  };
};
