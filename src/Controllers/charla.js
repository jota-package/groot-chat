const respuesta = require('./respuesta');

const preguntar = function(mensaje){
	return respuesta.ok("Yo soy Groot?");
}

module.exports = {
	preguntar
};