'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir: './uploads/albums'});

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum)

api.get('/albums/:artistId?', md_auth.ensureAuth, AlbumController.getAlbums)
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum)
api.put('/update-album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;