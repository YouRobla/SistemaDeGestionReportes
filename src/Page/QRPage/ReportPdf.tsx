// ReportPdf.tsx
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12, fontFamily: "Helvetica" },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  section: { marginBottom: 12, padding: 10, border: "1pt solid #ccc", borderRadius: 8 },
  label: { fontWeight: "bold", color: "#555" },
  value: { marginTop: 2, marginBottom: 4, color: "#333" },
  evidenceImage: { width: 120, height: 80, marginRight: 5, marginBottom: 5, borderRadius: 4 }
})

export function ReportPdf({ report }: { report: any }) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Reporte de Actos y Condiciones Inseguras</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Registro:</Text>
          <Text style={styles.value}>{report.registro}</Text>

          <Text style={styles.label}>Reportante:</Text>
          <Text style={styles.value}>{report.reportante}</Text>

          <Text style={styles.label}>DNI:</Text>
          <Text style={styles.value}>{report.dni}</Text>

          <Text style={styles.label}>Correo:</Text>
          <Text style={styles.value}>{report.correo}</Text>

          <Text style={styles.label}>Área:</Text>
          <Text style={styles.value}>{report.area}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Tipo de Reporte:</Text>
          <Text style={styles.value}>{report.tipo}</Text>

          <Text style={styles.label}>Relacionado a:</Text>
          <Text style={styles.value}>{report.relacionado}</Text>

          <Text style={styles.label}>Ocurrió en:</Text>
          <Text style={styles.value}>{report.ocurrioEn}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Observación:</Text>
          <Text style={styles.value}>{report.observacion}</Text>

          <Text style={styles.label}>Acciones:</Text>
          <Text style={styles.value}>{report.acciones}</Text>
        </View>

        {report.evidencia && report.evidencia.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Evidencia:</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 5 }}>
              {report.evidencia.map((img: string, i: number) => (
                <Image key={i} style={styles.evidenceImage} src={img} />
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  )
}
