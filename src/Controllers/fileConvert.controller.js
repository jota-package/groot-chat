const UTIF = require('utif');
const {jsPDF} = require('jspdf');
const Jimp = require('jimp');
const fs = require('fs');
const https = require('https');
const path = require('path');
const gm = require('gm');

const zipper = require('zip-local');

require('events').EventEmitter.prototype._maxListeners = 100;

const respuesta = require('../Controllers/respuesta');

require('dotenv').config();

const download2PDF = (req, res) => {
    
    let {filepath} = req.query;
    let file = filepath.split(".");
    let extension = file.pop();
    extension = extension.toLowerCase();

    switch (extension) {
        case "jpg":
        case "jpeg":
        case "png":
            img2PDF(filepath, (response)=>{
                returnFile(res, response);
            });
            break;
        case "pdf":
            res.status(400).json(respuesta.ok("No es necesario convertir el archivo."));
            // self.saveFile(config.storage_path(filepath), filename + "." + extension);
            break;
        case "tiff":
        case "tif":
            tiff2PDF(filepath, (response)=>{
                returnFile(res, response);
            });
            break;
        default:
            res.status(400).json(respuesta.error("Este documento no puede ser convertido."));
            break;
    }
};

const download2TIFF = (req, res) => {
    let {filepath} = req.query;
    let file = filepath.split(".");
    let extension = file.pop();
    extension = extension.toLowerCase();

    switch (extension) {
        case "jpg":
        case "jpeg":
        case "png":
            img2tiff(filepath, (response)=>{
                returnFile(res, response);
            });
            break;
        case "pdf":
            PDF2tiff(filepath, (response)=>{
                returnFile(res, response);
            });
            break;
        case "tiff":
        case "tif":
            res.status(200).json(respuesta.ok("No es necesario convertir el archivo."));
            // self.saveFile(config.storage_path(filepath), filename + "." + extension);
            break;
        default:
            res.status(200).json(respuesta.error("Este documento no puede ser convertido."));
            break;
    }
};

const download2IMG = (req, res) => {
    let {filepath} = req.query;
    let file = filepath.split(".");
    let extension = file.pop();
    extension = extension.toLowerCase();

    switch (extension) {
        case "jpg":
        case "jpeg":
        case "png":
            res.status(200).json(respuesta.ok("No es necesario convertir."));
            // self.PDF2tiff(config.attachment_path(filepath), filename);
            break;
        case "pdf":
            PDF2img(filepath, (response)=>{
                returnFile(res, response);
            });
            break;
        case "tiff":
        case "tif":
            tiff2img(filepath, (response)=>{
                returnFile(res, response);
            });
            break;
        default:
            res.status(200).json(respuesta.error("Este documento no puede ser convertido."));
            break;
    }
};

const testeo = (req, res) => {
    res.status(200).json(respuesta.ok("queda"));
};

module.exports = {
    download2PDF,
    download2TIFF,
    download2IMG,
    testeo
};

const returnFile = function (res, fileInfo){
    if(fileInfo.estado){
        try {
            let {filepath_nuevo:filepath, filename_original:filename} = fileInfo.payload;
            res.download(filepath,filename, (err)=>{
                if (err) {
                    // Handle error, but keep in mind the response may be partially-sent
                    // so check res.headersSent
                } else {
                    fs.unlinkSync(filepath);
                }
            });
        } catch (error) {
            console.log(error);
            res.writeHead(400, {"Content-Type": "text/plain"});
            res.end("El archivo no pudo ser generado.");
        }
    } else {
        console.log(fileInfo);
        res.writeHead(400, {"Content-Type": "text/plain"});
        res.end("ERROR File does NOT Exist.");
    }
}

const img2tiff = (filepath, callback) => {
    let original_file = filepath.split("/").pop().split(".");
    original_file.pop();
    original_file = original_file.join(".");
    let extension = ".tiff";

    Jimp.read(filepath)
        .then(image => {
            
            let tiffile = UTIF.encodeImage(image.bitmap.data, image.bitmap.width, image.bitmap.height);
            // var file = new Blob([tiffile], { type: "image/tif" });
            let file = Buffer.from(tiffile);
            let filename = nameGenerator(10)+extension;
            let ruta = path.join(__dirname, '../tmp/'+filename);

            fs.writeFile(ruta, file, function(err) {
                if(err) {
                    console.log(err);
                    callback(respuesta.error("No se ha logrado crear al archivo."));
                } else {
                    callback(respuesta.ok({
                        filepath_nuevo : ruta,
                        filename_original: original_file+extension
                    }));
                }
            });
        })
        .catch(err => {
            console.log(err);
            callback(respuesta.error("No se ha logrado consegir la imagen."));
        });
};

const img2PDF = (filepath, callback) => {
    let original_file = filepath.split("/").pop().split(".");
    original_file.pop();
    original_file = original_file.join(".");
    let extension = ".pdf";

    Jimp.read(filepath)
        .then(image => {
            
            const pdf = new jsPDF('p', 'mm', [(image.bitmap.width*1.3), (image.bitmap.height * 1.3)]);
            
            image.getBase64(Jimp.MIME_JPEG, function (err, src) {

                pdf.addImage(src, 'JPEG', 0, 0, image.bitmap.width, image.bitmap.height); //sizings here
                let filename = nameGenerator(10)+extension;
                let ruta = path.join(__dirname, '../tmp/'+filename);
                console.log(ruta);
                pdf.save(ruta);
                
                callback(respuesta.ok({
                    filepath_nuevo : ruta,
                    filename_original: original_file+extension
                }));
            });
        })
        .catch(err => {
            console.log(err);
            callback(respuesta.error("No se ha logrado consegir la imagen."));
        });
};

const tiff2PDF = function(filepath, callback){
    let original_file = filepath.split("/").pop().split(".");
    original_file.pop();
    original_file = original_file.join(".");
    let extension = ".pdf";

    tiff2ArrayBuffer(filepath, async function(pages, data) {
        if(pages.length == 0){
            callback(respuesta.error("No se ha logrado consegir el archivo."));
            return false;
        }

        let numPages = pages.length;
        let paginas_convertidas = 0;
        let scale = 1;
        const pdf = new jsPDF('p', 'mm', [(pages[0].t256[0]*scale), (pages[0].t257[0] * scale)]);
        let pos_byte = 0;
        let sizeExtraPage = tiffsizeExtraPage(pages, data);

        for(let page of pages){
            let page_data = tiffPage2RGBA(data, page, pos_byte);
            
            if(page_data.rgba.length != 0){
                let image = await RGBA2Base64(page_data);
                if (paginas_convertidas == 0) {
                    pdf.addImage(image.src, 'JPEG', 0, 0, image.width, image.height); //sizings here
                } else {
                    pdf.addPage([(image.width*scale), (image.height * scale)]);
                    pdf.setPage(paginas_convertidas + 1);
                    pdf.addImage(image.src, 'JPEG', 0, 0, image.width, image.height); //sizings here
                }
                paginas_convertidas++;
                console.log(paginas_convertidas + " Paginas convertidas");
                if(paginas_convertidas >= numPages){
                    let filename = nameGenerator(10)+extension;
                    let ruta = path.join(__dirname, '../tmp/'+filename);
                    console.log(ruta);
                    pdf.save(ruta);
                    callback(respuesta.ok({
                        filepath_nuevo : ruta,
                        filename_original: original_file+extension
                    }));
                }
            }
            pos_byte += page_data.size + sizeExtraPage;
        }
    });
}

const tiff2img = function (filepath, callback){
    let original_file = filepath.split("/").pop().split(".");
    original_file.pop();
    original_file = original_file.join(".");
    let extension = ".zip";

    tiff2ArrayBuffer(filepath, async function(pages, data) {
        if(pages.length == 0){
            callback(respuesta.error("No se ha logrado consegir el archivo."));
            return false;
        }

        let output_dir = nameGenerator(10);
        let ruta_out = path.join(__dirname, '../tmp/'+output_dir);
        if (!fs.existsSync(ruta_out)) {
            try {
                fs.mkdirSync(ruta_out, { recursive: true });
                fs.chmodSync(ruta_out, '2775');
            } catch (err) {
                console.error(err);
                callback(respuesta.error("No se ha podido crear la carpeta contenedora."));
                return false;
            }
        }

        let pos_byte = 0;
        let sizeExtraPage = tiffsizeExtraPage(pages, data);
        let estado_conversion = true;
        for(let i in pages){
            console.log("Convirtiendo pagina "+i);
            let page_data = tiffPage2RGBA(data, pages[i], pos_byte);
            
            if(page_data.rgba.length != 0){
                let ruta_out_file = path.join(__dirname, '../tmp/'+output_dir+'/'+original_file+'_'+i+'.jpg');
                let estado = await saveRGBA(page_data, ruta_out_file);
                if(!estado){
                    estado_conversion = false;
                }
            }
            pos_byte += page_data.size + sizeExtraPage;
        }

        if(!estado_conversion){
            callback(respuesta.error("No se pudo crear todos los archivos."));
            deleteFolderRecursive(ruta_out);
            return false;
        }

        try {
            zipper.sync.zip(ruta_out).compress().save(ruta_out+extension);
            deleteFolderRecursive(ruta_out);
            callback(respuesta.ok({
                        filepath_nuevo : ruta_out+extension,
                        filename_original: original_file+extension
                    }));
        } catch (err) {
            console.error(err);
            callback(respuesta.error("Error con la conversion."));
        }

    });
}

const PDF2tiff = function (filepath, callback){
    let original_file = filepath.split("/").pop().split(".");
    original_file.pop();
    original_file = original_file.join(".");
    let extension = ".tiff";

    https.get(filepath, function(response) {
        let filename = nameGenerator(10)+extension;
        let ruta_out = path.join(__dirname, '../tmp/'+filename);
        console.log("convirtiendo "+filename);
        gm(response, 'file.pdf')
        .density(600, 600)
        .resize(1024)
        .quality(100)
        .write(ruta_out, function(error) {
            if(error) {
                console.error(error);
                callback(respuesta.error("No se ha logrado consegir el archivo."));
            } else {
                callback(respuesta.ok({
                    filepath_nuevo : ruta_out,
                    filename_original: original_file+extension
                }));
            }
        });
    }).on('error', function(e) {
        console.error(e);
        callback(respuesta.error("No se ha encontrado el archivo."));
    });

}

const PDF2img = async function(filepath, callback) {
    let original_file = filepath.split("/").pop().split(".");
    original_file.pop();
    original_file = original_file.join(".");
    let extension = ".zip";

    let numPages = await getPageListPDF(filepath);
    console.log(numPages);
    let pageCicle = 10;
    let output_dir = nameGenerator(10);
    let ruta_out = path.join(__dirname, '../tmp/'+output_dir);
    if (!fs.existsSync(ruta_out)) {
        try {
            fs.mkdirSync(ruta_out, { recursive: true });
            fs.chmodSync(ruta_out, '2775');
        } catch (err) {
            console.error(err);
            callback(respuesta.error("No se ha podido crear la carpeta contenedora."));
            return false;
        }
    }

    let numeroCiclos = parseInt(numPages / pageCicle);
    numeroCiclos = ((numPages % pageCicle) == 0)? numeroCiclos : (numeroCiclos + 1);
    
    console.log("numero de ciclos calculados: "+numeroCiclos);
    let estado_conversion = true;
    for(let i=0; i < numeroCiclos; i++){
        let first_page = (i*pageCicle) +1;
        let estado = await convertPDFPage2IMG (filepath, output_dir, original_file, numPages, first_page, pageCicle);
        if(!estado){
            estado_conversion = false;
        }
    }

    if(!estado_conversion){
        callback(respuesta.error("No se pudo crear todos los archivos."));
        deleteFolderRecursive(ruta_out);
        return false;        
    }

    try {
        
        zipper.sync.zip(ruta_out).compress().save(ruta_out+extension);
        deleteFolderRecursive(ruta_out);
        callback(respuesta.ok({
                    filepath_nuevo : ruta_out+extension,
                    filename_original: original_file+extension
                }));
    } catch (err) {
        console.error(err);
        callback(respuesta.error("Error con la conversion."));
    }

};

const convertPDFPage2IMG = function(filepath, output_dir, output_name, num_pages_pdf, first_page, cant_convert) {
    return new Promise( function(resolve,reject) {
        try {
            if(num_pages_pdf >= first_page){
                console.log("Inicio de la parte "+first_page);
                let estado_conversion = true;
                let cant_page_converted = 0;
            
                let last_page = (num_pages_pdf < (first_page + cant_convert))? num_pages_pdf : (first_page + cant_convert);

                https.get(filepath, function(response) {
                    cant_page_converted = first_page;
                    for(let i=(first_page-1); i<last_page; i++){
                        let ruta_out = path.join(__dirname, '../tmp/'+output_dir+'/'+output_name+'_'+i+'.jpg');
                        gm(response, 'file.pdf ['+i+']')
                        .density(600, 600)
                        .resize(1024)
                        .quality(100)
                        .write(ruta_out, function(error) {
                            if(error) {
                                console.log(error);
                                estado_conversion = false;
                            }
                            cant_page_converted++;
                            if(cant_page_converted > last_page){
                                console.log(cant_page_converted);
                                resolve(estado_conversion);
                            }
                            console.log('Se ha creado la imagen de la pagina '+(i+1)+'!');
                        });
                    }
                }).on('error', function(e) {
                    console.error(e);
                    resolve(false);
                });
            } else {
                resolve(false);
            }
        }
        catch (err) {
            console.error(err);
            resolve(false);
        }
    });
}

const getPageListPDF = function (filepath){
    return new Promise( function(resolve,reject) {
        try {
            https.get(filepath, function(response) {
                gm(response).identify('%p ', function (err, format) {
                    if(err){
                        console.log(err);
                        reject(0);
                    } else {
                        let pageCount = format.toString().match(/[0-9]+/g);
                        resolve(pageCount.length);
                    }
                });
            });
        }
        catch (err) {
            console.error(err);
            reject(0);
        }
    });
}

const deleteFolderRecursive = function(dirpath) {
    if (fs.existsSync(dirpath)) {
        fs.readdirSync(dirpath).forEach((file, index) => {
            const curPath = path.join(dirpath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                try {
                    fs.unlinkSync(curPath);
                    //console.log("Se ha borrado ... " + curPath);
                } catch (err) {
                    return false;
                }
            }
        });
        try {
            fs.rmdirSync(dirpath);
            return true;
        } catch (err) {
            return false;
        }
    }
};


const tiff2RGB = function(filepath, callback){
    
    getTiffFileBinary(filepath, function(data, error){
        let rgbas = [];

        if(error){
            if (typeof callback == "function") {
                callback(rgbas);
            }
            return false;
        }

        const pages = UTIF.decode(data);
        if (pages.length == 0) {
            if (typeof callback == "function") {
                callback(rgbas);
            }
        }
        console.log(pages.length);
        
        if (JSON.stringify(pages[0].t258) == JSON.stringify([16, 16])) {
            var uint8View = new Uint8Array(data);
            let numPages = pages.length;
            let sizeFile = 0;

            for (let page of pages) {
                rgbas.push({
                    width: page.t256[0],
                    height: page.t257[0],
                    size: Number(page.t257[0] * page.t256[0] * 4),
                    rgba: []
                });
                sizeFile += Number(page.t257[0] * page.t256[0] * 4);
            }

            let sizeExtraPage = (uint8View.length - sizeFile - (uint8View.length % 4)) / numPages;
            let pos = 0;

            for (let k in rgbas) {
                for (let i = pos; i < (pos + rgbas[k].size); i += 4) {
                    rgbas[k].rgba.push(uint8View[i]); // cyan
                    rgbas[k].rgba.push(uint8View[i + 1]); // magenta
                    rgbas[k].rgba.push(uint8View[i]); // yellow
                    rgbas[k].rgba.push(255);
                }
                pos += rgbas[k].size + sizeExtraPage;
            }
        } else {
            for (let i = 0; i < pages.length; i++) {
                UTIF.decodeImage(data, pages[i]);
                rgbas.push({
                    width: pages[i].t256[0],
                    height: pages[i].t257[0],
                    size: Number(pages[i].t257[0] * pages[i].t256[0] * 4),
                    rgba: UTIF.toRGBA8(pages[i])
                });
            }
        }
        
        if (typeof callback == "function") {
            callback(rgbas);
        }
        return true;
    });
};

const tiff2ArrayBuffer = function (filepath, callback){
    getTiffFileBinary(filepath, function(data, error){
        if(error){
            if (typeof callback == "function") {
                callback([], null);
            }
            return false;
        }

        const pages = UTIF.decode(data);
        if (typeof callback == "function") {
            callback(pages, data);
        }
        return true;
    });
}

const tiffPage2RGBA = function (data, page, pos_byte){
    let rgba = {
        width: page.t256[0],
        height: page.t257[0],
        size: Number(page.t257[0] * page.t256[0] * 4),
        rgba: []
    };

    if (JSON.stringify(page.t258) == JSON.stringify([16, 16])) {
        var uint8View = new Uint8Array(data);
        for (let i = pos_byte; i < (pos_byte + rgba.size); i += 4) {
            rgba.rgba.push(uint8View[i]); // cyan
            rgba.rgba.push(uint8View[i + 1]); // magenta
            rgba.rgba.push(uint8View[i]); // yellow
            rgba.rgba.push(255);
        }
    } else {
        UTIF.decodeImage(data, page);
        rgba = {
            width: page.t256[0],
            height: page.t257[0],
            size: Number(page.t257[0] * page.t256[0] * 4),
            rgba: UTIF.toRGBA8(page)
        };
    }

    return rgba;
}

const tiffsizeExtraPage = function(pages, data){
    var uint8View = new Uint8Array(data);
    let numPages = pages.length;
    let sizeFile = 0;
        
    for (let page of pages) {
        sizeFile += Number(page.t257[0] * page.t256[0] * 4);
    }
    return (uint8View.length - sizeFile - (uint8View.length % 4)) / numPages;
}

const getTiffFileBinary = function(filepath, callback){
    https.get(filepath, function(res) {
        // res.setEncoding('binary');
        //console.log("convirtiendo");
        let data = [];
        res.on('data', function(chunk) {
            data.push(chunk);
        });

        res.on('end', function() {
            let binary = Buffer.concat(data);
            if (typeof callback == "function") {
                callback(binary, false);
            }
        });
        
        res.on('error', function(err) {
            console.log("Error during HTTP request");
            console.log(err.message);
            if (typeof callback == "function") {
                callback(null, true);
            }
        });
    });
};

const RGBA2Base64 = function (page_data){
    return new Promise( function(resolve,reject) {
        try {
            new Jimp(page_data.width, page_data.height, function (err, image) {
                image.bitmap.data = page_data.rgba;

                image.getBase64(Jimp.MIME_JPEG, function (err, src) {
                    resolve({
                        src : src,
                        width: image.bitmap.width,
                        height: image.bitmap.height
                    });
                });
            });
        }
        catch (err) {
            console.error(err);
            resolve({
                src : "",
                width: 0,
                height: 0
            });
        }
    });
}

const saveRGBA = function (page_data, filename){
    return new Promise( function(resolve,reject) {
        try {
            new Jimp(page_data.width, page_data.height, function (err, image) {
                image.bitmap.data = page_data.rgba;
                image.write(filename, function(){
                    resolve(true);    
                });
            });
        }
        catch (err) {
            console.error(err);
            resolve(false);
        }
    });
}

const nameGenerator = function(num){
    if(typeof num == "undefined"){
        num = 8;
    }

    let caracteres = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    
    for(var i=0; i<num; i++){
        let aleatorio = Math.floor(Math.random()*caracteres.length);
        code += caracteres[aleatorio];
    }
    
    return code;
}