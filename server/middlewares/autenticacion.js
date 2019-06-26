const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

// ----------------------------------
// Verificar token
// ----------------------------------

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        };

        req.usuario = decoded.usuario;
        next();

    });


};

// ----------------------------------
// Verificar AdminRole
// ----------------------------------
let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'No tiende derechos para realizar la operación'
            }
        });
    }

}

module.exports = {
    verificaToken,
    verificaAdminRole
}