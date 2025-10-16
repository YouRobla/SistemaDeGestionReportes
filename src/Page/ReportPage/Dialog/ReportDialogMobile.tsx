"use client";

import { DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Mail, MapPin, Calendar, FileText,Image } from "lucide-react";
import { InfoField } from "../../../components/InfoField";
import { ActionsDialog } from "../Actions/ActionsDialog";
import type { Report } from "@/types";

interface ReportDialogMobileProps {
  report: Report;
  setOpenEvidencia: (open: boolean) => void;
  setSelectedImage: (index: number) => void;
  showActionsButton?: boolean; // 🚀 Nueva prop para controlar el botón de acciones
}

export function ReportDialogMobile({ report, setOpenEvidencia, setSelectedImage, showActionsButton = false }: ReportDialogMobileProps) {
  return (
    <DialogContent className="bg-white w-full max-h-[90vh] mt-2 p-4 overflow-auto">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle className="text-lg font-bold">Reporte (Versión Móvil)</DialogTitle>
        </div>
        {/* 🚀 Solo mostrar botón de acciones si showActionsButton es true */}
        {showActionsButton && <ActionsDialog 
          reportId={report.id}
          report={{
            fecha_inicio: (report as any).fecha_inicio,
            fecha_fin: (report as any).fecha_fin,
            estado: report.estado
          }}
        />}
      </DialogHeader>

      <div className="space-y-3 mt-2">
        {/* Información principal */}
        <div className="grid grid-cols-1 gap-3">
          <InfoField icon={<User className="h-4 w-4" />} label="Reporte" value={report.numero_registro || 'N/A'} />
          <InfoField icon={<User className="h-4 w-4" />} label="Reportante" value={report.nombre_reportante || 'N/A'} />
          <InfoField icon={<User className="h-4 w-4" />} label="DNI" value={report.numero_documento || 'N/A'} />
          <InfoField icon={<Mail className="h-4 w-4" />} label="Correo" value={report.correo_institucional || 'N/A'} />
          <InfoField icon={<MapPin className="h-4 w-4" />} label="DZ/Área" value={report.area_texto || 'N/A'} />
          <InfoField icon={<FileText className="h-4 w-4" />} label="Relacionado" value={report.relacionado_con || 'N/A'} />
          <InfoField icon={<Calendar className="h-4 w-4" />} label="Fecha" value={new Date(report.fecha_registro).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }) || 'N/A'} />
        </div>

        {/* Observación */}
        <div className="border rounded-lg p-3 bg-gray-50">
          <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1">
            <FileText className="h-4 w-4 text-gray-600" /> OBSERVACIÓN
          </h3>
          <p className="text-sm text-gray-700 mt-1">{report.descripcion_observacion || 'Sin descripción'}</p>
        </div>

        {/* Evidencia Fotográfica */}
        <div className="border rounded-lg p-3 bg-gray-50">
          <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1">
            <Image className="h-5 w-5 text-gray-600" /> Evidencia ({report.evidencias?.length || 0})
          </h3>
          <div className="grid grid-cols-2 gap-3 mt-3 overflow-x-auto">
            {report.evidencias?.map((evidencia, i: number) => (
              <div
                key={i}
                className="relative aspect-square rounded-lg border border-gray-300 overflow-hidden cursor-pointer"
                onClick={() => { setSelectedImage(i); setOpenEvidencia(true); }}
              >
                <img 
                  src={evidencia.url} 
                  alt={`Evidencia ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-gray-700 text-white px-2 py-1 rounded text-xs font-bold">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DialogClose asChild>
        <Button className="w-full mt-4">Cerrar</Button>
      </DialogClose>
    </DialogContent>
  );
}
