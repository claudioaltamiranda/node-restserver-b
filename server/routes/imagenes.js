const express = require('express');
const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/autenticacion');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;


    let imagenPath = path.resolve(`uploads/${tipo}/${img}`);

    //console.log(imagenPath);

    if (fs.existsSync(imagenPath)) {
        res.sendFile(imagenPath);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/claudio.jpeg');
        res.sendFile(noImagePath);
    }


})


module.exports = app;