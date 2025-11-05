// src/middlewares/autorizarUsuarios.js

// controlo si el tipo de usuario esta autorizado o no en el array de perfiles permitidos para el recurso
export default function autorizarUsuarios(perfilAutorizados = []) {
  return (req, res, next) => {
    const usuario = req.user;

    if (!usuario || !perfilAutorizados.includes(usuario.tipo_usuario)) {
      return res.status(403).json({
        estado: "Falla",
        mesaje: "Acceso denegado.",
      }); // no esta incluido
    }

    next(); // esta incluido, continua con el metodo del controlador
  };
}
