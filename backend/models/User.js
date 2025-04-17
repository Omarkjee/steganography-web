
const knex = require('../database/database');

module.exports = {
    create: async (username, passwordHash) => {
        return await knex('users').insert({
            username,
            password_hash: passwordHash
        });
    },

    findByUsername: async (username) => {
        return await knex('users').where({ username }).first();
    }
};