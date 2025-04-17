const bcrypt = require('bcrypt');
const knex = require('../database/database');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        await knex('users').insert({ username, password_hash: hash });
        res.status(201).send();
    } catch (error) {
        res.status(400).json({ error: 'Registration failed' });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await knex('users').where({ username }).first();
    
    if (user && await bcrypt.compare(password, user.password_hash)) {
        req.session.userId = user.id;
        res.status(204).send();
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.status(204).send();
};