"use client";

import { flexRender, type Table } from "@tanstack/react-table";
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Person } from "../types";

interface RecipientsTableBodyProps {
  table: Table<Person>;
}

export function RecipientsTableBody({ 
  table
}: RecipientsTableBodyProps) {
  return (
    <UITable className="border">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="text-left text-blue-900 uppercase font-bold">
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row, idx) => (
            <TableRow key={row.id} className={`hover:bg-blue-50 ${idx % 2 === 0 ? "bg-white" : "bg-blue-50/30"}`}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="whitespace-pre-wrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={table.getAllColumns().length} className="text-center py-4">
              No hay resultados.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </UITable>
  );
}
