import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { initDB } from '../db/database.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const db = await initDB();
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);
    res.json({ message: 'User registered' });
  } catch {
    res.status(400).json({ message: 'User already exists' });
  }
});

router.post('/login', async (req, res) => {
  const db = await initDB();
  const { username, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id, username: user.username }, 'secret_key');
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

export default router;
