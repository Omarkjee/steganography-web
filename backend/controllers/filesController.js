const knex = require('../database/database');
const { embedMessage } = require('../utils/stegano');

exports.uploadFile = async (req, res) => {
    try {
        const { file, message, s, l, c } = req.body;
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const modifiedBuffer = embedMessage(fileBuffer, message, s, l, c);
        
        await knex('files').insert({
            user_id: req.session.userId,
            original_name: file.name,
            modified_file: modifiedBuffer,
            s, l, c
        });
        
        res.status(201).send();
    } catch (error) {
        res.status(400).json({ error: 'Upload failed' });
    }
};

exports.listFiles = async (req, res) => {
    const files = await knex('files').select('*');
    res.json(files);
};

exports.downloadFile = async (req, res) => {
    const file = await knex('files').where({ id: req.params.id }).first();
    res.set('Content-Disposition', `attachment; filename="${file.original_name}"`);
    res.send(file.modified_file);
};