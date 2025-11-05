import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { Report } from '@/types';
import type { Action } from '@/types/actions';

// 🎨 Estilos del PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
    minHeight: '100vh',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '2 solid #3B82F6',
  },
  headerLeft: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 5,
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
    backgroundColor: '#D1FAE5',
    padding: '8 12',
    borderRadius: 4,
  },
  section: {
    marginBottom: 15,
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
    minHeight: 50,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    backgroundColor: '#F3F4F6',
    padding: 6,
    borderRadius: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
    minHeight: 40,
  },
  gridItem: {
    width: '48%',
    marginBottom: 8,
    breakInside: 'avoid',
  },
  label: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 10,
    color: '#1F2937',
    lineHeight: 1.3,
  },
  description: {
    fontSize: 10,
    color: '#1F2937',
    lineHeight: 1.4,
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 4,
    border: '1 solid #E5E7EB',
  },
  actionItem: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 4,
    border: '1 solid #BBF7D0',
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
    minHeight: 60,
  },
  actionNumber: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 10,
    color: '#1F2937',
    lineHeight: 1.4,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
    minHeight: 100,
  },
  imageContainer: {
    width: '48%',
    marginBottom: 10,
    padding: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 4,
    border: '1 solid #E5E7EB',
    alignItems: 'center',
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
    minHeight: 120,
  },
  imageTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  reportImage: {
    width: '100%',
    height: 80,
    objectFit: 'contain',
    marginBottom: 6,
    borderRadius: 4,
  },
  simpleLink: {
    fontSize: 9,
    color: '#3B82F6',
    marginBottom: 4,
    fontFamily: 'Courier',
    wordBreak: 'break-word',
  },
  simpleEvidenceList: {
    marginBottom: 15,
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
    minHeight: 30,
  },
  simpleEvidenceItem: {
    fontSize: 9,
    color: '#3B82F6',
    marginBottom: 3,
    fontFamily: 'Courier',
    wordBreak: 'break-word',
  },
  evidenceContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 4,
    border: '1 solid #BBF7D0',
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
    minHeight: 40,
  },
  evidenceTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 5,
  },
  evidenceUrl: {
    fontSize: 9,
    color: '#3B82F6',
    marginBottom: 3,
    fontFamily: 'Courier',
    wordBreak: 'break-word',
  },
  noEvidenceText: {
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 4,
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
    minHeight: 60,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  metricLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#9CA3AF',
    borderTop: '1 solid #E5E7EB',
    paddingTop: 10,
  },
});

interface PDFGeneratorProps {
  report: Report;
  actions: Action[];
}

export function PDFGenerator({ report, actions }: PDFGeneratorProps) {
  // 📊 Cálculos para métricas
  const totalEvidencias = report.evidencias?.length || 0;
  const totalAcciones = actions?.length || 0;
  const diasTranscurridos = Math.floor(
    (new Date().getTime() - new Date(report.fecha_registro).getTime()) / (1000 * 60 * 60 * 24)
  );

  // 🎯 Función para formatear fechas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 🎯 Función para obtener color del estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'SinRevisar': return '#F59E0B';
      case 'EnProceso': return '#3B82F6';
      case 'Revisado': return '#059669';
      default: return '#6B7280';
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 🎯 Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Reporte de Seguridad</Text>
            <Text style={styles.subtitle}>Sistema de Gestión de Reportes</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.subtitle}>#{report.numero_registro}</Text>
            <Text style={[styles.status, { color: getEstadoColor(report.estado) }]}>
              {report.estado}
            </Text>
          </View>
        </View>

        {/* 📊 Métricas */}
        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{totalEvidencias}</Text>
            <Text style={styles.metricLabel}>Evidencias</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{totalAcciones}</Text>
            <Text style={styles.metricLabel}>Acciones</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{diasTranscurridos}</Text>
            <Text style={styles.metricLabel}>Días Transcurridos</Text>
          </View>
        </View>

        {/* 🖼️ Imágenes del Reporte */}
        {report.evidencias && report.evidencias.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Imágenes del Reporte</Text>
            <View style={styles.imageGrid}>
              {report.evidencias.map((evidencia, index) => (
                <View key={evidencia.id} style={styles.imageContainer}>
                  <Text style={styles.imageTitle}>Imagen {index + 1}</Text>
                  <Image 
                    src={evidencia.url} 
                    style={styles.reportImage}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 👤 Información del Documento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Documento</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Tipo de Documento</Text>
              <Text style={styles.value}>{report.tipo_documento}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Número de Documento</Text>
              <Text style={styles.value}>{report.numero_documento}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Sede</Text>
              <Text style={styles.value}>{report.sede || 'SIN_SEDE'}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Fecha de Registro</Text>
              <Text style={styles.value}>{formatDate(report.fecha_registro)}</Text>
            </View>
          </View>
        </View>

        {/* 🏢 Información del Incidente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles del Incidente</Text>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Tipo de Reporte</Text>
              <Text style={styles.value}>{report.tipo_reporte}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Lugar del Incidente</Text>
              <Text style={styles.value}>{report.lugar_incidente}</Text>
            </View>
          </View>
        </View>

        {/* 📝 Descripción del Incidente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción del Incidente</Text>
          <Text style={styles.description}>{report.descripcion_observacion}</Text>
        </View>

        {/* 📋 Acciones Tomadas al Momento (si existe) */}
        {report.acciones_tomadas && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acciones Tomadas al Momento del Reporte</Text>
            <Text style={styles.description}>{report.acciones_tomadas}</Text>
          </View>
        )}

        {/* 🎯 Acciones Tomadas */}
        {actions && actions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acciones Tomadas ({actions.length})</Text>
            {actions.map((action, index) => (
              <View key={action.id} style={styles.actionItem}>
                <Text style={styles.actionNumber}>Acción {index + 1}</Text>
                <Text style={styles.actionDescription}>{action.descripcion}</Text>
                
                {/* Evidencias de la acción */}
                {action.evidencias && action.evidencias.length > 0 ? (
                  <View style={styles.evidenceContainer}>
                    <Text style={styles.evidenceTitle}>Evidencias adjuntas:</Text>
                    {action.evidencias.map((evidencia) => (
                      <Text key={evidencia.id} style={styles.evidenceUrl}>
                        • {evidencia.url}
                      </Text>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noEvidenceText}>
                    Ninguna evidencia fue registrada para esta acción.
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* 📎 Evidencias del Reporte */}
        {report.evidencias && report.evidencias.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Evidencias del Reporte ({report.evidencias.length})</Text>
            {report.evidencias.map((evidencia, index) => (
              <Text key={evidencia.id} style={styles.simpleLink}>
                • Evidencia {index + 1}: {evidencia.url}
              </Text>
            ))}
          </View>
        )}


        {/* 📋 Lista de Todas las Evidencias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Todas las Evidencias ({totalEvidencias})</Text>
          
          {/* Evidencias del Reporte */}
          {report.evidencias && report.evidencias.length > 0 && (
            <View style={styles.simpleEvidenceList}>
              {report.evidencias.map((evidencia, index) => (
                <Text key={evidencia.id} style={styles.simpleEvidenceItem}>
                  {index + 1}. {evidencia.url}
                </Text>
              ))}
            </View>
          )}

          {/* Evidencias de las Acciones */}
          {actions && actions.length > 0 && actions.some(action => action.evidencias && action.evidencias.length > 0) && (
            <View style={styles.simpleEvidenceList}>
            {actions.map((action) => (
              action.evidencias && action.evidencias.length > 0 && 
              action.evidencias.map((evidencia, index) => (
                <Text key={evidencia.id} style={styles.simpleEvidenceItem}>
                  {report.evidencias?.length + index + 1}. {evidencia.url}
                </Text>
              ))
            ))}
            </View>
          )}
        </View>

        {/* 🎯 Footer */}
        <Text style={styles.footer}>
          Reporte generado el {new Date().toLocaleDateString('es-ES')} - 
          Sistema de Gestión de Reportes de Seguridad
        </Text>
      </Page>
    </Document>
  );
}
