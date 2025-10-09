"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle, User } from "lucide-react";
import { Person } from "../types";

interface DeleteRecipientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  recipient?: Person;
  loading?: boolean;
}

export function DeleteRecipientDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  recipient,
  loading = false
}: DeleteRecipientDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Confirmar Eliminación
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <User className="w-8 h-8 text-red-600" />
            <div>
              <p className="font-medium text-red-900">
                ¿Estás seguro que deseas eliminar este profesor?
              </p>
              {recipient && (
                <p className="text-sm text-red-700 mt-1">
                  {recipient.nombre_completo} - {recipient.cargo}
                </p>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Advertencia:</strong> Esta acción no se puede deshacer. 
              Se eliminará permanentemente toda la información del profesor.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
