const { Pool } = require('pg');
const respuesta = require('../Controllers/respuesta');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'fedatario_visor',
    port: process.env.DB_PORT || '5432'
});

let tablaModel = {};

tablaModel.contenidoDirectorio = (options, callback) => {
    let {file_id, recepcion_id, rows, page} = options;
	general_query(querys.contenidoDirectorio, [file_id, rows, page, recepcion_id], callback);
    // general_query(querys.testo, [], callback);
};

tablaModel.contenidoFile = (options, callback) => {
	let { file_id } = options;
	general_query(querys.contenidoFile, [file_id], callback);
};

tablaModel.busquedaSimple = (options, callback) => {
    /*
     $1::int as proyecto_id_input
    ,$2::int as recepcion_id_input
    ,$3::int as file_id_input
    ,$4 as termino
    ,$5 as carpeta
    ,$6 as documento
    ,$7::boolean as indices
    ,$8::boolean as ocr
    ,$9::int as rowsxpag
    ,$10::int as pag
    */
    let {proyecto_id, recepcion_id, file_id, busqueda:termino, carpeta, documento, indices, visor, rows, page} = options;
    general_query(querys.busquedaSimple, [proyecto_id, recepcion_id, file_id, termino, carpeta, documento, indices, visor, rows, page], callback);
};

tablaModel.busquedaAvanzada = (options, callback) => {
	/*
     $1::int as proyecto_id_input
    ,$2::int as recepcion_id_input
    ,$3::int as file_id_input
    ,$4::jsonb as json_data
    ,$5::int as rowsxpag
    ,$6::int as pag
    */
    let {proyecto_id, recepcion_id, file_id, condiciones , rows, page} = options;
	general_query(querys.busquedaAvanzada, [proyecto_id, recepcion_id, file_id, condiciones , rows, page], callback);
};

tablaModel.listarFilesContenido = (options, callback)=> {
    let { lista } = options;
    general_query(querys.listarFilesContenido, [lista], callback);
}

module.exports = tablaModel;

let general_query = (sql, data_insert, callback) => {
	if (pool) {
        try{
            console.log(data_insert);
            pool.query(sql, data_insert, (err, result) => {
                if (err) {
                    console.log(err);
                    if (typeof callback == "function") {
                        callback(respuesta.error("Hubo un error en la consulta"));
                    }
                } else {
                    console.log(result);
                    if (typeof callback == "function") {
                        callback(respuesta.ok(result));
                    }
                }
            });
        } catch(e){
            console.log(e);
            if (typeof callback == "function") {
                callback(respuesta.error("Ocurrio un error inesperado."));
            }
        }
    } else {
        callback(respuesta.error("No se ha establedico una conexion con la base de datos."));
    }
};

const querys = {
    testo: `
    `,
	contenidoDirectorio: `with 
paginas as (
        select 
        c.captura_id
        ,c.captura_file_id
        ,count(b.imagen_id) as cant_paginas
        from files a
        join captura c on c.captura_file_id = a.file_id
        left join imagen b on b.captura_id = c.captura_id and b.imagen_estado = 1
        ------------------------------------------------------------------------
        where a.file_padre_id = $1 
            --agregado para calibradoras y aperturas
            or a.recepcion_id =  $1/(-1000)
        group by c.captura_id,c.captura_file_id
    ),
    files_filtrado as (
        --archivos caso normal
        select
        f.file_id
        ,f.recepcion_id
        ,f.file_nombre
        ,f.file_tipo
        --,f.file_padre_id
        ,case when f.file_captura_estado != 1 then f.recepcion_id*-1000
        else f.file_padre_id end as file_padre_id
        ,f.file_captura_estado
        ,f.file_estado
        ,f.file_usuario_id
        ,f.created_at
        ,f.updated_at
        --,p.cant_paginas
        from files f
        left join captura b  on f.file_id = b.captura_file_id
        --para cantidad de imagenes
        --left join paginas p on p.captura_id = a.captura_id
        --where a.gmd_id = 13----------------------
        where f.file_padre_id = $1
        or ('0'=$1::varchar(10) and f.recepcion_id = $4 and f.file_padre_id is null and f.file_captura_estado = 1)
        ------------------------------------------------------------------------------------
        union all
        --archivos caso click en carpeta ACTA
        
        select 
        f.file_id
        ,f.recepcion_id
        ,f.file_nombre
        ,f.file_tipo
        --,f.file_padre_id
        ,case when f.file_captura_estado != 1 then f.recepcion_id*-1000
        else f.file_padre_id end as file_padre_id
        ,f.file_captura_estado
        ,f.file_estado
        ,f.file_usuario_id
        ,f.created_at
        ,f.updated_at
        from files f 
        where f.file_captura_estado != 1 and f.recepcion_id = $1/(-1000)
        --------------------------------------------------------------------------------------
        
    ),
    files_final as (
        select distinct * from files_filtrado
                    union all
        select distinct
            a.recepcion_id*-1000,
            a.recepcion_id,
            'CALIBRADORAS Y ACTAS',
            'd',
            null::int,--a.recepcion_id*-1,
            1,
            1,
            1,
            now(),
            now()
            --,0
        from recepcion a
        --left join recepcion b on a.recepcion_id = b.recepcion_id
        where a.recepcion_id = $4 and '0'= $1::varchar(10)
        -------------------------------------------------------------------------------------
    ),
    cabecera AS(
        select
        distinct
            fi.file_id,
            fi.file_nombre,
            pro.proyecto_id,
            re.recepcion_id,
            fi.file_tipo,
            fi.file_padre_id,
            ca.captura_id,
            ca.captura_estado,
            doc.documento_id,
            pla.plantilla_nombre,
            ad.adetalle_nombre,
            ad.adetalle_url ,
            ad.adetalle_peso
            ,p.persona_nombre||' '||p.persona_apellido as usuario_nombre
            ,to_char(ca.created_at,'DD/MM/YYYY - HH24:MI:SS') as created_at
            from proyecto pro
            join plantilla pla
            on pla.plantilla_id= pro.plantilla_id
            join recepcion re
            on pro.proyecto_id= re.proyecto_id
            join files_final fi
            on fi.recepcion_id = re.recepcion_id
            left join captura  ca
            on ca.captura_file_id = fi.file_id
            left join documento doc
            on doc.captura_id= ca.captura_id
            left join adetalle ad
            on ad.adetalle_id = doc.adetalle_id
            --join para obtener el nombre del usuario
            left join persona p
                on ca.usuario_creador = p.usuario_id
            
    ),
    datos_pre as (
        select distinct
            ca.file_nombre,
            ca.proyecto_id,
            ca.recepcion_id,
            ca.file_id,
            ca.file_tipo,
            ca.file_padre_id,
            ca.captura_id,
            ca.captura_estado,
            ca.documento_id,
            ca.plantilla_nombre,
            ca.adetalle_nombre,
            ca.adetalle_url,
            ca.adetalle_peso,
            ca.usuario_nombre,
            ca.created_at,
            --jsonb_agg(
                case when res.respuesta_id is null
                    then null
                else
                    json_build_object(
                    'respuesta_id', res.respuesta_id,
                    'opcion_id', res.opcion_id,
                    'combo_id', res.combo_id,
                    'elemento_id', res.elemento_id,
                    'elemento_tipo', res.elemento_tipo,
                    'plantilla_id', res.plantilla_id,
                    'valor', res.valor,
                    'indizacion_id', res.indizacion_id,
                    'conca_id', res.conca_id,
                    'simple_tipo_dato', s.simple_tipo_dato,
                    'simple_tipo_formato', s.simple_tipo_formato,
                    'elemento_nombre', e.elemento_nombre,
                    'opcion_nombre', o.opcion_nombre
                )::jsonb
            end as item
            --)
            --over (partition by ca.file_id) AS items
            --,ca.children
            ,res.elemento_id
            from cabecera ca  left join indizacion ind
            on ca.captura_id = ind.captura_id and ind.indizacion_tipo ='VF'
            left join  respuesta res
            on res.indizacion_id = ind.indizacion_id
            left join elemento e
            on e.elemento_id = res.elemento_id
            left join simple s
            on s.elemento_id = res.elemento_id
            left join opcion o
            on o.opcion_id = res.opcion_id  
    ),
    datos as(
        select distinct
        a.file_nombre,
        a.proyecto_id,
        a.recepcion_id,
        a.file_id,
        a.file_tipo,
        a.file_padre_id,
        a.captura_id,
        a.captura_estado,
        a.documento_id,
        a.plantilla_nombre,
        a.adetalle_nombre,
        a.adetalle_url,
        a.adetalle_peso,
        a.usuario_nombre,
        a.created_at,
        jsonb_agg(
            a.item
        )
        over(partition by a.file_id)
        as items
        --,a.children
        from
            (select * from datos_pre order by file_id,elemento_id) a
    ),
    datos2 as (
    select 
        ca.file_nombre,
        ca.proyecto_id,
        ca.recepcion_id,
        ca.file_id,
        ca.file_tipo,
        ca.file_padre_id,
        ca.captura_id,
        ca.captura_estado,
        ca.documento_id,
        ca.plantilla_nombre,
        ca.usuario_nombre,
        ca.created_at,
        case
                when ca.items = '[null]'::jsonb
                    then '[]'::jsonb
                else
                    ca.items
        end as items,
        ca.adetalle_nombre,
        --ca.adetalle_url as file_name,
        --p.proyecto_nombre||'/'||gmd.gmd_nombre||
        --'/'||gmrd.gmrd_ruta||ca.adetalle_nombre as file_name,
        '/'||gmd.gmd_nombre||'/'||gmrd.gmrd_ruta||ca.adetalle_nombre as file_name,
        -----
        'database/json/'||gmd.gmd_nombre||'/'||replace(ca.adetalle_nombre,'.pdf','.json') as file_content,
        ca.adetalle_peso,
        /*
        jsonb_agg(
            --im.imagen_url
            --p.proyecto_nombre||'/'||gmd.gmd_nombre||
            '/visor/componentes/'||im.imagen_nombre
            )
        over (partition by ca.file_id) AS ruta,
        */
        '[]'::jsonb AS ruta
        --,ca.children
        , case when pa.captura_id is null
            then 0
            else pa.cant_paginas end 
        , p.plantilla_id
        ,count(ca.file_id) over() as total
        from datos ca  
        --left join imagen im
        --on  ca.captura_id = im.captura_id
        left join proyecto p
            on p.proyecto_id = ca.proyecto_id
        left join generacion_medio_ruta_destino gmrd
            on gmrd.captura_estado = ca.captura_estado
        left join generacion_medio_detalle_captura gmdc
            on gmdc.captura_id = ca.captura_id
        left join generacion_medio_detalle gmd
            --on gmd.gmd_id = 13--:gmd_id------------------------------------------------------------------------
            --on gmd.gm_id = :gm_id
            on gmd.gmd_id = gmdc.gmd_id
        left join paginas pa 
            on pa.captura_id=gmdc.captura_id
            order by ca.file_id
    )
    select
        file_nombre,
        proyecto_id,
        recepcion_id,
        --'visor/database/recepcion_'||(recepcion_id::varchar(10))||'.json' as file_data,
        'database/recepcion_'||(recepcion_id::varchar(10))||'.json' as file_data,
        file_content,
        file_id,
        file_tipo,
        file_padre_id,
        captura_id,
        captura_estado,
        documento_id,
        plantilla_nombre,
        items,
        adetalle_nombre,
        file_name,
        usuario_nombre,
        created_at,
        adetalle_peso,
        --children,
    case
        when ruta = '[null]'::jsonb
            then '[]'::jsonb
        else
            ruta
    end as ruta
        ,cant_paginas
        --,plantilla_id
        ,'database/plantilla_'||(plantilla_id::varchar(10))||'.json' as plantilla_file
        ,total
    from datos2
    LIMIT $2
    OFFSET (($3-1) * $2) 
    ;`,
	contenidoFile: `
    with    
        files_final as (
        --archivos caso normal
        select
        f.file_id
        ,f.recepcion_id
        ,f.file_nombre
        ,f.file_tipo
        --,f.file_padre_id
        ,case when f.file_captura_estado != 1 then f.recepcion_id*-1000
        else f.file_padre_id end as file_padre_id
        ,f.file_captura_estado
        ,f.file_estado
        ,f.file_usuario_id
        ,f.created_at
        ,f.updated_at
        from files f
        left join captura b  on f.file_id = b.captura_file_id
        where f.file_id = $1
    ),
    cabecera AS(
        select
        
            fi.file_id,
            fi.file_nombre,
            pro.proyecto_id,
            re.recepcion_id,
            fi.file_tipo,
            fi.file_padre_id,
            ca.captura_id,
            ca.captura_estado,
            doc.documento_id,
            pla.plantilla_nombre,
            ad.adetalle_nombre,
            ad.adetalle_url ,
            ad.adetalle_peso
            ,p.persona_nombre||' '||p.persona_apellido as usuario_nombre
            ,to_char(ca.created_at,'DD/MM/YYYY - HH24:MI:SS') as created_at
            from proyecto pro
            join plantilla pla
            on pla.plantilla_id= pro.plantilla_id
            join recepcion re
            on pro.proyecto_id= re.proyecto_id
            join files_final fi
            on fi.recepcion_id = re.recepcion_id
            left join captura  ca
            on ca.captura_file_id = fi.file_id
            left join documento doc
            on doc.captura_id= ca.captura_id
            left join adetalle ad
            on ad.adetalle_id = doc.adetalle_id
            --join para obtener el nombre del usuario
            left join persona p
                on ca.usuario_creador = p.usuario_id
            
    ),
    datos_pre as (
        select 
            ca.file_nombre,
            ca.proyecto_id,
            ca.recepcion_id,
            ca.file_id,
            ca.file_tipo,
            ca.file_padre_id,
            ca.captura_id,
            ca.captura_estado,
            ca.documento_id,
            ca.plantilla_nombre,
            ca.adetalle_nombre,
            ca.adetalle_url,
            ca.adetalle_peso,
            ca.usuario_nombre,
            ca.created_at,
            --jsonb_agg(
                case when res.respuesta_id is null
                    then null
                else
                    json_build_object(
                    'respuesta_id', res.respuesta_id,
                    'opcion_id', res.opcion_id,
                    'combo_id', res.combo_id,
                    'elemento_id', res.elemento_id,
                    'elemento_tipo', res.elemento_tipo,
                    'plantilla_id', res.plantilla_id,
                    'valor', res.valor,
                    'indizacion_id', res.indizacion_id,
                    'conca_id', res.conca_id,
                    'simple_tipo_dato', s.simple_tipo_dato,
                    'simple_tipo_formato', s.simple_tipo_formato,
                    'elemento_nombre', e.elemento_nombre,
                    'opcion_nombre', o.opcion_nombre
                )::jsonb
            end as item
            ,res.elemento_id
            from cabecera ca  left join indizacion ind
            on ca.captura_id = ind.captura_id and ind.indizacion_tipo ='VF'
            left join  respuesta res
            on res.indizacion_id = ind.indizacion_id
            left join elemento e
            on e.elemento_id = res.elemento_id
            left join simple s
            on s.elemento_id = res.elemento_id
            left join opcion o
            on o.opcion_id = res.opcion_id  
    ),
    datos as(
        select distinct
        a.file_nombre,
        a.proyecto_id,
        a.recepcion_id,
        a.file_id,
        a.file_tipo,
        a.file_padre_id,
        a.captura_id,
        a.captura_estado,
        a.documento_id,
        a.plantilla_nombre,
        a.adetalle_nombre,
        a.adetalle_url,
        a.adetalle_peso,
        a.usuario_nombre,
        a.created_at,
        jsonb_agg(
            a.item
        )
        over(partition by a.file_id)
        as items
        from
            (select * from datos_pre order by file_id,elemento_id) a
    ),
    datos2 as (
    select --distinct
        ca.file_nombre,
        ca.proyecto_id,
        ca.recepcion_id,
        ca.file_id,
        ca.file_tipo,
        ca.file_padre_id,
        ca.captura_id,
        ca.captura_estado,
        ca.documento_id,
        ca.plantilla_nombre,
        ca.usuario_nombre,
        ca.created_at,
        case
                when ca.items = '[null]'::jsonb
                    then '[]'::jsonb
                else
                    ca.items
        end as items,
        ca.adetalle_nombre,
        '/'||gmd.gmd_nombre||'/'||gmrd.gmrd_ruta||ca.adetalle_nombre as file_name,
        'database/json/'||gmd.gmd_nombre||'/'||replace(ca.adetalle_nombre,'.pdf','.json') as file_content,
        ca.adetalle_peso
        , p.plantilla_id
        from datos ca  
        left join proyecto p
            on p.proyecto_id = ca.proyecto_id
        left join generacion_medio_ruta_destino gmrd
            on gmrd.captura_estado = ca.captura_estado
        left join generacion_medio_detalle_captura gmdc
            on gmdc.captura_id = ca.captura_id
        left join generacion_medio_detalle gmd
            on gmd.gmd_id = gmdc.gmd_id
    )
    select
        file_nombre,
        proyecto_id,
        recepcion_id,
        'database/recepcion_'||(recepcion_id::varchar(10))||'.json' as file_data,
        file_content,
        file_id,
        file_tipo,
        file_padre_id,
        captura_id,
        captura_estado,
        documento_id,
        plantilla_nombre,
        items,
        file_name,
        'database/plantilla_'||(plantilla_id::varchar(10))||'.json' as plantilla_file
    from datos2
    ;
    `,
	busquedaSimple: `
    with recursive
    datos_input as(
         select 
            $1::int as proyecto_id_input
            ,$2::int as recepcion_id_input
            ,$3::int as file_id_input
            ,$4 as termino
            ,$5 as carpeta
            ,$6 as documento
            ,$7::boolean as indices
            ,$8::boolean as ocr
            ,$9::int as rowsxpag
            ,$10::int as pag
            
    ),
    --separo el muestreo de files que esten dentro del file o proyecto seleccionado en el input
    files_muestreo as (
        select f.*
        from datos_input di
        cross join files f
        left join recepcion r on r.recepcion_id = f.recepcion_id
        where  f.file_id = di.file_id_input 
            or( di.file_id_input=0 and f.file_padre_id is null and f.file_captura_estado =1 and r.proyecto_id =di.proyecto_id_input) 
        
        union all
        
        select f.*
        from files_muestreo fm
        join files f on f.file_padre_id = fm.file_id
    ),
    --hago la busqueda solo para carpetas usando el muestreo previo
    busq_car as(
        select 
        row_number() over() as id,
        f.*,
        di.*,
        false as coincidencia_contenido,
        '' as pagina,
        '' as linea,
        'car' as tipo_busqueda
        ,'' as coincidencia
        from 
            (select * from datos_input where carpeta='d') di
        cross join files_muestreo f
        --where f.file_nombre ilike '%'||di.termino||'%' and f.file_tipo = 'd'
        where f.file_nombre ~* di.termino and f.file_tipo = 'd'
    ),
    --hago la busqueda solo para documentos usando el muestreo previo
    busq_doc as(
        select 
        row_number() over() as id,
        f.*,
        di.*,
        false as coincidencia_contenido,
        '' as pagina,
        '' as linea,
        'doc' as tipo_busqueda
        ,'' as coincidencia
        from 
            (select * from datos_input where documento='f') di
        cross join files_muestreo f
        --where f.file_nombre ilike '%'||di.termino||'%' and f.file_tipo = 'f'
        where f.file_nombre  ~* di.termino and f.file_tipo = 'f'
    )
    ,
    --hago la busqueda solo para indices usando el muestreo previo
    busq_ind as(
        select 
        row_number() over() as id,
        f.*,
        di.*,
        false as coincidencia_contenido,
        '' as pagina,
        '' as linea,
        --(case when r.elemento_tipo = 1 then r.valor
        --	else o.opcion_nombre end) as linea,
        'ind' as tipo_busqueda
        ,'' as coincidencia
        from 
            (select * from datos_input where indices is TRUE) di
        cross join files_muestreo f
        join captura c on c.captura_file_id = f.file_id
        join indizacion i on i.captura_id= c.captura_id and i.indizacion_tipo = 'VF'
        join respuesta r on r.indizacion_id = i.indizacion_id
        left join opcion o on o.opcion_id = r.opcion_id  
        where 
            (case when r.elemento_tipo = 1 then r.valor
            --else o.opcion_nombre end) ilike '%'||di.termino||'%' and f.file_tipo = 'f'	
            else o.opcion_nombre end) ~* di.termino and f.file_tipo = 'f'	
    ),
    busq_ocr as(
        select 
        row_number() over() as id,
        f.*,
        di.*,
        true as coincidencia_contenido,
        doc.pagina::varchar as pagina,
        doc.texto as linea,
        'ocr' as tipo_busqueda
        ,(regexp_matches(doc.texto, di.termino, 'i'))[1] as coincidencia
        from 
            (select * from datos_input where ocr is TRUE) di
        cross join files_muestreo f
        join captura c on c.captura_file_id = f.file_id
        join documento_ocr doc on doc.captura_id = c.captura_id
        --where doc.texto ilike '%'||di.termino||'%' and f.file_tipo = 'f'
        where doc.texto ~* di.termino and f.file_tipo = 'f'
    ),
    --junto todos los resultados
    files_r_pre as (
        select * from busq_car
        union all
        select * from busq_doc
        union all
        select * from busq_ind
        union all
        select * from busq_ocr
    ),
    --filtro solo los resultados que se van a pintar por la páginacion
    files_r as (
        select 
        *
        ,count(*) over() as total
        from files_r_pre
        order by file_id,tipo_busqueda,id
        LIMIT (select rowsxpag from datos_input)
        OFFSET (((select pag from datos_input)-1) * (select rowsxpag from datos_input))
    ),
    --consigo la cantidad de paginas de cada documento
    paginas as (
            select 
            c.captura_id
            ,c.captura_file_id
            ,count(b.imagen_id) as cant_paginas
            from files_r a
            join captura c on c.captura_file_id = a.file_id
            left join imagen b on b.captura_id = c.captura_id and b.imagen_estado = 1
            group by c.captura_id,c.captura_file_id
    ),
    cabecera AS(
        select
        --distinct
            fi.file_id,
            fi.file_nombre,
            pro.proyecto_id,
            re.recepcion_id,
            fi.file_tipo,
            --fi.file_padre_id,
            case when fi.file_captura_estado != 1 then fi.recepcion_id*-1000
            else fi.file_padre_id end as file_padre_id,
            ca.captura_id,
            ca.captura_estado,
            doc.documento_id,
            pla.plantilla_nombre,
            ad.adetalle_nombre,
            ad.adetalle_url ,
            ad.adetalle_peso
            ,p.persona_nombre||' '||p.persona_apellido as usuario_nombre
            ,to_char(ca.created_at,'DD/MM/YYYY - HH24:MI:SS') as created_at
            ,fi.id
            ,fi.coincidencia_contenido
            ,fi.pagina
            ,fi.linea
            ,fi.tipo_busqueda
            ,fi.total
            ,case when fi.tipo_busqueda='ocr' then fi.coincidencia else fi.termino end as termino
            from proyecto pro
            join plantilla pla
            on pla.plantilla_id= pro.plantilla_id
            join recepcion re
            on pro.proyecto_id= re.proyecto_id
            --join files_final fi
            join files_r fi
            on fi.recepcion_id = re.recepcion_id
            left join captura  ca
            on ca.captura_file_id = fi.file_id
            left join documento doc
            on doc.captura_id= ca.captura_id
            left join adetalle ad
            on ad.adetalle_id = doc.adetalle_id
            --join para obtener el nombre del usuario
            left join persona p
                on ca.usuario_creador = p.usuario_id

    ),
    datos_pre as (
        select --distinct
            ca.file_nombre,
            ca.proyecto_id,
            ca.recepcion_id,
            ca.file_id,
            ca.file_tipo,
            ca.file_padre_id,
            ca.captura_id,
            ca.captura_estado,
            ca.documento_id,
            ca.plantilla_nombre,
            ca.adetalle_nombre,
            ca.adetalle_url,
            ca.adetalle_peso,
            ca.usuario_nombre,
            ca.created_at,
            --jsonb_agg(
                case when res.respuesta_id is null
                    then null
                else
                    json_build_object(
                    'respuesta_id', res.respuesta_id,
                    'opcion_id', res.opcion_id,
                    'combo_id', res.combo_id,
                    'elemento_id', res.elemento_id,
                    'elemento_tipo', res.elemento_tipo,
                    'plantilla_id', res.plantilla_id,
                    'valor', res.valor,
                    'indizacion_id', res.indizacion_id,
                    'conca_id', res.conca_id,
                    'simple_tipo_dato', s.simple_tipo_dato,
                    'simple_tipo_formato', s.simple_tipo_formato,
                    'elemento_nombre', e.elemento_nombre,
                    'opcion_nombre', o.opcion_nombre
                )::jsonb
            end as item
            --)
            --over (partition by ca.file_id) AS items
            --,ca.children
            ,res.elemento_id
            ,ca.id
            ,ca.coincidencia_contenido
            ,ca.pagina
            ,ca.linea
            ,ca.tipo_busqueda
            ,ca.total
            ,ca.termino
            from cabecera ca  left join indizacion ind
            on ca.captura_id = ind.captura_id and ind.indizacion_tipo ='VF'
            left join  respuesta res
            on res.indizacion_id = ind.indizacion_id
            left join elemento e
            on e.elemento_id = res.elemento_id
            left join simple s
            on s.elemento_id = res.elemento_id
            left join opcion o
            on o.opcion_id = res.opcion_id  
    ),
    datos as(
        select distinct
        a.file_nombre,
        a.proyecto_id,
        a.recepcion_id,
        a.file_id,
        a.file_tipo,
        a.file_padre_id,
        a.captura_id,
        a.captura_estado,
        a.documento_id,
        a.plantilla_nombre,
        a.adetalle_nombre,
        a.adetalle_url,
        a.adetalle_peso,
        a.usuario_nombre,
        a.created_at,
        jsonb_agg(
            a.item
        )
        over(partition by a.file_id)
        as items
        ,a.id
        ,a.coincidencia_contenido
        ,a.pagina
        ,a.linea
        ,a.tipo_busqueda
        ,a.total
        ,a.termino
        from
            (select * from datos_pre order by file_id,tipo_busqueda,id,elemento_id) a
    ),
    datos2 as (
    select --distinct
        ca.file_nombre,
        ca.proyecto_id,
        ca.recepcion_id,
        ca.file_id,
        ca.file_tipo,
        ca.file_padre_id,
        ca.captura_id,
        ca.captura_estado,
        ca.documento_id,
        ca.plantilla_nombre,
        ca.usuario_nombre,
        ca.created_at,
        case
                when ca.items = '[null]'::jsonb
                    then '[]'::jsonb
                else
                    ca.items
        end as items,
        ca.adetalle_nombre,
        '/'||gmd.gmd_nombre||'/'||gmrd.gmrd_ruta||ca.adetalle_nombre as file_name,
        -----
        'database/json/'||gmd.gmd_nombre||'/'||replace(ca.adetalle_nombre,'.pdf','.json') as file_content,
        ca.adetalle_peso,
        '[]'::jsonb AS ruta
        --,ca.children
        , case when pa.captura_id is null
            then 0
            else pa.cant_paginas end 
        , p.plantilla_id
        ,ca.total
        ,ca.id
        ,ca.coincidencia_contenido
        ,ca.pagina
        ,ca.linea
        ,ca.tipo_busqueda
        ,ca.termino
        from datos ca  
        left join proyecto p
            on p.proyecto_id = ca.proyecto_id
        left join generacion_medio_ruta_destino gmrd
            on gmrd.captura_estado = ca.captura_estado
        left join generacion_medio_detalle_captura gmdc
            on gmdc.captura_id = ca.captura_id
        left join generacion_medio_detalle gmd
            on gmd.gmd_id = gmdc.gmd_id
        left join paginas pa 
            on pa.captura_id=gmdc.captura_id
        order by ca.file_id
    )
    select
        file_nombre,
        proyecto_id,
        recepcion_id,
        'database/recepcion_'||(recepcion_id::varchar(10))||'.json' as file_data,
        file_content,
        file_id,
        file_tipo,
        file_padre_id,
        captura_id,
        captura_estado,
        documento_id,
        plantilla_nombre,
        items,
        adetalle_nombre,
        file_name,
        usuario_nombre,
        created_at,
        adetalle_peso,
        --children,
    case
        when ruta = '[null]'::jsonb
            then '[]'::jsonb
        else
            ruta
    end as ruta
        ,cant_paginas
        --,plantilla_id
        ,'database/plantilla_'||(plantilla_id::varchar(10))||'.json' as plantilla_file
        ,total
        ,id
        ,coincidencia_contenido
        ,pagina
        ,linea
        ,tipo_busqueda
        ,termino
    from datos2
    ;
    `,
	busquedaAvanzada: `
    with recursive
    datos_input as(
         select 
            $1::int as proyecto_id_input
            ,$2::int as recepcion_id_input
            ,$3::int as file_id_input
            ,$4::jsonb as json_data
            ,$5::int as rowsxpag
            ,$6::int as pag
    ),
    
    --proceso el json para tener rows con todos los datos necesarios
    json_input_pre as (
    select
    row_number() over() as id,
    (indices.dato#>>'{indice,elemento_id}')::int as elemento_id,
    (condiciones.cond#>>'{tipo}')::int as tipo,
    condiciones.cond#>>'{valor}'as valor,
    (condiciones.cond#>>'{negation}')::boolean as negation,
    condiciones.cond#>>'{operador}'as operador
    from datos_input,jsonb_array_elements(datos_input.json_data) as indices(dato),jsonb_array_elements(dato#>'{condiciones}') as condiciones(cond)
    ),
    --añado las columnas ultimo_id y operador_after
    json_input as (
        select a.*
        ,max(a.id) over() as ultimo_id
        ,case when a.id=1 or b.id is null then 'AND'
            else b.operador end as operador_after
        from json_input_pre a
        left join json_input_pre b on b.id=a.id+1
    ),
    --separo el muestreo de files que esten dentro del file o proyecto seleccionado en el input
    files_muestreo_pre as (
        select f.*
        from datos_input di
        cross join files f
        left join recepcion r on r.recepcion_id = f.recepcion_id
        where  f.file_id = di.file_id_input 
            or( di.file_id_input=0 and f.file_padre_id is null and f.file_captura_estado =1 and r.proyecto_id =di.proyecto_id_input) 
        
        union all
        
        select f.*
        from files_muestreo_pre fm
        join files f on f.file_padre_id = fm.file_id
    ),
    files_muestreo as (
        select f.*
            ,c.captura_id 
            ,i.indizacion_id
        from files_muestreo_pre f
        join captura c on c.captura_file_id = f.file_id
        join indizacion i on i.captura_id = c.captura_id and i.indizacion_tipo = 'VF'
        where f.file_tipo = 'f'
    ),
    resultado_busqueda_pre as (
        select 
        f.file_id
        ,f.captura_id
        ,f.indizacion_id
        ,co.*
        ,(
            case 
                --para tipo de dato normal
                --when co.tipo = 4 and co.negation is false then (r.valor ilike '%'||co.valor||'%')
                when co.tipo = 4 and co.negation is false then (r.valor ~* co.valor)
                --when co.tipo = 4 and co.negation is true then not (r.valor ilike '%'||co.valor||'%')
                when co.tipo = 4 and co.negation is true then not (r.valor ~* co.valor)
                --para tipo de dato fecha ...falta ajustar para distintos tipos de formatos de fecha
                when co.tipo = 3 and co.negation is false then 
                    ( TO_DATE(r.valor,'DD/MM/YYYY') between TO_DATE(split_part(co.valor, ' - ', 1) ,'DD/MM/YYYY')
                        and TO_DATE(split_part(co.valor, ' - ', 2) ,'DD/MM/YYYY')
                        )
                when co.tipo = 3 and co.negation is true then 
                    not ( TO_DATE(r.valor,'DD/MM/YYYY') between TO_DATE(split_part(co.valor, ' - ', 1) ,'DD/MM/YYYY')
                        and TO_DATE(split_part(co.valor, ' - ', 2) ,'DD/MM/YYYY')
                        )
                else false::boolean end
        ) as resultado_condicion
        from (select * from json_input where id=1) as co
        cross join files_muestreo f 
        join respuesta r on f.indizacion_id = r.indizacion_id and r.elemento_id = co.elemento_id
        where 
        --resultado de la condicion
        (
            case 
                --para tipo de dato normal
                when co.tipo = 4 and co.negation is false then (r.valor ~* co.valor)
                when co.tipo = 4 and co.negation is true then not (r.valor ~* co.valor)
                --para tipo de dato fecha ...falta ajustar para distintos tipos de formatos de fecha
                when co.tipo = 3 and co.negation is false then 
                    ( TO_DATE(r.valor,'DD/MM/YYYY') between TO_DATE(split_part(co.valor, ' - ', 1) ,'DD/MM/YYYY')
                        and TO_DATE(split_part(co.valor, ' - ', 2) ,'DD/MM/YYYY')
                        )
                when co.tipo = 3 and co.negation is true then 
                    not ( TO_DATE(r.valor,'DD/MM/YYYY') between TO_DATE(split_part(co.valor, ' - ', 1) ,'DD/MM/YYYY')
                        and TO_DATE(split_part(co.valor, ' - ', 2) ,'DD/MM/YYYY')
                        )
                else false::boolean end
        )
            and co.operador_after = 'AND'
            or co.operador_after = 'OR'
        --agregamos la union para la recursividad..............................................
        union all
        --agregamos la union para la recursividad..............................................
        select 
        f.file_id
        ,f.captura_id
        ,f.indizacion_id
        ,co.*
        ,(
            case 
                --para tipo de dato normal
                when co.tipo = 4 and co.negation is false then (r.valor ~* co.valor)
                when co.tipo = 4 and co.negation is true then not (r.valor ~* co.valor)
                --para tipo de dato fecha ...falta ajustar para distintos tipos de formatos de fecha
                when co.tipo = 3 and co.negation is false then 
                    ( TO_DATE(r.valor,'DD/MM/YYYY') between TO_DATE(split_part(co.valor, ' - ', 1) ,'DD/MM/YYYY')
                        and TO_DATE(split_part(co.valor, ' - ', 2) ,'DD/MM/YYYY')
                        )
                when co.tipo = 3 and co.negation is true then 
                    not ( TO_DATE(r.valor,'DD/MM/YYYY') between TO_DATE(split_part(co.valor, ' - ', 1) ,'DD/MM/YYYY')
                        and TO_DATE(split_part(co.valor, ' - ', 2) ,'DD/MM/YYYY')
                        )
                else false::boolean end
        ) as resultado_condicion
        from (select * from resultado_busqueda_pre where not (resultado_condicion is true and operador_after ='OR' )) f
        join json_input co on co.id=f.id+1
        join respuesta r on f.indizacion_id = r.indizacion_id and r.elemento_id = co.elemento_id
        where 
        --resultado de la condicion
        (
            case 
                --para tipo de dato normal
                when co.tipo = 4 and co.negation is false then (r.valor ~* co.valor)
                when co.tipo = 4 and co.negation is true then not (r.valor ~* co.valor)
                --para tipo de dato fecha ...falta ajustar para distintos tipos de formatos de fecha
                when co.tipo = 3 and co.negation is false then 
                    ( TO_DATE(r.valor,'DD/MM/YYYY') between TO_DATE(split_part(co.valor, ' - ', 1) ,'DD/MM/YYYY')
                        and TO_DATE(split_part(co.valor, ' - ', 2) ,'DD/MM/YYYY')
                        )
                when co.tipo = 3 and co.negation is true then 
                    not ( TO_DATE(r.valor,'DD/MM/YYYY') between TO_DATE(split_part(co.valor, ' - ', 1) ,'DD/MM/YYYY')
                        and TO_DATE(split_part(co.valor, ' - ', 2) ,'DD/MM/YYYY')
                        )
                else false::boolean end
        )
            and co.operador_after = 'AND'
            or co.operador_after = 'OR'
    ),
    --filtro final del resultado
    resultado_busqueda as (
        select distinct
        r.*,
        count(r.file_id) over() as total
        from resultado_busqueda_pre r
        where 
            r.resultado_condicion is true
            and (r.id = r.ultimo_id or r.operador_after = 'OR')
        order by r.file_id
        LIMIT (select rowsxpag from datos_input)
        OFFSET (((select pag from datos_input)-1) * (select rowsxpag from datos_input))
    ),
    --select * from resultado_busqueda;
    files_r as (
        select
        row_number() over(order by r.file_id) as id,
        f.*,
        di.*,
        false as coincidencia_contenido,
        '' as pagina,
        '' as linea,
        'ba' as tipo_busqueda,
        r.total
        from resultado_busqueda r
        cross join datos_input di
        join files_muestreo f on f.file_id = r.file_id
        order by r.file_id
    ),
    --consigo la cantidad de paginas de cada documento
    paginas as (
            --select 0 as captura_id,0 as captura_file_id,0 as cant_paginas
            select 
            c.captura_id
            ,c.captura_file_id
            ,count(b.imagen_id) as cant_paginas
            from files_r a
            join captura c on c.captura_file_id = a.file_id
            left join imagen b on b.captura_id = c.captura_id and b.imagen_estado = 1
            group by c.captura_id,c.captura_file_id
    ),
    cabecera AS(
        select
        --distinct
            fi.file_id,
            fi.file_nombre,
            pro.proyecto_id,
            re.recepcion_id,
            fi.file_tipo,
            --fi.file_padre_id,
            case when fi.file_captura_estado != 1 then fi.recepcion_id*-1000
            else fi.file_padre_id end as file_padre_id,
            ca.captura_id,
            ca.captura_estado,
            doc.documento_id,
            pla.plantilla_nombre,
            ad.adetalle_nombre,
            ad.adetalle_url ,
            ad.adetalle_peso
            ,p.persona_nombre||' '||p.persona_apellido as usuario_nombre
            ,to_char(ca.created_at,'DD/MM/YYYY - HH24:MI:SS') as created_at
            ,fi.id
            ,fi.coincidencia_contenido
            ,fi.pagina
            ,fi.linea
            ,fi.tipo_busqueda
            ,fi.total
            from proyecto pro
            join plantilla pla
            on pla.plantilla_id= pro.plantilla_id
            join recepcion re
            on pro.proyecto_id= re.proyecto_id
            --join files_final fi
            join files_r fi
            on fi.recepcion_id = re.recepcion_id
            left join captura  ca
            on ca.captura_file_id = fi.file_id
            left join documento doc
            on doc.captura_id= ca.captura_id
            left join adetalle ad
            on ad.adetalle_id = doc.adetalle_id
            --join para obtener el nombre del usuario
            left join persona p
                on ca.usuario_creador = p.usuario_id

    ),
    datos_pre as (
        select --distinct
            ca.file_nombre,
            ca.proyecto_id,
            ca.recepcion_id,
            ca.file_id,
            ca.file_tipo,
            ca.file_padre_id,
            ca.captura_id,
            ca.captura_estado,
            ca.documento_id,
            ca.plantilla_nombre,
            ca.adetalle_nombre,
            ca.adetalle_url,
            ca.adetalle_peso,
            ca.usuario_nombre,
            ca.created_at,
            --jsonb_agg(
                case when res.respuesta_id is null
                    then null
                else
                    json_build_object(
                    'respuesta_id', res.respuesta_id,
                    'opcion_id', res.opcion_id,
                    'combo_id', res.combo_id,
                    'elemento_id', res.elemento_id,
                    'elemento_tipo', res.elemento_tipo,
                    'plantilla_id', res.plantilla_id,
                    'valor', res.valor,
                    'indizacion_id', res.indizacion_id,
                    'conca_id', res.conca_id,
                    'simple_tipo_dato', s.simple_tipo_dato,
                    'simple_tipo_formato', s.simple_tipo_formato,
                    'elemento_nombre', e.elemento_nombre,
                    'opcion_nombre', o.opcion_nombre
                )::jsonb
            end as item
            --)
            --over (partition by ca.file_id) AS items
            --,ca.children
            ,res.elemento_id
            ,ca.id
            ,ca.coincidencia_contenido
            ,ca.pagina
            ,ca.linea
            ,ca.tipo_busqueda
            ,ca.total
            from cabecera ca  left join indizacion ind
            on ca.captura_id = ind.captura_id and ind.indizacion_tipo ='VF'
            left join  respuesta res
            on res.indizacion_id = ind.indizacion_id
            left join elemento e
            on e.elemento_id = res.elemento_id
            left join simple s
            on s.elemento_id = res.elemento_id
            left join opcion o
            on o.opcion_id = res.opcion_id  
    ),
    datos as(
        select distinct
        a.file_nombre,
        a.proyecto_id,
        a.recepcion_id,
        a.file_id,
        a.file_tipo,
        a.file_padre_id,
        a.captura_id,
        a.captura_estado,
        a.documento_id,
        a.plantilla_nombre,
        a.adetalle_nombre,
        a.adetalle_url,
        a.adetalle_peso,
        a.usuario_nombre,
        a.created_at,
        jsonb_agg(
            a.item
        )
        over(partition by a.file_id)
        as items
        ,a.id
        ,a.coincidencia_contenido
        ,a.pagina
        ,a.linea
        ,a.tipo_busqueda
        ,a.total
        from
            (select * from datos_pre order by file_id,tipo_busqueda,id,elemento_id) a
    ),
    datos2 as (
    select --distinct
        ca.file_nombre,
        ca.proyecto_id,
        ca.recepcion_id,
        ca.file_id,
        ca.file_tipo,
        ca.file_padre_id,
        ca.captura_id,
        ca.captura_estado,
        ca.documento_id,
        ca.plantilla_nombre,
        ca.usuario_nombre,
        ca.created_at,
        case
                when ca.items = '[null]'::jsonb
                    then '[]'::jsonb
                else
                    ca.items
        end as items,
        ca.adetalle_nombre,
        '/'||gmd.gmd_nombre||'/'||gmrd.gmrd_ruta||ca.adetalle_nombre as file_name,
        -----
        'database/json/'||gmd.gmd_nombre||'/'||replace(ca.adetalle_nombre,'.pdf','.json') as file_content,
        ca.adetalle_peso,
        '[]'::jsonb AS ruta
        --,ca.children
        , case when pa.captura_id is null
            then 0
            else pa.cant_paginas end 
        , p.plantilla_id
        ,ca.total
        ,ca.id
        ,ca.coincidencia_contenido
        ,ca.pagina
        ,ca.linea
        ,ca.tipo_busqueda
        from datos ca  
        left join proyecto p
            on p.proyecto_id = ca.proyecto_id
        left join generacion_medio_ruta_destino gmrd
            on gmrd.captura_estado = ca.captura_estado
        left join generacion_medio_detalle_captura gmdc
            on gmdc.captura_id = ca.captura_id
        left join generacion_medio_detalle gmd
            on gmd.gmd_id = gmdc.gmd_id
        left join paginas pa 
            on pa.captura_id=gmdc.captura_id
        order by ca.file_id
    )
    select
        file_nombre,
        proyecto_id,
        recepcion_id,
        'database/recepcion_'||(recepcion_id::varchar(10))||'.json' as file_data,
        file_content,
        file_id,
        file_tipo,
        file_padre_id,
        captura_id,
        captura_estado,
        documento_id,
        plantilla_nombre,
        items,
        adetalle_nombre,
        file_name,
        usuario_nombre,
        created_at,
        adetalle_peso,
        --children,
    case
        when ruta = '[null]'::jsonb
            then '[]'::jsonb
        else
            ruta
    end as ruta
        ,cant_paginas
        --,plantilla_id
        ,'database/plantilla_'||(plantilla_id::varchar(10))||'.json' as plantilla_file
        ,total
        ,id
        ,coincidencia_contenido
        ,pagina
        ,linea
        ,tipo_busqueda
    from datos2
    ;
    `,
    listarFilesContenido: `
    with    
        files_final as (
        --archivos caso normal
        select
        f.file_id
        ,f.recepcion_id
        ,f.file_nombre
        ,f.file_tipo
        --,f.file_padre_id
        ,case when f.file_captura_estado != 1 then f.recepcion_id*-1000
        else f.file_padre_id end as file_padre_id
        ,f.file_captura_estado
        ,f.file_estado
        ,f.file_usuario_id
        ,f.created_at
        ,f.updated_at
        from files f
        left join captura b  on f.file_id = b.captura_file_id
        where f.file_id = ANY($1::int[])
    ),
    cabecera AS(
        select
        
            fi.file_id,
            fi.file_nombre,
            pro.proyecto_id,
            re.recepcion_id,
            fi.file_tipo,
            fi.file_padre_id,
            ca.captura_id,
            ca.captura_estado,
            doc.documento_id,
            pla.plantilla_nombre,
            ad.adetalle_nombre,
            ad.adetalle_url ,
            ad.adetalle_peso
            ,p.persona_nombre||' '||p.persona_apellido as usuario_nombre
            ,to_char(ca.created_at,'DD/MM/YYYY - HH24:MI:SS') as created_at
            from proyecto pro
            join plantilla pla
            on pla.plantilla_id= pro.plantilla_id
            join recepcion re
            on pro.proyecto_id= re.proyecto_id
            join files_final fi
            on fi.recepcion_id = re.recepcion_id
            left join captura  ca
            on ca.captura_file_id = fi.file_id
            left join documento doc
            on doc.captura_id= ca.captura_id
            left join adetalle ad
            on ad.adetalle_id = doc.adetalle_id
            --join para obtener el nombre del usuario
            left join persona p
                on ca.usuario_creador = p.usuario_id
            
    ),
    datos_pre as (
        select 
            ca.file_nombre,
            ca.proyecto_id,
            ca.recepcion_id,
            ca.file_id,
            ca.file_tipo,
            ca.file_padre_id,
            ca.captura_id,
            ca.captura_estado,
            ca.documento_id,
            ca.plantilla_nombre,
            ca.adetalle_nombre,
            ca.adetalle_url,
            ca.adetalle_peso,
            ca.usuario_nombre,
            ca.created_at,
            --jsonb_agg(
                case when res.respuesta_id is null
                    then null
                else
                    json_build_object(
                    'respuesta_id', res.respuesta_id,
                    'opcion_id', res.opcion_id,
                    'combo_id', res.combo_id,
                    'elemento_id', res.elemento_id,
                    'elemento_tipo', res.elemento_tipo,
                    'plantilla_id', res.plantilla_id,
                    'valor', res.valor,
                    'indizacion_id', res.indizacion_id,
                    'conca_id', res.conca_id,
                    'simple_tipo_dato', s.simple_tipo_dato,
                    'simple_tipo_formato', s.simple_tipo_formato,
                    'elemento_nombre', e.elemento_nombre,
                    'opcion_nombre', o.opcion_nombre
                )::jsonb
            end as item
            ,res.elemento_id
            from cabecera ca  left join indizacion ind
            on ca.captura_id = ind.captura_id and ind.indizacion_tipo ='VF'
            left join  respuesta res
            on res.indizacion_id = ind.indizacion_id
            left join elemento e
            on e.elemento_id = res.elemento_id
            left join simple s
            on s.elemento_id = res.elemento_id
            left join opcion o
            on o.opcion_id = res.opcion_id  
    ),
    datos as(
        select distinct
        a.file_nombre,
        a.proyecto_id,
        a.recepcion_id,
        a.file_id,
        a.file_tipo,
        a.file_padre_id,
        a.captura_id,
        a.captura_estado,
        a.documento_id,
        a.plantilla_nombre,
        a.adetalle_nombre,
        a.adetalle_url,
        a.adetalle_peso,
        a.usuario_nombre,
        a.created_at,
        jsonb_agg(
            a.item
        )
        over(partition by a.file_id)
        as items
        from
            (select * from datos_pre order by file_id,elemento_id) a
    ),
    datos2 as (
    select --distinct
        ca.file_nombre,
        ca.proyecto_id,
        ca.recepcion_id,
        ca.file_id,
        ca.file_tipo,
        ca.file_padre_id,
        ca.captura_id,
        ca.captura_estado,
        ca.documento_id,
        ca.plantilla_nombre,
        ca.usuario_nombre,
        ca.created_at,
        case
                when ca.items = '[null]'::jsonb
                    then '[]'::jsonb
                else
                    ca.items
        end as items,
        ca.adetalle_nombre,
        '/'||gmd.gmd_nombre||'/'||gmrd.gmrd_ruta||ca.adetalle_nombre as file_name,
        'database/json/'||gmd.gmd_nombre||'/'||replace(ca.adetalle_nombre,'.pdf','.json') as file_content,
        ca.adetalle_peso
        , p.plantilla_id
        from datos ca  
        left join proyecto p
            on p.proyecto_id = ca.proyecto_id
        left join generacion_medio_ruta_destino gmrd
            on gmrd.captura_estado = ca.captura_estado
        left join generacion_medio_detalle_captura gmdc
            on gmdc.captura_id = ca.captura_id
        left join generacion_medio_detalle gmd
            on gmd.gmd_id = gmdc.gmd_id
    )
    select
        file_nombre,
        proyecto_id,
        recepcion_id,
        'database/recepcion_'||(recepcion_id::varchar(10))||'.json' as file_data,
        file_content,
        file_id,
        file_tipo,
        file_padre_id,
        captura_id,
        captura_estado,
        documento_id,
        plantilla_nombre,
        items,
        file_name,
        'database/plantilla_'||(plantilla_id::varchar(10))||'.json' as plantilla_file
    from datos2
    ;
    `
}