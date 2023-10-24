//Para este ejercicio, vamos a construir una herramienta simple de línea de comandos que nos permitirá realizar una solicitud a una API 
//y almacenar los datos en un archivo de texto. Utilizaremos los siguientes módulos:

//fs - para leer y escribir en un archivo.
//process - para recopilar argumentos desde la línea de comandos.
//request - para realizar solicitudes a una API (este es un módulo externo).
//Esta aplicación debe aceptar un argumento de línea de comandos utilizando process.argv. 
//El argumento de línea de comandos debe ser un término de búsqueda y su aplicación debe hacer una solicitud a 
//la API de chistes de papá para buscar un chiste basado en el término de búsqueda. Si encuentra chistes que 
//coinciden con el término, debe mostrar un chiste al azar y también guardar el chiste en un archivo llamado chistes.txt.
//Si no encuentra un chiste, debe registrar un mensaje en la consola que informe al usuario que no se encontraron chistes para ese término de búsqueda.
const { error } = require("console");
const fs = require("fs");
const process = require("process");

/*fs.writeFile("chistes.txt","",(error) =>{
    if(error) throw error;
    console.log("Fichero creado correctamente");
})*/ //Esto lo comento porque si no me crea el fichero de nuevo cada vez que ejecuto el script

const request = require('request');
const { json } = require("stream/consumers");
const options = {
  method: 'GET',
  url: 'https://icanhazdadjoke.com/search',
  qs: {term: process.argv[2]}, //Aqui le pongo el termino que busco
  headers: {Accept: 'application/json'} //Acepto json
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);
    let chistes = JSON.parse(body).results;
    if(chistes.length > 0){ //Si hay chistes lo recorro
        for(let chiste in chistes){
            fs.appendFile("chistes.txt",`${chistes[chiste].joke} \n`,(err) => { //Por cada chiste le añado el chiste con un salto de linea
                if(err) throw err;
            })
        }
    }else{ //Si no muestro el error
        console.log("No se encotraron chiste con ese termino de busqueda");
    }
});
