"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RecipientsTableHeaderProps {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  onAddClick: () => void;
}

export function RecipientsTableHeader({
  globalFilter,
  onGlobalFilterChange,
  onAddClick
}: RecipientsTableHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-2 mb-4 items-center justify-between">
      {/* Contenedor de filtros */}
      <div className="flex flex-col md:flex-row gap-2 flex-1">
        <Input
          placeholder="Buscar por nombre completo..."
          value={globalFilter}
          onChange={(e) => onGlobalFilterChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Botón agregar */}
      <div className="mt-2 p-3 md:mt-0">
        <Button variant="outline" onClick={onAddClick}>
          Agregar
        </Button>
      </div>
    </div>
  );
}
