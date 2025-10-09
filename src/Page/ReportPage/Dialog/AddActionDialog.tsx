"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Image, FileText, Plus, Trash2 } from "lucide-react";
import type { NewAction } from "@/types";

interface AddActionDialogProps {
  onSave: (action: NewAction) => void;
  action?: NewAction;
  isEdit?: boolean;
  children?: React.ReactNode;
}

export function AddActionDialog({
  onSave,
  action,
  isEdit = false,
  children,
}: AddActionDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [descripcion, setDescripcion] = React.useState(action?.descripcion || "");
  const [evidencias, setEvidencias] = React.useState<File[]>(action?.evidencias || []);

  React.useEffect(() => {
    if (action) {
      setDescripcion(action.descripcion);
      setEvidencias(action.evidencias);
    }
  }, [action]);

  /** 📂 Manejo de archivos */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const nuevosArchivos = Array.from(e.target.files);
      setEvidencias((prev) => [...prev, ...nuevosArchivos]);
    }
  };

  /** 🗑️ Eliminar evidencia individual */
  const handleRemoveFile = (index: number) => {
    setEvidencias((prev) => prev.filter((_, i) => i !== index));
  };

  /** 💾 Guardar acción */
  const handleSave = () => {
    // Validar que la descripción tenga más de 5 palabras
    const palabras = descripcion.trim().split(/\s+/).filter(palabra => palabra.length > 0);
    if (palabras.length < 5) {
      alert('La descripción debe tener al menos 5 palabras');
      return;
    }

    const newAction: NewAction = {
      id: action?.id || Date.now().toString(),
      descripcion,
      evidencias,
    };
    onSave(newAction);
    if (!isEdit) {
      setDescripcion("");
      setEvidencias([]);
    }
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    if (!isEdit) {
      setDescripcion("");
      setEvidencias([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar Acción
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full  flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {isEdit ? "Editar Acción" : "Registrar Nueva Acción"}
          </DialogTitle>
        </DialogHeader>

        {/* 🧭 Contenido con scroll interno */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6 mt-2">
          {/* 📝 Descripción */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4" />
              Descripción de la acción
            </label>
            <Textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe la acción..."
              className="max-h-[140px] resize-none border border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-400"
            />
          </div>

          {/* 📎 Evidencias */}
          <div className=" border-t border-gray-200">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Image className="w-4 h-4" />
              Evidencias
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Puedes adjuntar una o varias imágenes o documentos.
            </p>

            <Input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls"
              onChange={handleFileChange}
              className="w-full cursor-pointer border border-gray-300"
            />

            {/* 📂 Lista de archivos seleccionados */}
            {evidencias.length > 0 && (
              <div className="mt-3 space-y-2  bg-gray-50 rounded-md p-3 border border-gray-200 max-h-[120px] overflow-y-auto">
                <p className="text-xs font-medium text-gray-700">
                  Archivos seleccionados:
                </p>
                <ul className="space-y-1">
                  {evidencias.map((file, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center text-sm text-gray-700 bg-white border border-gray-200 rounded-md px-2 py-1"
                    >
                      <span className="truncate max-w-[80%]">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-red-500 h-6 w-6"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER fijo abajo */}
        <DialogFooter className="   ">
          <div className="flex gap-3 justify-end w-full">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!descripcion.trim()}>
              {isEdit ? "Actualizar Acción" : "Guardar Acción"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
