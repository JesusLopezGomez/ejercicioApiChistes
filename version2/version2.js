let fs = require("fs");

const request = require('request');
const { json } = require("stream/consumers");
const options = {
  method: 'GET',
  url: 'https://icanhazdadjoke.com/search',
  qs: {term: process.argv[2]}, //Aqui le pongo el termino que busco
  headers: {Accept: 'application/json'} //Acepto json
};



let prompt = require('prompt');
prompt.start();

prompt.get(['termino'], function (err, result) {
    if(result.termino == "leaderboard"){
        fs.readFile("chistes.txt",(err, data)=> {
            if(err) throw err;
            let mapa = {};
            let array = data.toString().split("\n").sort();
            array.forEach((chiste) => {
                if(!mapa.hasOwnProperty(chiste)){
                    mapa[chiste] = {cantidad:0};
                }
                mapa[chiste].cantidad++;
            });
            
            let cantidadMayor = 0;
            let chistePopular = "";
           
            /*for(chiste in mapa){
                if(mapa[chiste].cantidad > cantidadMayor){
                    cantidadMayor = mapa[chiste].cantidad;
                    chistePopular = chiste;
                }
            }*/

            //Otra forma de recorre un mapa
            Object.entries(mapa).forEach(([key, value]) => {
                if(value.cantidad > cantidadMayor){
                    cantidadMayor = value.cantidad;
                    chistePopular = key;
                }else if(value.cantidad == cantidadMayor){
                    chistePopular = key;
                }
            });
            console.log(chistePopular);
        });
    }else{
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
              let chistes = JSON.parse(body).results;
              if(chistes.length > 0){ //Si hay chistes lo recorro
                    fs.appendFile("chistes.txt",`${chistes[Math.floor(Math.random() * chistes.length)].joke} \n`,(err) => { //Por cada chiste le añado el chiste con un salto de linea
                        if(err) throw err;
                    });
              }else{ //Si no muestro el error
                  console.log("No se encotraron chiste con ese termino de busqueda");
              }
          });
    }

});