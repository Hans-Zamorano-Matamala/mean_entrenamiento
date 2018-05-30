'use strict'
var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var mongoosePaginate = require('mongoose-pagination');

function getAlbum(req, res){
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album)=> {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!album){
                res.status(404).send({message: 'El album no existe'});
            }else{
                res.status(200).send({album});
            }
        }
    });

}
function saveAlbum(req, res){
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    //artista es un id!
    album.artist = params.artist;

    
    album.save((err, albumStored) => {
        if (err){
            res.status(500).send({message: 'Error al guardar el album'});
        }else{
            if(!albumStored){
                res.status(404).send({message: 'El album no ha sido guardado'});
            }else{
                res.status(200).send({album: albumStored});
            }
        }
    });
}

/******************* */

function getAlbums(req, res){
    var artistId = req.params.artistId;

    if(!artistId){
        var find = Album.find({}).sort('title');
        //sacar todos los albums de la bd
    }else{
        //solo albums del artista
        var find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err,albums)=> {
        if(err){
            res.status(500).send({message:'Error en la petición'});
        }else{
            if(!albums){
                res.status(404).send({message: "No hay albumes!"});
            }else{
                return res.status(200).send({albums});
            }
        }
    });
}

function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated)=>{
        if(err){
            res.status(500).send({message:'Error al guardar el album'});
        }else{
            if(!albumUpdated){
                res.status(404).send({message: "El album no ha sido actualizado"});
            }else{
                res.status(200).send({album: albumUpdated});
            }
        }
    })
}

function deleteAlbum(req, res){
    var albumId = req.params.id;
           
    Album.findByIdAndDelete(albumId, (err, albumRemoved) => {
        if(err){
            res.status(500).send({message:'Error al borrar al album', err});
        }else{
            if(!albumRemoved){
                res.status(404).send({message: "El album no existía"});
            }else{ 
                
                Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                    if(err){
                        res.status(500).send({message:'Error al borrar la cancion'});
                    }else{
                        if(!songRemoved){
                            res.status(404).send({message: "La canción no existía"});
                        }else{ 
                            res.status(200).send({message: "album " + albumId +" eliminado", albumRemoved});
                        }
                    }
                });
                    
            }
        }
    });
}

function uploadImage(req, res){
    var albumId = req.params.id;
    var file_name = 'No subido...';

    if (req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[ext_split.length-1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Album.findByIdAndUpdate(albumId, {image: file_name}, (err,albumUpdated) => {
                if(!albumUpdated){
                    res.status(404).send({message: 'no se ha podido actualizar el album'});
                }else{
                    res.status(200).send({album: albumUpdated});
                }
            })
        }else{
            res.status(200).send({message: 'Extensión incorrecta'});
        }
    }else{
        res.status(200).send({message: 'No has subido ninguna imagen...'});
    }
}
//obtener imagen del album
function getImageFile(req,res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albums/'+imageFile;
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe la imagen del album...'});
        }
    });
}

module.exports ={
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};