# 🗺️ FusaMaps – M01 Autenticación

## Cómo ejecutar

### 1. Abrir Docker Desktop y esperar a que esté verde

### 2. Abrir terminal en esta carpeta y correr:
```
docker-compose up --build
```
Esperar hasta ver:
```
🚌 FusaMaps API corriendo en http://172.18.4.168:3000
```

### 3. Verificar en el navegador:
```
http://172.18.4.168:3000/health
→ {"status":"ok","app":"FusaMaps API"}
```

### 4. Probar con Postman:
- Importar el archivo: backend/docs/M01_Postman.json
- Ejecutar en orden: Registro → Login → Mi perfil

## Credenciales de prueba (admin ya creado)
- Email: admin@fusamaps.co
- Contraseña: password

## Endpoints disponibles
| Método | Ruta                        | Descripción              |
|--------|-----------------------------|--------------------------|
| POST   | /api/auth/register          | Crear cuenta             |
| POST   | /api/auth/login             | Iniciar sesión           |
| POST   | /api/auth/refresh           | Renovar token            |
| POST   | /api/auth/logout            | Cerrar sesión            |
| POST   | /api/auth/forgot-password   | Recuperar contraseña     |
| POST   | /api/auth/reset-password    | Restablecer contraseña   |
| GET    | /api/auth/me                | Ver mi perfil            |
| PUT    | /api/auth/me                | Actualizar perfil        |
| PUT    | /api/auth/change-password   | Cambiar contraseña       |

## Apagar
```
Ctrl + C  (para el servidor)
docker-compose down
```
