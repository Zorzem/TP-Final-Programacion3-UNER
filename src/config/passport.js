// src\config\passport.js

import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import UsuariosService from "../services/usuariosService.js"; // nuevo servicio de usuarios

// local passport
const estrategia = new LocalStrategy(
  {
    usernameField: "nombre_usuario",
    passwordField: "contrasenia",
  },
  async (nombre_usuario, contrasenia, done) => {
    try {
      //console.log("--- CONFIG -  AUTORIZACION TESTIGO DE ESTRATEGIA LOCAL - VALIDACION DE DATOS CONFIG---");
      //console.log("Nombre de usuario recibido:", nombre_usuario);
      //console.log("Contraseña recibida:", contrasenia);

      const usuariosServicio = new UsuariosService();

      const usuario = await usuariosServicio.buscar(nombre_usuario, contrasenia);
      //console.log("USUARIO:", usuario);

      // para ver si devuelve usuario
      //console.log("config - Usuario encontrado en DB:", usuario);

      if (!usuario) {
      //  console.log("Login incorrecto -> no se encontró usuario o contraseña no coincide");
        return done(null, false, { mensaje: "Login incorrecto!" });
      }
      //console.log("Login correcto -> usuario autenticado");
      return done(null, usuario, { mensaje: "Login correcto!" });
    } catch (exc) {
      console.error("Error en LocalStrategy:", exc);
      done(exc);
    }
  }
);

// validación de token
const validacion = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (jwtPayload, done) => {
    const usuariosServicio = new UsuariosService();
    const usuario = await usuariosServicio.buscarPorId(jwtPayload.usuario_id);
    if (!usuario) {
      return done(null, false, { mensaje: "Token incorrecto!" });
    }

    return done(null, usuario); // guardo la informacion del usuario en req.user
  }
);
export { estrategia, validacion };
