# Salon Insights

Una aplicación web profesional diseñada para registrar, clasificar y reportar consultas de clientes recibidas a través de diferentes canales (WhatsApp y Llamadas), optimizando la gestión de ventas para equipos comerciales.

## 🚀 Características Principales

- **Registro Eficiente:** Formularios optimizados para consultas por WhatsApp y Llamadas.
- **Autocompletado Inteligente:** Los datos del vendedor y el salón se cargan automáticamente según el usuario que inició sesión.
- **Panel de Control (Admin):** Acceso exclusivo para administradores con visualización de reportes.
- **Filtros Avanzados:** Filtrado potente por rango de fechas, salón específico, canal de origen y estado del interés.
- **Exportación a CSV:** Permite descargar los registros filtrados para trabajar en Excel o Google Sheets.
- **Seguridad:** Autenticación robusta con Firebase y roles de usuario (Admin/Vendedor).

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS, ShadCN UI.
- **Backend:** Firebase (Firestore y Authentication).
- **Iconografía:** Lucide React.
- **Despliegue:** Vercel.

## 📋 Configuración

Para ejecutar este proyecto localmente:

1. Clona el repositorio.
2. Instala las dependencias: `npm install`.
3. Configura tus credenciales de Firebase en el archivo `src/lib/firebase.ts`.
4. Inicia el servidor de desarrollo: `npm run dev`.

## 🌐 Despliegue

La aplicación está configurada para despliegue continuo en Vercel. Recuerda configurar las variables de entorno en el panel de Vercel para una conexión segura con Firebase.
