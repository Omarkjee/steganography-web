const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../database/database');

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db('users').where({ username }).first();
    
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    req.session.userId = user.id;
    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Registration
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    
    await db('users').insert({ 
      username, 
      password_hash: hash 
    });
    
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Check auth status
router.get('/check', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json({ authenticated: true });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

module.exports = router;