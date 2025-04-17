const express = require('express');
const db = require('../db/database');
const router = express.Router();

router.get('/', (req, res) => {
  db.all('SELECT * FROM files ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error retrieving files' });
    res.json(rows);
  });
});

module.exports = router;
