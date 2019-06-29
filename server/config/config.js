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

// ------------------------
// Vencimiento del token
// ------------------------
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || 60 * 60 * 24 * 30 * 1000;

// ------------------------
// SEED de autenticación
// ------------------------
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/repaso';
} else {
    urlDB = process.env.MONGO_URI;
};


process.env.URLDB = urlDB;

// ------------------------
// Google Client ID
// ------------------------

process.env.CLIENT_ID = process.env.CLIENT_ID || '701276152541-kkqabaj5cmiq0sc5ofcugahchr57fd8c.apps.googleusercontent.com';