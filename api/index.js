'use strict'
/*

elemento principal:

- contiene conexión a la app y bd

*/

var mongoose = require('mongoose');
var app = require('./app');
var port= process.env.PORT || 3977;

mongoose.connect('mongodb://icluster:1c1u57312@localhost:27017/entreno_mean?authSource=admin', (err, res)=> {
    if (err){
        throw err;
    }else{
        console.log("Conexión completa");

        app.listen(port, function(){
            console.log("mongoose activo");
            console.log("api rest escuchando en el puerto "+port);
        })
    }
    }
);