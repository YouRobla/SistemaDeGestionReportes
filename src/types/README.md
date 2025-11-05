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
  sede: string; // ✅ NUEVO - Reemplaza area_texto (ej: "CFP HUANCAYO")
  tipo_reporte: string;
  lugar_incidente: string;
  descripcion_observacion: string;
  acciones_tomadas?: string; // ✅ NUEVO - Campo opcional
  estado: "SinRevisar" | "EnProceso" | "Revisado";
  fecha_registro: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  evidencias: {
    id: number;
    url: string;
    reporteId: number;
    accionId: number | null;
  }[];
  acciones: any[];
};
```

### ⚠️ Cambios Importantes (2025-11-05)

#### Campos Eliminados:
- ❌ `nombre_completo` - Ya no se solicita en el formulario
- ❌ `correo_institucional` - Ya no se solicita en el formulario
- ❌ `nombre_reportante` - Ya no se solicita en el formulario
- ❌ `area_texto` - Reemplazado por `sede`
- ❌ `relacionado_con` - Ya no se requiere esta categorización

#### Campos Nuevos:
- ✅ `sede` (String, requerido) - Reemplaza `area_texto`, más específico
- ✅ `acciones_tomadas` (String, opcional) - Nuevo campo opcional
