// ========================================
// Producto
// ========================================
const express = require('express');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// ========================================
// Obtener productos
// ========================================
app.get('/producto', verificaToken, (req, res) => {
    // trae todos los productos 
    // populate: usuario categoria
    // paginado

    let desde = Number(req.query.desde || 0);

    Producto.find({ disponible: true })
        .sort('nombre')
        .skip(desde)
        .limit(5)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({}, (err, cuantos) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    productos,
                    cuantos
                });
            });

        });
});

// ========================================
// Obtener un producto por ID
// ========================================
app.get('/producto/:id', verificaToken, (req, res) => {
    // populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe el ID'
                    }
                });
            };

            res.json({
                ok: true,
                producto: productoDB
            })

        })
});

// ========================================
// Buscar productos
// ========================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                productos
            });

        });





});


// ========================================
// Crear un producto
// ========================================
app.post('/producto', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: body.usuario
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });
});

// ========================================
// Actualizar un producto
// ========================================
app.put('/producto/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;

    let productoModificar = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        categoria: body.categoria,
        disponible: body.disponible,
        usuario: body.usuario
    };

    Producto.findByIdAndUpdate(id, productoModificar, { new: true, runValidators: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe'
                    }
                });
            };

            res.json({
                ok: true,
                producto: productoDB
            });

        });
});

// ========================================
// Borrar un producto
// ========================================
app.delete('/producto/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado

    let id = req.params.id;

    // Esto elimina físicamente el documento
    // Producto.findByIdAndRemove(id, (err, productoBorrado) => {

    // Eliminación lógica: estado: false
    let body = req.body;
    let estadoAnterior = body.disponible;
    body.disponible = false;

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado || !estadoAnterior) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado
        });

    });

});

module.exports = app;