"use client";

import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, MapPin, Calendar, FileText, AlertTriangle, Image} from "lucide-react";
import { InfoField } from "@/components/InfoField";
import { ActionsDialog} from "../Actions/ActionsDialog";
import type { Report } from "@/types";

interface ReportDialogDesktopProps {
  report: Report;
  setOpenEvidencia: (open: boolean) => void;
  setSelectedImage: (index: number) => void;
  showActionsButton?: boolean; // 🚀 Nueva prop para controlar el botón de acciones
}

export function ReportDialogDesktop({ report, setOpenEvidencia, setSelectedImage, showActionsButton = false}: ReportDialogDesktopProps) {
  return (
    <DialogContent className="bg-white md:min-w-[90vw] max-w-[1200px] max-h-[80vh] p-6 overflow-auto">
      <DialogHeader className="mt-4">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-xl font-bold">Reporte de Actos y Condiciones Inseguras</DialogTitle>
          {/* 🚀 Solo mostrar botón de acciones si showActionsButton es true */}
          {showActionsButton && <ActionsDialog reportId={report.id}/>}
        </div>
      </DialogHeader>

      <div className="space-y-4 mt-4">
        {/* Header con registro y tipo */}
        <div className="flex items-center justify-between bg-gradient-to-r from-red-50 via-orange-50 to-red-50 p-3 rounded-lg border-l-4 border-red-600 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold">REGISTRO</p>
              <p className="text-xl font-bold text-gray-900">#{report.numero_registro}</p>
            </div>
          </div>
          <Badge variant="destructive" className="text-sm px-5 py-1.5 font-bold">
            {report.tipo_reporte?.toUpperCase() || 'SIN TIPO'}
          </Badge>
        </div>

        {/* Grid de información */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
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
        </div>

        {/* Observación */}
        <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-gray-600" />
            <h3 className="font-bold text-sm text-gray-800">OBSERVACIÓN</h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{report.descripcion_observacion || 'Sin descripción'}</p>
        </div>

        {/* Evidencia Fotográfica */}
        <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-gray-600" />
              <h3 className="font-bold text-sm text-gray-800">EVIDENCIA FOTOGRÁFICA</h3>
              <Badge variant="outline" className="text-xs font-semibold">{report.evidencias?.length || 0} imágenes</Badge>
            </div>
            <Button 
              onClick={() => setOpenEvidencia(true)} 
              variant="outline" 
              size="sm"
              className="font-semibold"
            >
              Ver en grande
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {report.evidencias?.map((evidencia, i: number) => (
              <div
                key={i}
                className="relative aspect-square rounded-lg border border-gray-300 overflow-hidden cursor-pointer hover:border-gray-400 bg-white shadow-sm"
                onClick={() => { setSelectedImage(i); setOpenEvidencia(true) }}
              >
                <img 
                  src={evidencia.url} 
                  alt={`Evidencia ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-gray-700 text-white px-2 py-0.5 rounded text-xs font-bold">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
