# 🗺️ FusaMaps – Panel de Administración

Panel web para administradores del sistema FusaMaps.

## Cómo correr

```bash
# 1. Instalar dependencias (solo la primera vez)
npm install

# 2. Correr en desarrollo
npm run dev
```

Abre en el navegador: http://localhost:5173

## Credenciales

```
Email:    admin@fusamaps.co
Contraseña: password
```

> El backend debe estar corriendo en localhost:3000 antes de abrir el panel.

## Módulos disponibles

| Módulo | Ruta | Descripción |
|--------|------|-------------|
| Dashboard | / | Estadísticas y actividad reciente |
| Usuarios | /usuarios | Ver, activar/desactivar, cambiar roles |
| Rutas | /rutas | CRUD de rutas de transporte |
| Paraderos | /paraderos | CRUD de paraderos |
| Alertas | /alertas | Publicar y gestionar alertas |
| Conductores | /conductores | Registrar y gestionar conductores |
| Reportes | /reportes | Ver reportes de ciudadanos |
| Configuración | /configuracion | Parámetros del sistema |

## Requisitos

- Node.js 18+
- Backend FusaMaps corriendo en localhost:3000
- Usuario con rol: admin_municipal o super_admin
