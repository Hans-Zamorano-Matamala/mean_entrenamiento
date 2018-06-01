'use strict'

/*

Rutas para el objeto usuario

*/

var express = require('express');
var UserController = require('../controllers/user');

// crear rutas específicas del objeto usuario en el api rest

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir: './uploads/users'});

api.get('/prueba-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);
//permitir que elementos externos usen las rutas aquí definidas
module.exports = api;