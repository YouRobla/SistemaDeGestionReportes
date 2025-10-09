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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select";
import { User, Mail, IdCard, Briefcase, Building } from "lucide-react";
import { Person } from "../types";

interface AddRecipientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (recipient: Omit<Person, 'id'>) => void;
  recipient?: Person;
  isEdit?: boolean;
  loading?: boolean;
}

export function AddRecipientDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  recipient, 
  isEdit = false,
  loading = false
}: AddRecipientDialogProps) {
  const [formData, setFormData] = React.useState({
    nombre_completo: "",
    correo: "",
    cargo: "",
    area: ""
  });

  // 🚀 Cargar datos del profesor si es edición
  React.useEffect(() => {
    if (recipient && isEdit) {
      setFormData({
        nombre_completo: recipient.nombre_completo,
        correo: recipient.correo,
        cargo: recipient.cargo,
        area: recipient.area
      });
    } else {
      setFormData({
        nombre_completo: "",
        correo: "",
        cargo: "",
        area: ""
      });
    }
  }, [recipient, isEdit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {isEdit ? "Editar Profesor" : "Agregar Profesor"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre Completo */}
          <div className="space-y-2">
            <Label htmlFor="nombre_completo" className="flex items-center gap-2 text-sm font-medium">
              <User className="w-4 h-4" />
              Nombre Completo *
            </Label>
            <Input
              id="nombre_completo"
              value={formData.nombre_completo}
              onChange={(e) => handleInputChange("nombre_completo", e.target.value)}
              placeholder="Ingrese el nombre completo"
              className="w-full"
              required
            />
          </div>

          {/* Correo */}
          <div className="space-y-2">
            <Label htmlFor="correo" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="w-4 h-4" />
              Correo Electrónico *
            </Label>
            <Input
              id="correo"
              type="email"
              value={formData.correo}
              onChange={(e) => handleInputChange("correo", e.target.value)}
              placeholder="correo@empresa.com"
              className="w-full"
              required
            />
          </div>

          {/* Cargo */}
          <div className="space-y-2">
            <Label htmlFor="cargo" className="flex items-center gap-2 text-sm font-medium">
              <Briefcase className="w-4 h-4" />
              Cargo *
            </Label>
            <Input
              id="cargo"
              value={formData.cargo}
              onChange={(e) => handleInputChange("cargo", e.target.value)}
              placeholder="Ingrese el cargo o posición"
              className="w-full"
              required
            />
          </div>

          {/* Área */}
          <div className="space-y-2">
            <Label htmlFor="area" className="flex items-center gap-2 text-sm font-medium">
              <Building className="w-4 h-4" />
              Área *
            </Label>
            <Select
              value={formData.area}
              onValueChange={(value) => handleInputChange("area", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione el área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Producción">Producción</SelectItem>
                <SelectItem value="Administración">Administración</SelectItem>
                <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                <SelectItem value="Ventas">Ventas</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Tecnología">Tecnología</SelectItem>
              </SelectContent>
            </Select>
          </div>


          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEdit ? "Actualizando..." : "Agregando..."}
                </>
              ) : (
                isEdit ? "Actualizar" : "Agregar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
