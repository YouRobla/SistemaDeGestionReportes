"use client";

import * as React from "react";
import {
  type ColumnFiltersState,
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { RecipientsTableHeader } from "./components/RecipientsTableHeader";
import { RecipientsTableBody } from "./components/RecipientsTableBody";
import { RecipientsTableLoading } from "./components/RecipientsTableLoading";
import { createRecipientsTableColumns } from "./components/RecipientsTableColumns";
import { AddRecipientDialog } from "./Dialog/AddRecipientDialog";
import { DeleteRecipientDialog } from "./Dialog/DeleteRecipientDialog";
import { useRecipientsTable } from "./hooks/useRecipientsTable";



export default function RecipientsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  // 🚀 Hook personalizado para manejar toda la lógica de la tabla
  const {
    data,
    loading,
    error,
    addDialogOpen,
    editDialogOpen,
    deleteDialogOpen,
    selectedRecipient,
    isAdding,
    isEditing,
    isDeleting,
    fetchProfesores,
    handleAddRecipient,
    handleEditRecipient,
    handleDeleteRecipient,
    handleEditClick,
    handleDeleteClick,
    setAddDialogOpen,
    setEditDialogOpen,
    setDeleteDialogOpen,
  } = useRecipientsTable();

  // 🚀 Crear columnas usando el componente separado
  const columns = React.useMemo(() => 
    createRecipientsTableColumns({
      onEditClick: handleEditClick,
      onDeleteClick: handleDeleteClick,
    }), 
    [handleEditClick, handleDeleteClick]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, filterValue) => {
      // Filtrado global: usa nombre_completo
      const fullName = row.original.nombre_completo.toLowerCase();
      return fullName.includes(filterValue.toLowerCase());
    },
  });

  // 🚀 Handlers para filtros
  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value);
  };


  // 🚀 Mostrar estados de carga y error
  if (loading && data.length === 0) {
    return <RecipientsTableLoading onRetry={fetchProfesores} />;
  }

  if (error) {
    return <RecipientsTableLoading onRetry={fetchProfesores} error={error} />;
  }

  return (
    <div className="w-full overflow-x-auto">
      {/* Header con filtros */}
      <RecipientsTableHeader
        globalFilter={globalFilter}
        onGlobalFilterChange={handleGlobalFilterChange}
        onAddClick={() => setAddDialogOpen(true)}
      />

      {/* Cuerpo de la tabla */}
      <RecipientsTableBody
        table={table}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      {/* 🚀 Diálogos */}
      <AddRecipientDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleAddRecipient}
        loading={isAdding}
      />

      <AddRecipientDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleEditRecipient}
        recipient={selectedRecipient}
        isEdit={true}
        loading={isEditing}
      />

      <DeleteRecipientDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteRecipient}
        recipient={selectedRecipient}
        loading={isDeleting}
      />
    </div>
  );
}
