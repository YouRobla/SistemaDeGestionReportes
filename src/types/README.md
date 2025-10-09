# Types

Esta carpeta contiene las definiciones de tipos TypeScript para la aplicación.

## report.ts

Define los tipos relacionados con los reportes:

- `Report`: Estructura de un reporte individual
- `ApiResponse`: Respuesta completa de la API
- `ReportFilters`: Filtros disponibles para la búsqueda

### Estructura de Report

```typescript
type Report = {
  id: number;
  numero_registro: string;
  tipo_documento: string;
  numero_documento: string;
  nombre_completo: string;
  correo_institucional: string;
  nombre_reportante: string;
  area_texto: string;
  tipo_reporte: string;
  relacionado_con: string;
  lugar_incidente: string;
  descripcion_observacion: string;
  estado: "SinRevisar" | "EnProceso" | "Revisado";
  fecha_registro: string;
  evidencias: any[];
  acciones: any[];
};
```
