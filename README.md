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
│   ├── dashboardService.js
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
│       ├── dashboardRoutes.js
│       ├── encuestasRoutes.js
│       ├── reportesRoutes.js
│       ├── reservasRoutes.js
│       ├── salonesRoutes.js
│       ├── serviciosRoutes.js
│       ├── turnosRoutes.js
│       └── usuariosRoutes.js
├── .env.example              # plantilla de archivo .env de ejemplo
├── sql/                      # esquema de la BD y procedimientos almacenados
├── test/                     # archivos para testear solicitudes HTTP
├── public/dashboard/         # frontend del dashboard de estadísticas
└── main.js                   # punto de entrada de la app
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

5. **Configurar la autenticación JWT**\
   Primero es necesario hacer login y obtener el token, pero para ello
   necesitamos que el usuario exista previamente en la BD.

Podemos crear un usuario de pruebas ejecutando este código en la BD:

```sql
INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, activo, creado)
VALUES ('Admin', 'Test', 'admin@test.com', SHA2('test', 256), 3, 1, NOW()) AS new
ON DUPLICATE KEY UPDATE
  tipo_usuario = new.tipo_usuario,
  contrasenia = new.contrasenia,
  modificado = NOW();
```

Esto crea un administrador de nombre de usuario `admin@test.com` con contraseña
`test`.

Luego podemos loguearnos haciendo una solicitud POST:

```bash
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "nombre_usuario": "admin@test",
  "contrasenia": "test"
}
```

Si las credenciales son válidas (recordar que el usuario DEBE existir en la BD),
recibirás un token que deberás copiar. Y ahora, en cada solicitud posterior,
agregarás el token en el header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5...
```

Ejemplos de uso en `test/test_reservas.http`

**Notas**:

- Los roles son: 1 Admin, 2 Empleado, 3 Cliente.
- La contraseña se almacena hasheada con SHA256

### Rutas para testing

Se encuentran en la carpeta `/test`

### Acceder a la documentación de Swagger

```bash
http://localhost:3000/api-docs/
```

### Funciones extra

- Sistema de encuestas (requiere la tabla `encuestas` en la BD, ver modelo
  `/sql/schema.sql`)

- Dashboard simple de estadísticas globales (no requiere autenticación):
  http://localhost:3000/dashboard

- Carpeta `/logs` con archivo `auditoria.log` donde se resguarda el historial de las acciones basicas.
(si no existe se crea al momento de guardar información)

---

**Facultad de Ciencias de la Administración - UNER | 2025**
