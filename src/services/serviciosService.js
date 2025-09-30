import Servicios from "../db/servicios.js";

export default class ServiciosService {

    constructor() {
        this.servicios = new Servicios();
    }

    buscarTodos = () => {
        return this.servicios.buscarTodos();
    }

    
}