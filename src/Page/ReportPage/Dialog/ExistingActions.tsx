"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { AddActionDialog } from "./AddActionDialog";
import type { Action } from "@/types";

interface ExistingActionsProps {
  actions: Action[];
  onEdit: (actionId: number, descripcion: string) => void;
  onDelete: (actionId: number) => void;
  loading?: boolean;
}

export function ExistingActions({ actions, onEdit, onDelete, loading = false }: ExistingActionsProps) {
  const safeActions = Array.isArray(actions) ? actions : [];

  if (loading) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Acciones Registradas</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2 text-sm text-gray-600">Cargando acciones...</span>
        </div>
      </div>
    );
  }

  if (safeActions.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Acciones Registradas</h3>
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No hay acciones registradas para este reporte</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Acciones Registradas</h3>
      <div className="max-h-[170px] overflow-y-auto pr-2 space-y-2">
        {safeActions.map((action) => (
          <Card key={action.id} className="relative p-2">
            <div className="flex items-start justify-between gap-2">
              {/* Contenido principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-700">
                    Acción #{action.id}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mb-1 line-clamp-1">
                  {action.descripcion}
                </p>
                
                {action.evidencias.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">
                      {action.evidencias.length} evidencia{action.evidencias.length > 1 ? 's' : ''}
                    </span>
                    <div className="flex gap-1">
                      {action.evidencias.slice(0, 2).map((evidencia, idx) => (
                        <Badge
                          key={evidencia.id}
                          variant="outline"
                          className="flex items-center gap-1 text-xs cursor-pointer hover:bg-blue-50 transition-colors px-1.5 py-0.5"
                          onClick={() => window.open(evidencia.url, '_blank')}
                          title={`Ver evidencia ${idx + 1}`}
                        >
                          <Eye className="w-2.5 h-2.5" />
                          {idx + 1}
                        </Badge>
                      ))}
                      {action.evidencias.length > 2 && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                          +{action.evidencias.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Botones de acción */}
              <div className="flex gap-0.5 flex-shrink-0">
                <AddActionDialog
                  onSave={(editedAction) => {
                    onEdit(action.id, editedAction.descripcion);
                  }}
                  action={{
                    id: action.id.toString(),
                    descripcion: action.descripcion,
                    evidencias: []
                  }}
                  isEdit={true}
                >
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-blue-50">
                    <Edit className="w-3 h-3" />
                  </Button>
                </AddActionDialog>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(action.id)}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
