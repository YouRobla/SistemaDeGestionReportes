import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  User, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Download,
  Eye,
  Image as ImageIcon,
  File
} from 'lucide-react';
import type { Report } from '@/types';
import type { Action } from '@/types/actions';

interface ReportAnalyzerProps {
  report: Report;
  actions: Action[];
  onGeneratePDF: () => void;
  onPreviewPDF: () => void;
  loading?: boolean;
}

export function ReportAnalyzer({ 
  report, 
  actions, 
  onGeneratePDF, 
  onPreviewPDF, 
  loading = false 
}: ReportAnalyzerProps) {
  
  // 🎯 Análisis del reporte
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'SinRevisar': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'EnProceso': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Revisado': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'SinRevisar': return <Clock className="w-4 h-4" />;
      case 'EnProceso': return <AlertTriangle className="w-4 h-4" />;
      case 'Revisado': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTipoReporteColor = (tipo: string) => {
    switch (tipo) {
      case 'Condición Insegura': return 'bg-red-100 text-red-800 border-red-200';
      case 'Acto Inseguro': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Cuasi Accidente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Incidente de Seguridad': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 📊 Métricas del reporte
  const totalEvidencias = report.evidencias?.length || 0;
  const totalAcciones = actions?.length || 0;
  const diasTranscurridos = Math.floor(
    (new Date().getTime() - new Date(report.fecha_registro).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      {/* 🎯 Header del Reporte */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-800">
                  Reporte #{report.numero_registro}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(report.fecha_registro).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${getEstadoColor(report.estado)} border`}>
                {getEstadoIcon(report.estado)}
                <span className="ml-1">{report.estado}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 📊 Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-200 rounded-lg">
                <ImageIcon className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-800">{totalEvidencias}</p>
                <p className="text-sm text-blue-600">Evidencias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-800">{totalAcciones}</p>
                <p className="text-sm text-green-600">Acciones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-200 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-800">{diasTranscurridos}</p>
                <p className="text-sm text-purple-600">Días</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-800">{report.tipo_reporte}</p>
                <p className="text-sm text-orange-600">Tipo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 📋 Información Detallada */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 📄 Información del Documento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-blue-600" />
              Información del Documento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Tipo de Documento</p>
                <p className="text-sm text-gray-800">{report.tipo_documento}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Nro. Documento</p>
                <p className="text-sm text-gray-800">{report.numero_documento}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sede</p>
              <p className="text-sm text-gray-800">{report.sede || 'SIN_SEDE'}</p>
            </div>
          </CardContent>
        </Card>

        {/* 🏢 Información del Incidente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-red-600" />
              Detalles del Incidente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Tipo de Reporte</p>
              <Badge className={`${getTipoReporteColor(report.tipo_reporte)} border mt-1`}>
                {report.tipo_reporte}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Lugar del Incidente</p>
              <p className="text-sm text-gray-800">{report.lugar_incidente}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 📝 Descripción del Incidente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-gray-600" />
            Descripción del Incidente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-800 leading-relaxed">
              {report.descripcion_observacion}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 📋 Acciones Tomadas al Momento (si existe) */}
      {report.acciones_tomadas && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              Acciones Tomadas al Momento del Reporte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-800 leading-relaxed">
                {report.acciones_tomadas}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 🎯 Acciones Tomadas */}
      {actions && actions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Acciones Tomadas ({actions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actions.map((action, index) => (
                <div key={action.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-700">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {action.descripcion}
                      </p>
                      {action.evidencias && action.evidencias.length > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <File className="w-4 h-4 text-gray-500" />
                          <span className="text-xs text-gray-600">
                            {action.evidencias.length} evidencia(s) adjunta(s)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 📎 Evidencias */}
      {report.evidencias && report.evidencias.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              Evidencias Adjuntas ({report.evidencias.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.evidencias.map((evidencia, index) => (
                <div key={evidencia.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-800 truncate">
                      Evidencia {index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 🎯 Acciones de Generación */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Generar Reporte Completo
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Crea un PDF detallado con toda la información del reporte y acciones tomadas
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onPreviewPDF}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Vista Previa
              </Button>
              <Button
                onClick={onGeneratePDF}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                {loading ? 'Generando...' : 'Descargar PDF'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
