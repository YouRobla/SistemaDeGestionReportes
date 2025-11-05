# 📋 Resumen de Campos Eliminados del Formulario

## 🗑️ **Campos Eliminados del Modelo `Reporte`**

### **1. Campos de Información del Reportante (Eliminados)**

#### ❌ **`correo_institucional`**
- **Tipo:** `String` (requerido)
- **Ubicación:** Tabla `Reporte`
- **Descripción:** Campo de correo electrónico institucional del reportante
- **Razón de eliminación:** Ya no se requiere en el nuevo formulario
- **Impacto:** 
  - ❌ Eliminado del schema de Prisma
  - ❌ Eliminado de validaciones (ReporteSchema.ts)
  - ❌ Eliminado de EmailService (plantillas HTML y texto)
  - ❌ Eliminado de la base de datos (migración)

#### ❌ **`nombre_completo`**
- **Tipo:** `String` (requerido)
- **Ubicación:** Tabla `Reporte`
- **Descripción:** Nombre completo del reportante
- **Razón de eliminación:** Simplificación del formulario
- **Impacto:**
  - ❌ Eliminado del schema de Prisma
  - ❌ Eliminado de validaciones (ReporteSchema.ts)
  - ❌ Eliminado de EmailService (plantillas HTML y texto)
  - ❌ Eliminado de la base de datos (migración)

#### ❌ **`nombre_reportante`**
- **Tipo:** `String` (requerido)
- **Ubicación:** Tabla `Reporte`
- **Descripción:** Nombre del reportante (distinto del nombre completo)
- **Razón de eliminación:** Redundancia, simplificación del formulario
- **Impacto:**
  - ❌ Eliminado del schema de Prisma
  - ❌ Eliminado de validaciones (ReporteSchema.ts)
  - ❌ Eliminado de EmailService (plantillas HTML y texto)
  - ❌ Eliminado de la base de datos (migración)

### **2. Campos de Categorización (Eliminados)**

#### ❌ **`area_texto`**
- **Tipo:** `String` (requerido)
- **Ubicación:** Tabla `Reporte`
- **Descripción:** Área en texto libre donde se reporta el incidente
- **Razón de eliminación:** Reemplazado por `sede` (más específico)
- **Reemplazo:** `sede` (String, requerido)
- **Impacto:**
  - ❌ Eliminado del schema de Prisma
  - ❌ Eliminado de validaciones (ReporteSchema.ts)
  - ❌ Eliminado de MetricasController (usado `sede` en su lugar)
  - ❌ Eliminado de EmailService (plantillas HTML y texto)
  - ❌ Eliminado de la base de datos (migración)
  - ✅ Reemplazado por `sede` en todos los lugares

#### ❌ **`relacionado_con`**
- **Tipo:** `String` (requerido)
- **Ubicación:** Tabla `Reporte`
- **Descripción:** Campo de categoría relacionada al incidente
- **Razón de eliminación:** Ya no se requiere esta categorización
- **Impacto:**
  - ❌ Eliminado del schema de Prisma
  - ❌ Eliminado de validaciones (ReporteSchema.ts)
  - ❌ Eliminado de MetricasController (ya no se agrupa por este campo)
  - ❌ Eliminado de EmailService (plantillas HTML y texto)
  - ❌ Eliminado de la base de datos (migración)

---

## ✅ **Campos Nuevos Agregados**

### **1. `sede`**
- **Tipo:** `String` (requerido)
- **Ubicación:** Tabla `Reporte`
- **Descripción:** Sede seleccionada (ej: "CFP HUANCAYO")
- **Reemplaza:** `area_texto`
- **Valor por defecto para datos existentes:** `'SIN_SEDE'`

### **2. `acciones_tomadas`**
- **Tipo:** `String?` (opcional)
- **Ubicación:** Tabla `Reporte`
- **Descripción:** Acciones tomadas al momento (solo si se completa en el formulario)
- **Nuevo campo:** No reemplaza ninguno

---

## 📊 **Resumen Comparativo**

### **Antes (Estructura Antigua)**
```typescript
{
  // Información del Reportante
  nombre_completo: string          // ❌ ELIMINADO
  correo_institucional: string      // ❌ ELIMINADO
  nombre_reportante: string         // ❌ ELIMINADO
  area_texto: string               // ❌ ELIMINADO → Reemplazado por sede
  
  // Categorización
  relacionado_con: string           // ❌ ELIMINADO
  
  // Información del Reporte
  tipo_documento: string           // ✅ MANTENIDO
  numero_documento: string          // ✅ MANTENIDO
  tipo_reporte: string              // ✅ MANTENIDO
  lugar_incidente: string           // ✅ MANTENIDO
  descripcion_observacion: string   // ✅ MANTENIDO
}
```

### **Ahora (Estructura Nueva)**
```typescript
{
  // Información del Reportante
  tipo_documento: string            // ✅ MANTENIDO
  numero_documento: string          // ✅ MANTENIDO
  sede: string                      // ✅ NUEVO (reemplaza area_texto)
  
  // Información del Reporte
  tipo_reporte: string              // ✅ MANTENIDO
  lugar_incidente: string           // ✅ MANTENIDO
  descripcion_observacion: string   // ✅ MANTENIDO
  acciones_tomadas?: string         // ✅ NUEVO (opcional)
}
```

---

## 🔧 **Archivos Modificados**

### **1. Base de Datos**
- ✅ `prisma/schema.prisma` - Modelo `Reporte` actualizado
- ✅ `prisma/migrations/20251105141238_actualizar_estructura_formulario/migration.sql` - Migración creada

### **2. Validaciones**
- ✅ `src/schemas/ReporteSchema.ts` - Schema de Zod actualizado

### **3. Controladores**
- ✅ `src/controllers/MetricasController.ts` - Actualizado para usar `sede` en lugar de `area_texto`
- ✅ `src/controllers/ReporteCompletoController.ts` - Ya usa el nuevo schema

### **4. Modelos**
- ✅ `src/models/ReporteModel.ts` - Filtros actualizados (sede, tipo_reporte)

### **5. Servicios**
- ✅ `src/services/EmailService.ts` - Plantillas HTML y texto actualizadas

### **6. Middlewares**
- ✅ `src/middlewares/upload.ts` - Límite de archivos actualizado (5 → 3)

### **7. Rutas**
- ✅ `src/routes/reporteCompletoRoutes.ts` - Límite de evidencias actualizado (10 → 3)

---

## 📝 **Datos del Formulario Actual**

### **Campos que se envían actualmente:**
```javascript
{
  tipo_documento: "DNI",                    // ✅ REQUERIDO
  numero_documento: "12345678",             // ✅ REQUERIDO
  sede: "CFP HUANCAYO",                     // ✅ REQUERIDO (NUEVO)
  tipo_reporte: "Acto Subestándar",          // ✅ REQUERIDO
  lugar_incidente: "Aula 201",              // ✅ REQUERIDO
  descripcion_observacion: "...",            // ✅ REQUERIDO
  acciones_tomadas: "...",                  // ⚪ OPCIONAL (NUEVO)
  evidencias: [File, File, File]            // ✅ REQUERIDO (máximo 3)
}
```

---

## 🗄️ **Migración de Datos**

### **Proceso de Migración:**
1. ✅ Se agregan nuevas columnas como opcionales (`sede`, `acciones_tomadas`)
2. ✅ Se rellenan valores existentes de `sede` con `'SIN_SEDE'`
3. ✅ Se eliminan columnas antiguas (`area_texto`, `correo_institucional`, `nombre_completo`, `nombre_reportante`, `relacionado_con`)
4. ✅ Se hace `sede` requerida (NOT NULL)

### **⚠️ Advertencia:**
Los datos en las columnas eliminadas se perderán permanentemente:
- `correo_institucional` → ❌ Perdido
- `nombre_completo` → ❌ Perdido
- `nombre_reportante` → ❌ Perdido
- `area_texto` → ❌ Perdido (pero se reemplaza por `sede` con valor `'SIN_SEDE'`)
- `relacionado_con` → ❌ Perdido

---

## 📈 **Impacto en Métricas**

### **Antes:**
- Agrupación por `area_texto` → Eliminada
- Agrupación por `relacionado_con` → Eliminada

### **Ahora:**
- Agrupación por `sede` → ✅ Nuevo
- Agrupación por `lugaresIncidente` → ✅ Nuevo (basado en `lugar_incidente`)

---

## ✨ **Resumen Final**

| Campo Eliminado | Tipo | Reemplazo | Impacto |
|----------------|------|-----------|---------|
| `correo_institucional` | String | ❌ Ninguno | Datos perdidos |
| `nombre_completo` | String | ❌ Ninguno | Datos perdidos |
| `nombre_reportante` | String | ❌ Ninguno | Datos perdidos |
| `area_texto` | String | ✅ `sede` | Datos migrados a `sede` con valor `'SIN_SEDE'` |
| `relacionado_con` | String | ❌ Ninguno | Datos perdidos |

**Total de campos eliminados:** 5
**Total de campos nuevos:** 2 (`sede`, `acciones_tomadas`)
**Campos mantenidos:** 5 (`tipo_documento`, `numero_documento`, `tipo_reporte`, `lugar_incidente`, `descripcion_observacion`)

