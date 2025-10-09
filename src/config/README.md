# 🚀 Configuración de la API

## 📋 Variables de Entorno

Para configurar la URL de la API, crea un archivo `.env` en la raíz del proyecto:

```bash
# .env
VITE_API_BASE_URL=http://localhost:3000
```

## 🌍 Configuraciones por Ambiente

### 🔧 Desarrollo Local
```bash
VITE_API_BASE_URL=http://localhost:3000
```

### 🚀 Producción
```bash
VITE_API_BASE_URL=https://tu-dominio.com
```

### 🧪 Testing
```bash
VITE_API_BASE_URL=http://localhost:3001
```

## 📝 Cómo Usar

1. **Crear archivo `.env`** en la raíz del proyecto
2. **Agregar la variable** `VITE_API_BASE_URL` con tu URL
3. **Reiniciar el servidor** de desarrollo

## 🔄 Ejemplo de Configuración

```bash
# .env
VITE_API_BASE_URL=https://api.mi-sistema.com
```

## ⚠️ Importante

- Las variables de entorno en Vite deben empezar con `VITE_`
- Reinicia el servidor después de cambiar las variables
- No subas el archivo `.env` al repositorio (ya está en `.gitignore`)
