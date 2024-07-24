const express = require('express');
const multer = require('multer');
const path = require('path');
const fileController = require('../controllers/fileController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Path to the uploads directory
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


// Route to upload a file
router.post('/upload', upload.single('file'), fileController.uploadFile);

// Route to get all files
router.get('/', fileController.getAllFiles);

// Route to get a file by ID
router.get('/:id', fileController.getFileById);

// Route to delete a file by ID
router.delete('/:id', fileController.deleteFile);

module.exports = router;
