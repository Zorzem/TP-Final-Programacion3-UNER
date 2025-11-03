import { conexion } from "./conexion.js";

export default class Reportes {
  getReporteReservas = async (filtros) => {
    const { fechaInicio, fechaFin, tipo = "stats" } = filtros;

    let spName;
    let params = [];

    switch (tipo) {
      case "por_salon":
        spName = "get_reservas_por_salon";
        params = [fechaInicio || null, fechaFin || null];
        break;
      case "por_fecha":
        spName = "get_reservas_por_fecha";
        params = [fechaInicio || null, fechaFin || null];
        break;
      default:
        spName = "get_reservas_stats";
        params = [fechaInicio || null, fechaFin || null];
    }

    const [result] = await conexion.execute(`CALL ${spName}(?, ?)`, params);
    return Array.isArray(result[0]) ? result[0] : result;
  };
}

