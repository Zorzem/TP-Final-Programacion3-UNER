# Sistema de Gestión de Reservas

## Trabajo Final Integrador – Programación 3

**Tecnicatura Universitaria en Desarrollo Web**  
Facultad de Ciencias de la Administración – UNER  
Segundo cuatrimestre 2025

---

## 📋 Descripción del Proyecto

API RESTful para la gestión de servicios en un sistema de reservas. Desarrollada con Node.js y Express, implementa una arquitectura en capas (MVC) con separación de responsabilidades entre controladores, servicios y acceso a datos.

## 👥 Integrantes del Grupo

| Nombre | Usuario GitHub |
|--------|----------------|
| Boris Kovalow | [@Zorzem](https://github.com/Zorzem) |
| Giuliano Daniele | [@Vitruviansky](https://github.com/Vitruviansky) |
| Jose Herrera | [@joseherreraa1](https://github.com/joseherreraa1) |
| Matias Godoy | [@Kbzgames](https://github.com/Kbzgames) |
| Virginia Alejandra Ponce | [@CodeGinny](https://github.com/CodeGinny) |

## 🚀 Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MySQL** - Base de datos relacional

## 📁 Estructura del Proyecto

```
proyecto-reservas/
├── controllers/
│   └── serviciosController.js    # Lógica de controladores
├── services/
│   └── serviciosService.js       # Lógica de negocio
├── db/
│   ├── conexion.js               # Configuración de BD
│   └── servicios.js              # Capa de acceso a datos
├── v1/
│   └── routes/
│       └── serviciosRoutes.js    # Definición de rutas API v1
├── reservas.js                   # Punto de entrada de la aplicación
├── schema.sql                    # Esquema de la base de datos
├── .env                          # Variables de entorno
└── package.json
```

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js (v18 o superior)
- MySQL (v8.0 o superior)
- npm

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd proyecto-reservas
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la base de datos**
   ```bash
   # Ejecutar el archivo schema.sql en tu servidor MySQL
   mysql -u tu_usuario -p tu_base_de_datos < schema.sql
   ```

4. **Configurar variables de entorno**
   
   Crear un archivo `.env` en la raíz del proyecto:
   ```env
   PUERTO=3000
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=nombre_base_datos
   ```

5. **Iniciar el servidor**
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Servicios

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `GET` | `/api/v1/servicios` | Obtener todos los servicios activos | - |
| `GET` | `/api/v1/servicios/:id` | Obtener un servicio por ID | - |
| `POST` | `/api/v1/servicios` | Crear un nuevo servicio | `{ descripcion, importe }` |
| `PUT` | `/api/v1/servicios/:id` | Actualizar un servicio existente | `{ descripcion, importe }` |
| `DELETE` | `/api/v1/servicios/:id` | Eliminar (desactivar) un servicio | - |

### Ejemplos de uso

**Obtener todos los servicios:**
```bash
GET http://localhost:3000/api/v1/servicios
```

**Obtener servicio por ID:**
```bash
GET http://localhost:3000/api/v1/servicios/4
```

**Crear un nuevo servicio:**
```bash
POST http://localhost:3000/api/v1/servicios
Content-Type: application/json

{
  "descripcion": "Corte de pelo",
  "importe": 5000
}
```

**Actualizar un servicio:**
```bash
PUT http://localhost:3000/api/v1/servicios/4
Content-Type: application/json

{
  "descripcion": "Corte y barba",
  "importe": 7500
}
```

**Eliminar un servicio:**
```bash
DELETE http://localhost:3000/api/v1/servicios/4
```

## 📦 Formato de Respuestas

### Respuesta exitosa
```json
{
  "estado": true,
  "datos": { ... },
  "mensaje": "Operación exitosa"
}
```

### Respuesta con error
```json
{
  "estado": false,
  "mensaje": "Descripción del error"
}
```

## 🏗️ Arquitectura

El proyecto implementa una arquitectura en tres capas:

1. **Capa de Presentación (Controllers)**: Maneja las peticiones HTTP y las respuestas
2. **Capa de Negocio (Services)**: Contiene la lógica de negocio
3. **Capa de Datos (DB)**: Gestiona las operaciones con la base de datos

Esta separación facilita el mantenimiento, testing y escalabilidad del proyecto.

## 🔒 Características de Seguridad

- Eliminación lógica de registros (soft delete)
- Validación de datos obligatorios
- Manejo centralizado de errores
- Variables de entorno para datos sensibles

## 📝 Scripts Disponibles

```json
{
  "dev": "Inicia el servidor en modo desarrollo",
  "start": "Inicia el servidor en modo producción"
}
```

## 📄 Licencia

Este proyecto es parte del trabajo final de la materia Programación 3 de la UNER.

## 📞 Contacto

Para consultas sobre el proyecto, contactar a cualquiera de los integrantes del equipo a través de sus perfiles de GitHub.

---

**Facultad de Ciencias de la Administración - UNER** | 2025