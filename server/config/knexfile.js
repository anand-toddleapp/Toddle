const knex = require('knex');

require('dotenv').config()
const config = {
    development: {
      client: 'pg',
      connection: {
        host: process.env.DB_HOST,
        user: "postgres",
        port: process.env.DB_PORT || '5432',
        password: "password",
        database: "bookingapp"
      },
      migrations: {
        directory: '../migrations'
      },
      seeds: {
        directory: '../seeds'
      }
    }
  };
  
  module.exports = knex(config.development);