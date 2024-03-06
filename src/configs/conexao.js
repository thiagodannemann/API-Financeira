const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1234',
    database: 'dindin'
  }
});

module.exports = knex;