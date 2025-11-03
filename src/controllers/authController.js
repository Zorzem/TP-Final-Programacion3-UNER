import jwt from 'jsonwebtoken';
import passport from 'passport';

export default class AuthController{
    login = async (req, res) => {        
        console.log('--- LOGIN REQUEST BODY ---', req.body);

        passport.authenticate('local', {session: false}, (err, usuario, info) => {
            console.log('passport callback -> err:', err, 'usuario:', usuario ? true : usuario, 'info:', info);
            if (err || !usuario) {
                return res.status(400).json({
                    estado: false,
                    mensaje: "Solicitud incorrecta." ,
                    error: err,
                    usuario: usuario,
                    info: info
                })
            }
            
            // ARMO EL TOKEN Y ENVIO CLIENTE
            req.login(usuario, { session: false }, (err) => {
                if(err){
                    res.send(err);
                }
                // ARMAMOS EL TOKEN CON LOS DATOS DEL USUARIO Y UNA EXPIRACION
                const token = jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: '1h'});

                return res.json({
                    estado: true, 
                    token: token
                });
            })
        })(req, res);
    }
}   