class Respuesta {
    
    crear (estado, mensaje, status, payload=null) {
        if(payload){
            return { estado: estado, status: status, mensaje: mensaje, payload: payload };
        } else {
            return { estado: estado, status: status, mensaje: mensaje };
        }
    }

    error (mensaje, status=500) {
        return this.crear(false, mensaje, status);
    }

    ok (payload = null, mensaje = "OK") {
        return this.crear(true, mensaje, 200, payload);
    }
}

const respuesta = new Respuesta();

module.exports = respuesta;