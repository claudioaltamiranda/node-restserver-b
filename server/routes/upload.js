const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    // Valida tipo
    let tiposValidos = ['producto', 'usuario'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son producto y usuario',
                tipo
            }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se subieron archivos'
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son png, jpg, gif y jpeg'
            }
        })
    }


    // Cambiar nombre al archivo
    let nombreArchivoNuevo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivoNuevo}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        // Imagen ya està cargada
        imagenCargada(id, res, nombreArchivoNuevo, tipo);

    });

});


function imagenCargada(id, res, nombreArchivoNuevo, tipo) {

    let modelo;

    if (tipo === 'usuario') {
        modelo = Usuario;
    } else if (tipo === 'producto') {
        modelo = Producto;
    }

    modelo.findById(id, (err, registroDB) => {

        if (err) {
            borraArchivo(nombreArchivoNuevo, tipo);

            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!registroDB) {
            borraArchivo(nombreArchivoNuevo, tipo);

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El registro no existe'
                }
            });
        };

        borraArchivo(registroDB.img, tipo);

        registroDB.img = nombreArchivoNuevo;

        registroDB.save((err, registroGuardado) => {

            res.json({
                ok: true,
                registro: registroGuardado,
                img: nombreArchivoNuevo
            });


        });

    })
}


function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;