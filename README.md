# Trabajo Final Integrador – Programación 3

**Tecnicatura Universitaria en Desarrollo Web**\
Facultad de Ciencias de la Administración – UNER\
Segundo cuatrimestre 2025

## Integrantes

| Nombre                   | Usuario GitHub                                     |
| ------------------------ | -------------------------------------------------- |
| Boris Kovalow            | [@Zorzem](https://github.com/Zorzem)               |
| Giuliano Daniele         | [@Vitruviansky](https://github.com/Vitruviansky)   |
| Jose Herrera             | [@joseherreraa1](https://github.com/joseherreraa1) |
| Matias Godoy             | [@Kbzgames](https://github.com/Kbzgames)           |
| Virginia Alejandra Ponce | [@CodeGinny](https://github.com/CodeGinny)         |

## Tecnologías usadas

- **Node.js**
- **Express.js**
- **MySQL**

## Estructura del proyecto

```
proyecto-reservas/
├── controllers/
│   └── serviciosController.js    # Lógica de controladores
├── services/
│   └── serviciosService.js       # Lógica de negocio
├── db/
│   ├── conexion.js               # Configuración de BD
│   └── servicios.js              # Capa de acceso a datos
├── utils/apiResponse.js          # Para manejar respuestas de la API
├── v1/
│   └── routes/
│       └── serviciosRoutes.js    # Definición de rutas API v1
├── reservas.js                   # Punto de entrada de la aplicación
├── schema.sql                    # Esquema de la base de datos
├── .env                          # Variables de entorno
└── test.http                     # Archivo de testing para realizar pruebas HTTP rápidas
```

## Instalación

### Prerrequisitos

- Node.js (v18 o superior)
- MySQL (v8.0 o superior)

### Pasos

1. **Clonar el repo e instalar dependencias (`npm install`)**

2. **Configurar la base de datos**
   ```bash
   mysql -u usuario -p contraseña < schema.sql
   ```

3. **Crear un archivo `.env` en la raíz del proyecto**
   ```env
   PUERTO=3000
   DB_HOST=localhost
   DB_USER=usuario
   DB_PASSWORD=contraseña
   DB_DATABASE=nombre_bd
   ```

4. **Levantar el servidor**
   ```bash
   npm run dev
   ```

### Ejemplos de uso

Obtener todos los servicios:

```bash
GET http://localhost:3000/api/v1/servicios
```

Obtener todos los servicios (incluyendo inactivos):

```bash
GET http://localhost:3000/api/v1/servicios?incluirInactivos=true
```

Obtener servicio por ID:

```bash
GET http://localhost:3000/api/v1/servicios/4
```

Crear un nuevo servicio:

```bash
POST http://localhost:3000/api/v1/servicios
Content-Type: application/json

{
  "descripcion": "Corte de pelo",
  "importe": 5000
}
```

Actualizar un servicio:

```bash
PUT http://localhost:3000/api/v1/servicios/4
Content-Type: application/json

{
  "descripcion": "Corte y barba",
  "importe": 7500
}
```

Eliminar un servicio:

```bash
DELETE http://localhost:3000/api/v1/servicios/4
```

---

**Facultad de Ciencias de la Administración - UNER** | 2025
