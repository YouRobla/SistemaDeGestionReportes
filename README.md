# Sistema de Incidencias SENATI · Frontend

Panel web para registrar y dar seguimiento a los reportes de incidencias de seguridad (actos y condiciones subestándar) de SENATI Huancayo. Digitalizó un registro que antes era manual.

> Proyecto académico desarrollado junto a mi instructor, con reconocimiento institucional de SENATI.
> API: **[Backend-Reporte](https://github.com/YouRobla/Backend-Reporte)**

## Funcionalidades

- Tabla de reportes con su estado de revisión (TanStack Table).
- Seguimiento de cada reporte: evidencias fotográficas y acciones tomadas.
- Generación de reportes en PDF.
- Generación de códigos QR.
- Gestión de los destinatarios que reciben las notificaciones por correo.

## Stack

![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat&logo=shadcnui&logoColor=white)

TanStack Table · React Router · React PDF / jsPDF · Radix UI · date-fns

## Estructura

```
src/
├── Page/         # vistas: reportes, generador de QR, destinatarios de correo
├── components/   # UI reutilizable y generador de reportes
├── hooks/        # useReports, useReportPDF, useProfesores, useActions
├── config/       # cliente de la API
└── layouts/      # layout principal con sidebar
```

## Ejecutar en local

```bash
npm install
cp env.example .env   # define VITE_API_BASE_URL con la URL de la API
npm run dev
```
