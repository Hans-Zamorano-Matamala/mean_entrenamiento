'use strict'

/*

Controlador del objeto usuarios

- inicio de sesión
- tokens

*/

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas (req, res){
    res.status(200).send({
        message:'Probando la accion del controlador de usuarios+jwt'
    });
}
// registrar usuario
function saveUser(req,res){
    var user = new User;

    var params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';


    if(params.password){
        //cifrar clave y guardar
        bcrypt.hash(params.password,null,null,function(err,hash){
            user.password = hash;
            
            if(user.name != null && user.surname != null && user.email != null){
                user.save((err,userStored)=> {
                    console.log(err)
                    if(err){
                        res.status(500).send({message: 'Error al guardar el usuario'});
                    }else{
                        if (!userStored){
                            res.status(400).send({message: 'No se ha registrado'});
                        }else{
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            }else{
                res.status(200).send({message: 'Rellena todos los campos'});
            };
        });
    }else{
        res.status(500).send({message: 'Falta contraseña'});
    }
}
//inicio de sesión

function loginUser(req, res){
    var params = req.body;

    var email = params.email;
    var password = params.password;
    //console.log(params);
    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if (err){
            
            res.status(500).send({message: ' Error en la petición'});
        }else{
            if(!user){
                res.status(404).send({message: 'El usuario no existe'});
            }else{
                //comprobar contraseña
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        //devovler los datos del usuario
                        if (params.gethash){
                            //devolver un token jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user})
                        }
                    }else{
                        res.status(404).send({message: ' el usuario no ha podido logearse'});
                    }
                });
            }
        }
    });
}
//actualizar usuario

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar este usuario'});
    }

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err){
            res.status(500).send({message: 'Error al actualizar el usuario'});
        }else{
            if(!userUpdated){
                res.status(404).send({message: 'no se ha podido actualizar el usuario'});
            }else{
                res.status(200).send({user: userUpdated});
            }
        }
    });
}
//subir imagen de usuario
function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'No subido...';

    if (req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[ext_split.length-1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            User.findByIdAndUpdate(userId, {image: file_name}, (err,userUpdated) => {
                if(!userUpdated){
                    res.status(404).send({message: 'no se ha podido actualizar el usuario'});
                }else{
                    res.status(200).send({image: file_name, user: userUpdated});
                }
            })
        }else{
            res.status(200).send({message: 'Extensión incorrecta'});
        }

        //console.log(file_name);
    }else{
        res.status(200).send({message: 'No has subido ninguna imagen...'});
    }
}
//obtener imagen de usuario
function getImageFile(req,res){
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;
    //console.log(fs);
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe la imagen...'});
        }
    });
}
//permitir que elementos externos usen las funciones del controlador especificadas

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
}