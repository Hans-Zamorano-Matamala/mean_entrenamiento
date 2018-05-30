'use strict'

var express = require('express');
var SongController = require('../controllers/song');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir: './uploads/songs'});

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:albumId?', md_auth.ensureAuth, SongController.getSongs)
api.put('/update-song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong)


api.post('/upload-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-song/:imageFile', SongController.getFile);

module.exports = api;