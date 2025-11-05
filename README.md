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

```bash
src
├── config                    # archivos de configuración general 
│   ├── passport.js           # configuración de autenticación 
│   └── swagger.js            # configuración de Swagger para los docs
├── controllers               # controladores que reciben la petición y llaman a los servicios
│   ├── authController.js
│   ├── encuestasController.js
│   ├── reportesController.js
│   ├── reservasController.js
│   ├── salonesController.js
│   ├── serviciosController.js
│   ├── turnosController.js
│   └── usuariosController.js
├── db                        # acceso a la BD, consultas y modelos
│   ├── conexion.js           # conexión a la BD
│   ├── encuestas.js
│   ├── reportes.js
│   ├── reservas.js
│   ├── salones.js
│   ├── servicios.js
│   ├── turnos.js
│   └── usuarios.js
├── middlewares               # funciones intermedias que se ejecutan antes de los controladores
│   ├── autorizarUsuarios.js  # control de permisos y roles
│   └── validarCampos.js      # validación de datos entrantes
├── services                  # lógica de negocio y reglas de la aplicación
│   ├── encuestasService.js
│   ├── notificacionesService.js
│   ├── reportesService.js
│   ├── reservasService.js
│   ├── salonesService.js
│   ├── serviciosService.js
│   ├── turnosService.js
│   └── usuariosService.js
├── utils                     # utilidades generales
│   ├── handlebars            # plantillas para generar reportes
│   │   ├── plantilla.hbs
│   │   └── reporte.hbs
│   └── apiResponse.js        # funciones para estandarizar respuestas de la API
├── v1
│   └── routes                # rutas de la API
│       ├── authRoutes.js
│       ├── encuestasRoutes.js
│       ├── reportesRoutes.js
│       ├── reservasRoutes.js
│       ├── salonesRoutes.js
│       ├── serviciosRoutes.js
│       ├── turnosRoutes.js
│       └── usuariosRoutes.js
└── main.js                   # entrada principal de la app
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
   JWT_SECRET=pass123
   ```

4. **Levantar el servidor**
   ```bash
   npm run dev
   ```

### Acceder a la documentación de Swagger

```bash
http://localhost:3000/api-docs/
```

---

**Facultad de Ciencias de la Administración - UNER** | 2025
