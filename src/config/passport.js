import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalSrategy } from "passport-local";
// NUEVO SERVICIO DE USUARIOS
import UsuariosService from "../services/usuariosService.js";

// ESTRATEGIA LOCAL PASSPORT
const estrategia = new LocalSrategy({
    usernameField: 'nombre_usuario', 
    passwordField: 'contrasenia'
}, 
    async (nombre_usuario, contrasenia, done) => {
        try{
             // 🔍 LOGS DE DEPURACIÓN
            console.log('--- CONFIG -  AUTORIZACION TESTIGO DE ESTRATEGIA LOCAL - VALIDACION DE DATOS CONFIG---');
            console.log('Nombre de usuario recibido:', nombre_usuario);
            console.log('Contraseña recibida:', contrasenia);

            const usuariosServicio = new UsuariosService();
            

            const usuario = await usuariosServicio.buscar(nombre_usuario, contrasenia);
            console.log('USUARIO:', usuario);

            // 🔍 LOG PARA VER SI DEVUELVE USUARIO
            console.log('config - Usuario encontrado en DB:', usuario);


            if(!usuario){
                console.log('Login incorrecto -> no se encontró usuario o contraseña no coincide');
                return done(null, false, { mensaje: 'Login incorrecto!'})
            }
            console.log('Login correcto -> usuario autenticado');
            return done(null, usuario, { mensaje: 'Login correcto!'})
        }
        catch(exc){
            console.error('Error en LocalStrategy:', exc);
            done(exc);
        }
    }
)

// VALIDACION DE TOKEN
const validacion = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
    secretOrKey: process.env.JWT_SECRET    
},
    async (jwtPayload, done) => {
        const usuariosServicio = new UsuariosService();
        const usuario = await usuariosServicio.buscarPorId(jwtPayload.usuario_id);
        if(!usuario){
            return done(null, false, { mensaje: 'Token incorrecto!'});
        }

        return done(null, usuario); // GUARDO LA INFORMACION DEL USUARIO EN REQ.USER
    }    
)
export { estrategia, validacion };