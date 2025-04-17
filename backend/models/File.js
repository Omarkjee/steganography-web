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

    findByUser: async (userId) => {
        return await knex('files').where({ user_id: userId });
    },

    findById: async (id) => {
        return await knex('files').where({ id }).first();
    },

    delete: async (id) => {
        return await knex('files').where({ id }).del();
    }
};