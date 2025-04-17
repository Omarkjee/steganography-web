const express = require('express');
const router = express.Router();
const filesController = require('../controllers/filesController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);
router.post('/', filesController.uploadFile);
router.get('/', filesController.listFiles);
router.get('/:id', filesController.downloadFile);

module.exports = router;