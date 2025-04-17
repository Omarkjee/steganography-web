import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import { verifyToken } from '../middleware.js';
import { initDB } from '../db/database.js';

const router = express.Router();
router.use(fileUpload());

const embedMessage = (buffer, message, s, l, mode) => {
  const msgBits = [...Buffer.from(message)].flatMap(b => b.toString(2).padStart(8, '0'));
  let j = 0;
  let L = parseInt(l);

  for (let i = s; j < msgBits.length && i < buffer.length * 8; i += L) {
    const byteIndex = Math.floor(i / 8);
    const bitIndex = 7 - (i % 8);
    buffer[byteIndex] &= ~(1 << bitIndex);
    buffer[byteIndex] |= parseInt(msgBits[j++]) << bitIndex;

    if (mode === 'cycle') {
      L = [8, 16, 24][j % 3];
    }
  }

  return buffer;
};

router.post('/embed', verifyToken, async (req, res) => {
  const { s, l, c, message } = req.body;
  const file = req.files.file;

  const buffer = embedMessage(file.data, message, parseInt(s), parseInt(l), c);

  const filePath = `uploads/${Date.now()}_${file.name}`;
  fs.writeFileSync(filePath, buffer);

  const db = await initDB();
  await db.run('INSERT INTO posts (filename, originalname) VALUES (?, ?)', [filePath, file.name]);

  res.json({ message: 'File embedded and posted', file: filePath });
});

router.get('/posts', async (_, res) => {
  const db = await initDB();
  const posts = await db.all('SELECT * FROM posts ORDER BY uploadDate DESC');
  res.json(posts);
});

router.get('/file/:name', (req, res) => {
  res.sendFile(path.resolve(`uploads/${req.params.name}`));
});

export default router;
