
const express = require('express');

//1) para guardar usuario en la BD agregar el modelo
const Usuario = require('../models/usuario');
const { verificaToken } = require('../middlewares/autenticacion');

const bcrypt = require('bcrypt');

// libreria underscore para validacion
const _ = require('underscore');

const app = express();

app.get('/usuario', verificaToken, (req, res) => {
  
    // para enviar para metros en la url desde que pagina quieres mostrar los registros
    let desde = req.query.desde || 0;
    desde = Number(desde);
    // limite para mostrar por pagina
    let limite = req.query.limite || 5;
    limite = Number (limite);
    // en fin yo puedo excluir algunos campos en esta ocasion voy pedir que solo me envie el nombre y el email
    Usuario.find({estado:true}, "nombre email role estado google")
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {

        if(err){
            return res.status(400).json({
                 ok:false,
                 err
             });
         }
         //para saber cuanto registros tengo y puedo consultar
         Usuario.count({estado:true}, (err,conteo)=>{
            res.json({
                ok:true,
                usuarios,
                cuantos:conteo
   
            })
         });
        
         

    })
   
});

app.post('/usuario',verificaToken,  (req, res) => {

    let body = req.body;

    //2) creo una nueva instancia del nuevo esquema de mongoose 
    // y puedo agregar todos los parametros que yo deseo
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    //3) guardar el usuario callback
    usuario.save((err,usuarioDB) => {
        if(err){
           return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            usuario:usuarioDB
        });
    });


});

app.put('/usuario/:id',verificaToken, function(req, res) {

    let id = req.params.id;
    // de la libreria underscore esta funcion pick que es para validar solo los campos q queremos q pueda actualizar el usuario
    let body = _.pick(req.body,['nombre','email', 'img', 'role', 'estado']);


// en moongose se pueden enviar varios para metros dependiendo de lo que necesites
// ejemplo el {new:true} te regresa el objeto actualizado y runValidators es para hacer validaciones de los campos
    Usuario.findByIdAndUpdate(id, body,{new:true, runValidators:true}, (err,usuarioDB)=>{

        if(err){
            return res.status(400).json({
                 ok:false,
                 err
             });
         }
        res.json({
            ok:true,
            usuario:usuarioDB
        });

    });

    
});

app.delete('/usuario/:id',verificaToken, function(req, res) {
   let id = req.params.id;

    Usuario.findByIdAndUpdate(id,{estado:false},{new:true}, (err,usuarioBorrado)=> {
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        if(!usuarioBorrado){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Usuario no encontrado'
                }
            }); 
        }

        res.json({
            ok:true,
            usuario:usuarioBorrado
        });
    });
});

module.exports = app;