# Hooks

Esta carpeta contiene hooks personalizados para manejar la lógica de negocio de la aplicación.

## useReports

Hook optimizado para manejar la lógica de reportes con debounce integrado:

- ✅ Carga de datos desde el backend
- ✅ Paginación optimizada
- ✅ Filtros por estado
- ✅ Búsqueda con debounce (500ms)
- ✅ Manejo de estados de carga y errores
- ✅ Rendimiento optimizado

### Uso

```tsx
import { useReports } from '@/hooks';

const MyComponent = () => {
  const {
    data,
    loading,
    error,
    pagination,
    searchValue,
    setPage,
    setPageSize,
    setEstadoFilter,
    setSearch,
    refetch
  } = useReports();

  // ... resto del componente
};
```

### API

- `data`: Array de reportes
- `loading`: Estado de carga
- `error`: Error si existe
- `pagination`: Información de paginación
- `searchValue`: Valor actual de búsqueda
- `setPage(page)`: Cambiar página
- `setPageSize(limit)`: Cambiar tamaño de página
- `setEstadoFilter(estado)`: Filtrar por estado
- `setSearch(search)`: Buscar por texto (con debounce)
- `refetch()`: Recargar datos
