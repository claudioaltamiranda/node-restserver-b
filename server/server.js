require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/usuario', function(req, res) {
    res.json('Get Usuario');
});

app.post('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = req.body;

    if (!body.nombre) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    }
    res.json({
        persona: body
    });
});

app.put('/usuario', function(req, res) {
    res.json('put Usuario');
});

app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});

app.listen(3000, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});