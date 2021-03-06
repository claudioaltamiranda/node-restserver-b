require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const mongoose = require('mongoose');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Habilitar el contenido estàtico en una carpeta
app.use(express.static(path.resolve(__dirname, '../public')));

app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {

        if (err) throw err;

        console.log('Base de datos ONLINE!');


    });



app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});