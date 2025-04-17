const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db/database');
const auth = require('../middleware/auth');
const { embedMessage } = require('../utils/stego');

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/embed', auth, upload.single('file'), (req, res) => {
  const { message, S, L, C } = req.body;
  const filePath = req.file.path;
  const outputPath = filePath.replace(/(\\|\/)([^/]+)$/, '$1mod_$2');

  embedMessage(filePath, message, parseInt(S), parseInt(L), C, outputPath, (err) => {
    if (err) return res.status(500).json({ message: 'Embedding failed' });

    db.run('INSERT INTO files (filename, uploader) VALUES (?, ?)', [outputPath, req.user.username]);
    res.json({ url: `/uploads/${path.basename(outputPath)}` });
  });
});

module.exports = router;
