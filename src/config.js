// Configuración central (variables de entorno con valores por defecto)
const path = require('path');
module.exports = {
  port: Number(process.env.PORT) || 3000,
  secret: process.env.SECRET || 'cambia-este-secreto',
  dbPath: process.env.DB_PATH || path.join(__dirname, '..', 'data.db')
};
