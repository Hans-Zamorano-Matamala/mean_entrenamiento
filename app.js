'use strict'
/*

módulo

- rutas y url

*/
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//http headers

// rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);

//permitir que elementos externos usen express (las rutas bases y ajustes)
module.exports = app;