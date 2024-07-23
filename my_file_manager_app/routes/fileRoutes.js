// routes/fileRoutes.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fileController = require('../controllers/fileController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads')); // Uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  }
});
const upload = multer({ storage });

// Routes
router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/files/:id', fileController.getFile);
router.delete('/files/:id', fileController.deleteFile);

module.exports = router;
