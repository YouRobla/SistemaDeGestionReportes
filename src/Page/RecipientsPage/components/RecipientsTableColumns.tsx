"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Person } from "../types";

interface RecipientsTableColumnsProps {
  onEditClick: (recipient: Person) => void;
  onDeleteClick: (recipient: Person) => void;
}

export function createRecipientsTableColumns({
  onEditClick,
  onDeleteClick
}: RecipientsTableColumnsProps): ColumnDef<Person>[] {
  return [
    { accessorKey: "nombre_completo", header: "NOMBRE COMPLETO" },
    { accessorKey: "correo", header: "CORREO" },
    { accessorKey: "cargo", header: "CARGO" },
    { accessorKey: "area", header: "ÁREA" },
    {
      accessorKey: "acciones",
      header: "ACCIONES",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="p-2 text-blue-700 border-blue-700 hover:bg-blue-50"
            onClick={() => onEditClick(row.original)}
          >
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="p-2 text-red-600 border-red-600 hover:bg-red-50"
            onClick={() => onDeleteClick(row.original)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    }
  ];
}
