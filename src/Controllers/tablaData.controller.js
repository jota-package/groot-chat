const respuesta = require('./respuesta');
const tdModel = require('../Models/tabla_data_model');
require('dotenv').config();

const contenidoDirectorio = (req, res) => {

    let array_response = [
        {"file_nombre":"Acta_apertura_2020-05-05 14-53-33.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-33/Acta_apertura_2020-05-05_14-53-33.json","file_id":3,"file_tipo":"f","file_padre_id":-1000,"captura_id":3,"captura_estado":2,"documento_id":3,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-05-05_14-53-33.pdf","file_name":"/PNIA-33/Calibradoras y Actas/Acta_apertura_2020-05-05_14-53-33.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"05/05/2020 - 14:53:34","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-05-06 11-48-32.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-2/Acta_apertura_2020-05-06_11-48-32.json","file_id":474,"file_tipo":"f","file_padre_id":-1000,"captura_id":467,"captura_estado":2,"documento_id":467,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-05-06_11-48-32.pdf","file_name":"/PNIA-2/Calibradoras y Actas/Acta_apertura_2020-05-06_11-48-32.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"06/05/2020 - 11:48:33","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-05-17 14-39-14.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-3/Acta_apertura_2020-05-17_14-39-14.json","file_id":1183,"file_tipo":"f","file_padre_id":-1000,"captura_id":1176,"captura_estado":2,"documento_id":1176,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-05-17_14-39-14.pdf","file_name":"/PNIA-3/Calibradoras y Actas/Acta_apertura_2020-05-17_14-39-14.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"17/05/2020 - 14:39:15","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-05-25 11-29-19.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-4/Acta_apertura_2020-05-25_11-29-19.json","file_id":1642,"file_tipo":"f","file_padre_id":-1000,"captura_id":1634,"captura_estado":2,"documento_id":1634,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-05-25_11-29-19.pdf","file_name":"/PNIA-4/Calibradoras y Actas/Acta_apertura_2020-05-25_11-29-19.pdf","usuario_nombre":"Diana De La Cruz De La cruz","created_at":"25/05/2020 - 11:29:19","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-06-05 00-45-14.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-5/Acta_apertura_2020-06-05_00-45-14.json","file_id":2184,"file_tipo":"f","file_padre_id":-1000,"captura_id":2175,"captura_estado":2,"documento_id":2175,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-06-05_00-45-14.pdf","file_name":"/PNIA-5/Calibradoras y Actas/Acta_apertura_2020-06-05_00-45-14.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"05/06/2020 - 00:45:14","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-06-08 00-11-09.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-5/Acta_apertura_2020-06-08_00-11-09.json","file_id":2670,"file_tipo":"f","file_padre_id":-1000,"captura_id":2661,"captura_estado":2,"documento_id":2661,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-06-08_00-11-09.pdf","file_name":"/PNIA-5/Calibradoras y Actas/Acta_apertura_2020-06-08_00-11-09.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"08/06/2020 - 00:11:10","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-07-27 09-31-18.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-7/Acta_apertura_2020-07-27_09-31-18.json","file_id":2891,"file_tipo":"f","file_padre_id":-1000,"captura_id":2878,"captura_estado":2,"documento_id":2878,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-07-27_09-31-18.pdf","file_name":"/PNIA-7/Calibradoras y Actas/Acta_apertura_2020-07-27_09-31-18.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"27/07/2020 - 09:31:19","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-08-01 10-45-49.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-9/Acta_apertura_2020-08-01_10-45-49.json","file_id":3558,"file_tipo":"f","file_padre_id":-1000,"captura_id":3545,"captura_estado":2,"documento_id":3545,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-08-01_10-45-49.pdf","file_name":"/PNIA-9/Calibradoras y Actas/Acta_apertura_2020-08-01_10-45-49.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"01/08/2020 - 10:45:49","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-08-04 09-02-54.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-20/Acta_apertura_2020-08-04_09-02-54.json","file_id":6060,"file_tipo":"f","file_padre_id":-1000,"captura_id":6046,"captura_estado":2,"documento_id":6046,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-08-04_09-02-54.pdf","file_name":"/PNIA-20/Calibradoras y Actas/Acta_apertura_2020-08-04_09-02-54.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"04/08/2020 - 09:02:55","adetalle_peso":130195,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-08-05 11-44-52.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-23/Acta_apertura_2020-08-05_11-44-52.json","file_id":9601,"file_tipo":"f","file_padre_id":-1000,"captura_id":9586,"captura_estado":2,"documento_id":9586,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-08-05_11-44-52.pdf","file_name":"/PNIA-23/Calibradoras y Actas/Acta_apertura_2020-08-05_11-44-52.pdf","usuario_nombre":"Jennifer Leslie Ortiz Carbajal","created_at":"05/08/2020 - 11:44:53","adetalle_peso":130195,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"}
    ];
    let options = req.body;
    tdModel.contenidoDirectorio(options, (result)=>{
        console.log(result);
        if(result.estado){
            let lista_datos = result.payload.rows;
            let recordsTotal = 0;
            if(lista_datos.length > 0){
                recordsTotal = lista_datos[0].total;
            }
            res.status(200).json(respuesta.ok({
                "draw" : 1, // numero de veces que se hace llamados a la tabla
                "recordsTotal" : recordsTotal, // total de registros
                "recordsFiltered": recordsTotal, // en caso de filtro, cuantos valores son filtrados
                "data": lista_datos // array de datos de la pagina
            }));
        } else {
            res.status(200).json(result);            
        }
    });
};

const contenidoFile = (req, res) => {

    let options = req.body;
    tdModel.contenidoFile(options, (result)=>{
        if(result.estado){
            let lista_datos = result.payload.rows;
            if(lista_datos.length > 0){
                res.status(200).json(respuesta.ok(lista_datos[0]));
            } else {
                res.status(200).json(respuesta.error("No se ha logrado conseguir la información deseada"));    
            }
        } else {
            res.status(200).json(result);
        }
    });
    // res.status(200).json(respuesta.ok({"file_nombre":"Acta_apertura_2020-08-05 11-44-52.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-23/Acta_apertura_2020-08-05_11-44-52.json","file_id":9601,"file_tipo":"f","file_padre_id":-1000,"captura_id":9586,"captura_estado":2,"documento_id":9586,"plantilla_nombre":"COMPROBANTES DE PAGO","items":[],"adetalle_nombre":"Acta_apertura_2020-08-05_11-44-52.pdf","file_name":"/PNIA-23/Calibradoras y Actas/Acta_apertura_2020-08-05_11-44-52.pdf","usuario_nombre":"Jennifer Leslie Ortiz Carbajal","created_at":"05/08/2020 - 11:44:53","adetalle_peso":130195,"children":null,"ruta":[],"cant_paginas":4,"plantilla_file":"database/plantilla_1.json"}));
};

const busquedaSimple = (req, res) => {
    let array_response = [
        {"file_nombre":"Acta_apertura_2020-05-05 14-53-33.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-33/Acta_apertura_2020-05-05_14-53-33.json","file_id":3,"file_tipo":"f","file_padre_id":-1000,"captura_id":3,"captura_estado":2,"documento_id":3,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-05-05_14-53-33.pdf","file_name":"/PNIA-33/Calibradoras y Actas/Acta_apertura_2020-05-05_14-53-33.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"05/05/2020 - 14:53:34","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json","coincidencia_contenido":true,"termino":"raaaa","pagina":1,"linea":"lanza tu raaaa"},
        {"file_nombre":"Acta_apertura_2020-05-06 11-48-32.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-2/Acta_apertura_2020-05-06_11-48-32.json","file_id":474,"file_tipo":"f","file_padre_id":-1000,"captura_id":467,"captura_estado":2,"documento_id":467,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-05-06_11-48-32.pdf","file_name":"/PNIA-2/Calibradoras y Actas/Acta_apertura_2020-05-06_11-48-32.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"06/05/2020 - 11:48:33","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-05-17 14-39-14.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-3/Acta_apertura_2020-05-17_14-39-14.json","file_id":1183,"file_tipo":"f","file_padre_id":-1000,"captura_id":1176,"captura_estado":2,"documento_id":1176,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-05-17_14-39-14.pdf","file_name":"/PNIA-3/Calibradoras y Actas/Acta_apertura_2020-05-17_14-39-14.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"17/05/2020 - 14:39:15","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json","coincidencia_contenido":true,"termino":"raaaa","pagina":1,"linea":"lanza tu raaaa"},
        {"file_nombre":"Acta_apertura_2020-05-25 11-29-19.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-4/Acta_apertura_2020-05-25_11-29-19.json","file_id":1642,"file_tipo":"f","file_padre_id":-1000,"captura_id":1634,"captura_estado":2,"documento_id":1634,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-05-25_11-29-19.pdf","file_name":"/PNIA-4/Calibradoras y Actas/Acta_apertura_2020-05-25_11-29-19.pdf","usuario_nombre":"Diana De La Cruz De La cruz","created_at":"25/05/2020 - 11:29:19","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json","coincidencia_contenido":true,"termino":"raaaa","pagina":2,"linea":"lanza tu raaaa"},
        {"file_nombre":"Acta_apertura_2020-06-05 00-45-14.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-5/Acta_apertura_2020-06-05_00-45-14.json","file_id":2184,"file_tipo":"f","file_padre_id":-1000,"captura_id":2175,"captura_estado":2,"documento_id":2175,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-06-05_00-45-14.pdf","file_name":"/PNIA-5/Calibradoras y Actas/Acta_apertura_2020-06-05_00-45-14.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"05/06/2020 - 00:45:14","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json","coincidencia_contenido":true,"termino":"raaaa","pagina":1,"linea":"lanza tu raaaa"},
        {"file_nombre":"Acta_apertura_2020-06-08 00-11-09.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-5/Acta_apertura_2020-06-08_00-11-09.json","file_id":2670,"file_tipo":"f","file_padre_id":-1000,"captura_id":2661,"captura_estado":2,"documento_id":2661,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-06-08_00-11-09.pdf","file_name":"/PNIA-5/Calibradoras y Actas/Acta_apertura_2020-06-08_00-11-09.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"08/06/2020 - 00:11:10","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json","coincidencia_contenido":true,"termino":"raaaa","pagina":2,"linea":"lanza tu raaaa"},
        {"file_nombre":"Acta_apertura_2020-07-27 09-31-18.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-7/Acta_apertura_2020-07-27_09-31-18.json","file_id":2891,"file_tipo":"f","file_padre_id":-1000,"captura_id":2878,"captura_estado":2,"documento_id":2878,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-07-27_09-31-18.pdf","file_name":"/PNIA-7/Calibradoras y Actas/Acta_apertura_2020-07-27_09-31-18.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"27/07/2020 - 09:31:19","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json","coincidencia_contenido":true,"termino":"raaaa","pagina":1,"linea":"lanza tu raaaa"},
        {"file_nombre":"Acta_apertura_2020-08-01 10-45-49.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-9/Acta_apertura_2020-08-01_10-45-49.json","file_id":3558,"file_tipo":"f","file_padre_id":-1000,"captura_id":3545,"captura_estado":2,"documento_id":3545,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-08-01_10-45-49.pdf","file_name":"/PNIA-9/Calibradoras y Actas/Acta_apertura_2020-08-01_10-45-49.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"01/08/2020 - 10:45:49","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json","coincidencia_contenido":true,"termino":"raaaa","pagina":2,"linea":"lanza tu raaaa"},
        {"file_nombre":"Acta_apertura_2020-08-04 09-02-54.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-20/Acta_apertura_2020-08-04_09-02-54.json","file_id":6060,"file_tipo":"f","file_padre_id":-1000,"captura_id":6046,"captura_estado":2,"documento_id":6046,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-08-04_09-02-54.pdf","file_name":"/PNIA-20/Calibradoras y Actas/Acta_apertura_2020-08-04_09-02-54.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"04/08/2020 - 09:02:55","adetalle_peso":130195,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json","coincidencia_contenido":true,"termino":"raaaa","pagina":1,"linea":"lanza tu raaaa"},
        {"file_nombre":"Acta_apertura_2020-08-05 11-44-52.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-23/Acta_apertura_2020-08-05_11-44-52.json","file_id":9601,"file_tipo":"f","file_padre_id":-1000,"captura_id":9586,"captura_estado":2,"documento_id":9586,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-08-05_11-44-52.pdf","file_name":"/PNIA-23/Calibradoras y Actas/Acta_apertura_2020-08-05_11-44-52.pdf","usuario_nombre":"Jennifer Leslie Ortiz Carbajal","created_at":"05/08/2020 - 11:44:53","adetalle_peso":130195,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json","coincidencia_contenido":true,"termino":"raaaa","pagina":2,"linea":"lanza tu raaaa"}
    ];

    let options = req.body;
    tdModel.busquedaSimple(options, (result)=>{
        console.log(result);
        if(result.estado){
            let lista_datos = result.payload.rows;
            let recordsTotal = 0;
            if(lista_datos.length > 0){
                recordsTotal = lista_datos[0].total;
            }
            res.status(200).json(respuesta.ok({
                "draw" : 1, // numero de veces que se hace llamados a la tabla
                "recordsTotal" : recordsTotal, // total de registros
                "recordsFiltered": recordsTotal, // en caso de filtro, cuantos valores son filtrados
                "data": lista_datos // array de datos de la pagina
            }));
        } else {
            res.status(200).json(result);            
        }
    });
};

const busquedaAvanzada = (req, res) => {
    let array_response = [
        {"file_nombre":"Acta_apertura_2020-05-05 14-53-33.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-33/Acta_apertura_2020-05-05_14-53-33.json","file_id":3,"file_tipo":"f","file_padre_id":-1000,"captura_id":3,"captura_estado":2,"documento_id":3,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-05-05_14-53-33.pdf","file_name":"/PNIA-33/Calibradoras y Actas/Acta_apertura_2020-05-05_14-53-33.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"05/05/2020 - 14:53:34","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-05-06 11-48-32.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-2/Acta_apertura_2020-05-06_11-48-32.json","file_id":474,"file_tipo":"f","file_padre_id":-1000,"captura_id":467,"captura_estado":2,"documento_id":467,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-05-06_11-48-32.pdf","file_name":"/PNIA-2/Calibradoras y Actas/Acta_apertura_2020-05-06_11-48-32.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"06/05/2020 - 11:48:33","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-05-17 14-39-14.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-3/Acta_apertura_2020-05-17_14-39-14.json","file_id":1183,"file_tipo":"f","file_padre_id":-1000,"captura_id":1176,"captura_estado":2,"documento_id":1176,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-05-17_14-39-14.pdf","file_name":"/PNIA-3/Calibradoras y Actas/Acta_apertura_2020-05-17_14-39-14.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"17/05/2020 - 14:39:15","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-05-25 11-29-19.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-4/Acta_apertura_2020-05-25_11-29-19.json","file_id":1642,"file_tipo":"f","file_padre_id":-1000,"captura_id":1634,"captura_estado":2,"documento_id":1634,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-05-25_11-29-19.pdf","file_name":"/PNIA-4/Calibradoras y Actas/Acta_apertura_2020-05-25_11-29-19.pdf","usuario_nombre":"Diana De La Cruz De La cruz","created_at":"25/05/2020 - 11:29:19","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-06-05 00-45-14.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-5/Acta_apertura_2020-06-05_00-45-14.json","file_id":2184,"file_tipo":"f","file_padre_id":-1000,"captura_id":2175,"captura_estado":2,"documento_id":2175,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-06-05_00-45-14.pdf","file_name":"/PNIA-5/Calibradoras y Actas/Acta_apertura_2020-06-05_00-45-14.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"05/06/2020 - 00:45:14","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-06-08 00-11-09.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-5/Acta_apertura_2020-06-08_00-11-09.json","file_id":2670,"file_tipo":"f","file_padre_id":-1000,"captura_id":2661,"captura_estado":2,"documento_id":2661,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-06-08_00-11-09.pdf","file_name":"/PNIA-5/Calibradoras y Actas/Acta_apertura_2020-06-08_00-11-09.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"08/06/2020 - 00:11:10","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-07-27 09-31-18.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-7/Acta_apertura_2020-07-27_09-31-18.json","file_id":2891,"file_tipo":"f","file_padre_id":-1000,"captura_id":2878,"captura_estado":2,"documento_id":2878,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-07-27_09-31-18.pdf","file_name":"/PNIA-7/Calibradoras y Actas/Acta_apertura_2020-07-27_09-31-18.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"27/07/2020 - 09:31:19","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-08-01 10-45-49.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-9/Acta_apertura_2020-08-01_10-45-49.json","file_id":3558,"file_tipo":"f","file_padre_id":-1000,"captura_id":3545,"captura_estado":2,"documento_id":3545,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-08-01_10-45-49.pdf","file_name":"/PNIA-9/Calibradoras y Actas/Acta_apertura_2020-08-01_10-45-49.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"01/08/2020 - 10:45:49","adetalle_peso":127169,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-08-04 09-02-54.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-20/Acta_apertura_2020-08-04_09-02-54.json","file_id":6060,"file_tipo":"f","file_padre_id":-1000,"captura_id":6046,"captura_estado":2,"documento_id":6046,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-08-04_09-02-54.pdf","file_name":"/PNIA-20/Calibradoras y Actas/Acta_apertura_2020-08-04_09-02-54.pdf","usuario_nombre":"Luis Alfredo Maurtua","created_at":"04/08/2020 - 09:02:55","adetalle_peso":130195,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"},
        {"file_nombre":"Acta_apertura_2020-08-05 11-44-52.pdf","proyecto_id":1,"recepcion_id":1,"file_data":"database/recepcion_1.json","file_content":"database/json/PNIA-23/Acta_apertura_2020-08-05_11-44-52.json","file_id":9601,"file_tipo":"f","file_padre_id":-1000,"captura_id":9586,"captura_estado":2,"documento_id":9586,"plantilla_nombre":"COMPROBANTES DE PAGO","items":items_indices,"adetalle_nombre":"Acta_apertura_2020-08-05_11-44-52.pdf","file_name":"/PNIA-23/Calibradoras y Actas/Acta_apertura_2020-08-05_11-44-52.pdf","usuario_nombre":"Jennifer Leslie Ortiz Carbajal","created_at":"05/08/2020 - 11:44:53","adetalle_peso":130195,"children":null,"ruta":[],"cant_paginas":(Math.floor(Math.random() * (20 - 1)) + 1),"plantilla_file":"database/plantilla_1.json"}
    ];

    let options = req.body;
    tdModel.busquedaAvanzada(options, (result)=>{
        console.log(result);
        if(result.estado){
            let lista_datos = result.payload.rows;
            let recordsTotal = 0;
            if(lista_datos.length > 0){
                recordsTotal = lista_datos[0].total;
            }
            res.status(200).json(respuesta.ok({
                "draw" : 1, // numero de veces que se hace llamados a la tabla
                "recordsTotal" : recordsTotal, // total de registros
                "recordsFiltered": recordsTotal, // en caso de filtro, cuantos valores son filtrados
                "data": lista_datos // array de datos de la pagina
            }));
        } else {
            res.status(200).json(result);            
        }
    });
    /*
    res.status(200).json(respuesta.ok({
        "draw" : 1, // numero de veces que se hace llamados a la tabla
        "recordsTotal" : 52, // total de registros
        "recordsFiltered": array_response.length, // en caso de filtro, cuantos valores son filtrados
        "data": array_response // array de datos de la pagina
    }));
    */
};

const listarFilesContenido = (req, res) => {
    let options = req.body;
    if(!("lista" in options)){
        res.status(200).json(respuesta.error("Parametros incorrectos."));
        return false;
    }

    // res.status(200).json(respuesta.ok(options.lista));

    tdModel.listarFilesContenido(options, (result)=>{
        console.log(result);
        if(result.estado){
            let lista_datos = result.payload.rows;
            
            res.status(200).json(respuesta.ok(lista_datos));
        } else {
            res.status(200).json(result);            
        }
    });

};

module.exports = {
    contenidoDirectorio,
    contenidoFile,
    busquedaSimple,
    busquedaAvanzada,
    listarFilesContenido
};

const items_indices = [{"valor":"CP-00157-2015","combo_id":0,"conca_id":null,"opcion_id":null,"elemento_id":1,"plantilla_id":1,"respuesta_id":641,"elemento_tipo":1,"indizacion_id":165,"opcion_nombre":null,"elemento_nombre":"N\u00daMERO DE COMPROBANTE","simple_tipo_dato":"a","simple_tipo_formato":"dmy"},{"valor":"03/08/2015","combo_id":0,"conca_id":null,"opcion_id":null,"elemento_id":2,"plantilla_id":1,"respuesta_id":642,"elemento_tipo":1,"indizacion_id":165,"opcion_nombre":null,"elemento_nombre":"FECHA COMPLETA","simple_tipo_dato":"f","simple_tipo_formato":"dmy"},{"valor":"000105","combo_id":0,"conca_id":null,"opcion_id":null,"elemento_id":3,"plantilla_id":1,"respuesta_id":643,"elemento_tipo":1,"indizacion_id":165,"opcion_nombre":null,"elemento_nombre":"N\u00b0 REGISTRO SIAF","simple_tipo_dato":"a","simple_tipo_formato":"dmy"},{"valor":"RICHARD LUIS MARTINEZ PAREDES","combo_id":0,"conca_id":null,"opcion_id":null,"elemento_id":4,"plantilla_id":1,"respuesta_id":644,"elemento_tipo":1,"indizacion_id":165,"opcion_nombre":null,"elemento_nombre":"NOMBRE DE PROVEEDOR","simple_tipo_dato":"a","simple_tipo_formato":"dmy"}];