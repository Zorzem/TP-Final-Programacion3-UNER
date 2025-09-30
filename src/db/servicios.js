import { conexion } from './conexion.js';

export default class Servicios {

    buscarTodos = async() => {
        const sql = 'SELECT * FROM servicios where activo = 1';
        const [servicios] = await conexion.execute(sql);
        return servicios;
    }

    crear = async (descripcion, importe) => {
        const sql = 'INSERT INTO servicios (descripcion, importe) VALUES (?,?)';
        const [resultado] =await conexion.execute(sql, [descripcion, importe]);
        return resultado.insertId;
    }



}