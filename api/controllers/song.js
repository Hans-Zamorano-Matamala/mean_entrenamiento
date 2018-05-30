'use strict'
var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var mongoosePaginate = require('mongoose-pagination');


function getSong(req, res){
    var songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec((err, song)=> {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!song){
                res.status(404).send({message: 'La canción no existe'});
            }else{
                res.status(200).send({song});
            }
        }
    });

}

function saveSong(req, res){
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    //album es un id!
    song.album = params.album;

    
    song.save((err, songStored) => {
        if (err){
            res.status(500).send({message: 'Error al guardar song'});
        }else{
            if(!songStored){
                res.status(404).send({message: 'El song no ha sido guardado'});
            }else{
                res.status(200).send({song: songStored});
            }
        }
    });
}
function getSongs(req, res){
    var albumId = req.params.albumId;

    if(!albumId){
        var find = Song.find({}).sort('number');
        //sacar todos los albums de la bd
    }else{
        //solo albums del artista
        var find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
        path: 'album', 
        populate: {
            path:'artist',
             model: 'Artist'
            }
        }).exec((err,songs)=>{
        if(err){
            res.status(500).send({message:'Error en la petición'});
        }else{
            if(!songs){
                res.status(404).send({message: "No hay canciones!"});
            }else{
                return res.status(200).send({songs});
            }
        }
    });
}
function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated)=>{
        if(err){
            res.status(500).send({message:'Error al guardar la cancion'});
        }else{
            if(!songUpdated){
                res.status(404).send({message: "La cancion no ha sido actualizada"});
            }else{
                res.status(200).send({song: songUpdated});
            }
        }
    })
}

function deleteSong(req, res){
    var songId = req.params.id;
           
    Song.findByIdAndDelete(songId, (err, songRemoved) => {
        if(err){
            res.status(500).send({message:'Error al borrar la cancion'});
        }else{
            if(!songRemoved){
                res.status(404).send({message: "La canción no existía"});
            }else{ 
                res.status(200).send({songRemoved});
            }
        }
    });
}

function uploadFile(req, res){
    var songId = req.params.id;
    var file_name = 'No subido...';

    if (req.files){
        var file_path = req.files.file.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[ext_split.length-1];

        if(file_ext == 'mp3' || file_ext == 'ogg' || file_ext == 'wav'){
            Song.findByIdAndUpdate(songId, {file: file_name}, (err,songUpdated) => {
                if(!songUpdated){
                    res.status(404).send({message: 'no se ha podido actualizar la cancion', err, songUpdated});
                }else{
                    res.status(200).send({song: songUpdated});
                }
            })
        }else{
            res.status(200).send({message: 'Extensión incorrecta'});
        }
    }else{
        res.status(200).send({message: 'No has subido ningun archivo...'});
    }
}
//obtener imagen del album
function getFile(req,res){
    var file = req.params.imageFile;
    var path_file = './uploads/songs/'+file;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe el fichero de audio...'});
        }
    });
}

module.exports ={
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getFile
};