// configuracion de puerto
require('./config/config');
// ::::::::::: REQUIRE ::::::::::::::::
const express = require('express');
//base de datos mongo
const mongoose = require('mongoose');
// ::::::::::::::::::::::::::::::::::::::::::
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Config global de RUTAS
app.use(require('./routes/index'));




 mongoose.connect(process.env.URLDB, 
        {
          useNewUrlParser: true, 
          useCreateIndex:true,
          useUnifiedTopology: true
        },
        (err,res) => {
          if(err) throw err;

          console.log('Base de datos ONLINE');
 
});
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});