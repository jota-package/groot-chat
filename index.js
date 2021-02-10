const lista_respuestas = ["Yo soy Groot.", "Yo, soy Groot", "Yo soy. Groot", "Yo soy Groot!", "Yooo, soy groot"];

function procesar_respuesta ($mensaje) {
	let posicion = Math.floor(Math.random() * (lista_respuestas.length - 1));
	return lista_respuestas[posicion];
}

function pedirConsejo (mensaje){
	return procesar_respuesta($mensaje);
}

function responder (mensaje){
	return procesar_respuesta($mensaje);
}

function cantar (mensaje){
	let max_frases = 10;
	let min_frases = 3;
	let cantidad_frases = Math.floor(Math.random() * (max_frases - min_frases)) + min_frases;
	let cancion = "";
	for(let i = 0; i < cantidad_frases; i++){
		cancion += procesar_respuesta("rap rap") + " ";
	}
	return cancion;
}

module.exports.Groot = {
	pedirConsejo,
	responder,
	cantar
};