require('dotenv').config();

module.exports = {
  development: {
    dialect: process.env.DB_DRIVER || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: +process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    logging: false,
  },
  production: {
    dialect: process.env.DB_DRIVER || 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
  },
};