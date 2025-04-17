
const knex = require('../database/database');

module.exports = {
    create: async (userId, originalName, modifiedFile, s, l, c) => {
        return await knex('files').insert({
            user_id: userId,
            original_name: originalName,
            modified_file: modifiedFile,
            s, l, c
        });
    },

    findAll: async () => {
        return await knex('files').select('*');
    },

    findById: async (id) => {
        return await knex('files').where({ id }).first();
    }
};