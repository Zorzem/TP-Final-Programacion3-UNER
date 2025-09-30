import { conexion } from './conexion.js';

export default class Servicios {

    buscarTodos = async() => {
        const sql = 'SELECT * FROM servicios where activo = 1';
        const [servicios] = await conexion.execute(sql);
        return servicios;
    }



}