require('dotenv').config();
const express = require('express');
const session = require('express-session');
const knex = require('knex');
const crypto = require('crypto');
const fileUpload = require('express-fileupload');
const path = require('path');

// Initialize DB (auto-creates tables)
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: process.env.DB_PATH || './database/stego.db'
  },
  useNullAsDefault: true
});

// Auto-create tables
async function initDB() {
  if (!await db.schema.hasTable('users')) {
    await db.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username').unique().notNullable();
      table.text('password_hash').notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    console.log('Created users table');
  }

  if (!await db.schema.hasTable('files')) {
    await db.schema.createTable('files', (table) => {
      table.increments('id').primary();
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('original_name').notNullable();
      table.binary('modified_file').notNullable();
      table.integer('s').notNullable();
      table.integer('l').notNullable();
      table.integer('c').notNullable();
      table.timestamp('created_at').defaultTo(db.fn.now());
    });
    console.log('Created files table');
  }
}

const app = express();
app.use(express.json());
app.use(fileUpload());
app.use(session({
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Routes
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = require('bcrypt').hashSync(password, 10);
  try {
    await db('users').insert({ username, password_hash: hash });
    res.status(201).send();
  } catch (err) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

// ... (Add other routes similarly)

// Initialize and start
initDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(console.error);