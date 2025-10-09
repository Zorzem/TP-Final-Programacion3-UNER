// respuesta exitosa
export const successResponse = (res, data = null, message = "Operación exitosa", status = 200) => {
  return res.status(status).json({
    success: true,
    data,
    message,
  });
};

// error genérico
export const errorResponse = (res, message = "Error interno del servidor", status = 500, data = null) => {
  return res.status(status).json({
    success: false,
    data,
    message,
  });
};

// recurso no fue encontrado
export const notFoundResponse = (res, message = "Recurso no encontrado", data = null) => {
  return res.status(404).json({
    success: false,
    data,
    message,
  });
};
