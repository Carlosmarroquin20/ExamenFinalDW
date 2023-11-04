// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

const config = {
    server: process.env.SQL_SERVER,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    options: {
        trustServerCertificate: true
    }
}

module.exports.config = config;
