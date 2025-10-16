"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ReportViewer from "./Dialog/DialogForm";
import { ActionsDialog } from "./Dialog/ActionsDialog";
import { ReportGeneratorModal } from "@/components/ReportGenerator/ReportGeneratorModal";
import { useReports } from "@/hooks";
import type { Report } from "@/types";


const createColumns = (refetch: () => void): ColumnDef<Report>[] => [
  { 
    accessorKey: "numero_registro", 
    header: "Registro",
    size: 120,
    cell: ({ row }) => {
      const registro = row.getValue("numero_registro") as string;
      const isLong = registro.length > 12; // Solo si es más largo que 12 caracteres
      
      if (isLong) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="font-mono text-sm font-semibold text-gray-800 text-center px-2 py-1 bg-gray-50 rounded-md max-w-[100px] truncate cursor-help">
                  {registro}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="font-mono text-xs">{registro}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      
      return (
        <div className="font-mono text-sm font-semibold text-gray-800 text-center px-2 py-1 bg-gray-50 rounded-md">
          {registro}
        </div>
      );
    }
  },
  { 
    accessorKey: "nombre_completo", 
    header: "Persona",
    size: 220,
    cell: ({ row }) => {
      const nombre = row.getValue("nombre_completo") as string;
      const isLong = nombre.length > 25; // Solo si es más largo que 25 caracteres
      
      if (isLong) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-sm font-medium text-gray-900 text-left px-2 py-1 max-w-[200px] truncate cursor-help">
                  {nombre}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">{nombre}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      
      return (
        <div className="text-sm font-medium text-gray-900 text-left px-2 py-1">
          {nombre}
        </div>
      );
    }
  },
  { 
    accessorKey: "tipo_reporte", 
    header: "Tipo",
    size: 200,
    cell: ({ row }) => {
      const tipo = row.getValue("tipo_reporte") as string;
      const isLong = tipo.length > 20; // Solo si es más largo que 20 caracteres
      
      if (isLong) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-sm font-medium text-gray-800 text-left px-2 py-1 max-w-[180px] truncate cursor-help">
                  {tipo}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">{tipo}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      
      return (
        <div className="text-sm font-medium text-gray-800 text-left px-2 py-1">
          {tipo}
        </div>
      );
    }
  },
  { 
    accessorKey: "area_texto", 
    header: "Área",
    size: 140,
    cell: ({ row }) => {
      const area = row.getValue("area_texto") as string;
      const isLong = area.length > 15; // Solo si es más largo que 15 caracteres
      
      if (isLong) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-sm font-medium text-gray-700 text-left px-2 py-1 max-w-[120px] truncate cursor-help">
                  {area}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">{area}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      
      return (
        <div className="text-sm font-medium text-gray-700 text-left px-2 py-1">
          {area}
        </div>
      );
    }
  },
  { 
    accessorKey: "fecha_registro", 
    header: "Fecha",
    size: 160,
    cell: ({ row }) => (
      <div className="text-sm font-medium text-gray-600 text-left px-2 py-1">
        {new Date(row.getValue("fecha_registro")).toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    )
  },
  {
    accessorKey: "estado",
    header: "Estado",
    size: 120,
    cell: ({ row }) => {
      const estado = row.getValue("estado") as Report["estado"];
      let color = "gray";
      let displayText: string = estado;
      
      if (estado === "SinRevisar") {
        color = "red";
        displayText = "Sin Revisar";
      } else if (estado === "EnProceso") {
        color = "yellow";
        displayText = "En Proceso";
      } else if (estado === "Revisado") {
        color = "blue";
        displayText = "Revisado";
      }
      
      return <Badge className={`bg-${color}-100 text-${color}-800 border-${color}-200 text-xs font-medium px-2 py-1`}>{displayText}</Badge>;
    },
  },
  {
    accessorKey: "acciones",
    header: "Acciones",
    size: 180,
    cell: ({ row }) => {
      const [isOpen, setIsOpen] = React.useState(false);
      const [isReportGeneratorOpen, setIsReportGeneratorOpen] = React.useState(false);
      const estado = row.getValue("estado") as Report["estado"];
      
      return (
        <div className="flex gap-2 items-center justify-center px-2 py-1">
          <ReportViewer 
            report={row.original} 
            open={isOpen} 
            setOpen={setIsOpen}
            showActionsButton={estado === "Revisado"} // 🚀 Solo mostrar botón de acciones si está "Revisado"
          />
          {/* 🚀 Solo mostrar ActionsDialog si NO está en estado "Revisado" */}
          {estado !== "Revisado" && (
            <ActionsDialog 
              reportId={row.original.id}
              report={{
                fecha_inicio: (row.original as any).fecha_inicio,
                fecha_fin: (row.original as any).fecha_fin,
                estado: row.original.estado
              }}
              onActionSaved={refetch}
            />
          )}
          {/* 🚀 Botón de generación de reportes solo si está "Revisado" */}
          {estado === "Revisado" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsReportGeneratorOpen(true)}
                    className="h-8 w-8 p-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generar Reporte PDF</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {/* 🚀 Modal de generación de reportes */}
          <ReportGeneratorModal
            report={row.original}
            open={isReportGeneratorOpen}
            onOpenChange={setIsReportGeneratorOpen}
          />
      </div>
      );
    },
  },
];

interface ReportTableProps {
  initialStatus?: string;
  initialSearch?: string;
}

export default function ReportTable({ 
  initialStatus, 
  initialSearch 
}: ReportTableProps = {}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  
  const {
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
  } = useReports({ estado: 'SinRevisar' }); // 🚀 Por defecto mostrar solo "Sin Revisar"

  // 🚀 Aplicar parámetros iniciales de URL
  React.useEffect(() => {
    if (initialStatus) {
      console.log('🔍 Aplicando estado inicial desde URL:', initialStatus);
      setEstadoFilter(initialStatus);
    }
    if (initialSearch) {
      console.log('🔍 Aplicando búsqueda inicial desde URL:', initialSearch);
      setSearch(initialSearch);
    }
  }, [initialStatus, initialSearch, setEstadoFilter, setSearch]);

  const columns = createColumns(refetch);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnFilters, columnVisibility },
    columnResizeMode: 'onChange',
  });

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-700 font-medium mb-2">Error al cargar los datos</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <Button onClick={refetch} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4" style={{ maxWidth: '100%' }}>
      {/* Filtros responsivos */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full">
        <div className="flex-1 min-w-0 w-full relative">
        <Input
            placeholder="Buscar por persona o reportante..."
            value={searchValue}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
            }}
            className="w-full pr-10"
            disabled={loading}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
            </div>
          )}
        </div>
        <div className="sm:w-48 flex-shrink-0 w-full">
        <Select
            value={filters.estado || "all"}
            onValueChange={(value) => {
              setEstadoFilter(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="SinRevisar">Sin Revisar</SelectItem>
              <SelectItem value="EnProceso">En Proceso</SelectItem>
            <SelectItem value="Revisado">Revisado</SelectItem>
          </SelectContent>
        </Select>
      </div>

        {/* 🚀 Botón de recarga manual */}
        <div className="flex-shrink-0">
          <Button 
            onClick={refetch} 
            variant="outline" 
            size="sm"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                <span>Cargando...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Actualizar</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Tabla optimizada */}
      <div className="border rounded-lg w-full shadow-sm">
        <div className="w-full overflow-x-auto">
          <Table className="w-full table-fixed">
            <TableHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-blue-200">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                      className="text-center text-blue-900 font-bold py-4 px-3 text-sm"
                      style={{ width: `${header.column.columnDef.size}px` }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, idx) => (
              <TableRow
                key={row.id}
                    className={`hover:bg-blue-50/50 transition-all duration-200 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
              >
                {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id} 
                        className="py-4 px-3 border-b border-gray-100"
                        style={{ width: `${cell.column.columnDef.size}px` }}
                      >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-lg">No hay reportes disponibles</div>
                      <div className="text-sm">Intenta ajustar los filtros de búsqueda</div>
                    </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
        </div>
      </div>

      {/* Paginación mejorada */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 p-4 w-full relative" style={{ minHeight: '60px' }}>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage(pagination.page - 1)}
            disabled={!pagination.hasPrev || loading}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline font-medium">Anterior</span>
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {pagination.page}
            </span>
            <span className="text-sm text-muted-foreground">de</span>
            <span className="text-sm font-medium">
              {pagination.totalPages}
            </span>
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage(pagination.page + 1)}
            disabled={!pagination.hasNext || loading}
            className="flex items-center gap-2"
          >
            <span className="hidden sm:inline font-medium">Siguiente</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto relative">
          <div className="text-sm text-center sm:text-left flex-shrink-0">
            <span className="font-medium">{pagination.total}</span>
            <span className="text-muted-foreground"> reportes total</span>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0 relative z-10">
            <span className="text-sm text-muted-foreground">Mostrar:</span>
            <Select 
              onValueChange={(value) => {
                setPageSize(Number(value));
              }} 
              value={pagination.limit.toString()}
            >
              <SelectTrigger className="w-16 h-8 text-sm">
                <SelectValue />
          </SelectTrigger>
          <SelectContent 
            side="bottom" 
            align="end"
            sideOffset={2}
            alignOffset={0}
            className="min-w-[60px] w-auto"
          >
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
