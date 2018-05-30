'use strict'

/*

Modelo/esquema de datos del objeto usuario

*/


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name : String,
    surname: String,
    email: String,
    password: String,
    role: String,
    image: String
});

//permitir que elementos externos usen el esquema definido aquí
module.exports = mongoose.model('User', UserSchema);