const express = require('express');
const _ = require('underscore');

const Categoria = require('../models/categoria');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const app = express();

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({}, (err, cuantos) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    categorias,
                    cuantos
                });
            });

        });

});

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

});

app.post('/categoria', [verificaToken, verificaAdminRole], (req, res) => {

    let body = req.body;
    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });

});

app.put('/categoria/:id', [verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;
    let body = req.body; // _.pick(req.body, ['nombre', 'usuario']);

    let categoriaModificar = {
        nombre: body.nombre
    };

    Categoria.findByIdAndUpdate(id, categoriaModificar, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            usuario: categoriaDB
        });

    });

});

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;


    // Esto elimina físicamente el documento
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        // Eliminación lógica: estado: false
        // Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: categoriaBorrada
        });

    });
});

module.exports = app;