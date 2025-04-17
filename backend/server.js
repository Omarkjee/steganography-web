require('dotenv').config();
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const knex = require('knex');
const fileUpload = require('express-fileupload');
const crypto = require('crypto');
const path = require('path');

// Database Configuration
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: process.env.DB_PATH || '/var/lib/render/stego.db'
  },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn, done) => {
      conn.run('PRAGMA foreign_keys = ON', done);
    }
  }
});

// Database Initialization
async function initDB() {
  try {
    // Create tables if they don't exist
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
  } catch (err) {
    console.error('Database initialization failed:', err);
    process.exit(1);
  }
}

// Express App Setup
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(fileUpload());

// Session Configuration
app.use(session({
  store: new SQLiteStore({
    dir: '/var/lib/render',
    db: 'sessions.db',
    concurrentDB: true
  }),
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
  }
}));

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = require('bcrypt').hashSync(password, 10);
    await db('users').insert({ username, password_hash: hash });
    res.status(201).send();
  } catch (err) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Add other routes here...

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Initialize and Start Server
async function startServer() {
  try {
    // Create database directory if it doesn't exist
    require('fs').mkdirSync('/var/lib/render', { recursive: true });
    
    await initDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Database path: ${process.env.DB_PATH || '/var/lib/render/stego.db'}`);
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
}

startServer();