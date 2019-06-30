const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;


let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: false,
        required: [true, 'El nombre es necesario']
    },
    usuario: {
        type: String,
        required: [true, 'El usuario es necesario']
    }
});

categoriaSchema.methods.toJSON = function() {

    let categoria = this;
    let categoriaObject = categoria.toObject();

    return categoriaObject;
};

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });



module.exports = mongoose.model('Categoria', categoriaSchema);