// Archivo de configuraciones de la aplicación

// ------------------------
// entorno
// ------------------------
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ------------------------
// Puerto
// ------------------------
process.env.PORT = process.env.PORT || 3000;

// ------------------------
// Cadena de conexión
// ------------------------

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/repaso';
} else {
    urlDB = 'mongodb+srv://camellocorto:l12asup@cluster0-u37ql.mongodb.net/repaso'
};


process.env.URLDB = urlDB;