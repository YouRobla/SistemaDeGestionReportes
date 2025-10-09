"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Trash2, Paperclip } from "lucide-react";
import { AddActionDialog } from "./AddActionDialog";
import type { NewAction } from "@/types";

interface NewActionsProps {
  actions: NewAction[];
  onSave: (action: NewAction) => void;
  onRemove: (id: string) => void;
}

export function NewActions({ actions, onSave, onRemove }: NewActionsProps) {
  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Nuevas Acciones</h3>
        <AddActionDialog onSave={onSave} />
      </div>

      {/* Contenedor de acciones */}
      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
        {actions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center">
            No hay acciones registradas.
          </p>
        ) : (
          actions.map((action) => (
            <div
              key={action.id}
              className="group flex items-start justify-between gap-2 rounded-md border border-border bg-muted/40 p-2 transition hover:bg-muted max-w-full"
            >
              {/* Contenido clickeable */}
              <AddActionDialog onSave={onSave} action={action} isEdit>
                <button className="flex flex-col flex-1 text-left focus:outline-none min-w-0 max-w-[calc(100%-3rem)]">
                  {/* Descripción */}
                  <div className="flex items-center gap-2 w-full min-w-0">
                    <FileText className="w-4 h-4 text-primary shrink-0" />
                    <span
                      className="text-sm block overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px]"
                      title={action.descripcion}
                    >
                      {action.descripcion}
                    </span>
                  </div>

                  {/* Evidencias */}
                  {action.evidencias.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 max-w-[300px]">
                      {action.evidencias.map((file, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1 px-2 py-0.5 text-xs font-normal max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap"
                          title={file.name}
                        >
                          <Paperclip className="w-3 h-3 shrink-0" />
                          <span className="truncate">{file.name}</span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </button>
              </AddActionDialog>

              {/* Botón eliminar */}
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onRemove(action.id)}
                className="h-7 w-7 mt-1 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
