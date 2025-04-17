const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: process.env.DB_PATH || './database/stego.db'
    },
    useNullAsDefault: true
});

module.exports = knex;