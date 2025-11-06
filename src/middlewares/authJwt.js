import jwt from "jsonwebtoken";

export default function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ estado: "Falla", mesaje: "Token no proporcionado." });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ estado: "Falla", mesaje: "Token no válido." });

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.user = usuario; // agrego el usuario decodificado al request
    next();
  } catch (err) {
    return res.status(403).json({ estado: "Falla", mesaje: "Token inválido o expirado." });
  }
}